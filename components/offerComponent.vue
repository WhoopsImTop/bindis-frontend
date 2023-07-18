<template>
  <div class="content-container text-container" style="overflow: hidden">
    <h2>{{ component.title }}</h2>
    <p>{{ component.subtitle }}</p>
    <!-- create a slider with all blocks -->
    <div class="offer-slider" :style="sliderOffset">
      <div
        class="offer-block"
        :class="currentSlide == index ? 'fancy-rainbow-shadow' : ''"
        v-for="(block, index) in component.content"
        :key="index"
      >
        <div class="offer-content">
          <h3>{{ block.title }}</h3>
          <p>{{ block.subtitle }}</p>
          <nuxt-link
            class="button"
            :to="'/produkt-kategorien/' + block.button.link"
            >{{ block.button.text }}</nuxt-link
          >
        </div>
        <div class="offer-images">
          <div
            class="offer-image"
            v-for="(image, index) in block.images"
            :key="index"
          >
            <img :src="image.url" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["component"],
  data() {
    return {
      currentSlide: 0,
    };
  },
  computed: {
    sliderOffset() {
      let offset = 100 * this.currentSlide;
      return `transform: translateX(-${offset}%)`;
    },
  },
  mounted() {
    setInterval(() => {
      this.currentSlide++;
      if (this.currentSlide >= this.component.content.length) {
        this.currentSlide = 0;
      }
    }, 5000);
  },
};
</script>

<style scoped>
.offer-slider {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin: 100px 0 0 0;
  transition: transform 2s ease-in-out;
}

.offer-block {
  display: grid;
  grid-template-columns: 2fr 1fr;
  min-width: 100%;
  margin-right: 30px;
  border-radius: 10px;
  box-shadow: 0px 0px 20px 0px rgba(70, 129, 213, 0.2);
}

.offer-images {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
}

.offer-content {
  padding: 50px;
}

.offer-image:first-child {
  position: absolute;
  right: 100px;
  transform: scale(0.9) rotate(-20deg);
  bottom: 0;
}

.offer-image:last-child {
  position: absolute;
  right: 0;
  transform: scale(0.9) rotate(20deg);
  bottom: 0;
}

.offer-image {
  position: absolute;
  right: 0;
}

@media (max-width: 1200px) {
  .offer-content {
    display: flex;
    flex-direction: column;
    padding: 20px
  }

  .offer-images {
    display: none;
  }
}
</style>