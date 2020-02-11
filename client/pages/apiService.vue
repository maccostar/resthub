<template>
  <div class="api-service-container">
    <div class="side">
      <v-text-field
        label="Keywords"
        prepend-inner-icon="mdi-magnify"
        single-line
        outlined
        dense
      />
      <p>Info</p>
      <p>Tags</p>
      <p>Servers</p>
      <p>Paths</p>
    </div>
    <div class="main">
      <div class="titele-wapper">
        <h1>{{ apiDoc.info.title }}</h1>
        <div>{{ apiDoc.info.version }}</div>
      </div>
      <div class="info-wrapper">
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
            v-for="(flatPathsObj, index) in group.arrOfFlatPathsObj"
            :key="index"
          >
            <api-method :flat-paths-obj="flatPathsObj" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// This script don't use TypeScript temporarily.
import SwaggerParser from 'swagger-parser'
import ApiMethod from '~/components/ApiMethod.vue'

export default {
  components: {
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
        const repStr =
          JSON.stringify(this.apiDoc[refObj[1]][refObj[2]][refObj[3]]).slice(
            1,
            -1
          ) + str.slice(idxOf2ndDQ + 1)
        return repStr
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
      const tagsInPathsObject = Object.entries(this.apiDoc.paths)
        .flatMap((endpoint) => Object.values(endpoint[1]))
        .flatMap((e) => e.tags)
      const tagsInTagsObject = this.apiDoc.tags.map((e) => e.name)
      // merge and get unique
      return tagsInTagsObject
        .concat(tagsInPathsObject)
        .filter((element, index, array) => array.indexOf(element) === index)
    },
    flatPathsObjGroups() {
      // reformat PathsObj
      const arrayedPathsObj = Object.entries(
        this.replacedApiDoc.paths
      ).map((e) => [e[0], Object.entries(e[1])])
      const arrOfFlatPathsObj = arrayedPathsObj.flatMap((e) => {
        const objects = e[1].map((elem) => {
          return { path: e[0], method: elem[0], opeObj: elem[1] }
        })
        return objects
      })
      // sort ApiDoc by path(a->z) and group ApiDoc by UniqueTags
      const groupsByTag = this.uniqueTags.map((tag) => {
        return {
          tag,
          arrOfFlatPathsObj: [...arrOfFlatPathsObj]
            .filter((element) => element.opeObj.tags.includes(tag))
            .sort((a, b) => {
              const _a = a.path.toString().toLowerCase()
              const _b = b.path.toString().toLowerCase()
              return _a < _b ? -1 : 1
            })
        }
      })
      return groupsByTag
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

.side {
  position: fixed;
  top: 65px;
  left: 0;
  z-index: 1;

  width: 200px;
  height: 100%;
  padding: 30px 20px;
  background: #fff;
  border-right: thin solid #c0c0c0;
}

.main {
  padding: 30px;
  margin: 65px 0 60px 200px;
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
