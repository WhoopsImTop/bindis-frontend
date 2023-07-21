<template>
  <div class="content-container text-container">
    <h1 style="margin-bottom: 20px">Vielen Dank für Ihre Bestellung</h1>
    <p>
      Wir haben ihre Bestellung erhalten, Sie werden in kürze eine Email mit den
      Bestelldetails erhalten. <br />
      Unsere Mitarbeiter werden ihre Bestellung schnellstmöglich bearbeiten.
    </p>

    <h3 style="margin-top: 50px; margin-bottom: 20px">Ihre Bestelldetails:</h3>
    <table>
      <thead>
        <th>Bild</th>
        <th>Produkt</th>
        <th>Preis</th>
        <th>Anzahl</th>
      </thead>
      <tbody>
        <tr v-for="product in cartItems" :key="product.id">
          <td>
            <img
              width="100px"
              :src="
                'https://api.bindis-schaulaedle.de/public/images/products/' +
                product.images[0].src
              "
              :alt="product.name"
            />
          </td>
          <td class="product-title">{{ product.name }}</td>
          <td class="product-price">{{ product.regular_price }} €</td>
          <td>{{ product.quantity }} mal</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      cartItems: [],
    };
  },

  methods: {
    approveOrder() {
      let order_id = this.$route.query.order_id;
      let order_number = this.$route.query.order_number;
      let token = this.$route.query.token;
      let payerId = this.$route.query.PayerID ?? null;
      let payment_id = this.$route.query.paymentId ?? null;

      this.$axios
        .post("/payment/success", {
          order_id: order_id,
          order_number: order_number,
          token: token,
          payer_id: payerId,
          payment_id: payment_id,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.cartItems = JSON.parse(localStorage.getItem("cartItems"));
    //remove cartItems from localstorage
    localStorage.removeItem("cartItems");
    this.approveOrder();
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
  
  <style scoped>
a {
  color: var(--primary-color);
  text-decoration: underline;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f8f8f8;
  border-radius: 5px;
}

tr:not(:last-child) {
  border-bottom: 1px solid #f8f8f8;
}

th,
td {
  padding: 15px;
  text-align: left;
}

.product-title {
  font-weight: bold;
}

.product-price {
  font-weight: bold;
  color: var(--primary-color);
  font-size: 18px;
}
</style>