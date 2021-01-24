<template lang="pug">
v-app#app
  v-container(fluid, v-if="selectedDataset")
    v-row#heading_row 
      v-col
        h2 {{ $t('general.heading') }}
    v-row
      v-col#filter_col(cols="12", sm="12", md="6")
        v-row#filter_row
          v-col(cols="12", sm="4", md="4")
            #dataset_lbl.font-weight-bold
              label Dataset
            v-select(
              v-model="selectedDatasetName",
              @change="onSelectChange()",
              :items="datasetNames",
              item-text="name",
              outlined
            )
          v-col#diagramtype_col(cols="12", sm="4", md="4")
            v-toolbar(flat)
              v-radio-group(v-model="selectedChart")
                v-flex.flex-nowrap.flex-shrink-1(row)
                  label.font-weight-bold.mr-1 DiagramType
                  v-radio.mr-1(
                    name="selectedChart",
                    :value="1",
                    key="1",
                    label="Linje",
                    color="#20588F"
                  ) 
                  v-radio.mb-2(
                    name="selectedChart",
                    :value="2",
                    key="2",
                    label="Stolpe",
                    color="#20588F"
                  )

          v-col#resetchart_col(cols="12", sm="4", md="4")
            v-btn#btn.mt-n4.primary--text.text--darken-3.font-weight-bold(
              @click="resetCharts",
              color="#DEEBF6",
              rounded
            )
              div {{ $t('general.reset') }}
        v-row.justify-center(cols="12", sm="12", md="6")
          v-col(v-show="selectedChart == 1")
            LineChartView(
              ref="lineChart",
              :dataset="selectedDataset",
              :lineChartOptions="lineChartOptions",
              @minMaxChanged="onLineChartMinMaxChanged"
            )
          v-col(v-show="selectedChart == 2")
            BarChartView(
              ref="barChart",
              :dataCollection="selectedDataset.chartDataCollection",
              :lineChartOptions="lineChartOptions"
            ) 

      v-col#datatable_column(cols="12", sm="12", md="6")
        v-row
          v-col#download_btn(cols="12", sm="6", md="6")
            v-btn#btn.font-weight-bold(
              @click="saveScreenshot",
              icon,
              color="#20588F"
            )
              v-icon.mr-2(color="#20588F") mdi-cloud-download
              div {{ $t('general.saveGraph') }}
          v-col#import_btn(cols="12", sm="6", md="6")
            input(
              type="file",
              ref="csvFile",
              accept=".csv",
              style="display: none",
              @change="onFileSelected"
            ) 
            v-btn#btn.font-weight-bold(
              @click="$refs.csvFile.click()",
              color="#20588F",
              rounded,
              dark
            )
              div {{ $t('general.importData') }}
        v-row(cols="12", sm="12", md="6")
          v-col
            DataTable.small.table(
              v-if="selectedDataset",
              :rowHeadings="keyNames",
              :data="selectedDataset.data",
              :value="selectedDataset.activeRows",
              @dataChanged="onActiveRowsChanged"
            )
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { readFile, readFileObject } from "./js/fileTools";
import { cleanCsvString } from "@/js/csvTools";

