<template lang="pug">
#bargraph-div
  v-row
    v-col.y-left-slider-barchart(sm="1")
      v-row
        v-col
          v-text-field(
            v-model="dataset.chartDataCollection.barChartRange.yAxisRange[1]",
            hide-details,
            single-line,
            type="number",
            style="width: 60px",
            @change="onYAxisTextChange"
          )
      v-row
        v-col
          v-range-slider.y-slider(
            @change="onYAxisSliderChange",
            v-model="dataset.chartDataCollection.barChartRange.yAxisRange",
            :min="dataset.chartDataCollection.barChartRange.yAxisMin",
            :max="dataset.chartDataCollection.barChartRange.yAxisMax",
            vertical
          )
      v-row
        v-col
          v-text-field(
            v-model="dataset.chartDataCollection.barChartRange.yAxisRange[0]",
            hide-details,
            single-line,
            type="number",
            style="width: 60px",
            @change="onYAxisTextChange"
          ) 

    v-col.chart-container(sm="11", ref="barChartWrapper")
      BarChart(
        v-show="chartHeightSet",
        ref="barChart",
        :style="chartStyle",
        :chart-data="activeChartDataCollection",
        :options="barChartOptions"
      )
  v-row#x-slider-head-row-barchart
    v-col#x-header-label-col-barchart(cols="1")
      div
        label x
    v-col(cols="11") 
      v-row#x-slider-row-barchart(v-if="gotData")
        v-col(cols="0", sm="1", md="1")
        v-col.bottom-slider(cols="12", sm="11", md="11")
          v-range-slider.x-slider(
            @change="onXAxisSliderChange",
            v-model="dataset.chartDataCollection.barChartRange.xAxisRange",
            :min="dataset.chartDataCollection.barChartRange.xAxisMin",
            :max="dataset.chartDataCollection.barChartRange.xAxisMax",
            ticks="always",
            tick-size="4"
          )
            template(v-slot:thumb-label="props") {{ getXAxisLabel(props.value) }}
      v-row#x-label-row-barchart
        v-col(cols="0", sm="1", md="1")
        v-col#x-label-right-barchart(cols="6", sm="5", md="5")
          div
          span(
            v-if="dataset.chartDataCollection.barChartRange.xAxisRange && dataset.chartDataCollection.labels"
          ) {{ dataset.chartDataCollection.labels[dataset.chartDataCollection.barChartRange.xAxisRange[0]] }}
        v-col#x-label-left-barchart(cols="6", sm="6", md="6")
          div
          span(
            v-if="dataset.chartDataCollection.barChartRange.xAxisRange && dataset.chartDataCollection.labels"
          ) {{ dataset.chartDataCollection.labels[dataset.chartDataCollection.barChartRange.xAxisRange[1]] }}

  v-row#y-slider-head-row-barchart
    v-col(cols="1")
      div
        label y
    v-col(cols="11")
      v-row#y-slider-row-barchart
        v-col(cols="01", sm="1", md="1")
        v-col.y-bottom-slider(cols="12", sm="11", md="11")
          v-range-slider.y-slider-mobile-bottom(
            @change="onYAxisSliderChange",
            v-model="dataset.chartDataCollection.barChartRange.yAxisRange",
            :min="dataset.chartDataCollection.barChartRange.yAxisMin",
            :max="dataset.chartDataCollection.barChartRange.yAxisMax"
          )
      v-row#y-label-row-barchart
        v-col(cols="01", sm="1", md="1")
        v-col#y-label-right-barchart(cols="6", sm="5", md="5")
          div
            v-text-field#y-input-right-barchart(
              v-model="dataset.chartDataCollection.barChartRange.yAxisRange[0]",
              hide-details,
              single-line,
              type="number",
              style="width: 60px",
              @change="onYAxisTextChange"
            ) 
        v-col#y-label-left-barchart(cols="6", sm="6", md="6")
          div
            v-text-field.y-input-left(
              v-model="dataset.chartDataCollection.barChartRange.yAxisRange[1]",
              hide-details,
              single-line,
              type="number",
              style="width: 60px",
              @change="onYAxisTextChange"
            ) 
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { parse, stringify } from "flatted";

