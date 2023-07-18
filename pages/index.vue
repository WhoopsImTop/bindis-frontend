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
            title: "Spiele, Geschenke und zubehör für jedermann!",
            subtitle: "Willkommen im Online-Shop von Bindis Schaulädle",
            image: {
              url: "https://api.bindis-schaulaedle.de/public/images/products/1688301776_sunflex-taucherset-dolphin1.jpg",
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
                    url: "https://bindis-schaulaedle.de/wp-content/uploads/2023/06/49203_Packshot-1.cms-50854-300-auto1-194x300.png",
                  },
                  {
                    url: "https://bindis-schaulaedle.de/wp-content/uploads/2023/06/49102_Packshot-f3324ff81-172x300.jpg",
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
                    url: "https://bindis-schaulaedle.de/wp-content/uploads/2023/04/bema-schwimmfluegel-neopren-1-6j1-300x300.jpg",
                  },
                  {
                    url: "https://bindis-schaulaedle.de/wp-content/uploads/2023/05/47042_Tauchset_SHARK1-235x300.jpg",
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
            title: "Kategorien",
          },
          {
            type: "ProductSlider",
            title: "Aktuelle Angebote",
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
      products: [
        {
          name: "Schmidt Spiele Classic Line \u2013 Edition",
          slug: "schmidt-spiele-classic-line-edition",
          images: [
            {
              id: 1,
              src: "http://127.0.0.1:8000/images/products/1685900711_schmidt-spiele-classic-line-edition.png",
              created_at: "2023-06-04T17:45:11.000000Z",
              updated_at: "2023-06-04T17:45:11.000000Z",
            },
            {
              id: 2,
              src: "1685900711_schmidt-spiele-classic-line-edition.png",
              created_at: "2023-06-04T17:45:11.000000Z",
              updated_at: "2023-06-04T17:45:11.000000Z",
            },
          ],
          description:
            "<p>Wer kennt es nicht, das original MENSCH \u00c4RGERE DICH NICHT\u00ae oder das weltbekannte KNIFFEL\u00ae und MYRUMMY\u00ae? Unsere erfolgreichsten Klassiker spielen nun zusammen mit weiteren prominenten Spielen wie BACKGAMMON, DAME und M\u00dcHLE in dieser hochwertigen Spielesammlung mit. \u00dcber 100 raffinierte Spielm\u00f6glichkeiten und gut verst\u00e4ndliche Regeln sorgen f\u00fcr jede Menge anspruchsvoller Unterhaltung. Wie aus den Spielen unserer CLASSIC LINE gewohnt, sorgt das extra gro\u00dfe und hochwertige Spielmaterial f\u00fcr besonders viel Spielfreude! Egal ob jung oder alt: es wird immer wieder eine neue Partie gefordert!</p>",
          regular_price: "49.99",
          categories: [
            "Familienspiel",
            "ab 6 Jahren",
            "Schmidt Spiele",
            "Spiel ab 6 Jahren",
          ],
          tags: [
            "Spieleklassiker",
            "Dame",
            "M\u00fchle",
            "Kinder",
            "Brettspielklassiker",
            "Klassiker",
            "Backgammon",
            "Spielesammlung",
            "Kniffel",
            "Mensch \u00e4rgere dich nicht",
            "Erwachsene",
            "Jugendliche",
          ],
          featured: 0,
          quantity: 0,
          sku: "59196",
          ean: "4001504491963",
          sale_price: "20.00",
          sale_price_dates_from: null,
          sale_price_dates_to: "2023-07-07T17:45:11.000000Z",
          tax_percentage: "19.00",
          status: "publish",
          total_sells: 0,
          created_at: "2023-06-04T17:45:11.000000Z",
          updated_at: "2023-06-04T17:45:11.000000Z",
        },
      ],
    };
  },

  async asyncData({ $axios }) {
    try {
      const response = await $axios.get("/products");
      if (response.status !== 200) {
        return {
          error: response.statusText,
        };
      }
      return {
        products: response.data.data,
      };
    } catch (e) {
      return {
        error: e.message,
      };
    }
  },

  beforeCreate() {
    this.$axios.get("/products").then((response) => {
      this.products = response.data.data;
    });

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
