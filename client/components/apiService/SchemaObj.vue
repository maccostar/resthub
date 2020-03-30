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
            <div v-else>
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
import SchemaObj from '~/components/apiService/SchemaObj.vue'

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
      dummyArr: [{ name: 'err', type: 'err', hasNest: false }]
    }
  },
  computed: {
    objectsToShow() {
      return this.judgeFuncAndObject(this.schemaObj)
    }
  },
  methods: {
    isArray(obj) {
      return obj === 'array'
    },
    judgeFuncAndObject(obj) {
      if ('properties' in obj) {
        return 'allOf' in obj.properties || 'oneOf' in obj.properties
          ? this.judgeFuncAndObject(obj)
          : this.getProperties(obj)
      }
      if ('items' in obj) {
        return 'allOf' in obj.items || 'oneOf' in obj.items
          ? this.judgeFuncAndObject(obj.items)
          : this.getProperties(obj.items)
      }
      if ('allOf' in obj) {
        return this.mergeAllOf(obj.allOf)
      }
      if ('oneOf' in obj) {
        return this.mergeOneOf(obj.oneOf)
      }
      return this.dummyArr
    },
    getProperties(obj) {
      const setProperties = (obj) => {
        const required = 'required' in obj ? obj.required : []
        return Object.entries(obj.properties).map((e) => {
          // example(s)・enum等はまだ実装していない
          return {
            name: e[0],
            required: required.includes(e[0]),
            type: 'type' in e[1] ? e[1].type : 'undefined',
            hasNest: 'items' in e[1] || 'properties' in e[1],
            schemaObj: e[1]
          }
        })
      }
      return 'properties' in obj ? setProperties(obj) : [obj]
    },
    mergeAllOf(arr) {
      return arr.flatMap((obj) => {
        return this.getProperties(obj)
      })
    },
    mergeOneOf(arr) {
      return arr.map((obj) => {
        return {
          name: 'oneOf',
          required: false,
          type: 'oneOf',
          hasNest: true,
          schemaObj: obj
        }
      })
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
