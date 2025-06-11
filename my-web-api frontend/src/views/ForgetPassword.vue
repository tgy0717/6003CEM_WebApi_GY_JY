<template>
    <div class="login-page">
        <div class="login-container">
            <div v-if="step === 1">
                <form @submit.prevent="handleNext" class="login-form">
                    <input
                        type="text"
                        v-model="email"
                        placeholder="Email"
                        class="login-input"
                        required
                    />
                    <button type="submit" class="login-button">Next</button>
                </form>
            </div>

            <div v-else-if="step === 2">
                <form @submit.prevent="handleVerification" class="login-form">
                    <input
                        type="text"
                        v-model="verificationCode"
                        placeholder="Enter 6-digit code"
                        class="login-input"
                        required
                    />
                    <button type="submit" class="login-button">Verify</button>
                </form>
            </div>

            <div v-else-if="step === 3">
                <form @submit.prevent="resetPassword" class="login-form">
                    <input
                        type="password"
                        v-model="newPassword"
                        placeholder="New Password"
                        class="login-input"
                        required
                    />
                    <input
                        type="password"
                        v-model="confirmPassword"
                        placeholder="Confirm New Password"
                        class="login-input"
                        required
                    />
                    <button type="submit" class="login-button">Submit</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      verificationCode: "",
      newPassword: "",
      confirmPassword: "",
      step: 1, // Controls which form is shown
    };
  },
  methods: {
    async handleNext() {
      if (this.email) {
        try {
          const response = await axios.post("http://localhost:5000/api/forgot-password", {
            email: this.email,
          });
          this.step = 2; // Move to step 2
          if (response.data?.message) {
            alert(response.data.message);
          }
        } catch (error) {
          alert(error.response?.data?.message || "Error sending verification code.");
          console.error("Error:", error);
        }
      }
    },

    async handleVerification() {
      if (this.verificationCode) {
        try {
          const response = await axios.post("http://localhost:5000/api/verify-code", {
            email: this.email,
            code: this.verificationCode,
          });
          this.step = 3; // Move to step 3
          if (response.data?.message) {
            alert(response.data.message);
          }
        } catch (error) {
          alert(error.response?.data?.message || "Error verifying code.");
          console.error("Error:", error);
        }
      }
    },

    async resetPassword() {
      if (this.newPassword && this.confirmPassword) {
        try {
          const response = await axios.post("http://localhost:5000/api/reset-password", {
            email: this.email,
            new_password: this.newPassword,
            confirm_password: this.confirmPassword,
          });
          if (response.data?.message) {
            alert(response.data.message);
          }
          this.$router.replace({ path: "/" });
        } catch (error) {
          alert(error.response?.data?.message || "Error resetting password.");
          console.error("Error:", error);
        }
      }
    },
  },
};
</script>