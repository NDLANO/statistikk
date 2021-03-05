<template lang="pug">
#datatable-div
  v-simple-table
    template(v-slot:default)
      thead
        tr
          th.text-center
            v-row
              v-col.menu-wrapper
                v-menu#menu-card
                  template(v-slot:activator="{ on, attrs }")
                    v-btn#menu-button(icon, v-bind="attrs", v-on="on")
                      v-icon mdi-dots-horizontal
                  v-list.menu-list
                    v-list-item(@click="onToggleItemClicked('col')")
                      v-list-item-title {{ $t('table.toggleColumns') }}
                      v-icon mdi-chevron-right
                    v-list-item(@click="onToggleItemClicked('row')")
                      v-list-item-title {{ $t('table.toggleRows') }}
                      v-icon mdi-chevron-down

          th.text-center(v-for="(item, index) in rowHeadings", :key="item")
            .rowHeadings-row.header-xaxis(v-if="index == 0")
              div
                span.rowheadings-span {{ item }}
            .rowHeadings-row(v-else)
              .checkbox-col
                v-checkbox.rowheadings-checkbox(
                  v-model="localActiveCols[index - 1]",
                  @change="onColCheckboxChanged"
                )
              .checkbox-span-col
                span.rowheadings-span {{ item }}

      tbody
        tr(v-for="(item, index) in data", :key="index")
          td
            v-checkbox(
              v-model="localValue[index]",
              @change="onCheckboxChanged",
              color="#20588F"
            )
          td(v-for="(itemValue, index) in Object.values(item)") {{ itemValue }}
</template>
<script>
export default {
  name: "DataTable",
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
      allRowsSelected: false,
      allColsSelected: false,
      localValue: [],
      localActiveCols: [],
    };
  },
  computed: {
    allRowsSelectedCheck() {
      console.log("DataTable.allRowsSelectedCheck: value = ", this.value);
      for (let i = 0; i < this.data.length; i++) {
        if (!this.value[i]) return false;
      }
      console.log(
        "DataTable.allRowsSelectedCheck: no false: value = ",
        this.value
      );
      return true;
    },
    allColsSelectedCheck() {
      console.log("DataTable.allColsSelectedCheck: value = ", this.activeCols);
      for (let i = 0; i < this.activeCols.length; i++) {
        if (!this.activeCols[i]) return false;
      }
      console.log(
        "DataTable.allColsSelectedCheck: no false: value = ",
        this.activeCols
      );
      return true;
    },
  },
  watch: {
    allRowsSelectedCheck(newValue, oldValue) {
      console.log(
        "DataTable.allRowsSelectedCheck watcher: newValue = ",
        newValue
      );
      this.allRowsSelected = newValue;
    },
    allColsSelectedCheck(newValue, oldValue) {
      console.log(
        "DataTable.allColsSelectedCheck watcher: newValue = ",
        newValue
      );
      this.allColsSelected = newValue;
    },
    value(newValue, oldValue) {
      console.log("DataTable.value watcher: newValue = ", newValue);
      this.localValue = [...newValue];
    },
    activeCols(newValue) {
      console.log("DataTable.activeCols watcher: newValue = ", newValue);
      this.localActiveCols = [...newValue];
    },
  },
  methods: {
    onToggleItemClicked(type) {
      console.log("DataTable.onToggleItemClicked: type = ", type);
      if (type === "row") this.toggleAllRows();
      else this.toggleAllCols();
    },
    toggleAllRows() {
      console.log(
        "DataTable.toggleAllRows: allRowsSelected = ",
        this.allRowsSelected
      );
      let newValue = [...this.localValue];
      for (let i = 0; i < newValue.length; i++) {
        newValue[i] = !this.allRowsSelected;
      }
      this.$emit("input", [...newValue]);
      this.$emit("dataChanged");
    },
    toggleAllCols() {
      console.log(
        "DataTable.toggleAllCols: allColsSelected = ",
        this.allColsSelected
      );
      let newValue = [...this.localActiveCols];
      for (let i = 0; i < newValue.length; i++) {
        newValue[i] = !this.allColsSelected;
      }
      this.$emit("colsChanged", [...newValue]);
      this.$emit("dataChanged");
    },
    onCheckboxChanged() {
      console.log("DataTable.onCheckboxChanged");
      this.$emit("input", [...this.localValue]);
      this.$emit("dataChanged");
    },
    onColCheckboxChanged() {
      console.log("DataTable.onColCheckboxChanged");
      this.$emit("colsChanged", [...this.localActiveCols]);
      this.$emit("dataChanged");
    },
  },
  mounted() {
    this.allRowsSelected = this.allRowsSelectedCheck;
    this.allColsSelected = this.allColsSelectedCheck;
    this.localValue = [...this.value];
    this.localActiveCols = [...this.activeCols];
    console.log("DataTable.mounted: localActiveCols = ", this.localActiveCols);
  },
};
</script>

<style lang="scss" scoped>
@import "src/style/_dataTable.scss";
</style>
