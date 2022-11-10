import { open } from '@tauri-apps/api/dialog';
import { appDataDir } from '@tauri-apps/api/path';


export const dialogService = {

    /**
     * Select a directory
     * @returns {}
     */
    async selectDirectory(): Promise<string | string[] | null> {
        // Open a selection dialog for directories
        const selected = await open({
            directory: true,
            multiple: true,
            defaultPath: await appDataDir(),
        });
        if (Array.isArray(selected)) {
            // user selected multiple directories
        } else if (selected === null) {
            // user cancelled the selection
        } else {
            // user selected a single directory
        }
        return selected;
        //await invoke("login", { passcode: passcode });
    },
};