import LineChartView from "@/components/LineChartView";
import BarChartView from "@/components/BarChartView";
import DataTable from "@/components/DataTable";

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
      selectedDatasetName: undefined,
      // selectedDataset: null,
      selectedChart: 1,
      // datasets: [],
      // colorArray: ["#f07822", "#137a6b", "#a00"],
      colorArray: [
        "#ffbe0bff",
        "#fb5607ff",
        "#ff006eff",
        "#8338ecff",
        "#3a86ffff",
        "#134611ff",
        "#410b13ff",
        "#0b032dff",
        "#75dbcdff",
        "#1e212bff",
      ],
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
    for (var dataset in this.configData.datasets) {
      var csvData = readFile(this.configData.datasets[dataset].filename);
      console.log("csvData = ", csvData);
      this.addCsvData(csvData, this.configData.datasets[dataset].name);
    }

    this.selectedDatasetName = this.selectedDataset.name;
    console.log("App.mounted: selectedDataset = ", this.selectedDataset.name);
  },
  computed: {
    ...mapGetters(["selectedDataset", "datasetNames"]),
    keyNames() {
      if (this.selectedDataset) {
        return Object.keys(this.selectedDataset.data[0]);
      }

      return [];
    },
  },
  methods: {
    ...mapActions(["addDataset", "selectDataset", "setActiveRows"]),
    addCsvData(csvData, datasetName) {
      csvData = cleanCsvString(csvData);

      var jsonData = this.$papa.parse(csvData, {
        header: true,
        dynamicTyping: false,
        transformHeader: function (h) {
          return h.toString();
        },
      }).data;
      console.log("App.addCsvData: jsonData = ", jsonData);
      this.cleanData(jsonData);
      console.log("App.addCsvData: cleaned jsonData = ", jsonData);
      // console.table(jsonData);
      var activeRows = Array(jsonData.length).fill(true);

      var newDataset = {
        name: datasetName,
        data: jsonData,
        activeRows: activeRows,
      };

      this.generateChartDataset(newDataset);
      this.addDataset(newDataset);
      this.selectedDatasetName = datasetName;
    },
    async saveScreenshot() {
      if (this.selectedChart === 1) {
        const options = {
          type: "dataURL",
        };
        var output = await this.$html2canvas(
          this.$refs.lineChart.getChartRef(),
          options
        );

        var filename = "linjegraf";
      }
      var img = output;
      var alink = document.createElement("a");
      alink.href = img;
      alink.download = filename + ".png";
      alink.click();
    },
    async onFileSelected() {
      console.log(
        "App.onFileSelected: File selected = ",
        this.$refs.csvFile.files[0]
      );
      let file = this.$refs.csvFile.files[0];
      let fileContents = "";

      try {
        fileContents = await readFileObject(file);
        // console.log("App.onFileSelected: fileContents =", fileContents);
        this.addCsvData(fileContents, file.name);
        this.onSelectChange();
      } catch (err) {
        console.error(err);
      }
    },
    onActiveRowsChanged() {
      console.log(
        "App.onActiveRowsChanged: active rows = ",
        this.selectedDataset.activeRows
      );
      this.setActiveRows(this.selectedDataset.activeRows);
    },
    onLineChartMinMaxChanged(newMin, newMax) {
      console.log(
        "App.onLineChartMinMaxChanged: newMin = ",
        newMin,
        ", newMax = ",
        newMax
      );
    },
    onSelectChange() {
      console.log(
        "App.onSelectChange: selectedDatasetName = ",
        this.selectedDatasetName
      );

      console.log("this.datasets = ", this.datasets);
      // eslint-disable-next-line prettier/prettier
      // debugger;
      // this.selectedDataset = this.datasets.find((dataset) => {
      //   return dataset.name === this.selectedDatasetName;
      // });

      this.selectDataset(this.selectedDatasetName);
      // * nextTick is needed to make sure selectedDataset is refreshed in chart
      this.$nextTick(() => {
        this.$refs.lineChart.resetYSlider();
      });
    },
    onChartSelected(selected) {
      console.log("onChartSelected = ", selected);
      this.selectedChart = selected;
    },
    resetCharts() {
      if (this.selectedChart === 1) {
        this.$refs.lineChart.resetChart();
      }
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
      datasetIn.keys = keyArray;
      // console.log("App.generateChartDataset: keys = ", keyArray);

      let counter = 0;
      for (const key in keyArray) {
        // console.log("App.generateChartDataset: key = ", keyArray[key]);
        // console.log(
        //   "App.generateChartDataset: for loop datasetIn.data = ",
        //   datasetIn.data
        // );
        // console.log(
        //   "App.generateChartDataset: key values array = ",
        //   this.newGetKeyValuesByKey(keyArray[key], datasetIn)
        // );

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

      if (!datasetIn.chartDataCollection) {
        datasetIn.chartDataCollection = {};
      } else {
        datasetIn.chartDataCollection = { ...datasetIn.chartDataCollection };
      }

      datasetIn.chartDataCollection.datasets = chartDataset;
      datasetIn.chartDataCollection.labels = xLabels;
      datasetIn.chartDataCollection.oldLabels = [];
      if (datasetIn.chartDataCollection.labels) {
        datasetIn.chartDataCollection.oldLabels = [
          ...datasetIn.chartDataCollection.labels,
        ];
      }
      datasetIn.chartDataCollection.lineChartRange = this.generateLineChartRange(
        datasetIn.chartDataCollection
      );

      if (this.$refs.lineChart) this.$refs.lineChart.resetYSlider();
    },
    generateLineChartRange(dataCollection) {
      // * Create charRange object with default values
      let chartRange = {
        xAxisMin: 0,
        xAxisMax: dataCollection.labels.length - 1,
        xAxisRange: [0, dataCollection.labels.length - 1],
        yAxisOrgMin: undefined,
        yAxisOrgMax: undefined,
        yAxisMin: 0,
        yAxisMax: 10000,
        yAxisRange: [0, 200],
      };
      // debugger;
      console.log("App.generateLineChartRange initiated");

      // * Modify values if lineCharRange values already exist
      if (dataCollection.lineChartRange) {
        console.log(
          "App.generateLineCharRange: old range detected: ",
          dataCollection.lineChartRange
        );
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

        chartRange.yAxisMin = dataCollection.lineChartRange.yAxisOrgMin;
        chartRange.yAxisMax = dataCollection.lineChartRange.yAxisOrgMax;
        chartRange.yAxisRange = [...dataCollection.lineChartRange.yAxisRange];
      } else {
        console.warn(
          "App.generateLineChartRange: New chart range, not yet initiated: ",
          dataCollection
        );
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
@import "src/style/_main.scss";
</style>
