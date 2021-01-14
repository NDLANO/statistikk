import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    datasets: [],
    selectedDatasetIndex: undefined,
  },
  getters: {
    selectedDataset(state) {
      return state.datasets[state.selectedDatasetIndex];
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
    mInitYMinMax(state, { rangeType, newMin, newMax }) {
      console.log("store.mInitYMinMax: min = ", newMin, ", max = ", newMax);
      state.datasets[state.selectedDatasetIndex].chartDataCollection[
        rangeType
      ].yAxisOrgMin = newMin;
      state.datasets[state.selectedDatasetIndex].chartDataCollection[
        rangeType
      ].yAxisOrgMax = newMax;
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
    initYMinMax({ commit }, { rangeType, newMin, newMax }) {
      console.log("store.initYMinMax: min = ", newMin, ", max = ", newMax);
      this.commit("mInitYMinMax", { rangeType, newMin, newMax });
    },
  },
  modules: {},
});
