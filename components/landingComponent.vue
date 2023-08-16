<template>
  <div class="background">
    <div class="content-container">
      <div class="row">
        <div class="col-4">
          <h1>{{ component.title }}</h1>
          <p>{{ component.subtitle }}</p>
          <nuxt-link
            class="button"
            :to="component.button.link"
            style="margin-top: 40px"
            >{{ component.button.text }}</nuxt-link
          >
        </div>
        <div class="col-8" v-if="component.image">
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
.col-4 {
  width: 50%;
}

.col-8 {
  width: 70%;
}
.col-8 img {
  width: 100%;
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

  .col-4 {
    width: 100%;
  }

  .col-8 {
    width: 100%;
  }
  .col-8 img {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>