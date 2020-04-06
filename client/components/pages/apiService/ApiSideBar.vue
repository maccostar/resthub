<template>
  <div class="api-side-bar">
    <v-text-field
      label="Keywords"
      class="search-bar"
      prepend-inner-icon="mdi-magnify"
      single-line
      outlined
      dense
    />
    <v-list dense>
      <v-list-item>
        <v-list-item-title>Info</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Tags</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Servers</v-list-item-title>
      </v-list-item>
      <v-list-item>
        <v-list-item-title>Paths</v-list-item-title>
      </v-list-item>
      <v-list-group
        v-for="(group, gIndex) in flatPathsObjGroups"
        :key="gIndex"
        no-action
        sub-group
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>{{ group.tag }}</v-list-item-title>
          </v-list-item-content>
        </template>
        <div class="endpoint-wrapper">
          <v-list-item
            v-for="(flatPathsObj, idx) in group.arrOfFlatPathsObj"
            :key="idx"
            class="pl-3 endpoint-anker"
            :href="`#${gIndex}_${idx}`"
          >
            <span :class="`action-name ${flatPathsObj.method}`">
              {{ flatPathsObj.method }}
            </span>
            <span class="text--darken-1-grey" :name="flatPathsObj.path">
              {{ flatPathsObj.path }}
            </span>
          </v-list-item>
        </div>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
export default {
  props: {
    flatPathsObjGroups: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.api-side-bar {
  position: fixed;
  top: 65px;
  left: 0;
  z-index: 1;
  width: 300px;
  height: calc(100% - 65px);
  overflow-y: scroll;
  color: #646464;
  background: #fff;
  border-right: thin solid #c0c0c0;
}
.search-bar {
  margin: 20px 20px 0;
}
.endpoint-wrapper {
  width: 100%;
  overflow-x: scroll;
}
.endpoint-anker {
  display: inline-block;
  min-width: 100%;
  min-height: 35px;
  font-size: 0.8125rem;
  white-space: nowrap;
}
.endpoint-anker > span {
  vertical-align: -webkit-baseline-middle;
}
.action-name {
  display: inline-block;
  min-width: 35px;
  margin-left: 20px;
}
.get {
  color: #5c81ff;
}
.post {
  color: #5bc45b;
}
.put {
  color: #ff9c38;
}
.delete {
  color: #ffadad;
}
.patch {
  color: #a956f6;
}
</style>
