import { open } from '@tauri-apps/api/dialog';
import { appDataDir, dirname } from '@tauri-apps/api/path';
import { Path } from '@/interfaces/item';


export const dialogService = {

    /**
     * Select a directory
     * @returns {}
     */
    async selectDirectory(): Promise<Path | Path[] | null> {
        let paths: Array<Path>|null = [];

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

        console.dir(paths);
        return paths;
        //await invoke("login", { passcode: passcode });
    },
};