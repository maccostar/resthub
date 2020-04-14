<template>
  <div class="search-container">
    <side-bar :categories="uniqueCategories" @input="setFilterItems" />
    <div class="contents-area">
      <search-bar
        :apilist="filterdApiList"
        :initialize-api-list="initializeApiList"
        :search-apis="searchApis"
      />
      <div class="search-result-header">
        <div class="number-of-hits">
          <span>{{ filterdApiList.length }}</span> apis found
        </div>
        <div class="pagination-wrapper">
          <Pagination
            :num="filterdApiList.length"
            :page="pageNumber"
            @input="onReceivePage"
          />
        </div>
      </div>
      <div class="search-result-body">
        <div
          v-for="(api, index) in paginationList"
          :key="index"
          class="card-wrapper"
        >
          <nuxt-link
            class="link"
            :to="`/apiService/?apiServiceId=${api.apiServiceId}`"
          >
            <Card :api="api" />
          </nuxt-link>
        </div>
      </div>
      <Pagination
        :num="filterdApiList.length"
        :page="pageNumber"
        @input="onReceivePage"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Api } from '~/apis/apilist.json'
import Pagination from '~/components/pages/index/Pagination.vue'
import Card from '~/components/pages/index/Card.vue'
import SideBar from '~/components/pages/index/SideBar.vue'
import SearchBar from '~/components/pages/index/SearchBar.vue'

const PAGE_ITEM_NUMBER = 10

@Component({
  components: { Pagination, Card, SideBar, SearchBar },
  async asyncData() {
    return {
      apilist: await $nuxt.$api.apilist_json.$get()
    }
  }
})
export default class extends Vue {
  apilist: Api[] = []
  pageNumber = 1
  searchedApilist: Api[] = []
  filterItems: string[] = []

  get uniqueCategories() {
    return Object.entries(
      this.searchedApilist.reduce((counter: Record<string, number>, api) => {
        if (!api.category.length) {
          return counter
        }
        api.category.forEach((c) => {
          c in counter ? (counter[c] += 1) : (counter[c] = 1)
        })
        return counter
      }, {})
    ).sort((a, b) => (a[0].toLowerCase() < b[0].toLowerCase() ? -1 : 1))
  }

  get paginationList() {
    return this.filterdApiList.slice(
      PAGE_ITEM_NUMBER * this.pageNumber - PAGE_ITEM_NUMBER,
      PAGE_ITEM_NUMBER * this.pageNumber
    )
  }

  get filterdApiList() {
    return this.filterItems.length
      ? this.searchedApilist.filter((api) =>
          api.category.some((cate) => this.filterItems.includes(cate))
        )
      : this.searchedApilist
  }

  created() {
    this.initializeApiList()
  }

  onReceivePage(page: number) {
    this.pageNumber = page
    this.$vuetify.goTo(0)
  }

  initializeApiList() {
    this.searchedApilist = this.apilist
    this.pageNumber = 1
  }

  searchApis(i: Api[]) {
    this.searchedApilist = i
    this.pageNumber = 1
  }

  setFilterItems(i: string[]) {
    this.filterItems = i
    this.pageNumber = 1
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.pagination-wrapper {
  width: 100%;
  max-width: 400px;
}

.number-of-hits {
  font-size: 13pt;
  font-weight: 500;
}

.number-of-hits > span {
  margin-right: 3px;
  font-size: 16pt;
}

.search-result-header .v-pagination {
  justify-content: flex-end;
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
