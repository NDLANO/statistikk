<template lang="pug">
  div
    v-row(v-if="gotData")
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
      v-col.chart-container(sm="11")
        LineChart(ref="lineChart" :height="700" :chart-data="dataset.chartDataCollection" :options="lineChartOptions")
    v-row(v-if="gotData")
      v-col(sm="1")
      v-col.bottom-slider(sm="11")
        v-range-slider(
          @change="onXAxisSliderChange"
          v-model="dataset.chartDataCollection.lineChart.xAxisRange"
          :min="dataset.chartDataCollection.lineChart.xAxisMin"
          :max="dataset.chartDataCollection.lineChart.xAxisMax"
          ticks="always",
          tick-size="4"
          )
          template(v-slot:prepend)
            div
              span(v-if="dataset.chartDataCollection.lineChart.xAxisRange && dataset.chartDataCollection.labels") {{ dataset.chartDataCollection.labels[dataset.chartDataCollection.lineChart.xAxisRange[0]]}}
          template(v-slot:append)
            div
              span(v-if="dataset.chartDataCollection.lineChart.xAxisRange && dataset.chartDataCollection.labels") {{ dataset.chartDataCollection.labels[dataset.chartDataCollection.lineChart.xAxisRange[1]]}}
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
    dataset: {
      type: Object,
      required: true
    }
  },
  components: {
    LineChart,
  },
  data() {
    return {
      dataReceived: false,
      yAxisValues: [0, 80000],
      xAxisValues: [0, 20],
      xAxisMin: 0,
      xAxisMax: 10,
      defaultYAxisValues: [0, 80000],
      defaultXAxisValues: [0, 20],

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
      // console.log("LineChartView.gotData: dataset = ", this.dataCollection);

      if(this.dataset) {
        console.log("LineChartview.gotData: dataset = ", Object.freeze(this.dataset));
        // if(!this.dataReceived) {
        //   this.initXAxis();
        //   this.setDataReceived();
        // }
        return true;
      }
      // if (this.dataCollection.labels && this.dataCollection.labels.length > 0) return true;

      return false;
    },
    chartData() {
      // if(this.gotData) {
      //   return {
      //     labels: 
      //   }
      // }

      return null;
    }
  },
  methods: {
    setDataReceived() {
      this.dataReceived = true;
    },
    onYAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.yAxes[0].ticks.min = event[0];
      tmpOptions.scales.yAxes[0].ticks.max = event[1];
      this.lineChartOptions = tmpOptions;
    },
    onXAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.xAxes[0].ticks.min = this.dataset.chartDataCollection.labels[event[0]];
      tmpOptions.scales.xAxes[0].ticks.max = this.dataset.chartDataCollection.labels[event[1]];
      // tmpOptions.scales.xAxes[0].ticks.min = event[0];
      // tmpOptions.scales.xAxes[0].ticks.max = event[1];
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
      console.log("--init--");
      this.resetYMax();
    },
    initXAxis() {
      // if (!this.dataCollection.lineChart) {
      //   this.dataCollection.lineChart = {};
      //   this.dataCollection.lineChart.xAxisMin = 0;
      //   this.dataCollection.lineChart.xAxisMax = this.dataCollection.labels.length - 1;
      //   this.dataCollection.lineChart.xAxisRange = [
      //     this.dataCollection.lineChart.xAxisMin,
      //     this.dataCollection.lineChart.xAxisMax
      //   ];
      //   // console.log("dataCollection.mounted: dataCollection.lineChart = ", this.dataCollection.lineChart);
      // }
    }
  },
  watch: {
    dataset(newValue, oldValue) {

      console.log("LineChartView.watcher dataCollection new value = ", newValue.labels, ", old value = ", oldValue);

      // * If no lineChart object, data is new -> init
      // if (!this.dataCollection.lineChart) {
      //   this.initXAxis();
      //   return;
      // }

      // * If data is modified, not new
      // var newXMinIndex = 0;
      // var newXMaxIndex = newValue.labels.length - 1;

      // console.log("dataCollection oldValue.length = ", oldValue);
      // if (oldValue.labels) {
      //   var oldXMinValue = oldValue.labels[this.xAxisValues[0]];
      //   console.log("dataCollection: oldXMinValue = ", oldXMinValue);
      //   newXMinIndex = newValue.labels.indexOf(oldXMinValue);
      //   if (newXMinIndex === -1) newXMinIndex = 0;

      //   var oldXMaxValue = oldValue.labels[this.xAxisValues[1]];
      //   newXMaxIndex = newValue.labels.indexOf(oldXMaxValue);
      //   if (newXMaxIndex === -1) newXMaxIndex = newValue.labels.length - 1;
      // }
      // console.log("dataCollection: newXMinIndex = ", newXMinIndex);

      // this.xAxisValues = [newXMinIndex, newXMaxIndex];
      // this.xAxisMin = 0;
      // this.xAxisMax = newValue.labels.length - 1;

    }
  },
  mounted() {
    // console.log("LineChartView.mounted: dataCollection = ", this.dataCollection);
    console.log("LineChartView.mounted: dataset = ", Object.freeze(this.dataset));

    // * Only run init if we got real data, not if we got empty object
    // if (this.gotData) this.init();
  },
};
</script>

<style lang="scss" scoped></style>
