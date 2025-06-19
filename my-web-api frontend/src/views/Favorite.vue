<template>
	<main>
		<h1 class="title">My Favorites</h1>

		<p v-if="!loading && favorites.length === 0" class="loading">No favorites found.</p>
		<div v-else="favorites.length" class="movie-container">
			<div v-for="movie in favorites" :key="movie.movieId" class="movie-card">
				<div 
				class="movie-image" 
				:style="{ backgroundImage: 'url(' + movie.image + ')' }"
				>
					<div class="overlay"></div>
					<div class="movie-details">
						<h2 class="movie-title">{{ movie.title }}</h2>
						<p class="movie-info"><strong>Rating:</strong> {{ movie.rating }}</p>
						<p class="movie-info"><strong>Genres:</strong> {{ movie.genres }}</p>
						<p class="movie-info"><strong>Duration:</strong> {{ movie.duration }}</p>
						<p class="movie-info"><strong>Release Date:</strong> {{ movie.releaseDate }}</p>
						<router-link 
              			:to="getRouterLink(movie.id)" 
						class="view-more">
						View More
						</router-link>
					</div>
				</div>
				
                <h2 class="movie-title text-center" style="font-size: 16px;">{{ movie.title }}</h2>	
			</div>
		</div>
	</main>
</template>

<script>
import axios from 'axios';
import { useLoading } from '@/composables/useLoading'
const { showLoading, hideLoading } = useLoading()
const token = localStorage.getItem("token")

export default {
	data() {
		return {
		favorites: [],
		userId: '', // Assume populated from auth/user store
		loading: false
		};
	},
	async mounted() {
		showLoading()
		this.loading = true;
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			this.user = JSON.parse(storedUser);
		}
		try {
			console.log("Token: ", token);
			const response = await axios.get('http://localhost:5000/api/get-favorites', {
			// params: { userId: this.user.id }
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		const favoriteList = response.data;
		console.log(favoriteList)

		for (const fav of favoriteList) {
			if (fav.startsWith('tt')) {
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
					
					const movie = shows.find(m => m.id === fav);
					if (movie) {
					this.favorites.push({
						id: fav,
						title: movie.primaryTitle,
						image: movie.primaryImage,
						rating: movie.averageRating,
						genres: movie.genres?.join(', ') || 'N/A',
						duration: movie.runtimeMinutes + ' Minutes',
						releaseDate: movie.releaseDate
					});
					}
				} catch (error) {
					console.error(`Failed to fetch IMDB movie ${fav}:`, error);
				}

			} else {
				const jikan = await axios.get(`https://api.jikan.moe/v4/anime/${fav}`);
				const anime = jikan.data.data;

				this.favorites.push({
				id: fav,
				title: anime.title,
				image: anime.images.jpg.image_url,
				rating: anime.score,
				genres: anime.genres.map(g => g.name).join(', '),
				duration: anime.duration,
				releaseDate: anime.aired.from?.substring(0, 10)
				});
			}
			
			
		}
		
		} catch (err) {
			console.error('Failed to load favorites:', err);
		}

		this.loading = false;
		hideLoading()
	},
	methods: {
		getRouterLink(movie) {
			return movie.startsWith('tt')
			? { name: 'movie-details', params: { id: movie } }
			: { name: 'details', params: { mal_id: movie } };
		}
	}
};
</script>
