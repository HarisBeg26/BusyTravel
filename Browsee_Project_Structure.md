# Browsee A/B Testing - Struktura Projekta

```
BusinessTravelTrackerApp_RIRS/
│
├── 📄 Browsee_AB_Testing_Navodila.md      (556 vrstic) - Podrobna tehnična dokumentacija
├── 📄 Browsee_Quick_Start.md              (157 vrstic) - Hiter pregled in začetek
├── 📄 Browsee_Implementation_Report.md     (362 vrstic) - Končno poročilo implementacije
├── 📄 AB_Testing_Dokumentacija.md          (posodobljen) - Pregled A/B testiranja
├── 📄 AB_Testing_Implementacija.md         (posodobljen) - Implementacijske podrobnosti
├── 📄 browsee_test.html                    (352 vrstic) - Interaktivna testna stran
│
└── frontend/business-travel-frontend/
    ├── package.json                        ✅ @browsee/web-sdk dependency
    │
    ├── src/
    │   ├── main.js                         ✅ Browsee inicializacija
    │   │
    │   ├── plugins/
    │   │   └── browsee.js                  ✅ Event tracking plugin (NEW)
    │   │
    │   ├── views/
    │   │   ├── Home.vue                    ✅ Tracking (Varianta A)
    │   │   ├── HomeVariantB.vue            ✅ Tracking (Varianta B)
    │   │   ├── TripsList.vue               ✅ Tracking (Varianta A)
    │   │   └── TripsListVariantB.vue       ✅ Tracking (Varianta B)
    │   │
    │   └── router/
    │       └── index.js                    ✅ Routes za A/B variante
    │
    └── node_modules/
        └── @browsee/
            └── web-sdk/                    ✅ Browsee SDK

```

---

## 📊 Event Tracking Flow

```
User Action → Vue Component → BrowseeEvents Helper → Browsee SDK → Browsee Cloud
     │              │                │                    │              │
     │              │                │                    │              └─→ Dashboard
     │              │                │                    │              
     │              │                │                    └─→ API Call (https://api.browsee.io)
     │              │                │
     │              │                └─→ logEvent() with structured data
     │              │
     │              └─→ mounted(), methods, watch, beforeUnmount
     │
     └─→ Click, Navigate, Search, CRUD, etc.
```

---

## 🎯 A/B Test Structure

```
HOME PAGE TEST (home_page_test)
│
├── Varianta A: /
│   ├── Layout: Card-based navigation
│   ├── Components: 3 large cards
│   └── Events: page_view, button_click, navigation, time_on_page
│
└── Varianta B: /home-b
    ├── Layout: Sidebar navigation + Dashboard
    ├── Components: Sidebar + Summary cards + Info panel
    └── Events: page_view, button_click, navigation, time_on_page, feature_usage (sidebar)


TRIPS LIST TEST (trips_list_test)
│
├── Varianta A: /trips
│   ├── Layout: Hero section + Table
│   ├── UI: Separate sections (header, search, actions)
│   └── Events: page_view, search, button_click, crud_operation, time_on_page
│
└── Varianta B: /trips-b
    ├── Layout: Compact toolbar + Optimized table
    ├── UI: Unified toolbar (breadcrumb + search + actions)
    └── Events: page_view, search, button_click, crud_operation, time_on_page, feature_usage (toolbar, breadcrumbs)
```

---

## 📈 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER INTERACTION                         │
│  (Click, Navigate, Search, CRUD, Page Load, Page Leave)    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   VUE COMPONENT LIFECYCLE                    │
│  mounted() → User Actions → watch() → beforeUnmount()      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 BROWSEE EVENTS HELPER                        │
│  trackPageView, trackButtonClick, trackNavigation, etc.    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    BROWSEE SDK (main.js)                     │
│         browsee.logEvent(eventName, eventData)             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   BROWSEE CLOUD API                          │
│              https://api.browsee.io                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   BROWSEE DASHBOARD                          │
│  Sessions | Events | Heatmaps | Funnels | Analytics        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Plugin Architecture

```javascript
// browsee.js Plugin Structure

export default {
  install(app) {
    // Make browsee available globally via this.$browsee
    app.config.globalProperties.$browsee = browsee;
    
    // Provide for Composition API
    app.provide('browsee', browsee);
  }
}

export const BrowseeEvents = {
  trackPageView()       → page_view event
  trackButtonClick()    → button_click event
  trackNavigation()     → navigation event
  trackSearch()         → search event
  trackCRUDOperation()  → crud_operation event
  trackABTestAssignment() → ab_test_assignment event
  trackTimeOnPage()     → time_on_page event
  trackFeatureUsage()   → feature_usage event
}
```

