<template>

  <img :src="this.homepage" class="home-image" alt="Safebooru">

  <div class="d-flex justify-content-center my-3">
    <router-link to="/list" class="home-button btn">
      <span class="fa-solid fa-bars"></span>
      {{ this.$t('menu.list') }}
    </router-link>

    <router-link to="/send" class="home-button btn">
      <span class="fa-solid fa-upload"></span>
      {{ this.$t('menu.send') }}
    </router-link>

    <router-link to="/receive" class="home-button btn">
      <span class="fas fa-download"></span>
      {{ this.$t('menu.receive') }}
    </router-link>
  </div>

  <div class="d-flex flex-column mt-5 mb-1">
    <small class="text-info">
    </small>

    <p class="position-absolute bottom-0 end-0 me-2">
      <a href="https://github.com/Berzok/Musubi" target="_blank">
        <span class="fab fa-github"></span>
        Source on Github
      </a>
    </p>

  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import wool from '@/assets/ball_of_wool.svg';
import { invoke } from '@tauri-apps/api/tauri';

export default defineComponent({
    name: 'Home',
    components: {},
    computed: {
        homepage() {
            return wool;
        }
    },
    methods: {
        async connect(){
            const rustponse = await invoke("connect_to_ip", { ip: '127.0.0.1:7878' });
            console.dir(rustponse);
        }
    },
    mounted() {
        console.dir('oui le Home');
    }
});
</script>

<style scoped lang="scss">
@import 'bootstrap/dist/css/bootstrap.min.css';

.home-image {
  max-width: 25%;
  height: auto;
  margin-left: auto;
  margin-right: auto;
}

.home-button {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: #535bf2;
  font-size: 3rem;
  margin-left: 1rem;
  margin-right: 1rem;
}
</style>