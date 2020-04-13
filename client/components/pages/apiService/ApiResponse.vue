<template>
  <div>
    <v-select
      v-model="selectedMediaType"
      :items="mediaTypeObjects"
      item-text="mediaType"
      item-value="mediaTypeObject"
      outlined
      dense
      return-object
    />
    <!-- mediaTypeObjectレイヤーのexample(s)は今時点では取り扱わない -->
    <p>Schema</p>
    <schema-obj :schema-obj="selectedSchemaObj" />
  </div>
</template>
<script>
import SchemaObj from '~/components/pages/apiService/SchemaObj.vue'

export default {
  components: {
    SchemaObj
  },
  props: {
    statusCode: {
      type: String,
      required: true
    },
    responseObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedMediaType: {}
    }
  },
  computed: {
    mediaTypeObjects() {
      return Object.entries(this.responseObj.content).map((e) => {
        return { mediaType: e[0], mediaTypeObj: e[1] }
      })
    },
    selectedSchemaObj() {
      const hasSchemaObj = (obj) => {
        return 'schema' in obj ? obj.schema : {}
      }
      return 'mediaTypeObj' in this.selectedMediaType
        ? hasSchemaObj(this.selectedMediaType.mediaTypeObj)
        : {}
    }
  },
  mounted() {
    this.selectedMediaType = this.mediaTypeObjects[0]
  }
}
</script>
<style scoped>
p {
  margin: 0;
}
</style>
