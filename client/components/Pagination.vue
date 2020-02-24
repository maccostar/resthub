<template>
  <div>
    <v-pagination
      :value="page"
      :length="Math.ceil(num / 10)"
      :total-visible="4"
      @input="setNumber"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  @Emit('input')
  setNumber(value: number) {
    return value
  }

  @Prop({ type: Number, required: true }) num!: number
  @Prop({ type: Number, required: true }) page!: number
}
</script>
