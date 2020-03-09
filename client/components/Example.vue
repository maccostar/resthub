<template>
  <div>
    <pre v-highlightjs style="width: 100%">
      <code class="typescript hljs">{{ exampleAspida }}
      </code>
    </pre>
    {{ hoge }}
  </div>
</template>
<script>
export default {
  props: {
    // serversを後で追加する
    appTitle: {
      type: String,
      required: true
    },
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
      required: false,
      default: undefined
    }
  },
  data() {
    return {
      hoge: {}
    }
  },
  computed: {
    packageName() {
      return this.appTitle
        .toLowerCase()
        .split(' ')
        .filter(
          (elem, index, array) => elem !== 'app' && index !== array.length - 1
        )
        .map((elem, index) => {
          return index === 0
            ? elem
            : elem.charAt(0).toUpperCase() + elem.slice(1)
        })
        .join('')
    },
    exampleAspida() {
      const arrPath = this.arrPath
      const packageName = this.packageName
      const importStr = `import aspida from "@aspida/axios" \n import api from "@api-types/${packageName}"`
      const argumentStr =
        this.parameters.length > 0
          ? this.parameters.reduce((result, elem) => {
              return `${result} \n\t const ${elem.name} : ${elem.schema.type} = 'test'`
            }, '')
          : ''
      const asyncStr = [
        `;(async () => {`,
        `${argumentStr}`,
        `\t const client = api(aspida())`,
        `\n\t const res = await client${arrPath}`,
        `})`
      ].join('\n')
      return `// lets assume you have installed @api-types/${packageName}
              \n ${importStr}
              \n ${asyncStr}
              \n console.log(res)`
    },
    arrPath() {
      const properties = ['header', 'path', 'query']
      const getName = (arr, str) => {
        return arr.filter((e) => e.in === str).map((e) => e.name) || []
      }

      const exampleParameters = properties
        .filter((e) => getName(this.parameters, e).length > 0 && e !== 'path')
        .map((e) => {
          const propertyName = e === 'header' ? 'headers' : e
          return `\n\t\t ${propertyName} :{
            \t\t ${getName(this.parameters, e).join(', \n\t\t\t')}
            \t }`
        })
        .join(',')
      // データrequestBodyの追加がまだ
      const path = this.path
        .split('/')
        .map((elem) => {
          return elem.startsWith('{')
            ? `_${elem.slice(1, -1)}(${elem.slice(1, -1)})`
            : elem
        })
        .join('.')
      const method = [`${path}.$${this.method}(`, `)`]

      return exampleParameters.length > 1
        ? `${method[0]}{ ${exampleParameters} \n\t}${method[1]}`
        : method[0] + method[1]
    }
  },
  mounted() {
    const hasRequestBody = this.requestBody !== undefined
    if (hasRequestBody) {
      const mediaTypeObj = Object.entries(this.requestBody.content)[0][1]
      const schemaObj = 'schema' in mediaTypeObj ? mediaTypeObj.schema : {}
      this.hoge = this.$getExampleData(schemaObj)
      // console.log(this.hoge)
    }
  }
}
</script>
<style scoped>
p {
  margin: 0;
}
</style>
