import { convertFileSrc, invoke } from '@tauri-apps/api/tauri';
//TODO: replace by appDataDir with new tauri version
import { appDataDir, BaseDirectory, basename, join } from '@tauri-apps/api/path';
import {
    createDir,
    exists,
    readBinaryFile,
    readDir,
    readTextFile,
    removeFile,
    writeTextFile
} from '@tauri-apps/api/fs';
import filenamify from 'filenamify';
import { Item, Path } from '@/interfaces/item';
import { useStore } from '@/store/main';
import axios from 'axios';
import { useItem } from '@/store/item';
import { dialogService } from '@/services/dialog/dialogService';

//export const USER_API_ENDPOINT = `${process.env.VUE_APP_API_BASE_URL}/login`;
export const USER_API_ENDPOINT = `/login`;

export const itemService = {

    /**
     * Get an item by its id
     * @param {string} id
     * @returns {Promise<AxiosResponse<any> | boolean>}
     */
    async get(id: string): Promise<Item> {
        try {
            const path = await this.filepathFromId(id);
            const text = await readTextFile(path, {dir: BaseDirectory.Data});
            return JSON.parse(text);
        } catch (error) {
            console.log(error);
            return new Promise((resolve, reject) => {
                return resolve({
                    id: '63452764b435ce04a3c414a1',
                    name: "Fate/Stay Night",
                    image: "http://127.0.0.1:1420/src/assets/katawa_shoujo.png",
                    filename: "",
                    paths: [
                        {
                            id: 'pf',
                            path: "C:\\Users\\u.friedrich\\Pictures\\pf"
                        }
                    ],
                    about: "Consectetur sint anim magna elit sunt est velit tempor labore minim incididunt nisi ullamco nisi. Esse ullamco dolore aute deserunt reprehenderit eiusmod qui. Nulla sit incididunt magna cillum id et nostrud fugiat ipsum est do. Laboris nulla amet ex nisi exercitation cupidatat aliqua sint consectetur ea.\r\n",
                    tracked: true,
                    synchronised: false
                } as unknown as Item);
            })
        }
    },

    /**
     * Upload a tarball over HTTP to the backend
     * @param id
     */
    async send(id: string) {
        const item: Item = await this.get(id);
        console.log(useStore().uploadURL);

        return await invoke<string>('send_item', {ip: useStore().uploadURL, name: item.name, itemPaths: item.paths});
    },

    async retrieve(id: string, code: string) {
        const item: Item = await this.get(id);
        const retrieveIp: string = useStore().retrieveURL.concat(code);

        return await invoke<string>('retrieve_item', {ip: retrieveIp, itemPaths: item.paths});
    },

    /**
     * Save the configuration of an item as json, and updates the stored image if needed
     * @param item
     */
    async save(item: Item) {
        useStore().loading = true;
        if (!item.id) {
            item.id = crypto.randomUUID().replace(/-/g, "");
        }

        const itemDataPath = await this.getItemDataPath(item.id);
        const filename = this.resolveFilename(item.id.toString()).concat('.json');
        const filenameWithRelativePath = await join(itemDataPath, filename);
        if (!(await exists(itemDataPath, {dir: BaseDirectory.Data}))) {
            await createDir(itemDataPath, {dir: BaseDirectory.Data, recursive: true});
        }

        if (useItem().imageHasChanged) {
            console.dir(useItem().newImage);
            item.image = await this.updateImage(useItem().newImage, item);
        }

        // Create the `$APPDIR/users` directory
        await writeTextFile(filenameWithRelativePath, JSON.stringify(item), {dir: BaseDirectory.Data});
        useStore().loading = false;
        return true;
    },


    async updateImage(newImage: string, item: Item): Promise<string> {
        const itemPath = await this.getItemDataPath(item.id);
        const imageName = await basename(newImage);

        const u8 = await invoke<Uint8Array>('read_file', {path: newImage});
        const destination = await join(itemPath, imageName);

        const removed = removeFile(await join(itemPath, await basename(item.image)));

        await invoke('write_file', {path: destination, content: u8}).then(async () => {
            await invoke('optimise_image', {path: destination});
        });

        useItem().newImage = '';
        return destination;
    },

    /**
     * Get a safe filename from a string
     * @param name - String to process
     * @return The filename
     */
    resolveFilename(name: string): string {
        name = name.replace(/\s/g, "_");
        return filenamify(name.toLowerCase(), {replacement: '-'});
    },

    /**
     * Returns the data path (something like 'musubi/data
     * @param relative
     */
    async getDataPath(relative: boolean = true): Promise<string> {
        return await join(await appDataDir(), 'data');
    },

    /**
     * Get the path of the item directory, something like $APPDATA/data/{ID}/
     * @param id - Id de l'item
     * @returns $APPDATA/data/{ID}/
     */
    async getItemDataPath(id: string): Promise<string> {
        return await join(await this.getDataPath(), id.toString());
    },

    async filepathFromId(id: string) {
        const filename = this.resolveFilename(id);
        const dataPath = await this.getItemDataPath(id);
        return await join(dataPath, filename.concat('.json'));
    },

    async readFile(path: string) {
        return await readBinaryFile(path);
    },

    /**
     * Load all items in APPDATA folder and returns them as an array of Item
     * @return Promise<Item[]>
     */
    async loadAll(): Promise<Item[]> {
        let items: Array<Item> = [];
        const entries = await readDir('data', {dir: BaseDirectory.AppData, recursive: true});
        for (const entry of entries) {
            const jsonPath = await join(entry.path, entry.name + '.json');
            const rawItem = await readTextFile(jsonPath, {dir: BaseDirectory.Data});
            const item: Item = JSON.parse(rawItem);
            // if (item.image.length > 0) {
            //     item.image = convertFileSrc(item.image);
            // }
            items.push(item);
        }

        return items;
    },

    async getImageSrcFromItem(item: Item) {
        const itemDataPath = await this.getItemDataPath(item.id);
        return convertFileSrc(await join(itemDataPath, item.image));
    }
};