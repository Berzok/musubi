<template>

  <Dataview :data="tableData">
    <template #header>
      <div class="grid grid-nogutter">
        <div class="col-12">
          <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price"
                    @change="onSortChange($event)"/>
        </div>
      </div>
    </template>
  </Dataview>

  <div v-if="primevue">
    <DataView :value="tableData" layout="grid" :paginator="true" :rows="9" :sortOrder="sortOrder"
              :sortField="null">
      <template #header>
        <div class="grid grid-nogutter">
          <div class="col-12" style="text-align: right">
            <Dropdown v-model="sortKey" :options="sortOptions" optionLabel="label" placeholder="Sort By Price"
                      @change="onSortChange($event)"/>
          </div>
        </div>
      </template>

      <template #grid="slotProps">
        <div class="col-12 md:col-4">
          <div class="card">
            <img src="https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png"
                 :alt="slotProps.data.name"/>
            <span class="product-category">{{ slotProps.data.name }}</span>
            <div>
              <Button icon="pi pi-pencil"></Button>
              <Button icon="pi pi-sync"></Button>
            </div>
          </div>
        </div>
      </template>
    </DataView>
  </div>

</template>

<script lang="ts">
import "tabulator-tables/dist/css/tabulator_midnight.min.css";
import { defineComponent } from "vue"; //import Tabulator library
import json from '@/resources/json/table.json'
import addItem from "@/components/utils/Dataview.vue";
import DataView from 'primevue/dataview';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Dataview from "@/components/utils/Dataview.vue";

export default defineComponent({
    name: "Table",
    components: {
        Dataview,
        DataView,
        Dropdown,
        Button
    },
    data() {
        return {
            tableData: json,
            addDialog: false,
            primevue: false
        }
    },
    methods: {
        addItem() {
            this.$dialog.open(addItem, {
                props: {
                    header: 'Add an item',
                    modal: true
                }
            });
        }
    },
    mounted() {}
})
</script>

<style scoped>

</style>