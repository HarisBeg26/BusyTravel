# A/B Testiranje - Poročilo o Alternativnih Različicah Strani

## Pregled Implementacije

V okviru A/B testiranja smo razvili **dve alternativni različici obstoječih strani** aplikacije Business Travel Tracker. Vsaka različica uporablja različne UX vzorce in pristope za izboljšanje uporabniške izkušnje.

---

## 1. Home Page - Varianta B (Sidebar Navigacija)

### 📍 URL Naslov
- **Originalna stran**: `/` (Home.vue)
- **Varianta B**: `/home-b` (HomeVariantB.vue)

### 🎯 Implementirane Spremembe

#### 1.1 Sidebar Navigacija
**Originalna stran** uporablja **3 velike kartice** v grid postavitvi za navigacijo.

**Varianta B** implementira:
- **Sidebar s hitrim dostopom** (Quick Actions) na levi strani
- **Breadcrumb navigacija** na vrhu strani
- **Kompaktnejše akcijske elemente** v sidebar-u
- **Recent Activity sekcijo** za dodatno kontekstualno navigacijo

#### 1.2 Reorganizacija Vsebine
**Varianta B** dodaja:
- **Summary kartice** s statističnimi podatki (Active Trips, Total Expenses, Statistics)
- **Getting Started informacijski panel** s nasveti za uporabnike
- **Dvostolpčni layout**: sidebar (350px) + main content

#### 1.3 Vizualne Spremembe
- Svetla tema namesto temne gradient ozadje
- Manjši hero banner
- Več informacijske gostote
- Boljša organizacija prostora

### 📊 Argumentacija Sprememb

**Prednosti Variante B:**

1. **Zmanjšanje števila klikov**: 
   - Sidebar omogoča direkten dostop do vseh funkcij brez scrollanja
   - Quick actions so vedno vidni v stranski vrstici
   
2. **Kontekstualna navigacija**:
   - Breadcrumbs omogočajo uporabnikom jasno razumevanje trenutne lokacije
   - Recent Activity prikaz omogoča hitro navigacijo do zadnjih aktivnosti
   
3. **Boljša uporaba prostora**:
   - Sidebar ne zaseda vertikalnega prostora
   - Main content lahko prikaže več informacij (summary cards + informacijski panel)
   
4. **Informacijska gostota**:
   - Summary kartice prikazujejo ključne statistike takoj na domači strani
   - Uporabniki lahko hitreje ocenijo stanje svojih potovanj in stroškov

5. **Skalabilnost**:
   - Sidebar lahko enostavno razširimo z novimi funkcijami
   - Ohranja konzistentno strukturo ne glede na število funkcij

**Potencialne Slabosti:**
- Zahteva več horizontalnega prostora (manj primerno za mobilne naprave)
- Kompleksnejša struktura lahko zmede nove uporabnike

---

## 2. Trips List Page - Varianta B (Kompaktni Pogled)

### 📍 URL Naslov
- **Originalna stran**: `/trips` (TripsList.vue)
- **Varianta B**: `/trips-b` (TripsListVariantB.vue)

### 🎯 Implementirane Spremembe

#### 2.1 Odstranitev Hero Sekcije
**Originalna stran** uporablja veliko hero sekcijo z gradientom (padding: 3rem).

**Varianta B**:
- Popolnoma odstranjena hero sekcija
- Nadomeščena s **kompaktno toolbar vrstico**
- Prihranek ~150-200px vertikalnega prostora

#### 2.2 Združena Orodna Vrstica
**Originalna stran** ima ločene sekcije za:
- Hero z naslovom
- Card header z gumbi
- Search polje v svoji sekciji

**Varianta B** združi vse v **eno orodjarno vrstico**:
- Breadcrumb + naslov + search + akcijski gumbi v eni vrstici
- Sticky positioning (top: 80px) za stalno dostopnost
- Horizontalna razporeditev z flexbox

#### 2.3 Optimizacija Tabele
**Varianta B**:
- Povečano število vrstic na stran (15 namesto 10)
- Dodana "empty state" z ikono in pozivom k akciji
- Bolj kompaktni gumbi (text style namesto filled)
- Izboljšan paginator z več opcijami (15, 25, 50 vrstic)

#### 2.4 Vizualne Spremembe
- Svetla tema (white background) namesto temne
- Manjši padding in margin vrednosti
- Subtilnejše hover efekti
- Bolj "data-driven" pristop

### 📊 Argumentacija Sprememb

**Prednosti Variante B:**

1. **Optimizacija Vertikalnega Prostora**:
   - Odstranitev hero sekcije prihrani ~200px
   - Uporabniki vidijo več vrstic tabele brez scrollanja
   - Pomembno za uporabnike z veliko podatki

