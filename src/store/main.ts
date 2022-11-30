import { acceptHMRUpdate, defineStore } from 'pinia';
import axios, { AxiosResponse } from "axios";
import { authService } from '@/services/authService';

const useStore = defineStore('main', {
    state: () => ({
        /** @type {string|null} */
        /** @type {'all' | 'finished' | 'unfinished'} */
        filter: 'all',
        // type will be automatically inferred to number
        token: '',
        api: process.env.VITE_API_URL as string,
        loading: false,
        logged: false
    }),
    getters: {
        getToken: (state) => state.token,
        isLoading: (state) => state.loading,
        /**
         * Check if a user is logged;
         * @param state
         * @returns {boolean|*}
         */
        isLogged: (state) => state.logged,
        uploadURL: (state) => state.api.concat('/paquet/upload'),
        retrieveURL: (state) => state.api.concat('/paquet/retrieve/')
    },
    actions: {
        async login(passcode: string) {
            this.token = await authService.login(passcode);
            this.logged = true;
            return this.logged
        },
        checkToken() {
            return axios.post('/token/verify', {'token': this.token}).then((response: AxiosResponse) => {
                return response.data;
            });
        }
    },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useStore, import.meta.hot))
}

export { useStore };