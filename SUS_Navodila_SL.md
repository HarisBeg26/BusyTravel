# SUS Vprašalnik - Navodila za Namestitev

## Kaj je bilo implementirano?

### 1. **SUS Gumb Component** (`src/components/SUSButton.vue`)
- Plavajoči vijolični gumb s zvezdo ikono v spodnjem desnem kotu
- Samodejno sledenje dogodkov (klik na gumb, uporaba funkcije)
- Označevanje uporabnikov z variantami za ločeno zbiranje podatkov
- Responsive oblikovanje za mobile in desktop

### 2. **Integrirane Strani**
SUS gumb je dodan na vse variante A/B testiranja:
- ✅ **Home.vue** (Variant A) - ID ankete: `sus_home_variant_a`
- ✅ **HomeVariantB.vue** (Variant B) - ID ankete: `sus_home_variant_b`
- ✅ **TripsList.vue** (Variant A) - ID ankete: `sus_trips_variant_a`
- ✅ **TripsListVariantB.vue** (Variant B) - ID ankete: `sus_trips_variant_b`

### 3. **Prevodi**
Dodani prevodi v vseh treh jezikih:
- 🇸🇮 **Slovenski**: "Oceni uporabnost"
- 🇬🇧 **Angleški**: "Rate Usability"
- 🇧🇦 **Bosanski**: "Ocijeni upotrebljivost"

### 4. **Sledenje Dogodkov**
Avtomatsko sledenje:
- Klik na SUS gumb: `clicked_sus_survey_button_{variant}`
- Uporaba vprašalnika: `used_sus_questionnaire_{variant}`
- Atributi uporabnika: `sus_variant`, `sus_timestamp`

## Kako nastaviti Hotjar ankete?

### Korak 1: Pridobite Hotjar Site ID
1. Prijavite se na https://www.hotjar.com/
2. Pojdite na **Sites & Organizations**
3. Poiščite vaš Site ID (6-7 mestna številka)
4. Posodobite v `index.html` (nadomestite `5219283` z vašim Site ID)

### Korak 2: Ustvarite 4 ločene ankete v Hotjar

Za vsako od naslednjih ustvarite novo anketo:

#### Anketa 1: Domača stran - Varianta A
```
Ime: SUS - Home Variant A
ID ankete: sus_home_variant_a
Stran: / (domača stran originalna)
Jezik: Slovenski
```

#### Anketa 2: Domača stran - Varianta B
```
Ime: SUS - Home Variant B
ID ankete: sus_home_variant_b
Stran: /home-b (domača stran varianta B)
Jezik: Slovenski
```

#### Anketa 3: Seznam potovanj - Varianta A
```
Ime: SUS - Trips Variant A
ID ankete: sus_trips_variant_a
Stran: /trips (seznam potovanj original)
Jezik: Slovenski
```

#### Anketa 4: Seznam potovanj - Varianta B
```
Ime: SUS - Trips Variant B
ID ankete: sus_trips_variant_b
Stran: /trips-b (seznam potovanj varianta B)
Jezik: Slovenski
```

### Korak 3: Dodajte SUS vprašanja

Za vsako anketo dodajte teh 10 vprašanj z ocenjevalno lestvico 1-5:

1. Mislim, da bi ta sistem rad/-a pogosto uporabljal/-a.
2. Sistem se mi je zdel neupotrebno zapleten.
3. Mislim, da je sistem enostaven za uporabo.
4. Mislim, da bi pri uporabi tega sistema potreboval/-a pomoč tehničnega strokovnjaka.
5. Ugotovil/-a sem, da so bile različne funkcije v tem sistemu dobro integrirane.
6. Mislim, da je bilo v tem sistemu preveč neskladnosti.
7. Predstavljam si, da bi se večina ljudi naučila uporabljati ta sistem zelo hitro.
8. Ugotovil/-a sem, da je bil sistem zelo okoren za uporabo.
9. Pri uporabi sistema sem se počutil/-a zelo samozavestno.
10. Moral/-a sem se veliko naučiti, preden sem lahko začel/-a uporabljati ta sistem.

**Lestvica**: 
- 1 = Sploh se ne strinjam
- 2 = Se ne strinjam
- 3 = Nevtralno
- 4 = Se strinjam
- 5 = Popolnoma se strinjam

### Korak 4: Nastavitve ankete v Hotjar

