<template>
  <div class="card ml-auto">
    <div class="row">
      <div class="input-group d-flex justify-content-center">
        <div class="input-group-prepend">
          <label class="input-group-text font-weight-bold" id="loginLabel">
            {{ $t('login.login') }}
          </label>
        </div>
        <input v-model="login" id="login"/>
      </div>
    </div>
    <div class="row">
      <div class="input-group d-flex justify-content-center">
        <div class="input-group-prepend">
          <label class="input-group-text font-weight-bold" id="passwordLabel">
            {{ $t('login.password') }}
          </label>
        </div>
        <input v-model="password" id="password" type="password"/>
      </div>
    </div>
    <div class="row">
      <button variant="success" @click="log">{{ $t('authenticate.login') }}</button>
    </div>
  </div>
</template>

<script lang="ts">
import { useToast } from 'vue-toast-notification';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from '@/store/main';
import router, { HOME_PAGE_NAME } from '@/router';

export default defineComponent({
    name: 'Login',
    components: {},
    setup() {
        // Get toast interface
        const toast = useToast();
        const {t, locale} = useI18n();
        const user = useStore();
        return {toast, t, locale, user};
    },
    data() {
        return {
            login: '',
            password: '',
        };
    },
    methods: {
        async log() {
            const isLogged: boolean = await this.user.login('074');
            if (!isLogged) {
                this.toast.error(this.t('authenticate.failMessage'));
                return;
            }
            this.toast.success(`${this.t('authenticate.sucessMessage')} ${this.login}`);
            await router.push({name: HOME_PAGE_NAME});
        },
    },
});
</script>

<style scoped>
.input-group {
    margin-top: 9px;
}

.input-group-prepend {
    min-width: 10%;
}

.input-group-prepend label {
    width: 100%;
    overflow: hidden;
}
</style>
