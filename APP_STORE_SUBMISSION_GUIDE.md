# 📱 App Store Submission Guide - Step by Step

## Overview

You're using **Expo SDK 54** with React Native. To submit to the App Store, you'll use **EAS Build** (Expo Application Services), which is the official way to build production apps with Expo.

---

## Prerequisites Checklist

### 1. Apple Developer Account
- [ ] Sign up at https://developer.apple.com/
- [ ] Cost: **$99/year** (USD) or equivalent in your country
- [ ] Takes 1-2 days to activate (sometimes instant)
- [ ] You'll need: Credit card, Apple ID

### 2. Expo Account
- [ ] Create free account at https://expo.dev/
- [ ] Install EAS CLI globally: `npm install -g eas-cli`
- [ ] Login: `eas login`

### 3. Required Assets
- [ ] **App Icon** (1024×1024px PNG, no transparency) - Located at `./assets/icon.png`
- [ ] **Splash Screen** - Located at `./assets/splash-icon.png`
- [ ] **Screenshots** (for App Store listing - can prepare later)
- [ ] **App description** (for App Store listing)

### 4. Xcode (for local testing - optional)
- [ ] Download Xcode from Mac App Store (free)
- [ ] **Note**: You don't need Xcode if using EAS Build (cloud build)

---

## Step-by-Step Process

### Phase 1: Setup (15-30 minutes)

#### Step 1.1: Install EAS CLI
```bash
npm install -g eas-cli
```

#### Step 1.2: Login to Expo
```bash
eas login
```
(Enter your Expo account credentials)

#### Step 1.3: Initialize EAS Configuration
```bash
eas build:configure
```
This creates `eas.json` in your project root.

#### Step 1.4: Link Project to Expo Account
```bash
eas init
```
(This creates a project on expo.dev if not already linked)

---

### Phase 2: Configure Build Settings (20 minutes)

After running `eas build:configure`, you'll have an `eas.json` file. Review and customize it:

**Typical `eas.json` structure:**
```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Key Settings to Configure:**
1. **Bundle Identifier**: Already set in `app.json` → `com.swisslaw.app` ✅
2. **Version**: Already set to `1.0.0` ✅
3. **Build Number**: Auto-increment enabled (handled by EAS)

---

### Phase 3: Prepare Assets (10-20 minutes)

#### Check Required Files:

1. **App Icon** (`./assets/icon.png`)
   - Must be **1024×1024px**
   - PNG format
   - No transparency
   - Square (no rounded corners - iOS adds them)
   - **Check**: `ls -lh assets/icon.png`

2. **Splash Screen** (`./assets/splash-icon.png`)
   - Recommended: 1242×2688px (iPhone 14 Pro Max size)
   - Or minimum: 1024×1024px (will be scaled)
   - PNG format
   - **Check**: `ls -lh assets/splash-icon.png`

#### If Missing Assets:
- Create them in design tool (Figma, Photoshop, etc.)
- Use your app's color scheme
- Make them professional and recognizable

---

### Phase 4: Build Production Bundle (30-60 minutes)

#### Step 4.1: Build for iOS Production
```bash
eas build --platform ios --profile production
```

**What happens:**
1. EAS uploads your code to Expo's servers
2. Expo builds your app in the cloud (no local Xcode needed!)
3. Build takes 15-45 minutes (typically ~20-30 min)
4. You'll get a download link when done

**First time:** You'll be prompted to:
- Select your Apple Developer account (or enter credentials)
- Choose provisioning profile setup (automatic or manual)

#### Step 4.2: Monitor Build Progress
```bash
# Check build status
eas build:list

