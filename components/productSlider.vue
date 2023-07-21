<template>
  <div class="content-container">
    <h2>{{ component.title }}</h2>
    <div class="productSlider">
      <product-component
        v-for="product in products"
        v-show="product.status != 'draft'"
        :product="product"
        :key="product.id"
        class="productSlider-item"
        :style="translationStyle"
      ></product-component>
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
    //get the width of the product
    this.productWidth = document.querySelector(".productSlider-item").offsetWidth + 10;
    //set the interval to change the slide every 5 seconds
    setInterval(() => {
      this.currentSlide++;
      //if the current slide is the last one, go back to the first slide
      if (this.currentSlide === this.products.length) {
        this.currentSlide = 0;
      }
    }, 5000);
  },
};
</script>

<style>
.productSlider-item {
  transition: 0.5s ease-in-out;
}
.productSlider {
  overflow: hidden;
  margin: 20px 0;
}
</style>