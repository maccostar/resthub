<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        nuxt-ts
      </h1>
      <h2 class="subtitle">
        Swell RESThub project
      </h2>
      <div v-for="country in countries" :key="country.countryId">
        <v-btn
          class="my-1 white--text"
          color="blue"
          :to="`/users?countryId=${country.countryId}`"
          nuxt
          v-text="country.name"
        >
        </v-btn>
      </div>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          rel="noopener noreferrer"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/nuxt/nuxt.js"
          target="_blank"
          rel="noopener noreferrer"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Country } from '~/apis/samples/countries.json'
import Logo from '~/components/atoms/Logo.vue'

@Component({
  components: { Logo },
  async asyncData() {
    return {
      countries: await $nuxt.$api.samples.countries_json.$get()
    }
  }
})
export default class extends Vue {
  countries: Country[] = []
}
</script>

<style scoped>
.container {
  display: grid;

  /* Caution: `min-height: 100vh` does not work in IE 11 */
  height: 100vh;
  margin: 0 auto;
  text-align: center;

  /* Caution: `1fr` has different results in IE 11 */
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(6, 1fr);
}
</style>
