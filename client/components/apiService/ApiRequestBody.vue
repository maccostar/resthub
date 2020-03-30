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
    <table style="width: 100%;">
      <tbody>
        <tr>
          <td style="width: 100%">
            <schema-obj :schema-obj="selectedSchemaObj" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
import schemaObj from '~/components/apiService/SchemaObj.vue'
export default {
  components: {
    schemaObj
  },
  props: {
    requestBody: {
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
      const mediaTypeObjects = Object.entries(this.requestBody.content).map(
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
