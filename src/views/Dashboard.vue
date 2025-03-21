<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getAllTours, logout } from "../api.jsx";

const router = useRouter();
const tours = ref([]);
const message = ref("");

const fetchTours = async () => {
  try {
    const response = await getAllTours();
    tours.value = response.data;
  } catch (error) {
    message.value = "Ошибка при загрузке туров: " + (error.response?.data?.detail || error.message);
  }
};

const handleLogout = async () => {
  await logout();
  router.push("/login");
};

onMounted(fetchTours);
</script>

<template>
  <div>
    <h1>Добро пожаловать в Dashboard!</h1>
    <button @click="router.push('/add-tour')">Добавить тур</button>
    <button @click="handleLogout">Выйти</button>

    <h2>Список туров</h2>
    <p v-if="message">{{ message }}</p>
    <ul v-else>
      <li v-for="tour in tours" :key="tour.id">
        <strong>{{ tour.name }}</strong> — {{ tour.duration }} дней | {{ tour.price }} USD
        <p>{{ tour.description }}</p>
      </li>
    </ul>
  </div>
</template>

<style>
button {
  margin: 10px;
  padding: 10px;
  cursor: pointer;
}
</style>
