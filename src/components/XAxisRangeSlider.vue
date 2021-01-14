<template lang="pug">
  div
    v-row
      v-col
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      required: true
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1
    },
    ticks: {
      type: String,
      default: "always"
    },
    tickSize: {
      type: Number,
      default: 4
    }
  }
};
</script>

<style lang="scss" scoped></style>
