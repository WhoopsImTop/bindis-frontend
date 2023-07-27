<template>
  <div>
    <div v-if="error" class="error-container content-container text-container">
      <h1>Verbindung fehlgeschlagen.</h1>
      <p>Bitte versuchen Sie es später erneut.</p>
    </div>
    <div v-else>
      <component-renderer
        :component="component"
        v-for="(component, index) in page.content"
        :products="products"
        :categories="categories"
        :key="index"
      ></component-renderer>
    </div>
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  layout: "default",
  data() {
    return {
      page: {
        content: [
          {
            type: "landingComponent",
            title: "Spiele, Geschenke und Zubehör für Jedermann!",
            subtitle: "Willkommen im Online-Shop von Bindis Schaulädle",
            image: {
              url: "https://api.bindis-schaulaedle.de/public/images/products/1689794204_sunflex-taucherset-dolphin1.jpg",
            },
            button: {
              text: "Jetzt stöbern",
              link: "/shop",
            },
          },
          {
            type: "OfferComponent",
            title: "Der Sommer in all seiner Vielfalt",
            subtitle: "reisen, campen, spielen, planschen und noch vieles mehr",
            content: [
              {
                title: "Reisespiele, Reisebegleiter für entspannte Urlaubstage",
                subtitle: "Spiele für unterwegs",
                images: [
                  {
                    url: "https://api.bindis-schaulaedle.de/public/images/products/1689788657_49102_Packshot-f3324ff81.jpg",
                  },
                  {
                    url: "https://api.bindis-schaulaedle.de/public/images/products/1689788680_40535_Kniffel_Kids_Wuerfelspiel_Kinderspiel_72ppi_Packshot-9618309c1.jpg",
                  },
                ],
                button: {
                  text: "Jetzt stöbern",
                  link: "Spiele%20Erwachsene",
                },
              },
              {
                title: "Große Auswahl an Tauch und Schwimmutensilien",
                subtitle: "Perfekt für das Schwimmbad oder den Strand",
                images: [
                  {
                    url: "https://api.bindis-schaulaedle.de/public/images/products/1689789995_bema-schwimmfluegel-neopren-1-6j1.jpg",
                  },
                  {
                    url: "https://api.bindis-schaulaedle.de/public/images/products/1689789007_47052_VP_V1.jpg",
                  },
                ],
                button: {
                  text: "Jetzt stöbern",
                  link: "Baden&%20Planschen",
                },
              },
            ],
          },
          {
            type: "CategorieChips",
            title: "Unsere top Kategorien🥇",
          },
          {
            type: "ProductSlider",
            title: "Eine kleine auswahl unserer Produkte",
            sale: false,
          },
        ],
      },
      categories: [
        {
          name: "Baby",
          slug: "Baby",
        },
        {
          name: "Bauen und Konstruieren",
          slug: "Bauen und Konstruieren",
        },
        {
          name: "Puppen",
          slug: "Puppen",
        },
        {
          name: "Camping & Outdoor",
          slug: "Camping & Outdoor",
        },
        {
          name: "Spiele",
          slug: "Spiele",
        },
        {
          name: "Bücher",
          slug: "Bücher",
        },
        {
          name: "Kindermode",
          slug: "Kindermode",
        },
        {
          name: "Geschenke",
          slug: "Geschenke",
        },
        {
          name: "Dekoration",
          slug: "Dekoration",
        },
        {
          name: "Einschulung",
          slug: "Einschulung",
        },
      ],
      error: null,
    };
  },

  async asyncData({ $axios }) {
    try {
      const response = await $axios.get("/products?status=publish");
      if (response.status !== 200) {
        return {
          error: response.statusText,
        };
      }
      return {
        products: response.data.data.filter((product) => {
          return product.regular_price > 0;
        }),
      };
    } catch (e) {
      return {
        error: e.message,
      };
    }
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
