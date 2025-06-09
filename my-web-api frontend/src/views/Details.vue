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

      <p><strong>Director:</strong> {{ movie.director || 'Unknown' }}</p>
      <p><strong>Cast:</strong> {{ movie.cast || 'Unknown' }}</p>
      <p><strong>Synopsis:</strong> {{ movie.synopsis || movie.background || 'No synopsis available.' }}</p>
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
          console.log(this.movie)
        })
        .catch(error => {
          console.error('Failed to fetch movie details:', error);
        });
    }
  },
}
</script>

<style scoped>
</style>
