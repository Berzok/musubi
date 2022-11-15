import { invoke } from '@tauri-apps/api/tauri';
import { getName } from '@tauri-apps/api/app';
//TODO: replace by appDataDir with new tauri version
import { appDataDir, BaseDirectory, dataDir, dirname, join } from '@tauri-apps/api/path';
import { createDir, exists, FileEntry, readDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import filenamify from 'filenamify';
import { Item, Path } from '@/interfaces/item';
import { useStore } from '@/store/main';
import axios from 'axios';

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

    async send(id: string) {
        const item: Item = await this.get(id);
        const files: Array<any> = [];

        console.dir(item.paths);
        /**
         * Iterating over the saved paths of the Item
         * @var Path path
         **/
        for (const path of item.paths) {
            console.dir(path);
            const isDir: boolean = await invoke('is_directory', {path: path.path});

            //If it's a directory
            if (isDir) {
                await this.sendDirectory(path);

            } else {
                //TODO: Send a single file
            }
        }
    },

    /**
     * Send the files to the given code endpoint
     * @param code
     * @param entries
     */
    async sendFiles(code: number, entries: Array<string>) {
        let fd = new FormData();
        for (const file of entries) {
            const content = await invoke<Uint8Array>('read_file', {path: file});
            const u8 = content;
            console.dir(u8);
            await invoke('write_file', {path: await appDataDir() + 'bob.png', content: u8})
            // const blob = new Blob(content);
            // fd.append('INPUTNAME', content)
            console.dir(content);
            return;
            await axios.post(`send/${code}`, file)
                .then(function (response) {
                    //What is the response status ?
                    const data = response.data;
                    console.dir(data);

                    if (data.status === 1) {
                        return data;
                    } else {
                        return false;
                    }
                }).catch(() => false);
        }
    },

    /**
     * Send a directory over HTTP.
     * @param path
     */
    async sendDirectory(path: Path) {
        const code = useStore().getCode;
        console.dir(code);
        const file = await invoke<Array<string>>('send_directory', {ip: code, path: path.path});
        console.dir(file);
    },

    /**
     *
     * @param item
     */
    async save(item: Item) {
        useStore().loading = true;
        const filename = this.resolveFilename(item.id.toString()).concat('.json');
        const dataPath = await this.getDataPath();
        const filenameWithRelativePath = await join(dataPath, filename);

        if (!(await exists(dataPath, {dir: BaseDirectory.Data}))) {
            await createDir(dataPath, {dir: BaseDirectory.Data, recursive: true});
        }

        item.filename = filename;
        console.dir(item);

        // Create the `$APPDIR/users` directory
        await writeTextFile(filenameWithRelativePath, JSON.stringify(item), {dir: BaseDirectory.Data});
        useStore().loading = false;
        return true;
    },

    /**
     * Get a safe filename from the item name
     * @param name - Name of the item
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

    async filepathFromId(id: string) {
        const filename = this.resolveFilename(id);
        const dataPath = await this.getDataPath();
        return await join(dataPath, filename.concat('.json'));
    },

    async loadAll(): Promise<Item[]> {
        let items: Array<Item> = [];
        const entries = await readDir('data', { dir: BaseDirectory.AppData, recursive: true });
        for (const entry of entries) {
            const item = await readTextFile(entry.path, {dir: BaseDirectory.Data});
            items.push(JSON.parse(item) as unknown as Item);
        }

        return items;
    }
};