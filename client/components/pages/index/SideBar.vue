<template>
  <div class="side-bar">
    <div class="category-title">Category</div>
    <div class="filter-buttons-container">
      <ul class="filter-buttons">
        <li v-for="(item, index) in categories" :key="index">
          <input
            v-model="selectItems"
            class="checkbox"
            type="checkbox"
            name="category"
            :value="item[0]"
          />{{ item[0] }} ({{ item[1] }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'nuxt-property-decorator'

@Component({})
export default class extends Vue {
  selectedItems: string[] = []

  @Prop({ type: Array, required: true }) categories!: [string, number][]

  @Emit()
  input(selectedItems: string[]) {
    return selectedItems
  }

  get selectItems() {
    return this.selectedItems
  }

  set selectItems(value: string[]) {
    this.selectedItems = value
    this.input(this.selectedItems)
  }
}
</script>

<style scoped>
.side-bar {
  position: fixed;
  top: 65px;
  left: 0;
  z-index: 1;

  width: 200px;
  height: 100%;
  padding: 30px 20px;
  overflow-y: scroll;
  background: #fff;
  border-right: thin solid #c0c0c0;
}

.category-title {
  margin-bottom: 20px;
  font-size: 14pt;
}

.filter-buttons-container > ul {
  padding: 0;
  list-style: none;
}

.filter-buttons-container > ul li {
  margin: 10px;
  text-align: left;
}

.checkbox {
  margin-right: 10px;
}
</style>
