<template>
    <main>
      <h1 class="title">Top IMDB Movies</h1>

      <div v-if="tvShows.length" class="movie-container">
        <div v-for="show in tvShows" :key="show.id" class="movie-card">
          
          <div 
              class="movie-image" 
              :style="{ backgroundImage: 'url(' + show.primaryImage + ')' }"
          >
    
          <div class="overlay"></div>

            <div class="movie-details">
                <h2 class="movie-title">{{ show.primaryTitle || show.title }}</h2>
                <!-- <p class="movie-info"><strong>Description:</strong> {{ show.description || 'N/A' }}</p> -->
                <p class="movie-info"><strong>Rating:</strong> {{ show.averageRating || 'N/A' }}</p>
                <p class="movie-info"><strong>Genres:</strong> {{ show.genres?.join(', ') || 'N/A' }}</p>
                <p class="movie-info"><strong>Duration:</strong> {{ show.runtimeMinutes }} Minutes</p>
                <p class="movie-info"><strong>Release Date:</strong> {{ show.releaseDate || 'N/A' }}</p>
                <p class="movie-info"><strong>Languages:</strong> {{ show.spokenLanguages?.join(', ') || 'N/A' }}</p>

                <router-link 
                    :to="{ name: 'movie-details', params: { id: show.id } }" 
                    class="view-more"
                    >
                    View More
                </router-link>
            </div>
          </div>
          <h2 class="movie-title text-center" style="font-size: 16px;">{{ show.primaryTitle }}</h2>
        </div>
      </div>

      <p v-else class="loading">Loading TV shows...</p>
    </main>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tvShows: []
    };
  },
  async mounted() { 
    const options = {
      method: 'GET',
      url: 'https://imdb236.p.rapidapi.com/api/imdb/top250-movies',
      headers: {
        'x-rapidapi-key': '613d9ec67amsh6a60e222647b7f4p1c74ebjsn7c4e57299df7',
        'x-rapidapi-host': 'imdb236.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      let shows = response.data || [];

      shows = shows.sort((a, b) => {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);
        return dateB - dateA;
      });

      this.tvShows = shows.slice(0, 100);

      console.log(response.data)
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    }
  }
};
</script>

<style scoped>
	.loading {
    text-align: center;
    font-size: 18px;
    color: #aaa;
	}
</style>
