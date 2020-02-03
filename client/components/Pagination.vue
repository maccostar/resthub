<template>
  <div>
    <v-pagination v-model="page" :length="num" :total-visible="4" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  data() {
    return {
      page: 1
    }
  }

  @Prop({ type: Number, required: true }) num!: Number
}
</script>
