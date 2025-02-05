<template>
  <div class="sidebar-content">
    <h3>Создание маршрута</h3>
    <form @submit.prevent="addRoute">
      <div class="point-input">
        <label>Первая точка (Latitude, Longitude)</label>
        <input v-model="firstPoint" type="text" placeholder="Пример: 55.751244, 37.618423" required />
      </div>
      <div class="point-input">
        <label>Вторая точка (Latitude, Longitude)</label>
        <input v-model="secondPoint" type="text" placeholder="Пример: 59.938631, 30.314130" required />
      </div>
      <div class="point-input">
        <label>Средняя скорость (км/ч)</label>
        <input v-model="speed" type="number" min="1" required />
      </div>
      <button type="submit">Добавить маршрут</button>
    </form>

    <h3>Список маршрутов</h3>
    <ul class="routes-list">
      <li v-for="(route, index) in routes" :key="index" class="route-item">
        Маршрут {{ index + 1 }}:
        <span>{{ route.coords.map((coord) => coord.join(', ')).join(' → ') }}</span>
        <button @click="removeRoute(index)" class="remove-route">Удалить</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';

const emit = defineEmits(['addRoute']);

const firstPoint = ref('');
const secondPoint = ref('');
const speed = ref(50);
const routes = ref([]);

const addRoute = () => {
  const parseCoordinates = (input) => {
    const coords = input.split(',').map((value) => parseFloat(value.trim()));
    return !isNaN(coords[0]) && !isNaN(coords[1]) ? coords : null;
  };

  const start = parseCoordinates(firstPoint.value);
  const end = parseCoordinates(secondPoint.value);

  if (!start || !end) {
    alert('Некорректные координаты!');
    return;
  }

  const coords = [start, end];
  emit('addRoute', coords, parseFloat(speed.value));

  routes.value.push({ coords, speed: parseFloat(speed.value) });

  firstPoint.value = '';
  secondPoint.value = '';
};

const removeRoute = (index) => {
  routes.value.splice(index, 1);
};
</script>

<style scoped>
.sidebar-content {
  padding: 10px;
}
h3 {
  margin-bottom: 10px;
}
.point-input {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}
.point-input label {
  margin-bottom: 5px;
}
.point-input input {
  padding: 5px;
  width: 100%;
}
.routes-list {
  list-style-type: none;
  padding: 0;
  margin-top: 20px;
}
.route-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  margin-bottom: 5px;
}
.remove-route {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>