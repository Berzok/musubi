<template>
  <Dataview :data="tableData" :rowSize="4" :rowsPerPage="2">
  </Dataview>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import json from '@/resources/json/table.json'
import Dataview from "@/components/utils/Dataview.vue";
import { useStore } from '@/store/main';

export default defineComponent({
    name: "Receive",
    components: {
        Dataview
    },
    data() {
        return {
            tableData: json
        }
    },
    methods: {},
    setup() {
        const mainStore = useStore();
        return mainStore;
    },
    mounted() {
    }
})
</script>

<style scoped>

</style>