<template>
  <!-- Selection form - centered -->
  <div class="selection-wrapper" v-if="!movie && !loading">
    <div class="selection-form">
      <h2>Select Cinema and Date</h2>

      <label for="cinema">Cinema:</label>
      <select v-model="cinema" id="cinema">
        <option disabled value="">-- Select a cinema --</option>
        <option v-for="c in cinemas" :key="c">{{ c }}</option>
      </select>

      <label for="date">Date:</label>
      <input type="date" v-model="date" :min="today" id="date" />

      <button @click="confirmSelection" :disabled="!cinema || !date">Confirm</button>
    </div>
  </div>

  <!-- Loading message when fetching movie -->
  <div v-if="loading" class="loading-message">
    <p>Loading movie details...</p>
  </div>

  <div v-if="movie" class="payment-container">
    <div class="movie-container">
      <!-- Left: Movie Image -->
      <div class="image-section">
        <img :src="movie.images?.jpg?.image_url || movie.primaryImage" alt="Movie Poster" />
      </div>

      <!-- Right: Movie Details -->
      <div class="details-section">
        <div class="top-row">
          <div class="ticket-info">
            <h2>{{ movie.title || movie.primaryTitle }}</h2>
            <p><span class="label">Duration: {{ movie.duration || movie.runtimeMinutes + " Minutes" }}</span></p>

            <p><span class="label">Cinema: {{ cinema }}</span></p>
            <p><span class="label">Date: {{ formattedDate }}</span></p>
            <p><span class="label">Ticket(s): Normal x{{ quantity }}</span></p>
          </div>
          <div class="price">
            <p>RM {{ totalPrice.toFixed(2) }}</p>
          </div>
        </div>

        <!-- Quantity moved to bottom-right inside container -->
        <div class="quantity-row">
          <label>Quantity:</label>
          <div class="quantity-controls">
            <button @click="decreaseQty">-</button>
            <span>{{ quantity }}</span>
            <button @click="increaseQty">+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pay Button OUTSIDE container -->
    <div class="pay-button-wrapper">
      <button class="pay-btn" @click="pay">Pay Now</button>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

export default {
  props: ['mal_id', 'id'],
  data() {
    return {
      movie: null,
      stripe: null,
      price: 15.00,
      quantity: 1,
      user: null,
      cinema: '',
      date: '',
      cinemas: ['GSC Queensbay Mall', 'TGV Gurney Paragon', 'GSC Gurney Plaza'],
      loading: false
    };
  },
  computed: {
    totalPrice() {
      return this.price * this.quantity;
    },
    formattedDate() {
      if (!this.date) return '';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(this.date).toLocaleDateString(undefined, options);
    },
    today() {
      return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    }
  },
  mounted() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }

    this.initializeStripe();
  },
  methods: {
    async initializeStripe() {
      this.stripe = await loadStripe('pk_test_51RXavSRu4cTd4opzqCWzsUqFCSuPkRYNR6oA4vNwB7Od240pH3IwfCOE0mInSEPTzr9JDUvvGR9krTiWBSXktJzC00PE1duqhg');
    },
    confirmSelection() {
      if (this.cinema && this.date) {
        this.fetchMovieDetails();
      }
    },
    fetchMovieDetails() {
      this.loading = true;

      if (this.mal_id) {
        // Jikan API
        axios.get(`https://api.jikan.moe/v4/anime/${this.mal_id}`)
          .then(response => {
            this.movie = response.data.data;
          })
          .catch(error => {
            console.error('Failed to fetch Jikan movie:', error);
          })
          .finally(() => {
            this.loading = false;
          });

      } else if (this.id) {
        const options = {
          method: 'GET',
          url: 'https://imdb236.p.rapidapi.com/api/imdb/top250-movies',
          headers: {
            'x-rapidapi-key': '613d9ec67amsh6a60e222647b7f4p1c74ebjsn7c4e57299df7',
            'x-rapidapi-host': 'imdb236.p.rapidapi.com'
          }
        };

        axios.request(options)
          .then(response => {
            const shows = response.data;
            this.movie = shows.find(show => show.id === this.id);
            console.log(this.movie);
          })
          .catch(error => {
            console.error('Error fetching TV shows:', error);
          });
      }

      
      this.loading = false;
    },
    async pay() {
      try {
        const response = await axios.post('http://localhost:5000/api/create-checkout-session', {
          movieId: this.mal_id || this.id,
          movieTitle: this.movie.title || this.movie.primaryTitle,
          price: this.totalPrice,
          userId: this.user.id,
          quantity: this.quantity,
          cinema: this.cinema,
          bookingDate: this.date
        });

        const sessionId = response.data.id;
        const { error } = await this.stripe.redirectToCheckout({ sessionId });

        if (error) {
          alert(error.message);
        }
      } catch (error) {
        alert('Failed to initiate payment: ' + error.message);
      }
    },
    increaseQty() {
      this.quantity++;
    },
    decreaseQty() {
      if (this.quantity > 1) {
        this.quantity--;
      } else {
        alert("Minimum quantity is 1.");
      }
    },
  }
};
</script>

<style scoped>
.selection-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.selection-form {
  margin: 30px;
  padding: 20px;
  background: #333;
  color: white;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 350px;
}

.selection-form select,
.selection-form input[type="date"] {
  padding: 8px;
  border-radius: 5px;
  border: none;
}

.selection-form button {
  padding: 0.6rem 1.2rem;
  background-color: #ffb300;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.payment-container {
  margin: 20px;
}

.movie-container {
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

.price {
  font-size: 16px;
  font-weight: bold;
  white-space: nowrap; 
}

.ticket-info > *:not(:last-child) {
  margin-bottom: 10px;
}

.quantity-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 30px;
  gap: 10px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-controls button {
  background-color: #555;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.quantity-controls button:hover {
  background-color: #777;
}

.quantity-controls span {
  min-width: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
}

/* Pay button outside the container */
.pay-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin: 20px;
}

.pay-btn {
  padding: 0.8rem 1.5rem;
  background-color: #ffb300;
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
}

.loading-message {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 20px;
  color: white;
}

</style>
