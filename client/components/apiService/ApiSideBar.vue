<template>
  <div>
    <v-text-field
      label="Keywords"
      prepend-inner-icon="mdi-magnify"
      single-line
      outlined
      dense
    />
    <p class="index">Info</p>
    <p class="index">Tags</p>
    <p class="index">Servers</p>
    <p class="index">Paths</p>
    <div v-for="(group, gIndex) in flatPathsObjGroups" :key="gIndex">
      <label :for="`toggle${gIndex}`">
        <p class="tag">{{ group.tag }}</p>
      </label>
      <input :id="`toggle${gIndex}`" class="toggle-outer" type="checkbox" />
      <div
        v-for="(flatPathsObj, idx) in group.arrOfFlatPathsObj"
        :key="idx"
        class="toggle-inner"
      >
        <a :href="`#${gIndex}_${idx}`">
          <p class="method">
            <span :class="flatPathsObj.method">{{ flatPathsObj.method }}</span>
            <span>{{ flatPathsObj.path }}</span>
          </p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    flatPathsObjGroups: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.index {
  font-size: 16px;
}
p {
  font-size: 12px;
  color: #646464;
}
input {
  display: none;
}
.toggle-inner {
  display: none;
}
.toggle-outer:checked ~ .toggle-inner {
  display: block;
}
.get {
  color: #5c81ff;
}
.post {
  color: #5bc45b;
}
.put {
  color: #ff9c38;
}
.delete {
  color: #ffadad;
}
.tag {
  margin-bottom: 0;
  margin-left: 1rem;
}
.method {
  margin-bottom: 0;
  margin-left: 2rem;
}
a {
  text-decoration: none;
}
</style>
