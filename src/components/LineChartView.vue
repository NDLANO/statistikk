<template lang="pug">
#linegraph-div
  v-row(v-if="gotData")
    v-col.y-left-slider(sm="1")
      v-row 
        v-col
          v-text-field(
            type="number",
            v-model="dataset.chartDataCollection.lineChartRange.yAxisRange[1]",
            style="width: 60px",
            @change="onYAxisTextChange"
          )
      v-row 
        v-col
          v-range-slider.y-slider(
            @change="onYAxisSliderChange",
            v-model="dataset.chartDataCollection.lineChartRange.yAxisRange",
            :min="dataset.chartDataCollection.lineChartRange.yAxisMin",
            :max="dataset.chartDataCollection.lineChartRange.yAxisMax",
            vertical
          )
      v-row 
        v-col
          v-text-field(
            type="number",
            v-model="dataset.chartDataCollection.lineChartRange.yAxisRange[0]",
            style="width: 60px",
            @change="onYAxisTextChange"
          )
    v-col.chart-container(sm="11", ref="lineChartWrapper")
      LineChart(
        ref="lineChart",
        :height="700",
        :chart-data="dataset.chartDataCollection",
        :options="lineChartOptions"
      )
  v-row#x-slider-head-row
    v-col#x-header-label-col(cols="1")
      div
        label x
    v-col(cols="11") 
      v-row#x-slider-row(v-if="gotData")
        v-col(cols="0", sm="1", md="1")
        v-col.bottom-slider(cols="12", sm="11", md="11")
          v-range-slider.x-slider(
            @change="onXAxisSliderChange",
            v-model="dataset.chartDataCollection.lineChartRange.xAxisRange",
            :min="dataset.chartDataCollection.lineChartRange.xAxisMin",
            :max="dataset.chartDataCollection.lineChartRange.xAxisMax",
            ticks="always",
            tick-size="4"
          )
            template(v-slot:thumb-label="props") {{ getXAxisLabel(props.value) }}
      v-row#x-label-row
        v-col(cols="0", sm="1", md="1")
        v-col#x-label-right(cols="6", sm="5", md="5")
          div
          span(
            v-if="dataset.chartDataCollection.lineChartRange.xAxisRange && dataset.chartDataCollection.labels"
          ) {{ dataset.chartDataCollection.labels[dataset.chartDataCollection.lineChartRange.xAxisRange[0]] }}
        v-col#x-label-left(cols="6", sm="6", md="6")
          div
          span(
            v-if="dataset.chartDataCollection.lineChartRange.xAxisRange && dataset.chartDataCollection.labels"
          ) {{ dataset.chartDataCollection.labels[dataset.chartDataCollection.lineChartRange.xAxisRange[1]] }}

  v-row#y-slider-head-row
    v-col(cols="1")
      div
        label y
    v-col(cols="11")
      v-row#y-slider-row
        v-col(cols="01", sm="1", md="1")
        v-col.y-bottom-slider(cols="12", sm="11", md="11")
          v-range-slider.y-slider-mobile-bottom(
            @change="onYAxisSliderChange",
            v-model="dataset.chartDataCollection.lineChartRange.yAxisRange",
            :min="dataset.chartDataCollection.lineChartRange.yAxisMin",
            :max="dataset.chartDataCollection.lineChartRange.yAxisMax"
          )
      v-row#y-label-row
        v-col(cols="01", sm="1", md="1")
        v-col#y-label-right(cols="6", sm="5", md="5")
          div
            input#y-input-right(
              type="number",
              v-model="dataset.chartDataCollection.lineChartRange.yAxisRange[0]",
              @change="onYAxisTextChange"
            )
        v-col#y-label-left(cols="6", sm="6", md="6")
          div
          input#y-input-left(
            type="number",
            v-model="dataset.chartDataCollection.lineChartRange.yAxisRange[1]",
            @change="onYAxisTextChange"
          )
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import LineChart from "@/components/charts/LineChart";

