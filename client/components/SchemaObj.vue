<template>
  <div class="schema-container">
    <div v-if="schemaObj.type === 'array'">[</div>
    <div>
      <div v-if="'refPath' in schemaObj">
        {{ path }}
      </div>
      <p>{</p>
      <table style="width: 100%;" class="nest">
        <tbody>
          <tr v-for="(object, index) in objectsToShow" :key="index">
            <td style="width: 90px;">
              "{{ object.name }}"
              <span
                v-if="object.required"
                style="margin: 0; font-size: 10px; color: #f00;"
                >*</span
              >
            </td>
            <td style="width: 5px;">:</td>
            <td style="width: calc( 100% - 95px );">
              <!-- type arrayの場合は[]で/type objectの場合は{}で包むロジックが追加で必要 -->
              "{{ object.type }}"
              <div v-if="object.hasItems && !object.hasOf">
                <div class="nest">
                  <schema-obj :schema-obj="object.schemaObj" />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p>}</p>
    </div>
    <div v-if="schemaObj.type === 'array'">]</div>
  </div>
</template>

<script>
import SchemaObj from '~/components/SchemaObj.vue'

export default {
  name: 'SchemaObj',
  components: {
    SchemaObj
  },
  props: {
    schemaObj: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dummyArr: [{ name: 'err', type: 'err', hasItems: false }]
    }
  },
  computed: {
    objectsToShow() {
      if ('properties' in this.schemaObj) {
        return this.getProperties(this.schemaObj)
      } else if ('items' in this.schemaObj) {
        return this.getProperties(this.schemaObj.items)
      } else {
        return this.dummyArr
      }
    },
    path() {
      const _pathObj = (str) => {
        const pathModel = str.split('/')
        return pathModel[pathModel.length - 1]
      }
      return 'refPath' in this.schemaObj ? _pathObj(this.schemaObj.refPath) : ''
    }
  },
  methods: {
    existsOf(obj) {
      return 'allOf' in obj || 'oneOf' in obj || 'anyOf' in obj
    },
    getProperties(obj) {
      const setProperties = (obj) => {
        const _required = 'required' in obj ? obj.required : []
        const properties = Object.entries(obj.properties).map((e) => {
          // example(s)・enum等は一旦無視
          return {
            name: e[0],
            required:
              'requied' in e[1] ? e[1].required : _required.includes(e[0]),
            // undefinedの場合はtypeをもっていない
            type: 'type' in e[1] ? e[1].type : 'undefined',
            hasOf: this.existsOf(obj),
            hasItems: 'items' in e[1],
            schemaObj: e[1]
          }
        })
        return properties
      }
      return !this.existsOf(obj) && 'properties' in obj
        ? setProperties(obj)
        : this.dummyArr
    }
  }
}
</script>

<style scoped>
.schema-container {
  padding: 5px 10px;
  font-size: 10px;
  background-color: #dfe6ec;
}
.nest {
  display: block;
  margin-left: 10px;
}
table td {
  word-break: break-all;
}
p {
  margin: 0;
}
</style>
