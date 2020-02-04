<template>
  <div class="search-container">
    <side-bar :apilist="apilist" />
    <div class="contents-area">
      <v-text-field
        label="Please enter keywords to search APIs"
        prepend-inner-icon="mdi-magnify"
        single-line
        outlined
        dense
      />
      <div class="search-result-header">
        <div class="number-of-hits"><span>345</span> apis found</div>
        <Pagination :num="apilist.length" @input="onReceivePage" />
      </div>
      <div class="search-result-body">
        <div
          v-for="(api, index) in apilist.slice(
            pageItemNumber * pageNumber - pageItemNumber,
            pageItemNumber * pageNumber
          )"
          :key="index"
          class="card-wrapper"
        >
          <Card :api="api" />
        </div>
      </div>
      <Pagination :num="apilist.length" @input="onReceivePage" />
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
  apilist: Api[] = []
  pageItemNumber: Number = 11
  pageNumber: Number = 1

  get uniqueCategories() {
    return this.apilist
      .map((api) => api.category)
      .flat()
      .filter((element, index, array) => array.indexOf(element) === index)
  }

  onReceivePage(page: number) {
    this.pageNumber = page
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

/* atoms */
</style>
