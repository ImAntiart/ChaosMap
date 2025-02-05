<template>
  <Header @toggleSidebar="toggleSidebar" />
  <div class="map-wrapper">
    <Map ref="mapComponent" />
  </div>
  <Footer />
</template>

<script setup>
import Header from './components/Header.vue';
import Map from './components/Map.vue';
import Footer from './components/Footer.vue';
import { ref } from 'vue';

const mapComponent = ref(null);

// Передаем событие toggleSidebar в Map.vue
const toggleSidebar = () => {
  if (mapComponent.value && typeof mapComponent.value.toggleSidebar === 'function') {
    mapComponent.value.toggleSidebar();
  } else {
    console.error('Метод toggleSidebar не найден в Map.vue');
  }
};
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  background-color: #555;
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  flex: 1; /* Карта занимает всё доступное пространство */
  position: relative;
}


</style>