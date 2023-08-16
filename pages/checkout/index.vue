<template>
  <div class="content-container text-container">
    <h1>Kasse</h1>
    <div class="checkout-page-grid">
      <div class="checkout-form">
        <div>
          <h4>Rechnungsdetails</h4>
          <form autocomplete="on">
            <select v-model="gender">
              <option value="" disabled selected>Keine</option>
              <option value="Herr">Herr</option>
              <option value="Frau">Frau</option>
              <option value="Divers">Divers</option>
            </select>
            <div class="row">
              <div class="col-50">
                <input
                  type="text"
                  placeholder="Vorname"
                  class="required"
                  name="name"
                  v-model="name"
                />
              </div>
              <div class="col-50">
                <input
                  type="text"
                  placeholder="Nachname"
                  class="required"
                  name="nachname"
                  v-model="last_name"
                />
              </div>
            </div>
            <input
              type="email"
              placeholder="Email"
              class="required validate-email"
              name="email"
              v-model="email"
            />
            <input
              type="tel"
              placeholder="Telefon"
              class="required validate-phone"
              name="phone"
              v-model="phone"
            />
            <div class="row">
              <div class="col-50">
                <input
                  type="text"
                  name="street"
                  class="required"
                  placeholder="Straße"
                  v-model="address"
                />
              </div>
              <div class="col-50">
                <input
                  type="text"
                  name="house_number"
                  class="required"
                  placeholder="Hausnummer"
                  v-model="house_number"
                />
              </div>
            </div>
            <div class="row">
              <div class="col-50">
                <input
                  type="text"
                  placeholder="Stadt"
                  name="city"
                  v-model="city"
                  class="required"
                />
              </div>
              <div class="col-50">
                <input
                  type="text"
                  placeholder="PLZ"
                  name="zip"
                  v-model="zip"
                  class="required"
                />
              </div>
            </div>
            <label class="checkbox-label"
              ><input type="checkbox" v-model="deliveryadressBool" />Lieferung
              an eine andere Adresse senden?</label
            >
            <div class="form" v-if="deliveryadressBool">
              <h4>Lieferadresse</h4>
              <input
                type="text"
                placeholder="Vorname"
                name="name"
                v-model="deliveryAdress.name"
              />
              <input
                type="text"
                placeholder="Nachname"
                name="nachname"
                v-model="deliveryAdress.last_name"
              />
              <input
                type="text"
                name="street"
                placeholder="Straße und Hausnummer"
                v-model="deliveryAdress.address"
              />
              <input
                type="text"
                placeholder="Stadt"
                name="city"
                v-model="deliveryAdress.city"
              />
              <input
                type="text"
                placeholder="PLZ"
                name="zip"
                v-model="deliveryAdress.zip"
              />
            </div>
            <h4>Anmerkungen zur Bestellung (optional)</h4>
            <textarea
              name="notes"
              id="notes"
              cols="10"
              rows="2"
              placeholder="Bitte als Geschenk verpacken, etc."
              v-model="order_note"
            ></textarea>
          </form>
        </div>
      </div>
      <div class="checkout-information">
        <!-- display products in cart -->
        <h4 class="checkout-products-headline" style="margin-bottom: 20px">
          Produkte im Warenkorb
        </h4>
        <div class="checkout-products">
          <div
            class="checkout-product"
            v-for="item in cartItems"
            :key="item.id"
          >
            <div class="checkout-product-image" v-if="item.images.length > 0">
              <img
                width="50"
                height="50"
                :src="
                  'https://api.bindis-schaulaedle.de/public/images/products/' +
                    item.images[0].src ?? ''
                "
              />
            </div>
            <div class="checkout-product-information">
              <h4>{{ item.name }}</h4>
              <p style="min-width: 120px; text-align: right">
                {{ item.quantity }} x {{ formatNumber(item.regular_price) }} €
              </p>
            </div>
          </div>
          <div class="zwischensumme">
            <p>Zwischensumme</p>
            <p>{{ formatNumber(cartTotalWithoutShipping) }} €</p>
          </div>
          <div
            class="zwischensumme"
            style="flex-direction: column; align-items: unset"
          >
            <div style="display: flex; justify-content: space-between">
              <p>Versandkostenpauschale</p>
              <p>{{ formatNumber(shippingCosts) }} €</p>
            </div>
            <div class="row">
              <div
                class="col-50"
                style="
                  display: flex;
                  align-items: center;
                  border: 1px solid #dddddd;
                  border-radius: 5px;
                  margin: 5px;
                  padding: 10px 15px;
                "
                for="abholung"
              >
                <input
                  style="width: auto"
                  type="radio"
                  name="abholung"
                  value="abholung"
                  id="abholung"
                  v-model="shipping"
                />
                <label for="abholung">Abholung</label>
              </div>
              <div
                class="col-50"
                style="
                  display: flex;
                  align-items: center;
                  border: 1px solid #dddddd;
                  border-radius: 5px;
                  margin: 5px;
                  padding: 10px 15px;
                "
                for="standard"
              >
                <input
                  style="width: auto"
                  type="radio"
                  name="standard"
                  id="standard"
                  value="standard"
                  v-model="shipping"
                />
                <label for="standard">Standard (4,79€)</label>
              </div>
            </div>
          </div>
          <div class="zwischensumme">
            <p>Gesamtsumme</p>
            <p class="highlight">{{ formatNumber(cartTotal) }} €</p>
          </div>
          <div class="mwst">
            <p>inkl. 19% MwSt.</p>
            <p>{{ formatNumber(cartTax) }} €</p>
          </div>
        </div>

        <h3 style="margin-bottom: 10px">Deine Bestellung</h3>
        <label
          ><input
            type="checkbox"
            v-model="datenschutz"
            class="required"
            style="margin-right: 10px"
          />
          Mit Ihrer Bestellung erklären Sie sich mit unseren Allgemeinen
          Geschäftsbedingungen, Widerrufsbestimmungen und
          Datenschutzbestimmungen einverstanden. *</label
        >
        <div class="checkout-button">
          <button class="button" @click="generateCheckout()">
            {{ loading ? "verarbeiten..." : "Weiter zur Bezahlung" }}
          </button>
          <p v-if="checkout.errorMessage != ''" class="checkout-error-message">
            {{ checkout.errorMessage }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => {
    return {
      gender: "",
      name: "",
      last_name: "",
      email: "",
      phone: "",
      address: "",
      house_number: "",
      city: "",
      zip: "",
      shipping: "standard",
      deliveryadressBool: false,
      deliveryAdress: {
        name: "",
        last_name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zip: "",
      },
      order_note: "",
      datenschutz: false,
      cartItems: [],
      totalPrice: 0,
      loading: false,
      defaultShippingCosts: 4.79,
      checkout: {
        errorMessage: "",
      },
    };
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
    validateCheckout() {
      let requiredFields = document.querySelectorAll(".required");
      let valid = false;
      if (this.datenschutz) {
        valid = true;
      }
      requiredFields.forEach((field) => {
        if (field.value == "") {
          field.classList.add("invalid");
          valid = false;
        } else {
          field.classList.remove("invalid");
        }
      });
      return valid;
    },
    generateCheckout() {
      if (this.validateCheckout()) {
        this.loading = true;

        let headers = {
          "Access-Control-Allow-Headers": "*",
        };

        let data = JSON.stringify({
          first_name: this.name,
          last_name: this.last_name,
          email: this.email,
          phone: this.phone,
          billing: {
            address: this.address + " " + this.house_number,
            city: this.city,
            state: this.state,
            zip: this.zip,
            country: this.country,
          },
          shipping: this.deliveryadressBool
            ? this.deliveryAdress
            : {
                address: this.address + " " + this.house_number,
                city: this.city,
                state: this.state,
                zip: this.zip,
                country: this.country,
              },
          line_items: this.cartItems,
          total: this.totalPrice,
          total_tax: this.cartTax,
          cart_tax: this.cartTax,
          shipping_total: this.shippingCosts,
          payment_method: "nicht angegeben",
          payment_method_title: "nicht angegeben",
          order_note: this.order_note,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://api.bindis-schaulaedle.de/public/api/orders",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            if (response.status == 201) {
              //redirect to checkout/payment page
              this.$router.push({
                name: "checkout-payment",
                params: { order_id: response.data.id },
              });
              this.loading = false;
            }
          })
          .catch((error) => {
            this.checkout.errorMessage = error.response.data.message;
            this.loading = false;
          });
      } else {
        alert("Bitte füllen Sie alle Felder aus");
      }
    },
  },
  computed: {
    shippingCosts() {
      if (this.shipping == "standard") {
        return this.defaultShippingCosts;
      } else {
        return 0;
      }
    },
    cartTotalWithoutShipping() {
      let total = 0;
      this.cartItems.forEach((item) => {
        total += item.quantity * item.regular_price;
      });
      this.totalPrice = total;
      return total;
    },
    cartTotal() {
      let total = 0;
      this.cartItems.forEach((item) => {
        total += item.quantity * item.regular_price;
      });
      total += this.shippingCosts;
      this.totalPrice = total;
      return total;
    },
    cartTax() {
      //calculate the price without tax
      let total = 0;
      this.cartItems.forEach((item) => {
        total += item.quantity * item.regular_price;
      });
      total += this.shippingCosts;
      //calculate the tax
      let tax = (total / 119) * 19;
      return tax.toFixed(2);
    },
  },
  mounted() {
    this.cartItems = JSON.parse(localStorage.getItem("cartItems"));
  },

  beforeCreate() {
    //get localstorage cart
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
.invalid {
  border: 1px solid var(--danger-color) !important;
}

.checkout-error-message {
  background-color: var(--danger-color);
  padding: 10px;
  color: white;
  border-radius: 5px;
  margin-top: 10px;
}
</style>