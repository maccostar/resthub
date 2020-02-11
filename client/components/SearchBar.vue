<template>
  <div>
    <v-text-field
      v-model="keyword"
      label="Please enter keywords to search APIs"
      placeholder="service: owner:"
      prepend-inner-icon="mdi-magnify"
      single-line
      outlined
      dense
      @blur="search"
      @keyup.enter="search"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Api } from '~/apis/apilist.json'

@Component({})
export default class extends Vue {
  @Prop({ type: Array, required: true }) apilist!: Api[]
  @Prop({ type: Function, required: true }) initializeApiList!: Function
  @Prop({ type: Function, required: true }) searchApis!: Function

  keyword = ''
  searchedApilist: Api[] = []

  async search() {
    const searchKey = ['service:', 'owner:']
    const searchWords = { service: '', owner: '', other: '' }
    const serviceHead = this.keyword.indexOf(searchKey[0])
    const ownerHead = this.keyword.indexOf(searchKey[1])
    const wordLength = this.keyword.length

    await this.initializeApiList()

    if (wordLength === 0) {
      return
    }

    if (serviceHead === -1 && ownerHead === -1) {
      searchWords.other = this.pickWord(0, wordLength)
    }
    if (serviceHead !== -1) {
      searchWords.service = this.pickWord(
        serviceHead + searchKey[0].length,
        ownerHead === -1
          ? wordLength
          : serviceHead > ownerHead
          ? wordLength
          : ownerHead
      )
    }
    if (ownerHead !== -1) {
      searchWords.owner = this.pickWord(
        ownerHead + searchKey[1].length,
        serviceHead === -1
          ? wordLength
          : serviceHead > ownerHead
          ? serviceHead
          : wordLength
      )
    }

    this.searchedApilist = this.apilist.filter((i) => {
      if (
        searchWords.other
          ? i.service.match(RegExp(searchWords.other, 'i')) ||
            i.owner.match(RegExp(searchWords.other, 'i'))
          : i.service.match(RegExp(searchWords.service, 'i')) &&
            i.owner.match(RegExp(searchWords.owner, 'i'))
      )
        return i
    })

    this.searchApis(this.searchedApilist)
  }

  get pickWord() {
    return (start: number, end: number) =>
      this.keyword.substring(start, end).trim()
  }
}
</script>
