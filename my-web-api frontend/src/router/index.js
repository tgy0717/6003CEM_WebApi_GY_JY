import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [
      // {
      //    path: "/",
      //    name: "home",
      //    component: HomeView,
      // },
      {  path: "/about", name: "about", component: () => import("../views/AboutView.vue") },
      {  path: "/", name: "home", component: () => import("../views/HomeView.vue")    },
      {  path: "/details/:mal_id", name: "details", component: () => import("../views/Details.vue"), props: true  },

   ],
});

export default router;
