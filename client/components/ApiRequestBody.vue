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
    <table style="width: 100%;">
      <tbody>
        <tr>
          <td style="width: 50%">
            <schema-obj :schema-obj="selectedSchemaObj" />
          </td>
          <td style="width: 50%">
            <p>import aspida from "@aspida/axios"</p>
            <p>import api from "@api-types/tchop"</p>
            <br />
            <p>;(async () => {</p>
            <!-- const userId = 0
              const limit = 10
              const client = api(aspida())

              await client.api.v3.$2fa.$post({
                headers: { x-tchop-app-id : test},
                data: { email: test}
            })
            {{ arrPath }}
 -->
            <p>{{ parameters }}</p>
          </td>
        </tr>
      </tbody>
    </table>
    <p>Schema</p>
  </div>
</template>
<script>
import schemaObj from '~/components/SchemaObj.vue'
export default {
  components: {
    schemaObj
  },
  props: {
    // serversを後で追加する
    method: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    parameters: {
      type: Array,
      required: true
    },
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
    parametersGroupByIn() {
      // const ins = ['headers', 'queries', 'data']
      // const parameters = {
      //    'headers'
      // }
      return 0
    },
    arrPath() {
      const path = this.path
        .split('/')
        .map((elem) => {
          return elem.startsWith('{') ? `_${elem.slice(1, -1)}` : elem
        })
        .join('.')
      const method = `$api${path}.$${this.method}()`
      return method
    },
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
