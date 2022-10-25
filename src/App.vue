<template>
  <Navbar/>

  <div class="container">
    <h1 class="text-center">Welcome to Musubi!</h1>

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
