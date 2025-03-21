<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { createTour } from "../api.jsx";

const router = useRouter();

// Поля для тура
const tourData = ref({
  name: "",
  countries: "",
  duration: 0,
  dates: "",
  description: "",
  meals: "",
  price: 0,
  extra_costs: "",
  accommodation: "",
  routes: []
});

// Добавление маршрута
const addRoute = () => {
  tourData.value.routes.push({
    cities: "",
    description: "",
    schedules: []
  });
};

// Добавление расписания к маршруту
const addSchedule = (routeIndex) => {
  tourData.value.routes[routeIndex].schedules.push({
    day_number: 1,
    activities: "",
    image: ""
  });
};

// Отправка данных на сервер
const submitTour = async () => {
  try {
    // Преобразуем строки в массивы
    tourData.value.countries = tourData.value.countries.split(",").map(s => s.trim());
    tourData.value.dates = tourData.value.dates.split(",").map(s => s.trim());

    await createTour(tourData.value);
    alert("Тур успешно добавлен!");
    router.push("/dashboard");
  } catch (error) {
    alert("Ошибка при добавлении тура: " + (error.response?.data?.detail || error.message));
  }
};
</script>

<template>
  <div>
    <h1>Добавить новый тур</h1>
    <label>Название тура: <input v-model="tourData.name" /></label>
    <label>Страны (через запятую): <input v-model="tourData.countries" /></label>
    <label>Длительность (дней): <input type="number" v-model="tourData.duration" /></label>
    <label>Даты (через запятую): <input v-model="tourData.dates" /></label>
    <label>Описание: <textarea v-model="tourData.description"></textarea></label>
    <label>Питание: <input v-model="tourData.meals" /></label>
    <label>Цена (USD): <input type="number" v-model="tourData.price" /></label>
    <label>Доп. расходы: <input v-model="tourData.extra_costs" /></label>
    <label>Проживание: <input v-model="tourData.accommodation" /></label>

    <h2>Маршруты</h2>
    <button @click="addRoute">Добавить маршрут</button>

    <div v-for="(route, index) in tourData.routes" :key="index">
      <label>Города (через запятую): <input v-model="route.cities" /></label>
      <label>Описание маршрута: <textarea v-model="route.description"></textarea></label>
      <h3>Расписание</h3>
      <button @click="addSchedule(index)">Добавить день</button>

      <div v-for="(schedule, sIndex) in route.schedules" :key="sIndex">
        <label>День: <input type="number" v-model="schedule.day_number" /></label>
        <label>Описание событий: <input v-model="schedule.activities" /></label>
        <label>Ссылка на изображение: <input v-model="schedule.image" /></label>
      </div>
    </div>

    <button @click="submitTour">Добавить тур</button>
    <button @click="router.push('/dashboard')">Назад</button>
  </div>
</template>

<style>
input, textarea {
  display: block;
  margin-bottom: 10px;
  padding: 8px;
  width: 300px;
}
button {
  margin: 10px;
  padding: 10px;
  cursor: pointer;
}
</style>
