<template>
  <div ref="table"></div>
<!--  <DataTable-->
</template>

<script lang="ts">
import { TabulatorFull as Tabulator, CellComponent, FormatterParams, EmptyCallback } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator_midnight.min.css";
import { defineComponent } from "vue"; //import Tabulator library
import json from '@/resources/json/table.json'
import vue from '../assets/vue.svg';
import { RowComponent } from 'tabulator-tables';
import { dialogService } from '@/services/dialogService';


export default defineComponent({
    name: "Table",
    data() {
        return {
            tabulator: Tabulator, //variable to hold your table
            tableData: json,
            tableColumns: [
                {
                    title: "Logo",
                    field: "picture",
                    formatter: function (cell: CellComponent, formatterParams: FormatterParams, onRendered: EmptyCallback) {
                        let img = document.createElement('img');
                        img.src = cell.getValue() > 0 ? cell.getValue : vue;
                        img.className = 'img-fluid';
                        return img.outerHTML;
                    },
                    widthGrow: 1,
                    variableHeight: true
                },
                {title: "Name", field: "name", hozAlign: "left", widthGrow: 2},
                {title: "Tracked", field: "tracked", hozAlign: "center", formatter: "tickCross"},
                {title: "Synchronised", field: "synchronised", hozAlign: "center", formatter: "tickCross"},
            ]
        }
    },
    mounted() {
        //instantiate Tabulator when element is mounted
        this.tabulator = new Tabulator(this.$refs.table, {
            data: this.tableData, //link data to table
            reactiveData: true, //enable data reactivity
            columns: this.tableColumns, //define table columns,
            layout: "fitColumns"
        });

        this.tabulator.on("rowClick", function(e: Event, row: RowComponent){
            //e - the click event object
            //row - row component
            console.dir(e);
            dialogService.selectDirectory();
        });
    }
})
</script>

<style scoped>

</style>