<!-- Top Bar -->
<template>
    <div class="topbar">
        <div class="topbar-left">
            <router-link style="text-decoration: none;" to="/movie" class="topbar-link" active-class="active-link">Top IMDB Movie</router-link>
            <router-link style="text-decoration: none;" to="/home" class="topbar-link" active-class="active-link">Top Anime Movie</router-link>
        </div>
        
        <div class="topbar-right">
            <router-link style="text-decoration: none;" to="/favorite" class="topbar-link" active-class="active-link">Favorite Movie</router-link>
            <router-link style="text-decoration: none;" to="/booking-history" class="topbar-link" active-class="active-link">Booking History</router-link>

            <div class="profile-dropdown">
                <router-link to="/profile" style="text-decoration: none;" class="topbar-link" active-class="active-link">Profile</router-link>
                <div class="dropdown-menu">
                    <button @click="signOut">Sign Out</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        signOut() {
        localStorage.clear();

        // sessionStorage.clear();
        console.log("Signing out...");
        this.$router.push('/');
        }
    }
}
</script>
