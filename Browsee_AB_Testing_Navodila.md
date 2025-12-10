# Browsee A/B Testing - Navodila za Uporabo

## 📊 Pregled Integracije

Aplikacija Business Travel Tracker je integrirana z **Browsee** analitičnim orodjem za spremljanje uporabniške izkušnje in A/B testiranje. Browsee omogoča:

- **Session Recording** - Snemanje uporabniških sej
- **Heatmaps** - Toplotni zemljevidi klikov in interakcij
- **Event Tracking** - Sledenje custom dogodkom
- **Funnel Analysis** - Analiza uporabniškega toka
- **A/B Test Analytics** - Primerjava učinkovitosti različic

---

## 🔧 Tehnična Implementacija

### 1. Instalacija Browsee SDK

```bash
npm install @browsee/web-sdk --save
```

### 2. Inicializacija (main.js)

```javascript
import browsee from '@browsee/web-sdk';

// Initialize Browsee
browsee.init({ 
  apiKey: '85fdc052178b978ab4d546170614f5c754a024343dcfe761' 
});
```

### 3. Plugin Struktura

Ustvarjen je plugin `src/plugins/browsee.js` z uporabnimi funkcijami:

- `trackPageView()` - Spremljanje obiskov strani
- `trackButtonClick()` - Spremljanje klikov na gumbe
- `trackNavigation()` - Spremljanje navigacije
- `trackSearch()` - Spremljanje iskanj
- `trackCRUDOperation()` - Spremljanje CRUD operacij
- `trackABTestAssignment()` - Spremljanje dodelitve A/B testa
- `trackTimeOnPage()` - Spremljanje časa na strani
- `trackFeatureUsage()` - Spremljanje uporabe funkcionalnosti

---

## 🧪 Konfigurirani A/B Testi

### Test 1: Home Page (Varianta A vs B)

#### **Varianta A** - `/` (Home.vue)
- **Layout**: Velike kartice v grid postavitvi
- **Navigacija**: Kliki na kartice
- **Trackani dogodki**:
  - `page_view` - Obisk strani
  - `ab_test_assignment` - Dodelitev variante A
  - `button_click` - Kliki na kartice (travels/expenses/charts)
  - `navigation` - Navigacija na druge strani
  - `time_on_page` - Čas prebivanja

#### **Varianta B** - `/home-b` (HomeVariantB.vue)
- **Layout**: Sidebar navigacija + summary kartice
- **Navigacija**: Sidebar quick actions
- **Dodatne funkcije**: Breadcrumbs, Recent Activity
- **Trackani dogodki**:
  - `page_view` - Obisk strani
  - `ab_test_assignment` - Dodelitev variante B
  - `feature_usage` - Uporaba sidebar navigacije
  - `button_click` - Kliki v sidebaru
  - `navigation` - Navigacija na druge strani
  - `time_on_page` - Čas prebivanja

**Primerjalni parametri**:
- Čas do prve interakcije
- Število klikov potrebnih za dostop do funkcije
- Time on page
- Click-through rate na posamezne sekcije

---

### Test 2: Trips List (Varianta A vs B)

#### **Varianta A** - `/trips` (TripsList.vue)
- **Layout**: Hero sekcija + velika tabela
- **UI elementi**: Ločene sekcije za header, search, actions
- **Trackani dogodki**:
  - `page_view` - Obisk strani
  - `ab_test_assignment` - Dodelitev variante A
  - `search` - Iskanje po trips
  - `button_click` - Dodajanje, urejanje, brisanje
  - `crud_operation` - Create, Update, Delete operacije
  - `time_on_page` - Čas prebivanja

#### **Varianta B** - `/trips-b` (TripsListVariantB.vue)
- **Layout**: Kompaktna toolbar + optimizirana tabela
- **UI elementi**: Združena toolbar vrstica (breadcrumb + search + actions)
- **Dodatne funkcije**: Sticky toolbar, breadcrumbs, več vrstic na stran
- **Trackani dogodki**:
  - `page_view` - Obisk strani
  - `ab_test_assignment` - Dodelitev variante B
  - `feature_usage` - Uporaba compact toolbar, breadcrumbs
  - `search` - Iskanje (compact search)
  - `button_click` - Dodajanje, urejanje, brisanje (compact buttons)
  - `crud_operation` - Create, Update, Delete operacije
  - `time_on_page` - Čas prebivanja

