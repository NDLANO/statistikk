<template lang="pug">
  div
    v-row
      v-col.right-slider(sm="1")
        v-range-slider(
          @change="onYAxisSliderChange"
          v-model="yAxisValues"
          vertical 
          :min="0"
          :max="80000")
          template(v-slot:prepend)
            v-text-field(
              :value="yAxisValues[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(yAxisValues, 0, $event)")     
          template(v-slot:append)
            v-text-field(
              :value="yAxisValues[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(yAxisValues, 1, $event)")                               
      v-col.chart-container(sm="5")
        LineChart(ref="lineChart" :chart-data="dataCollection" :options="lineChartOptions")
    v-row
      v-col(sm="1")
      v-col.bottom-slider(sm="5")
        v-range-slider(
          @change="onXAxisSliderChange"
          v-model="xAxisValues"
          :min="0"
          :max="20")
          template(v-slot:prepend)
            v-text-field(
              :value="xAxisValues[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(xAxisValues, 0, $event)")              
          template(v-slot:append)
            v-text-field(
              :value="xAxisValues[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(xAxisValues, 1, $event)")               
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
  },
  components: {
    LineChart,
  },
  data() {
    return {
      yAxisValues: [0, 80000],
      xAxisValues: [0, 20],
      lineChartOptions: {
        animation: {
          duration: 0,
        },
        responsive: true,
        borderWidth: "30px",
        scales: {
          yAxes: [
            {
              ticks: {},
            },
          ],
          xAxes: [
            {
              ticks: {},
            },
          ],
        },
      },
    };
  },
  methods: {
    onYAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.yAxes[0].ticks.min = event[0];
      tmpOptions.scales.yAxes[0].ticks.max = event[1];
      this.lineChartOptions = tmpOptions;
    },
    onXAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.xAxes[0].ticks.min = event[0];
      tmpOptions.scales.xAxes[0].ticks.max = event[1];
      this.lineChartOptions = tmpOptions;
    },

    resetYMax() {
      this.$nextTick(() => {
        this.chartjsMaxY = this.$refs.lineChart._data._chart.scales[
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

<style lang="scss" scoped></style>
