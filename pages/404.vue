<template>
  <div class="content-container text-container">
    <div class="row">
      <div class="col">
        <h1>404</h1>
        <h3>Leider haben wir die Seite nicht finden können.</h3>
        <p>Aber Sie können gerne unsere Seite durchstöbern.</p>
        <NuxtLink to="/">Startseite</NuxtLink>
      </div>
      <div class="col">
        <img
          src="/404.svg"
          alt="404"
          title="404"
          loading="lazy"
          style="width: 100%"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "error",
  head() {
    return {
      title: "404 - Bindi's Schaulädle",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Leider haben wir die Seite nicht finden können.",
        },
      ],
    };
  },
};
</script>
<style scoped>
.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.col {
  width: 50%;
}

@media (max-width: 1000px) {
  .row {
    flex-direction: column;
  }

  .col {
    width: 100%;
  }
}
</style>