**Primerjalni parametri**:
- Task completion rate (uspešnost dodajanja/urejanja trip-a)
- Število uporabljenih paginacijskih akcij
- Uporaba search funkcionalnosti
- Čas do prve CRUD operacije
- Splošna produktivnost (operacije na minuto)

---

## 📈 Spremljani Dogodki (Event Schema)

### 1. Page View Event
```javascript
{
  event_name: 'page_view',
  page_name: 'Home' | 'TripsList',
  variant: 'A' | 'B',
  timestamp: ISO8601
}
```

### 2. Button Click Event
```javascript
{
  event_name: 'button_click',
  button_name: 'go_to_travels_card' | 'add_trip_button' | ...,
  page_name: 'Home' | 'TripsList',
  variant: 'A' | 'B',
  timestamp: ISO8601
}
```

### 3. Navigation Event
```javascript
{
  event_name: 'navigation',
  from_page: 'Home',
  to_page: 'TripsList',
  variant: 'A' | 'B',
  timestamp: ISO8601
}
```

### 4. Search Event
```javascript
{
  event_name: 'search',
  search_query: 'london',
  page_name: 'TripsList',
  variant: 'A' | 'B',
  timestamp: ISO8601
}
```

### 5. CRUD Operation Event
```javascript
{
  event_name: 'crud_operation',
  operation_type: 'create' | 'update' | 'delete',
  entity_type: 'trip' | 'expense',
  page_name: 'TripsList',
  variant: 'A' | 'B',
  timestamp: ISO8601
}
```

### 6. A/B Test Assignment Event
```javascript
{
  event_name: 'ab_test_assignment',
  test_name: 'home_page_test' | 'trips_list_test',
  variant: 'A' | 'B',
  timestamp: ISO8601
}
```

### 7. Time on Page Event
```javascript
{
  event_name: 'time_on_page',
  page_name: 'Home' | 'TripsList',
  variant: 'A' | 'B',
  duration_seconds: 45,
  timestamp: ISO8601
}
```

### 8. Feature Usage Event
```javascript
{
  event_name: 'feature_usage',
  feature_name: 'sidebar_navigation' | 'compact_toolbar' | 'breadcrumb_navigation',
  page_name: 'Home' | 'TripsList',
  variant: 'A' | 'B',
  timestamp: ISO8601
}
```

---

## 🎯 Kako Uporabljati Browsee Dashboard

### 1. Prijava v Browsee

