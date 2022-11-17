import { DialogFilter, open, OpenDialogOptions } from '@tauri-apps/api/dialog';
import { appDataDir, dirname } from '@tauri-apps/api/path';
import { Path } from '@/interfaces/item';
import { Filter } from '@/enums/filter';

const imageFilter = {
    name: 'Image',
    extensions: ['png', 'jpeg']
}

export const dialogService = {

    /**
     * Select a directory
     * @returns {}
     */
    async selectDirectory(): Promise<Path | Path[] | null> {
        let paths: Array<Path> | null = [];

        // Open a selection dialog for directories
        const selected = await open({
            directory: true,
            multiple: true,
            defaultPath: await appDataDir(),
        });
        if (Array.isArray(selected) && selected.length > 0) {
            // user selected multiple directories
            for (const d of selected) {
                paths.push({
                    id: await dirname(d),
                    path: d
                });
            }
        } else if (selected === null || selected.length === 0) {
            paths = null;
            // user cancelled the selection
        } else {
            // user selected a single file
        }

        return paths;
        //await invoke("login", { passcode: passcode });
    },

    /**
     * Open a selection dialog for a single file
     */
    async selectFile(filters: number[] = []): Promise<string|null> {
        // Open a selection dialog for image files
        let options: OpenDialogOptions = {
            multiple: false
        };
        options.filters = this.resolveFilters(filters);

        const selected = await this.openDialog(options);
        if (selected === null) {
            // user cancelled the selection
        } else {
            // user selected a single file
        }

        console.dir(selected);
        return selected as string|null;
    },

    async openDialog(options: OpenDialogOptions | undefined): Promise<string|string[]|null> {
        return await open(options);
    },

    resolveFilters(filters: number[]) {
        let resolved: DialogFilter[] = [];
        for (const f of filters) {
            switch (f) {
                case Filter.Image:
                    resolved.push(imageFilter);
                    break;
                default:
                    break;
            }
        }
        return resolved;
    }
};