Za vsako anketo:
- **Tip**: On-site survey (widget na strani)
- **Trigger**: Manual trigger (sproži naš SUS gumb)
- **Naprave**: Vse naprave
- **Pozicija**: Center ali spodaj desno
- **Zahvala**: "Hvala za vaš odziv!"

## Alternativa: Uporaba 1ka

Če imate težave s Hotjar, lahko uporabite 1ka:

1. Prijavite se na https://www.1ka.si/ s študentskim računom
2. Ustvarite 4 ločene ankete z istimi SUS vprašanji
3. Dobite povezave do anket
4. V datoteki `src/components/SUSButton.vue` spremenite metodo `openSusSurvey()`:

```javascript
openSusSurvey() {
  const surveyUrls = {
    'A_home': 'https://www.1ka.si/a/xxxxx',    // Vaša povezava
    'A_trips': 'https://www.1ka.si/a/yyyyy',   // Vaša povezava
    'B_home': 'https://www.1ka.si/a/zzzzz',    // Vaša povezava
    'B_trips': 'https://www.1ka.si/a/wwwww'    // Vaša povezava
  };
  
  const pageName = this.$route.path.includes('home') ? 'home' : 'trips';
  const key = `${this.variant}_${pageName}`;
  
  // Sledenje dogodkom
  HotjarEvents.trackButtonClick('sus_survey_button', 'SUS', this.variant);
  HotjarEvents.trackFeatureUsage('sus_questionnaire', 'SUS', this.variant);
  
  // Odpri 1ka anketo v novem zavihku
  window.open(surveyUrls[key], '_blank');
}
```

## Kako izračunati SUS rezultat?

SUS rezultat je število med 0 in 100:

1. Za liha vprašanja (1, 3, 5, 7, 9): Rezultat = (Ocena - 1)
2. Za soda vprašanja (2, 4, 6, 8, 10): Rezultat = (5 - Ocena)
3. Seštejte vse rezultate in pomnožite z 2.5

**Interpretacija**:
- **Nad 68**: Nadpovprečna uporabnost ✅
- **Pod 68**: Podpovprečna uporabnost ⚠️
- **Nad 80**: Odlična uporabnost 🌟
- **Pod 51**: Slaba uporabnost ❌

## Testiranje

### Lokalno testiranje:
```bash
cd frontend/business-travel-frontend
npm run dev
```
Nato:
1. Obiščite http://localhost:5173/
2. Kliknite na vijolični SUS gumb v spodnjem desnem kotu
3. Preverite, ali se anketa odpre

### Produkcijsko testiranje:
1. Commitajte in pushajte spremembe
2. Počakajte na Vercel deployment
3. Testirajte na živi strani
4. Preverite Hotjar dashboard za dogodke

## Pomembne datoteke

```
BusinessTravelTrackerApp_RIRS/
├── frontend/business-travel-frontend/
│   ├── index.html (Hotjar tracking script)
│   ├── src/
│   │   ├── components/
│   │   │   └── SUSButton.vue (SUS gumb component)
│   │   ├── plugins/
│   │   │   └── hotjar.js (Hotjar integracija)
│   │   ├── locales/
│   │   │   ├── sl.json (Slovenski prevodi)
│   │   │   ├── en.json (Angleški prevodi)
│   │   │   └── bh.json (Bosanski prevodi)
│   │   └── views/
│   │       ├── Home.vue (z SUS gumbom)
│   │       ├── HomeVariantB.vue (z SUS gumbom)
│   │       ├── TripsList.vue (z SUS gumbom)
│   │       └── TripsListVariantB.vue (z SUS gumbom)
└── SUS_Questionnaire_Setup.md (podrobna navodila v angleščini)
```

## Pomoč in Podpora

- Podrobna navodila v angleščini: `SUS_Questionnaire_Setup.md`
- Hotjar dokumentacija: https://help.hotjar.com/
- 1ka platforma: https://www.1ka.si/
- SUS informacije: https://merjenje.net/sus/

## Naslednji koraki

1. ✅ Implementacija SUS gumba - **KONČANO**
2. ⏳ Nastaviti Hotjar ankete - **POTREBNO**
3. ⏳ Posodobiti Site ID v `index.html` - **POTREBNO**
4. ⏳ Testirati na produkciji - **ČAKA**
5. ⏳ Zbrati podatke - **ČAKA**
6. ⏳ Analizirati rezultate - **ČAKA**
