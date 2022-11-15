<template>

  <div v-if="this.visible">
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
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Dialog',
    emits: ['update:first', 'update:rows', 'page'],
    props: {
        visible: Boolean
    },
    data() {
        return {};
    },
    mounted() {
        console.dir('le dialog');
    },
    methods: {
        loadPage(index) {
            this.currentPage = index;
        },
    },
    computed: {
        colClass() {
            return '';
        },
    }
});
</script>

<style scoped lang="scss">
@import 'bootstrap/dist/css/bootstrap.min.css';

</style>