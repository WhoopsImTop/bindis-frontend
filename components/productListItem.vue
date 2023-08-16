<template>
  <div>
    <nuxt-link :to="'/produkte/' + product.slug" class="ProductListItem">
      <div class="salesBadge" v-if="onSale">Reduziert!</div>
      <div class="productListImage" v-if="product.images[0]">
        <img
          loading="lazy"
          :src="
            'https://api.bindis-schaulaedle.de/public/images/products/' +
            product.images[0].src
          "
        />
      </div>
      <div class="productListImage" v-else>
        <img loading="lazy" src="/produktbild_fehlt.png" />
      </div>
      <div class="productInfo">
        <h3 style="font-size: 20px; margin-bottom: 10px">{{ product.name }}</h3>
        <div class="inStock" v-if="inStock">
          <img src="/inStock.svg" width="20px" alt="auf Lager" />
          <p>Auf Lager</p>
        </div>
        <div class="inStock" v-if="!inStock">
          <img src="/outOfStock.svg" width="20px" alt="ausverkauft" />
          <p>Ausverkauft</p>
        </div>
        <p
          class="regular_price"
          :style="onSale ? 'text-decoration: line-through' : ''"
        >
          {{ formatNumber(product.regular_price) }} €<span class="mwst-notice" v-if="!onSale"
            >inkl. MwSt</span
          >
        </p>
        <p class="sale_price" v-if="onSale">
          {{ formatNumber(product.sale_price) }} €<span class="mwst-notice" v-if="onSale"
            >inkl. MwSt</span
          >
        </p>
        <span class="mwst-notice" style="margin: 5px 0 0 0"
          >zzgl. Versandkosten</span
        >
      </div>
    </nuxt-link>
  </div>
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
    formatNumber(number) {
      let formatting_options = {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      };
      let dollarString = new Intl.NumberFormat("de-DE", formatting_options);
      return dollarString.format(number).slice(0, -1);
    },
  },
};
</script>

<style>
</style>