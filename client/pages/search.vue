<template>
  <div class="search-container">
    <side-bar :apilist="apilist" />
    <div class="contents-area">
      <search-bar
        :apilist="searchedApilist"
        :initialize-api-list="initializeApiList"
        :search-apis="searchApis"
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
import SearchBar from '~/components/SearchBar.vue'

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
  searchedApilist: Api[] = []

  get uniqueCategories() {
    return this.searchedApilist
      .flatMap((api) => api.category)
      .filter((element, index, array) => array.indexOf(element) === index)
  }

  created() {
    this.initializeApiList()
  }

  initializeApiList() {
    this.searchedApilist = this.apilist
  }

  searchApis(i: Api[]) {
    this.searchedApilist = i
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
