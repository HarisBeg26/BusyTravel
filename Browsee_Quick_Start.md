# Quick Start - Browsee A/B Testing

## 🚀 Hiter Pregled

### Kaj je implementirano?

✅ **Browsee SDK** - Popolnoma integriran v Vue aplikacijo  
✅ **Event Tracking** - Sledenje 8+ tipov dogodkov  
✅ **A/B Testi** - 2 aktivna testa (Home + TripsList)  
✅ **Dokumentacija** - Podrobna navodila v `Browsee_AB_Testing_Navodila.md`  

---

## 🔗 URL-ji za Testiranje

### Produkcija (Vercel)
- **Home A**: https://your-app.vercel.app/
- **Home B**: https://your-app.vercel.app/home-b
- **Trips A**: https://your-app.vercel.app/trips
- **Trips B**: https://your-app.vercel.app/trips-b

### Lokalno
```bash
cd frontend/business-travel-frontend
npm install
npm run dev
```
- Home A: http://localhost:5173/
- Home B: http://localhost:5173/home-b
- Trips A: http://localhost:5173/trips
- Trips B: http://localhost:5173/trips-b

---

## 📊 Browsee Dashboard

**URL**: https://browsee.io/app  
**API Key**: `85fdc052178b978ab4d546170614f5c754a024343dcfe761`

### Kako preveriti podatke

1. **Session Recordings**:
   - Dashboard → Sessions
   - Filter by URL (npr. `/home-b` za varianto B)

2. **Events**:
   - Dashboard → Events
   - Filter: `ab_test_assignment` → property `variant = "B"`

3. **Funnels**:
   - Dashboard → Funnels → Create New
   - Primer: Page View → Button Click → Navigation

4. **Heatmaps**:
   - Dashboard → Heatmaps
   - Select URL (ločeno za A in B variante)

---

## 🎯 Ključne Metrike

### Home Page Test
- ⏱️ Average Time on Page
- 🖱️ Click-through Rate
- 📊 Navigation Success Rate
- 🎨 Feature Discovery (sidebar usage - samo B)

### Trips List Test
- ⚡ Task Completion Time
- ✏️ CRUD Operations per Session
- 🔍 Search Usage Rate
- 📄 Pagination Clicks

---

## 🧪 Hitri Test

```javascript
// Odpri konzolo (F12) v brskalniku:

// 1. Preveri če je Browsee inicializiran
console.log(window._browsee);

// 2. Ročno sprozi event
browsee.logEvent('test_event', { 
  test: 'manual', 
  variant: 'A' 
});

// 3. Preveri API calls v Network tabu
// Filter: "browsee"
```

---

## 📁 Datoteke

### Nove datoteke:
- `src/plugins/browsee.js` - Plugin z event tracking funkcijami
- `Browsee_AB_Testing_Navodila.md` - Podrobna dokumentacija
- `Browsee_Quick_Start.md` - Ta dokument

### Spremenjene datoteke:
- `src/main.js` - Inicializacija Browsee
- `src/views/Home.vue` - Dodani tracking eventi (Varianta A)
- `src/views/HomeVariantB.vue` - Dodani tracking eventi (Varianta B)
- `src/views/TripsList.vue` - Dodani tracking eventi (Varianta A)
- `src/views/TripsListVariantB.vue` - Dodani tracking eventi (Varianta B)

---

## 🔍 Spremljani Dogodki

| Event | Kaj sledi | Kdaj se sproži |
|-------|-----------|----------------|
| `page_view` | Obisk strani | mounted() lifecycle |
| `ab_test_assignment` | Dodelitev variante | mounted() lifecycle |
| `button_click` | Klik na gumb | onClick handler |
| `navigation` | Prehod na drugo stran | pred router.push() |
| `search` | Iskanje | watch na searchQuery |
| `crud_operation` | CRUD akcija | po uspešnem API call-u |
| `time_on_page` | Čas na strani | beforeUnmount() lifecycle |
| `feature_usage` | Uporaba funkcije | pri uporabi nove funkcionalnosti |

---

## ⚠️ Troubleshooting

### Problem: Eventi se ne prikazujejo

**Rešitev**:
1. Počakajte 5-10 minut (sinhronizacija)
2. Preverite Network tab za API calls
3. Preverite Console za napake
4. Hard refresh (Ctrl+Shift+R)

### Problem: Session recording ne deluje

**Rešitev**:
1. Preverite Browsee project settings
2. Whitelisted domains
3. Onemogočite ad blockers
4. Poskusite incognito mode

---

## 📚 Dodatna Pomoč

- **Podrobna navodila**: Glej `Browsee_AB_Testing_Navodila.md`
- **Browsee Docs**: https://docs.browsee.io
- **Support**: support@browsee.io

---

**Status**: ✅ Ready for Testing  
**Verzija**: 1.0  
**Datum**: 10. december 2025
