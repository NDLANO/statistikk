import "@mdi/font/css/materialdesignicons.css";
import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import no from "vuetify/lib/locale/no";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { no },
    current: "no"
  },
  icons: {
    iconfont: "mdi"
  }
});
