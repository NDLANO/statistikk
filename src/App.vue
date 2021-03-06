<template lang="pug">
v-app#app
  v-container.my-n6(fluid, v-if="selectedDataset")
    v-row#sub-head-row
      v-col#filters-top-col(cols="12", sm="12", md="7")
        v-row#filters-row
          v-col(cols="12", sm="4", md="4")
            #dataset-lbl.font-weight-bold
              label {{ $t('general.dataset') }}
            v-select(
              v-model="selectedDatasetName",
              @change="onSelectChange()",
              :items="datasetNames",
              item-text="name",
              outlined
            )
            a.credits.dblock(
              v-if="selectedDataset.creditsLink",
              :href="selectedDataset.creditsLink",
              target="_blank"
            ) {{ $t('general.source')}}: {{ selectedDataset.creditsText }}
            .credits(v-else) {{ $t('general.source')}}: {{ selectedDataset.creditsText }}
          v-col#diagramtype-label-col(cols="4", sm="2", md="2")
            #diagramtype-lbl.font-weight-bold
              label {{ $t('general.chartType') }}:
          v-col#diagramtype-col(cols="8", sm="3", md="3")
            v-radio-group(v-model="selectedChart", row)
              v-radio(
                name="selectedChart",
                :value="1",
                key="1",
                label="Linje",
                color="#20588F"
              )
              v-radio(
                name="selectedChart",
                :value="2",
                key="2",
                label="Stolpe",
                color="#20588F"
              )

          v-col#resetchart-col(cols="12", sm="3", md="3")
            v-btn.ndla-btn.mt-n4.primary--text.text--darken-3.font-weight-bold.reset_btn(
              @click="resetCharts",
              color="#DEEBF6",
              rounded
            )
              div {{ $t('general.reset') }}
        v-row.justify-center(cols="12", sm="12", md="7")
          v-col#linegraph-col(v-if="selectedChart == 1")
            LineChartView(
              ref="lineChart",
              :dataset="selectedDataset",
              :lineChartOptions="lineChartOptions",
              @minMaxChanged="onLineChartMinMaxChanged"
            )
          v-col#bargraph-col(v-if="selectedChart == 2")
            BarChartView(
              ref="barChart",
              :dataset="selectedDataset",
              :lineChartOptions="lineChartOptions"
            ) 

      v-col(cols="12", sm="12", md="5")
        v-row
          v-col#download-btn(cols="12", sm="6", md="6")
            v-btn.ndla-btn.font-weight-bold(
              @click="saveScreenshot",
              icon,
              color="#20588F"
            )
              v-icon.mr-2(color="#20588F") mdi-cloud-download
              div {{ $t('general.saveGraph') }}
          v-col#import-btn(cols="12", sm="6", md="6")
            ModalImportFile(ref="importModal", @fileSelected="onFileSelected")
            v-btn.ndla-btn.font-weight-bold(
              @click="$refs.importModal.openDialog()",
              color="#20588F",
              rounded,
              dark
            )
              div {{ $t('general.importData') }}
        v-row#datatable-row(cols="12", sm="12", md="6")
          v-col
            DataTable.small.table(
              v-if="selectedDataset",
              :rowHeadings="keyNames",
              :data="selectedDataset.data",
              v-model="selectedDataset.activeRows",
              :activeCols="selectedDataset.activeCols",
              @dataChanged="onActiveRowsChanged",
              @colsChanged="onActiveColsChanged"
            )
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex";
import { readFile, readFileObject } from "./js/fileTools";
import { processCsvString } from "@/js/csvTools";

import LineChartView from "@/components/LineChartView";
import BarChartView from "@/components/BarChartView";
import DataTable from "@/components/DataTable";
import ModalImportFile from "@/components/ModalImportFile";

