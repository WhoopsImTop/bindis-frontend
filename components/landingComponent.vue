<template>
  <div
    class="background"
    :style="
      component.backgroundImage
        ? 'background-image: url(' + component.backgroundImage.url + ')'
        : ''
    "
  >
    <div class="content-container">
      <div class="row">
        <div class="col-8">
          <h1>{{ component.title }}</h1>
          <p>{{ component.subtitle }}</p>
          <nuxt-link
            class="button"
            :to="component.button.link"
            style="margin-top: 40px"
            >{{ component.button.text }}</nuxt-link
          >
        </div>
        <div class="col-4" v-if="component.image">
          <img :src="component.image.url" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "landingComponent",
  props: ["component"],
};
</script>

<style scoped>
.col-4 img {
  height: 400px;
}
.background {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: calc(80vh - 80px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (max-width: 1200px) {
  .background {
    height: 100%;
  }
  .row {
    flex-direction: column-reverse;
  }
  .col-4 img {
    height: 200px;
  }
}
</style>