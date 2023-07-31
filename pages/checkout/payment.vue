<template>
  <div class="content-container text-container">
    <h1 style="margin-bottom: 20px">Kasse</h1>
    <div class="checkout-page-grid">
      <div class="checkout-form" v-if="!expressCheckoutError">
        <h2 style="margin-bottom: 20px">Express Checkout</h2>
        <div id="paypal-button-container"></div>
      </div>
      <div class="checkout-form" v-if="expressCheckoutError">
        <h2>Express Checkout</h2>
        <p>
          Leider ist ein Fehler aufgetreten. Bitte wählen Sie eine andere
          Zahlungsart.
        </p>
      </div>
      <div class="information-container">
        <div class="checkout-options">
          <div class="payment-methods">
            <h2>Zahlungsart auswählen</h2>
            <!-- <div
              class="payment-method"
              :class="expressCheckoutError ? 'disabled-payment' : ''"
            >
              <input
                type="radio"
                id="paypal"
                class="required"
                name="payment"
                value="paypal"
                v-model="paymentMethod"
              />
              <label for="paypal">PayPal</label>
              <p>Sie werden auf eine Bezahlseite von PayPal weitergeleitet.</p>
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
                Überweisen Sie direkt an unsere Bankverbindung. Bitte nutzen Sie
                die Bestellnummer als Verwendungszweck. Ihre Bestellung wird
                erst nach Geldeingang auf unserem Konto versandt.
              </p>
            </div>
            <div class="payment-method">
              <input
                type="radio"
                id="cash"
                name="cash"
                class="required"
                value="cash"
                v-model="paymentMethod"
              />
              <label for="cash">Barzahlung Vorort</label>
              <p>
                Sie zahlen den Rechnungsbetrag bei der Abholung bar oder mit
                EC-Karte.
              </p>
            </div>
          </div>
          <div class="checkout-button">
            <button
              class="button"
              :disabled="!paymentMethod"
              @click="createOrder()"
            >
              Bestellung aufgeben
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      paymentMethod: null,
      order: null,
      order_id: null,
      expressCheckoutError: false,
      paypal_order_id: null,
      paypal_payment_link: null,
    };
  },

  methods: {
    async createOrder() {
      try {
        if (this.paymentMethod == "paypal") {
          axios
            .patch(
              `https://api.bindis-schaulaedle.de/public/api/orders/${this.order_id}`,
              {
                payment_method: this.paymentMethod,
                payment_method_title: "PayPal",
              }
            )
            .then((response) => {
              if (response.status == 200 || response.status == 201) {
                window.location.href = this.paypal_payment_link;
              }
            })
            .catch((error) => {
              console.log(error);
              window.alert(
                "Leider ist ein Fehler aufgetreten. Bitte wählen Sie eine andere Zahlungsart."
              );
            });
          //redirect to this.paypal_payment_link
        } else {
          //opdate Order Payment Method and redirect to success page
          const response = await fetch(
            `https://api.bindis-schaulaedle.de/public/api/orders/${this.order_id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                payment_method: this.paymentMethod,
                payment_method_title:
                  this.paymentMethod == "cash"
                    ? "Barzahlung Vorort"
                    : this.paymentMethod == "ueberweisung"
                    ? "Direkte Banküberweisung"
                    : "PayPal",
              }),
            }
          );
          const details = await response.json();
          this.$router.push(
            `/checkout/success?order_id=${this.order_id}&order_number=${this.order.order_number}`
          );
        }
      } catch (error) {
        console.error("FIRST STEP:" + error);
        this.expressCheckoutError = true;
      }
    },
  },

  beforeMount() {
    this.order_id = this.$route.params.order_id;
    axios
      .get(
        `https://api.bindis-schaulaedle.de/public/api/orders/${this.order_id}`
      )
      .then(async (response) => {
        this.order = await response.data.data;
        const paypalPaymentResponse = await fetch(
          "https://api.bindis-schaulaedle.de/public/api/payment",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              total: this.order.total,
              order_number: this.order.order_number,
            }),
          }
        );

        const details = await paypalPaymentResponse.json();
        console.log(details);
        this.paypal_order_id = details.response.id;
        this.paypal_payment_link = details.response.links[1].href;
      })
      .catch((error) => {
        console.log(error);
      });
  },

  mounted() {
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
            try {
              return this.paypal_order_id;
            } catch (error) {
              console.error("FIRST STEP:" + error);
              this.expressCheckoutError = true;
            }
          },

          onApprove: async (data, actions) => {
            try {
              const response = await fetch(
                `https://api.bindis-schaulaedle.de/public/api/payment/capture?order_id=${this.order.id}`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    id: data.orderID,
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

              const PayerID = details.response.payer.payer_id;
              const paymentId =
                details.response.purchase_units[0].payments.captures[0].id;
              const token = details.response.id;
              const order_id = this.order.id;
              const order_number = this.order.order_number;

              this.$router.push(
                "/checkout/success?order_id=" +
                  order_id +
                  "&order_number=" +
                  order_number +
                  "&paymentId=" +
                  paymentId +
                  "&token=" +
                  token +
                  "&PayerID=" +
                  PayerID
              );
            } catch (error) {
              console.error("SECOND STEP:" + error);
              // Handle the error or display an appropriate error message to the user
            }
          },
        })
        .render("#paypal-button-container");
    });
  },
};
</script>

<style>
</style>