<template>
  <div>
    <v-text-field
      v-model="keyword"
      label="Please enter keywords to search APIs"
      placeholder="title: baseURL:"
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
    const searchKey = ['title:', 'baseURL:']
    const searchWords = { title: '', baseURL: '', other: '' }
    const titleHead = this.keyword.indexOf(searchKey[0])
    const baseUrlHead = this.keyword.indexOf(searchKey[1])
    const wordLength = this.keyword.length
    await this.initializeApiList()
    if (wordLength === 0) {
      return
    }
    if (titleHead === -1 && baseUrlHead === -1) {
      searchWords.other = this.pickWord(0, wordLength)
    }
    if (titleHead !== -1) {
      searchWords.title = this.pickWord(
        titleHead + searchKey[0].length,
        baseUrlHead === -1
          ? wordLength
          : baseUrlHead < titleHead
          ? wordLength
          : baseUrlHead
      )
    }
    if (baseUrlHead !== -1) {
      searchWords.baseURL = this.pickWord(
        baseUrlHead + searchKey[1].length,
        titleHead === -1
          ? wordLength
          : titleHead < baseUrlHead
          ? wordLength
          : titleHead
      )
    }
    this.searchedApilist = this.apilist.filter((i) => {
      const jointUrls: string = i.baseURL
        .map((e) => ('url' in e ? e.url : ''))
        .join('')
      // console.log(jointUrls)
      if (
        searchWords.other
          ? i.title.match(RegExp(searchWords.other, 'i')) ||
            jointUrls.match(RegExp(searchWords.other, 'i'))
          : i.title.match(RegExp(searchWords.title, 'i')) &&
            jointUrls.match(RegExp(searchWords.baseURL, 'i'))
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
