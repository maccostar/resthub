<template>
  <div class="api-service-container">
    <div class="side" style="overflow-y: auto;">
      <api-side-bar :flat-paths-obj-groups="flatPathsObjGroups" />
    </div>
    <div class="main">
      <div class="titele-wapper">
        <h1>{{ apiDoc.info.title }}</h1>
        <div>{{ apiDoc.info.version }}</div>
      </div>
      <div v-if="'description' in apiDoc.info" class="info-wrapper">
        <h2>Info</h2>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div v-html="$md.render(apiDoc.info.description)"></div>
      </div>
      <div class="servers-wrapper">
        <h2>Servers</h2>
        <v-select
          :items="apiDoc.servers"
          item-text="url"
          item-value="url"
          outlined
        >
        </v-select>
      </div>
      <hr style="background-color:#646464" />
      <div class="api-methods-wapper">
        <div v-for="(group, gIndex) in flatPathsObjGroups" :key="gIndex">
          <h3 class="api-tag">{{ group.tag }}</h3>
          <div
            v-for="(obj, idx) in group.arrOfFlatPathsObj"
            :id="`${gIndex}_${idx}`"
            :key="idx"
          >
            <api-method :flat-paths-obj="obj" :app-title="apiDoc.info.title" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// This script don't use TypeScript temporarily.
import SwaggerParser from 'swagger-parser'
import ApiSideBar from '~/components/pages/apiService/ApiSideBar.vue'
import ApiMethod from '~/components/pages/apiService/ApiMethod.vue'

export default {
  components: {
    ApiSideBar,
    ApiMethod
  },
  async asyncData({ route }) {
    const apiServiceId = route.query.apiServiceId
    const openapi = await SwaggerParser.parse(
      `/openApiSpec/${apiServiceId}.json`,
      {
        parse: { json: true }
      }
    )
    return { apiDoc: openapi }
  },
  data() {
    return {
      apiDoc: {}
    }
  },
  computed: {
    replacedApiDoc() {
      const replace = (str) => {
        // DQ means DoubleQuotation
        const idxOf2ndDQ = str.indexOf(`"`, 1)
        const refObj = str.slice(1, idxOf2ndDQ).split('/')
        const refPath = `"refPath":"#/${refObj[1]}/${refObj[2]}/${refObj[3]}", `
        return (
          refPath +
          JSON.stringify(this.apiDoc[refObj[1]][refObj[2]][refObj[3]]).slice(
            1,
            -1
          ) +
          str.slice(idxOf2ndDQ + 1)
        )
      }
      const replacedObj = (obj) => {
        const _string = JSON.stringify(obj)
          .split(`"$ref":`)
          .map((str) => (str.startsWith(`"#/`) ? replace(str) : str))
          .join('')
        const _obj = JSON.parse(_string)
        return _string.includes(`"$ref":`) ? replacedObj(_obj) : _obj
      }
      return replacedObj(this.apiDoc)
    },
    uniqueTags() {
      const tagsInPathsObject = Object.entries(this.apiDoc.paths).flatMap(
        (endpoint) => {
          return Object.entries(endpoint[1])
            .filter((elem) => this.isMethod(elem[0]))
            .flatMap((elem) => elem[1].tags)
        }
      )
      const tagsInTagsObject =
        'tags' in this.apiDoc ? this.apiDoc.tags.map((e) => e.name) : []
      // merge and get unique
      return tagsInTagsObject
        .concat(tagsInPathsObject)
        .filter((element, index, array) => array.indexOf(element) === index)
    },
    flatPathsObjGroups() {
      // reformat PathsObj
      const arrayedPathsObj = Object.entries(this.replacedApiDoc.paths)
        .map((e) => [e[0], Object.entries(e[1])])
        .filter((e) => this.isMethod(e[1][0][0]))
      const arrOfFlatPathsObj = arrayedPathsObj.flatMap((e) => {
        return e[1].map((elem) => {
          return { path: e[0], method: elem[0], opeObj: elem[1] }
        })
      })
      const sortedArrOfFlatPathsObj = [...arrOfFlatPathsObj].sort((a, b) => {
        const _a = a.path.toString().toLowerCase()
        const _b = b.path.toString().toLowerCase()
        return _a < _b ? -1 : 1
      })
      // group ApiDoc by UniqueTags
      return this.uniqueTags.length > 1
        ? this.uniqueTags.map((tag) => {
            return {
              tag,
              arrOfFlatPathsObj: sortedArrOfFlatPathsObj.filter((element) =>
                'tags' in element.opeObj
                  ? element.opeObj.tags.includes(tag)
                  : false
              )
            }
          })
        : [
            {
              tag: '',
              arrOfFlatPathsObj: sortedArrOfFlatPathsObj
            }
          ]
    }
  },
  methods: {
    isMethod: (str) => {
      const methods = [
        'get',
        'put',
        'post',
        'delete',
        'options',
        'head',
        'patch',
        'trace'
      ]
      return methods.includes(str)
    }
  }
}
</script>
<style scoped>
.api-service-container {
  /* Caution: `min-height: 100vh` does not work in IE 11 */
  color: #646464;
  text-align: left;
  background: #fff;
}

.main {
  padding: 30px;
  margin: 65px 0 60px 300px;
}
.api-methods-wapper {
  padding: 20px 0;
}
h2 {
  font-size: 28px;
}
h3 {
  font-size: 24px;
}
</style>
