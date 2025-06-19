<template>
    <div class="booking-history">
        <h1 class="title">My Booking History</h1>

        <div v-if="!loading && bookings.length === 0" class="loading">
            <p>No booking found.</p>
        </div>

        <div v-else class="history-container">
            <div v-for="(booking, index) in bookings" :key="index" class="history-card">
                <div class="image-section">
                    <img :src="booking.movieImage" alt="Movie Poster" />
                </div>

                <div class="details-section">
                    <div class="top-row">
                        <div class="ticket-info">
                            <h2>{{ booking.movieTitle }}</h2>
                            <p><span class="label">Cinema: {{ booking.cinema }}</span></p>
                            <p><span class="label">Date: {{ booking.bookingDate }}</span></p>
                            <p><span class="label">Ticket(s): Normal x {{ booking.quantity }}</span></p>
                        </div>
                        <div class="paymentStatus">
                            {{ booking.paymentStatus }}
                        </div>
                    </div>

                    <div class="amount-row">
                        Amount: RM {{ booking.total.toFixed(2) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import { useLoading } from '@/composables/useLoading'
const { showLoading, hideLoading } = useLoading()
const token = localStorage.getItem("token");

export default {
    data() {
        return {
            bookings: [],
            user: null,
            loading: false,
        }
    },
    mounted() {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            this.user = JSON.parse(storedUser);
        }

        this.fetchBookings(this.user.id);
    },
    methods: {
        async fetchBookings(userId) {
            showLoading()
            try {
                console.log("Token:", token);
                this.loading = true;

                const response = await axios.get('http://localhost:5000/api/get-booking', {
                    // params: { userId },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const bookings = response.data;

                for (const booking of bookings) {
                if (booking.movieId && booking.movieId.startsWith('tt')) {
                    // IMDb logic
                    const options = {
                    method: 'GET',
                    url: 'https://imdb236.p.rapidapi.com/api/imdb/top250-movies',
                    headers: {
                        'x-rapidapi-key': '613d9ec67amsh6a60e222647b7f4p1c74ebjsn7c4e57299df7',
                        'x-rapidapi-host': 'imdb236.p.rapidapi.com'
                    }
                    };

                    try {
                    const imdbResponse = await axios.request(options);
                    const shows = imdbResponse.data;
                    const matched = shows.find(show => show.id === booking.movieId);

                    if (matched) {
                        booking.movieTitle = matched.primaryTitle;
                        booking.movieImage = matched.primaryImage;
                    } else {
                        booking.movieTitle = 'Unavailable';
                        booking.movieImage = '';
                    }
                    } catch (error) {
                    console.error('Error fetching IMDb movie:', error);
                    booking.movieTitle = 'Unavailable';
                    booking.movieImage = '';
                    }

                } else {
                    // Jikan logic
                    try {
                    const movieResponse = await axios.get(`https://api.jikan.moe/v4/anime/${booking.movieId}`);
                    booking.movieTitle = movieResponse.data.data.title;
                    booking.movieImage = movieResponse.data.data.images?.jpg?.image_url;
                    } catch (movieError) {
                    console.error(`Failed to fetch Jikan movie for ID ${booking.movieId}`, movieError);
                    booking.movieTitle = 'Unavailable';
                    booking.movieImage = '';
                    }
                }
                }

                this.bookings = bookings;
                console.log("Bookings:", this.bookings);

            } catch (error) {
                console.error('Failed to fetch booking history:', error);
            } finally {
                this.loading = false;
            }
            hideLoading()
        }
    }
}

</script>

<style scoped>
.history-container{
  margin: 20px;
}

.history-card{
  display: flex;
  background-color: #222;
  padding: 30px;
  border-radius: 20px;
  color: white;
  gap: 30px;
  margin: 20px;
}

.image-section img {
  width: 220px;
  border-radius: 10px;
}

.details-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
}

.top-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.label {
  font-size: 14px;
}

.paymentStatus {
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap; 
  font-style: italic;
  color: green;
}

.ticket-info > *:not(:last-child) {
  margin-bottom: 10px;
}

.amount-row {
    position: absolute;
    bottom: 10px;
    right: 0;
    font-weight: 600;
    font-size: 18px;
}

</style>