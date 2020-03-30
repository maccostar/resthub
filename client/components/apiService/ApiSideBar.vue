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
      <v-list-group prepend-icon="">
        <template v-slot:activator>
          <v-list-item-title>Info</v-list-item-title>
        </template>
      </v-list-group>
      <v-list-group prepend-icon="">
        <template v-slot:activator>
          <v-list-item-title>Tags</v-list-item-title>
        </template>
      </v-list-group>
      <v-list-group prepend-icon="">
        <template v-slot:activator>
          <v-list-item-title>Servers</v-list-item-title>
        </template>
      </v-list-group>
      <v-list-group prepend-icon="">
        <template v-slot:activator>
          <v-list-item-title>Paths</v-list-item-title>
        </template>
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
          <v-list-item
            v-for="(flatPathsObj, idx) in group.arrOfFlatPathsObj"
            :key="idx"
            link
            class="pointpo pl-3"
            :href="`#${gIndex}_${idx}`"
          >
            <div class="endpoint">
              <div :class="`method ${flatPathsObj.method}`">
                {{ flatPathsObj.method }}
              </div>
              <div class="text--darken-1-grey">{{ flatPathsObj.path }}</div>
            </div>
          </v-list-item>
        </v-list-group>
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
  width: 250px;
  height: calc(100% - 65px);
  overflow: scroll;
  color: #646464;
  background: #fff;
  border-right: thin solid #c0c0c0;
}
.search-bar {
  margin: 20px 20px 0;
}
.endpoint {
  display: flex;
  margin-bottom: 0;
  margin-left: 20px;
  font-size: 0.8125rem;
  white-space: nowrap;
}
.method {
  width: 35px;
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
</style>
