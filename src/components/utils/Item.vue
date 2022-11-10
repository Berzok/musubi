<template>

  <div class="item-details">
    <div class="image-container">
      <img :src="this.item.image" alt="Image" class="item-image" @click="uploadImage()"/>
      <input id="image_upload" type="file" @change="imageChange($event)" hidden>

      <div class="d-flex flex-wrap justify-content-center mt-4">
        <button @click="this.send()" class="btn btn-primary col-5 me-1 mb-2">
          <span class="fa-solid fa-upload"></span>
          {{ this.$t('menu.send') }}
        </button>
        <button @click="this.receive()" class="btn btn-info col-5 ms-1 mb-2">
          <span class="fa-solid fa-download"></span>
          {{ this.$t('menu.receive') }}
        </button>

        <div class="d-flex justify-content-center col-12">
          <button @click="this.save()" class="btn btn-success ms-1">
            <span class="fa-solid fa-save"></span>
            {{ this.$t('form.submit') }}
          </button>
        </div>
        <div class="d-flex justify-content-center col-12">
          <button @click="$router.go(-1)" class="btn btn-secondary mx-auto">
            <span class="fa-solid fa-times"></span>
            {{ this.$t('form.back') }}
          </button>
        </div>
      </div>
    </div>

    <div class="d-flex flex-column flex-fill">
      <div class="form-row">
        <label for="name" class="form-label">{{ this.$t('item.name') }}: </label>
        <input id="name" class="form-control" v-model="this.item.name">
      </div>

      <div class="form-row">
        <label for="about" class="form-label">{{ this.$t('item.about') }}: </label>
        <textarea id="about" class="form-control" rows="4" v-model="this.item.about"></textarea>
      </div>

      <hr/>

      <div class="form-check form-switch">
        <input id="tracked" type="checkbox" role="switch" class="form-check-input" v-model="this.item.tracked">
        <label for="tracked" class="form-check-label">{{ this.$t('item.tracked') }}</label>
      </div>

      <div class="form-check form-switch">
        <input id="synchronised" type="checkbox" role="switch" class="form-check-input"
               v-model="this.item.synchronised">
        <label for="synchronised" class="form-check-label">{{ this.$t('item.synchronised') }}</label>
      </div>

      <hr/>

      <div class="form-row">
        <label for="path" class="form-label">{{ this.$t('item.path', 2) }}</label>

        <template v-for="(p, i) in this.item.paths" :key="p">
          <span class="form-control item-path" @click="this.selectPath()">{{ this.item.paths[i] }}</span>
        </template>
        <button class="btn btn-outline-info" @click="this.addPath()">
          <span class="fa-solid fa-plus"></span>
          {{ this.$t('add') }}
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useToast } from "vue-toast-notification";
import { useItem } from "@/store/item";
import { dialogService } from "@/services/dialogService";
import { itemService } from "@/services/itemService";
import { invoke } from "@tauri-apps/api/tauri";

export default defineComponent({
    name: 'Item',
    components: {},
    emits: ['update:first', 'page'],
    props: {
        id: {
            type: String,
            default: null
        },
        first: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            item: {},
            name: null,
            image: null,
            about: null,
            tracked: false,
            synchronised: false
        };
    },
    watch: {
        first(newValue) {
            this.d_first = newValue;
        },
    },
    setup() {
        // Get toast interface
        const toast = useToast();
        const itemStore = useItem();
        return {toast, itemStore};
    },
    mounted() {
        itemService.get(this.id).then(response => {
            this.item = response;
        })
    },
    methods: {
        async addPath() {
            const p = await dialogService.selectDirectory();
            if (p) {
                if (Array.isArray(p)) {
                    for (const single of p) {
                        this.item.paths.push(single);
                    }
                } else {
                    this.item.paths.push(p);
                }
                this.toast.success(this.$t('item.actions.added', {label: this.$t('item.path')}))
            }
        },
        selectPath() {
            dialogService.selectDirectory();
        },
        resetPage() {
            this.d_first = 0;
            this.$emit('update:first', this.d_first);
        },
        send() {
            itemService.send(this.item.id);
        },
        receive() {
            invoke()
        },
        async save() {
            let finished = this.itemStore.save(this.item);
            if (await finished) {
                this.toast.success(this.$t('item.actions.saved'));
                return true;
            }
        },
        uploadImage() {
            document.getElementById('image_upload').click();
        },
        imageChange(event) {
            const [file] = event.target.files
            if (file) {
                //TODO: Pouvoir modifier l'image
                // this.personnage.image = URL.createObjectURL(file)
            }
        }
    },
    computed: {}
});
</script>

<style scoped lang="scss">
@import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

.item-details {
  display: flex;
  min-height: 80vh;
  margin-top: 3rem;
}

.image-container {
  display: flex;
  flex-direction: column;
  margin-right: 5rem;
}

.item-image {
  border: 1px solid slateblue;
  border-radius: 8px;
  max-width: 100%;
  height: 25rem;
  object-fit: contain;
}

.item-path {
  background-color: transparent;
  border: 2px solid #646cff;
  border-radius: 12px;
  color: #6169f1;
  text-align: start;
  margin-bottom: 0.5rem;
}

.form-check-label {
  margin-left: 0.3rem;
}

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.form-switch {
  display: flex;
  align-items: end;
}

.form-label {
  font-size: 2rem;
  user-select: none;
}

.active {
  background-color: gray;
}

</style>