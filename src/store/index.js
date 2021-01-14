import Vue from "vue";
import Vuex, { Store } from "vuex";

Vue.use(Vuex);

function getActiveLabels(datasetIn) {
  let labelArray = [];
  for (var i = 0; i < datasetIn.data.length; i++) {
    // console.log("item = ", Object.values(this.loadedData[item])[index]);
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
      console.log("store.activeDataCollection: arh!");
      return undefined;
    },
  },
  mutations: {
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
      console.log("store.mSetActiveRows: newActiveRows = ", newActiveRows);
      state.datasets[state.selectedDatasetIndex].activeRows = newActiveRows;
      state.datasets[
        state.selectedDatasetIndex
      ].chartDataCollection.labels = getActiveLabels(
        state.datasets[state.selectedDatasetIndex]
      );
    },
  },
  actions: {
    addDataset({ commit }, dataset) {
      console.log("************* store.addDataset");
      // debugger;
      this.commit("mAddDataset", dataset);
    },
    selectDataset({ commit }, newDatasetName) {
      this.commit("mSelectDataset", newDatasetName);
    },
    initYAxisValues({ commit }, { rangeType, newMin, newMax }) {
      console.log("store.initYMinMax: min = ", newMin, ", max = ", newMax);
      this.commit("mInitYAxisValues", { rangeType, newMin, newMax });
    },
    setActiveRows({ commit }, newActiveRows) {
      this.commit("mSetActiveRows", newActiveRows);
    },
  },
  modules: {},
});
