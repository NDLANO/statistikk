import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VuePapaParse from "vue-papa-parse";
import VueHtml2Canvas from "vue-html2canvas";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.use(VuePapaParse);
Vue.use(VueHtml2Canvas);

const messages = {
  no: window.statistikkDictionary,
};

const i18n = new VueI18n({
  locale: "no",
  messages,
});

new Vue({
  i18n,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
