<template>
  <Navbar/>

  <div class="container">
    <h1>Welcome to Musubi!</h1>

    <div class="row">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/src/assets/vite.svg" class="logo vite" alt="Vite logo"/>
      </a>
      <a href="https://tauri.app" target="_blank">
        <img src="/src/assets/tauri.svg" class="logo tauri" alt="Tauri logo"/>
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="/src/assets/vue.svg" class="logo vue" alt="Vue logo"/>
      </a>
    </div>

    <router-view/>
  </div>
</template>

<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import Navbar from '@/components/Navbar.vue';
import Content from '@/components/Home.vue';
import { ref } from 'vue';

// let visibleSidebar = ref(false);
</script>

<style scoped>
</style>
