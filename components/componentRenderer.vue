<template>
  <div>
    <landing-component
      v-if="component.type == 'landingComponent'"
      :component="component"
    ></landing-component>

    <product-slider
      v-if="component.type == 'ProductSlider'"
      :component="component"
      :products="products"
    ></product-slider>

    <offer-component
      v-if="component.type == 'OfferComponent'"
      :component="component"
    ></offer-component>

    <categorie-chips
      v-if="component.type == 'CategorieChips'"
      :component="component"
      :categories="categories"
    ></categorie-chips>
  </div>
</template>

<script>
import landingComponent from "./landingComponent.vue";
import ProductSlider from "./productSlider.vue";

export default {
  components: { landingComponent, ProductSlider },
  props: ["component", "products", "categories"],
};
</script>

<style>
</style>