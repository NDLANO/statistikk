import Vue from "vue";
import VueI18n from "vue-i18n";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VuePapaParse from "vue-papa-parse";

Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.use(VuePapaParse);

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
  render: (h) => h(App),
}).$mount("#app");
