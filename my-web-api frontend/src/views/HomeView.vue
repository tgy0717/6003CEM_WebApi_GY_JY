<template>
    <main>
         <!-- Top Bar -->
        <div class="topbar">
            <router-link style="text-decoration: none;" to="/booking-history" class="topbar-link">Booking History</router-link>
            <router-link style="text-decoration: none;" to="/fnb" class="topbar-link">F&B</router-link>
            <router-link style="text-decoration: none;" to="/profile" class="topbar-link">Profile</router-link>
        </div>

        <h1 class="title">Top Movies</h1>
        <div v-if="OnlineMovies.length" class="movie-container">
            <div v-for="movie in OnlineMovies" :key="movie.id" class="movie-card">
                <!-- Background Image -->
                <div 
                    class="movie-image" 
                    :style="{ backgroundImage: 'url(' + movie.image_url + ')' }"
                >
                    <div class="overlay"></div>
                    <!-- Movie Details -->
                    <div class="movie-details">
                        <h2 class="movie-title">{{ movie.title }}</h2>
                        <p class="movie-info"><strong>Rating:</strong> {{ movie.rating }}</p>
                        <p class="movie-info"><strong>Duration:</strong> {{ movie.duration }}</p> 
                        <p class="movie-info"><strong>Score:</strong> {{ movie.score }}</p>
                        <router-link 
                            :to="{ name: 'details', params: { mal_id: movie.mal_id } }" 
                            class="view-more"
                            >
                            View More
                        </router-link>
                    </div>
                </div>
                <h2 class="movie-title text-center" style="font-size: 16px;">{{ movie.title }}</h2>
            </div>
        </div>
        <p v-else class="loading">Loading movies...</p>
    </main>
</template>


<script>
import TheWelcome from '../components/TheWelcome.vue'
import { createApp } from 'vue' 
import axios from 'axios'
import VueAxios from 'vue-axios'

export default {
    components: {  

    },
    data() {
        return { 
            OnlineMovies: [],
            FavoriteMovies: []
        };
    },
    mounted(){ 
        this.getOnlineApiMovie()
        // this.getDatabaseApiMovie()


        //http://localhost:5000/api/movie
        //https://api.jikan.moe/v4/seasons/upcoming
        //https://www.themealdb.com/api/json/v1/1/categories.php
        //https://api.openbrewerydb.org/breweries
        //https://api.restful-api.dev/objects               -phone
        //https://dummyjson.com/recipes
        //https://api.jikan.moe/v4/top/anime?type=movie
        
    },
    methods:{
        getOnlineApiMovie (){
            axios.get('https://api.jikan.moe/v4/top/anime?type=movie')
            .then(response => {
                console.log(response.data)
                response.data.data.forEach(movie => {
                    // Check if mal_id already exists in this.movies
                    if (!this.OnlineMovies.some(existing => existing.mal_id === movie.mal_id)) {
                        this.OnlineMovies.push({
                            mal_id: movie.mal_id,
                            title: movie.title,
                            image_url: movie.images?.jpg?.image_url,
                            rating: movie.rating || 'Not Rated',
                            url: movie.url,
                            duration: movie.duration,
                            score: movie.score,
                        });
                    }
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        },

        getDatabaseApiMovie (){
            axios.get('http://localhost:5000/api/movie')
            .then(response => {
                console.log(response.data)
                this.FavoriteMovies = response.data.map(movie => ({
                    mal_id: movie.mal_id,
                    title: movie.title,
                    image_url: movie.image_url,
                    rating: movie.rating || 'Not Rated',
                    url: movie.url,
                }));
            })
        }



    }
};


</script>
