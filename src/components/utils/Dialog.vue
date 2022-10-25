<template>
  <div class="modal fade">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"></h3>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { ObjectUtils } from 'primevue/utils';
import plus from '@/assets/plus_sign.png';
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Dialog',
    emits: ['update:first', 'update:rows', 'page'],
    props: {
        data: {
            type: Array,
            default: null
        }
    },
    data() {
        return {};
    },
    mounted() {
        console.dir('le dialog');
    },
    methods: {
        getKey(item, index) {
            return this.dataKey ? ObjectUtils.resolveFieldData(item, this.dataKey) : index;
        },
        loadPage(index) {
            this.currentPage = index;
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
        plusSign() {
            return plus;
        },
        colClass() {
            return '';
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
                    if (this.searchTerm) {
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