<script setup>
import { ref } from "vue";
import { register, login, getProtectedData, refreshToken } from "./api.jsx";

const email = ref("");
const password = ref("");
const message = ref("");

const handleRegister = async () => {
  try {
    await register(email.value, password.value);
    message.value = "Регистрация успешна!";
  } catch (error) {
    message.value = "Ошибка: " + error.response.data.detail;
  }
};

const handleLogin = async () => {
  try {
    const data = await login(email.value, password.value);
    message.value = "Вход выполнен! Token: " + data.access_token;
  } catch (error) {
    message.value = "Ошибка входа!";
  }
};

const handleGetData = async () => {
  try {
    const response = await getProtectedData();
    message.value = "Доступ к защищённым данным: " + response.data;
  } catch (error) {
    message.value = "Ошибка доступа! Попробуй обновить токен.";
  }
};

const handleRefresh = async () => {
  try {
    const data = await refreshToken();
    message.value = "Токен обновлён: " + data.access_token;
  } catch (error) {
    message.value = "Ошибка обновления токена!";
  }
};
</script>

<template>
  <div>
    <h1>FastAPI Auth Test</h1>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Пароль" />

    <button @click="handleRegister">Зарегистрироваться</button>
    <button @click="handleLogin">Войти</button>
    <button @click="handleGetData">Доступ к API</button>
    <button @click="handleRefresh">Обновить токен</button>

    <p>{{ message }}</p>
  </div>
</template>

<style>
input { margin: 5px; padding: 8px; }
button { margin: 5px; padding: 10px; cursor: pointer; }
</style>
