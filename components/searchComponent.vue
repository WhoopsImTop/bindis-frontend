<template>
  <div class="search-container">
    <input
      type="text"
      placeholder="Suche"
      v-model="search"
      @input="triggerSearch"
    />
    <img src="/search.svg" height="30px" />
    <div class="result-container" v-if="searchResults.length > 0">
      <nuxt-link
        class="result"
        v-for="result in searchResults"
        :key="result.id"
        :to="'/produkte/' + result.slug"
      >
        <img
          v-if="result.images.length > 0"
          :src="
            'https://api.bindis-schaulaedle.de/public/images/products/' +
            result.images[0].src
          "
          width="70"
        />
        <img v-else src="/produktbild_fehlt.png" width="70" />
        <div class="result_text">
          <p class="result_title">{{ result.name }}</p>
          <p class="regular_price">{{ result.regular_price }} €</p>
        </div>
      </nuxt-link>
    </div>
    <div class="result-container" v-if="loading">
      <div class="result">
        <div class="result-text">
          <p class="result-title">Suche nach {{ this.search }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      search: "",
      searchResults: [],
      searchTimeout: null,
      loading: false,
    };
  },
  methods: {
    triggerSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchProducts();
      }, 500);
    },
    redirectToSearch() {
      this.$router.push("/produkt-suche/" + this.search);
    },
    searchProducts() {
      this.loading = true;
      this.$axios
        .get("/products/" + this.search)
        .then((res) => {
          this.loading = false;
          this.searchResults = res.data.data.filter((product) => {
            return product.status != "draft";
          })
        })
        .catch((err) => {
          this.loading = false;
          this.searchResults = [
            {
              id: 0,
              name: "Keine Ergebnisse gefunden",
              slug: "",
              images: [],
              regular_price: "",
            },
          ];
        });
    },
  },
  mounted() {
    //hide search results when clicking outside of search container
    document.addEventListener("click", (e) => {
      if (!this.$el.contains(e.target)) {
        this.searchResults = [];
      }
    });

    //hide search results when pressing escape
    document.addEventListener("keydown", (e) => {
      if (e.key == "Escape") {
        this.searchResults = [];
      }
    });

    //hide search results when navigating to another page
    this.$router.afterEach(() => {
      this.searchResults = [];
    });

    //trigger search when pressing enter
    document.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        this.redirectToSearch();
      }
    });

    //trigger search when clicking search icon
    document
      .querySelector(".search-container img")
      .addEventListener("click", () => {
        this.searchProducts();
      });
  },
};
</script>

<style>
</style>