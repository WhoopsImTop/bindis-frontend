<template>
  <div class="content-container text-container">
    <h1 style="margin-bottom: 20px">Sie haben die Bestellung abgebrochen</h1>
    <p>
      Bei der ausgewählten bezahlmethode ist ein Fehler aufgetreten oder Sie
      haben den Bestellprozess abgebrochen. <br />
      Möchten Sie den Bestellprozess fortsetzen ?
    </p>
    <p>
      Hier ist der Link zu ihrem Warenkorb:
      <nuxt-link to="/warenkorb">Ihr Warenkorb</nuxt-link>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
    };
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

<style scoped>
a {
  color: var(--primary-color);
  text-decoration: underline;
}
</style>