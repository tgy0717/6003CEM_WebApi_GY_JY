<template>
  <div class="movie-detail-container" v-if="movie">
    <div class="movie-info">
      <!-- Poster -->
      <div class="poster">
        <img :src="movie.images?.jpg?.image_url" alt="Movie Poster" />
        
        <ul class="meta">
          <li><span class="meta-title">📅 Release Date:</span> <span class="meta-value">{{ movie.aired?.from?.substring(0, 10) || 'N/A' }}</span></li>
          <li><span class="meta-title">⏱️ Running Time:</span> <span class="meta-value">{{ movie.duration || 'N/A' }}</span></li>
          <li><span class="meta-title">🎬 Genre:</span> <span class="meta-value">{{ movie.genres?.map(g => g.name).join(', ') }}</span></li>
          <!-- <li><span class="meta-title">🗣️ Spoken Language:</span> <span class="meta-value">{{ movie.spokenLanguages?.join(', ') || 'N/A' }}</span></li> -->
          <li><span class="meta-title">🔞 Classification:</span> <span class="meta-value">{{ movie.rating || 'N/A' }}</span></li>
        </ul>
      </div>

      <!-- Trailer -->
      <div v-if="movie.trailer?.embed_url" class="trailer">
        <h1>{{ movie.title }}</h1>
        <div class="trailer-wrapper">
          <iframe 
            :src="movie.trailer.embed_url"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </div>
      </div>

    </div>
  
    <!-- Details -->
    <div class="details">
      <p><strong>Synopsis:</strong> {{ movie.synopsis || movie.background || 'No synopsis available.' }}</p>
    </div>


    <div class="button-container">
      
      <a @click="toggleFavorite()" :class="['btn-add', { 'btn-added': isFavorite }]">
      {{ isFavorite ? 'Added to Favorites ✓' : 'Add to Favorites ❤️'}}</a>
      <router-link 
        :to="{ name: 'payment', query: { mal_id: movie.mal_id } }"
        class="btn"
      >
        Buy Tickets
      </router-link>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useLoading } from '@/composables/useLoading'
const { showLoading, hideLoading } = useLoading()
const token = localStorage.getItem("token");

export default {
  props: ['mal_id'],
  data() {
    return {
      movie: null,
      isFavorite: false,
    };
  },
  async mounted() {
    showLoading();
    this.fetchMovieDetails();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
    const movieId = this.mal_id || this.id;
    try {
      const res = await axios.get('http://localhost:5000/api/is-favorite', {
        params: {
          // userId: this.user.id,
          movieId: movieId,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      this.isFavorite = res.data.isFavorite;
    } catch (err) {
      console.error('Failed to check favorite status:', err);
    }
    hideLoading()
  },
  methods: {
    fetchMovieDetails() {
      axios.get(`https://api.jikan.moe/v4/anime/${this.mal_id}`)
        .then(response => {
          this.movie = response.data.data;
          console.log(this.movie)
        })
        .catch(error => {
          console.error('Failed to fetch movie details:', error);
        });
    },
    goToPayment() {
      this.$router.push({ name: 'payment', query: { mal_id: this.mal_id } });
    },
    async toggleFavorite() {
      try {
        const favoriteData = {
          // userId: this.user.id,
          movieId: this.mal_id || this.id,
        };
        console.log(favoriteData)
        const response = await axios.post(
          'http://localhost:5000/api/toggle-favorite', 
          favoriteData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        this.isFavorite = !this.isFavorite;

        alert(response.data.message);
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        alert('Something went wrong.');
      }
    }
  },
}
</script>

<style scoped>
.movie-detail-container {
  color: white;
  padding: 2rem;
  max-width: 1500px;
  margin: auto;
}

.movie-info {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.poster img {
  width: 300px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
}

.details {
  flex: 1;
  text-align: justify;
}

.details h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.meta {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  font-size: 16px
}

.meta li {
  margin-bottom: 0.5rem;
}

.trailer {
  flex: 1;
  height: 400;
}

.trailer-wrapper {
  position: relative;
  padding-bottom: 52%;
  height: 0;
  overflow: hidden;
  margin-top: 1rem;
}

.trailer-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.btn:hover {
  background-color: #e39f00;
}

</style>
