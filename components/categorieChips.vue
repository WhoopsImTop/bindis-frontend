<template>
  <div class="content-container text-container">
    <h2>{{ component.title }}</h2>
    <div class="categorie-container">
        <nuxt-link class="categorie-chip" :to="'/produkt-kategorien/' + categorie.name" v-for="categorie in categories" :key="categorie.slug">{{ categorie.name }}</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
    props: ["categories", "component"],
}
</script>

<style>
.categorie-chip {
    padding: 10px 15px; border-radius: 5px;
    margin: 5px;
    background-color: #f8f8f8;
    color: #000;
    text-decoration: none;
}

.categorie-chip:hover {
    background-color: #e8e8e8;
}

.categorie-container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
}
</style>