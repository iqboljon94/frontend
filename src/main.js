import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import VueAxios from "vue-axios";
import VueRouter from "vue-router";
import axios from "axios";
import router from "./router/index";

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  router,
  render: (h) => h(App),
}).$mount("#app");
