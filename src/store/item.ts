import { acceptHMRUpdate, defineStore } from 'pinia';
import axios, { AxiosResponse } from "axios";
import { authService } from '@/services/authService';
import { itemService } from '@/services/itemService';

const useItem = defineStore('item', {
    state: () => ({
        /** @type {number|string|null} */
        id: null,
        /** @type {'all' | 'finished' | 'unfinished'} */
        items: [],
        // type will be automatically inferred to number
        token: ''
    }),
    getters: {
        getToken: (state) => state.token,
        /**
         * Check if a user is logged;
         * @param state
         * @returns {boolean|*}
         */
        hasId: (state) => state.id
    },
    actions: {
        async login(passcode: string) {
            this.token = await authService.login(passcode);
            return true;
        },
        async get(id: string) {
            return await itemService.get(id);
            /*
            return axios.get('/token/verify', {'token': this.token}).then((response: AxiosResponse) => {
                return response.data;
            });
             */
        },
        async save(item: any){
            return await itemService.save(item);
        }
    },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useItem, import.meta.hot))
}

export { useItem };