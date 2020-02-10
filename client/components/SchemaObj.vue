<template>
  <div>
    <table style="width: 100%;">
      <tbody>
        <tr v-for="(object, index) in objectsToShow" :key="index">
          <td style="width: 20%;">"{{ object.name }}"</td>
          <td style="width: 5%;">:</td>
          <td style="width: 75%;">
            <!-- type arrayの場合は[]で/type objectの場合は{}で包むロジックが追加で必要 -->
            "{{ object.type }}"
            <div v-if="object.hasItems && !object.hasOf" class="nest">
              <!-- {{ typeof object.schemaObj }} -->
              <!-- {{ object.schemaObj }} -->
              <schema-obj :schema-obj="object.schemaObj" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
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
      const _schemaObj = this.schemaObj
      if ('properties' in _schemaObj) {
        return this.getProperties(_schemaObj)
      } else if ('items' in _schemaObj) {
        return this.getProperties(_schemaObj.items)
      } else {
        return this.dummyArr
      }
    }
  },
  methods: {
    existsOf(obj) {
      return 'allOf' in obj || 'oneOf' in obj || 'anyOf' in obj
    },
    getProperties(obj) {
      const setProperties = (obj) => {
        const properties = Object.entries(obj.properties).map((e) => {
          // example(s)・enum等は一旦無視
          return {
            // requiedはあとでやる
            name: e[0],
            required: true,
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
.nest {
  display: block;
  margin-top: 1rem;
  margin-left: 2rem;
}
</style>
