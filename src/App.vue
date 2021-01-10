<template lang="pug">
  v-app#app
      v-container(fluid v-if="selectedDataset")
        v-row
          v-col(md="12")
            h2 {{$t("general.heading")}}  
        v-row        
          v-col.toolbar(md="6")
            v-btn( @click="resetCharts")
              v-icon(large) mdi-home
              div {{ $t("general.reset") }}
            v-btn
              v-icon(large) mdi-file-image-outline
              div {{ $t("general.saveGraph") }}
          v-col(md="6")
            v-btn(@click="onChartSelected('1')") {{ $t("general.lineGraph") }}
            v-btn(@click="onChartSelected('2')") {{ $t("general.barGraph") }}
        v-row
          v-col(v-show="selectedChart == 1" md="9")
            LineChartView(ref="lineChart"
              :dataset="selectedDataset"
              :lineChartOptions="lineChartOptions")
          v-col(v-show="selectedChart == 2"  md="9")
            //- BarChartView(
            //-   ref="barChart" :dataCollection="dataCollection" :lineChartOptions="lineChartOptions")
          v-col(md="3")
            v-select(v-model="selectedDataset" :items="datasets" item-text="name" return-object outlined)
            v-btn
              v-icon(large) mdi-table-arrow-left
              div {{ $t("general.importData") }}
            DataTable.small.table(v-if="selectedDataset" :rowHeadings="keyNames" :data="selectedDataset.data" :value="selectedDataset.activeRows" @dataChanged="generateChartDataset(selectedDataset)")
</template>

<script>
import { readFile } from "./js/fileTools";

import LineChartView from "@/components/LineChartView";
import BarChartView from "@/components/BarChartView";
import DataTable from "@/components/DataTable";

