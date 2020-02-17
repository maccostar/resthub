<template>
  <div class="api-container">
    <div class="api-title">
      <h5 v-if="flatPathsObj.method" :class="[flatPathsObj.method, 'method']">
        <p style="color: #fff;">{{ flatPathsObj.method }}</p>
      </h5>
      <h4 class="api-path">
        <p>{{ flatPathsObj.path }}</p>
      </h4>
      <p v-if="existsKey(flatPathsObj.opeObj, 'summary')" class="summary">
        {{ flatPathsObj.opeObj.summary }}
      </p>
    </div>
    <div class="api-detail">
      <div
        v-if="existsKey(flatPathsObj.opeObj, 'description')"
        class="description"
      >
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="$md.render(flatPathsObj.opeObj.description)" />
      </div>
      <div v-if="existsKey(flatPathsObj.opeObj, 'parameters')">
        <h6>Parameters</h6>
        <api-parameters :parameters="flatPathsObj.opeObj.parameters" />
      </div>
      <div v-if="existsKey(flatPathsObj.opeObj, 'requestBody')">
        <h6>RequestBody</h6>
      </div>
      <div v-if="existsKey(flatPathsObj.opeObj, 'responses')">
        <h6>Responses</h6>
      </div>
    </div>
  </div>
</template>

<script>
import ApiParameters from '~/components/ApiParameters.vue'

// This script don't use TypeScript temporarily.
export default {
  components: {
    ApiParameters
  },
  props: {
    flatPathsObj: {
      type: Object,
      required: true
    }
  },
  methods: {
    existsKey: (obj, key) => {
      return Object.keys(obj).includes(key)
    },
    isString: (obj) => {
      return obj === 'string'
    },
    isBoolean: (obj) => {
      return obj === 'boolean'
    },
    hasEnum: (obj) => {
      return Object.keys(obj).includes('enum')
    }
  }
}
</script>

<style scoped>
.api-container {
  margin-top: -1px;
  font-size: 11pt;
  color: #646464;
  border: thin solid #c0c0c0;
}
.api-title {
  display: grid;
  grid-template-columns: 50px 1fr 1fr;
  align-items: center;
  padding: 5px 20px;
  border-bottom: thin solid #c0c0c0;
}
.api-detail {
  padding: 5px 20px;
}
.method {
  grid-column: 1/2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 20px;
  border-radius: 5px;
}
.api-path {
  grid-column: 2/3;
  padding: 2px;
  line-height: 100%;
}
.summary {
  grid-column: 3/4;
}
.get {
  background-color: #5c81ff;
}
.post {
  background-color: #5bc45b;
}
.put {
  background-color: #ff9c38;
}
.delete {
  background-color: #ffadad;
}
table {
  font-size: 13px;
  table-layout: fixed;
}
p {
  margin: 0;
}
h4 {
  font-size: 16px;
}
h5 {
  font-size: 16px;
}
h6 {
  font-size: 14px;
}
</style>
