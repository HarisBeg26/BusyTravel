import { createApp } from "vue";
import App from "./App.vue";
import { createI18n } from "vue-i18n";
import router from "./router"; // If you have a router setup

// Import locale messages
import en from "@/locales/en.json";
import sl from "@/locales/sl.json";
import bs from "@/locales/bh.json";

// Set up i18n instance with locale messages
const i18n = createI18n({
    locale: "en", // Default language
    fallbackLocale: "en", // Fallback language if the current language is missing translations
    messages: {
        en, // English translations
        sl, // Slovenian translations
        bs, // Bosnian translations
    },
});

const app = createApp(App);

// Use i18n and router
app.use(i18n);
app.use(router);

app.mount("#app");
