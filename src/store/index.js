import { parse, stringify } from "flatted";
import Vue from "vue";
import Vuex, { Store } from "vuex";

Vue.use(Vuex);

function getActiveLabels(datasetIn) {
  let labelArray = [];
  for (var i = 0; i < datasetIn.data.length; i++) {
    if (datasetIn.activeRows[i])
      labelArray.push(Object.values(datasetIn.data[i])[0]);
  }
  return labelArray;
}

function generateActiveData(activeRows, key, data) {
  let newData = [];

  for (let i = 0; i < data.length; i++) {
    if (activeRows[i]) {
      newData.push(data[i][key]);
    }
  }
  return newData;
}

function generateNewXAxisData(dataCollection, selectedChartIndex) {
  console.log(
    "store.generateNewXAxisData: dataCollection = ",
    parse(stringify(dataCollection))
  );
  var oldXRangeMin =
    dataCollection.oldLabels[dataCollection.lineChartRange.xAxisRange[0]];
  var oldXRangeMax =
    dataCollection.oldLabels[dataCollection.lineChartRange.xAxisRange[1]];

  console.log("store.generateNewXAxisData: odXRangeMax = ", oldXRangeMax);

  if (selectedChartIndex == 2) {
    oldXRangeMin =
      dataCollection.oldLabels[dataCollection.barChartRange.xAxisRange[0]];
    oldXRangeMax =
      dataCollection.oldLabels[dataCollection.barChartRange.xAxisRange[1]];
  }
  var newXRangeMinIndex;
  var newXRangeMaxIndex;

  // * If there are only two labels/rows,
  // * min must be the first, max the last
  if (dataCollection.labels.length == 2 || oldXRangeMin == oldXRangeMax) {
    newXRangeMinIndex = 0;
    newXRangeMaxIndex = dataCollection.labels.length - 1;
  } else {
    newXRangeMinIndex = dataCollection.labels.indexOf(oldXRangeMin);
    if (newXRangeMinIndex === -1) {
      newXRangeMinIndex = 0;
    }

    newXRangeMaxIndex = dataCollection.labels.indexOf(oldXRangeMax);
    if (newXRangeMaxIndex === -1) {
      newXRangeMaxIndex = dataCollection.labels.length - 1;
    }
  }

  if (selectedChartIndex == 1) {
    console.log(
      "store.generateNewXAxisData: setting lineChart max = ",
      newXRangeMaxIndex
    );
    dataCollection.lineChartRange.xAxisMax = dataCollection.labels.length - 1;
    dataCollection.lineChartRange.xAxisRange = [
      newXRangeMinIndex,
      newXRangeMaxIndex,
    ];
  } else {
    console.log(
      "store.generateNewXAxisData: setting barChart max = ",
      newXRangeMaxIndex
    );
    dataCollection.barChartRange.xAxisMax = dataCollection.labels.length - 1;
    dataCollection.barChartRange.xAxisRange = [
      newXRangeMinIndex,
      newXRangeMaxIndex,
    ];
  }

  console.log(
    "store.generateNewXAxisData: new min = ",
    newXRangeMinIndex,
    ", max = ",
    newXRangeMaxIndex
  );
  console.log(
    "store.generateNewXAxisData: modified dataCollection = ",
    parse(stringify(dataCollection))
  );

  dataCollection.oldLabels = [...dataCollection.labels];
}

