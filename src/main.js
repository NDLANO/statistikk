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

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const langCode = urlParams.get("lang");

let messages = {};
if (langCode == "nn") {
  messages.no = window.statistikkDictionaryNn;
} else {
  messages.no = window.statistikkDictionaryNb;
}

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
