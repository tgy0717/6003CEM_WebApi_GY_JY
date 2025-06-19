<template>
    <div class="login-page">
        <div class="login-container">
            <h1 class="login-title">Login</h1>
            <form @submit.prevent="handleLogin" class="login-form">
                <input
                    type="text"
                    v-model="email"
                    placeholder="Email"
                    class="login-input"
                    required
                />
                <input
                    type="password"
                    v-model="password"
                    placeholder="Password"
                    class="login-input"
                    required
                />
                <div class="forgot-password-container">
                    <router-link to="/forgot-password" class="forgot-password-button">Forgot password?</router-link>
                </div>
                <button type="submit" class="login-button">Login</button>

                <div class="register-container">
                    <router-link to="/registration" class="register-button">Do not have an account?</router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

export default {
    setup() {
        const email = ref("");
        const password = ref("");
        const router = useRouter();

        const handleLogin = async () => {
            try {
                const response = await axios.post("http://localhost:5000/api/login", {
                    email: email.value,
                    password: password.value,
                });

                alert(response.data.message); // notify success

                // Store user and token in localStorage
                localStorage.setItem("user", JSON.stringify(response.data.user));
                localStorage.setItem("token", response.data.token);

                router.push("/home"); // Redirect to homepage or dashboard
            } catch (error) {
                alert(error.response?.data?.message || "Login failed");
            }
        };

        const handleGoogleLogin = () => {
            alert("Google login not implemented.");
        };

        return {
            email,
            password,
            handleLogin,
            handleGoogleLogin
        };
    }
};
</script>

<style>
    .forgot-password-container{
        display: flex;
        justify-content: flex-end;
        padding-bottom: 10px;
    }

    .forgot-password-button{
        color: black;
        font-size: 13px;
        font-weight: 100;
        font-style: italic;
    }

    .register-container {
        display: flex;
        padding-top: 10px;
        justify-content: center;
    }

    .register-button{
        color: black;
        font-size: 13px;
        font-weight: 100;
    }

</style>

