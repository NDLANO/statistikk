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
            LineChartView(ref="lineChart" :dataCollection="dataCollection" :lineChartOptions="lineChartOptions")
          v-col(v-show="selectedChart == 2"  md="9")
            BarChartView(ref="barChart" :dataCollection="dataCollection" :lineChartOptions="lineChartOptions")
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
      // loadedData: [
      //   {
      //     År: 0,
      //     Diesel: 8100,
      //     El: 12000,
      //     "": "",
      //   },
      //   {
      //     År: 1,
      //     Diesel: 11355,
      //     El: 12825,
      //     "": "",
      //   },
      //   {
      //     År: 2,
      //     Diesel: 14610,
      //     El: 13650,
      //     "": "",
      //   },
      //   {
      //     År: 3,
      //     Diesel: 17865,
      //     El: 14475,
      //     "": "",
      //   },
      //   {
      //     År: 4,
      //     Diesel: 21120,
      //     El: 15300,
      //     "": "",
      //   },
      //   {
      //     År: 5,
      //     Diesel: 24375,
      //     El: 16125,
      //     "": "",
      //   },
      //   {
      //     År: 6,
      //     Diesel: 27630,
      //     El: 16950,
      //     "": "",
      //   },
      //   {
      //     År: 7,
      //     Diesel: 30885,
      //     El: 17775,
      //     "": "",
      //   },
      //   {
      //     År: 8,
      //     Diesel: 34140,
      //     El: 18600,
      //     "": "",
      //   },
      //   {
      //     År: 9,
      //     Diesel: 37395,
      //     El: 19425,
      //     "": "",
      //   },
      //   {
      //     År: 10,
      //     Diesel: 40650,
      //     El: 20250,
      //     "": "",
      //   },
      //   {
      //     År: 11,
      //     Diesel: 43905,
      //     El: 21075,
      //     "": "",
      //   },
      //   {
      //     År: 12,
      //     Diesel: 47160,
      //     El: 21900,
      //     "": "",
      //   },
      //   {
      //     År: 13,
      //     Diesel: 50415,
      //     El: 22725,
      //     "": "",
      //   },
      //   {
      //     År: 14,
      //     Diesel: 53670,
      //     El: 23550,
      //     "": "",
      //   },
      //   {
      //     År: 15,
      //     Diesel: 56925,
      //     El: 24375,
      //     "": "",
      //   },
      //   {
      //     År: 16,
      //     Diesel: 60180,
      //     El: 25200,
      //     "": "",
      //   },
      //   {
      //     År: 17,
      //     Diesel: 63435,
      //     El: 26025,
      //     "": "",
      //   },
      //   {
      //     År: 18,
      //     Diesel: 66690,
      //     El: 26850,
      //     "": "",
      //   },
      //   {
      //     År: 19,
      //     Diesel: 69945,
      //     El: 27675,
      //     "": "",
      //   },
      //   {
      //     År: 20,
      //     Diesel: 73200,
      //     El: 28500,
      //     "": "",
      //   },
      // ],
      selectedChart: 1,
      xLabels: [],
      activeRows: [],
      datasets: [],
      chartDataset: [],
      // keyNames: [],
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

      // console.log("newDataset  = ", newDataset);
      this.datasets.push(newDataset);

    }

    this.selectedDataset = this.datasets[0];
    this.init();
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
    getKeyValuesByKey(key) {
      let valuesArray = [];
      for (var i = 0; i < this.selectedDataset.data.length; i++) {
        if (this.selectedDataset.activeRows[i]) valuesArray.push(this.selectedDataset.data[i][key]);
      }
      return valuesArray;
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
