import { createI18n, LocaleMessages, VueMessageType } from 'vue-i18n';
// @ts-ignore
import messages from '@intlify/vite-plugin-vue-i18n/messages';

function loadLocaleMessages(): LocaleMessages<VueMessageType> {
    // unit test --> eviter error "require.context is not a function"
    const locales = (process.env.NODE_ENV !== 'test') && require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i);
    const messages: LocaleMessages<VueMessageType> = {};
    if (locales) {
        locales.keys().forEach((key: string) => {
            const matched = key.match(/([A-Za-z0-9-_]+)\./i);
            if (matched && matched.length > 1) {
                const locale = matched[1];
                messages[locale] = locales(key);
            }
        });
    }
    return messages;
}

const i18n = createI18n({
    legacy: false,
    locale: 'fr-FR',
    messages
});

export default i18n;