# Or watch the build in browser
# EAS will give you a URL to track progress
```

---

### Phase 5: Test the Build (Optional but Recommended)

#### Step 5.1: Install on Device via TestFlight

**Option A: Direct Install (Development)**
1. Download the `.ipa` file from EAS build page
2. Install via TestFlight or Apple Configurator

**Option B: TestFlight (Recommended)**
1. Upload build to App Store Connect (see Phase 6)
2. Add testers in TestFlight
3. Testers install via TestFlight app

**Why Test?**
- Verify app works on real devices
- Check performance with 5MB of data
- Test all 18 languages
- Verify offline functionality
- Catch device-specific bugs

---

### Phase 6: Upload to App Store Connect (20 minutes)

#### Step 6.1: Submit Build to App Store
```bash
eas submit --platform ios
```

**What happens:**
1. EAS asks for your Apple Developer credentials (first time)
2. Automatically uploads `.ipa` to App Store Connect
3. Creates new app version if needed
4. Build appears in App Store Connect

**Alternative (Manual):**
1. Download `.ipa` from EAS build page
2. Open **Transporter** app (Mac App Store)
3. Upload `.ipa` manually
4. Wait for processing (10-30 minutes)

---

### Phase 7: Configure App Store Connect (30-60 minutes)

Go to https://appstoreconnect.apple.com/

#### Step 7.1: Create App Listing (First Time)

1. **App Information**
   - App Name: "Swiss Traffic Fines" (or your choice)
   - Primary Language: English (or German)
   - Bundle ID: `com.swisslaw.app` (must match `app.json`)
   - SKU: `swiss-law-app` (internal ID, can be anything)

2. **Pricing & Availability**
   - Set to **Free** (or paid if you want)
   - Select countries (usually "All countries")

3. **App Privacy**
   - Answer privacy questions:
     - **Does your app collect data?** → Likely **NO** (all offline)
     - **Does it use location?** → **NO**
     - **Does it track users?** → **NO**
   - Most answers should be **NO** (it's offline-first)

#### Step 7.2: Prepare App Store Listing

**Required Information:**
1. **App Name** (30 characters max)
   - Example: "Swiss Traffic Fines"
   
2. **Subtitle** (30 characters max)
   - Example: "Traffic Violations & Fines"
   
3. **Description** (4000 characters max)
   - Write compelling description
   - Mention: Offline access, 18 languages, 420 fines, etc.
   - Highlight key features
   
4. **Keywords** (100 characters max)
   - Example: "swiss,traffic,fines,laws,road,violations,chf"
   - No spaces, comma-separated
   
5. **Support URL**
   - Your website or GitHub repo
   
6. **Marketing URL** (optional)
   - App website if you have one

**Screenshots Required:**
- **iPhone 6.7"** (iPhone 14 Pro Max, 15 Pro Max): 1-10 screenshots
- **iPhone 6.5"** (iPhone 11 Pro Max, XS Max): 1-10 screenshots  
- **iPad Pro 12.9"** (if supporting tablets): 1-10 screenshots

**How to Take Screenshots:**
1. Run app on simulator: `npm run ios`
2. Take screenshots: Cmd + S (in simulator)
3. Or use device and screenshot tool
4. Edit/crop to required sizes
5. Upload to App Store Connect

**Icon:**
- Already included in build (from `assets/icon.png`)
- 1024×1024px required

**App Preview Videos** (optional):
- Short video demos (30 seconds max)
- Not required but recommended

#### Step 7.3: Set Up Version Information

1. **Version Number**: `1.0.0` (must match `app.json`)
2. **Build Number**: Auto-incremented (from EAS)
3. **What's New**: Release notes (describe features)

---

### Phase 8: Submit for Review (10 minutes)

#### Step 8.1: Final Checklist

Before submitting:
- [ ] App tested on real devices (via TestFlight)
- [ ] All features working (search, favorites, languages)
- [ ] No crashes or bugs
- [ ] App Store listing complete
- [ ] Screenshots uploaded
- [ ] Privacy policy URL (if required)
- [ ] Support contact info

#### Step 8.2: Submit

1. In App Store Connect, go to your app
2. Click **"Submit for Review"**
3. Answer additional questions:
   - **Export Compliance**: Usually "No" (unless using encryption)
   - **Content Rights**: Confirm you own all content
   - **Advertising Identifier**: Usually "No" (if not using ads)
4. Submit!

**Review Process:**
- **Typical timeline**: 24-48 hours (sometimes same day)
- **Status updates**: Email notifications
- **If rejected**: They'll explain why, fix and resubmit

---

## Timeline Estimate

| Phase | Time Required | Can Do Multiple Times? |
|-------|---------------|------------------------|
| Setup & Configure | 1-2 hours | Once |
| Build | 20-30 minutes | Yes (for each version) |
| Testing (TestFlight) | 1-2 days | Yes |
| App Store Connect Setup | 2-3 hours | Once (update for versions) |
| Review | 24-48 hours | Apple's timeline |
| **Total (First Time)** | **2-3 days** | |
| **Total (Updates)** | **1-2 days** | |

---

## Costs

| Item | Cost | Frequency |
|------|------|-----------|
| Apple Developer Program | $99 USD | Per year |
| Expo Account | Free | Lifetime |
| EAS Build | Free (limited) | Per build |
| EAS Build (unlimited) | $29/month | Optional |
| **Total (Minimum)** | **$99/year** | |

**EAS Build Free Tier:**
- 30 builds per month (usually enough)
- Unlimited bandwidth
- Cloud builds (no local setup needed)

---

## Common Issues & Solutions

### Issue 1: Bundle Identifier Already Exists
**Solution:**
- Change bundle ID in `app.json`: `com.swisslaw.app` → `com.yourname.swisslawapp`
- Or use your existing Apple Developer account

### Issue 2: Missing Assets
**Solution:**
- Create assets in design tool
- Use online tools: https://www.appicon.co/ for icons
- Minimum size: 1024×1024px

### Issue 3: Build Fails
**Solution:**
- Check error logs in EAS dashboard
- Common: Missing dependencies, TypeScript errors
- Fix and rebuild

### Issue 4: App Rejected
**Solution:**
- Read rejection reason carefully
- Common: Missing privacy policy, broken functionality
- Fix and resubmit

---

## Quick Command Reference

```bash
# Setup
npm install -g eas-cli
eas login
eas build:configure
eas init

# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios

# Check status
eas build:list
eas submit:list

# View logs
eas build:view [BUILD_ID]
```

---

## Next Steps (After First Release)

1. **Monitor Analytics**
   - Downloads, crashes, user ratings
   - Which languages are most used?

2. **Gather Feedback**
   - App Store reviews
   - User emails/support

3. **Plan Updates**
   - Fix bugs
   - Add features
   - Update laws/fines data

4. **Version 1.1 Process**
   - Update version in `app.json` → `1.0.1`
   - Build again: `eas build --platform ios --profile production`
   - Submit update in App Store Connect

---

## Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **App Store Connect**: https://appstoreconnect.apple.com/
- **Apple Developer**: https://developer.apple.com/
- **Expo Discord**: https://chat.expo.dev/ (community support)

---

## Summary Checklist

### Before Building:
- [ ] Apple Developer account ($99/year)
- [ ] Expo account (free)
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged in (`eas login`)
- [ ] App icon ready (1024×1024px)
- [ ] Splash screen ready
- [ ] Bundle identifier set (`app.json`)
- [ ] Version number set (`app.json`)

### Before Submitting:
- [ ] Production build successful
- [ ] Tested on real device (TestFlight)
- [ ] App Store Connect listing complete
- [ ] Screenshots prepared
- [ ] Description written
- [ ] Privacy questions answered

### Ready to Submit:
- [ ] All checks pass
- [ ] Submit for review
- [ ] Wait for approval (24-48 hours)

---

**Ready to start?** Begin with:
```bash
npm install -g eas-cli
eas login
eas build:configure
```

Good luck! 🚀

