<template>
  <div>
    <div class="content-container">
      <a class="back-to-shop" @click="goBack()"
        ><img src="/store.svg" width="25px" alt="zurück zum Shop" />zurück zum
        Shop</a
      >
      <div class="product-page-grid" v-if="product">
        <div>
          <div class="product-image-container">
            <img :src="productImage" :alt="product.name" />
          </div>
          <div class="selectableImages">
            <div
              class="selectableImage"
              v-show="product.images.length > 1"
              v-for="(image, index) in product.images"
              :key="index"
              @click="
                productImage =
                  'https://api.bindis-schaulaedle.de/public/images/products/' +
                  image.src
              "
            >
              <img
                :src="
                  'https://api.bindis-schaulaedle.de/public/images/products/' +
                  image.src
                "
                :alt="image.name"
              />
            </div>
          </div>
        </div>
        <div class="product-text-container">
          <div class="product-category" v-html="productCategories"></div>
          <h1>{{ product.name }}</h1>
          <div class="stockInformation">
            <div style="margin: 0" class="inStock" v-if="inStock">
              <img src="/inStock.svg" width="20px" alt="auf Lager" />
              <p>Auf Lager</p>
            </div>
            <div style="margin: 0" class="inStock" v-if="!inStock">
              <img src="/outOfStock.svg" width="20px" alt="ausverkauft" />
              <p>Ausverkauft</p>
            </div>
            <div class="deliveryNotice">
              <img
                src="/delivery.svg"
                alt="Lieferzeit: 3-5 Werktage"
                width="20px"
              />
              <p class="delivery-time">Lieferzeit: 3-5 Werktage</p>
            </div>
          </div>

          <div class="priceInformation">
            <p
              class="regular_price product-price"
              :style="onSale ? 'text-decoration: line-through' : ''"
            >
              {{ formatNumber(product.regular_price) }} €<span
                class="mwst-notice"
                v-if="!onSale"
                >inkl. MwSt</span
              >
            </p>
            <p class="sale_price product-price" v-if="onSale">
              {{ formatNumber(product.sale_price) }} €<span
                class="mwst-notice"
                v-if="onSale"
                >inkl. MwSt</span
              >
            </p>
            <p class="mwst-notice" style="margin: 5px 0 0 0">
              zzgl. Versandkosten
            </p>
          </div>
          <div class="addToCart">
            <div class="quantity">
              <input
                type="number"
                min="1"
                v-model="cartQuantity"
                :max="product.quantity"
              />
            </div>
            <button
              class="button"
              :disabled="!inStock"
              @click="addToCart(product)"
            >
              {{
                buttonLoading
                  ? "wird hinzugefügt..."
                  : "Zum Warenkorb hinzufügen"
              }}
            </button>
          </div>
          <p class="stockLimitNotice" v-if="cartQuantity == product.quantity">
            Nurnoch {{ product.quantity }} Stück auf Lager
          </p>
        </div>
      </div>
    </div>
    <div class="content-container text-container">
      <h2 style="margin-bottom: 20px">Beschreibung</h2>
      <p class="product-description" v-html="product.description"></p>
    </div>
    <ProductSlider
      v-if="relatedProducts.length > 0"
      :products="relatedProducts"
      :component="{ title: 'Ähnliche Produkte' }"
    ></ProductSlider>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      buttonLoading: false,
      cartQuantity: 1,
      failedToIncrease: false,
      relatedProducts: [],
    };
  },

  head() {
    if (this.product == null) return;
    return {
      title: this.product.name + " - Bindi's Schaulädle",
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.product.description,
        },
      ],
    };
  },

  async asyncData({ $axios, params, redirect }) {
    const response = await $axios.get("/products/" + params.slug);
    //if response.data.data is empty, the product was not found
    if (response.data.data.length == 0) {
      redirect("/404");
    }
    const productImage =
      response.data.data[0].images.length > 0
        ? "https://api.bindis-schaulaedle.de/public/images/products/" +
          response.data.data[0].images[0].src
        : "/produktbild_fehlt.png";
    return {
      product: response.data.data[0],
      productImage: productImage,
    };
  },
  computed: {
    onSale() {
      return new Date(this.product.sale_price_dates_to) > new Date();
    },
    inStock() {
      return this.product.quantity > 0;
    },
    productCategories() {
      let categories = "";
      this.product.categories.forEach((category) => {
        categories += `<a href="${"/produkt-kategorien/" + category.name}">${
          category.name
        }</a> | `;
      });
      return categories;
    },
  },
  methods: {
    addToCart(product) {
      this.buttonLoading = true;
      let productCopy = JSON.parse(JSON.stringify(product));
      productCopy.quantity = this.cartQuantity;
      this.$store.commit("setCartItems", productCopy);
      setTimeout(() => {
        this.buttonLoading = false;
        this.$router.push("/warenkorb");
      }, 1000);
    },
    goBack() {
      this.$router.go(-1);
    },
    formatNumber(number) {
      let formatting_options = {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      };
      let dollarString = new Intl.NumberFormat("de-DE", formatting_options);
      return dollarString.format(number).slice(0, -1);
    },
    fetchRelatedCategoryProducts() {
      this.$axios
        .get("/products/category/" + this.product.categories[0].name)
        .then((response) => {
          this.relatedProducts = response.data.data;
          console.log(this.relatedProducts);
        });
    },
  },
  beforeMount() {
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
    this.fetchRelatedCategoryProducts();
  },
};
</script>

