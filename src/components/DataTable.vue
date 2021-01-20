<template lang="pug">
div
  .data-table
    table
      tr
        th(v-for="item in rowHeadings", :key="item") {{ item }}
        th
          .checkbox-container
            v-checkbox(
              v-model="allSelected",
              @click="onToggleAll",
              label="Aktiv"
            )
      tr(v-for="(item, index) in data", :key="index")
        td(v-for="(itemValue, index) in Object.values(item)") {{ itemValue }}
        td
          .checkbox-container
            v-checkbox(v-model="value[index]", @change="onCheckboxChanged")
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
  data() {
    return {
      allSelected: false,
    };
  },
  computed: {
    allSelectedCheck() {
      for (let i = 0; i < this.data.length; i++) {
        if (!this.value[i]) return false;
      }
      return true;
    },
  },
  watch: {
    allSelectedCheck(newValue, oldValue) {
      this.allSelected = newValue;
    },
  },
  methods: {
    onToggleAll() {
      for (let i = 0; i < this.value.length; i++) {
        this.value[i] = this.allSelected;
      }
      this.$emit("dataChanged");
    },
    onCheckboxChanged() {
      let checked = [].concat(this.value);
      // this.$emit("input", checked);
      this.$emit("dataChanged");
    },
  },
  mounted() {
    this.allSelected = this.allSelectedCheck;
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
.checkbox-container {
  display: flex;
  justify-content: center;
}
</style>
