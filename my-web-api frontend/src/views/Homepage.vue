<template>
  <div class="homepage">
    <!-- Custom Navigation Buttons -->
    <div class="slider-wrapper" v-if="sliderMovies.length">
        <Swiper  
            :modules="[Autoplay, Navigation, Pagination]"
            :loop="true"
            :centered-slides="true"
            :slides-per-view="1.3"
            :space-between="30"
            :autoplay="{ delay: 5000, disableOnInteraction: false }"
            :navigation="true"
            :pagination="{ clickable: true }"
            class="mySwiper"
        >
            <SwiperSlide v-for="movie in sliderMovies" :key="movie.id">
                <div class="slider-image" :style="{ backgroundImage: 'url(' + movie.image + ')' }">
                <div class="slider-overlay">
                    <h2 class="slider-title">{{ movie.title }}</h2>
                    <router-link :to="getRouterLink(movie.id)" class="slider-button">View More</router-link>
                </div>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
        
    <div class="top-movie">
        <!-- IMDb Section -->
         <section v-if="imdbMovies.length && !loading">
            <div class="section-header">
                <h2>IMDB Movie</h2>
            </div>
            
            <div class="movie-grid-with-button">
                <div class="movie-grid">
                <div v-for="movie in imdbMovies" :key="movie.id" class="movie-card">
                    <img :src="movie.image" :alt="movie.title" />
                    <h3>{{ movie.title }}</h3>
                    <router-link :to="getRouterLink(movie.id)">Details</router-link>
                </div>
                </div>
                <router-link to="/movie" class="view-more-button">
                    <span class="arrow">→</span>
                </router-link>
            </div>
        </section>
    
        <!-- Anime Section -->
        <section v-if="animeMovies.length && !loading">
            <div class="section-header">
                <h2>Anime Movie</h2>
            </div>
            <div class="movie-grid-with-button">
                <div class="movie-grid">
                <div v-for="movie in animeMovies" :key="movie.id" class="movie-card">
                    <img :src="movie.image" :alt="movie.title" />
                    <h3>{{ movie.title }}</h3>
                    <router-link :to="getRouterLink(movie.id)">Details</router-link>
                </div>
                </div>
                <router-link to="/anime-movie" class="view-more-button">
                    <span class="arrow">→</span>
                </router-link>
            </div>
        </section>
    </div>

    <p v-if="loading" class="loading">Loading...</p>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/autoplay'
import 'swiper/css/pagination'
</script>

<script>
import axios from 'axios';

console.log(Autoplay)

