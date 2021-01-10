<template lang="pug">
  div
    v-row(v-if="gotData")
      v-btn(@click="resetYSlider") Resett slider
      v-col.right-slider(sm="1")
        v-range-slider(
          @change="onYAxisSliderChange"
          v-model="dataset.chartDataCollection.lineChartRange.yAxisRange"
          vertical 
          :min="dataset.chartDataCollection.lineChartRange.yAxisMin"
          :max="dataset.chartDataCollection.lineChartRange.yAxisMax")
          template(v-slot:prepend)
            v-text-field(
              :value="dataset.chartDataCollection.lineChartRange.yAxisRange[0]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(dataset.chartDataCollection.lineChartRange.yAxisRange, 0, $event)")     
          template(v-slot:append)
            v-text-field(
              :value="dataset.chartDataCollection.lineChartRange.yAxisRange[1]"
              class="mt-0 pt-0"
              hide-details
              single-line
              type="number"
              style="width: 60px"
              @change="$set(dataset.chartDataCollection.lineChartRange.yAxisRange, 1, $event)")                               
      v-col.chart-container(sm="11")
        LineChart(ref="lineChart" :height="700" :chart-data="dataset.chartDataCollection" :options="lineChartOptions")
    v-row(v-if="gotData")
      v-col(sm="1")
      v-col.bottom-slider(sm="11")
        v-range-slider(
          @change="onXAxisSliderChange"
          v-model="dataset.chartDataCollection.lineChartRange.xAxisRange"
          :min="dataset.chartDataCollection.lineChartRange.xAxisMin"
          :max="dataset.chartDataCollection.lineChartRange.xAxisMax"
          ticks="always",
          tick-size="4"
          )
          template(v-slot:prepend)
            div
              span(v-if="dataset.chartDataCollection.lineChartRange.xAxisRange && dataset.chartDataCollection.labels") {{ dataset.chartDataCollection.labels[dataset.chartDataCollection.lineChartRange.xAxisRange[0]]}}
          template(v-slot:append)
            div
              span(v-if="dataset.chartDataCollection.lineChartRange.xAxisRange && dataset.chartDataCollection.labels") {{ dataset.chartDataCollection.labels[dataset.chartDataCollection.lineChartRange.xAxisRange[1]]}}
</template>

<script>
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
      yAxisValues: [0, 80000],
      lineChartOptions: {
        animation: {
          duration: 0,
        },
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: "30px",
        scales: {
          yAxes: [
            {
              ticks: {
                fontSize: 20,
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontSize: 20,
              },
            },
          ],
        },
      },
    };
  },
  computed: {
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
    yMaxValue() {
      console.log(
        "yMaxValue = ",
        this.$refs.lineChart._data._chart.scales["y-axis-0"].end
      );
      return this.$refs.lineChart._data._chart.scales["y-axis-0"].end;
    },
  },
  methods: {
    onYAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.yAxes[0].ticks.min = event[0];
      tmpOptions.scales.yAxes[0].ticks.max = event[1];
      this.dataset.chartDataCollection.lineChartRange.yAxisRange = event;
      this.lineChartOptions = tmpOptions;
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
    resetChart() {
      console.warn("LineChartView.resetChart need refactoring");
      // this.yAxisValues = [...this.defaultYAxisValues];
      // this.xAxisValues = [...this.defaultXAxisValues];
      // this.onYAxisSliderChange(this.yAxisValues);
      // this.onXAxisSliderChange(this.xAxisValues);
    },
    resetYSlider() {
      console.log("LineChartView.resetYSlider *****");
      console.log(
        "LineChartView.resetYSlider New dataset = ",
        this.dataset.name
      );
      console.log(
        "LineChartView.resetYSlider",
        this.dataset.chartDataCollection.lineChartRange.yAxisOrgMax
      );
      // this.$nextTick(() => {
      if (this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin == -1) {
        console.log(
          "LineChartView.resetYSlider: no org values",
          this.dataset.chartDataCollection.lineChartRange.yAxisRange
        );
        delete this.lineChartOptions.scales.yAxes[0].ticks.min;
        delete this.lineChartOptions.scales.yAxes[0].ticks.max;
      } else {
        // this.onYAxisSliderChange([
        //   this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin,
        //   this.dataset.chartDataCollection.lineChartRange.yAxisOrgMax
        // ])
      }
      // this.$refs.lineChart.renderLineChart();

      console.log(
        "LineChartView.resetYSlider New dataset next tick = ",
        this.dataset.name
      );

      let chartjsMinY = this.$refs.lineChart._data._chart.scales["y-axis-0"]
        .start;
      let chartjsMaxY = this.$refs.lineChart._data._chart.scales["y-axis-0"]
        .end;
      console.log(
        "LinechartView.resetYSlider: this.chartjs = ",
        this.$refs.lineChart._data._chart.scales["y-axis-0"].end
      );
      console.log(
        "LinechartView.resetYSlider: this.chartjsMaxY = ",
        chartjsMaxY
      );
      // if(this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin == -1) {
      this.dataset.chartDataCollection.lineChartRange.yAxisOrgMin = chartjsMinY;
      this.dataset.chartDataCollection.lineChartRange.yAxisOrgMax = chartjsMaxY;
      this.dataset.chartDataCollection.lineChartRange.yAxisMin = chartjsMinY;
      this.dataset.chartDataCollection.lineChartRange.yAxisMax = chartjsMaxY;
      this.dataset.chartDataCollection.lineChartRange.yAxisRange = [
        chartjsMinY,
        chartjsMaxY,
      ];
      // } else {
      //   this.onYAxisSliderChange(this.dataset.chartDataCollection.lineChartRange.yAxisRange);
      // }
      console.log(
        "LinechartView.resetYSlider: y max = ",
        this.dataset.chartDataCollection.lineChartRange.yAxisMax
      );
      console.log(
        "LineChartView.resetYSlider: next tick values",
        Object.freeze(this.dataset.chartDataCollection.lineChartRange)
      );
      // });
    },
    init() {
      console.log("--init--");
      this.resetYSlider();
    },
  },
  mounted() {
    console.log(
      "LineChartView.mounted: dataset = ",
      Object.freeze(this.dataset)
    );
    this.init();
  },
};
</script>

<style lang="scss" scoped></style>
