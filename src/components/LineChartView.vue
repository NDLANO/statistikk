<template lang="pug">
#linegraph-div
  v-row(v-if="gotData")
    v-col.y-left-slider(sm="2")
      v-row 
        v-col.y-slider-text
          input.mt20(
            type="number",
            v-model="dataset.chartDataCollection.lineChartRange.yAxisRange[1]",
            :min="dataset.chartDataCollection.lineChartRange.yAxisMin",
            :max="dataset.chartDataCollection.lineChartRange.yAxisMax",
            @change="onYAxisTextChange"
          ) 
      v-row.y-slider-wrapper
        v-col
          v-range-slider.y-slider(
            @change="onYAxisSliderChange",
            v-model="dataset.chartDataCollection.lineChartRange.yAxisRange",
            :min="dataset.chartDataCollection.lineChartRange.yAxisMin",
            :max="dataset.chartDataCollection.lineChartRange.yAxisMax",
            vertical
          )
      v-row 
        v-col.y-slider-text
          input(
            type="number",
            v-model="dataset.chartDataCollection.lineChartRange.yAxisRange[0]",
            :min="dataset.chartDataCollection.lineChartRange.yAxisMin",
            :max="dataset.chartDataCollection.lineChartRange.yAxisMax",
            @change="onYAxisTextChange"
          )
    v-col.chart-container(sm="10", ref="lineChartWrapper")
      LineChart(
        v-show="chartHeightSet",
        ref="lineChart",
        :style="chartStyle",
        :chart-data="activeChartDataCollection",
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
        v-col.y-bottom-slider(cols="12", sm="11", md="11")
          v-range-slider.y-slider-mobile-bottom(
            @change="onYAxisSliderChange",
            v-model="dataset.chartDataCollection.lineChartRange.yAxisRange",
            :min="dataset.chartDataCollection.lineChartRange.yAxisMin",
            :max="dataset.chartDataCollection.lineChartRange.yAxisMax"
          )
      v-row#y-label-row
        v-col#y-label-right(cols="6", sm="5", md="5")
          div
            input#y-input-right(
              type="number",
              v-model="dataset.chartDataCollection.lineChartRange.yAxisRange[0]",
              :min="dataset.chartDataCollection.lineChartRange.yAxisMin",
              :max="dataset.chartDataCollection.lineChartRange.yAxisMax",
              @change="onYAxisTextChange"
            )
        v-col#y-label-left(cols="6", sm="6", md="6")
          div
            input.y-input-left(
              type="number",
              v-model="dataset.chartDataCollection.lineChartRange.yAxisRange[1]",
              :min="dataset.chartDataCollection.lineChartRange.yAxisMin",
              :max="dataset.chartDataCollection.lineChartRange.yAxisMax",
              @change="onYAxisTextChange"
            )
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { parse, stringify } from "flatted";

