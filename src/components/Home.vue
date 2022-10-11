<template>
  <Table></Table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Table from '@/components/Table.vue';

export default defineComponent({
    name: 'Home',
    components: {
        Table
    },
    mounted() {
        console.dir('oui le Home');
    }
});
</script>
