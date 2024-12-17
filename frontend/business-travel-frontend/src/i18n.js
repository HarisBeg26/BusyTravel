import {createI18n} from "vue-i18n";
import en from "./locales/en.json";
import bh from "./locales/bh.json";
import sl from "./locales/sl.json";

const messages = {
    en,
    bh,
    sl
}

const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
});

export default i18n;