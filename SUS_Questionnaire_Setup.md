# SUS Questionnaire Setup with Hotjar

## Overview
This document explains how to set up the System Usability Scale (SUS) questionnaires for A/B testing using Hotjar's survey feature.

## What is SUS?
The System Usability Scale (SUS) is a standardized questionnaire consisting of 10 questions that measure the perceived usability of a system. Each question is rated on a 5-point Likert scale from "Strongly Disagree" to "Strongly Agree".

### SUS Questions (Slovenian):

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

### SUS Questions (English):

1. I think that I would like to use this system frequently.
2. I found the system unnecessarily complex.
3. I thought the system was easy to use.
4. I think that I would need the support of a technical person to be able to use this system.
5. I found the various functions in this system were well integrated.
6. I thought there was too much inconsistency in this system.
7. I would imagine that most people would learn to use this system very quickly.
8. I found the system very cumbersome to use.
9. I felt very confident using the system.
10. I needed to learn a lot of things before I could get going with this system.

## Hotjar Survey Setup Instructions

### Step 1: Create Hotjar Account and Get Site ID
1. Go to https://www.hotjar.com/
2. Sign up or log in to your account
3. Navigate to **Sites & Organizations**
4. Find your Site ID (6-7 digit number)
5. Update the Site ID in `/frontend/business-travel-frontend/index.html` (replace `5219283` with your actual Site ID)

### Step 2: Create SUS Surveys for Each Variant

You need to create **4 separate surveys** in Hotjar to collect data separately for each page variant:

#### Survey 1: Home Page Variant A
- **Survey Name**: SUS - Home Variant A
- **Survey ID**: `sus_home_variant_a`
- **Target Page**: `/` (Home page original)
- **Language**: Match the site language (SL/EN/BH)

#### Survey 2: Home Page Variant B
- **Survey Name**: SUS - Home Variant B
- **Survey ID**: `sus_home_variant_b`
- **Target Page**: `/home-b` (Home page variant B)
- **Language**: Match the site language (SL/EN/BH)

#### Survey 3: Trips List Variant A
- **Survey Name**: SUS - Trips Variant A
- **Survey ID**: `sus_trips_variant_a`
- **Target Page**: `/trips` (Trips list original)
- **Language**: Match the site language (SL/EN/BH)

#### Survey 4: Trips List Variant B
- **Survey Name**: SUS - Trips Variant B
- **Survey ID**: `sus_trips_variant_b`
- **Target Page**: `/trips-b` (Trips list variant B)
- **Language**: Match the site language (SL/EN/BH)

### Step 3: Configure Each Survey in Hotjar

For each survey above:

1. **Go to Hotjar Dashboard** → **Surveys** → **Create Survey** → **Start from scratch**

2. **Survey Settings**:
   - Survey Type: **On-site survey** (widget on your website)
   - Trigger: **Manual trigger** (triggered by our SUS button)
   - Device: **All devices**

3. **Add Questions**:
   - Click **Add Question**
   - Select **Rating Scale** for each of the 10 SUS questions
   - Scale: 1-5 (1 = Strongly Disagree, 5 = Strongly Agree)
   - Copy the question text from the SUS questions list above

4. **Survey Appearance**:
   - Position: Center or Bottom-right
   - Color scheme: Match your app theme (optional)
   - Thank you message: "Hvala za vaš odziv!" / "Thank you for your feedback!"

5. **Advanced Settings**:
   - Note the Survey ID that Hotjar assigns
   - Update the `surveyId` prop in the corresponding SUSButton component if needed

### Step 4: Verify Survey IDs in Code

The SUS button components are already integrated with these survey IDs:

```vue
<!-- Home.vue (Variant A) -->
<SUSButton variant="A" surveyId="sus_home_variant_a" />

<!-- HomeVariantB.vue (Variant B) -->
<SUSButton variant="B" surveyId="sus_home_variant_b" />

<!-- TripsList.vue (Variant A) -->
<SUSButton variant="A" surveyId="sus_trips_variant_a" />

<!-- TripsListVariantB.vue (Variant B) -->
<SUSButton variant="B" surveyId="sus_trips_variant_b" />
```

