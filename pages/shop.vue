<template>
  <div class="content-container text-container shop-grid-container">
    <div class="sidebar">
      <div class="sidebar-item">
        <h4>Suche</h4>
        <input
          class="search-input"
          type="search"
          v-model="productSearch"
          placeholder="Produkte suchen..."
          @input="searchProducts"
        />
      </div>
      <div class="sidebar-item">
        <h4>Kategorien</h4>
        <hr class="sidebar-divider" />
        <ul>
          <li v-for="category in categories" :key="category.id">
            <a :href="'/produkt-kategorien/' + category.name">{{
              category.name
            }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="products">
      <product-list-item
        v-for="product in products"
        v-show="product.status === 'published' || product.regular_price > 0"
        :key="product.id"
        :product="product"
      ></product-list-item>
      <div class="pagination">
        <button
          class="button"
          v-if="pages.prev"
          @click="fetchPages(pages.prev)"
        >
          Zurück
        </button>
        <button
          v-if="pages.next"
          @click="fetchPages(pages.next)"
          class="button"
        >
          Weiter
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import productListItem from "~/components/productListItem.vue";
export default {
  components: { productListItem },
  data: () => {
    return {
      products: [],
      categories: [],
      productSearch: "",
      searchTimeout: null,
    };
  },
  async asyncData({ $axios, query}) {
    const response = await $axios.get("/products" + (query.search ? '/' + query.search : ''));
    const categories = await $axios.get("/categories");
    return {
      products: response.data.data,
      pages: response.data.links,
      categories: categories.data.data,
    };
  },
  methods: {
    async fetchPages(url) {
      const response = await this.$axios.get(url);
      this.products = response.data.data;
      this.pages = response.data.links;
    },
    searchProducts() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.$axios.get("/products/" + this.productSearch).then((response) => {
          this.products = response.data.data;
          this.pages = response.data.links;
        });
      }, 500);
    },
  },
  async beforeMount() {
    if (localStorage.getItem("cartItems")) {
      try {
        //load cartItems from localstorage in vuex
        this.$store.commit(
          "loadCardItems",
          JSON.parse(localStorage.getItem("cartItems"))
        );
      } catch (e) {
        localStorage.removeItem("cartItems");
      }
    }
  },
};
</script>

<style>
</style>