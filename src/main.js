import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueAxios from "vue-axios";
import VueRouter from "vue-router";
import axios from "axios";

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
