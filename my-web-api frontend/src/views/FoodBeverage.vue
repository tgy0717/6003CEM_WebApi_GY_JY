<template>
  <h1 class="title">Food and Beverages</h1>

  <div v-if="dataLoaded">
    <h1 class="category-title">Hot Foods</h1>

    <div class="fnb-container">
      <div v-for="(item, index) in hotFoods" :key="index" class="fnb-card">
        <img :src="item.image" :alt="item.name" class="fnb-image" />

        <div class="fnb-details">
          <div class="fnb-name">{{ item.name }}</div>
          <div class="fnb-bottom">
            <div class="fnb-price">RM {{ item.price.toFixed(2) }}</div>
            <div class="quantity-control">
              <button @click="decreaseQty(item)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQty(item)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h1 class="category-title">Snacks</h1>

    <div class="fnb-container">
      <div v-for="(item, index) in snacks" :key="index" class="fnb-card">
        <img :src="item.image" :alt="item.name" class="fnb-image" />

        <div class="fnb-details">
          <div class="fnb-name">{{ item.name }}</div>
          <div class="fnb-bottom">
            <div class="fnb-price">RM {{ item.price.toFixed(2) }}</div>
            <div class="quantity-control">
              <button @click="decreaseQty(item)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQty(item)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <h1 class="category-title">Drinks</h1>

    <div class="fnb-container">
      <div v-for="(item, index) in drinks" :key="index" class="fnb-card">
        <img :src="item.image" :alt="item.name" class="fnb-image" />

        <div class="fnb-details">
          <div class="fnb-name">{{ item.name }}</div>
          <div class="fnb-bottom">
            <div class="fnb-price">RM {{ item.price.toFixed(2) }}</div>
            <div class="quantity-control">
              <button @click="decreaseQty(item)">−</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQty(item)">+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="loading">Loading food and beverages...</div>
</template>


<script>
export default {
  data() {
    return {
      hotFoods: [],
      snacks: [],
      drinks: [],
      dataLoaded: false
    };
  },
  methods: {
    async fetchItems(searchTerms, targetArray, limit = 3, prices = []){
      try{
        // const response = await fetch(
        //   `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerms)}&search_simple=1&action=process&json=1`
        // );
        const response = await fetch(
          `/api/cgi/search.pl?search_terms=${encodeURIComponent(searchTerms)}&search_simple=1&action=process&json=1`
        );

        const data = await response.json();

        const items = data.products
          .filter(p => p.image_front_small_url && (p.abbreviated_product_name || p.product_name))
          .slice(0, limit)
          .map((product, index) => ({
            id: product.id,
            name: product.abbreviated_product_name || product.product_name,
            image: product.image_front_small_url,
            price: prices.length > 0 ? prices[index % prices.length] : 5.0,
            quantity: 0
          }));

          this[targetArray].push(...items); //append to array

      } catch (error) {
        console.error(`Error fetching ${searchTerms} data:`, error);
      }
    },
    async fetchAllItems() {
      // Clear arrays before append
      this.hotFoods = [];
      this.snacks = [];
      this.drinks = [];

      // Fetch Hot Foods
      const hotFoodTerms = [
        { name: "Nuggets végétaliennes", price: 9.0},
        { name: "Sandwich Le Gourmand Club", price: 16.0},
        { name: "POPCORN CARAMEL", price: 18.0},
      ]

      for (const hotFood of hotFoodTerms) {
        await this.fetchItems(hotFood.name, "hotFoods", 1, [hotFood.price]);
      }

      // Fetch Snacks
      await this.fetchItems("lays", "snacks", 3, [4.5, 5.0, 6.5]);

      // Fetch Drinks
      const drinkTerms = [
        { name: "pepsi zero sleek", price: 4.0 },
        { name: "coca-cola", price: 4.0 },
        { name: "lemon tea", price: 6.0 },
      ];

      for (const drink of drinkTerms) {
        await this.fetchItems(drink.name, "drinks", 1, [drink.price]);
      }

      this.dataLoaded = true;
    },

    increaseQty(item) {
      item.quantity++;
    },
    
    decreaseQty(item) {
      if (item.quantity > 0) item.quantity--;
    }
  },
  async mounted() {
    this.fetchAllItems();
  }
};
</script>


<style scoped>
.category-title {
  font-size: 24px;
  margin-bottom: 15px;
  color: white;
  padding-left: 40px;
  font-weight: bold;
  margin-top: 20px;
}

</style>