export default new Vuex.Store({
  state: {
    datasets: [],
    selectedDatasetIndex: undefined,
    updated: new Date().getTime(),
  },
  getters: {
    updated(state) {
      return state.updated;
    },
    selectedDataset(state) {
      return state.datasets[state.selectedDatasetIndex];
    },
    datasetNames(state) {
      let names = [];
      for (let i = 0; i < state.datasets.length; i++) {
        names.push(state.datasets[i].name);
      }
      return names;
    },
    activeDataCollection: (state, getters) => {
      if (state.datasets) {
        console.log("store.activeDataCollection init");
        // * Set labes based on activeRows
        getters.selectedDataset.chartDataCollection.labels = getActiveLabels(
          getters.selectedDataset
        );

        for (let i = 0; i < getters.selectedDataset.keys.length; i++) {
          console.log(
            "store.activeDataCollection: data for key ",
            i,
            " = ",
            generateActiveData(
              getters.selectedDataset.activeRows,
              getters.selectedDataset.keys[i],
              getters.selectedDataset.data
            )
          );
          getters.selectedDataset.chartDataCollection.datasets[
            i
          ].data = generateActiveData(
            getters.selectedDataset.activeRows,
            getters.selectedDataset.keys[i],
            getters.selectedDataset.data
          );
        }
        console.log(
          "store.activeDataCollection: selectedDataset = ",
          getters.selectedDataset
        );
        return getters.selectedDataset.chartDataCollection;
      }
      return undefined;
    },
  },
  mutations: {
    mRecalculateDataCollection: (state, getters) => {
      state.updated = new Date().getTime();
    },

    mAddDataset(state, dataset) {
      state.datasets.push(dataset);
      if (!state.selectedDatasetIndex) {
        state.selectedDatasetIndex = 0;
      }
    },
    mSelectDataset(state, newDatasetName) {
      var newSelectedIndex = state.datasets.findIndex((dataset) => {
        return dataset.name === newDatasetName;
      });
      if (newSelectedIndex === -1) newSelectedIndex = 0;

      state.selectedDatasetIndex = newSelectedIndex;
    },
    mInitYAxisValues(state, { rangeType, newMin, newMax }) {
      // * Floors min value to make sure it is not .5
      // * (Vuetify ranged sliders have a problem with .5 min values)
      newMin = Math.floor(newMin);

      console.log("store.mInitYMinMax: min = ", newMin, ", max = ", newMax);
      state.datasets[state.selectedDatasetIndex].chartDataCollection[
        rangeType
      ].yAxisOrgMin = newMin;
      state.datasets[state.selectedDatasetIndex].chartDataCollection[
        rangeType
      ].yAxisOrgMax = newMax;

      state.datasets[state.selectedDatasetIndex].chartDataCollection[
        rangeType
      ].yAxisMin = newMin;
      state.datasets[state.selectedDatasetIndex].chartDataCollection[
        rangeType
      ].yAxisMax = newMax;

      state.datasets[state.selectedDatasetIndex].chartDataCollection[
        rangeType
      ].yAxisRange = [newMin, newMax];
    },
    mSetActiveRows(state, newActiveRows) {
      console.log("---store.mSetActiveRows: newActiveRows = ", newActiveRows);
      state.datasets[state.selectedDatasetIndex].activeRows = newActiveRows;
      state.datasets[
        state.selectedDatasetIndex
      ].chartDataCollection.oldLabels = [
        ...state.datasets[state.selectedDatasetIndex].chartDataCollection
          .labels,
      ];
      state.datasets[
        state.selectedDatasetIndex
      ].chartDataCollection.labels = getActiveLabels(
        state.datasets[state.selectedDatasetIndex]
      );
    },
    mSetActiveCols(state, newActiveCols) {
      console.log("store.mSetActiveCols: newActiveCols = ", newActiveCols);
      state.datasets[state.selectedDatasetIndex].activeCols = newActiveCols;
    },
    mResetXSlider(state) {
      console.log(
        "store.mResetXSlider: state.selectedDataset = ",
        state.datasets[state.selectedDatasetIndex]
      );

      let collection =
        state.datasets[state.selectedDatasetIndex].chartDataCollection;
      collection.lineChartRange.xAxisRange = [0, collection.labels.length - 1];
      collection.barChartRange.xAxisRange = [0, collection.labels.length - 1];
    },
  },
  actions: {
    addDataset({ commit }, dataset) {
      console.log("************* store.addDataset");
      this.commit("mAddDataset", dataset);
    },
    selectDataset({ commit }, newDatasetName) {
      this.commit("mSelectDataset", newDatasetName);
    },
    initYAxisValues({ commit }, { rangeType, newMin, newMax }) {
      console.log("store.initYMinMax: min = ", newMin, ", max = ", newMax);
      this.commit("mInitYAxisValues", { rangeType, newMin, newMax });
    },
    setActiveRows({ commit, dispatch }, { newActiveRows, selectedChartIndex }) {
      this.commit("mSetActiveRows", newActiveRows);
      this.dispatch("recalculateDataCollection", selectedChartIndex);
    },
    setActiveCols({ commit, dispatch }, { newActiveCols, selectedChartIndex }) {
      this.commit("mSetActiveCols", newActiveCols);
      this.dispatch("recalculateDataCollection", selectedChartIndex);
    },
    recalculateDataCollection({ commit, state, getters }, selectedChartIndex) {
      if (state.datasets) {
        console.log("store.recalculateDataCollection init");
        // * Set labes based on activeRows
        console.log("store.recalculateDataCollection: getters = ", getters);
        getters.selectedDataset.chartDataCollection.labels = getActiveLabels(
          getters.selectedDataset
        );

        for (let i = 0; i < getters.selectedDataset.keys.length; i++) {
          console.log(
            "store.recalculateDataCollection: data for key ",
            i,
            " = ",
            generateActiveData(
              getters.selectedDataset.activeRows,
              getters.selectedDataset.keys[i],
              getters.selectedDataset.data
            )
          );
          getters.selectedDataset.chartDataCollection.datasets[
            i
          ].data = generateActiveData(
            getters.selectedDataset.activeRows,
            getters.selectedDataset.keys[i],
            getters.selectedDataset.data
          );
        }

        console.log(
          "store.generate: selectedChartIndex = ",
          selectedChartIndex
        );
        generateNewXAxisData(
          getters.selectedDataset.chartDataCollection,
          selectedChartIndex
        );

        console.log(
          "store.recalculateDataCollection: selectedDataset = ",
          getters.selectedDataset
        );
      }

      this.commit("mRecalculateDataCollection");
    },
    resetXSlider({ commit }) {
      console.log("store.resetXSlider");
      this.commit("mResetXSlider");
    },
  },
  modules: {},
});
