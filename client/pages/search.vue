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
        <Pagination
          :num="filterdApiList.length"
          :page="pageNumber"
          @input="onReceivePage"
        />
      </div>
      <div class="search-result-body">
        <div
          v-for="(api, index) in paginationList"
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
import Pagination from '~/components/Pagination.vue'
import Card from '~/components/Card.vue'
import SideBar from '~/components/SideBar.vue'
import SearchBar from '~/components/SearchBar.vue'

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
    type category = {
      name: string
      number: number
    }
    const categorieList: string[] = this.searchedApilist
      .flatMap((api) => api.category)
      .filter((element, index, array) => array.indexOf(element) === index)

    const uniqueCategories: category[] = categorieList.map((category) => {
      return {
        name: category,
        number: this.searchedApilist.filter((e) =>
          e.category.includes(category)
        ).length
      }
    })
    return uniqueCategories
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
          api.category.some((cate) =>
            this.filterItems.some((item) => item === cate)
          )
        )
      : this.searchedApilist
  }

  created() {
    this.initializeApiList()
  }

  onReceivePage(page: number) {
    this.pageNumber = page
  }

  initializeApiList() {
    this.searchedApilist = this.apilist
  }

  searchApis(i: Api[]) {
    this.searchedApilist = i
  }

  setFilterItems(i: string[]) {
    this.filterItems = i
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
