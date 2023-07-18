<template>
  <div class="content-container text-container">
    <h1 style="text-align: center; margin-bottom: 50px;">Anmelden</h1>
    <div class="login-form">
      <input
        v-model="email"
        type="email"
        autofill="email"
        placeholder="E-Mail-Adresse"
      />
      <input
        v-model="password"
        type="password"
        autofill="password"
        placeholder="Passwort"
      />
      <button class="button">Anmelden</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {},
};
</script>

<style scoped>
.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  max-width: 400px;
  background-color: var(--primary-light-gray);
  margin: 0 auto;
  border-radius: 5px;
}

.login-form .button {
  width: 100%;
  margin-top: 20px;
}

input {
  width: 100%;
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}
</style>