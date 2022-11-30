<template>
  <Dataview :data="this.getTableData()" :rowSize="4" :rowsPerPage="2">
  </Dataview>
</template>

<script lang="js">
import { defineComponent } from "vue";
import json from '@/resources/json/table.json'
import Dataview from "@/components/utils/Dataview.vue";
import { useItem } from "@/store/item";

export default defineComponent({
    name: "Table",
    components: {
        Dataview
    },
    data() {
        return {
            tableData: Array
        }
    },
    methods: {
        getTableData(){
            console.dir(useItem().items);
            return useItem().items;
        }
    },
    async serverPrefetch() {
        await useItem().init();
    },
    mounted() {},
    computed: {}
})
</script>

<style scoped>

</style>