import { findMinYValue } from "@/js/helpers";

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
      chartHeightSet: false,
      chartStyle: {
        height: "350px",
        width: "100%",
        position: "relative",
      },
      currentDataset: "",
      lineChartOptions: {
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
      console.log("LineChartView: updated watcher");
      this.initDataset();
    },
    dataset(newValue, oldValue) {
      console.log("LineChartView: dataset watcher");
      console.log(
        "LineChartView: dataset watcher: ref linechart = ",
        this.$refs.lineChart
      );
      this.initDataset();
    },
  },
  computed: {
    ...mapGetters(["selectedDataset", "activeDataCollection", "updated"]),
    activeChartDataCollection() {
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
          "LineChartview.gotData: dataset = ",
          Object.freeze(this.dataset)
        );
        console.log(
          "LineChartView.gotData: ref linechart = ",
          this.$refs.lineChart
        );
        return true;
      }

      return false;
    },
    yMinValue() {
      if (typeof this.$refs.lineChart !== "undefined") {
        return findMinYValue(this.dataset);
      }
      return null;
    },
    yMaxValue() {
      if (typeof this.$refs.lineChart !== "undefined") {
        return this.$refs.lineChart._data._chart.scales["y-axis-0"].end;
      }
      return null;
    },
  },
  methods: {
    ...mapActions(["initYAxisValues", "resetXSlider"]),
    resizeChart(newWidth) {
      console.log("LineChartview.resizeChart: newWidth = ", newWidth);
      if (newWidth < 600) this.chartStyle.height = "350px";
      else if (newWidth < 960) this.chartStyle.height = "500px";
      else this.chartStyle.height = "750px";
      this.chartHeightSet = true;
    },
    onResize(chart, newSize) {
      this.resizeChart(newSize.width);
    },
    getXAxisLabel(val) {
      return this.dataset.chartDataCollection.labels[val];
    },
    getChartRef() {
      return this.$refs.lineChartWrapper;
    },
    redraw() {
      console.log(
        "LineChartView.redraw: dataset = ",
        parse(stringify(this.dataset))
      );

      // * Y axis
      this.lineChartOptions.scales.yAxes[0].ticks.min = this.dataset.chartDataCollection.lineChartRange.yAxisRange[0];
      this.lineChartOptions.scales.yAxes[0].ticks.max = this.dataset.chartDataCollection.lineChartRange.yAxisRange[1];

      this.lineChartOptions.scales.yAxes[0].scaleLabel.labelString = this.dataset.yAxisLabel;

      // * X axis
      let minIndex = this.dataset.chartDataCollection.lineChartRange
        .xAxisRange[0];
      let maxIndex = this.dataset.chartDataCollection.lineChartRange
        .xAxisRange[1];
      this.lineChartOptions.scales.xAxes[0].ticks.min = this.dataset.chartDataCollection.labels[
        minIndex
      ];
      this.lineChartOptions.scales.xAxes[0].ticks.max = this.dataset.chartDataCollection.labels[
        maxIndex
      ];
      this.lineChartOptions.scales.xAxes[0].scaleLabel.labelString = this.dataset.xAxisLabel;

      this.lineChartOptions.onResize = this.onResize;
      this.$refs.lineChart.renderLineChart();
      this.resizeChart(this.$refs.lineChart.$el.clientWidth);
    },
    onYAxisSliderChange(event) {
      console.log("LineChartView.onYAxisSliderChange: event = ", event);
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.yAxes[0].ticks.min = event[0];
      tmpOptions.scales.yAxes[0].ticks.max = event[1];
      tmpOptions.legend.onClick = (e) => e.stopPropagation();
      this.dataset.chartDataCollection.lineChartRange.yAxisRange = event;
      this.lineChartOptions = tmpOptions;
    },
    onYAxisTextChange() {
      this.onYAxisSliderChange(
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
      tmpOptions.legend.onClick = (e) => e.stopPropagation();

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
      console.log("LineChartView.deleteChartScales");
      delete this.lineChartOptions.scales.yAxes[0].ticks.min;
      delete this.lineChartOptions.scales.yAxes[0].ticks.max;
      this.$refs.lineChart.renderLineChart();
    },
    setChartScalesToOriginal() {
      console.log("LineChartView.setChartScalesToOriginal");

      // * set chart min/max
      this.lineChartOptions.scales.yAxes[0].ticks.min = this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin;
      this.dataset.chartDataCollection.lineChartRange.yAxisMin = this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin;
      this.lineChartOptions.scales.yAxes[0].ticks.max = this.dataset.chartDataCollection.lineChartRange.yAxisOrgMax;

      // * set yAxisRange to new chart min/max
      this.dataset.chartDataCollection.lineChartRange.yAxisRange = [
        this.yMinValue,
        this.yMaxValue,
      ];
      console.log(
        "LineChartView.setChartScalesToOriginal: y range = ",
        this.dataset.chartDataCollection.lineChartRange.yAxisRange
      );
      this.$refs.lineChart.renderLineChart();
    },
    resetChart(resetToOrgAxisLimits = false) {
      console.log("LineChartView.resetChart");
      if (!resetToOrgAxisLimits)
        this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin = undefined;
      this.resetYSlider(resetToOrgAxisLimits);
      this.resetXSlider();
      this.redraw();
    },
    resetYSlider(resetToOrgAxisLimits = false) {
      console.log(
        "LineChartView.resetYSlider: resetToOrgAxisLimits = ",
        resetToOrgAxisLimits
      );
      // * If dataset switched, yAxisOrgMin not defined or resetToOrgAxisLimits
      if (
        this.currentDataset !== this.dataset.name ||
        this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin ==
          undefined ||
        resetToOrgAxisLimits
      ) {
        // * Delete scales to get a "clean" chart
        // * which can be used to extract min/max scales values
        console.log("LineChartView.resetYSlider: Dataset changed or new");
        if (this.currentDataset !== this.dataset.name) {
          this.deleteChartScales();
        } else {
          this.setChartScalesToOriginal();
        }

        if (
          this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin ==
          undefined
        ) {
          // * If dataset not used before create new org min/max and min/max variables
          console.warn(
            "LineChartview.resetYSlider: unitiated dataset - yMin = ",
            this.yMinValue,
            ", yMaxValue = ",
            this.yMaxValue
          );
          this.initYAxisValues({
            rangeType: "lineChartRange",
            newMin: this.yMinValue,
            newMax: this.yMaxValue,
          });
        } else if (resetToOrgAxisLimits) {
          console.log(
            "LineChartView.resetYSlider: resetToOrgAxisLimits true, setting to original"
          );
          this.setChartScalesToOriginal();
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
        this.redraw();
      } else {
        console.log("LineChartView.resetYSlider: Doing redraw");
        this.redraw();
      }
    },
    initDataset() {
      console.log("LineChartView.initDataset");

      this.resizeChart(this.$refs.lineChart.$el.clientWidth);

      this.$nextTick(() => {
        // * set chart height based on width
        this.resizeChart(this.$refs.lineChart.$el.clientWidth);
        this.resetYSlider();
      });
    },
  },
  mounted() {
    console.log("LineChart.mounted: dataset = ", this.dataset);
    this.initDataset();
  },
  created() {},
};
</script>

<style lang="scss" scoped>
@import "src/style/_lineChart.scss";
</style>
