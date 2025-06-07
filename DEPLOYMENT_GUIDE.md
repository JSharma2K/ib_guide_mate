# GuideMate Deployment Guide

This guide will walk you through deploying your GuideMate app to both the Google Play Store and Apple App Store.

## Prerequisites

### Required Accounts
1. **Expo Account** - Sign up at https://expo.dev
2. **Apple Developer Account** - $99/year at https://developer.apple.com
3. **Google Play Console Account** - $25 one-time fee at https://play.google.com/console

### Required Tools
```bash
# Install EAS CLI globally
npm install -g @expo/eas-cli

# Login to your Expo account
eas login
```

## Step 1: Prepare Your App Assets

### Required Images
You need to create the following image assets:

1. **App Icon** (`./assets/icon.png`)
   - Size: 1024x1024 pixels
   - Format: PNG with transparency
   - No rounded corners (platforms handle this)

2. **Splash Screen** (`./assets/splash.png`)
   - Size: 1284x2778 pixels (iPhone 14 Pro Max resolution)
   - Format: PNG
   - Background color: #1A1D29 (matches your app theme)

3. **Adaptive Icon** (`./assets/adaptive-icon.png`)
   - Size: 1024x1024 pixels
   - Format: PNG with transparency
   - Android only - foreground image

4. **Favicon** (`./assets/favicon.png`)
   - Size: 48x48 pixels
   - Format: PNG
   - Web only

### Create Assets Script
```bash
# You can use online tools like:
# - https://www.appicon.co/ (generates all sizes)
# - https://apetools.webprofusion.com/app/#/tools/imagegorilla (batch resize)
# - Figma or Sketch for custom design
```

## Step 2: Configure Your App

### Update app.json
Make sure to update these fields in `app.json`:
- `expo.owner`: Your Expo username
- `expo.extra.eas.projectId`: Get this after running `eas build:configure`
- `expo.ios.bundleIdentifier`: Unique identifier (e.g., com.yourname.guidemate)
- `expo.android.package`: Same as bundle identifier

### Update eas.json
Update these fields in `eas.json`:
- `submit.production.ios.appleId`: Your Apple ID email
- `submit.production.ios.ascAppId`: From App Store Connect
- `submit.production.ios.appleTeamId`: From Apple Developer Account

## Step 3: Build Your App

### Initialize EAS
```bash
# Configure EAS for your project
eas build:configure

# This will:
# 1. Create/update eas.json
# 2. Generate a project ID
# 3. Link your project to Expo
```

### Build for Production

#### Build for iOS
```bash
# Build for iOS App Store
eas build --platform ios --profile production

# This creates an .ipa file for App Store submission
```

#### Build for Android
```bash
# Build for Google Play Store
eas build --platform android --profile production

# This creates an .aab (Android App Bundle) file
```

#### Build for Both Platforms
```bash
# Build for both platforms simultaneously
eas build --platform all --profile production
```

## Step 4: Test Your Builds

### Internal Testing
```bash
# Build preview versions for testing
eas build --platform all --profile preview

# Share with testers using Expo Go or development builds
```

### TestFlight (iOS) / Internal Testing (Android)
```bash
# Submit to TestFlight for iOS beta testing
eas submit --platform ios --profile preview

# Upload to Google Play Console for internal testing
eas submit --platform android --profile preview
```

## Step 5: App Store Submissions

### Apple App Store

#### Prerequisites
1. **App Store Connect Setup**
   - Create app record at https://appstoreconnect.apple.com
   - Fill out app information, pricing, and availability
   - Add app description, keywords, screenshots
   - Set up App Store Review Information

2. **Required Information**
   - App Name: "GuideMate"
   - Subtitle: "Resources for IB Students and Teachers"
   - Category: Education
   - Content Rating: 4+ (No objectionable content)
   - Privacy Policy URL (if collecting data)

