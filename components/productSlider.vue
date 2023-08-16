<template>
  <div class="content-container">
    <h2>{{ component.title }}</h2>
    <div class="productSlider">
      <product-component
        v-for="product in products"
        :product="product"
        :key="product.id"
        class="productSlider-item"
        :style="translationStyle"
      ></product-component>
    </div>
    <div class="product-slider-actions">
      <button
        class="action-button"
        @click="currentSlide--"
        :disabled="currentSlide === 0"
      >
        <img src="/left.svg" width="50" />
      </button>

      <button
        class="action-button"
        @click="currentSlide++"
        :disabled="currentSlide === products.length - slidesToShow"
      >
        <img src="/right.svg" width="50" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["component", "products"],
  data: () => {
    return {
      currentSlide: 0,
      slidesToShow: 4,
      productWidth: 0,
    };
  },
  computed: {
    translationStyle() {
      //calculate the translation value by the current slide and product width
      const translation = this.currentSlide * this.productWidth;
      //return the translation as a style
      return {
        transform: `translateX(-${translation}px)`,
      };
    },
  },
  mounted() {
    //make sure all items are rendered before calculating the width
    this.$nextTick(() => {
      //get the width of the product
      let allItems = document.querySelectorAll(".productSlider-item");
      //loop over them until we find the first one that is visible
      for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].offsetWidth > 0) {
          this.productWidth = allItems[i].offsetWidth + 10;
          break;
        }
      }
      setInterval(() => {
        this.currentSlide++;
        //if the current slide is the last one, go back to the first slide
        if (this.currentSlide === this.products.length) {
          this.currentSlide = 0;
        }
      }, 5000);
    });
  },
};
</script>

<style scoped>
.productSlider-item {
  transition: 0.5s ease-in-out;
}
.productSlider {
  overflow: hidden;
  margin: 20px 0;
}

.nuxt-link-active {
  display: none;
}

.product-slider-actions {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: -20px;
  margin-bottom: 20px;
}

.action-button {
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
}
</style>