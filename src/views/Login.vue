<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register, login } from "../api.jsx";

const email = ref("");
const password = ref("");
const message = ref("");
const router = useRouter();

const handleRegister = async () => {
  try {
    await register(email.value, password.value);
    message.value = "Регистрация успешна! Теперь войдите.";
  } catch (error) {
    message.value = "Ошибка: " + (error.response?.data?.detail || error.message);
  }
};

const handleLogin = async () => {
  try {
    const data = await login(email.value, password.value);
    message.value = "Вход выполнен! Перенаправление...";
    setTimeout(() => router.push("/dashboard"), 1000);
  } catch (error) {
    message.value = "Ошибка входа: " + (error.response?.data?.detail || error.message);
  }
};
</script>

<template>
  <div>
    <h1>Вход или Регистрация</h1>

    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Пароль" />

    <button @click="handleRegister">Зарегистрироваться</button>
    <button @click="handleLogin">Войти</button>

    <p>{{ message }}</p>
  </div>
</template>

<style>
input {
  margin: 5px;
  padding: 8px;
}
button {
  margin: 5px;
  padding: 10px;
  cursor: pointer;
}
</style>
