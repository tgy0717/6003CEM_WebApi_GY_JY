<template>
  <div class="burger-page">
    <h1>🍔 Burger Menu</h1>
    <div class="burger-list">
      <div class="burger-card" v-for="burger in burgers" :key="burger.id">
        <img :src="burger.images?.sm" :alt="burger.name" class="burger-img" />
        <h3>{{ burger.name }}</h3>
        <p>{{ burger.desc }}</p>
        <p>Price: ${{ burger.price }}</p>
        <p v-if="burger.veg">🌱 Vegetarian</p>
        <p v-else>🥩 Non-Vegetarian</p>

        <h4>Ingredients:</h4>
        <ul class="ingredient-list">
          <li v-for="ingredient in burger.ingredients" :key="ingredient.id">
            <img :src="ingredient.img" :alt="ingredient.name" class="ingredient-img" />
            {{ ingredient.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Burger',
  data() {
    return {
      burgers: []
    };
  },
  mounted() {
    this.fetchBurgers();
  },
  methods: {
    async fetchBurgers() {
      const options = {
        method: 'GET',
        url: 'https://burgers-hub.p.rapidapi.com/burgers',
        headers: {
          'x-rapidapi-key': '1871f1b3bdmsh9d033733ff8cbf5p118b1djsn1abe42bc11b9',
          'x-rapidapi-host': 'burgers-hub.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        this.burgers = response.data;
      } catch (error) {
        console.error('Error fetching burgers:', error);
      }
    }
  }
};
</script>

<style scoped>
.burger-page {
  padding: 20px;
  background: #fffaf0;
}

.burger-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.burger-card {
  background: #ffffff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 16px;
  width: 300px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.burger-img {
  width: 100%;
  border-radius: 8px;
}

.ingredient-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-list li {
  display: flex;
  align-items: center;
  margin-top: 6px;
}

.ingredient-img {
  width: 30px;
  height: 30px;
  margin-right: 10px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