**Important**: If Hotjar assigns different survey IDs, update the `surveyId` prop in each component accordingly.

## How It Works

1. **Floating Button**: A purple floating button with a star icon appears in the bottom-right corner of each page
2. **User Interaction**: When users click the button, the SUS questionnaire modal appears
3. **Event Tracking**: Each click is tracked with:
   - Button click event: `clicked_sus_survey_button_{variant}`
   - Feature usage event: `used_sus_questionnaire_{variant}`
   - User attributes: `sus_variant`, `sus_timestamp`
4. **Data Collection**: Responses are collected separately for each variant (A/B)

## Data Analysis

### In Hotjar Dashboard:

1. Go to **Surveys** → Select your survey
2. View **Responses** tab to see all submissions
3. Check **User Attributes** to filter by variant:
   - Filter by `sus_variant: A` or `sus_variant: B`
4. Export data as CSV for further analysis

### Calculating SUS Score:

The SUS score ranges from 0 to 100:

1. For odd-numbered questions (1, 3, 5, 7, 9): Score = (Rating - 1)
2. For even-numbered questions (2, 4, 6, 8, 10): Score = (5 - Rating)
3. Sum all scores and multiply by 2.5
4. Result: SUS score between 0-100

**Interpretation**:
- **Above 68**: Above average usability
- **Below 68**: Below average usability
- **Above 80**: Excellent usability
- **Below 51**: Poor usability

## Alternative: Using 1ka

If Hotjar surveys don't work or you prefer 1ka:

1. Go to https://www.1ka.si/
2. Log in with your student account
3. Create a new survey with the 10 SUS questions
4. Create separate surveys for each variant
5. Get the survey links
6. Update the `openSusSurvey()` method in `SUSButton.vue` to open the 1ka link:

```javascript
openSusSurvey() {
  const surveyUrls = {
    'A_home': 'https://www.1ka.si/a/xxxxx',
    'A_trips': 'https://www.1ka.si/a/yyyyy',
    'B_home': 'https://www.1ka.si/a/zzzzz',
    'B_trips': 'https://www.1ka.si/a/wwwww'
  };
  
  const key = `${this.variant}_${this.$route.path.includes('home') ? 'home' : 'trips'}`;
  window.open(surveyUrls[key], '_blank');
}
```

## Testing

1. **Local Testing**:
   - Run `npm run dev` in the frontend directory
   - Navigate to each page variant
   - Click the SUS button
   - Verify the survey appears

2. **Production Testing**:
   - Deploy to Vercel
   - Test on live site: https://your-app.vercel.app
   - Check Hotjar dashboard for event tracking

## Troubleshooting

### Survey doesn't appear:
- Check that Hotjar script is loaded (check browser console)
- Verify Site ID is correct in `index.html`
- Check that survey is published in Hotjar dashboard
- Verify survey ID matches the code

### Events not tracking:
- Open browser DevTools → Network tab
- Look for requests to `hotjar.com` endpoints
- Check console for any JavaScript errors
- Verify `HotjarEvents.isLoaded()` returns true

### Button not visible:
- Check CSS z-index conflicts
- Verify component is imported and registered
- Check browser console for Vue component errors

## References

- [Original SUS Article (English)](https://www.usability.gov/how-to-and-tools/methods/system-usability-scale.html)
- [Slovenian SUS Translation](https://merjenje.net/sus/)
- [Hotjar Documentation](https://help.hotjar.com/hc/en-us/categories/115001495308-Surveys)
- [1ka Platform](https://www.1ka.si/)

## Support

For issues or questions:
1. Check Hotjar support: https://help.hotjar.com/
2. Review the implementation in `src/components/SUSButton.vue`
3. Check event tracking in `src/plugins/hotjar.js`
