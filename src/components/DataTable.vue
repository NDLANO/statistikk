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
          td {{value[index]}}
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
  }
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