export default {
  components: {
    Swiper,
    SwiperSlide
  },
  data() {
    return {
        loading: true,
        nowShowing: [],
        sliderMovies: [],
        imdbMovies: [],
        animeMovies: [],
        sliderMovies: [],
        swiperInstance: null,
    };
  },
  methods: {      
    async fetchData() {
      this.loading = true;
      try {
        // IMDb
        const imdbOptions = {
          method: 'GET',
          url: 'https://imdb236.p.rapidapi.com/api/imdb/top250-movies',
          headers: {
            'x-rapidapi-key': '613d9ec67amsh6a60e222647b7f4p1c74ebjsn7c4e57299df7',
            'x-rapidapi-host': 'imdb236.p.rapidapi.com'
          }
        };
        const imdbRes = await axios.request(imdbOptions);
        let sortRes = imdbRes.data || [];

        // Sort by release date (newest first)
        sortRes = sortRes.sort((a, b) => {
            const dateA = new Date(a.releaseDate);
            const dateB = new Date(b.releaseDate);
            return dateB - dateA;
        });

        // Map after sorting
        const imdbShows = sortRes.slice(0, 5).map(show => ({
            id: show.id,
            title: show.primaryTitle,
            image: show.primaryImage,
            type: 'imdb'
        }));

        // Anime (Jikan)
        const animeRes = await axios.get('https://api.jikan.moe/v4/top/anime');
        const animeShows = animeRes.data.data.slice(0, 5).map(show => ({
          id: show.mal_id,
          title: show.title,
          image: show.images.jpg.image_url,
          type: 'anime'
        }));

        this.imdbMovies = imdbShows;
        this.animeMovies = animeShows;
        this.nowShowing = [...imdbShows, ...animeShows];
        this.sliderMovies = [...imdbShows, ...animeShows];


      } catch (err) {
        console.error('API error:', err);
      } finally {
        this.loading = false;
      }
    },
    getRouterLink(id) {
      return id.startsWith?.('tt')
        ? { name: 'movie-details', params: { id } }
        : { name: 'details', params: { mal_id: id } };
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
.homepage {
}
.top-movie{
    padding: 20px;
}
.mySwiper {
    height: 70vh;
    max-width: 670px;
    margin: auto;
    position: relative;
    overflow: visible;
}
.swiper-slide {
    transition: transform 0.5s, opacity 0.5s;
    transform: scale(0.85);
    opacity: 0.5;
}
.swiper-slide-active {
    transform: scale(1);
    opacity: 1;
    z-index: 2;
}
.slider-image {
    background-size: cover;
    background-position: center;
    border-radius: 16px;
    width: 100%;
    height: 100%;
    box-shadow: 
        0 0 10px rgba(255, 255, 255, 0.2), /* soft white glow */
        0 0 40px rgba(255, 255, 255, 0.1), /* extended glow */
        0 0 100px rgba(255, 255, 255, 0.1); /* ambient surround */
    transition: box-shadow 0.3s ease;

}

.slider-overlay {
    position: absolute;
    bottom: 0;
    background: rgba(0,0,0,0.6);
    color: white;
    width: 100%;
    padding: 20px;
}
.slider-title {
    font-size: 24px;
    font-weight: bold;
}
.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
}
.movie-card {
    background: #111;
    color: white;
    padding: 10px;
    text-align: center;
}
.movie-card img {
    width: 100%;
    height: auto;
}
.slider-wrapper {
    width: 100%;    
    justify-content: center;
    align-items: center;
    background-color: black;
    padding: 50px 0;
    overflow: hidden;
}
.swiper-container { 
    border-radius: 12px;
    max-width: 600px;
    overflow: visible;
    position: relative;
    box-shadow:
        0 0 10px rgba(255, 255, 255, 0.2), /* soft white glow */
        0 0 40px rgba(255, 255, 255, 0.1), /* extended glow */
        0 0 100px rgba(255, 255, 255, 0.1); /* ambient surround */
    transition: box-shadow 0.3s ease;
}
::v-deep .swiper-pagination-bullet {
    background: white;
    opacity: 0.5;
}
::v-deep .swiper-pagination-bullet-active {
    opacity: 1;
}
.hero-section {
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    padding: 40px;
    background-color: black;
    flex-wrap: wrap;
}
.hero-text{
    color: white;
    text-align: center;
}
.hero-text h1 {
    font-size: 36px;
    margin-bottom: 16px;
}

.hero-text p {
    font-size: 18px;
    line-height: 1.5;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
    color: white; /* Change this to any color you want */
}

@keyframes slideUpIn {
    0% {
        opacity: 0;
        transform: translateY(40px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}


.swiper-slide-active .slider-image {
    animation: slideUpIn 0.8s ease-out forwards;
}

.movie-grid-with-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.movie-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    flex: 1;
}

.view-more-button {
    font-size: 15px;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid yellow;
    color: white;
    border-radius: 50%;
    text-decoration: none;
    font-size: 20px;
    transition: background-color 0.2s ease;
}

.view-more-button:hover {
    background-color: yellow;
    color: black;
}

.view-more-button .arrow {
    margin: 0;
    font-size: 22px;
    font-weight: bold;
}

.slider-button{
    color: yellow;
}

.arrow{
    font-size: xx-large;
}
</style>
