<template>
  <div class="search-container">
    <side-bar :apilist="apilist" />
    <div class="contents-area">
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
      <div class="search-result-header">
        <div class="number-of-hits">
          <span>{{ searchedApilist.length }}</span> apis found
        </div>
        <Pagination />
      </div>
      <div class="search-result-body">
        <div
          v-for="(api, index) in searchedApilist"
          :key="index"
          class="card-wrapper"
        >
          <nuxt-link
            class="link"
            :to="`/apiService?apiServiceId=${api.apiServiceId}`"
          >
            <Card :api="api" />
          </nuxt-link>
        </div>
      </div>
      <Pagination />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Api } from '~/apis/apilist.json'
import Pagination from '~/components/Pagination.vue'
import Card from '~/components/Card.vue'
import SideBar from '~/components/SideBar.vue'

@Component({
  components: { Pagination, Card, SideBar },
  async asyncData() {
    return {
      apilist: await $nuxt.$api.apilist_json.$get()
    }
  }
})
export default class extends Vue {
  keyword = ''
  apilist: Api[] = []
  searchedApilist: Api[] = []

  get uniqueCategories() {
    return this.apilist
      .map((api) => api.category)
      .flat()
      .filter((element, index, array) => array.indexOf(element) === index)
  }

  created() {
    this.initializeApiList()
  }

  search() {
    const searchKey = ['service:', 'owner:']
    const searchWords = { service: '', owner: '', other: '' }
    const serviceHead = this.keyword.indexOf(searchKey[0])
    const ownerHead = this.keyword.indexOf(searchKey[1])
    const serviceWordHead = serviceHead + searchKey[0].length
    const ownerWordHead = ownerHead + searchKey[1].length
    const end = this.keyword.length
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

    this.initializeApiList()
    this.searchedApilist = this.searchedApilist.filter((i) => {
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
  }

  get pickWord() {
    return (start: number, end: number) =>
      this.keyword.substring(start, end).trim()
  }

  initializeApiList() {
    this.searchedApilist = this.apilist
  }
}
</script>

<style scoped>
.search-container {
  /* Caution: `min-height: 100vh` does not work in IE 11 */
  color: #646464;
  text-align: left;
  background: #fff;
}

.contents-area {
  padding: 30px;
  margin: 65px 0 60px 200px;
}

.search-result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.number-of-hits {
  font-size: 13pt;
  font-weight: 500;
}

.number-of-hits > span {
  margin-right: 3px;
  font-size: 16pt;
}

.search-result-body {
  margin-bottom: 30px;
  box-shadow: 0 2px 5px #c0c0c0;
}

.card-wrapper:nth-child(even) {
  background-color: #f7f7f7;
}

.link {
  width: 100%;
  height: 100%;
  color: #646464;
  text-decoration: none;
}

/* atoms */
</style>
