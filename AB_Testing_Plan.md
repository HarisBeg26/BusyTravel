# A/B Testiranje - Načrt izvedbe

## Pregled testiranja

### Cilj
Primerjati uporabnost dveh različic uporabniškega vmesnika:
- **Varianta A**: Klasični vmesnik s karticami in hero sekcijo
- **Varianta B**: Vmesnik s stranski navigacijo in kompaktnim toolbarom

### Strani, ki se testirajo
1. **Domača stran**: 
   - Varianta A: Tri kartice za navigacijo
   - Varianta B: Stranska navigacija z breadcrumbs

2. **Seznam potovanj**:
   - Varianta A: Hero sekcija z iskanjem (10 vrstic na stran)
   - Varianta B: Kompaktna toolbar brez hero sekcije (15 vrstic na stran)

---

## Naključna dodelitev variant

### Avtomatsko preusmerjanje
Sistem **avtomatično** dodeli uporabnike varianti A ali B v razmerju **50:50**.

**Kako deluje:**
1. Ko uporabnik prvič obišče stran, se naključno dodeli varianti A ali B
2. Dodelitev se shrani v `sessionStorage` za celotno sejo
3. Uporabnik ostane v isti varianti ves čas testiranja
4. Če uporabnik zapre brskalnik in ga ponovno odpre, se mu dodeli nova varianta

**Tehnična implementacija:**
- Datoteka: `src/utils/ABTestRouter.js`
- Router guard v `src/router/index.js` avtomatično preusmeri na pravo varianto
- Sledenje dogodkom preko ContentSquare

### Kako preveriti dodelitev
V brskalniški konzoli vnesite:
```javascript
sessionStorage.getItem('ab_test_variant')
```
Izpis: `"A"` ali `"B"`

### Ročna dodelitev (samo za testiranje)
Če želite ročno dodeliti varianto, v konzoli vnesite:
```javascript
// Za varianto A
sessionStorage.setItem('ab_test_variant', 'A');
location.reload();

// Za varianto B
sessionStorage.setItem('ab_test_variant', 'B');
location.reload();
```

---

## Naloge za testne uporabnike

### Naloga A: Dodajanje novega potovanja
**Cilj:** Dodati novo poslovno potovanje z določenimi podatki

**Navodila uporabniku:**
- Datoteka: `Navodila_Naloga_A.md`
- Čas izvedbe: 3-5 minut

**Podatki za vnos:**
- Ime potovanja: Poslovna konferenca Ljubljana
- Destinacija: Ljubljana, Slovenija
- Datum začetka: 15. januar 2026
- Datum konca: 17. januar 2026

### Naloga B: Urejanje obstoječega potovanja
**Cilj:** Poiskati in urediti obstoječe potovanje

**Navodila uporabniku:**
- Datoteka: `Navodila_Naloga_B.md`
- Čas izvedbe: 3-5 minut

**Akcije:**
- Poiskati potovanje v Berlin
- Spremeniti datum konca (podaljšati za 2 dni)
- Spremeniti destinacijo iz "Berlin, Germany" v "Berlin, Deutschland"

---

## Merjenje in sledenje

### 1. ContentSquare avtomatično sledenje
**Kar se avtomatično beleži:**
- ✅ Kliki na vse elemente
- ✅ Premiki miške (heatmaps)
- ✅ Čas na strani
- ✅ Scroll globina
- ✅ Navigacija med stranmi
- ✅ Session recordings

**Dostop do podatkov:**
- Prijavite se na: https://app.contentsquare.com/
- Izberite projekt: Business Travel Tracker

### 2. Ročno merjenje časa (opcijsko)
Če želite dodatno ročno beležiti čas:

**Priprava:**
1. Pripravite excel tabelo z stolpci:
   - ID uporabnika
   - Varianta (A/B)
   - Naloga (A/B)
   - Čas začetka
   - Čas konca
   - Trajanje (sekunde)
   - Uspešnost (DA/NE)
   - Opombe

**Med testiranjem:**
1. Zaženite štoparico, ko uporabnik začne nalogo
2. Ustavite, ko uporabnik konča nalogo
3. Zabeležite čas in opazovanja

### 3. SUS vprašalnik
**Zbiranje podatkov:**
- URL: https://1ka.arnes.si/a/3b920b7b
- Uporabnik klikne na **vijolični gumb z zvezdico** po končani nalogi
- Vprašalnik se odpre v novem zavihku

**Pomembno:**
- Vsak uporabnik izpolni SUS po vsaki nalogi
- SUS ocena: 0-100 (višje = boljša uporabnost)
- Vprašalnik ima 10 vprašanj

---

## Protokol testiranja

### Priprava
1. ✅ Preverite, da je stran dostopna: https://business-travel-tracker-app-rirs.vercel.app/
2. ✅ Preverite, da deluje ContentSquare tracking
3. ✅ Preverite, da deluje SUS gumb (vijolični z zvezdico)
4. ✅ Preverite, da je 1ka anketa aktivna
5. ✅ Pripravite navodila za uporabnike (Navodila_Naloga_A.md, Navodila_Naloga_B.md)

### Izvedba testiranja

#### Scenarij 1: Oddaljeno testiranje (priporočeno)
Uporabniki testirajo na svojih napravah:

