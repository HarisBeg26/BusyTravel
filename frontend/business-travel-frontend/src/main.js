import { createApp } from "vue";
import App from "./App.vue";
import { createI18n } from "vue-i18n";
import router from "./router";
import browsee from '@browsee/web-sdk';
import BrowseePlugin from './plugins/browsee';

// Import PrimeVue
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

// Import locale messages
import en from "@/locales/en.json";
import sl from "@/locales/sl.json";
import bh from "@/locales/bh.json";

// Initialize Browsee for A/B testing analytics
browsee.init({ apiKey: '85fdc052178b978ab4d546170614f5c754a024343dcfe761' });

// Set up i18n instance with locale messages
const i18n = createI18n({
    locale: localStorage.getItem('userLanguage') || "en", // Default language with localStorage support
    fallbackLocale: "en",
    messages: {
        en,
        sl,
        bh
    }
});

const app = createApp(App);

// Use PrimeVue with default configuration
app.use(PrimeVue);

// Use ToastService for notifications
app.use(ToastService);

// Register Tooltip directive
app.directive('tooltip', Tooltip);

// Use Browsee plugin for analytics
app.use(BrowseePlugin);

// Use i18n and router
app.use(i18n);
app.use(router);

app.mount("#app");