import BarChart from "@/components/charts/BarChart";

export default {
  name: "BarChartView",
  props: {
    dataset: {
      type: Object,
      required: true,
    },
  },
  components: {
    BarChart,
  },
  data() {
    return {
      chartHeightSet: false,
      chartStyle: {
        height: "350px",
        width: "100%",
        position: "relative",
      },
      chartjsMaxY: 1,
      yAxisValues: [0, 100000],
      xAxisValues: [0, 20],
      currentDataset: "",
      barChartOptions: {
        animation: {
          duration: 0,
        },
        responsive: true,
        maintainAspectRatio: false,
        onResize: this.onResize,
        borderWidth: "30px",
        legend: {
          position: "top",
          labels: {
            fontStyle: "bold",
            fontSize: 16,
          },
          onClick: (e) => e.stopPropagation(),
        },
        scales: {
          yAxes: [
            {
              ticks: {
                fontSize: 16,
              },
              scaleLabel: {
                display: true,
                labelString: this.dataset.yAxisLabel,
                fontSize: 16,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontSize: 16,
              },
              scaleLabel: {
                display: true,
                labelString: this.dataset.xAxisLabel,
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
      console.log(
        "BarChartView.updated watcher: selectedDataset = ",
        this.dataset
      );
      // this.onXAxisSliderChange();
      this.redraw();
    },
    dataset(newValue, oldValue) {
      console.log(
        "BarChartView: dataset watcher: ref linechart = ",
        this.$refs.barChart
      );
      this.initDataset();
    },
  },
  computed: {
    ...mapGetters(["selectedDataset", "activeDataCollection", "updated"]),
    activeChartDataCollection() {
      console.log("BarChartView.activeChartDataCollection");
      let activeCollection = parse(stringify(this.dataset.chartDataCollection));

      let activeDatasets = [];
      for (var i = 0; i < activeCollection.datasets.length; i++) {
        if (this.dataset.activeCols[i]) {
          activeDatasets.push(activeCollection.datasets[i]);
        }
      }

      activeCollection.datasets = activeDatasets;

      return activeCollection;
    },
    gotData() {
      if (this.dataset) {
        console.log(
          "BarChartview.gotData: dataset = ",
          Object.freeze(this.dataset)
        );
        return true;
      }

      return false;
    },
    yMinValue() {
      return this.$refs.barChart._data._chart.scales["y-axis-0"].start;
    },
    yMaxValue() {
      return this.$refs.barChart._data._chart.scales["y-axis-0"].end;
    },
  },
  methods: {
    ...mapActions(["initYAxisValues", "resetXSlider"]),
    resizeChart(newWidth) {
      if (newWidth < 600) this.chartStyle.height = "350px";
      else if (newWidth < 960) this.chartStyle.height = "500px";
      else this.chartStyle.height = "750px";
      this.chartHeightSet = true;
    },
    onResize(chart, newSize) {
      console.log("BarChartview.onResize: newSize = ", newSize);
      this.resizeChart(newSize.width);
    },
    getXAxisLabel(val) {
      return this.dataset.chartDataCollection.labels[val];
    },
    getChartRef() {
      return this.$refs.barChartWrapper;
    },
    redraw() {
      console.log("BarChartView.redraw");

      this.barChartOptions.scales.yAxes[0].ticks.min = this.dataset.chartDataCollection.barChartRange.yAxisRange[0];
      this.barChartOptions.scales.yAxes[0].ticks.max = this.dataset.chartDataCollection.barChartRange.yAxisRange[1];
      this.barChartOptions.scales.yAxes[0].scaleLabel.labelString = this.dataset.yAxisLabel;

      let minIndex = this.dataset.chartDataCollection.barChartRange
        .xAxisRange[0];
      let maxIndex = this.dataset.chartDataCollection.barChartRange
        .xAxisRange[1];
      this.barChartOptions.scales.xAxes[0].ticks.min = this.dataset.chartDataCollection.labels[
        minIndex
      ];
      this.barChartOptions.scales.xAxes[0].ticks.max = this.dataset.chartDataCollection.labels[
        maxIndex
      ];
      this.lineChartOptions.scales.xAxes[0].scaleLabel.labelString = this.dataset.xAxisLabel;

      this.$refs.barChart.renderBarChart();
      this.resizeChart(this.$refs.barChart.$el.clientWidth);
    },
    onYAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.barChartOptions));
      tmpOptions.scales.yAxes[0].ticks.min = event[0];
      tmpOptions.scales.yAxes[0].ticks.max = event[1];
      this.barChartOptions = tmpOptions;
    },
    onYAxisTextChange() {
      // * Adjust chart axis and redraw chart
      this.setChartScales(
        this.dataset.chartDataCollection.barChartRange.yAxisRange
      );
    },
    onXAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.barChartOptions));
      tmpOptions.scales.xAxes[0].ticks.min = this.dataset.chartDataCollection.labels[
        event[0]
      ];
      tmpOptions.scales.xAxes[0].ticks.max = this.dataset.chartDataCollection.labels[
        event[1]
      ];
      this.barChartOptions = tmpOptions;
    },

    // resetYMax() {
    //   this.$nextTick(() => {
    //     this.chartjsMaxY = this.$refs.barChart._data._chart.scales[
    //       "y-axis-0"
    //     ].end;
    //     console.log("this.chartjsMaxY = ", this.chartjsMaxY);
    //     this.yAxisValues[0] = 0;
    //     this.yAxisValues[1] = this.chartjsMaxY;
    //   });
    // },
    setChartScales(arrayIn) {
      console.log("BarChartView.setChartScales: arrayIn = ", arrayIn);
      this.barChartOptions.scales.yAxes[0].ticks.min = arrayIn[0];
      this.barChartOptions.scales.yAxes[0].ticks.max = arrayIn[1];
      this.$refs.barChart.renderBarChart();
    },

    deleteChartScales() {
      delete this.barChartOptions.scales.yAxes[0].ticks.min;
      delete this.barChartOptions.scales.yAxes[0].ticks.max;
      this.$refs.barChart.renderBarChart();
    },
    resetChart() {
      console.log("BarChartView.resetChart");

      this.dataset.chartDataCollection.barChartRange.yAxisOrgMin = undefined;
      this.deleteChartScales();
      this.resetYSlider();
      this.resetXSlider();
      this.redraw();
    },
    resetYSlider() {
      // * If dataset switched
      if (
        this.currentDataset !== this.dataset.name ||
        this.dataset.chartDataCollection.barChartRange.yAxisOrgMin == undefined
      ) {
        // * Delete scales to get a "clean" chart
        // * which can be used to extract min/max scales values
        this.deleteChartScales();

        console.log(
          "BarChartView.resetYSlider: range = ",
          this.dataset.chartDataCollection.barChartRange
        );
        if (
          this.dataset.chartDataCollection.barChartRange.yAxisOrgMin ==
          undefined
        ) {
          // * If dataset not used before
          console.warn("BarChartview.resetYSlider: unitiated dataset");
          this.initYAxisValues({
            rangeType: "barChartRange",
            newMin: this.yMinValue,
            newMax: this.yMaxValue,
          });
        } else {
          // * If dataset have been used before, reset scales with
          // * selected y range
          console.log(
            "BarChartview.resetYSlider: dataset initiated, setChartScales"
          );
          this.setChartScales(
            this.dataset.chartDataCollection.barChartRange.yAxisRange
          );
        }

        this.currentDataset = this.dataset.name;
      }

      let chartjsMaxY = this.yMaxValue;
      console.log(
        "BarchartView.resetYSlider: this.chartjsMaxY = ",
        chartjsMaxY
      );
    },
    initDataset() {
      console.log("BarChartView.initDataset");

      // * set chart height based on width
      this.resizeChart(this.$refs.barChart.$el.clientWidth);

      this.$nextTick(() => {
        this.resetYSlider();
      });
    },
  },
  mounted() {
    console.log("BarChartView.mounted: dataset = ", this.dataset);
    console.log(
      "BarChartView.mounted: ref barChart = ",
      this.$refs.barChart.$el.clientWidth
    );

    this.initDataset();
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "src/style/_barChart.scss";
</style>
