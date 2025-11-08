# Native App Testing Guide

## Prerequisites

### For Android Studio:
- Install [Android Studio](https://developer.android.com/studio)
- Install Android SDK (API level 33 or higher)
- Set up an Android Virtual Device (AVD) or connect a physical device

### For Xcode (iOS):
- macOS required
- Install [Xcode](https://apps.apple.com/us/app/xcode/id497799835) from Mac App Store
- Install Xcode Command Line Tools: `xcode-select --install`
- iOS Simulator or physical iOS device

## Setup Steps

1. **Clone from GitHub and Install Dependencies**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>
   npm install
   ```

2. **Build the Web Assets**
   ```bash
   npm run build
   ```

3. **Add Native Platforms** (if not already added)
   ```bash
   npx cap add android
   npx cap add ios
   ```

4. **Sync Capacitor**
   ```bash
   npx cap sync
   ```

## Testing on Android Studio

1. **Open Android Project**
   ```bash
   npx cap open android
   ```
   Or manually open the `android` folder in Android Studio

2. **Wait for Gradle Sync**
   - Android Studio will automatically sync Gradle dependencies
   - This may take a few minutes on first run

3. **Select Device/Emulator**
   - Click the device dropdown in the toolbar
   - Select an existing AVD or create a new one
   - Or connect a physical device via USB (enable USB debugging)

4. **Run the App**
   - Click the green "Run" button or press `Shift + F10`
   - The app will build and launch on your selected device

5. **Enable Hot Reload (Optional)**
   - The app is configured to connect to: `https://2e849b3d-19e5-4563-af82-15ad125ce954.lovableproject.com`
   - Changes made in Lovable will reflect immediately without rebuilding

## Testing on Xcode (iOS)

1. **Open iOS Project**
   ```bash
   npx cap open ios
   ```
   Or manually open `ios/App/App.xcworkspace` in Xcode

2. **Select Target Device**
   - Click the device dropdown near the top-left
   - Select an iOS Simulator (e.g., iPhone 15 Pro)
   - Or select a physical device (requires Apple Developer account for signing)

3. **Configure Signing (Physical Device Only)**
   - Select the App target in the project navigator
   - Go to "Signing & Capabilities" tab
   - Select your team or create a free provisioning profile

4. **Run the App**
   - Click the "Play" button or press `Cmd + R`
   - The app will build and launch on your selected device

5. **Enable Hot Reload (Optional)**
   - Like Android, the app connects to the Lovable sandbox
   - Changes reflect immediately without rebuilding

## Testing Native Features

### Location Services
- Navigate to the Map page
- Grant location permissions when prompted
- Verify your location is displayed correctly

### Camera/Photo Upload
- Go to "Add Property" page
- Tap on "Photos & Videos" section
- Grant camera/photo permissions when prompted
- Test uploading images

### Status Bar
- Check that status bar matches app theme
- On iOS: Should show translucent dark style
- On Android: Should show dark background

### Safe Area Insets
- Test on devices with notches (iPhone X and newer)
- Verify bottom navigation doesn't overlap with home indicator
- Check that content respects safe areas

### Back Button (Android Only)
- Press the hardware back button
- Should navigate back in-app
- When at home screen, should exit the app

## Troubleshooting

### Android Build Fails
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

### iOS Build Fails
```bash
# Clean build folder
cd ios/App
rm -rf build
pod install
cd ../..
npx cap sync ios
```

### Hot Reload Not Working
- Check that your device/emulator has internet connection
- Verify the URL in `capacitor.config.ts` is correct
- Try rebuilding: `npm run build && npx cap sync`

### Permission Issues
- Delete the app from device/emulator
- Rebuild and reinstall
- Permissions will be requested fresh

## Making Changes

1. **For Code Changes:**
   - Make changes in Lovable editor
   - Changes reflect immediately via hot reload
   - Or run: `npm run build && npx cap sync` and rebuild

2. **For Native Configuration Changes:**
   - Edit files in `android/` or `ios/` folders
   - Rebuild the app in Android Studio or Xcode

3. **For Capacitor Plugin Changes:**
   - After installing new plugins with npm
   - Run: `npx cap sync`
   - Rebuild the app

## Production Build

### Android APK/Bundle
```bash
cd android
./gradlew assembleRelease  # For APK
./gradlew bundleRelease    # For App Bundle
```

### iOS Archive
1. Open Xcode
2. Product → Archive
3. Follow the App Store distribution process

## Support

For issues specific to:
- **Lovable Platform**: Check [Lovable Docs](https://docs.lovable.dev/)
- **Capacitor**: Check [Capacitor Docs](https://capacitorjs.com/docs)
- **Native Platforms**: Check Android/iOS documentation
