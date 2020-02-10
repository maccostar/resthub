<template>
  <div class="card-container">
    <div class="api-items-left">
      <div class="api-title">
        <div class="logo">
          <img :src="api.icon" alt="" />
        </div>
        <div class="apiname">{{ api.service }}</div>
      </div>
      <div class="api-discription">
        {{ api.discription }}
      </div>
      <div class="api-category">
        <span v-for="category in api.category" :key="category">
          {{ category }}
        </span>
      </div>
      <div class="api-details">
        <div class="owner">{{ api.owner }}</div>
        <div class="updated">updated: {{ api.updated }}</div>
      </div>
    </div>
    <div class="api-items-right">
      <!-- {{ api.numberof downloads }} -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Api } from '~/apis/apilist.json'

@Component({})
export default class extends Vue {
  @Prop({ type: Object, required: true }) api!: Api
}
</script>

<style scoped>
.card-container {
  display: flex;
  padding: 20px;
  font-size: 11pt;
  border: thin solid #c0c0c0;
  border-bottom: 0;
}

.api-title {
  display: flex;
  align-items: flex-end;
  justify-content: left;
  margin-bottom: 10px;
  font-size: 16pt;
}

.api-title > .logo {
  width: 35px;
  height: 35px;
  margin-right: 10px;
  text-align: right;
  background: #fff;
}

.api-title > .logo > img {
  width: 100%;
  height: auto;
  vertical-align: middle;
  border-radius: 5px;
}

.api-discription {
  margin-bottom: 10px;
}

.api-category {
  margin-bottom: 10px;
}

.api-category > span {
  padding: 2px 8px;
  margin-right: 5px;
  font-size: 9pt;
  color: #fff;
  background-color: #628bdd;
  border-radius: 4px;
}

.api-details {
  display: flex;
  align-items: flex-end;
}

.api-details > div {
  margin-right: 20px;
}

.api-details .owner {
  font-size: 12pt;
}
</style>
