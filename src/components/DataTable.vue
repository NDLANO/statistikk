<template lang="pug">
#datatable-div
  v-simple-table
    template(v-slot:default)
      thead
        tr
          th.text-center.checkbox-container
            v-checkbox(
              color="#20588F",
              v-model="allSelected",
              @click="onToggleAll",
              label="Aktiv"
            )
          th.text-center(v-for="(item, index) in rowHeadings", :key="item")
            v-row#rowHeadings-row 
              v-col#checkbox-col(:cols="index === 0 ? 0 : 2")
                v-checkbox#rowheadings-checkbox(
                  v-if="index > 0",
                  v-model="localActiveCols[index - 1]",
                  @change="onColCheckboxChanged"
                )
              v-col#checkbox-span-col(:cols="index === 0 ? 0 : 7")
                span#rowheadings-span {{ item }}

      tbody
        tr(v-for="(item, index) in data", :key="index")
          td.checkbox-container
            v-checkbox(
              v-model="localValue[index]",
              @change="onCheckboxChanged",
              color="#20588F"
            )
          td(v-for="(itemValue, index) in Object.values(item)") {{ itemValue }}
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
    activeCols: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      allSelected: false,
      localValue: [],
      localActiveCols: [],
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
    activeCols(newValue) {
      this.localActiveCols = [...newValue];
    },
  },
  methods: {
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
    onColCheckboxChanged() {
      console.log(
        "DataTable.onColCheckboxChanged: cols ",
        this.localActiveCols
      );
      this.$emit("colsChanged", [...this.localActiveCols]);
    },
  },
  mounted() {
    this.allSelected = this.allSelectedCheck;
    this.localValue = [...this.value];
    this.localActiveCols = [...this.activeCols];
    console.log("DataTable.mounted: localActiveCols = ", this.localActiveCols);
  },
};
</script>

<style lang="scss" scoped>
@import "src/style/_dataTable.scss";
</style>
