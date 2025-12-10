# Dokumentacija A-B testiranja

## ⚙️ Tehnična Implementacija - Browsee SDK

### Status: ✅ IMPLEMENTIRANO

**Orodje**: Browsee (https://browsee.io)  
**API Key**: `85fdc052178b978ab4d546170614f5c754a024343dcfe761`  
**Package**: `@browsee/web-sdk` (npm)  
**Inicializacija**: `src/main.js`  
**Plugin**: `src/plugins/browsee.js`  

### Spremljani Dogodki

| Event Type | Opis | Tracking |
|------------|------|----------|
| `page_view` | Obisk strani | ✅ Implementirano |
| `ab_test_assignment` | Dodelitev variante | ✅ Implementirano |
| `button_click` | Kliki na gumbe | ✅ Implementirano |
| `navigation` | Navigacija med stranmi | ✅ Implementirano |
| `search` | Iskanje | ✅ Implementirano |
| `crud_operation` | CRUD operacije | ✅ Implementirano |
| `time_on_page` | Čas na strani | ✅ Implementirano |
| `feature_usage` | Uporaba funkcij | ✅ Implementirano |

### Dokumentacija
- **Podrobna**: `Browsee_AB_Testing_Navodila.md`
- **Quick Start**: `Browsee_Quick_Start.md`

---

## 1. Argumentacija sprememb

### 1.1. Domača stran: `Home.vue` (Verzija A) vs. `HomeB.vue` (Verzija B)

**Verzija A (obstoječa):**
- **Opis:** Uporablja kartični prikaz za navigacijo do glavnih sekcij (Potovanja, Stroški, Statistika).
- **Prednosti:** Vizualno privlačno, enostavno za razumevanje na prvi pogled.
- **Slabosti:** Zavzame veliko prostora, ni skalabilno za dodajanje novih funkcionalnosti.

**Verzija B (alternativna):**
- **Opis:** Uvede stransko navigacijo (sidebar) in bolj zgoščen "dashboard" pogled z zavihki za nedavne aktivnosti.
- **Sprememba UX vzorca:** Zamenjava "Card-based navigation" z "Sidebar Dashboard" vzorcem.
- **Argumentacija:**
  - **Učinkovitost:** Sidebar omogoča hitrejši dostop do vseh delov aplikacije iz ene točke, brez potrebe po vračanju na domačo stran.
  - **Skalabilnost:** Lažje je dodajati nove menijske postavke v sidebar kot nove kartice.
  - **Informativnost:** Dashboard z zavihki omogoča prikaz več relevantnih informacij (npr. zadnja potovanja in zadnji stroški) na istem zaslonu.
- **Hipoteza:** Uporabniki bodo z verzijo B hitreje opravili naloge, saj bo navigacija bolj direktna.

### 1.2. Seznam potovanj: `TripsList.vue` (Verzija A) vs. `TripsListB.vue` (Verzija B)

**Verzija A (obstoječa):**
- **Opis:** Prikazuje potovanja v tabeli.
- **Prednosti:** Učinkovito za prikaz velikega števila podatkov, enostavno sortiranje in filtriranje.
- **Slabosti:** Na manjših zaslonih postane tabela nepregledna in zahteva horizontalno drsenje. Manj vizualno privlačno.

**Verzija B (alternativna):**
- **Opis:** Uvede kartični (grid) prikaz potovanj.
- **Sprememba UX vzorca:** Zamenjava "Data Table" z "Grid/Card View" vzorcem.
- **Argumentacija:**
  - **Odzivnost:** Kartice se lepše prilagajajo različnim velikostim zaslona (še posebej mobilnim).
  - **Vizualna preglednost:** Vsaka kartica deluje kot samostojna enota, kar omogoča lažje ločevanje med posameznimi potovanji.
  - **Interaktivnost:** Omogoča lažje dodajanje interaktivnih elementov (npr. gumbi za hitra dejanja) na posamezno kartico.
- **Hipoteza:** Uporabniki bodo lažje in hitreje našli želeno potovanje na mobilnih napravah, splošna uporabniška izkušnja pa bo boljša zaradi bolj modernega videza.

## 2. Integracija z orodjem Browsee

### ✅ Status: IMPLEMENTIRANO

**Platforma**: Browsee Analytics (https://browsee.io)  
**API Key**: `85fdc052178b978ab4d546170614f5c754a024343dcfe761`  

### Tehnična Implementacija

1. **Instalacija SDK**:
```bash
npm install @browsee/web-sdk --save
```

2. **Inicializacija** (`src/main.js`):
```javascript
import browsee from '@browsee/web-sdk';
browsee.init({ apiKey: '85fdc052178b978ab4d546170614f5c754a024343dcfe761' });
```

3. **Plugin za Sledenje** (`src/plugins/browsee.js`):
   - `trackPageView()` - Obisk strani
   - `trackButtonClick()` - Kliki
   - `trackNavigation()` - Navigacija
   - `trackSearch()` - Iskanje
   - `trackCRUDOperation()` - CRUD akcije
   - `trackABTestAssignment()` - Dodelitev variante
   - `trackTimeOnPage()` - Čas na strani
   - `trackFeatureUsage()` - Uporaba funkcij

### Konfigurirani Testi

#### Test 1: Home Page (A vs B)
- **URL A**: `/` (Home.vue)
- **URL B**: `/home-b` (HomeVariantB.vue)
- **Test Name**: `home_page_test`
- **Tracked Events**: 
  - Page views, button clicks, navigation, time on page
  - Feature usage (sidebar - samo B)

#### Test 2: Trips List (A vs B)
- **URL A**: `/trips` (TripsList.vue)
- **URL B**: `/trips-b` (TripsListVariantB.vue)
- **Test Name**: `trips_list_test`
- **Tracked Events**:
  - Page views, search, CRUD operations, time on page
  - Feature usage (compact toolbar, breadcrumbs - samo B)

### Dostop do Podatkov

**Browsee Dashboard**: https://browsee.io/app

1. **Session Recordings**: Dashboard → Sessions → Filter by URL
2. **Events Analysis**: Dashboard → Events → Filter by custom events
3. **Heatmaps**: Dashboard → Heatmaps → Select URL
4. **Funnels**: Dashboard → Funnels → Create custom funnel

### Preverba Delovanja

**Lokalno Testiranje**:
```bash
cd frontend/business-travel-frontend
npm run dev
```

**Konzola Check**:
```javascript
// Preveri Browsee inicializacijo
console.log(window._browsee);

// Ročno testiranje
browsee.logEvent('test', { variant: 'A' });
```

**Network Tab**: Filtriraj po "browsee" za API calls

### Več Informacij

- **Podrobna navodila**: `Browsee_AB_Testing_Navodila.md`
- **Quick start**: `Browsee_Quick_Start.md`
- **Browsee Dokumentacija**: https://docs.browsee.io

---

## 3. Prikaz SUS vprašalnika

- **Komponenta:** `SUSQuestionnaire.vue`
- **Jezik:** Vprašanja so v slovenščini.
- **Funkcionalnost:**
  - Prikaže se v modalnem oknu.
  - Vsebuje 10 standardnih SUS vprašanj.
  - Uporabnik ocenjuje na lestvici od 1 do 5.
  - Po oddaji se izračuna končna ocena (0-100) in pošlje v Browsee ter na backend.
  - Zbiranje podatkov je ločeno za vsako verzijo strani (A/B).
