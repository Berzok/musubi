<template>
  <div class="text-center">

    <h2>{{ this.$t('send_file') }}</h2>

    <div class="d-flex flex-column flex-fill">
      <div class="form-row">
        <label for="name" class="form-label">{{ this.$t('item.name') }}: </label>
        <input id="name" class="form-control" v-model="this.item.name">
      </div>

      <div class="form-row">
        <label for="about" class="form-label">{{ this.$t('item.about') }}: </label>
        <textarea id="about" class="form-control" rows="4" v-model="this.item.about"></textarea>
      </div>

      <hr/>

      <div class="form-check form-switch">
        <input id="tracked" type="checkbox" role="switch" class="form-check-input" v-model="this.item.tracked">
        <label for="tracked" class="form-check-label">{{ this.$t('item.tracked') }}</label>
      </div>

      <div class="form-check form-switch">
        <input id="synchronised" type="checkbox" role="switch" class="form-check-input"
               v-model="this.item.synchronised">
        <label for="synchronised" class="form-check-label">{{ this.$t('item.synchronised') }}</label>
      </div>

    </div>
  </div>
  <button @click="this.selectFolder()" class="btn btn-primary"></button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { dialogService } from '@/services/dialogService'

export default defineComponent({
    name: "Send",
    components: {
    },
    data() {
        return {
        }
    },
    methods: {
        selectFolder(){
            dialogService.selectDirectory();
        }
    },
    mounted() {}
})
</script>

<style scoped>

</style>