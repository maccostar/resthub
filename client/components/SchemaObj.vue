<template>
  <div class="schema-container">
    <div v-if="isArray(schemaObj.type)">[</div>
    <p>{</p>
    <table style="width: 100%;" class="nest">
      <tbody>
        <tr v-for="(obj, index) in objectsToShow" :key="index">
          <td style="width: 90px;">
            "{{ obj.name }}"
            <span v-if="obj.required" class="required"> * </span>
          </td>
          <td style="width: 5px;">:</td>
          <td style="width: calc(100% - 95px);">
            <div v-if="!obj.hasNest">"{{ obj.type }}"</div>
            <div v-if="obj.hasNest && !obj.hasOf">
              <schema-obj :schema-obj="obj.schemaObj" class="nest" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <p>}</p>
    <div v-if="isArray(schemaObj.type)">]</div>
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
    }
  },
  methods: {
    existsOf(obj) {
      return 'allOf' in obj || 'oneOf' in obj || 'anyOf' in obj
    },
    isArray(obj) {
      return obj === 'array'
    },
    getProperties(obj) {
      const setProperties = (obj) => {
        const required = 'required' in obj ? obj.required : []
        return Object.entries(obj.properties).map((e) => {
          // example(s)・enum等はまだ実装していないß
          return {
            name: e[0],
            required: required.includes(e[0]),
            // undefinedの場合はtypeをもっていない
            type: 'type' in e[1] ? e[1].type : 'undefined',
            hasOf: this.existsOf(obj),
            hasNest: 'items' in e[1] || 'properties' in e[1],
            schemaObj: e[1]
          }
        })
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
  margin-left: 5px;
}
.required {
  margin: 0;
  font-size: 10px;
  color: #f00;
}
table td {
  word-break: break-all;
}
p {
  margin: 0;
}
</style>
