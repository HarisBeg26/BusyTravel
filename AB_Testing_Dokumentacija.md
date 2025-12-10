# A-B Testiranje Business Travel Tracker Aplikacije

## Pregled implementacije

Implementiran je bil sistem A-B testiranja z dvema alternativnima oblikama uporabniškega vmesnika za Business Travel Tracker aplikacijo. Sistem naključno razdeli uporabnike na dve skupini in jim prikaže različno verzijo aplikacije.

## Alternativni oblikovalski vzorci

### 1. Domača stran (Home.vue vs HomeB.vue)

#### Verzija A (Home.vue) - Kartični prikaz
- **Opis**: Tradicionalni kartični prikaz z vsebino organizirano v tri velike kartice
- **UX vzorci**: Grid layout, kartice s hover efekti, centralizirani pristop

#### Verzija B (HomeB.vue) - Sidebar navigacija z aktivnostmi
- **Opis**: Alternativna oblika z stransko navigacijo in zavihki za nedavne aktivnosti
- **UX vzorci**: Sidebar navigacija, breadcrumb navigation, tabbed interface, dashboard pristop

**Argumentacija sprememb:**
1. **Sidebar navigacija** namesto kartičnega prikaza omogoča hitrejši dostop do funkcionalnosti
2. **Breadcrumb navigacija** izboljša orientacijo uporabnika v aplikaciji
3. **Tabovi z nedavnimi aktivnostmi** omogočajo hitrejši pregled nad nedavnim delom
4. **Dashboard pristop** s hitrim pregledom števila potovanj/stroškov daje boljši občutek za obseg podatkov
5. **Hitre akcije** v sidebar-u zmanjšujejo število klikov za pogoste naloge

### 2. Seznam potovanj (TripsList.vue vs TripsListB.vue)

#### Verzija A (TripsList.vue) - Tabelarni prikaz
- **Opis**: Standardni DataTable z vrsticami in stolpci
- **UX vzorci**: Tabelarni prikaz, klasična paginacija

#### Verzija B (TripsListB.vue) - Kartični grid prikaz
- **Opis**: Grid layout s karticami za vsako potovanje
- **UX vzorci**: Card-based interface, visual hierarchy, improved mobile responsiveness

**Argumentacija sprememb:**
1. **Kartični prikaz** je bolj vizualno privlačen in lažji za skeniranje
2. **Boljša mobilna odzivnost** - kartice se bolje prilagajajo različnim velikostim zaslonov
3. **Vizualna hierarhija** - pomembne informacije so bolj izpostavljene
4. **Status indikatorji** s barvnimi oznakami omogočajo hitrejše razpoznavanje stanja potovanj
5. **Hover efekti** in animacije izboljšajo interaktivnost
6. **Datum razpon vizualizacija** z ikonami omogoča hitrejše razumevanje trajanja potovanja

## Tehnična implementacija

### A-B Testing Service
```javascript
// Ključne funkcionalnosti:
- Naključna dodelitev uporabnikov v skupine A/B (50/50 razdelitev)
- Sledenje dogodkov preko Browsee platforme
- Lokalno shranjevanje sesije uporabnika
- API za analizo podatkov
```

### Router konfiguracija
```javascript
// Dinamično usmerjanje na podlagi skupine:
component: () => {
    const variant = abTestingService.getUserVariant('home');
    return variant === 'B' ? HomeB : Home;
}
```

### Analytics tracking
- Sledenje ogledov strani
- Sledenje klikov na gumbov
- Sledenje pošiljanja forumulorjev
- Sledenje SUS vprašalnika

## SUS vprašalnik

Implementiran je bil SUS (System Usability Scale) vprašalnik v slovenščini z 10 standardnimi vprašanji. Vprašalnik se pojavi kot modalni dialog z možnostjo ocene od 1 do 5.

**Funkcionalnosti:**
- Avtomatsko računanje SUS ocene (0-100)
- Sledenje odgovorov glede na A-B skupino
- Slovenska lokalizacija
- Responsive design
- Povezava z analytics platformo

## Browzee integracija

Aplikacija je integrirana z Browsee orodjem za sledenje uporabniških interakcij:

```javascript
// Browsee konfiguracija v index.html:
window._browsee = window._browsee || function () { 
    (_browsee.q = _browsee.q || []).push(arguments) 
};
_browsee('init', '85fdc052178b978ab4d546170614f5c754a024343dcfe761');
```

**Sledeni eventi:**
- `page_view` - ogled strani z variantno oznako
- `button_click` - kliki na gumbove z lokacijo
- `sus_submission` - pošiljanje SUS vprašalnika
- `task_completion` - dokončanje nalog (ročno merjenje)

## Backend podpora

Ustvarjen je bil analytics endpoint (`/api/analytics`) za shranjevanje:
- A-B testing dogodkov
- SUS odgovorov
- Analitičnih poročil
- Povzetkov podatkov

## Navodila za testiranje

Pripravljena so bila podrobna navodila za testiranje z dvema nalogama:

### Naloga 1: Dodajanje potovanja
- **Cilj**: Testiranje workflow-a za dodajanje novega potovanja
- **Merjenje**: Čas, število klikov, uspešnost

### Naloga 2: Upravljanje stroškov  
- **Cilj**: Testiranje dodajanja stroškov in navigacije
- **Merjenje**: Enostavnost vnosa, navigacija med deli aplikacije

## Meritve in analiza

Sistem omogoča merjenje:
1. **Kvantitativnih metrik**: čas na strani, število klikov, stopnja dokončanja nalog
2. **Kvalitativnih metrik**: SUS ocena, uporabniške povratne informacije
3. **Konverzijskih metrik**: uspešnost dodajanja potovanj/stroškov
4. **Navigacijskih metrik**: uporaba posameznih funkcionalnosti

## Rezultat

Implementiran je bil popoln A-B testing sistem, ki omogoča:
- Naključno dodeljevanje uporabnikov
- Sledenje interakcij preko Browsee
- Zbiranje SUS ocen
- Analizo učinkovitosti različnih UX pristopov
- Podatkovno podprto sprejemanje odločitev o oblikovanju

Sistem je pripravljen za izvedbo testiranja z dejanskimi uporabniki in analizo rezultatov za optimizacijo uporabniške izkušnje.

## Dostop do variant

Za testne namene so na voljo direktni dostopi:
- `/home-a` - verzija A domače strani
- `/home-b` - verzija B domače strani  
- `/trips-a` - verzija A seznama potovanj
- `/trips-b` - verzija B seznama potovanj

Standardni dostopi `/` in `/trips` avtomatsko preklopijo na ustrezno verzijo glede na uporabnikovo skupino.