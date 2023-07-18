<template>
  <nuxt-link :to="'/produkte/' + product.slug" class="productCard">
    <div class="salesBadge" v-if="onSale">Reduziert!</div>
    <div class="productImage" v-if="product.images[0]">
      <img :src="'https://api.bindis-schaulaedle.de/public/images/products/' + product.images[0].src" />
    </div>
    <div class="productImage" v-if="!product.images[0]">
      <img src="/produktbild_fehlt.png" />
    </div>
    <div class="productInfo">
      <h3 style="font-size: 20px; margin-bottom: 10px">{{ product.name }}</h3>
      <div class="inStock" v-if="inStock"><img src="/inStock.svg" width="20px" alt="auf Lager"><p>Auf Lager</p></div>
      <div class="inStock" v-if="!inStock"><img src="/outOfStock.svg" width="20px" alt="ausverkauft"><p>Ausverkauft</p></div>
      <p class="regular_price" :style="onSale ? 'text-decoration: line-through' : ''">{{ product.regular_price }} €<span class="mwst-notice" v-if="!onSale">inkl. MwSt</span></p>
      <p class="sale_price" v-if="onSale">{{ product.sale_price }} €<span class="mwst-notice" v-if="onSale">inkl. MwSt</span></p>
      <span class="mwst-notice" style="margin: 5px 0 0 0">zzgl. Versandkosten</span>
    </div>
    <!-- <div class="productActions">
      <button class="button addToCart" @click="addToCart(product.id)" :disabled="!inStock">In den Warenkorb</button>
    </div> -->
  </nuxt-link>
</template>

<script>
export default {
  props: ["product"],
  computed: {
    onSale() {
      return new Date(this.product.sale_price_dates_to) > new Date();
    },
    inStock() {
      return this.product.quantity > 0;
    },
  },
  methods: {
    addToCart(id) {
      this.$store.dispatch("setCartItems", id);
    },
  },
};
</script>

<style>
</style>