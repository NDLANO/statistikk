<template lang="pug">
  v-app#app
      v-container(fluid)
        v-row
          v-col(md="12")
            h2 {{$t("general.heading")}}  
        v-row        
          v-col.toolbar(md="6")
            v-btn( @click="resetCharts")
              v-icon(large) mdi-home
              div {{ $t("general.reset") }}
              //- img(src="@/assets/home.png")
            v-btn
              v-icon(large) mdi-file-image-outline
              div {{ $t("general.saveGraph") }}
              //- img(src="@/assets/content-save.png")              
          v-col(md="6")
            v-btn(@click="onChartSelected('1')") {{ $t("general.lineGraph") }}
            v-btn(@click="onChartSelected('2')") {{ $t("general.barGraph") }}
          //- v-col(md="3")
        v-row
          v-col(v-show="selectedChart == 1" md="9")
            //- LineChartView(ref="lineChart"
            //-   :dataCollection="dataCollection"
            //-   :dataset="selectedDataset"
            //-   :lineChartOptions="lineChartOptions")
          v-col(v-show="selectedChart == 2"  md="9")
            //- BarChartView(
            //-   ref="barChart" :dataCollection="dataCollection" :lineChartOptions="lineChartOptions")
          v-col(md="3")
            v-select(v-model="selectedDataset" :items="datasets" item-text="name" @change="init" return-object outlined)
            v-btn
              v-icon(large) mdi-table-arrow-left
              div {{ $t("general.importData") }}
            //- img.import-icon.float-left(src="@/assets/table-arrow-left.png")
            DataTable.small.table(v-if="selectedDataset" :rowHeadings="keyNames" :data="selectedDataset.data" :value="selectedDataset.activeRows" @dataChanged="init")
</template>

<script>
import { readFile } from "./js/fileTools";

import LineChartView from "@/components/LineChartView";
import BarChartView from "@/components/BarChartView";
import DataTable from "@/components/DataTable";

// import Helpers from "@/js/helperFunctions"

export default {
  name: "App",
  components: {
    LineChartView,
    BarChartView,
    DataTable,
  },
  data() {
    return {
      configData: null,
      selectedDataset: null,
      dataCollection: {},
      selectedChart: 1,
      xLabels: [],
      activeRows: [],
      datasets: [],
      chartDataset: [],
      colorArray: ["#f07822", "#137a6b", "#a00"],
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
  mounted() {
    this.configData = Object.freeze(window.mfNdlaConfig);
    for(var dataset in this.configData.datasets){
      var csvData = readFile(this.configData.datasets[dataset].filename);
      // console.log("csvData = ", csvData);
      var jsonData = this.$papa.parse(csvData, { header: true, dynamicTyping: true }).data;
      this.cleanData(jsonData);
      // console.table(jsonData);
      var activeRows = Array(jsonData.length).fill(true);

      var newDataset = {
        name: this.configData.datasets[dataset].name,
        data: jsonData,
        activeRows: activeRows,
      };

      this.generateChartDataset(newDataset);

      console.log("App.mounted: newDataset  = ", newDataset);
      this.datasets.push(newDataset);

    }

    this.selectedDataset = this.datasets[0];
    // this.init();
  },
  computed: {
    keyNames() {
      if(this.selectedDataset) {
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
      // console.log("App.cleanData: loadedData = ", this.loadedData);
      for (const item in jsonArray) {
        for (const [key] of Object.entries(jsonArray[item])) {
          if (key == "") delete jsonArray[item][key];
        }
      }
    },
    // extractKeyNames() {
    //   this.keyNames = Object.keys(this.selectedDataset.data[0]);
    // },
    /**
     * initActiveRows creates an array the length of loadedData with booleans.
     * Each boolean corresponds to a row in loaded data.
     */
    // initActiveRows(dataset, randomize = false) {
    //   this.activeRows = [];
    //   for (var i = 0; i < dataset.data.length; i++) {
    //     if (randomize) {
    //       this.activeRows[i] = Math.random() < 0.5; // randomizes active state
    //     } else {
    //       this.activeRows[i] = true;
    //     }
    //   }
    //   console.log("activeRows = ", this.activeRows);
    // },
    initXLabels() {
      this.xLabels = this.getKeyValuesByIndex(0);
      console.log("xLabels = ", this.xLabels);
    },
    initRandomized() {
      // this.initActiveRows(true);
      this.fillData();
    },
    init() {
      // this.initActiveRows();
      // this.resetYMax();
      this.fillData();
    },
    fillData() {
      this.initXLabels();
      this.generateDatasets();
      this.dataCollection = {
        labels: this.xLabels,
        datasets: this.chartDataset,
      };
    },
    generateChartDataset(datasetIn) {
      let chartDataset = [];
      let xLabels = this.newGetKeyValuesByIndex(0, datasetIn);
      console.log("App.generateChartDataset: datasetIn.data = ", datasetIn.data);

      let keyArray = Object.keys(datasetIn.data[0]);
      keyArray = this.removeStringFromArray(keyArray, keyArray[0]); // remove first item/x axis
      console.log("App.generateChartDataset: keys = ", keyArray);

      let counter = 0;
      for (const key in keyArray) {
        console.log("App.generateChartDataset: key = ", keyArray[key]);
        console.log("App.generateChartDataset: for loop datasetIn.data = ", datasetIn.data);
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
          data: this.newGetKeyValuesByKey(keyArray[key], datasetIn),
        });
      }

      datasetIn.chartDataCollection = {};
      datasetIn.chartDataCollection.datasets = chartDataset;
      datasetIn.chartDataCollection.labels = xLabels;
      datasetIn.chartDataCollection.lineChart = {
        xAxisMin: 0,
        xAxisMax: xLabels.length - 1,
        xAxisRange: [0, xLabels.length - 1]
      }
      console.log("App.generateChartDataset: chartDataset = ", chartDataset);

    },
    generateDatasets() {
      this.chartDataset = [];
      let keyArray = Object.keys(this.selectedDataset.data[0]);
      keyArray = this.removeStringFromArray(keyArray, keyArray[0]); // remove first item/x axis
      console.log("keys = ", keyArray);
      let counter = 0;
      for (const key in keyArray) {
        console.log("key = ", keyArray[key]);
        console.log(
          "key values array = ",
          this.getKeyValuesByKey(keyArray[key])
        );
        const tmpColor = this.colorArray[counter];
        counter++;
        this.chartDataset.push({
          label: keyArray[key],
          fill: false,
          borderWidth: 5,
          borderColor: tmpColor,
          backgroundColor: tmpColor,
          data: this.getKeyValuesByKey(keyArray[key]),
        });
      }

      console.log("this.chartDataset = ", this.chartDataset);
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
    getKeyValuesByKey(key) {
      let valuesArray = [];
      for (var i = 0; i < this.selectedDataset.data.length; i++) {
        if (this.selectedDataset.activeRows[i]) valuesArray.push(this.selectedDataset.data[i][key]);
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
    },
    getKeyValuesByIndex(index) {
      let labelArray = [];
      for (var i = 0; i < this.selectedDataset.data.length; i++) {
        // console.log("item = ", Object.values(this.loadedData[item])[index]);
        if (this.selectedDataset.activeRows[i])
          labelArray.push(Object.values(this.selectedDataset.data[i])[index]);
      }
      return labelArray;
    },
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
  },
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
  // margin-top: 50px;
}
button {
  margin: 10px;
}
// .toolbar img {
//   padding: 0 10px;
//   cursor: pointer;
// }
</style>
