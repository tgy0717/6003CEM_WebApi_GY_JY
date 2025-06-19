<template>
  <div>

    <!-- User Profile -->
    <div v-if="user" class="profileContainer">
      <div class="profileCard">
        <!-- Circle with First Letter -->
        <div class="icon">{{ userInitial }}</div>

        <!-- User Info -->
        <p class="membershipLabel">Member</p>
        <h2 class="username">{{ user.username }}</h2>


      </div>

      
      <div class="editProfileContainer">
        <p class="editTitle">Edit Profile</p>

        <ul class="meta">
          <li>
            <span class="profile-title">Username:</span>
            <input v-model="editableUser.username" class="profile-input" type="text" />
          </li>
          <li>
            <span class="profile-title">Email:</span>
            <input v-model="editableUser.email" class="profile-input" type="email" />
          </li>
          <li style="padding-top: 10px;">
            <span class="profile-title">Password:</span>
            <button class="editPasswordButton" @click="showPasswordDialog = true">Edit</button>
          </li>
        </ul>

        <div class="saveButton-container">
          <button class="saveButton" @click="saveProfile">Save</button>
        </div>

        <!-- Password Dialog -->
        <div v-if="showPasswordDialog" class="dialog-overlay">
          <div class="password-dialog">
            <div class="editTitle" style="padding-bottom: 10px;">Change Password</div>
            <input class="profile-input" v-model="passwordForm.oldPassword" type="password" placeholder="Old Password" />
            <input class="profile-input" v-model="passwordForm.newPassword" type="password" placeholder="New Password" />
            <input class="profile-input" v-model="passwordForm.confirmPassword" type="password" placeholder="Confirm Password" />
            <div class="dialog-actions">
              <button class="cancelEditButton" @click="showPasswordDialog = false">Cancel</button>
              <button class="editPasswordButton" @click="changePassword">Submit</button>
            </div>
          </div>
        </div>
      </div>

      
    </div>

    <!-- Loading state -->
    <div v-else class="loading-profile">
      Loading profile...
    </div>
  </div>
</template>

<script>
import axios from "axios";
const token = localStorage.getItem("token");

export default {
  name: "UserProfile",
  data() {
    return {
      user: null,
      editableUser: {
        username: '',
        email: '',
        _id: '',
      },
      showPasswordDialog: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    };
  },
  created(){
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
      this.editableUser._id = this.user.id;
      this.editableUser.username = this.user.username;
      this.editableUser.email = this.user.email;
    }
  },
  methods: {
    async saveProfile() {
      const payload = {
        username: this.editableUser.username,
        email: this.editableUser.email,
      };
      
      try {
        const response = await axios.put(
          `http://localhost:5000/api/users/${this.editableUser._id}`, 
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        console.log(response)
        alert(response.data.message || "Profile updated successfully!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        window.location.reload();
      } catch (err) {
        alert(err.response?.data?.message || "Failed to update profile.");
      }
    },
    async changePassword() {
      const { oldPassword, newPassword, confirmPassword } = this.passwordForm;

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }

      if (!oldPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all password fields.");
        return;
      }

      const payload = {
        oldPassword,
        newPassword,
        confirmPassword
      };

      try {
        const response = await axios.put(
          `http://localhost:5000/api/users/${this.editableUser._id}/password`, 
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        alert(response.data.message || "Password changed successfully!");

        // Clear and close dialog
        this.passwordForm = {
          oldPassword: "",
          newPassword: "",
          confirmPassword: ""
        };
        this.showPasswordDialog = false;
        window.location.reload();

      } catch (err) {
        alert(err.response?.data?.message || "Failed to change password.");
      }
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
    width: fit-content;
    height: 100%;
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
    width: 500px;
    height: 270px;
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

  .profile-title{
    font-weight: bold;
    color: white;
    align-self: center;
  }

  .profile-value {
    color: yellow;
    text-align: right;
    font-weight: bold;
  }

  .profile-input {
    border-radius: 6px;
    color: white;
    background-color: #3c3c3c;
    border: 1px solid black; 
    padding: 10px;
    font-size: 15px;
    outline: none;
  }

  .profile-input:focus {
    border-color: yellow;
  }

  .editPasswordButton {
    padding: 8px 20px;
    background-color: #0091ea;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  .cancelEditButton {
    padding: 8px 20px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .password-dialog {
    background: #444;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
  }

  .password-dialog input {
    width: 100%;
    margin-bottom: 10px;
    padding: 8px;
  }

  .dialog-actions {
    padding-top: 5px;
    display: flex;
    justify-content: space-between;
  }
  
  .saveButton-container{
    width: 100%;
    text-align: center;
    padding-top: inherit;
  }

  .saveButton{
    padding: 8px 55px; 
    background-color: #cca300;
    border-radius: 4px;
    border: none;
    font-weight: bold;
    color: white;
    font-size: 15px;
    cursor: pointer;
  }
</style>