---

## 📦 Event Data Schema

```javascript
// Generic Event Structure
{
  event_name: "event_type",
  page_name: "Home" | "TripsList",
  variant: "A" | "B",
  timestamp: ISO8601_datetime,
  
  // Event-specific properties
  button_name: "...",      // for button_click
  from_page: "...",        // for navigation
  to_page: "...",          // for navigation
  search_query: "...",     // for search
  operation_type: "...",   // for crud_operation
  entity_type: "...",      // for crud_operation
  feature_name: "...",     // for feature_usage
  duration_seconds: 123,   // for time_on_page
  test_name: "..."         // for ab_test_assignment
}
```

---

## 🎨 Variants Comparison

### Home Page

| Aspect | Varianta A | Varianta B |
|--------|-----------|-----------|
| **Layout** | 3 large cards in grid | Sidebar + main content |
| **Navigation** | Card clicks | Sidebar items |
| **Space Usage** | Vertical (scrolling) | Horizontal (sidebar) |
| **Info Density** | Low | High (summary cards) |
| **Features** | Basic cards | Sidebar, breadcrumbs, recent activity |
| **Best For** | First-time users | Power users |

### Trips List

| Aspect | Varianta A | Varianta B |
|--------|-----------|-----------|
| **Header** | Large hero section | Compact toolbar |
| **Controls** | Separate sections | Unified toolbar |
| **Space** | ~200px header | ~80px toolbar |
| **Rows/Page** | 10 | 15 |
| **Navigation** | None | Breadcrumbs |
| **Best For** | Visual appeal | Data density |

---

## 📚 Documentation Files Overview

| File | Size | Purpose | Audience |
|------|------|---------|----------|
| `Browsee_AB_Testing_Navodila.md` | 556 lines | Complete technical guide | Developers, Analysts |
| `Browsee_Quick_Start.md` | 157 lines | Quick reference guide | All users |
| `Browsee_Implementation_Report.md` | 362 lines | Implementation summary | Stakeholders, PM |
| `AB_Testing_Dokumentacija.md` | Updated | Overview of A/B testing | All users |
| `AB_Testing_Implementacija.md` | Updated | Implementation details | Developers |
| `browsee_test.html` | 352 lines | Interactive testing page | QA, Developers |

**Total Documentation**: ~2000+ lines

---

## 🚀 Deployment Status

```
Git Repository (GitHub)
├── ✅ All code committed
├── ✅ All documentation committed
└── ✅ Pushed to main branch
    │
    ├─→ Vercel (Frontend)
    │   ├── ✅ Auto-deployed
    │   ├── ✅ Browsee SDK included
    │   └── ✅ All variants accessible
    │
    └─→ Render (Backend)
        ├── ✅ Auto-deployed
        └── ✅ No changes (frontend only)
```

---

## 📊 Expected Metrics Dashboard

```
┌────────────────────────────────────────────────────────────┐
│                    HOME PAGE TEST                          │
├────────────────────────────────────────────────────────────┤
│ Varianta A (Cards)        │  Varianta B (Sidebar)         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│ Sessions: XXX             │  Sessions: XXX                 │
│ Avg Time: XX sec          │  Avg Time: XX sec              │
│ CTR: XX%                  │  CTR: XX%                      │
│ Navigation Success: XX%   │  Navigation Success: XX%       │
│                           │  Sidebar Usage: XX%            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  TRIPS LIST TEST                           │
├────────────────────────────────────────────────────────────┤
│ Varianta A (Hero)         │  Varianta B (Compact)         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━│━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│
│ Sessions: XXX             │  Sessions: XXX                 │
│ CRUD Ops: XX/session      │  CRUD Ops: XX/session          │
│ Search Rate: XX%          │  Search Rate: XX%              │
│ Avg Task Time: XX sec     │  Avg Task Time: XX sec         │
│                           │  Toolbar Usage: XX%            │
│                           │  Breadcrumb Usage: XX%         │
└────────────────────────────────────────────────────────────┘
```

---

**Created**: 10. december 2025  
**Status**: ✅ COMPLETE  
**Purpose**: Visual overview of Browsee integration structure
