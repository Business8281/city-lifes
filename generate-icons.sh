#!/bin/bash

# Icon Generation Script for Citylifes Marketplace
# This script generates all required icon sizes for web, iOS, and Android

echo "🎨 Generating app icons for all platforms..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick is not installed. Installing via Homebrew..."
    brew install imagemagick
fi

# Base SVG file
SVG_FILE="public/icon.svg"

# Create temporary PNG at high resolution
echo "📦 Creating base PNG from SVG..."
# Transparent base for web/android assets
convert -background none -density 1024 "$SVG_FILE" -resize 1024x1024 temp_icon.png
# Opaque (no alpha) base for iOS app icons (Apple rejects transparency)
convert -background white -alpha remove -alpha off -density 1024 "$SVG_FILE" -resize 1024x1024 temp_icon_ios.png

# Web Icons
echo "🌐 Generating web favicons..."
convert temp_icon.png -resize 16x16 public/icon-16.png
convert temp_icon.png -resize 32x32 public/icon-32.png
convert temp_icon.png -resize 192x192 public/icon-192.png
convert temp_icon.png -resize 512x512 public/icon-512.png
convert temp_icon.png -resize 180x180 public/apple-touch-icon.png
convert temp_icon.png -resize 32x32 public/favicon.ico

# iOS App Icons (force opaque, strip alpha)
echo "📱 Generating iOS app icons..."
IOS_PATH="ios/App/App/Assets.xcassets/AppIcon.appiconset"

convert temp_icon_ios.png -strip -resize 20x20 "$IOS_PATH/AppIcon-20x20@1x.png"
convert temp_icon_ios.png -strip -resize 40x40 "$IOS_PATH/AppIcon-20x20@2x.png"
convert temp_icon_ios.png -strip -resize 60x60 "$IOS_PATH/AppIcon-20x20@3x.png"
convert temp_icon_ios.png -strip -resize 29x29 "$IOS_PATH/AppIcon-29x29@1x.png"
convert temp_icon_ios.png -strip -resize 58x58 "$IOS_PATH/AppIcon-29x29@2x.png"
convert temp_icon_ios.png -strip -resize 87x87 "$IOS_PATH/AppIcon-29x29@3x.png"
convert temp_icon_ios.png -strip -resize 40x40 "$IOS_PATH/AppIcon-40x40@1x.png"
convert temp_icon_ios.png -strip -resize 80x80 "$IOS_PATH/AppIcon-40x40@2x.png"
convert temp_icon_ios.png -strip -resize 120x120 "$IOS_PATH/AppIcon-40x40@3x.png"
convert temp_icon_ios.png -strip -resize 120x120 "$IOS_PATH/AppIcon-60x60@2x.png"
convert temp_icon_ios.png -strip -resize 180x180 "$IOS_PATH/AppIcon-60x60@3x.png"
convert temp_icon_ios.png -strip -resize 76x76 "$IOS_PATH/AppIcon-76x76@1x.png"
convert temp_icon_ios.png -strip -resize 152x152 "$IOS_PATH/AppIcon-76x76@2x.png"
convert temp_icon_ios.png -strip -resize 167x167 "$IOS_PATH/AppIcon-83.5x83.5@2x.png"
convert temp_icon_ios.png -strip -resize 1024x1024 "$IOS_PATH/AppIcon-512@2x.png"

# Android App Icons
echo "🤖 Generating Android app icons..."
ANDROID_RES="android/app/src/main/res"

# Launcher icons
convert temp_icon.png -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher.png"
convert temp_icon.png -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher.png"
convert temp_icon.png -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher.png"
convert temp_icon.png -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher.png"
convert temp_icon.png -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher.png"

# Round launcher icons
convert temp_icon.png -resize 48x48 "$ANDROID_RES/mipmap-mdpi/ic_launcher_round.png"
convert temp_icon.png -resize 72x72 "$ANDROID_RES/mipmap-hdpi/ic_launcher_round.png"
convert temp_icon.png -resize 96x96 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_round.png"
convert temp_icon.png -resize 144x144 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_round.png"
convert temp_icon.png -resize 192x192 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_round.png"

# Foreground icons
convert temp_icon.png -resize 108x108 "$ANDROID_RES/mipmap-mdpi/ic_launcher_foreground.png"
convert temp_icon.png -resize 162x162 "$ANDROID_RES/mipmap-hdpi/ic_launcher_foreground.png"
convert temp_icon.png -resize 216x216 "$ANDROID_RES/mipmap-xhdpi/ic_launcher_foreground.png"
convert temp_icon.png -resize 324x324 "$ANDROID_RES/mipmap-xxhdpi/ic_launcher_foreground.png"
convert temp_icon.png -resize 432x432 "$ANDROID_RES/mipmap-xxxhdpi/ic_launcher_foreground.png"

# Splash screens
echo "💦 Generating splash screens..."
convert temp_icon.png -resize 288x288 -background "#3E88A5" -gravity center -extent 1080x1920 "$ANDROID_RES/drawable-port-mdpi/splash.png"
convert temp_icon.png -resize 432x432 -background "#3E88A5" -gravity center -extent 1620x2880 "$ANDROID_RES/drawable-port-hdpi/splash.png"
convert temp_icon.png -resize 576x576 -background "#3E88A5" -gravity center -extent 2160x3840 "$ANDROID_RES/drawable-port-xhdpi/splash.png"
convert temp_icon.png -resize 864x864 -background "#3E88A5" -gravity center -extent 3240x5760 "$ANDROID_RES/drawable-port-xxhdpi/splash.png"
convert temp_icon.png -resize 1152x1152 -background "#3E88A5" -gravity center -extent 4320x7680 "$ANDROID_RES/drawable-port-xxxhdpi/splash.png"

# Landscape splash screens
convert temp_icon.png -resize 288x288 -background "#3E88A5" -gravity center -extent 1920x1080 "$ANDROID_RES/drawable-land-mdpi/splash.png"
convert temp_icon.png -resize 432x432 -background "#3E88A5" -gravity center -extent 2880x1620 "$ANDROID_RES/drawable-land-hdpi/splash.png"
convert temp_icon.png -resize 576x576 -background "#3E88A5" -gravity center -extent 3840x2160 "$ANDROID_RES/drawable-land-xhdpi/splash.png"
convert temp_icon.png -resize 864x864 -background "#3E88A5" -gravity center -extent 5760x3240 "$ANDROID_RES/drawable-land-xxhdpi/splash.png"
convert temp_icon.png -resize 1152x1152 -background "#3E88A5" -gravity center -extent 7680x4320 "$ANDROID_RES/drawable-land-xxxhdpi/splash.png"

# Clean up
rm -f temp_icon.png temp_icon_ios.png

echo "✅ All icons generated successfully!"
echo "📦 Run 'npx cap sync' to update native platforms"