1. **Pošljite uporabnikom:**
   - URL aplikacije: https://business-travel-tracker-app-rirs.vercel.app/
   - Navodila za nalogo (A ali B)
   - Informacije o SUS gumbu

2. **Navodila:**
   - "Odprite povezavo"
   - "Opravite nalogo po navodilih"
   - "Kliknite na vijolični gumb z zvezdico in izpolnite vprašalnik"
   - "Zaključite sejo"

3. **Prednosti:**
   - ✅ Naravno okolje uporabnika
   - ✅ Lastna naprava
   - ✅ Ni potrebe po prisotnosti moderatorja
   - ✅ ContentSquare beleži vse

#### Scenarij 2: Spremljano testiranje
Uporabnik testira v vaši prisotnosti:

1. **Setup:**
   - Odprite aplikacijo na uporabnikovi napravi ali vašem računalniku
   - Preverite, da deluje screen recording

2. **Izvedba:**
   - Podajte navodila
   - Opazujte uporabnika (brez vmešavanja!)
   - Beležite čas in opazovanja
   - Prosite uporabnika, da "misli naglas" (opcijsko)

3. **Po končani nalogi:**
   - Uporabnik klikne SUS gumb
   - Izpolni vprašalnik
   - Kratko spraševanje o izkušnji (opcijsko)

### Število testnih uporabnikov
**Minimalno:** 5 uporabnikov na varianto = **10 uporabnikov skupaj**
**Priporočeno:** 10 uporabnikov na varianto = **20 uporabnikov skupaj**

**Distribucija:**
- 50% uporabnikov → Varianta A → Naloga A ali B
- 50% uporabnikov → Varianta B → Naloga A ali B

---

## Analiza rezultatov

### 1. ContentSquare Dashboard
**Kaj preverjati:**
- ✅ Session recordings - kako uporabniki navigirajo
- ✅ Heatmaps - kam klikajo, kam gledajo
- ✅ Journey analysis - katera pot je krajša
- ✅ Error analysis - kje uporabniki obtiči

### 2. SUS rezultati (1ka)
**Izračun:**
1. Prijavite se na https://www.1ka.si/
2. Odprite anketo
3. Izvozite podatke (Excel)
4. Izračunajte SUS score za vsako varianto

**Interpretacija:**
- **> 80**: Odlična uporabnost ⭐⭐⭐⭐⭐
- **68-80**: Dobra uporabnost ⭐⭐⭐⭐
- **51-68**: Povprečna uporabnost ⭐⭐⭐
- **< 51**: Slaba uporabnost ⭐⭐

### 3. Primerjava variant
**Metriki za primerjavo:**
- **Čas dokončanja naloge** (hitrejša = boljša)
- **SUS ocena** (višja = boljša)
- **Število napak** (manj = bolje)
- **Uspešnost dokončanja** (višji % = boljši)

**Statistična analiza:**
- T-test za primerjavo povprečij
- p < 0.05 = statistično značilna razlika

---

## Troubleshooting

### Problem: ContentSquare ne beleži dogodkov
**Rešitev:**
1. Preverite network tab - ali se naloži `9816eca3912b0.js`?
2. Preverite konzolo - so kakšne napake?
3. Počakajte 5-10 minut - podatki se lahko prikažejo z zamikom

### Problem: Uporabnik ne vidi SUS gumba
**Rešitev:**
1. Preverite, ali je gumb skrit za kakšnim drugim elementom
2. Osvežite stran (F5)
3. Preverite, ali je JavaScript omogočen

### Problem: 1ka anketa se ne odpre
**Rešitev:**
1. Preverite URL: https://1ka.arnes.si/a/3b920b7b
2. Preverite, ali je anketa aktivirana na 1ka
3. Preverite, ali brskalnik blokira pop-up okna

### Problem: Uporabnik vidi napačno varianto
**Rešitev:**
1. Počistite sessionStorage: `sessionStorage.clear()`
2. Osvežite stran
3. Preverite router guard v razvijalskih orodjih

---

## Priporočila

### ✅ Dobra praksa
- Testirajte v različnih urah dneva
- Testirajte na različnih napravah (desktop, mobile, tablet)
- Mešajte izkušene in neizkušene uporabnike
- Ne razkrivajte, da obstajata dve varianti
- Ne pomagajte uporabnikom (samo opazujte)

### ❌ Izogibajte se
- Ne testirajte le z eno skupino ljudi (npr. samo študenti)
- Ne vodite uporabnika skozi nalogo
- Ne prekinjajte uporabnika med testiranjem
- Ne testirajte preveč nalog naenkrat

---

## Časovnica

1. **Priprava** (1 dan):
   - Preverite, da vse deluje
   - Pripravite navodila
   - Najdite testne uporabnike

2. **Izvedba** (3-5 dni):
   - 2-4 uporabnike na dan
   - Beležite rezultate sproti

3. **Analiza** (2 dni):
   - Analizirajte ContentSquare podatke
   - Izračunajte SUS rezultate
   - Primerjajte varianti

4. **Poročilo** (1 dan):
   - Napišite ugotovitve
   - Pripravite priporočila
   - Odločite se za najboljšo varianto