export default {
  name: "App",
  components: {
    LineChartView,
    BarChartView,
    DataTable
  },
  data() {
    return {
      configData: null,
      selectedDataset: null,
      selectedChart: 1,
      datasets: [],
      colorArray: ["#f07822", "#137a6b", "#a00"],
      lineChartOptions: {
        animation: {
          duration: 0
        },
        responsive: true,
        borderWidth: "30px",
        scales: {
          yAxes: [
            {
              ticks: {}
            }
          ],
          xAxes: [
            {
              ticks: {}
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.configData = Object.freeze(window.mfNdlaConfig);
    for (var dataset in this.configData.datasets) {
      var csvData = readFile(this.configData.datasets[dataset].filename);
      // console.log("csvData = ", csvData);
      var jsonData = this.$papa.parse(csvData, {
        header: true,
        dynamicTyping: true
      }).data;
      this.cleanData(jsonData);
      // console.table(jsonData);
      var activeRows = Array(jsonData.length).fill(true);

      var newDataset = {
        name: this.configData.datasets[dataset].name,
        data: jsonData,
        activeRows: activeRows
      };

      this.generateChartDataset(newDataset);

      console.log("App.mounted: newDataset  = ", newDataset);
      this.datasets.push(newDataset);
    }

    this.selectedDataset = this.datasets[0];
  },
  computed: {
    keyNames() {
      if (this.selectedDataset) {
        return Object.keys(this.selectedDataset.data[0]);
      }

      return [];
    }
  },
  methods: {
    onChartSelected(selected) {
      console.log("onChartSelected = ", selected);
      this.selectedChart = selected;
    },
    resetCharts() {
      this.$refs.lineChart.resetChart();
    },
    // * Removes empty object keys
    cleanData(jsonArray) {
      for (const item in jsonArray) {
        for (const [key] of Object.entries(jsonArray[item])) {
          if (key == "") delete jsonArray[item][key];
        }
      }
    },
    generateChartDataset(datasetIn) {
      let chartDataset = [];
      let xLabels = this.newGetKeyValuesByIndex(0, datasetIn);
      console.log(
        "App.generateChartDataset: datasetIn.data = ",
        datasetIn.data
      );

      let keyArray = Object.keys(datasetIn.data[0]);
      keyArray = this.removeStringFromArray(keyArray, keyArray[0]); // remove first item/x axis
      console.log("App.generateChartDataset: keys = ", keyArray);

      let counter = 0;
      for (const key in keyArray) {
        console.log("App.generateChartDataset: key = ", keyArray[key]);
        console.log(
          "App.generateChartDataset: for loop datasetIn.data = ",
          datasetIn.data
        );
        console.log(
          "App.generateChartDataset: key values array = ",
          this.newGetKeyValuesByKey(keyArray[key], datasetIn)
        );

        const tmpColor = this.colorArray[counter];
        counter++;
        chartDataset.push({
          label: keyArray[key],
          fill: false,
          borderWidth: 5,
          borderColor: tmpColor,
          backgroundColor: tmpColor,
          data: this.newGetKeyValuesByKey(keyArray[key], datasetIn)
        });
      }

      if (!datasetIn.chartDataCollection) {
        datasetIn.chartDataCollection = {};
      } else {
        datasetIn.chartDataCollection = { ...datasetIn.chartDataCollection };
      }
      datasetIn.chartDataCollection.datasets = chartDataset;
      datasetIn.chartDataCollection.oldLabels = [];
      if (datasetIn.chartDataCollection.labels) {
        datasetIn.chartDataCollection.oldLabels = [
          ...datasetIn.chartDataCollection.labels
        ];
      }
      datasetIn.chartDataCollection.labels = xLabels;
      datasetIn.chartDataCollection.lineChartRange = this.generateLineChartRange(
        datasetIn.chartDataCollection
      );

      if (this.$refs.lineChart) this.$refs.lineChart.resetYSlider();
    },
    generateLineChartRange(dataCollection) {
      let chartRange = {
        xAxisMin: 0,
        xAxisMax: dataCollection.labels.length - 1,
        xAxisRange: [0, dataCollection.labels.length - 1],
        yAxisOrgMin: -1,
        yAxisOrgMax: -1,
        yAxisMin: 0,
        yAxisMax: 100,
        yAxisRange: [0, 200]
      };
      if (dataCollection.lineChartRange) {
        var oldXRangeMin =
          dataCollection.oldLabels[dataCollection.lineChartRange.xAxisRange[0]];
        var newXRangeMinIndex = dataCollection.labels.indexOf(oldXRangeMin);
        if (newXRangeMinIndex === -1) newXRangeMinIndex = 0;

        var oldXRangeMax =
          dataCollection.oldLabels[dataCollection.lineChartRange.xAxisRange[1]];
        var newXRangeMaxIndex = dataCollection.labels.indexOf(oldXRangeMax);
        if (newXRangeMaxIndex === -1)
          newXRangeMaxIndex = dataCollection.labels.length - 1;

        chartRange.xAxisRange = [newXRangeMinIndex, newXRangeMaxIndex];

      }
      return chartRange;
    },
    removeStringFromArray(inputArray, inputString) {
      let newArray = [...inputArray];
      let stringIndex = newArray.indexOf(inputString);
      newArray.splice(stringIndex, 1);
      return newArray;
    },
    newGetKeyValuesByKey(key, dataset) {
      let valuesArray = [];
      for (var i = 0; i < dataset.data.length; i++) {
        if (dataset.activeRows[i]) valuesArray.push(dataset.data[i][key]);
      }
      return valuesArray;
    },
    newGetKeyValuesByIndex(index, dataset) {
      let labelArray = [];
      for (var i = 0; i < dataset.data.length; i++) {
        // console.log("item = ", Object.values(this.loadedData[item])[index]);
        if (dataset.activeRows[i])
          labelArray.push(Object.values(dataset.data[i])[index]);
      }
      return labelArray;
    }
    // getRandomColor() {
    //   var letters = "0123456789ABCDEF";
    //   var color = "#";
    //   for (var i = 0; i < 6; i++) {
    //     color += letters[Math.floor(Math.random() * 16)];
    //   }
    //   return color;
    // },
    // getRandomInt() {
    //   return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    // },
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  padding-top: 60px;
}
.table {
  margin: 10px;
}
button {
  margin: 10px;
}
</style>
