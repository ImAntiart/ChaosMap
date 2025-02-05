<template>
  <div id="map-container">
    <div id="map"></div>
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

const isSidebarOpen = ref(false);
const routes = ref([]);
let map;

onMounted(() => {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) {
    console.error('Контейнер для карты не найден!');
    return;
  }

  map = L.map('map').setView([55.751244, 37.618423], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  setTimeout(() => {
    if (map) {
      map.invalidateSize();
    }
  }, 0);

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

  map.on('draw:created', (event) => {
    if (event.layerType === 'polyline') {
      const coords = event.layer.getLatLngs().map((point) => [point.lat, point.lng]);
      addRoute(coords);
    }
  });
});


const addRoute = (coords, speed = 50) => {
  const polyline = L.polyline(coords, { color: 'blue' }).addTo(map);

  const startPoint = L.marker(coords[0]).addTo(map);
  const endPoint = L.marker(coords[coords.length - 1]).addTo(map);

  const distance = calculateDistance(coords);
  const arrivalTime = calculateArrivalTime(distance, speed);
  const departureTime = new Date();

  startPoint.bindTooltip(`Время отправления: ${formatDate(departureTime)}`, {
    permanent: true,
    direction: 'top',
  });

  endPoint.bindTooltip(
    `Средняя скорость: ${speed} км/ч\nОсталось: ${arrivalTime}`,
    {
      permanent: true,
      direction: 'top',
    }
  );

  endPoint.on('click', () => {
    map.removeLayer(polyline);
    map.removeLayer(startPoint);
    map.removeLayer(endPoint);
    routes.value = routes.value.filter((route) => route !== polyline);
  });

  routes.value.push({ coords, polyline, speed, distance, departureTime });
};


const addRouteFromSidebar = (coords, speed) => {
  if (coords.length >= 2) {
    addRoute(coords, speed);
  } else {
    console.error('Недостаточно координат для создания маршрута:', coords);
  }
};

const calculateDistance = (coords) => {
  let totalDistance = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const point1 = L.latLng(coords[i][0], coords[i][1]);
    const point2 = L.latLng(coords[i + 1][0], coords[i + 1][1]);
    totalDistance += point1.distanceTo(point2) / 1000; 
  }
  return totalDistance;
};


const calculateArrivalTime = (distance, speed) => {
  const timeInSeconds = (distance / speed) * 3600; 
  const arrivalTime = new Date(Date.now() + timeInSeconds * 1000);
  return arrivalTime.toLocaleTimeString();
};


const formatDate = (date) => {
  return date.toLocaleString();
};

const clearRoutes = () => {
  routes.value.forEach((route) => {
    map.removeLayer(route.polyline);
  });
  routes.value = [];
};


const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

defineExpose({
  toggleSidebar,
  addRouteFromSidebar,
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
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
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
.clear-routes {
  margin-top: 10px;
  background: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
</style>