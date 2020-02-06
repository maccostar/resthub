<template>
  <div>
    <v-pagination
      v-model="page"
      :length="Math.ceil(num / 10)"
      :total-visible="4"
      @input="getNumber"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  getNumber() {
    this.$emit('input', this.page)
  }

  @Prop({ type: Number, required: true }) num!: number
  @Prop({ type: Number, required: true }) page!: number
}
</script>
