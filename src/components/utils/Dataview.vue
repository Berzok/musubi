<template>
  <div class="view-container">
    <div class="view-header">
      <div class="col-3">
        <label for="search" class="form-label">{{ this.$t('form.search') }}</label>
        <div class="d-flex">
          <input id="search" v-model="this.searchTerm" @input="this.search()" type="text" class="form-control">
          <button @click="this.resetSearch()" class="btn btn-secondary">
            <span class="fa-solid fa-xmark"></span>
          </button>
        </div>
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
        <div class="view-item">
          <div class="card">
            <img :src="i.picture" class="card-img-top cell-image" :alt="i.name">
            <h4 class="card-title">{{ i.name }}</h4>
          </div>
        </div>
      </template>

      <div v-show="!(this.sortField || this.searchTerm) && this.freeSpace" class="view-item">
        <div class="card">
          <span class="fa-solid fa-plus"></span>
          <img :src="this.plusSign" class="card-img-top cell-image" alt="placeholder">
          <h4 class="card-title">ajouter</h4>
        </div>
      </div>
    </div>

    <nav class="view-pagination" aria-label="Item navigation">
      <button @click="this.previousPage()" class="page-item">
        <span class="fa-solid fa-angles-left"></span>
      </button>
      <template v-for="p in pages" :key="p">
        <button class="page-item" @click="loadPage(p)" :class="{active: p === currentPage}">{{ p }}</button>
      </template>
      <button @click="this.nextPage()" class="page-item">
        <span class="fa-solid fa-angles-right"></span>
      </button>
    </nav>
  </div>

</template>

<script>
import { ObjectUtils } from 'primevue/utils';
import yarn from '@/assets/yarn.png';
import plus from '@/assets/plus_sign.png';
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Dataview',
    components: {},
    emits: ['update:first', 'page'],
    props: {
        data: {
            type: Array,
            default: null
        },
        /**
         * Define if we do an infinite scrolling or old school pagination
         * @values pagination | scroll
         */
        mode: {
            type: String,
            default: 'pagination'
        },
        first: {
            type: Number,
            default: 0
        },
        totalRecords: {
            type: Number,
            default: 0
        },
        rowsPerPage: {
            type: Number,
            default: null
        },
        rowSize: {
            type: Number,
            default: 4
        }
    },
    data() {
        return {
            d_first: this.first,
            d_rows: this.rows,
            currentPage: 0,
            pages: [0],
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
        sortField() {
            this.resetPage();
        },
        sortOrder() {
            this.resetPage();
        }
    },
    mounted() {
        let index = 1;
        this.data.forEach((v, k) => {
            v.picture = v.picture.length > 0 ? new URL('/src/assets/' + v.picture, import.meta.url) : yarn;
            index++;
            //this.pages[this.pages.length-1]
            if (index >= (this.rowSize * this.rowsPerPage)) {
                this.pages.push(Math.min(...this.pages) + 1);
                index = 1;
            }
        });
    },
    methods: {
        previousPage() {
            this.loadPage(this.currentPage - 1);
        },
        nextPage() {
            this.loadPage(this.currentPage + 1);
        },
        loadPage(index) {
            if (index > this.pages[this.pages.length - 1] || index < 0) {
                return false;
            }
            this.currentPage = index;
            this.d_first = (this.rowSize * this.rowsPerPage) * index;

            this.$emit('update:first', this.d_first);
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
        resetSearch() {
            this.searchTerm = null;
        },
        resetSort() {
            this.sortField = null;
        }
    },
    computed: {
        freeSpace() {
            return this.items.length < this.rowSize * this.rowsPerPage;
        },
        plusSign() {
            return plus;
        },
        pagination() {
            return this.mode === 'pagination';
        },
        infinite() {
            return this.mode === 'infinite';
        },
        items() {
            if (this.data && this.data.length) {
                let data = this.data;

                if (data && data.length) {
                    if (this.searchTerm) {
                        data = this.search();
                    }
                    if (this.pagination) {
                        const first = this.d_first > 0 ? this.d_first : 0;
                        data = data.slice(first, first + this.rowSize * this.rowsPerPage);
                    }
                    if (this.sortField) {
                        data = this.sort();
                    }
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

.view-container {
  margin-bottom: 1rem;
}

.view-pagination {
  display: flex;
  justify-content: center;
}

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
  display: grid;
  grid-template-columns: 20% 20% 20% 20%;
  text-align: center;
  flex-wrap: wrap;
  justify-content: space-between;
}

.view-table::after {
  content: "";
  flex: auto;
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

.page-item {
  border-radius: 3px;
}

.active {
  background-color: gray;
}

</style>