#### Submit to App Store
```bash
# Submit your production build
eas submit --platform ios --profile production

# Or manually upload the .ipa file to App Store Connect
```

#### App Store Screenshots
Required sizes (you can use iPhone 14 Pro Max and iPad Pro):
- iPhone: 1290x2796, 1290x2796, 1290x2796 (minimum 3 screenshots)
- iPad: 2048x2732, 2048x2732 (minimum 2 screenshots)

### Google Play Store

#### Prerequisites
1. **Google Play Console Setup**
   - Create app at https://play.google.com/console
   - Complete store listing (title, description, graphics)
   - Set up content rating questionnaire
   - Configure pricing and distribution

2. **Required Information**
   - App Title: "GuideMate"
   - Short Description: "IB study guide and resources app"
   - Full Description: Detailed app description
   - Category: Education
   - Content Rating: Everyone

#### Submit to Play Store
```bash
# Submit your production build
eas submit --platform android --profile production

# Or manually upload the .aab file to Play Console
```

#### Play Store Screenshots
Required sizes:
- Phone: 1080x1920 (minimum 2 screenshots)
- Tablet: 1200x1920 (minimum 1 screenshot)
- Feature Graphic: 1024x500

## Step 6: Store Listing Optimization

### App Description Template
```
GuideMate – Resources for IB Students and Teachers

Comprehensive study guide for International Baccalaureate Diploma Programme students and educators.

FEATURES:
✓ Complete subject guides for English A Literature, Language & Literature, and Literature & Performance
✓ Mathematics AA and AI resources with detailed rubrics
✓ Extended Essay guidance and assessment criteria
✓ Student and teacher-specific resources
✓ Searchable content across all subjects
✓ Offline access to all materials
✓ Clean, intuitive interface designed for studying

SUBJECTS COVERED:
• English A: Literature
• English A: Language and Literature  
• English A: Literature and Performance
• Mathematics: Analysis and Approaches (AA)
• Mathematics: Applications and Interpretation (AI)
• Extended Essay

Perfect for IB students preparing for exams, completing coursework, or teachers planning lessons.

Note: This app is not affiliated with or endorsed by the International Baccalaureate Organization.
```

### Keywords for App Store Optimization
- IB, International Baccalaureate, study guide, education
- English literature, mathematics, extended essay
- Student resources, teacher resources, exam prep
- High school, diploma programme, academic

## Step 7: Post-Launch

### Monitor Performance
- Check app store reviews and ratings
- Monitor crash reports in Expo dashboard
- Track download and usage analytics

### Updates
```bash
# For app updates, increment version in app.json
# Then rebuild and resubmit
eas build --platform all --profile production
eas submit --platform all --profile production
```

### Maintenance
- Regular content updates
- Bug fixes and performance improvements
- New feature additions based on user feedback

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check expo doctor: `expo doctor`
   - Verify all dependencies are compatible
   - Clear cache: `expo r -c`

2. **App Store Rejection**
   - Review Apple's App Store Review Guidelines
   - Ensure privacy policy if collecting data
   - Test on actual devices, not just simulators

3. **Play Store Rejection**
   - Complete content rating questionnaire
   - Ensure target API level meets requirements
   - Add required permissions explanations

### Support Resources
- Expo Documentation: https://docs.expo.dev
- EAS Build Documentation: https://docs.expo.dev/build/introduction/
- App Store Connect Help: https://developer.apple.com/help/app-store-connect/
- Google Play Console Help: https://support.google.com/googleplay/android-developer/

## Cost Summary

### One-time Costs
- Apple Developer Account: $99/year
- Google Play Console: $25 one-time

### Ongoing Costs
- Expo EAS: Free tier available, paid plans start at $29/month for teams
- Apple Developer Account: $99/year renewal

### Timeline
- Initial setup: 1-2 days
- App Store review: 1-7 days (Apple), 1-3 days (Google)
- Total time to launch: 1-2 weeks

Good luck with your app launch! 🚀 