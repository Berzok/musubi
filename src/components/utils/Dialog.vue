<template>

  <div class="mui-modal">
    <div class="mui-modal-dialog">
      <div class="mui-modal-content">
        <div v-if="this.header" class="mui-modal-header">
          <h4 class="modal-title">{{ title }}</h4>
          <button type="button" class="btn btn-close" @click="$emit('close')" aria-label="Close">
            <span class="fa-solid fa-times"></span>
          </button>
        </div>
        <div class="mui-modal-body text-center">
          <p v-if="this.message">{{ message }}</p>

          <div class="d-flex justify-content-center">
            <span class="clipboard">{{ content }}</span>
            <button class="btn btn-clipboard" @click="this.copyToClipboard()">
              <span class="fa-solid fa-clipboard"></span>
            </button>
          </div>
        </div>
        <div class="mui-modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            <span class="fa-solid fa-times"></span>
            {{ this.$t('close') }}
          </button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
    name: 'Dialog',
    emits: ['close'],
    props: {
        content: {
            default: 'contenu',
            type: String
        },
        header: {
            default: true,
            type: Boolean
        },
        message: {
            default: '',
            type: String
        },
        title: {
            default: 'Informations',
            type: String
        }
    },
    methods: {
        copyToClipboard() {
            navigator.clipboard.writeText(this.content);
        }
    },
    computed: {}
});
</script>

<style scoped lang="scss">

.mui-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.mui-modal-dialog {
  display: flex;
  align-items: center;
  max-width: 40%;
  min-height: 80%;
  margin-left: auto;
  margin-right: auto;
}

.mui-modal-content {
  display: flex;
  flex-direction: column;
  background-color: #3f4550;
  border: 2px solid #d479f3;
  border-radius: 6px;
  width: 100%;
}

.mui-modal-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0.25rem;
  border-bottom: 1px solid #fade55;
}

.mui-modal-body {
  flex: 1 1 auto;
  padding: 0.5rem;
}

.mui-modal-footer {
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-top: 1px solid #fade55;
}

.clipboard {
  color: #6169f1;
  padding: 0.4rem;
  font-style: italic;
  font-weight: bold;
  background-color: white;
  border: 2px solid #646cff;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}

.btn-clipboard{
  background-color: rgb(80, 88, 103);
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  transition-property: background-color;
  transition-duration: 0.7s;
}
.btn-clipboard:active{
  background-color: white;
  transition-property: background-color;
  transition-duration: 0.7s;
}
</style>