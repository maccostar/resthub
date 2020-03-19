<template>
  <div class="parameters-container">
    <table style="width: 100%;">
      <tr>
        <th style="width: 30%;">Name</th>
        <th style="width: 20%;">Type</th>
        <th style="width: 50%;">Description</th>
      </tr>
      <tr v-for="(parameter, index) in parameters" :key="index">
        <td>
          <p>{{ parameter.name }}</p>
          <p>({{ parameter.in }})</p>
          <span
            v-if="parameter.required"
            style="margin: 0; font-size: 10px; color: #f00;"
          >
            *requierd
          </span>
        </td>
        <td>
          <p>{{ parameter.schema.type }}</p>
        </td>
        <td>
          <v-text-field
            v-if="isString(parameter.schema.type) && !hasEnum(parameter.schema)"
            outlined
            dense
          />
          <div
            v-if="isString(parameter.schema.type) && hasEnum(parameter.schema)"
          >
            <v-select :items="parameter.schema.enum" outlined dense />
          </div>
          <div v-if="isBoolean(parameter.schema.type)">
            <v-select :items="[true, false]" dense outlined />
          </div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    parameters: {
      type: Array,
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
.parameters-container {
  font-size: 11pt;
  color: #646464;
}
table {
  font-size: 13px;
  table-layout: fixed;
}
p {
  margin: 0;
}
</style>
