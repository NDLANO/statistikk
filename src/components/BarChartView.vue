<template lang="pug">
div
  v-row
    v-col.right-slider(sm="1")
      v-range-slider(
        @change="onYAxisSliderChange",
        v-model="yAxisValues",
        vertical,
        :min="0",
        :max="80000"
      )
        template(v-slot:prepend)
          v-text-field.mt-0.pt-0(
            :value="yAxisValues[0]",
            hide-details,
            single-line,
            type="number",
            style="width: 60px",
            @change="$set(yAxisValues, 0, $event)"
          ) 
        template(v-slot:append)
          v-text-field.mt-0.pt-0(
            :value="yAxisValues[1]",
            hide-details,
            single-line,
            type="number",
            style="width: 60px",
            @change="$set(yAxisValues, 1, $event)"
          ) 
    v-col.chart-container(sm="6", ref="barChartWrapper")
      BarChart(
        ref="barChart",
        :height="300",
        :chart-data="dataCollection",
        :options="barChartOptions"
      )
  v-row
    v-col(sm="1")
    v-col.bottom-slider(sm="6")
      v-range-slider(
        @change="onXAxisSliderChange",
        v-model="xAxisValues",
        :min="0",
        :max="20"
      )
        template(v-slot:prepend)
          v-text-field.mt-0.pt-0(
            :value="xAxisValues[0]",
            hide-details,
            single-line,
            type="number",
            style="width: 60px",
            @change="$set(xAxisValues, 0, $event)"
          ) 
        template(v-slot:append)
          v-text-field.mt-0.pt-0(
            :value="xAxisValues[1]",
            hide-details,
            single-line,
            type="number",
            style="width: 60px",
            @change="$set(xAxisValues, 1, $event)"
          ) 
</template>

<script>
import BarChart from "@/components/charts/BarChart";

export default {
  name: "BarChartView",
  props: {
    dataCollection: {
      type: Object,
      required: true,
    },
  },
  components: {
    BarChart,
  },
  data() {
    return {
      chartjsMaxY: 1,
      yAxisValues: [0, 100000],
      xAxisValues: [0, 20],
      barChartOptions: {
        animation: {
          duration: 0,
        },
        responsive: true,
        // maintainAspectRatio: false,
        borderWidth: "30px",
        scales: {
          yAxes: [
            {
              ticks: {
                fontSize: 16,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontSize: 16,
              },
            },
          ],
        },
      },
    };
  },
  methods: {
    getChartRef() {
      return this.$refs.barChartWrapper;
    },
    redraw() {
      // this.barChartOptions.scales.yAxes[0].ticks.min = this.dataCollection.barChartRange.yAxisRange[0];
      // this.barChartOptions.scales.yAxes[0].ticks.max = this.dataCollection.barChartRange.yAxisRange[1];
      this.$refs.barChart.renderBarChart();
    },
    onYAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.barChartOptions));
      tmpOptions.scales.yAxes[0].ticks.min = event[0];
      tmpOptions.scales.yAxes[0].ticks.max = event[1];
      this.barChartOptions = tmpOptions;
    },
    onXAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.barChartOptions));
      tmpOptions.scales.xAxes[0].ticks.min = event[0];
      tmpOptions.scales.xAxes[0].ticks.max = event[1];
      this.barChartOptions = tmpOptions;
    },

    resetYMax() {
      this.$nextTick(() => {
        this.chartjsMaxY = this.$refs.barChart._data._chart.scales[
          "y-axis-0"
        ].end;
        console.log("this.chartjsMaxY = ", this.chartjsMaxY);
        this.yAxisValues[0] = 0;
        this.yAxisValues[1] = this.chartjsMaxY;
      });
    },
    init() {
      this.resetYMax();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "src/style/_barChart.scss";
</style>
