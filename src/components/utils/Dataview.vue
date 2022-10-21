<template>
  <div>
    <div v-if="$slots.header" class="p-dataview-header">
      <slot name="header"></slot>
    </div>

    <div class="view-header">
      <div class="col-3">
        <label for="search" class="form-label">{{ this.$t('form.search') }}</label>
        <input id="search" v-model="this.searchTerm" @input="this.search()" type="text" class="form-control">
      </div>
      <div class="col-2">
        <label for="sort" class="form-label">{{ this.$t('form.sortBy') }}</label>
        <div class="d-flex">
          <select id="sort" v-model="sortField" @change="this.sort()" class="form-select">
            <option v-for="o in this.sortOptions" :key="o" :value="o.value">
              {{ o.name }}
            </option>
          </select>
          <button @click="this.resetSort()" class="btn btn-secondary">
            <span class="fa-solid fa-xmark"></span>
          </button>
        </div>
      </div>
    </div>

    <div class="view-table">
      <template v-for="i in items" :key="i">
        <div class="view-item" :class="colClass">
          <div class="card">
            <img :src="i.picture" class="card-img-top cell-image" :alt="i.name">
            <h4 class="card-title">{{ i.name }}</h4>
          </div>
        </div>
      </template>

      <div v-show="!(this.sortField || this.searchTerm)" class="view-item" :class="colClass">
        <div class="card">
          <img src="" class="card-img-top cell-image" alt="placeholder">
          <h4 class="card-title">ajouter</h4>
        </div>
      </div>

    </div>

    <nav aria-label="Item navigation">
      <ul class="pagination">
        <template v-for="p in pages" :key="p">
          <li>{{ p.label }}</li>
        </template>
      </ul>
    </nav>

  </div>

  <div v-if="$slots.footer" class="p-dataview-footer">
    <slot name="footer"></slot>
  </div>

</template>

<script>
import { ObjectUtils } from 'primevue/utils';
import Dropdown from 'primevue/dropdown';
import yarn from '@/assets/yarn.png';
import { defineComponent } from "vue";
import DataView from "primevue/dataview";
import Button from "primevue/button";

export default defineComponent({
    name: 'Dataview',
    components: {
        Dropdown
    },
    emits: ['update:first', 'update:rows', 'page'],
    props: {
        data: {
            type: Array,
            default: null
        },
        rows: {
            type: Number,
            default: 0
        },
        first: {
            type: Number,
            default: 0
        },
        totalRecords: {
            type: Number,
            default: 0
        },
        paginator: {
            type: Boolean,
            default: false
        },
        rowsPerPageOptions: {
            type: Array,
            default: null
        },
        rowSize: {
            type: Number,
            default: 4
        },
        sortOrder: {
            type: Number,
            default: null
        },
        lazy: {
            type: Boolean,
            default: false
        },
        dataKey: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            d_first: this.first,
            d_rows: this.rows,
            currentPage: 0,
            pages: [],
            searchTerm: null,
            sortField: null,
            sortOptions: [
                {
                    name: this.$t('name'),
                    value: 'name'
                },
                {
                    name: this.$t('date'),
                    value: 'date'
                }
            ]
        };
    },
    watch: {
        first(newValue) {
            this.d_first = newValue;
        },
        rows(newValue) {
            this.d_rows = newValue;
        },
        sortField() {
            this.resetPage();
        },
        sortOrder() {
            this.resetPage();
        }
    },
    mounted() {
        this.data.forEach((v, k) => {
            v.picture = v.picture.length > 0 ? new URL('/src/assets/' + v.picture, import.meta.url) : yarn;
        });
        console.dir(Boolean(this.sortField) || Boolean(this.searchTerm));
    },
    methods: {
        getKey(item, index) {
            return this.dataKey ? ObjectUtils.resolveFieldData(item, this.dataKey) : index;
        },
        loadPage(index) {
            this.currentPage = index;
        },
        onPage(event) {
            this.d_first = event.first;
            this.d_rows = event.rows;

            this.$emit('update:first', this.d_first);
            this.$emit('update:rows', this.d_rows);
            this.$emit('page', event);
        },
        search() {
            if (this.data) {
                const data = [...this.data];
                let newData = [];

                data.forEach((e, i, a) => {
                    if (e.name.toLowerCase().includes(this.searchTerm)) {
                        newData.push(e);
                    } else {
                        a.splice(i, 1);
                    }
                });

                return newData;
            }
        },
        sort() {
            if (this.data) {
                const data = [...this.data];

                data.sort((data1, data2) => {
                    let value1 = ObjectUtils.resolveFieldData(data1, this.sortField);
                    let value2 = ObjectUtils.resolveFieldData(data2, this.sortField);
                    let result = null;

                    //If only value2 exists
                    if (value1 == null && value2 != null) {
                        result = -1;

                        //If only value1 exists
                    } else if (value1 != null && value2 == null) {
                        result = 1;

                        //Neither value exist
                    } else if (value1 == null && value2 == null) {
                        result = 0;

                    } else if (typeof value1 === 'string' && typeof value2 === 'string') {
                        result = value1.localeCompare(value2, undefined, {numeric: true});

                    } else {
                        result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;
                    }

                    if (result === -1) {
                        console.dir(value1 + ' < ' + value2);
                    } else if (result === 0) {
                        console.dir(value1 + ' ==' + value2);
                    } else if (result === 1) {
                        console.dir(value1 + ' > ' + value2);
                    }

                    return result;
                });

                return data;
            } else {
                return null;
            }
        },
        resetPage() {
            this.d_first = 0;
            this.$emit('update:first', this.d_first);
        },
        resetSort() {
            this.sortField = null;
        }
    },
    computed: {
        rowsCount() {
            const c = this.getTotalRecords / this.rowSize;
            console.dir(c);
            return c;
        },
        colClass() {
            return 'w-20';
        },
        getTotalRecords() {
            if (this.totalRecords) return this.totalRecords;
            else return this.data ? this.data.length : 0;
        },
        empty() {
            return !this.data || this.data.length === 0;
        },
        items() {
            if (this.data && this.data.length) {
                let data = this.data;

                if (data && data.length) {
                    if(this.searchTerm){
                        data = this.search();
                    }
                    if (this.sortField) {
                        data = this.sort();
                    }
                    console.dir(data);
                }

                return data;

            } else {
                return null;
            }
        }
    }
});
</script>

<style scoped lang="scss">
@import 'bootstrap/dist/css/bootstrap.min.css';

.view-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
  font-weight: bold;
  font-size: 18px;
  color: peru;
}

.form-label {
  -webkit-text-stroke: 0.5px #5d5d5d;
}

.view-table {
  display: flex;
  text-align: center;
  flex-wrap: wrap;
  justify-content: space-between;
}

.view-item {
  display: flex;
  flex-direction: column;
  background-color: #232833;
  border: 2px solid thistle;
  border-radius: 2%;
  justify-content: center;
  margin-right: 0.5rem;
  margin-bottom: 4rem;
  margin-left: 0.5rem;
  padding: 0.3rem;
  transition: ease-in-out 1.1s;
  cursor: pointer;
}

.view-item:hover {
  transition: ease-in-out 0.9s;
  filter: drop-shadow(0 0 1.5em #24c8db);
}

.cell-image {
  max-width: 100%;
  height: auto;
  height: 15rem;
  max-height: 15rem;
  object-fit: contain;
}

.card {
  background-color: #3f4550;
  background-size: cover;
  border: 1px solid thistle;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  color: #d479f3;
  -webkit-text-stroke: 1px #5d5d5d;
}

.w-20 {
  width: 20%;
  flex: 0 0 auto;
}
</style>