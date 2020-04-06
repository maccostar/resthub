<template>
  <div>
    <pre v-highlightjs style="width: 100%">
      <code class="typescript hljs">{{ exampleAspida }}
      </code>
    </pre>
  </div>
</template>
<script>
import getExampleTextUsingAspida from '~/utils/getExampleTextUsingAspida.js'
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
      constStr: '',
      argumentStr: ''
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
            : `${elem.charAt(0).toUpperCase()}${elem.slice(1)}`
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
            }, this.constStr)
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
      const dataParameters = this.argumentStr

      const path = this.path
        .split('/')
        .map((elem) => {
          return elem.startsWith('{')
            ? `_${elem.slice(1, -1)}(${elem.slice(1, -1)})`
            : elem
        })
        .join('.')
      const method = [`${path}.$${this.method}(`, `)`]

      const getParams = () => {
        if (exampleParameters.length > 1 && dataParameters.length > 1) {
          return `${method[0]}{ ${exampleParameters}, \n\t ${dataParameters} \n\t}${method[1]}`
        }
        if (exampleParameters.length > 1) {
          return `${method[0]}{ ${exampleParameters} \n\t}${method[1]}`
        }
        if (dataParameters.length > 1) {
          return `${method[0]}{ ${dataParameters} \n\t}${method[1]}`
        }
        return `${method[0]}${method[1]}`
      }

      return getParams()
    }
  },
  created() {
    const hasRequestBody = this.requestBody !== undefined
    if (hasRequestBody) {
      const mediaTypeObj = Object.entries(this.requestBody.content)[0][1]
      const schemaObj = 'schema' in mediaTypeObj ? mediaTypeObj.schema : {}
      const obj = getExampleTextUsingAspida(schemaObj)
      this.constStr = this.getConstStr(obj, '\n\t')
      this.argumentStr = this.getArgumentStr(obj, '\n\t\t\t')
    }
  },
  methods: {
    getConstStr: (obj, formatStr) => {
      const getStr = (obj, formatStr) => {
        return obj.map((e) => {
          const nextFormatStr = `${formatStr}\t`
          return !e.hasNest
            ? `${formatStr} const ${e.name} : ${e.type} = 'hoge'`
            : `${formatStr} const ${e.name} : ${e.type} ${getStr(
                e.nest,
                nextFormatStr
              )} `
        })
      }
      return `${getStr(obj, formatStr).join('')}`
    },
    getArgumentStr: (obj, formatStr) => {
      const str = obj
        .map((e) => {
          return `${formatStr} ${e.name}`
        })
        .join(',')
      return str.length > `${formatStr} `.length
        ? `\t data:{ ${str} \n\t\t}`
        : ``
    }
  }
}
</script>
<style scoped>
p {
  margin: 0;
}
</style>
