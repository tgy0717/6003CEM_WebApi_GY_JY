<template>
  <div>
    <!-- Top Bar -->
    <div class="topbar">
      <router-link style="text-decoration: none;" to="/booking-history" class="topbar-link">Booking History</router-link>
      <router-link style="text-decoration: none;" to="/fnb" class="topbar-link">F&B</router-link>
      <router-link style="text-decoration: none;" to="/profile" class="topbar-link">Profile</router-link>
    </div>

    <!-- User Profile -->
    <div v-if="user" class="profileContainer">
      <div class="profileCard">
        <!-- Circle with First Letter -->
        <div class="icon">{{ userInitial }}</div>

        <!-- User Info -->
        <p class="membershipLabel">Member</p>
        <h2 class="username">{{ user.username }}</h2>

        <!-- Optional Card Number or Email
        <p class="card-info">{{ user.email }}</p> -->

        <!-- Edit Profile Button -->
        <button class="editButton">Edit Profile</button>
      </div>

      <div class="editProfileContainer">
        <p class="editTitle">Edit Profile</p>

        <label for="username">Username</label>
        <input type="text" id="username" v-model="editedUser.username" class="editInput" />

        <label for="email">Email</label>
        <input type="email" id="email" v-model="editedUser.email" class="editInput" />

        <button class="saveButton" @click="saveProfile">Save</button>
      </div>
      
    </div>

    <!-- Loading state -->
    <div v-else class="loading-profile">
      Loading profile...
    </div>
  </div>
</template>

<script>
export default {
  name: "UserProfile",
  data() {
    return {
      user: null
    };
  },
  computed: {
    userInitial() {
      return this.user && this.user.username
        ? this.user.username[0].toUpperCase()
        : "";
    }
  },
  mounted() {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    }
  }
};
</script>

<style scoped>
.profileContainer {
  display: flex;
  flex-direction: row;
  margin: 50px auto;
  gap: 50px;
  width: fit-content
}

.profileCard {
  background: white;
  color: #000;
  padding: 30px 20px;
  text-align: center;
  width: 320px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI", sans-serif;
  position: relative;
}

.icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
  background: #000;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
}

.membershipLabel {
  font-size: 14px;
  color: #555;
  margin-top: 8px;
}

.username {
  font-size: 18px;
  font-weight: bold;
  margin: 5px 0;
}

.editButton {
  background: #000;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
  font-size: 11px;
}

.editButton:hover {
  background: #333;
}

.editProfileContainer {
  background: #444;
  color: #000;
  padding: 20px 20px;
  width: 900px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  font-family: "Segoe UI", sans-serif;
  position: relative;
}

.editTitle {
  font-size: 20px;
  font-weight: bold;
  color: white;
}
</style>
