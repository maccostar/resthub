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
    ></v-select>
    <!-- mediaTypeObjectレイヤーのexample(s)は今時点では取り扱わない -->
    <p>Schema</p>
    <schema-obj :schema-obj="selectedSchemaObj" />
  </div>
</template>
<script>
import SchemaObj from '~/components/SchemaObj.vue'

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
      const mediaTypeObjects = Object.entries(this.responseObj.content).map(
        (e) => {
          return { mediaType: e[0], mediaTypeObj: e[1] }
        }
      )
      return mediaTypeObjects
    },
    selectedSchemaObj() {
      const hasSchemaObj = (obj) => {
        return 'schema' in obj ? obj.schema : {}
      }
      const schemaObj =
        'mediaTypeObj' in this.selectedMediaType
          ? hasSchemaObj(this.selectedMediaType.mediaTypeObj)
          : {}
      return schemaObj
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
