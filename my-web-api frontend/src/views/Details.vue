<template>
  <div class="movie-detail-container" v-if="movie">
    <div class="movie-info">
      <!-- Poster -->
      <div class="poster">
        <img :src="movie.images?.jpg?.image_url" alt="Movie Poster" />
        

        <ul class="meta">
          <li>📅 Release Date: {{ movie.aired?.from?.substring(0, 10) || 'N/A' }}</li>
          <li>⏱️ Running Time: {{ movie.duration || 'N/A' }}</li>
          <li>🎬 Genre: {{ movie.genres?.map(g => g.name).join(', ') }}</li>
          <li>🗣️ Spoken Language: ENG</li>
          <li>🈯 Subtitles: BM / CHI</li>
          <li>🔞 Classification: {{ movie.rating || 'N/A'}}</li>
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

      <p><strong>Director:</strong> {{ movie.director || 'Unknown' }}</p>
      <p><strong>Cast:</strong> {{ movie.cast || 'Unknown' }}</p>
      <p><strong>Synopsis:</strong> {{ movie.synopsis || movie.background || 'No synopsis available.' }}</p>
    </div>


    <div class="button-container">
      <router-link 
        :to="{ name: 'payment', params: { mal_id: movie.mal_id } }"
        class="btn"
      >
        Book
      </router-link>
    </div>
  </div>
  <p v-else>Loading movie...</p>
</template>

<script>
import axios from 'axios';

export default {
  props: ['mal_id'],
  data() {
    return {
      movie: null,
    };
  },
  mounted() {
    this.fetchMovieDetails();
  },
  methods: {
    fetchMovieDetails() {
      axios.get(`https://api.jikan.moe/v4/anime/${this.mal_id}`)
        .then(response => {
          this.movie = response.data.data;
        })
        .catch(error => {
          console.error('Failed to fetch movie details:', error);
        });
    },
    goToPayment() {
      this.$router.push({ name: 'payment', query: { mal_id: this.mal_id } });
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

.button-container {
  display: flex;
  justify-content: flex-end;
}

.btn {
  background-color: #ffb300;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
  transition: background-color 0.2s ease;
}

.btn:hover {
  background-color: #e39f00;
}
</style>