1. Obiščite [https://browsee.io/app](https://browsee.io/app)
2. Prijavite se z vašim računom
3. Izberite projekt "Business Travel Tracker"

### 2. Session Recordings

**Kako dostopati**:
- Dashboard → Sessions
- Filtrirajte po URL-ju:
  - Varianta A Home: `filter by url contains "/"`
  - Varianta B Home: `filter by url contains "/home-b"`
  - Varianta A Trips: `filter by url contains "/trips"`
  - Varianta B Trips: `filter by url contains "/trips-b"`

**Kaj opazovati**:
- Vzorce navigacije
- Težave pri uporabi
- Mesta kjer uporabniki obtičijo
- Prekinjene akcije (abandon rate)

### 3. Events Analysis

**Kako dostopati**:
- Dashboard → Events
- Uporabite custom events za filtriranje

**Pomembni filtri**:
```
Event: ab_test_assignment
Property: test_name = "home_page_test"
Property: variant = "A" or "B"
```

**Metrike za primerjavo**:
- Število dogodkov po variantah
- Conversion rate (npr. % uporabnikov ki izvedejo CRUD operacijo)
- Average time on page po variantah
- Feature usage rate

### 4. Funnels

**Primer funnel-a za Home Page test**:
1. Page View (Home - variant A/B)
2. Button Click (any navigation button)
3. Navigation (to target page)

**Primer funnel-a za Trips List test**:
1. Page View (TripsList - variant A/B)
2. Button Click (add_trip_button)
3. CRUD Operation (create trip)

**Kako ustvariti funnel**:
- Dashboard → Funnels → Create New Funnel
- Dodajte steps z custom eventi
- Filtrirajte po `variant` property za primerjavo A/B

### 5. Heatmaps

**Kako dostopati**:
- Dashboard → Heatmaps
- Izberite URL strani

**Kaj analizirati**:
- Click heatmaps: Kje uporabniki največ klikajo
- Scroll maps: Do kod se uporabniki scrollajo
- Move maps: Gibanje miške (vzorci obiska)

**Primerjava A/B**:
- Ustvarite ločene heatmaps za vsako varianto
- Primerjajte click patterns
- Identificirajte "dead zones" (območja brez interakcij)

---

## 📊 Priporočene Metrike za Analizo

### Home Page Test

| Metrika | Varianta A | Varianta B | Cilj |
|---------|-----------|-----------|------|
| Average Time on Page | ? sec | ? sec | Nižji = bolj efektivno |
| Click-through Rate (CTR) | ?% | ?% | Višji = več interakcij |
| Navigation Success Rate | ?% | ?% | Višji = manj abandon |
| Feature Discovery Rate | - | ?% | Sidebar usage |
| Bounce Rate | ?% | ?% | Nižji = bolj engaging |

### Trips List Test

| Metrika | Varianta A | Varianta B | Cilj |
|---------|-----------|-----------|------|
| Task Completion Time | ? sec | ? sec | Nižji = bolj efektivno |
| CRUD Operations per Session | ? ops | ? ops | Višji = bolj produktivno |
| Search Usage Rate | ?% | ?% | Primerjava engagement |
| Pagination Clicks | ? clicks | ? clicks | Nižji = manj klikov |
| Average Time to First Action | ? sec | ? sec | Nižji = hitrejši dostop |

---

## 🔍 Preverjanje Delovanja

### 1. Lokalno Testiranje

**Zagon aplikacije**:
```bash
cd frontend/business-travel-frontend
npm run dev
```

**Odprite konzolo v brskalniku** (F12) in preverite:

1. **Browsee inicializacija**:
```javascript
// Preverite če je browsee object dostopen
console.log(window._browsee);
```

2. **Ročno testiranje dogodkov**:
```javascript
// V konzoli lahko ročno sprožite dogodek
browsee.logEvent('test_event', { 
  test: 'manual', 
  variant: 'A' 
});
```

3. **Sledenje v Network tabu**:
- Filtrirajte po `browsee`
- Preverite API calls na Browsee backend
- Status koda 200 = uspešno

### 2. Testiranje Posameznih Variant

**Home Page**:
1. Obiščite `http://localhost:5173/` (Varianta A)
2. Kliknite na "Travels" kartico
3. Preverite v Browsee dashboard če se dogodki prikazujejo

4. Obiščite `http://localhost:5173/home-b` (Varianta B)
5. Uporabite sidebar navigacijo
6. Preverite če se trackajo `feature_usage` dogodki

**Trips List**:
1. Obiščite `http://localhost:5173/trips` (Varianta A)
2. Dodajte nov trip
3. Preverite `crud_operation` dogodke

4. Obiščite `http://localhost:5173/trips-b` (Varianta B)
5. Uporabite search funkcionalnost
6. Preverite `search` in `feature_usage` dogodke

### 3. Produkcijsko Testiranje

Po deployment-u na Vercel:
1. Obiščite produkcijski URL
2. Izvedite tipične uporabniške scenarije
3. Počakajte 5-10 minut za sinhronizacijo podatkov
4. Preverite Browsee dashboard

---

## 🚀 Deployment in Uporaba v Produkciji

### 1. Environment Configuration

V produkciji je API ključ že vključen v kodo. Če želite uporabiti drugačen ključ:

```javascript
// src/main.js
browsee.init({ 
  apiKey: process.env.VITE_BROWSEE_API_KEY || '85fdc052178b978ab4d546170614f5c754a024343dcfe761'
});
```

Dodajte v `.env`:
```
VITE_BROWSEE_API_KEY=your_api_key_here
```

### 2. Routing Strategy za A/B Testiranje

**Trenutna implementacija** uporablja ločene URL-je:
- `/` vs `/home-b`
- `/trips` vs `/trips-b`

**Prednosti**:
✅ Enostavno testiranje (ročna dodelitev)
✅ Ni potrebe po dodatni logiki
✅ SEO friendly (lahko uporabite canonical tags)

**Alternativa - Random Assignment**:

Če želite avtomatsko dodeljevanje, dodajte v `router/index.js`:

```javascript
router.beforeEach((to, from, next) => {
  // Random A/B assignment
  if (to.path === '/' && !localStorage.getItem('home_variant')) {
    const variant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem('home_variant', variant);
    
    if (variant === 'B') {
      next('/home-b');
      return;
    }
  }
  
  next();
});
```

### 3. Smernice za Trajanje Testa

**Minimalno trajanje**: 2 tedna
**Minimalno število sej**: 100 po variantah (200 skupaj)

**Statistična signifikantnost**:
- Confidence level: 95%
- Minimum detectable effect: 10%

**Uporabite Browsee-jev vgrajeni A/B test calculator** za določitev trajanja.

---

## 📝 Dodatna Navodila za Druge Platforme

### Hotjar Integracija (Alternativa)

Če bi želeli uporabiti Hotjar namesto Browsee:

1. **Instalacija**:
```html
<!-- Dodajte v index.html -->
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_SITE_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

2. **Custom Events**:
```javascript
// src/plugins/hotjar.js
export const trackHotjarEvent = (eventName) => {
  if (window.hj) {
    window.hj('event', eventName);
  }
};
```

### Microsoft Clarity Integracija (Alternativa)

1. **Instalacija**:
```html
<!-- Dodajte v index.html -->
<script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "YOUR_PROJECT_ID");
</script>
```

2. **Custom Tags**:
```javascript
// src/plugins/clarity.js
export const setCustomTag = (key, value) => {
  if (window.clarity) {
    window.clarity("set", key, value);
  }
};

