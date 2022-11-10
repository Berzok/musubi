<template>
  <Navbar/>
  <Spinner />

  <router-view v-slot="{ Component, route}">
    <transition name="fade">
      <div class="container">
        <component :is="Component" :key="route.path"/>
      </div>
    </transition>
  </router-view>

</template>

<script setup lang="ts">
import Content from '@/components/Home.vue';
import Navbar from '@/components/Navbar.vue';
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
import { ref } from 'vue';
import Spinner from '@/components/Spinner.vue';

// let visibleSidebar = ref(false);
</script>

<style scoped>
</style>
