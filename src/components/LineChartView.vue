<template lang="pug">
  div
    v-row
      v-col
        h2 Chart
    v-row
      v-col.right-slider(sm="1")
      v-col.chart-container(sm="5")
        LineChart(ref="lineChart" :chart-data="dataCollection" :options="lineChartOptions")
    v-row
      v-col(sm="1")
      v-col.bottom-slider(sm="12")
        div Slider
</template>

<script>
import LineChart from "@/components/charts/LineChart";

export default {
  name: "LineChartView",
  props: {
    dataCollection: {
      type: Object,
      required: true,
    },
    lineChartOptions: {
      type: Object,
      required: true,
    },
  },
  components: {
    LineChart,
  },
};
</script>

<style lang="scss" scoped></style>
