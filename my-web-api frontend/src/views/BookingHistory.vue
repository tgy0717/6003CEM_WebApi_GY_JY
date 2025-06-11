<template>
    <div class="booking-history">
        <div class="history-title">
            <h2>My Booking History</h2>
        </div>

        <div v-if="loading" class="loading-message">
            <p>Loading booking history...</p>
        </div>

        <div v-else-if="bookings.length === 0" class="no-booking-message">
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
                            <p><span class="label">Ticket(s): Normal x{{ booking.quantity }}</span></p>
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
            try{
                this.loading = true;

                const response = await axios.get('http://localhost:5000/api/get-booking', {
                    params: {
                        userId: userId
                    }
                });

                const bookings = response.data;

                // For each booking, fetch its movie details and add to booking object
                for (const booking of bookings) {
                try {
                    const movieResponse = await axios.get(`https://api.jikan.moe/v4/anime/${booking.movieId}`);
                    booking.movieTitle = movieResponse.data.data.title;
                    booking.movieImage = movieResponse.data.data.images?.jpg?.image_url;
                } catch (movieError) {
                    console.error(`Failed to fetch movie for ID ${booking.movieId}`, movieError);
                    booking.movieTitle = 'Unavailable';
                    booking.movieImage = '';
                }
                }

                this.bookings = bookings;
                console.log("Bookings:", this.bookings);
            }catch(error){
                console.error('Failed to fetch booking history: ', error);
            }finally{
                this.loading = false;
            }
            
        }
    }
}

</script>

<style scoped>
.history-title {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center;
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin: 20px;
  text-align: center;
}

.no-booking-message,
.loading-message {
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center;
  font-size: 18px;
  padding: 20px;
  text-align: center;
}

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