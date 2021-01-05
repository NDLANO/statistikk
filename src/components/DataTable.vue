<template lang="pug">
  div
    .data-table
      table
        tr
          th(v-for="item in rowHeadings" :key="item") {{item}}
          th Aktiv 
            input(type="checkbox")
        tr(v-for="(item, index) in data" :key="index")
          td(v-for="(itemValue, index) in Object.values(item)" ) {{ itemValue }}
          td
            input(type="checkbox" v-model="value[index]" @change="onCheckboxChanged")
            //- v-checkbox(v-model="value[i]" @change="onCheckboxChanged")
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true,
    },
    rowHeadings: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onCheckboxChanged() {
      let checked = [].concat(this.value);
      this.$emit("input", checked);
      this.$emit("dataChanged");
    },
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 20px;
}
td,
th {
  border: 1px solid grey;
}
</style>
