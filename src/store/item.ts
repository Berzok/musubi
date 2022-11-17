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
        items: [] as Item[],
        current: null as unknown as Item
    }),
    getters: {
        /**
         * Check if a user is logged;
         * @param state
         * @returns {boolean|*}
         */
        hasId: (state) => state.id,
        image: (state) => {
            return state.current.image;
        }
    },
    actions: {
        getEmpty() {
            return {} as Item;
            /*
            return axios.get('/token/verify', {'token': this.token}).then((response: AxiosResponse) => {
                return response.data;
            });
             */
        },
        getById(id: string): Item {
            for (const item of this.items as Item[]) {
                if (item.id === id) {
                    return item;
                }
            }
            console.dir('No item found in store');
            return this.getEmpty();
        },
        async save(item: any) {
            const saved = itemService.save(item);
            if(await saved){
                await this.init();
                return saved;
            }
        },
        async init(): Promise<void> {
            const items = await itemService.loadAll();
            this.$state.items = items.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        }
    },
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(itemStore, import.meta.hot))
}

export { itemStore };