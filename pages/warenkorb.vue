<template>
  <div>
    <div class="content-container text-container">
      <h1>Warenkorb</h1>
      <div class="checkout-container">
        <div class="cart-container" v-if="cartItems.length > 0">
          <div class="cart-item" v-for="item in cartItems" :key="item.id">
            <div class="cart-item-information row">
              <div class="cart-item-image">
                <img
                  :src="
                    'https://api.bindis-schaulaedle.de/public/images/products/' +
                    item.images[0].src
                  "
                  style="margin-right: 10px"
                />
              </div>
              <div class="cart-item-text">
                <h4>{{ item.name }}</h4>
                <p class="regular_price">{{ formatNumber(item.regular_price) }} €</p>
              </div>
            </div>
            <div class="cart-item-actions row">
              <input
                class="quantity"
                type="number"
                v-model="item.quantity"
                :max="item.maxQuantity"
                @change="updateCart(item)"
              />
              <div class="cart-item-remove">
                <button class="removeBtn" @click="removeFromCart(item)">
                  Entfernen
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="cart-container-error-messages" v-if="cartErrorMessages">
          <div
            class="cart-item-error-message"
            v-for="(message, index) in cartErrorMessages"
            :key="index"
          >
            <p>{{ message }}</p>
          </div>
        </div>

        <div class="cart-container" style="padding: 50px 0" v-else>
          <h3>Dein Warenkorb ist gegenwärtig leer</h3>
          <p>Stöbere einfach nach Produkten.</p>
          <a class="button" href="/shop">zum Shop</a>
        </div>
        <div class="cart-total" v-if="cartItems.length > 0">
          <h4>Gesamtpreis: {{ formatNumber(cartInformations.total_price) }} €</h4>
          <p><span class="mwst-notice" style="margin: 0">inkl. MwSt</span></p>
          <p>
            <span class="mwst-notice" style="margin: 0"
              >zzgl. Versandkosten</span
            >
          </p>
        </div>
        <div class="cart-buttons">
          <nuxt-link to="/checkout">
            <button class="button" :disabled="cartItems.length == 0">
              zur Kasse ({{ cartItems.length }} Artikel)
            </button>
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      cartItems: [],
      cartErrorMessages: [],
      cartInformations: {
        total_price: 0,
        products: [],
        total_tax: 0,
      },
    };
  },
  computed: {
    totalPrice() {
      let total = 0;
      this.cartItems.forEach((item) => {
        total += item.regular_price * item.quantity;
      });
      return total.toFixed(2);
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
    removeFromCart(item) {
      this.cartItems = this.cartItems.filter((i) => i.id !== item.id);
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      this.generateCart();
    },
    updateCart(item) {
      this.cartItems = this.cartItems.map((i) => {
        if (i.id === item.id) {
          return item;
        }
        return i;
      });
      localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
      this.generateCart();
    },
    generateCart() {
      this.$axios
        .post("/cart", {
          line_items: this.cartItems.map((item) => {
            return {
              product_id: item.id,
              quantity: item.quantity,
            };
          }),
        })
        .then((res) => {
          this.cartInformations = res.data;
          this.cartItems = res.data.products;
          this.cartErrorMessages = res.data.error_messages;
          localStorage.setItem("cartItems", JSON.stringify(this.cartItems));
        })
        .catch((err) => console.log(err));
    },
  },
  beforeMount() {
    this.cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    //check products on server if the quantity is still available
    this.cartItems.forEach((item) => {
      this.$axios
        .get(`products/${item.slug}`)
        .then((res) => {
          if (res.data.quantity < item.quantity) {
            item.quantity = res.data.data[0].quantity;
            this.updateCart(item);
          }
          item.maxQuantity = res.data.data[0].quantity;
        })
        .catch((err) => console.log(err));
    });
    if (localStorage.getItem("cartItems")) {
      try {
        //load cartItems from localstorage in vuex
        this.$store.commit(
          "loadCardItems",
          JSON.parse(localStorage.getItem("cartItems") || "[]")
        );
      } catch (e) {
        localStorage.removeItem("cartItems");
      }
    }
  },
  mounted() {
    this.generateCart();
  },
};
</script>

<style scoped>
.cart-total {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid var(--primary-light-gray);
  border-radius: 5px;
  width: max-content;
}

.cart-container {
  margin-top: 20px;
  border-radius: 5px;
  border: 1px solid var(--primary-light-gray);
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.cart-item:not(:last-child) {
  border-bottom: 1px solid var(--primary-light-gray);
}

.quantity {
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

.removeBtn {
  background-color: var(--danger-color);
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  color: var(--white);
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.cart-item-error-message {
  padding: 10px 15px;
  border-radius: 5px;
  background-color: var(--danger-color);
  margin: 10px 0;
}

.cart-item-error-message p {
  color: var(--white);
}

@media (max-width: 1200px) {
  .cart-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .cart-item-information {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
  }

  .cart-item-actions {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    padding-top: 15px;
    margin-top: 15px;
    border-top: 1px solid #efefef;
  }

  .quantity {
    padding: 5px;
  }

  .removeBtn {
    padding: 7px 12px;
  }

  .checkout-container {
    display: flex;
    flex-direction: column-reverse;
  }

  .cart-total {
    width: 100%;
  }

  .cart-buttons .button {
    width: 100%;
  }
}
</style>