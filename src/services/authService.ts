import axios from 'axios';
import { useStore } from '@/store/user';
import { invoke } from '@tauri-apps/api/tauri';

//export const USER_API_ENDPOINT = `${process.env.VUE_APP_API_BASE_URL}/login`;
export const USER_API_ENDPOINT = `/login`;

export const authService = {

    /**
     * LOGIN action
     * @param {string} passcode
     * @returns {Promise<AxiosResponse<any> | boolean>}
     */
    async login(passcode: string) {
        await invoke("login", { passcode: passcode });
        //POST request to the server
        return await axios.post(USER_API_ENDPOINT, passcode)
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
};