2. **Združena Orodna Vrstica**:
   - Vse kontrole (search, filter, add) na enem mestu
   - Zmanjšanje vertikalne razpršenosti UI elementov
   - Sticky toolbar omogoča dostop do kontrolnikov med scrollanjem

3. **Poenostavljen Uporabniški Tok**:
   - Manj vizualnih elementov -> manj vizualnega hrupa
   - Fokus na vsebini (podatkih v tabeli)
   - Hitrejše iskanje in navigacija

4. **Izboljšana Produktivnost**:
   - Več vrstic na stran (15 vs 10) = manj klikanja za paginacijo
   - Breadcrumb navigacija omogoča hitro vračanje
   - Kompaktnejši gumbi zavzemajo manj prostora

5. **Profesionalen Videz**:
   - Svetla tema je bolj primerna za "business" aplikacije
   - Podobno orodjem kot Google Workspace, Notion, Airtable
   - Manj "flashy", bolj "serious" pristop

**Potencialne Slabosti:**
- Manj vizualno privlačna za nove uporabnike
- Izguba "hero" sekcije lahko zmanjša vizualni impact
- Toolbar lahko postane prenatrpan na manjših zaslonih

---

## 3. Tehnična Implementacija

### 3.1 Routing Konfiguracija

Dodali smo nove route v `router/index.js`:

```javascript
{
    path: '/home-b',
    name: 'HomeVariantB',
    component: HomeVariantB,
},
{
    path: '/trips-b',
    name: 'TripsListVariantB',
    component: TripsListVariantB,
}
```

### 3.2 Komponente

**Nove Vue komponente:**
- `HomeVariantB.vue` - Alternativna domača stran s sidebar navigacijo
- `TripsListVariantB.vue` - Alternativna trips list stran s kompaktnim pogledom

**Uporabljene PrimeVue komponente:**
- `Breadcrumb` - Za navigacijsko pot
- `Divider` - Za vizualno ločevanje sekcij
- Obstoječe: `Card`, `Button`, `DataTable`, `Column`, `InputText`, `Tag`

### 3.3 Ohranjanje Funkcionalnosti

Obe varianti **ohranjata vso funkcionalnost** originalnih strani:
- CRUD operacije (Create, Read, Update, Delete)
- Iskanje in filtriranje
- Sortiranje
- Paginacija
- Modalni dialogi
- Responsive design

---

## 4. A/B Testiranje - Navodila za Uporabo

### 4.1 Dostop do Variant

**Varianta A (Originalna):**
- Domača stran: `http://localhost:5173/`
- Trips List: `http://localhost:5173/trips`

**Varianta B (Nova):**
- Domača stran: `http://localhost:5173/home-b`
- Trips List: `http://localhost:5173/trips-b`

### 4.2 Metrike za Merjenje

**Za Home Page:**
- Čas do prvega klika na navigacijski element
- Število klikov potrebnih za dostop do funkcije
- Bounce rate (odstotek uporabnikov, ki takoj zapustijo stran)
- Uporaba sidebar vs. kartični navigaciji

**Za Trips List:**
- Čas do prvega interakcije s tabelo
- Število uporabljenih paginacijskih akcij
- Uporaba search funkcionalnosti
- Task completion rate (uspešnost dodajanja/urejanja trip-a)

### 4.3 Priporočene Testne Skupine

- **Skupina A**: 50% uporabnikov -> originalne strani
- **Skupina B**: 50% uporabnikov -> nove variante

---

## 5. Zaključek

Implementirali smo **dve smiselni alternativni različici** z značilnimi UX spremembami:

1. **Home Page Varianta B**: Uvedba sidebar navigacije, breadcrumbs, in reorganizacija vsebine
2. **Trips List Varianta B**: Odstranitev hero sekcije, združena toolbar vrstica, optimizacija prostora

Obe spremembi temeljita na **dokazanih UX principih**:
- Zmanjšanje števila klikov
- Optimizacija prostora
- Kontekstualna navigacija
- Izboljšana informacijska arhitektura

Variante so **dostopne na različnih URL naslovih** in omogočajo **nadzorovano A/B testiranje** z uporabniki.

---

## 6. Naslednji Koraki

1. **Deployment na produkcijsko okolje** (Vercel/Netlify)
2. **Implementacija Analytics tracking** (Google Analytics, Mixpanel)
3. **Zbiranje uporabniških metrik** (min. 2 tedna)
4. **Statistična analiza rezultatov** (t-test, confidence intervals)
5. **Odločitev o končni različici** na podlagi podatkov

---

**Datum priprave**: 10. december 2025  
**Avtor**: GitHub Copilot  
**Verzija**: 1.0
