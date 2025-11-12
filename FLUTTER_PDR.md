# CityLifes - Flutter Rebuild PDR (Product Design & Requirements)

## Executive Summary
Complete clone of the React-based citylifes real estate marketplace app, rebuilt in Flutter for native iOS/Android performance with identical design, features, and functionality.

---

## 1. APP OVERVIEW

### App Name
**citylifes**

### Tagline
"Find your perfect space"

### Core Purpose
A real estate marketplace platform connecting property owners with potential renters/buyers, featuring residential properties, commercial spaces, and businesses with location-based search, messaging, favorites, and sponsored advertising.

### Target Platforms
- iOS (iPhone, iPad)
- Android (Phone, Tablet)
- Progressive Web App (PWA)

---

## 2. DESIGN SYSTEM

### Color Palette
```dart
// Primary Colors
const primaryBlue = Color(0xFF368AB6);      // RGB: 54, 138, 182
const primaryDark = Color(0xFF2D7298);      // Hover states
const secondaryYellow = Color(0xFFFBB040);  // RGB: 251, 176, 64

// Neutral Colors
const background = Color(0xFFFFFFFF);       // White
const foreground = Color(0xFF212121);       // Dark gray
const muted = Color(0xFFF5F5F5);            // Light gray
const mutedForeground = Color(0xFF666666);  // Medium gray
const border = Color(0xFFE0E0E0);           // Border gray

// Semantic Colors
const success = Color(0xFF10B981);          // Green
const error = Color(0xFFEF4444);            // Red
const warning = Color(0xFFF59E0B);          // Orange
```

### Typography
```dart
// Font Family: System Default
// iOS: SF Pro
// Android: Roboto

// Text Styles
displayLarge: 32sp, weight: 700
displayMedium: 28sp, weight: 700
displaySmall: 24sp, weight: 700
headlineLarge: 22sp, weight: 600
headlineMedium: 20sp, weight: 600
headlineSmall: 18sp, weight: 600
titleLarge: 16sp, weight: 600
titleMedium: 14sp, weight: 600
bodyLarge: 16sp, weight: 400
bodyMedium: 14sp, weight: 400
bodySmall: 12sp, weight: 400
```

### Spacing System
```dart
const spacing = {
  'xs': 4.0,
  'sm': 8.0,
  'md': 16.0,
  'lg': 24.0,
  'xl': 32.0,
  '2xl': 48.0,
};
```

### Border Radius
```dart
const borderRadius = {
  'sm': 4.0,
  'md': 8.0,
  'lg': 12.0,
  'xl': 16.0,
  'full': 999.0,
};
```

### Shadows
```dart
// Card Shadow
BoxShadow(
  color: Colors.black.withOpacity(0.1),
  blurRadius: 8,
  offset: Offset(0, 2),
)

// Elevated Shadow
BoxShadow(
  color: Colors.black.withOpacity(0.15),
  blurRadius: 16,
  offset: Offset(0, 4),
)
```

---

## 3. AUTHENTICATION SYSTEM

### Auth Pages

#### 3.1 Login/Signup Screen
**Route:** `/auth`

