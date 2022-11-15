<template>
  <Dataview :data="this.getTableData()" :rowSize="4" :rowsPerPage="2">
  </Dataview>
</template>

<script lang="js">
import { defineComponent } from "vue";
import json from '@/resources/json/table.json'
import Dataview from "@/components/utils/Dataview.vue";
import { itemStore } from "@/store/item";

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
            console.dir(itemStore().items);
            return itemStore().items;
        }
    },
    async serverPrefetch() {
        console.dir('haha');
        await itemStore().init();
    },
    mounted() {},
    computed: {}
})
</script>

<style scoped>

</style>