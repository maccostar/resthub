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
            <pre v-highlightjs style="width: 100%">
              <code class="typescript">{{ exampleAspida }}
                // ここからベタ打ち
                <p>await client.api.v3.$2fa.$post({</p>
                <p>headers: { x-tchop-app-id : test},</p>
                <p>data: { email: test}</p>
            })
              </code>
            </pre>
            {{ arrPath }}

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
    exampleAspida() {
      const importStr = `import aspida from "@aspida/axios" \n import api from "@api-types/tchop"`
      const argumentStr =
        this.parameters.length > 0
          ? this.parameters.reduce((result, elem) => {
              return `${result} \n\t const ${elem.name} : ${elem.schema.type} = 'test'`
            }, '')
          : ''
      const arrPath = this.arrPath
      const asyncStr = [
        `;(async () => {`,
        `${argumentStr}`,
        `\t const client = api(aspida())`,
        `\n\t await client.api${arrPath}`,
        `})`
      ].join('\n')
      return `${importStr} \n\n ${asyncStr} `
    },
    arrPath() {
      const getName = (arr, str) => {
        return (
          arr.filter((e) => e.in === str && e.required).map((e) => e.name) || []
        )
      }
      const properties = ['header', 'path', 'query']
      const exampleParameters = properties
        .filter((e) => getName(this.parameters, e).length > 0)
        .map((e) => {
          return `\n\t\t ${e} :{
            \t\t ${getName(this.parameters, e).join(', \n\t\t\t')}
            \t }`
        })
        .join(', \n')
      // データrequestBodyの追加がまだ
      // header→headersへの修正等も必要
      const path = this.path
        .split('/')
        .map((elem) => {
          return elem.startsWith('{') ? `_${elem.slice(1, -1)}` : elem
        })
        .join('.')
      const method = [`${path}.$${this.method}(`, `)`]

      return exampleParameters.length > 1
        ? `${method[0]}{ ${exampleParameters} \n\t}${method[1]}`
        : method[0] + method[1]
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
