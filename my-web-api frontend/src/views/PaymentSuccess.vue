<template>
  <div class="success-container">
    <h1>Payment Successful!</h1>
    <p>Thank you for your purchase.</p>
    <p>You can view the booking in your booking history now.</p>
    <router-link to="/home" class="btn">Back to Home</router-link>
  </div>
</template>

<script>
import axios from 'axios'; 
const token = localStorage.getItem("token");

export default {
  name: "PaymentSuccess",
  async mounted() {
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('session_id');

    if(!sessionId) {
        alert('Invalid session');
        return this.$router.push('/home');
    }

    try{
        const response = await axios.post(
          'http://localhost:5000/api/verify-and-save-booking',
          { sessionId },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
    } catch(error) {
        alert('Failed to confirm booking: ' + error.message);
    }
  }
};
</script>

<style scoped>
.success-container {
  text-align: center;
  margin-top: 100px;
}
h1 {
  color: #4BB543;
  margin-bottom: 10px;
}
.btn {
  display: inline-block;
  margin-top: 20px;
  padding: 0.75rem 1.5rem;
  background-color: #4BB543;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}
</style>
