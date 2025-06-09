import { createRouter, createWebHistory } from "vue-router";
import LoginPage from '../views/LoginView.vue';
import RegistrationPage from '../views/RegistrationView.vue';
import HomePage from '../views/HomeView.vue';
import AboutPage from '../views/AboutView.vue';
import MoviePage from '../views/MoviePage.vue';
import FoodBeveragePage from '../views/FoodBeverage.vue';
import ProfilePage from '../views/Profile.vue';
import PaymentPage from '../views/PaymentPage.vue'
import PaymentSuccessPage from '../views/PaymentSuccess.vue';


const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [

      {  path: "/", name: "login", component: LoginPage},
      {  path: "/about", name: "about", component: AboutPage },
      {  path: "/home", name: "home", component: HomePage},
      {  path: "/registration", name: "registration", component: RegistrationPage},
      {  path: "/details/:mal_id", name: "details", component: () => import("../views/Details.vue"), props: true  },
      {  path: "/movie", name: "movie", component: MoviePage},
      {  path: "/movie-details/:id", name: "movie-details", component: () => import("../views/MovieDetails.vue"), props: true  },
      {
      path: '/desserts',
      name: 'Desserts',
      component: () => import('@/views/Dessert.vue')
}


      // {  path: '/fnb', name: "fnb", component: FoodBeveragePage},
      {  path: '/profile', name: "profile", component: ProfilePage},
      {  path: '/payment/:mal_id', name: "payment", component: PaymentPage, props: true},
      {  path: '/paymentSuccess', name: "success", component: PaymentSuccessPage},
   ],
});

export default router;
