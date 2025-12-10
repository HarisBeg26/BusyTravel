# Dokumentacija A-B testiranja

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

- **ID projekta:** `VAŠ_BROWSEE_ID` (zamenjajte z dejanskim ID-jem)
- **Implementacija:** Skripta za sledenje je dodana v `index.html`.
- **Sledenje dogodkov:** `abTestingService.js` pošilja dogodke v Browsee:
  - `session_start`: Ob prvem obisku uporabnika.
  - `page_view`: Ob ogledu vsake strani (z oznako verzije A/B).
  - `button_click`: Ob kliku na ključne gumbe.
  - `sus_submission`: Ob oddaji SUS vprašalnika (vključno z oceno).

## 3. Prikaz SUS vprašalnika

- **Komponenta:** `SUSQuestionnaire.vue`
- **Jezik:** Vprašanja so v slovenščini.
- **Funkcionalnost:**
  - Prikaže se v modalnem oknu.
  - Vsebuje 10 standardnih SUS vprašanj.
  - Uporabnik ocenjuje na lestvici od 1 do 5.
  - Po oddaji se izračuna končna ocena (0-100) in pošlje v Browsee ter na backend.
  - Zbiranje podatkov je ločeno za vsako verzijo strani (A/B).
