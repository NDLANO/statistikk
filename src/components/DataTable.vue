<template lang="pug">
div
  v-simple-table
    template(v-slot:default)
      thead
        tr
          th.text-center(v-for="item in rowHeadings", :key="item") {{ item }}
          th.text-center.checkbox-container
            v-checkbox(
              color="#20588F",
              v-model="allSelected",
              @click="onToggleAll",
              label="Aktiv"
            )

      tbody
        tr(v-for="(item, index) in data", :key="index")
          td(v-for="(itemValue, index) in Object.values(item)") {{ itemValue }}
          td.checkbox-container
            v-checkbox(
              v-model="localValue[index]",
              @change="onCheckboxChanged",
              color="#20588F"
            )
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
      localValue: [],
    };
  },
  computed: {
    allSelectedCheck() {
      console.log("DataTable.allSelectedCheck: value = ", this.value);
      for (let i = 0; i < this.data.length; i++) {
        if (!this.value[i]) return false;
      }
      console.log("DataTable.allSelectedCheck: no false: value = ", this.value);
      return true;
    },
  },
  watch: {
    allSelectedCheck(newValue, oldValue) {
      console.log("DataTable.allSelectedCheck watcher: newValue = ", newValue);
      this.allSelected = newValue;
    },
    value(newValue, oldValue) {
      console.log("DataTable.value watcher: newValue = ", newValue);
      this.localValue = [...newValue];
    },
  },
  methods: {
    areAllSelected() {
      for (let i = 0; i < this.data.length; i++) {
        if (!this.value[i]) return false;
      }
      return true;
    },
    onToggleAll() {
      let newValue = [...this.localValue];
      for (let i = 0; i < newValue.length; i++) {
        newValue[i] = this.allSelected;
      }
      this.$emit("input", [...newValue]);
      this.$emit("dataChanged");
    },
    onCheckboxChanged() {
      // let checked = [].concat(this.value);
      // this.$emit("input", checked);
      console.log("DataTable.onCheckboxChanges");
      this.$emit("input", [...this.localValue]);
      this.$emit("dataChanged");
    },
  },
  mounted() {
    this.allSelected = this.areAllSelected();
    this.localValue = [...this.value];
  },
};
</script>

<style lang="scss" scoped>
@import "src/style/_dataTable.scss";
</style>