export default {
  name: "App",
  components: {
    LineChartView,
    BarChartView,
    DataTable,
    ModalImportFile,
  },
  data() {
    return {
      configData: null,
      selectedDatasetName: undefined,
      selectedChart: 1,
      colorArray: [
        "#2E7D32",
        "#00898E",
        "#0D47A1",
        "#1976D2",
        "#AB47BC",
        "#4A148C",
        "#FF3C00",
        "#E65100",
        "#BF360C",
        "#8D6E63",
        "#424242",
      ],
      lineChartOptions: {
        animation: {
          duration: 0,
        },
        responsive: true,
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
    if (this.langCode == "nn") {
      this.configData = Object.freeze(window.mfNdlaConfigNN);
    } else {
      this.configData = Object.freeze(window.mfNdlaConfig);
    }
    for (var dataset in this.configData.datasets) {
      var csvData = readFile(this.configData.datasets[dataset].filename);
      this.addCsvData(csvData, this.configData.datasets[dataset]);
    }

    this.selectedDatasetName = this.selectedDataset.name;
    console.log(
      "App.mounted: selectedDataset.name = ",
      this.selectedDataset.name
    );
    console.log("App.mounted: selectedDataset = ", this.selectedDataset);
  },
  computed: {
    ...mapGetters(["selectedDataset", "datasetNames"]),
    keyNames() {
      if (this.selectedDataset) {
        return Object.keys(this.selectedDataset.data[0]);
      }

      return [];
    },
    langCode() {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      return urlParams.get("lang");
    },
  },
  watch: {
    selectedChart(newValue, oldValue) {
      if (newValue === 1) {
        this.$nextTick(function() {
          this.$refs.lineChart.redraw();
        });
      } else if (newValue === 2) {
        this.$nextTick(function() {
          this.$refs.barChart.redraw();
        });
      }
    },
  },
  methods: {
    ...mapActions([
      "addDataset",
      "selectDataset",
      "setActiveRows",
      "setActiveCols",
    ]),
    addCsvData(csvData, dataset) {
      let {
        xAxisLabel,
        yAxisLabel,
        creditsText,
        processedCsvData,
      } = processCsvString(csvData);
      csvData = processedCsvData;

      var jsonData = this.$papa.parse(csvData, {
        header: true,
        dynamicTyping: false,
        transformHeader: function(h) {
          return h.toString();
        },
      }).data;
      console.log("App.addCsvData: jsonData = ", jsonData);
      this.cleanData(jsonData);
      console.log("App.addCsvData: cleaned jsonData = ", jsonData);
      console.log(
        "App.addCsvData: jsonData- first object = ",
        Object.keys(jsonData[0])
      );

      var activeRows = Array(jsonData.length).fill(true);
      var activeCols = Array(Object.keys(jsonData[0]).length - 1).fill(true);
      console.log("App.addCsvData: activeCols = ", activeCols);
      var newDataset = {
        name: dataset.name,
        xAxisLabel,
        yAxisLabel,
        creditsText,
        data: jsonData,
        activeRows: activeRows,
        activeCols: activeCols,
      };
      console.log("App.addCsvData: dataset = ", dataset);
      if (dataset.creditsLink) newDataset.creditsLink = dataset.creditsLink;
      this.generateChartDataset(newDataset);
      this.addDataset(newDataset);
      this.selectedDatasetName = dataset.name;
    },
    async saveScreenshot() {
      const options = {
        type: "dataURL",
      };
      var output;
      var filename;
      if (this.selectedChart === 1) {
        output = await this.$html2canvas(
          this.$refs.lineChart.getChartRef(),
          options
        );
        filename = "linjediagram";
      } else if (this.selectedChart === 2) {
        output = await this.$html2canvas(
          this.$refs.barChart.getChartRef(),
          options
        );
        filename = "stolpediagram";
      }
      var img = output;
      var alink = document.createElement("a");
      alink.href = img;
      alink.download = filename + ".png";
      alink.click();
    },
    async onFileSelected(fileObject) {
      console.log("App.onFileSelected: fileObject = ", fileObject);

      let fileContents = "";
      try {
        fileContents = await readFileObject(fileObject);
        this.addCsvData(fileContents, { name: fileObject.name });
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
      this.setActiveRows({
        newActiveRows: this.selectedDataset.activeRows,
        selectedChartIndex: this.selectedChart,
      });
    },
    onActiveColsChanged(newActiveCols) {
      this.setActiveCols({
        newActiveCols,
        selectedChartIndex: this.selectedChart,
      });
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

      this.selectDataset(this.selectedDatasetName);
      // * nextTick is needed to make sure selectedDataset is refreshed in chart
      this.$nextTick(() => {
        if (this.$refs.lineChart) this.$refs.lineChart.resetYSlider();
        if (this.$refs.barChart) this.$refs.barChart.resetYSlider();
      });
    },
    onChartSelected(selected) {
      console.log("onChartSelected = ", selected);
      this.selectedChart = selected;
    },
    resetCharts() {
      if (this.selectedChart === 1) {
        this.$refs.lineChart.resetChart(true);
      } else if (this.selectedChart === 2) {
        this.$refs.barChart.resetChart(true);
      }
    },
    // * Removes empty object keys
    cleanData(jsonArray) {
      for (const item in jsonArray) {
        for (const [key] of Object.entries(jsonArray[item])) {
          // * Since space is added to headers we need to check for
          // * both " " and ""
          if (key == " " || key == "") {
            delete jsonArray[item][key];
          }
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

      let counter = 0;
      for (const key in keyArray) {
        let tmpColor;
        if (counter < this.colorArray.length) {
          tmpColor = this.colorArray[counter];
        } else {
          tmpColor = this.getRandomColor();
        }
        counter++;
        chartDataset.push({
          label: keyArray[key],
          fill: false,
          pointRadius: 1,
          borderWidth: 3,
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
      datasetIn.chartDataCollection.lineChartRange = this.generateChartRange(
        datasetIn.chartDataCollection,
        "line"
      );
      datasetIn.chartDataCollection.barChartRange = this.generateChartRange(
        datasetIn.chartDataCollection,
        "bar"
      );

      if (this.$refs.lineChart) this.$refs.lineChart.resetYSlider();
      if (this.$refs.barChart) this.$refs.barChart.resetYSlider();
    },
    generateChartRange(dataCollection, graphType) {
      // * Create charRange object with default values
      let graphRangeName = graphType + "ChartRange";

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
      console.log("App.generateChartRange initiated");

      // * Modify values if lineCharRange values already exist
      if (dataCollection[graphRangeName]) {
        console.log(
          "App.generateLineCharRange: old range detected: ",
          dataCollection[graphRangeName]
        );
        var oldXRangeMin =
          dataCollection.oldLabels[
            dataCollection[graphRangeName].xAxisRange[0]
          ];
        var newXRangeMinIndex = dataCollection.labels.indexOf(oldXRangeMin);
        if (newXRangeMinIndex === -1) newXRangeMinIndex = 0;

        var oldXRangeMax =
          dataCollection.oldLabels[
            dataCollection[graphRangeName].xAxisRange[1]
          ];
        var newXRangeMaxIndex = dataCollection.labels.indexOf(oldXRangeMax);
        if (newXRangeMaxIndex === -1)
          newXRangeMaxIndex = dataCollection.labels.length - 1;

        chartRange.xAxisRange = [newXRangeMinIndex, newXRangeMaxIndex];

        chartRange.yAxisMin = dataCollection[graphRangeName].yAxisOrgMin;
        chartRange.yAxisMax = dataCollection[graphRangeName].yAxisOrgMax;
        chartRange.yAxisRange = [...dataCollection[graphRangeName].yAxisRange];
      } else {
        console.warn(
          "App.generateChartRange: New chart range, not yet initiated: ",
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
        if (dataset.activeRows[i])
          labelArray.push(Object.values(dataset.data[i])[index]);
      }
      return labelArray;
    },
    getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    },
  },
};
</script>

<style lang="scss">
@import "src/style/_main.scss";
</style>
