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

      <div class="form-row flex-column">
        <label for="path" class="form-label w-100">{{ this.$t('item.path', 2) }}</label>

        <div class="d-flex">
          <template v-for="(p, i) in this.item.paths" :key="p">
            <div class="d-flex w-100 justify-content-between">
              <span class="form-control item-path" :data-name="p.id" @click="this.selectPath()">
                {{ p.path }}
              </span>
              <button class="btn btn-delete col-2" @click="this.removePath(p.id)">
                <span class="fa-solid fa-trash-can"></span>
              </button>
            </div>
          </template>

        </div>
        <button class="btn btn-outline-info" @click="this.addPath()">
          <span class="fa-solid fa-plus"></span>
          {{ this.$t('add') }}
        </button>
      </div>
    </div>

    <dialog id="sendDialog">
      <form method="dialog" class="form-control bg-danger" @submit="this.updateDestinationIP()">
        <label for="code" class="form-label">IP:</label>
        <input id="code" v-model="this.code" type="text" class="form-control">
        <button class="btn btn-warning" value="cancel">Cancel</button>
        <button class="btn btn-success" type="submit">Confirm</button>
      </form>
    </dialog>

  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useToast } from "vue-toast-notification";
import { itemStore } from "@/store/item";
import { useStore } from "@/store/main";
import { dialogService } from "@/services/dialogService";
import { itemService } from "@/services/itemService";
import { invoke } from "@tauri-apps/api/tauri";
import Dialog from "@/components/utils/Dialog.vue";

export default defineComponent({
    name: 'Item',
    components: {
        Dialog
    },
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
            synchronised: false,
            code: null
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
        const mainStore = useStore();
        return {toast, mainStore};
    },
    mounted() {
        itemService.get(this.id).then(response => {
            this.item = response;
        });
    },
    methods: {
        updateDestinationIP(){
            this.mainStore.code = this.code;
            itemService.send(this.item.id);
        },
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
            const code = 72;
            document.getElementById('sendDialog').showModal();
            //itemService.send(code, this.item.id);
        },
        removePath(id) {
            for (const p of this.item.paths) {
                if (p.id === id) {
                    const index = this.item.paths.indexOf(p);
                    this.item.paths.splice(index, 1);
                    break;
                }
            }
            console.dir(this.item);
        },
        receive() {
            invoke()
        },
        async save() {
            let finished = itemStore().save(this.item);
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
  max-height: 70vh;
  min-height: 20vh;
  object-fit: contain;
}

.item-path {
  background-color: transparent;
  border: 2px solid #646cff;
  border-radius: 12px;
  color: #6169f1;
  text-align: start;
  margin-bottom: 0.5rem;
  width: 75%;
  min-width: 17rem;
}

.btn-delete {
  color: lightgrey;
  background-color: #dc3545;
  margin-bottom: 0.5rem;
}

.btn-delete:hover {
  background-color: darkred;
  color: black;
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