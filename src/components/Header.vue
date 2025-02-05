<template>
    <header class="header">
      <h1 class="header-title">Интерактивная карта</h1>
      <button @click="toggleSidebar" class="sidebar-toggle">Сайдбар</button>
    </header>
  </template>
  
  <script setup>
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['toggleSidebar']);
  
  const toggleSidebar = () => {
    emit('toggleSidebar');
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #333;
    color: #fff;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 20px;
  }
  
  .header-title {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .sidebar-toggle {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .sidebar-toggle:hover {
    background-color: #0056b3;
  }
  </style>