<template lang="pug">
  div
    .data-table
      table
        tr
          th(v-for="item in rowHeadings" :key="item") {{item}}
          th Aktiv
        tr(v-for="(item, index) in data" :key="index")
          td {{Object.values(item)[0]}}
          td {{Object.values(item)[1]}}
          td {{Object.values(item)[2]}}
          td
            input(type="checkbox" v-model="value[index]" @change="onCheckboxChanged")
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true
    },
    rowHeadings: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    onCheckboxChanged() {
      let checked = [].concat(this.value)
      this.$emit("input", checked);
      this.$emit("dataChanged");
    }
  },
};
</script>

<style lang="scss" scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
td, th {
  border: 1px solid grey;
}
</style>