<style>
.product-page-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  margin-top: 2rem;
}

.product-image-container {
  height: 100%;
  max-height: 400px;
  width: 100%;
  background-color: var(--primary-light-gray);
}

.product-image-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.selectableImages {
  display: flex;
  width: 100%;
  margin-top: 10px;
}

.selectableImage {
  width: 100px;
  height: 100px;
  margin-right: 5px;
  background-color: var(--primary-light-gray);
  border: 1px solid var(--primary-light-gray);
}

.selectableImage img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-price {
  font-size: 30px;
  font-weight: 700;
  margin: 0;
}

.stockInformation {
  margin: 15px 0 40px;
}

.product-category {
  margin-bottom: 1rem;
  color: #888888;
}

.product-category a {
  color: #888888;
  text-decoration: none;
}

.description-container {
  margin-bottom: 100px;
}

.back-to-shop {
  display: inline-flex;
  align-items: center;
  margin-bottom: 20px;
  color: var(--dark-text);
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  background-color: var(--primary-light-gray);
  margin-top: 50px;
}

.back-to-shop:hover {
  cursor: pointer;
}

.back-to-shop img {
  margin-right: 10px;
}

.addToCart {
  display: flex;
  align-items: baseline;
  margin-top: 20px;
}

.stockLimitNotice {
  color: var(--danger-color);
  font-size: 18px;
  margin: 0;
}

.deliveryNotice {
  display: flex;
  align-items: center;
}

.delivery-time {
  margin: 0 0 0 5px;
  font-size: 18px;
}

.addToCart input {
  width: 50px;
  border: 1px solid var(--primary-light-gray);
  border-right: none;
  border-radius: 5px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  padding: 10px 5px;
  margin-right: 10px;
}

.addToCart input:disabled {
  background-color: var(--primary-light-gray);
}

.titleLoader {
  height: 2rem;
  width: 70%;
  background-color: var(--primary-light-gray);
  margin-bottom: 1rem;
}

.priceLoader {
  height: 1rem;
  width: 20%;
  background-color: var(--primary-light-gray);
  margin-bottom: 4rem;
}

.buttonLoader {
  height: 2rem;
  width: 40%;
  background-color: var(--primary-light-gray);
  margin-bottom: 1rem;
}

.descriptionLoader {
  height: 1rem;
  width: 100%;
  background-color: var(--primary-light-gray);
  margin-bottom: 1rem;
}

@media (max-width: 1200px) {
  .product-page-grid {
    display: flex;
    flex-direction: column;
  }

  .product-image-container {
    max-height: 300px;
    background: none;
  }

  .product-image-container img {
    max-height: 200px;
    object-fit: contain;
  }

  .back-to-shop {
    display: none;
  }
}
</style>