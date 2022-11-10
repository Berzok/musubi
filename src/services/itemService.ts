import { invoke } from '@tauri-apps/api/tauri';
import { getName } from '@tauri-apps/api/app';
//TODO: replace by appDataDir with new tauri version
import { appDataDir, BaseDirectory, dataDir, join } from '@tauri-apps/api/path';
import { createDir, exists, FileEntry, readDir, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import filenamify from 'filenamify';
import { Item } from '@/interfaces/item';
import { useStore } from '@/store/user';

//export const USER_API_ENDPOINT = `${process.env.VUE_APP_API_BASE_URL}/login`;
export const USER_API_ENDPOINT = `/login`;

export const itemService = {

    /**
     * Get an item by its id
     * @param {string} id
     * @returns {Promise<AxiosResponse<any> | boolean>}
     */
    async get(id: string): Promise<Item> {
        console.dir(await appDataDir());
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
                        "C:\\Users\\u.friedrich\\Pictures\\pf"
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
        for (const path of item.paths) {
            const isDir: boolean = await invoke('is_directory', {path: path});
            if (isDir) {
                const entries = await invoke('directory_content', {path: path});
                console.dir(entries);
                // this.processEntries(entries);
            }
            console.dir(isDir);
        }
    },

    processEntries(entries: Array<FileEntry>) {
        for (const entry of entries) {
            console.log(`Entry: ${entry.path}`);
            if (entry.children) {
                this.processEntries(entry.children)
            }
        }
    },

    async sendFiles(files: Array<any>) {
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
        if (relative) {
            return await join(await appDataDir(), 'data');
        } else {
            return await join(await appDataDir(), 'data');
        }
    },

    async filepathFromId(id: string) {
        const filename = this.resolveFilename(id);
        const dataPath = await this.getDataPath();
        return await join(dataPath, filename.concat('.json'));
    }
};