<template>
  <div class="container">
    <div id="nav">
        <router-link to="/authenticate/login" id="link-to-login">
          {{ $t('authenticate.login') }}
        </router-link> |
        <router-link to="/authenticate/register" id="link-to-register">
          {{ $t('authenticate.register') }}
        </router-link>
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Authenticate',
  components: {},
  props: {
  },
});
</script>
