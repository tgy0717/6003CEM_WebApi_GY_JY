<template>
	<div class="movie-detail-container" v-if="movie">
		<div class="movie-info">
			<!-- Poster -->
			<div class="poster">
				<img :src="movie.primaryImage" alt="Movie Poster" />
				

				<ul class="meta">
				<li><span class="meta-title">📅 Release Date:</span> <span class="meta-value">{{ movie.releaseDate || 'N/A' }}</span></li>
				<li><span class="meta-title">⏱️ Running Time:</span> <span class="meta-value">{{ movie.runtimeMinutes + " Minutes" || 'N/A' }}</span></li>
				<li><span class="meta-title">🎬 Genre:</span> <span class="meta-value">{{ movie.genres?.join(', ') }}</span></li>
				<li><span class="meta-title">🗣️ Spoken Language:</span> <span class="meta-value">{{ movie.spokenLanguages?.join(', ') || 'N/A' }}</span></li>
				<li><span class="meta-title">🔞 Classification:</span> <span class="meta-value">{{ movie.contentRating || 'N/A' }}</span></li>
				</ul>

			</div>

			<!-- Trailer -->
			<div v-if="movie.trailer" class="trailer">
				<h1>{{ movie.primaryTitle }}</h1>
				<div class="trailer-wrapper">
				<iframe 
					:src="`https://www.youtube.com/embed/${videoId}`" 
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
					allowfullscreen
				></iframe>
				</div>
			</div>

		</div>
	
		<!-- Details -->
		<div class="details">

		<!-- <p><strong>Director:</strong> {{ movie.director || 'Unknown' }}</p>
		<p><strong>Cast:</strong> {{ movie.cast || 'Unknown' }}</p> -->
		<p><strong>Synopsis:</strong> {{ movie.description || 'No synopsis available.' }}</p>
		</div>

		<div class="button-container">
		<a @click="toggleFavorite()" :class="['btn-add', { 'btn-added': isFavorite }]">
		{{ isFavorite ? 'Added to Favorites ✓' : 'Add to Favorites ❤️' }}</a>
		<router-link 
			:to="{ name: 'payment', query: { id: movie.id } }"
			class="btn"
		>
			Buy Tickets
		</router-link>
		</div>
	</div>
	<p v-else>Loading movie...</p>
</template>

<script>
import axios from 'axios';

export default {
	props: ['id'],
	computed: {
		videoId() {
			if (!this.movie.trailer) return null;
			// Extract video id from trailer url
			const url = new URL(this.movie.trailer);
			return url.searchParams.get('v');
		}
	},
	data() {
		return {
			movie: null,
			isFavorite: false,
		};
	},
	async mounted() { 
		
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			this.user = JSON.parse(storedUser);
		}

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
			const shows = response.data;
			
			this.movie = shows.find((show) => show.id === this.id);
			console.log(this.movie)
		} catch (error) {
			console.error('Error fetching TV shows:', error);
		}

		
		const movieId = this.mal_id || this.id;
		try {
		const res = await axios.get('http://localhost:5000/api/is-favorite', {
			params: {
			userId: this.user.id,
			movieId: movieId,
			}
		});
		this.isFavorite = res.data.isFavorite;
		} catch (err) {
			console.error('Failed to check favorite status:', err);
		}
	},
	methods:{
		async toggleFavorite() {
			try {
				const favoriteData = {
				userId: this.user.id,
				movieId: this.mal_id || this.id,
				};
				console.log(favoriteData)
				const response = await axios.post('http://localhost:5000/api/toggle-favorite', favoriteData);
				this.isFavorite = !this.isFavorite;

				alert(response.data.message);
			} catch (error) {
				console.error('Failed to toggle favorite:', error);
				alert('Something went wrong.');
			}
		}
	}
}
</script>

<style scoped>
</style>