export default {
  name: "LineChartView",
  props: {
    dataset: {
      type: Object,
      required: true,
    },
  },
  components: {
    LineChart,
  },
  data() {
    return {
      currentDataset: "",
      lineChartOptions: {
        animation: {
          duration: 0,
        },
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: "30px",
        legend: {
          position: "top",
          labels: {
            fontStyle: "bold",
            fontSize: 16,
          },
        },
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
  watch: {
    updated(newValue, oldValue) {
      //   console.log("LineChartView.activeDataCollection watcher");
      console.log("LineChartView: updated watcher");
      // this.onXAxisSliderChange();
      this.redraw();
    },
  },
  computed: {
    ...mapGetters(["selectedDataset", "activeDataCollection", "updated"]),
    gotData() {
      if (this.dataset) {
        console.log(
          "LineChartview.gotData: dataset = ",
          Object.freeze(this.dataset)
        );
        return true;
      }

      return false;
    },
    yMinValue() {
      return this.$refs.lineChart._data._chart.scales["y-axis-0"].start;
    },
    yMaxValue() {
      return this.$refs.lineChart._data._chart.scales["y-axis-0"].end;
    },
  },
  methods: {
    ...mapActions(["initYAxisValues", "resetXSlider"]),
    onTestEvent() {
      console.log("LineChartview.onTestEvent");
    },
    getXAxisLabel(val) {
      return this.dataset.chartDataCollection.labels[val];
    },
    getChartRef() {
      return this.$refs.lineChartWrapper;
    },
    redraw() {
      console.log("LineChartView.redraw");
      this.lineChartOptions.scales.yAxes[0].ticks.min = this.dataset.chartDataCollection.lineChartRange.yAxisRange[0];
      this.lineChartOptions.scales.yAxes[0].ticks.max = this.dataset.chartDataCollection.lineChartRange.yAxisRange[1];
      this.lineChartOptions.scales.xAxes[0].ticks.min = this.dataset.chartDataCollection.lineChartRange.xAxisRange[0];
      this.lineChartOptions.scales.xAxes[0].ticks.max = this.dataset.chartDataCollection.lineChartRange.xAxisRange[1];
      this.$refs.lineChart.renderLineChart();
    },
    onYAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.yAxes[0].ticks.min = event[0];
      tmpOptions.scales.yAxes[0].ticks.max = event[1];
      this.dataset.chartDataCollection.lineChartRange.yAxisRange = event;
      this.lineChartOptions = tmpOptions;
    },
    onYAxisTextChange() {
      // * Adjust chart axis and redraw chart
      this.setChartScales(
        this.dataset.chartDataCollection.lineChartRange.yAxisRange
      );
    },
    onXAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.xAxes[0].ticks.min = this.dataset.chartDataCollection.labels[
        event[0]
      ];
      tmpOptions.scales.xAxes[0].ticks.max = this.dataset.chartDataCollection.labels[
        event[1]
      ];
      console.log("tmpOptions = ", tmpOptions);
      this.lineChartOptions = tmpOptions;
    },
    setChartScales(arrayIn) {
      console.log("LineChartView.setChartScales: arrayIn = ", arrayIn);
      this.lineChartOptions.scales.yAxes[0].ticks.min = arrayIn[0];
      this.lineChartOptions.scales.yAxes[0].ticks.max = arrayIn[1];
      this.$refs.lineChart.renderLineChart();
    },
    deleteChartScales() {
      delete this.lineChartOptions.scales.yAxes[0].ticks.min;
      delete this.lineChartOptions.scales.yAxes[0].ticks.max;
      this.$refs.lineChart.renderLineChart();
    },
    resetChart() {
      console.log("LineChartView.resetChart");
      this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin = undefined;
      this.deleteChartScales();
      this.resetYSlider();
      this.resetXSlider();
      this.redraw();
    },
    resetYSlider() {
      // * If dataset switched
      if (
        this.currentDataset !== this.dataset.name ||
        this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin == undefined
      ) {
        // * Delete scales to get a "clean" chart
        // * which can be used to extract min/max scales values
        this.deleteChartScales();

        if (
          this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin ==
          undefined
        ) {
          // * If dataset not used before
          console.warn("LineChartview.resetYSlider: unitiated dataset");
          // this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin = this.yMinValue;
          // this.dataset.chartDataCollection.lineChartRange.yAxisOrgMax = this.yMaxValue;
          this.initYAxisValues({
            rangeType: "lineChartRange",
            newMin: this.yMinValue,
            newMax: this.yMaxValue,
          });
          // this.dataset.chartDataCollection.lineChartRange.yAxisMin = this.yMinValue;
          // this.dataset.chartDataCollection.lineChartRange.yAxisMax = this.yMaxValue;
          // this.dataset.chartDataCollection.lineChartRange.yAxisRange = [
          //   this.yMinValue,
          //   this.yMaxValue,
          // ];
        } else {
          // * If dataset have been used before, reset scales with
          // * selected y range
          console.log(
            "LineChartView.resetYSlider: dataset initiated, setChartScales"
          );
          this.setChartScales(
            this.dataset.chartDataCollection.lineChartRange.yAxisRange
          );
        }

        this.currentDataset = this.dataset.name;
      }

      let chartjsMaxY = this.yMaxValue;
      console.log(
        "LinechartView.resetYSlider: this.chartjsMaxY = ",
        chartjsMaxY
      );
    },
    init() {
      console.log("--init--");
      this.resetYSlider();
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
@import "src/style/_LineChart.scss";
</style>
