import VueRouter from "vue-router";
import HelloWorld from "../components/HelloWorld";
import ExtraCom from "../components/ExtraCom";

export default new VueRouter({
  routes: [
    {
      path: "/",
      component: HelloWorld,
    },
    {
      path: "/extra",
      component: ExtraCom,
    },
  ],
});
