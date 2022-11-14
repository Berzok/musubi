<template>
  <Dataview :data="tableData" :rowSize="4" :rowsPerPage="2">
  </Dataview>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import json from '@/resources/json/table.json'
import Dataview from "@/components/utils/Dataview.vue";

export default defineComponent({
    name: "Table",
    components: {
        Dataview
    },
    data() {
        return {
            tableData: json
        }
    },
    methods: {},
    mounted() {}
})
</script>

<style scoped>

</style>