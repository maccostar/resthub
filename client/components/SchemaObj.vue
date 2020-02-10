<template>
  <div class="schema-container">
    <div v-if="isArray(schemaObj.type)">
      [
    </div>
    <div>
      <p>{</p>
      <table style="width: 100%;" class="nest">
        <tbody>
          <tr v-for="(object, index) in objectsToShow" :key="index">
            <td style="width: 80px;">
              "{{ object.name }}"
              <span
                v-if="object.required"
                style="margin: 0; font-size: 10px; color: #f00;"
              >
                *
              </span>
            </td>
            <td style="width: 5px;">:</td>
            <td style="width: calc( 100% - 85px );">
              <div v-if="object.type !== 'undefined'">"{{ object.type }}"</div>
              <div v-if="object.hasNest && !object.hasOf">
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
        const _required = 'required' in obj ? obj.required : []
        const properties = Object.entries(obj.properties).map((e) => {
          // example(s)・enum等はまだ実装していないß
          return {
            name: e[0],
            required:
              'requied' in e[1] ? e[1].required : _required.includes(e[0]),
            // undefinedの場合はtypeをもっていない
            type: 'type' in e[1] ? e[1].type : 'undefined',
            hasOf: this.existsOf(obj),
            hasNest: 'items' in e[1] || 'properties' in e[1],
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
  margin-left: 5px;
}
table td {
  word-break: break-all;
}
p {
  margin: 0;
}
</style>
