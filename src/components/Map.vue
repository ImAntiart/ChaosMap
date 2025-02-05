<template>
  <div id="map-container">
    <div id="map"></div>
    <!-- Сайдбар -->
    <transition name="fade">
      <div v-if="isSidebarOpen" class="sidebar-overlay" @click="closeSidebar"></div>
    </transition>
    <transition name="slide">
      <div v-if="isSidebarOpen" class="sidebar">
        <Sidebar @addRoute="addRouteFromSidebar" />
        <button @click="closeSidebar" class="close-sidebar">Закрыть</button>
        <button @click="clearRoutes" class="clear-routes">Очистить маршруты</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted } from 'vue';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import Sidebar from './Sidebar.vue';
import { defineExpose } from 'vue';

// Открытие/закрытие сайдбара
const isSidebarOpen = ref(false);

// Функции для управления сайдбаром
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

// Массив для хранения всех маршрутов
const routes = ref([]);
let map;

onMounted(() => {
  // Убедимся, что DOM-элемент #map существует
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Контейнер для карты не найден!');
    return;
  }

  map = L.map('map').setView([55.751244, 37.618423], 13);

  // Добавляем слой плиток
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  // Обработка изменения размера карты
  setTimeout(() => {
    map.invalidateSize(); // Корректируем размер после рендера
  }, 0);

  // Добавляем панель инструментов для рисования
  const drawControl = new L.Control.Draw({
    edit: false,
    remove: false,
    draw: {
      polygon: false,
      circle: false,
      rectangle: false,
      marker: false,
      polyline: true,
    },
  });
  map.addControl(drawControl);

  // Обработка события создания новой линии
  map.on('draw:created', (event) => {
    if (event.layerType === 'polyline') {
      const coords = event.layer.getLatLngs().map((point) => [point.lat, point.lng]);
      addRoute(coords);
    }
  });

  // Обработка клавиши Esc
  const handleEscape = (event) => {
    if (event.key === 'Escape' && isSidebarOpen.value) {
      closeSidebar();
    }
  };

  window.addEventListener('keydown', handleEscape);

  // Удаление слушателя при размонтировании компонента
  onUnmounted(() => {
    window.removeEventListener('keydown', handleEscape);
  });
});

// Функция для добавления маршрута на карту
const addRoute = (coords) => {
  const polyline = L.polyline(coords, { color: 'blue' }).addTo(map);
  routes.value.push({ coords, polyline });
};

// Функция для очистки всех маршрутов
const clearRoutes = () => {
  routes.value.forEach((route) => map.removeLayer(route.polyline));
  routes.value = [];
};

// Экспорт метода для использования в других компонентах
defineExpose({
  toggleSidebar // Экспорт метода
});
</script>

<style scoped>
#map-container {
  position: relative;
  height: 100%;
}

#map {
  width: 100%;
  height: 100%;
}

/* Оверлей для затемнения карты */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* Сайдбар */
.sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.close-sidebar {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #dc3545;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

/* Анимация появления сайдбара */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

/* Анимация затемнения оверлея */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>