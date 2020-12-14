<template lang="pug">
  #app
    h2 {{$t("general.heading")}}
    .content
      .small.chart
        LineChart( :chart-data="dataCollection" :options="lineChartOptions")
        button(@click="init()") Alle rader
        button(@click="initRandomized()") Tilfeldige rader
      DataTable.small.table(:rowHeadings="keyNames" :data="loadedData" :value="activeRows" @dataChanged="fillData")
</template>

<script>
import LineChart from "@/components/charts/LineChart";
import DataTable from "@/components/DataTable";

export default {
  name: "App",
  components: {
    LineChart,
    DataTable
  },
  data() {
    return {
      dataCollection: {},
      loadedData: [
        {
          År: 0,
          Diesel: 8100,
          El: 12000,
          "": ""
        },
        {
          År: 1,
          Diesel: 11355,
          El: 12825,
          "": ""
        },
        {
          År: 2,
          Diesel: 14610,
          El: 13650,
          "": ""
        },
        {
          År: 3,
          Diesel: 17865,
          El: 14475,
          "": ""
        },
        {
          År: 4,
          Diesel: 21120,
          El: 15300,
          "": ""
        },
        {
          År: 5,
          Diesel: 24375,
          El: 16125,
          "": ""
        },
        {
          År: 6,
          Diesel: 27630,
          El: 16950,
          "": ""
        },
        {
          År: 7,
          Diesel: 30885,
          El: 17775,
          "": ""
        },
        {
          År: 8,
          Diesel: 34140,
          El: 18600,
          "": ""
        },
        {
          År: 9,
          Diesel: 37395,
          El: 19425,
          "": ""
        },
        {
          År: 10,
          Diesel: 40650,
          El: 20250,
          "": ""
        },
        {
          År: 11,
          Diesel: 43905,
          El: 21075,
          "": ""
        },
        {
          År: 12,
          Diesel: 47160,
          El: 21900,
          "": ""
        },
        {
          År: 13,
          Diesel: 50415,
          El: 22725,
          "": ""
        },
        {
          År: 14,
          Diesel: 53670,
          El: 23550,
          "": ""
        },
        {
          År: 15,
          Diesel: 56925,
          El: 24375,
          "": ""
        },
        {
          År: 16,
          Diesel: 60180,
          El: 25200,
          "": ""
        },
        {
          År: 17,
          Diesel: 63435,
          El: 26025,
          "": ""
        },
        {
          År: 18,
          Diesel: 66690,
          El: 26850,
          "": ""
        },
        {
          År: 19,
          Diesel: 69945,
          El: 27675,
          "": ""
        },
        {
          År: 20,
          Diesel: 73200,
          El: 28500,
          "": ""
        }
      ],
      xLabels: [],
      activeRows: [],
      datasets: [],
      keyNames: [],
      lineChartOptions: {
        responsive: true,
        borderWidth: "30px",
        scales: {
          yAxes: [
            {
              ticks: {
                min: 0,
                max: 60000
              }
            }
          ]
        }
      }
    };
  },
  mounted() {
    this.cleanData();
    this.extractKeyNames();
    this.init();
  },
  methods: {
    // * Removes empty object keys
    cleanData() {
      console.log("App.cleanData: loadedData = ", this.loadedData);
      for (const item in this.loadedData) {
        for (const [key] of Object.entries(this.loadedData[item])) {
          // console.log("key = ", key);//, ", value = ", value);
          if (key == "") delete this.loadedData[item][key];
        }
      }
    },
    extractKeyNames() {
      this.keyNames = Object.keys(this.loadedData[0]);
    },
    /**
     * initActiveRows creates an array the length of loadedData with booleans.
     * Each boolean corresponds to a row in loaded data.
     */
    initActiveRows(randomize = false) {
      this.activeRows = [];
      for (var i = 0; i < this.loadedData.length; i++) {
        if (randomize) {
          this.activeRows[i] = Math.random() < 0.5; // randomizes active state
        } else {
          this.activeRows[i] = true;
        }
      }
      console.log("activeRows = ", this.activeRows);
    },
    initXLabels() {
      this.xLabels = this.getKeyValuesByIndex(0);
      console.log("xLabels = ", this.xLabels);
    },
    initRandomized() {
      this.initActiveRows(true);
      this.fillData();
    },
    init() {
      this.initActiveRows();
      this.fillData();
    },
    fillData() {
      this.initXLabels();
      this.generateDatasets();
      // console.log("xLabels length = ", this.xLabels.length, ", dataset[0] length = ", this.datasets[0].data.length);
      // console.log("App.fillData: loadedData = ", this.datasets);
      this.dataCollection = {
        labels: this.xLabels,
        datasets: this.datasets
      };
    },
    generateDatasets() {
      this.datasets = [];
      let keyArray = Object.keys(this.loadedData[0]);
      keyArray = this.removeStringFromArray(keyArray, keyArray[0]); // remove first item/x axis
      console.log("keys = ", keyArray);
      for (const key in keyArray) {
        console.log("key = ", keyArray[key]);
        console.log(
          "key values array = ",
          this.getKeyValuesByKey(keyArray[key])
        );
        this.datasets.push({
          label: keyArray[key],
          fill: false,
          borderWidth: 5,
          borderColor: this.getRandomColor(),
          // backgroundColor: this.getRandomColor(),
          data: this.getKeyValuesByKey(keyArray[key])
        });
      }

      console.log("this.datasets = ", this.datasets);
    },
    removeStringFromArray(inputArray, inputString) {
      let newArray = [...inputArray];
      let stringIndex = newArray.indexOf(inputString);
      newArray.splice(stringIndex, 1);
      return newArray;
    },
    getKeyValuesByKey(key) {
      let valuesArray = [];
      for (var i = 0; i < this.loadedData.length; i++) {
        if (this.activeRows[i]) valuesArray.push(this.loadedData[i][key]);
      }
      return valuesArray;
    },
    getKeyValuesByIndex(index) {
      let labelArray = [];
      for (var i = 0; i < this.loadedData.length; i++) {
        // console.log("item = ", Object.values(this.loadedData[item])[index]);
        if (this.activeRows[i])
          labelArray.push(Object.values(this.loadedData[i])[index]);
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
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5;
    }
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
  margin-top: 60px;
}
.content {
  display: flex;
  justify-content: space-around;
}
.small {
  // max-width: 45%;
  // margin: 50px auto;
}
.table {
  width: 45%;
  margin: 10px;
  margin-top: 50px;
}
button {
  margin: 10px;
}
</style>
