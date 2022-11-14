import { createI18n } from 'vue-i18n';
//import messages from '@intlify/vite-plugin-vue-i18n/messages';


async function loadLocaleMessages() {
    const locales = await import.meta.glob("../locales/*");
    //require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
    let messages = {};
    for (let path in locales) {
        const lang = path.match(/([^\/]+)(?=\.\w+$)/g)[0];
        locales[path]().then((mod) => {
            messages[lang] = mod.default;
        });
    }
    return messages;
}


const i18n = await createI18n({
    legacy: false,
    flatJson: false,
    globalInjection: true,
    locale: 'fr',
    messages: await loadLocaleMessages()
});

export default i18n;