import { createRouter, createWebHistory } from "vue-router";
import LoginPage from '../views/LoginView.vue';
import RegistrationPage from '../views/RegistrationView.vue';
import AnimeMoviePage from '../views/AnimeMoviePage.vue';
import MoviePage from '../views/MoviePage.vue';
import ProfilePage from '../views/Profile.vue';
import PaymentPage from '../views/PaymentPage.vue'
import PaymentSuccessPage from '../views/PaymentSuccess.vue';
import BookingHistoryPage from "@/views/BookingHistory.vue";
import ForgetPasswordPage from "@/views/ForgetPassword.vue";
import Favorite from "@/views/Favorite.vue";
import Homepage from "@/views/Homepage.vue";


const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes: [

      {  path: "/", name: "login", component: LoginPage},
      {  path: "/home", name: "home", component: Homepage},
      {  path: "/anime-movie", name: "anime-movie", component: AnimeMoviePage},
      {  path: "/registration", name: "registration", component: RegistrationPage},
      {  path: "/details/:mal_id", name: "details", component: () => import("../views/Details.vue"), props: true  },
      {  path: "/movie", name: "movie", component: MoviePage},
      {  path: "/movie-details/:id", name: "movie-details", component: () => import("../views/MovieDetails.vue"), props: true  },

      {  path: '/profile', name: "profile", component: ProfilePage},
      { path: '/payment', name: 'payment', component: PaymentPage, props: route => ({ mal_id: route.query.mal_id, id: route.query.id }) }
,
      {  path: '/paymentSuccess', name: "success", component: PaymentSuccessPage},
      {  path: '/booking-history', name: "bookingHistory", component: BookingHistoryPage},
      {  path: '/forgot-password', name: "forgetPassword", component: ForgetPasswordPage},
      {  path: '/favorite', name: "favorite", component: Favorite},
   ],
});

export default router;
