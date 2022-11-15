import { acceptHMRUpdate, defineStore } from 'pinia';
import { authService } from '@/services/authService';
import { itemService } from '@/services/itemService';
import { Item } from '@/interfaces/item';

const itemStore = defineStore('item', {
    state: () => ({
        /** @type {number|string|null} */
        id: null,
        /** @type {'all' | 'finished' | 'unfinished'} */
        // type will be automatically inferred to number
        bob: [],
        /** @type {Item[]} */
        items: [] as Item[]
    }),
    getters: {
        /**
         * Check if a user is logged;
         * @param state
         * @returns {boolean|*}
         */
        hasId: (state) => state.id
    },
    actions: {
        async get(id: string) {
            return await itemService.get(id);
            /*
            return axios.get('/token/verify', {'token': this.token}).then((response: AxiosResponse) => {
                return response.data;
            });
             */
        },
        async save(item: any) {
            return await itemService.save(item);
        },
        async init(): Promise<void> {
            this.$state.items = await itemService.loadAll();
        }
    },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(itemStore, import.meta.hot))
}

export { itemStore };