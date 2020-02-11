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
    const serviceWordHead = serviceHead + searchKey[0].length
    const ownerWordHead = ownerHead + searchKey[1].length
    const end = this.keyword.length

    await this.initializeApiList()

    if (end === 0) {
      return
    }

    if (serviceHead > -1 && ownerHead > -1) {
      if (serviceHead > ownerHead) {
        searchWords.service = this.pickWord(serviceWordHead, end)
        searchWords.owner = this.pickWord(ownerWordHead, serviceHead)
      } else {
        searchWords.owner = this.pickWord(ownerWordHead, end)
        searchWords.service = this.pickWord(serviceWordHead, ownerHead)
      }
    } else if (serviceHead > -1) {
      searchWords.service = this.pickWord(serviceWordHead, end)
    } else if (ownerHead > -1) {
      searchWords.owner = this.pickWord(ownerWordHead, end)
    } else {
      searchWords.other = this.pickWord(0, end)
    }

    this.searchedApilist = this.apilist.filter((i) => {
      if (
        (i.service.match(RegExp(searchWords.other, 'i')) ||
          i.owner.match(RegExp(searchWords.other, 'i'))) &&
        searchWords.other
      )
        return i
      if (
        i.service.match(RegExp(searchWords.service, 'i')) &&
        i.owner.match(RegExp(searchWords.owner, 'i')) &&
        !searchWords.other
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
