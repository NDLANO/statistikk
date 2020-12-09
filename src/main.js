import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";

Vue.config.productionTip = false;

Vue.use(VueI18n);

const messages = {
  no: window.statistikkDictionary,
};

const i18n = new VueI18n({
  locale: "no",
  messages,
});

new Vue({
  i18n,
  render: (h) => h(App),
}).$mount("#app");