// Usage
setCustomTag("ab_test_variant", "B");
```

---

## 🔐 Varnost in GDPR

### Cookie Consent

Browsee uporablja cookies za session tracking. Priporočamo implementacijo cookie consent bannera:

```javascript
// src/plugins/cookieConsent.js
export const initBrowseeWithConsent = () => {
  const consent = localStorage.getItem('analytics_consent');
  
  if (consent === 'true') {
    browsee.init({ apiKey: 'YOUR_API_KEY' });
  }
};
```

### Privacy Policy

Posodobite Privacy Policy z informacijami o:
- Uporabi Browsee analytics
- Session recording
- Uporabniških podatkih ki se zbirajo
- Pravici do opt-out

---

## 📞 Podpora in Troubleshooting

### Pogosta Vprašanja

**Q: Dogodki se ne prikazujejo v Browsee dashboard?**
A: Preverite:
- Network tab za Browsee API calls
- Console za napake
- Počakajte 5-10 minut (lahko traja nekaj časa)

**Q: Session recording ne deluje?**
A: Preverite:
- Ali je domena whitelisted v Browsee settings
- Ali imate session recording enabled v projektu
- Browser extensions (ad blockers) lahko blokirajo

**Q: Kako restiram A/B test za posameznega uporabnika?**
A: Izbrišite localStorage:
```javascript
localStorage.removeItem('home_variant');
localStorage.removeItem('trips_variant');
```

### Kontakt

- **Browsee Support**: support@browsee.io
- **Dokumentacija**: https://docs.browsee.io
- **API Reference**: https://docs.browsee.io/api-reference

---

**Zadnja posodobitev**: 10. december 2025  
**Verzija**: 1.0  
**Status**: ✅ Aktivno
