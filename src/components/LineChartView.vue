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
      v-col.chart-container(sm="11")
        LineChart(ref="lineChart" :height="700" :chart-data="dataCollection" :options="lineChartOptions")
    v-row
      v-col(sm="1")
      v-col.bottom-slider(sm="11")
        v-range-slider(
          @change="onXAxisSliderChange"
          v-model="xAxisValues"
          :min="xAxisMin"
          :max="xAxisMax"
          ticks="always",
          tick-size="4"
          )
          template(v-slot:prepend)
            div
              span(v-if="xAxisValues && dataCollection.labels") {{ dataCollection.labels[xAxisValues[0]]}}
          //-   v-text-field(
          //-     :value="xAxisValues[0]"
          //-     class="mt-0 pt-0"
          //-     hide-details
          //-     single-line
          //-     type="number"
          //-     style="width: 60px"
          //-     @change="$set(xAxisValues, 0, $event)")              
          template(v-slot:append)
            div
              span(v-if="xAxisValues && dataCollection.labels") {{ dataCollection.labels[xAxisValues[1]]}}
          //-   v-text-field(
          //-     :value="xAxisValues[1]"
          //-     class="mt-0 pt-0"
          //-     hide-details
          //-     single-line
          //-     type="number"
          //-     style="width: 60px"
          //-     @change="$set(xAxisValues, 1, $event)")               
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
  methods: {
    onYAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.yAxes[0].ticks.min = event[0];
      tmpOptions.scales.yAxes[0].ticks.max = event[1];
      this.lineChartOptions = tmpOptions;
    },
    onXAxisSliderChange(event) {
      const tmpOptions = JSON.parse(JSON.stringify(this.lineChartOptions));
      tmpOptions.scales.xAxes[0].ticks.min = this.dataCollection.labels[event[0]];
      tmpOptions.scales.xAxes[0].ticks.max = this.dataCollection.labels[event[1]];
      // tmpOptions.scales.xAxes[0].ticks.min = event[0];
      // tmpOptions.scales.xAxes[0].ticks.max = event[1];
      console.log("tmpOptions = ", tmpOptions);
      this.lineChartOptions = tmpOptions;
    },
    resetChart() {
      this.yAxisValues = [...this.defaultYAxisValues];
      this.xAxisValues = [...this.defaultXAxisValues];
      this.onYAxisSliderChange(this.yAxisValues);
      this.onXAxisSliderChange(this.xAxisValues);
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
  watch: {
    dataCollection(newValue, oldValue) {

      console.log("datacollection new value = ", newValue.labels, ", old value = ", oldValue);

      var newXMinIndex = 0;
      var newXMaxIndex = newValue.labels.length - 1;

      console.log("dataCollection oldValue.length = ", oldValue);
      if(oldValue.labels) {
        var oldXMinValue = oldValue.labels[this.xAxisValues[0]];
        console.log("dataCollection: oldXMinValue = ", oldXMinValue);
        newXMinIndex = newValue.labels.indexOf(oldXMinValue);
        if(newXMinIndex === -1) newXMinIndex = 0;

        var oldXMaxValue = oldValue.labels[this.xAxisValues[1]];
        newXMaxIndex = newValue.labels.indexOf(oldXMaxValue);
        if(newXMaxIndex === -1) newXMaxIndex = newValue.labels.length - 1;
      }
      console.log("dataCollection: newXMinIndex = ", newXMinIndex);

      this.xAxisValues = [newXMinIndex, newValue.labels.length - 1];
      this.xAxisMin = 0;
      this.xAxisMax = newValue.labels.length - 1;

    }
  },
  mounted() {
    console.log("datacollection = ", this.dataCollection.labels[0]);
    this.init();
  },
};
</script>

<style lang="scss" scoped></style>
