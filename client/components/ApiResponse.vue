<template>
  <div>
    <v-select
      v-model="selectedMediaType"
      :items="mediaTypeObjects"
      item-text="mediaType"
      item-value="mediaTypeObject"
      dense
      outlined
    ></v-select>
    {{ selectedMediaType.mediaTypeObj }}
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
      selectedMediaType: {},
      selectedSchemaObj: {}
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
    }
  },
  mounted() {
    this.selectedMediaType = this.mediaTypeObjects[0]
    this.selectedSchemaObj = this.selectedMediaType.mediaTypeObj.schema
  }
  // beforeUpdate() {},
  // methods: {
  //   getPropFromTypeArray(obj) {
  //     const required = 'required' in obj ? obj.items.required : []
  //     const properties = Object.entries(obj.items.properties).map((e) => {
  //       return {
  //         propertyName: e[0],
  //         required: required.includes(e[0]),
  //         propertyObj: e[1]
  //       }
  //     })
  //     return properties
  //   },
  //   getFromTypeObj(obj) {
  //     const required = 'required' in obj ? obj.required : []
  //     const properties = Object.entries(obj.properties).map((e) => {
  //       return {
  //         propertyName: e[0],
  //         required: required.includes(e[0]),
  //         // objectだった際に再帰的にする必要有
  //         propertyObj:
  //           e[1].type === 'array' ? this.getPropFromTypeArray(e[1]) : e[1]
  //       }
  //     })
  //     return properties
  //   },
  //   setSchemaObj() {
  //     const schemaObj = this.selectedMediaType.mediaTypeObj.schema
  //     return schemaObj
  //   }
  // }
}
</script>
