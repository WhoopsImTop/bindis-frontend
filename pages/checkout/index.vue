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
            <input
              type="text"
              placeholder="Vorname"
              class="required"
              name="name"
              v-model="name"
            />
            <input
              type="text"
              placeholder="Nachname"
              class="required"
              name="nachname"
              v-model="last_name"
            />
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
            <input
              type="text"
              name="street"
              class="required"
              placeholder="Straße und Hausnummer"
              v-model="address"
            />
            <input
              type="text"
              placeholder="Stadt"
              name="city"
              v-model="city"
              class="required"
            />
            <input
              type="text"
              placeholder="PLZ"
              name="zip"
              v-model="zip"
              class="required"
            />
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
              cols="30"
              rows="10"
              v-model="notes"
            ></textarea>
          </form>
        </div>
      </div>
      <div class="checkout-information">
        <div class="information-container">
          <div class="checkout-options">
            <div class="payment-methods">
              <h2>Zahlungsart auswählen</h2>
              <!-- <div id="paypal-button-container"></div>
              <div class="payment-method">
                <input
                  type="radio"
                  id="paypal"
                  class="required"
                  name="payment"
                  value="paypal"
                  v-model="paymentMethod"
                />
                <label for="paypal">PayPal</label>
              </div> -->
              <div class="payment-method">
                <input
                  type="radio"
                  id="ueberweisung"
                  name="payment"
                  class="required"
                  value="ueberweisung"
                  v-model="paymentMethod"
                />
                <label for="ueberweisung">Direkte Banküberweisung</label>
                <p>
                  Überweisen Sie direkt an unsere Bankverbindung. Bitte nutzen
                  Sie die Bestellnummer als Verwendungszweck. Ihre Bestellung
                  wird erst nach Geldeingang auf unserem Konto versandt.
                </p>
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
            </div>

            <!-- display products in cart -->
            <h4
              class="checkout-products-headline"
              style="margin-top: 50px; margin-bottom: 20px"
            >
              Produkte im Warenkorb
            </h4>
            <div class="checkout-products">
              <div
                class="checkout-product"
                v-for="item in cartItems"
                :key="item.id"
              >
                <div
                  class="checkout-product-image"
                  v-if="item.images.length > 0"
                >
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
                    {{ item.quantity }} x {{ item.regular_price }} €
                  </p>
                </div>
              </div>
              <div class="zwischensumme">
                <p>Zwischensumme</p>
                <p>{{ cartTotalWithoutShipping.toFixed(2) }} €</p>
              </div>
              <div class="zwischensumme">
                <p>Versandkostenpauschale</p>
                <p>{{ shippingCosts }} €</p>
              </div>
              <div class="zwischensumme">
                <p>Gesamtsumme</p>
                <p class="highlight">{{ cartTotal.toFixed(2) }} €</p>
              </div>
              <div class="mwst">
                <p>inkl. 19% MwSt.</p>
                <p>{{ cartTax }} €</p>
              </div>
            </div>

            <div class="checkout-button">
              <button class="button" @click="generateCheckout()">
                {{ loading ? "verarbeiten..." : "Kostenpflichtig Bestellen" }}
              </button>
              <p v-if="checkout.errorMessage != ''" class="checkout-error-message">{{ checkout.errorMessage }}</p>
            </div>
          </div>
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
      city: "",
      zip: "",
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
      notes: "",
      datenschutz: false,
      defaultCountries: [
        { name: "Deutschland", code: "DE" },
        { name: "Österreich", code: "AT" },
        { name: "Schweiz", code: "CH" },
      ],
      cartItems: [],
      totalPrice: 0,
      paymentMethod: null,
      loading: false,
      shippingCosts: 4.79,
      checkout: {
        errorMessage: "",
      },
    };
  },
  methods: {
    validateCheckout() {
      let requiredFields = document.querySelectorAll(".required");
      let valid = false;
      requiredFields.forEach((field) => {
        if (field.value == "") {
          field.classList.add("invalid");
          valid = false;
        } else {
          field.classList.remove("invalid");
        }
      });
      if (this.datenschutz || this.paymentMethod != null) {
        valid = true;
      }
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
            address: this.address,
            city: this.city,
            state: this.state,
            zip: this.zip,
            country: this.country,
          },
          shipping: this.deliveryadressBool
            ? this.deliveryAdress
            : {
                address: this.address,
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
          payment_method: this.paymentMethod,
          payment_method_title: this.paymentMethod,
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
            if (this.paymentMethod === "paypal") {
              axios
                .post(
                  "https://api.bindis-schaulaedle.de/public/api/payment",
                  response.data
                )
                .then((res) => {
                  window.location.href = res.data.redirect;
                })
                .catch((error) => {
                  this.loading = false;
                  console.log(error);
                  window.alert(
                    "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut"
                  );
                });
            } else {
              //redirect to checkout/success add order id and order number to url params
              this.$router.push({
                name: "checkout-success",
                query: {
                  order_id: response.data.id,
                  order_number: response.data.order_number,
                },
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

  /* created() {
    var order;

    const FUNDING_SOURCES = [
      // EDIT FUNDING SOURCES
      paypal.FUNDING.PAYPAL,
      paypal.FUNDING.PAYLATER,
      paypal.FUNDING.CARD,
    ];
    FUNDING_SOURCES.forEach((fundingSource) => {
      paypal
        .Buttons({
          fundingSource,

          style: {
            layout: "vertical",
            shape: "rect",
            color: fundingSource == paypal.FUNDING.PAYLATER ? "gold" : "",
          },

          createOrder: async (data, actions) => {
            let body = JSON.stringify({
              first_name: this.name,
              last_name: this.last_name,
              email: this.email,
              phone: this.phone,
              billing: {
                address: this.address,
                city: this.city,
                state: this.state,
                zip: this.zip,
                country: this.country,
              },
              shipping: this.deliveryadressBool
                ? this.deliveryAdress
                : {
                    address: this.address,
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
              payment_method: this.paymentMethod,
              payment_method_title: this.paymentMethod,
            });

            let config = {
              method: "post",
              maxBodyLength: Infinity,
              url: "https://api.bindis-schaulaedle.de/public/api/orders",
              headers: {
                "Content-Type": "application/json",
              },
              data: body,
            };

            order = await axios.request(config);

            try {
              const response = await fetch(
                "https://api.bindis-schaulaedle.de/public/api/payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    total: order.data.total,
                  }),
                }
              );

              const details = await response.json();
              return details.response.id;
            } catch (error) {
              console.error("FIST_STP: " + error);
              // Handle the error or display an appropriate error message to the user
            }
          },

          onApprove: async (data, actions) => {
            try {
              const response = await fetch(
                `https://api.bindis-schaulaedle.de/public/api/payment/capture`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: order.data.id,
                  }),
                }
              );

              const details = await response.json();
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show confirmation or thank you message

              // This example reads a v2/checkout/orders capture response, propagated from the server
              // You could use a different API or structure for your 'orderData'
              const errorDetail =
                Array.isArray(details.details) && details.details[0];

              if (errorDetail && errorDetail.issue === "INSTRUMENT_DECLINED") {
                return actions.restart();
                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
              }

              if (errorDetail) {
                let msg = "Sorry, your transaction could not be processed.";
                msg += errorDetail.description
                  ? " " + errorDetail.description
                  : "";
                msg += details.debug_id ? " (" + details.debug_id + ")" : "";
                alert(msg);
              }

              // Successful capture! For demo purposes:
              console.log(
                "Capture result",
                details,
                JSON.stringify(details, null, 2)
              );
              const transaction =
                details.purchase_units[0].payments.captures[0];
              alert(
                "Transaction " +
                  transaction.status +
                  ": " +
                  transaction.id +
                  "See console for all available details"
              );
            } catch (error) {
              console.error("SECOND STEP:" + error);
              // Handle the error or display an appropriate error message to the user
            }
          },
        })
        .render("#paypal-button-container");
    });
  }, */

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