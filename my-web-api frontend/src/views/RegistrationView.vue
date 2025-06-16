<template>
    <div class="login-page">
        <div class="login-container">
            <h1 class="login-title">Registration</h1>
            <form @submit.prevent="handleRegister" class="login-form">
                <input
                    type="text"
                    v-model="username"
                    placeholder="Username"
                    class="login-input"
                    required
                />
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
                <input
                    type="password"
                    v-model="confirmPassword"
                    placeholder="Confirm Password"
                    class="login-input"
                    required
                />
                
                <button type="submit" class="login-button" style="margin-bottom: 10px;">Register</button>
            </form>
        </div>
    </div>
</template>

<script>
    import { ref, } from "vue";
    import axios from "axios";

    export default {
        data() {
            return{
                username: "",
                email: "",
                password: "",
                confirmPassword: ""
            };
        },
        methods: {
            async handleRegister(){
                if(this.password !== this.confirmPassword){
                    alert("Password do not match!");
                    return;
                }

                try{
                    const response = await axios.post("http://localhost:5000/api/register", {
                        username: this.username,
                        email: this.email,
                        password: this.password
                    });

                    alert(response.data.message);

                    this.$router.push("/");

                } catch (error) {
                    if(error.response){
                        alert(error.response.data.message);
                    } else {
                        alert("An error occured!");
                    }
                }
            }
        }
    }

</script>

<style>
</style>