**Design:**
- Full-screen blue background (#368AB6)
- Centered white card with rounded corners
- Logo at top (building icon + "citylifes" text)
- Tabbed interface (Login | Sign Up)

**Login Tab Fields:**
- Email (with envelope icon)
- Password (with eye icon for show/hide)
- "Forgot Password?" link
- Blue "Login" button
- Terms & Privacy Policy text at bottom

**Signup Tab Fields:**
- Full Name
- Email
- Phone Number
- Password
- Confirm Password
- Blue "Sign Up" button
- Terms acceptance

**Validations:**
```dart
// Email: Valid email format
// Password: Min 6 characters
// Phone: 10 digits
// Name: Min 2 characters
```

**Features:**
- OTP email verification after signup
- Real-time field validation
- Error messages below fields
- Loading states on buttons

#### 3.2 OTP Verification Screen
**Triggered:** After signup

**Design:**
- Same blue background
- White card with OTP input
- 6-digit code input (large, centered)
- Resend OTP button
- Countdown timer (60 seconds)

#### 3.3 Forgot Password Screen
**Route:** `/forgot-password`

**Flow:**
1. Enter email
2. Receive 6-digit OTP
3. Enter new password
4. Confirm password
5. Success redirect to login

---

## 4. MAIN NAVIGATION

### Bottom Navigation Bar (Mobile)
**Position:** Fixed at bottom with safe area insets

**Items:**
1. **Home** (house icon)
2. **Listings** (grid icon)
3. **Messages** (chat bubble icon)
4. **Favorites** (heart icon)
5. **Profile** (user icon)

**Active State:**
- Primary blue color
- Bold icon weight

### Sidebar (Desktop/Tablet)
**Position:** Fixed left side

**Items:**
- Logo at top
- All navigation items
- Settings at bottom
- Logout button

---

## 5. CORE FEATURES & SCREENS

### 5.1 HOME SCREEN
**Route:** `/`

**Components:**

#### Hero Section
- Full-width image (cityscape)
- Overlay text: "Find Your Perfect Space"
- Search bar overlay

#### Search Bar
```dart
Components:
- Location selector (dropdown)
- Property type filter (residential/commercial/business)
- Search button
```

#### Sponsored Properties Section
- Horizontal scrollable cards
- "Sponsored" badge
- Premium positioning

#### Latest Properties Grid
- 2 columns (mobile)
- 3-4 columns (tablet/desktop)
- Infinite scroll
- Property cards

#### Property Card Design
```dart
Card {
  Image (aspect ratio 16:9)
  Badge: "For Rent" / "For Sale" (top-left)
  Heart icon (top-right) - favorite toggle
  
  Content:
    Title (2 lines max, ellipsis)
    Location (city, area)
    Price (large, bold)
    Details: Bedrooms • Bathrooms • Sqft
    
  Footer:
    Contact button
    View details button
}
```

### 5.2 LISTINGS SCREEN
**Route:** `/listings`

**Features:**

#### Header
- Search bar
- Filter button (opens bottom sheet)
- Sort dropdown
- View toggle (grid/list)

#### Filters (Bottom Sheet)
```dart
Filters:
- Location (City/Area/Pin Code/GPS)
- Property Type (Residential/Commercial/Business)
- Price Range (slider)
- Bedrooms (0-5+)
- Bathrooms (0-5+)
- Area (sqft range)
- Status (For Rent/For Sale)
- Amenities (multi-select checkboxes):
  * Parking
  * Gym
  * Swimming Pool
  * Security
  * Power Backup
  * Lift
  * Garden
  * Clubhouse
  * WiFi
  * Furnished
  
Buttons:
- Clear All
- Apply Filters
```

#### Location Selector
**Modal Dialog with tabs:**

1. **City Tab:** Dropdown of Indian cities
2. **Area Tab:** Text input for locality
3. **Pin Code Tab:** 6-digit input
4. **Live Location Tab:** GPS with 10km radius

#### Results Display
- Property count at top
- Cards in grid/list view
- Loading shimmer effect
- "No results" state with illustration
- Pagination or infinite scroll

### 5.3 PROPERTY DETAILS SCREEN
**Route:** `/property/:id`

**Layout:**

#### Image Gallery
- Full-width carousel
- Dot indicators
- Zoom capability
- Swipe navigation

#### Property Header
```dart
Title (large, bold)
Location (with map icon)
Price (prominent)
"For Rent" / "For Sale" badge
Favorite heart (top-right)
```

#### Details Section
```dart
Key Information:
- Property Type
- Bedrooms
- Bathrooms
- Area (sqft)
- Furnishing Status
- Available From
- Age of Property

Location Details:
- Full Address
- Pin Code
- Embedded Google Map
- "Get Directions" button
```

#### Amenities Grid
- Icon + label for each amenity
- 2-3 columns
- Checkmark icons

#### Description
- Full text description
- "Read more" expansion

#### Contact Section
```dart
Owner/Agent Info:
- Name
- Phone (with call button)
- Email
- WhatsApp button
- "Send Message" button
```

#### Action Buttons (Fixed Bottom)
- Share button
- Contact Owner button
- Schedule Visit button

### 5.4 ADD PROPERTY SCREEN
**Route:** `/add-property`

**Multi-step Form:**

#### Step 1: Property Type
- Radio buttons: Residential / Commercial / Business
- Next button

#### Step 2: Basic Details
```dart
Fields:
- Property Title*
- Description (textarea, max 2000 chars)
- Property Type* (House/Apartment/Plot/Office/Shop/etc)
- Transaction Type* (For Rent/For Sale)
- Price*
- Price Type (Monthly/Yearly/Total)
```

#### Step 3: Location
```dart
Fields:
- City* (dropdown)
- Area/Locality*
- Pin Code* (6 digits)
- Full Address
- Latitude/Longitude (auto-fill or manual)
```

#### Step 4: Property Details
```dart
Fields:
- Bedrooms (0-10+)
- Bathrooms (0-10+)
- Area (sqft)*
- Furnishing (Unfurnished/Semi/Fully)
- Age of Property
- Floor Number
- Total Floors
- Parking
```

#### Step 5: Amenities
- Multi-select checkboxes
- All amenities list

#### Step 6: Images
```dart
Features:
- Upload up to 10 images
- Drag to reorder
- First image is thumbnail
- Image preview
- Delete images
- Max size: 5MB per image
- Supported: JPG, PNG, WebP
```

#### Step 7: Contact Info
```dart
Fields:
- Contact Name*
- Contact Phone*
- Contact Email
- I am: Owner / Agent (toggle)
```

#### Step 8: Review & Submit
- Show all entered data
- Edit any section
- Terms checkbox
- Submit button

**Validation:**
- Required fields marked with *
- Real-time validation
- Error messages
- Can't proceed without valid data

**Draft Saving:**
- Auto-save to local storage
- Resume editing
- Discard draft option

### 5.5 MY LISTINGS SCREEN
**Route:** `/my-listings`

**Features:**

#### Header
- "My Properties" title
- Add New button (FAB)
- Filter by status

#### Property Cards
```dart
Enhanced Card with:
- All standard property info
- Status badge:
  * Available (green)
  * Rented (orange)
  * Unavailable (gray)
  
- Action Menu (3 dots):
  * Edit
  * Mark as Rented
  * Mark as Available
  * Delete
  * Promote (Ad Campaign)
  
- Stats:
  * Views count
  * Favorites count
  * Messages count
```

#### Status Update
- Quick status toggle
- Confirmation dialogs
- Success notifications

#### Delete Confirmation
```dart
AlertDialog:
"Are you sure you want to delete this property?"
"This will also delete:
 • All images
 • Messages related to this property
 • Favorites
 • Ad campaigns
 This action cannot be undone."
 
Buttons: Cancel / Delete (red)
```

### 5.6 MESSAGES SCREEN
**Route:** `/messages`

**Layout:** Split screen on tablet/desktop

#### Conversation List (Left Panel)
```dart
List Items:
- User avatar (first letter)
- User name
- Last message preview (1 line)
- Timestamp
- Unread badge (count)
- Property thumbnail
- Swipe to delete (mobile)

Features:
- Search conversations
- Sort by recent
- Pull to refresh
```

#### Chat View (Right Panel)
```dart
Header:
- Back button (mobile)
- User name
- Property title (subtitle)
- More menu:
  * View Property
  * Delete Conversation
  * Block User

Messages:
- Sent messages (right, blue bubble)
- Received messages (left, gray bubble)
- Timestamp
- Read receipts
- Edit/Delete menu (long press)

Input Area:
- Text field
- Send button
- Character count (max 2000)
```

**Real-time:**
- New messages appear instantly
- Typing indicators
- Online status
- Message delivery status

**Features:**
- Edit message (within 5 min)
- Delete message
- Copy message
- Message reactions (future)

### 5.7 FAVORITES SCREEN
**Route:** `/favorites`

**Design:**
- Grid of property cards
- Same design as listings
- Remove from favorites (heart toggle)
- Empty state with illustration
- "Browse properties" CTA

**Features:**
- Quick contact owner
- Share property
- Remove from favorites
- Sort by date added/price

### 5.8 MAP VIEW SCREEN
**Route:** `/map`

**Components:**

#### Google Maps Integration
```dart
Features:
- Property markers (pins)
- Cluster markers (many properties)
- Custom marker icons
- Info window on tap
- Filter by visible area
- Current location button
```

#### Map Controls
- Search box at top
- Filter button
- Current location button
- Zoom controls
- Map type (standard/satellite)

#### Property Preview Card
- Shows on marker tap
- Bottom sheet
- Mini property card
- "View Details" button

### 5.9 PROFILE SCREEN
**Route:** `/profile`

**Layout:**

#### Profile Header
```dart
Avatar (large, circular)
Full Name (bold)
Email
Phone
"Edit Profile" button
```

#### Menu Items
```dart
List:
- My Listings (with count badge)
- My Favorites (with count badge)
- My Ad Campaigns
- Notifications Settings
- Change Password
- Terms & Conditions
- Privacy Policy
- Help & Support
- About
- Logout (red text)
```

### 5.10 EDIT PROFILE SCREEN
**Route:** `/profile/edit`

**Fields:**
```dart
- Profile Photo (upload/camera)
- Full Name*
- Email* (disabled, verified)
- Phone Number*
- Save Changes button
```

### 5.11 AD CAMPAIGN SCREEN
**Route:** `/ad-campaign`

**Purpose:** Promote properties as sponsored ads

**Features:**

#### Campaign List
```dart
Card:
- Property thumbnail
- Property title
- Campaign status (Active/Paused/Completed)
- Budget: ₹X / ₹Y spent
- Impressions: X
- Clicks: X
- Start/End date
- Actions: Edit / Pause / Resume / Delete
```

#### Create Campaign Dialog
```dart
Form:
- Select Property (dropdown)
- Campaign Title
- Budget (₹)
- Start Date
- End Date
- Target Locations (multi-select)
- Preview

Submit: "Create Campaign"
```

**Billing:**
- Pay per impression (CPM model)
- Minimum budget: ₹500
- Payment integration

### 5.12 NOTIFICATIONS SCREEN
**Route:** `/notifications`

**Types:**
```dart
Notification Categories:
1. New Message
2. Property Inquiry
3. Favorite Property Updated
4. Ad Campaign Status
5. System Announcements

Card Design:
- Icon (based on type)
- Title (bold)
- Message (2 lines)
- Timestamp
- Read/Unread indicator (dot)
- Action button (if applicable)
```

**Features:**
- Mark as read
- Mark all as read
- Delete notification
- Clear all
- Pull to refresh

### 5.13 SETTINGS SCREEN
**Route:** `/settings`

**Sections:**

#### Account Settings
- Email notifications (toggle)
- Push notifications (toggle)
- SMS alerts (toggle)

#### Privacy
- Profile visibility
- Show phone number
- Show email

#### App Preferences
- Language (English/Hindi)
- Theme (Light/Dark/System)
- Default location

#### Data Management
- Clear cache
- Download my data
- Delete account (with confirmation)

---

## 6. ADMIN FEATURES

### 6.1 ADMIN DASHBOARD
**Route:** `/admin`

**Access:** Only for admin users

**Metrics Cards:**
```dart
Stats:
- Total Users
- Total Properties
- Active Listings
- Total Messages
- Ad Revenue
- Active Campaigns
```

**Sections:**

#### User Management
```dart
Table:
- User ID
- Name
- Email
- Role (User/Admin)
- Status (Active/Suspended)
- Actions: Edit / Suspend / Delete
```

#### Property Management
```dart
Table:
- Property ID
- Title
- Owner
- Status
- Created Date
- Actions: View / Edit / Verify / Delete
```

#### Campaign Analytics
- Chart: Revenue over time
- Active campaigns list
- Performance metrics

---

## 7. TECHNICAL SPECIFICATIONS

### 7.1 Flutter Architecture

#### State Management
```dart
Provider: Riverpod 2.0+
├── AuthProvider
├── PropertyProvider
├── MessageProvider
├── FavoriteProvider
├── LocationProvider
└── CampaignProvider
```

#### Project Structure
```
lib/
├── main.dart
├── app.dart
├── core/
│   ├── constants/
│   ├── themes/
│   ├── utils/
│   └── config/
├── data/
│   ├── models/
│   ├── repositories/
│   └── services/
├── domain/
│   ├── entities/
│   └── usecases/
├── presentation/
│   ├── screens/
│   ├── widgets/
│   └── providers/
└── routes/
    └── app_router.dart
```

### 7.2 Backend Integration

#### Supabase Setup
```dart
Database Tables:
1. profiles (users)
2. properties
3. favorites
4. messages
5. notifications
6. ad_campaigns
7. inquiries
8. audit_logs

Storage Buckets:
- property-images
- profile-avatars

Authentication:
- Email/Password
- OTP verification
- Password reset
```

#### API Endpoints (RPC Functions)
```dart
Functions:
- search_properties_by_location()
- get_sponsored_properties()
- get_property_stats()
- get_user_stats()
```

### 7.3 Data Models

#### Property Model
```dart
class Property {
  final String id;
  final String userId;
  final String title;
  final String? description;
  final String propertyType;
  final double price;
  final String priceType;
  final String city;
  final String area;
  final String pinCode;
  final String? address;
  final double? latitude;
  final double? longitude;
  final int? bedrooms;
  final int? bathrooms;
  final double? areaSqft;
  final List<String> images;
  final List<String> amenities;
  final String status;
  final bool verified;
  final bool available;
  final String? contactName;
  final String? contactPhone;
  final String? contactEmail;
  final bool isAgent;
  final int views;
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

#### Message Model
```dart
class Message {
  final String id;
  final String senderId;
  final String receiverId;
  final String? propertyId;
  final String content;
  final bool read;
  final bool deleted;
  final bool edited;
  final DateTime? editedAt;
  final DateTime createdAt;
}
```

#### User Profile Model
```dart
class UserProfile {
  final String id;
  final String email;
  final String? fullName;
  final String? avatarUrl;
  final String? phone;
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

### 7.4 Required Packages

```yaml
dependencies:
  flutter: sdk
  
  # State Management
  flutter_riverpod: ^2.4.0
  
  # Backend
  supabase_flutter: ^2.0.0
  
  # UI
  google_fonts: ^6.0.0
  flutter_svg: ^2.0.0
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  lottie: ^3.0.0
  
  # Navigation
  go_router: ^13.0.0
  
  # Maps
  google_maps_flutter: ^2.5.0
  geolocator: ^11.0.0
  geocoding: ^2.1.0
  
  # Media
  image_picker: ^1.0.0
  image_cropper: ^5.0.0
  photo_view: ^0.14.0
  
  # Forms & Validation
  flutter_form_builder: ^9.0.0
  form_builder_validators: ^9.0.0
  
  # Utilities
  intl: ^0.19.0
  url_launcher: ^6.2.0
  share_plus: ^7.2.0
  path_provider: ^2.1.0
  shared_preferences: ^2.2.0
  uuid: ^4.0.0
  
  # Notifications
  flutter_local_notifications: ^16.0.0
  firebase_messaging: ^14.7.0
  
  # Analytics
  firebase_analytics: ^10.7.0
  
  # Others
  carousel_slider: ^4.2.0
  flutter_rating_bar: ^4.0.1
  timeago: ^3.6.0
```

### 7.5 Permissions Required

#### iOS (Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show nearby properties</string>

<key>NSCameraUsageDescription</key>
<string>Take photos of your property</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Select photos from gallery</string>
```

#### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

---

## 8. SECURITY & DATA POLICIES

### 8.1 Row Level Security (RLS)
```sql
Properties:
- Users can read all active properties
- Users can create their own properties
- Users can update/delete only their properties
- Admins can do everything

Messages:
- Users can only see their own conversations
- Users can only send/receive their messages

Favorites:
- Users can only manage their own favorites
```

### 8.2 Data Validation
- All inputs sanitized
- SQL injection prevention
- XSS protection
- Image file validation
- Phone/email format validation

### 8.3 Privacy
- GDPR compliant
- User data export
- Right to deletion
- Encryption at rest
- Secure connections (HTTPS)

---

## 9. PERFORMANCE REQUIREMENTS

### 9.1 Speed
- App launch: < 2 seconds
- Screen navigation: < 300ms
- Image load: Progressive (with shimmer)
- API calls: < 1 second
- Search results: < 2 seconds

### 9.2 Optimization
- Image compression (WebP format)
- Lazy loading lists
- Pagination (50 items per page)
- Caching (images, data)
- Debounced search inputs

### 9.3 Offline Support
- Cache recent properties
- Cache user profile
- Cache conversations
- Offline queue for messages
- Sync when online

---

## 10. ANALYTICS & TRACKING

### Events to Track
```dart
Events:
- user_signup
- user_login
- property_viewed
- property_favorited
- message_sent
- property_listed
- campaign_created
- search_performed
- filter_applied
- share_property
```

---

## 11. TESTING REQUIREMENTS

### 11.1 Unit Tests
- Business logic
- Data models
- Validators
- Utilities

### 11.2 Widget Tests
- All custom widgets
- Forms
- Buttons
- Cards

### 11.3 Integration Tests
- User flows
- Navigation
- API calls
- State management

### 11.4 Manual Testing
- iOS devices (iPhone 12+)
- Android devices (Android 10+)
- Tablets
- Different screen sizes
- Network conditions

---

## 12. DEPLOYMENT

### 12.1 iOS
- Apple Developer Account
- App Store submission
- TestFlight beta testing
- Version management

### 12.2 Android
- Google Play Console
- Internal/Beta testing
- Production release
- App Bundle (AAB)

### 12.3 CI/CD
- GitHub Actions
- Automated builds
- Automated tests
- Code quality checks

---

## 13. FUTURE ENHANCEMENTS

### Phase 2 Features
- Video property tours
- Virtual 3D tours
- Property comparison
- Saved searches
- Property alerts
- Chat with AI bot
- Property valuation tool
- Mortgage calculator
- Legal document management
- E-signatures
- Payment gateway integration
- Review/rating system
- Property recommendations (ML)

---

## 14. DELIVERABLES

### Code
- Complete Flutter source code
- Documentation
- API documentation
- Architecture diagrams

### Design
- Figma files (all screens)
- Design system guide
- Component library
- Icon assets

### Documentation
- Technical documentation
- API documentation
- User guide
- Admin guide
- Deployment guide

### Testing
- Test cases
- Test reports
- Bug tracking
- Performance reports

---

## 15. TIMELINE ESTIMATE

### Phase 1: Setup & Architecture (1 week)
- Project setup
- Dependencies
- Supabase integration
- Base architecture

### Phase 2: Authentication (1 week)
- Login/Signup
- OTP verification
- Forgot password
- Profile management

### Phase 3: Property Features (3 weeks)
- Property listing
- Property details
- Add property
- My listings
- Favorites
- Search & filters

### Phase 4: Communication (1 week)
- Messaging system
- Notifications
- Real-time updates

### Phase 5: Maps & Location (1 week)
- Google Maps integration
- Location search
- GPS features

### Phase 6: Ad Campaigns (1 week)
- Campaign creation
- Campaign management
- Analytics

### Phase 7: Admin Panel (1 week)
- Dashboard
- User management
- Property management

### Phase 8: Polish & Testing (2 weeks)
- UI refinements
- Bug fixes
- Testing
- Performance optimization

### Phase 9: Deployment (1 week)
- App Store submission
- Play Store submission
- Documentation

**Total: 12 weeks (3 months)**

---

## 16. SUPPORT & MAINTENANCE

- Bug fixes
- OS updates compatibility
- Security patches
- Feature updates
- Performance monitoring
- User feedback integration

---

## APPENDIX

### A. Database Schema
(Refer to existing Supabase database)

### B. API Endpoints
(Refer to Supabase RPC functions)

### C. Assets Required
- Logo (SVG, PNG)
- Icons (all states)
- Placeholder images
- Illustrations
- Animations (Lottie)

---

**Document Version:** 1.0  
**Date:** November 11, 2025  
**Status:** Ready for Development
