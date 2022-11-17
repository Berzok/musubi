<template>

  <form class="item-details" @submit.prevent="this.save()">

    <div class="image-container">
      <img :src="this.imageSrc" alt="Image" class="item-image" @click="uploadImage()"
           :style="{ filter: 'hue-rotate(' + randomHue + ')'}"/>
      <input id="image_upload" type="file" accept="image/*" @change="imageChange($event)" hidden>

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
          <button class="btn btn-success ms-1">
            <span class="fa-solid fa-save"></span>
            {{ this.$t('form.submit') }}
          </button>
        </div>
        <div class="d-flex justify-content-center col-12">
          <button type="button" @click="$router.push({name: 'list'})" class="btn btn-secondary mx-auto">
            <span class="fa-solid fa-times"></span>
            {{ this.$t('form.back') }}
          </button>
        </div>
      </div>
    </div>

    <div class="d-flex flex-column flex-fill">
      <div class="form-row">
        <label for="name" class="form-label">{{ this.$t('item.name') }}: </label>
        <input id="name" class="form-control" required v-model="this.item.name">
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

  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useToast } from "vue-toast-notification";
import { itemStore } from "@/store/item";
import { useStore } from "@/store/main";
import { dialogService } from "@/services/dialog/dialogService";
import { itemService } from "@/services/itemService";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import Dialog from "@/components/utils/Dialog.vue";
import yarn from '@/assets/ball_of_wool.svg';
import { Item } from '@/interfaces/item';
import { basename, dirname, isAbsolute } from '@tauri-apps/api/path';

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
            item: {} as Item,
            imageSrc: '',
            name: null,
            image: null,
            about: null,
            tracked: false,
            synchronised: false,
            code: null
        };
    },
    setup(props) {
        // Get toast interface
        const toast = useToast();
        const mainStore = useStore();
        const item = itemStore().getById(props.id);
        return {toast, item, mainStore};
    },
    mounted() {
        //If we have an id, this means the item already exists (ie, we are not creating a new one)
        if (this.id) {
            this.item = itemStore().current = itemStore().getById(this.id);
        }

        //If no image is configured, we use a coloured version of our yarn ball
        if (this.item.image.length > 0) {
            this.imageSrc = itemStore().current.image;
        } else {
            this.imageSrc = yarn;
        }
        console.dir(this.item);
        console.dir(isAbsolute(this.item.image));
        console.dir(this.item.name);
    },
    computed: {
        randomHue() {
            if (this.item.image.length>0) {
                return 0;
            }
            const deg: string = Math.floor(Math.random() * 360).toString();
            return deg.concat('deg');
        },

    },
    methods: {
        updateDestinationIP() {
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
        send() {
            const code = 72;
            const m = document.getElementById('sendDialog') as HTMLDialogElement;
            m.showModal();
            //itemService.send(code, this.item.id);
        },
        removePath(id: string) {
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
            //invoke()
        },
        syncWithStore() {
            itemStore().current = this.item;
        },
        async save() {
            let finished = itemStore().save(this.item);
            if (await finished) {
                this.toast.success(this.$t('item.actions.saved'));
                return true;
            }
        },
        async uploadImage() {
            // document.getElementById('image_upload').click();
            const image = await dialogService.selectFile();
            if (image) {
                this.item.image = image;
                this.imageSrc = convertFileSrc(image);
            }
        },
        imageChange(event: Event) {
            if (!event.target) {
                return;
            }
            const file = (event.target as HTMLInputElement)?.files?.item(0);
            if (file) {
                this.item.image = file.name;
                this.imageSrc = URL.createObjectURL(file);
                //TODO: Pouvoir modifier l'image
                // this.personnage.image = URL.createObjectURL(file)
            }
        }
    }
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
  height: 60vh;
  object-fit: contain;
  cursor: pointer;
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