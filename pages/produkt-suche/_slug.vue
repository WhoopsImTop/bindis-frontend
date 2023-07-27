<template>
    <div class="content-container text-container shop-grid-container">
      <div class="sidebar">
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
      <div class="products" v-if="products.length > 0">
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
      <div class="products" style="text-align: center;" v-else>
        <img src="/404.svg" alt="404" title="404" loading="lazy" style="width: 70%; margin-bottom: 30px;"/>
        <h3 style="margin-bottom: 10px">Keine Produkte gefunden für <br> "{{ $route.params.slug }}"</h3>
        <p>Versuchen Sie nach einem anderen Begriff zu suchen.</p>
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
    async asyncData({ $axios, params}) {
      const response = await $axios.get("/products" + (params.slug ? '/' + params.slug : '') + '?status=publish');
      const categories = await $axios.get("/categories");
      //remove query from url
      history.replaceState({}, null, "/shop");
      return {
        products: response.data.data,
        pages: response.data.links,
        categories: categories.data.data,
      };
    },
    methods: {
      async fetchPages(url) {
        const response = await this.$axios.get(url + '&status=publish');
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