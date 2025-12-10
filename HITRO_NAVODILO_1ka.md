# Kako nastaviti SUS vprašalnik z 1ka

## Zakaj se SUS gumb ne odziva?

Ko kliknete na SUS gumb, se v konzoli izpiše samo log sporočilo, ampak anketa se ne odpre. **Razlog**: Hotjar ankete še niso ustvarjene v vašem Hotjar računu.

## ✅ ENOSTAVNA REŠITEV: Uporaba 1ka

### Korak 1: Ustvarite 4 ankete na 1ka

1. Pojdite na https://www.1ka.si/
2. Prijavite se s študentskim računom
3. Ustvarite **4 ločene ankete** z naslednjimi SUS vprašanji:

#### SUS Vprašanja (kopirajte v vsako anketo):

**Navodilo**: Ocenite svoje strinjanje z naslednjimi trditvami (1 = Sploh se ne strinjam, 5 = Popolnoma se strinjam)

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

#### 4 ankete, ki jih morate ustvariti:

1. **SUS - Domača stran - Varianta A** (za stran `/`)
2. **SUS - Domača stran - Varianta B** (za stran `/home-b`)
3. **SUS - Seznam potovanj - Varianta A** (za stran `/trips`)
4. **SUS - Seznam potovanj - Varianta B** (za stran `/trips-b`)

### Korak 2: Dobite povezave do anket

Po ustvarjanju vsake ankete na 1ka:
1. Kliknite **"Objavi"** → **"Aktiviraj anketo"**
2. Kopirajte **URL povezavo** ankete (nekaj kot: `https://www.1ka.si/a/123456`)

### Korak 3: Posodobite kodo

Odprite datoteko: `frontend/business-travel-frontend/src/components/SUSButton.vue`

Poiščite ta del kode (približno linija 50):

```javascript
      // ALTERNATIVE: If you want to use 1ka instead, uncomment below and add your 1ka URLs:
      /*
      const surveyUrls = {
        'sus_home_variant_a': 'https://www.1ka.si/a/YOUR_SURVEY_ID_1',
        'sus_home_variant_b': 'https://www.1ka.si/a/YOUR_SURVEY_ID_2',
        'sus_trips_variant_a': 'https://www.1ka.si/a/YOUR_SURVEY_ID_3',
        'sus_trips_variant_b': 'https://www.1ka.si/a/YOUR_SURVEY_ID_4'
      };
      
      const url = surveyUrls[this.surveyId];
      if (url) {
        window.open(url, '_blank');
      }
      */
```

Spremenite ga v (odstranite `/*` in `*/` ter dodajte svoje URL-je):

```javascript
      // Open 1ka survey in new tab
      const surveyUrls = {
        'sus_home_variant_a': 'https://www.1ka.si/a/VAŠA_ID_ANKETA_1',
        'sus_home_variant_b': 'https://www.1ka.si/a/VAŠA_ID_ANKETA_2',
        'sus_trips_variant_a': 'https://www.1ka.si/a/VAŠA_ID_ANKETA_3',
        'sus_trips_variant_b': 'https://www.1ka.si/a/VAŠA_ID_ANKETA_4'
      };
      
      const url = surveyUrls[this.surveyId];
      if (url) {
        window.open(url, '_blank');
      } else {
        console.warn('Survey URL not found for:', this.surveyId);
        alert('Anketa še ni konfigurirana.');
      }
```

**POMEMBNO**: Lahko tudi odstranite ali zakomentirajte Hotjar del (vrstice 16-23):

```javascript
      // Check if Hotjar is loaded
      /*
      if (HotjarEvents.isLoaded()) {
        // Trigger Hotjar survey
        HotjarEvents.triggerSurvey(this.surveyId);
        console.log(`SUS Survey triggered for variant ${this.variant} with survey ID: ${this.surveyId}`);
      } else {
        console.warn('Hotjar is not loaded. Please check Hotjar setup.');
        alert('Anketa še ni na voljo. Prosimo, poskusite kasneje.');
      }
      */
```

### Korak 4: Shranite, commitajte in naložite

```bash
git add .
git commit -m "feat: Configure SUS questionnaire with 1ka surveys"
git push origin main
```

### Korak 5: Testirajte

1. Počakajte na Vercel deployment
2. Odprite vašo spletno stran
3. Kliknite na SUS gumb (vijolični z zvezdo)
4. Anketa se bo odprla v novem zavihku (1ka)

## Prednosti 1ka:

✅ Enostavno nastaviti s študentskim računom  
✅ Slovenski vmesnik  
✅ Izvoz podatkov v Excel/SPSS  
✅ Avtomatičen izračun statistike  
✅ Brezplačno za študente  

## Kako zbrati podatke ločeno za vsako varianto?

Na 1ka imate 4 ločene ankete, zato bodo podatki že avtomatično ločeni:
- Anketa 1 → samo uporabniki Variante A (domača stran)
- Anketa 2 → samo uporabniki Variante B (domača stran)
- Anketa 3 → samo uporabniki Variante A (seznam potovanj)
- Anketa 4 → samo uporabniki Variante B (seznam potovanj)

## Potrebujete pomoč?

Če potrebujete, da vam pomagam spremeniti kodo, mi samo povejte:
1. URL-je vaših 4 anket na 1ka
2. Ali želite obdržati Hotjar ali samo 1ka

---

**TIP**: Če želite še vedno uporabiti Hotjar, morate najprej:
1. Ustvariti račun na Hotjar.com
2. Dodati vašo spletno stran
3. Ustvariti 4 survey-e v Hotjar dashboard
4. To je bolj kompleksno in morda ni potrebno za šolski projekt
