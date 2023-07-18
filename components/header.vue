<template>
  <div class="sticky_nav">
    <div class="nav-information-container">
      <div class="content-container nav_row">
        <a href="tel:07681 7808">Telefon: 07681 7808</a>
        <a href="tel:07681 7808">Fragen? info@bindis-schaulaedle.de</a>
        <a>Mo - Fr: 09:30 - 12:30, 15:00 - 18:00 | Sa: 09:00 - 12:00</a>
      </div>
    </div>
    <div class="main-nav-content content-container nav_row">
      <div class="img-container" @click="goHome()">
        <img src="~/assets/logo.png" alt="logo" />
      </div>
      <search-component v-if="!isMobile" />
      <div class="link-container">
        <!-- <nuxt-link to="/anmelden"
          ><img src="/user.svg" height="33px"
        /></nuxt-link> -->
        <nuxt-link to="/shop"><span>Unsere Produkte</span></nuxt-link>
        <div class="categories" v-if="isMobile">
        <h3 class="fixedTitle">Kategorien</h3>
        <nuxt-link class="category" :to="'/produkt-kategorien/' + link.name" v-for="(link, index) in categories" :key="index">{{ link.name }}</nuxt-link>
        </div>
        <nuxt-link v-if="!isMobile" class="warenkorb" to="/warenkorb"
          ><img src="/cart.svg" height="30px" />
          <div class="cart-items">{{ cartItems.length }}</div>
        </nuxt-link>
      </div>
      <div v-if="isMobile" style="display: flex; flex-direction: row; align-items: center">
        <nuxt-link
          style="margin-right: 20px"
          v-if="isMobile"
          class="warenkorb"
          to="/warenkorb"
          ><img src="/cart.svg" height="25px" />
          <div class="cart-items">{{ cartItems.length }}</div>
        </nuxt-link>
        <div class="mobile-cross" @click="toggleMobileNav">
          <div class="line"></div>
          <div class="line"></div>
          <div class="line"></div>
        </div>
      </div>
    </div>
    <div class="searchbar-container" v-if="isMobile">
      <input
        type="search"
        class="searchbar"
        v-model="productSearch"
        placeholder="Suche"
        @keyup.enter="searchProduct"
      />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMobile: false,
      productSearch: "",
      categories: [],
    };
  },
  watch: {
    $route() {
      const nav = document.querySelector(".link-container");
      const burger = document.querySelector(".mobile-cross");
      if (nav.classList.contains("active")) {
        this.toggleMobileNav();
      }
    },
  },
  async beforeMount() {
    const categories = await this.$axios.get("/categories");
    this.categories = categories.data.data;
    this.categories = this.categories.filter((category) => {
      return category.name !== "Unkategorisiert";
    });
    this.categories = this.categories.filter((category) => {
      return category.name !== "name";
    });
  },
  methods: {
    checkMobile() {
      if (window.innerWidth < 768) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    },
    searchProduct() {
      this.$router.push({
        path: "/shop",
        query: { search: this.productSearch },
      });
    },
    toggleMobileNav() {
      const nav = document.querySelector(".link-container");
      const burger = document.querySelector(".mobile-cross");
      nav.classList.toggle("active");
      burger.classList.toggle("active");
    },
    goHome() {
      this.$router.push("/");
    },
  },
  mounted() {
    this.checkMobile();
    window.addEventListener("resize", this.checkMobile);
  },
  computed: {
    cartItems() {
      return this.$store.state.cartItems;
    },
  },
};
</script>

<style>
</style>