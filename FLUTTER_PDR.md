# CityLifes - Flutter Rebuild PRD (Product Design & Requirements)

## Executive Summary
Complete clone of the React-based Citylifes real estate marketplace app, rebuilt in Flutter for native iOS/Android performance with **identical UI/UX, features, and functionality**. This document ensures 1:1 parity with the React web application.

---

## 1. APP OVERVIEW

### App Name
**citylifes**

### Tagline
"Find your perfect space"

### Core Purpose
A unified hyperlocal marketplace platform for Indian cities combining:
- Property rentals and sales (Homes, Apartments, Flats, Commercial, Offices, PGs, Hostels, Hotels, Restaurants, Cafés, Farmhouses, Warehouses, Farmlands)
- Vehicle listings (Cars, Bikes)
- Electronics (Laptops, Mobiles, Accessories)
- Business Listings (Google My Business style)

### Core Values
- **Zero broker** → Direct owner-to-user communication
- **Hyperlocal dominance** → City → Area → Street level targeting
- **Fastest search & listing** creation
- **Verified owners & verified listings**
- **100% mobile-first UX**
- **Transparency, trust, and easy communication**

### Target Platforms
- iOS (iPhone, iPad)
- Android (Phone, Tablet)
- PWA (Progressive Web App)

---

## 2. DESIGN SYSTEM

### Color Palette (HSL Format - Matches React App)
```dart
// Primary Colors
const primaryBlue = Color(0xFF2C6E91);      // HSL: 200, 54%, 37% - Brand Blue
const primaryDark = Color(0xFF245A78);      // Hover states
const secondaryOrange = Color(0xFFF5A623); // Accent Orange

// Background & Foreground
const background = Color(0xFFFFFFFF);       // White (light mode)
const backgroundDark = Color(0xFF1E293B);   // Dark (dark mode)
const foreground = Color(0xFF1E293B);       // Dark gray
const foregroundDark = Color(0xFFF8FAFC);   // Light (dark mode)

// Neutral Colors
const muted = Color(0xFFF1F5F9);            // Muted background
const mutedForeground = Color(0xFF64748B); // Muted text
const border = Color(0xFFE2E8F0);           // Border color
const card = Color(0xFFFFFFFF);             // Card background
const cardDark = Color(0xFF1E293B);         // Card dark mode

// Semantic Colors
const success = Color(0xFF10B981);          // Green - Emerald 500
const error = Color(0xFFEF4444);            // Red - Red 500
const warning = Color(0xFFF59E0B);          // Orange - Amber 500
const info = Color(0xFF3B82F6);             // Blue - Blue 500

// Charts & Accents (from React app)
const chart1 = Color(0xFFE76E50);
const chart2 = Color(0xFF2A9D90);
const chart3 = Color(0xFF274754);
const chart4 = Color(0xFFE8C468);
const chart5 = Color(0xFFF4A462);
```

### Typography
```dart
// Font Family: System Default (matches web)
// iOS: SF Pro
// Android: Roboto

// Text Styles (matching Tailwind/React)
displayLarge: 36px, weight: 800 (font-extrabold)
displayMedium: 30px, weight: 700 (font-bold)
displaySmall: 24px, weight: 700 (font-bold)
headlineLarge: 22px, weight: 600 (font-semibold)
headlineMedium: 20px, weight: 600 (font-semibold)
headlineSmall: 18px, weight: 600 (font-semibold)
titleLarge: 18px, weight: 500 (font-medium)
titleMedium: 16px, weight: 500 (font-medium)
titleSmall: 14px, weight: 500 (font-medium)
bodyLarge: 16px, weight: 400 (font-normal)
bodyMedium: 14px, weight: 400 (font-normal)
bodySmall: 12px, weight: 400 (font-normal)
labelLarge: 14px, weight: 500
labelMedium: 12px, weight: 500
labelSmall: 11px, weight: 500
```

### Spacing System
```dart
const spacing = {
  'xs': 4.0,    // 0.25rem
  'sm': 8.0,    // 0.5rem
  'md': 16.0,   // 1rem
  'lg': 24.0,   // 1.5rem
  'xl': 32.0,   // 2rem
  '2xl': 48.0,  // 3rem
  '3xl': 64.0,  // 4rem
};
```

### Border Radius
```dart
const borderRadius = {
  'sm': 4.0,
  'md': 8.0,
  'lg': 12.0,
  'xl': 16.0,
  '2xl': 24.0,
  'full': 9999.0,
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

// Subtle Shadow
BoxShadow(
  color: Colors.black.withOpacity(0.05),
  blurRadius: 4,
  offset: Offset(0, 1),
)
```

---

## 3. AUTHENTICATION SYSTEM

### Auth Methods

#### Email/Password
- Sign up with email verification (OTP)
- Login with email/password
- Password reset flow with OTP
- Email change with OTP verification

#### Google OAuth
- Sign up with Google account
- Login with existing Google account
- **Display all previously used Google accounts** for re-login
- Auto-populate profile data (name, email)

### Auth Pages

#### 3.1 Login/Signup Screen
**Route:** `/auth`

**Design:**
- Full-screen gradient background (primary blue to primary dark)
- Centered white card with rounded corners (radius: 16px)
- Logo at top: Citylifes building icon + "citylifes" text
- Tabbed interface (Login | Sign Up) using segmented control

**Login Tab Fields:**
- Email (with envelope icon, email keyboard)
- Password (with eye icon for show/hide)
- "Forgot Password?" link (right-aligned, primary color)
- Blue "Login" button (full width, rounded-lg)
- Divider with "or continue with"
- Google Sign-In button (outlined, Google icon)
- Terms & Privacy Policy text at bottom (muted, links)

**Signup Tab Fields:**
- Full Name (person icon)
- Email (envelope icon)
- Phone Number (phone icon, 10-digit validation)
- Password (lock icon, min 6 chars)
- Confirm Password (lock icon)
- Blue "Sign Up" button
- Google Sign-Up button
- Terms acceptance checkbox

**Validations:**
```dart
// Email: Valid email format (regex)
// Password: Min 6 characters
// Phone: Exactly 10 digits, Indian format
// Name: Min 2 characters
// Passwords must match
```

**Features:**
- Real-time field validation with error messages
- Loading states on buttons (circular progress)
- Error toasts for failed auth
- Success navigation to home or profile setup

#### 3.2 OTP Verification Screen
**Triggered:** After signup (email verification)

**Design:**
- Same gradient background as auth
- White card with OTP input
- 6-digit code input (large boxes, auto-focus next)
- Email display with mask (e***@gmail.com)
- Resend OTP button (disabled during countdown)
- Countdown timer (60 seconds)

#### 3.3 Forgot Password Screen
**Route:** `/forgot-password`

**Flow:**
1. Enter email → Validate → Send OTP
2. Enter 6-digit OTP
3. Enter new password + confirm
4. Success → Redirect to login

#### 3.4 Profile Setup Screen
**Route:** `/setup-profile`
**Triggered:** After first login if `user_metadata.profile_completed = false`

**Fields:**
- Full Name (required)
- Phone Number (required, 10 digits)
- Submit button

**Logic:**
1. Upsert to `profiles` table
2. Update `user_metadata.profile_completed = true`
3. Navigate to home

---

## 4. MAIN NAVIGATION

### Bottom Navigation Bar (Mobile)
**Position:** Fixed at bottom with safe area insets
**Height:** 64px + safe area

**Items:**
1. **Home** (House icon) → `/`
2. **Listings** (Grid icon) → `/listings`
3. **Add** (Plus in circle, centered, elevated) → `/add-property`
4. **Messages** (Chat bubble icon, badge for unread) → `/messages`
5. **Profile** (User icon) → `/profile`

**Active State:**
- Primary blue color
- Icon fill (not outline)
- Label bold

### Sidebar (Desktop/Tablet)
**Position:** Fixed left side
**Width:** 280px

**Items:**
- Logo at top (clickable → home)
- Home
- Listings
- Map View
- Favorites
- My Listings
- Messages (with unread badge)
- Leads
- CRM
- Ad Campaigns
- Divider
- Settings
- Logout (red text)

---

## 5. CORE FEATURES & SCREENS

### 5.1 HOME SCREEN (INDEX)
**Route:** `/`

**Components:**

#### Hero Section
- Full-width image (cityscape background)
- Gradient overlay (black 50% to 70%)
- Centered text: "Find Your Perfect Space" (white, bold, 30px)
- Subtitle: "Rent properties, vehicles, and businesses across India" (white/90%, 14px)
- Height: 280px mobile, 400px tablet/desktop

#### Location & Sort Bar
- Left: Location button (MapPin icon + location text or "All cities")
  - Click opens LocationSelector modal
- Right: Sort dropdown (Most Recent, Price: Low-High, Price: High-Low)

#### Browse by Category Section
- Header: "Browse by Category" with "View All" link
- Horizontal scrollable chips/buttons
- Each chip: Icon emoji + label
- Categories: 🏠 Home, 🏢 Apartment, 🏬 Commercial, 🏪 Office, 🌾 Farmland, 🛏️ PG, 🏨 Hotel, 🍽️ Restaurant, ☕ Café, 🏡 Farmhouse, 🏭 Warehouse, 🚗 Car, 🏍️ Bike, 📱 Electronics, 💼 Business

#### Property Listings Grid
- 2 columns (mobile), 3 columns (tablet), 4 columns (desktop)
- **Infinite scroll** (load 12 more on scroll)
- PropertyCard component for each listing
- Show count: "Showing X of Y"

#### Call to Action Section
- Gradient background (primary to primary/80%)
- Rounded card (16px)
- "Have a property to rent?" heading
- "List your property..." subtext
- "Post Your Property" button (secondary variant)

### 5.2 LISTINGS SCREEN
**Route:** `/listings`

**Features:**

#### Header Bar
- Search bar (click opens enhanced search)
- Filter button (opens filter bottom sheet)
- Map toggle button (navigate to map view)

#### Category Tabs
- Horizontal scrollable tabs
- "All" + all category types
- Active tab: primary color, underline

#### Sponsored Carousel (if active campaigns)
- Horizontal carousel at top
- "Sponsored" label on carousel header (NOT on cards)
- Auto-rotate every 5 seconds
- Dot indicators
- PromotedListingCard component

#### Filter Bottom Sheet
```dart
Filters:
- Location Section:
  - City dropdown (Indian cities)
  - Area text input with autocomplete
  - Pin Code (6 digits)
  - "Use Live Location" button with radius selector
  
- Property Type:
  - Multi-select chips for all categories
  
- Price Range:
  - Min-Max slider
  - Quick select buttons (Under ₹10K, ₹10K-25K, etc.)
  
- Price Type:
  - Sale / Rent / Daily
  
- Bedrooms (for applicable categories):
  - 1, 2, 3, 4, 5+ buttons
  
- Bathrooms:
  - 1, 2, 3, 4, 5+ buttons
  
- Area (sqft):
  - Min-Max range
  
- Amenities (multi-select chips):
  * Parking, Gym, Swimming Pool, Security
  * Power Backup, Lift, Garden, Clubhouse
  * WiFi, Furnished, AC, Water Supply
  
Buttons:
- "Clear All" (outlined)
- "Apply Filters" (primary, full width)
```

#### Near Me Filter
- "Near Me" toggle button
- Opens radius selector: 5km, 10km, 25km
- Uses GPS location
- Shows distance on property cards

#### Results Display
- Grid layout (2 columns mobile)
- PropertyCard components
- Loading shimmer effect (skeleton)
- Empty state: Illustration + "No properties found" + "Clear filters" button
- Infinite scroll pagination

### 5.3 PROPERTY DETAILS SCREEN
**Route:** `/property/:id`

**Layout:**

#### Image Gallery
- Full-width carousel with swipe
- Aspect ratio: 1:1 (square images)
- Dot indicators at bottom
- Pinch to zoom
- Tap to view full screen gallery
- Share button (top right)
- Back button (top left, circular with blur background)
- Favorite heart (top right)

#### Property Header Card
```dart
Row:
  - Status badge ("For Rent" / "For Sale" / "Daily Rent")
  - Verified badge (if verified) - blue checkmark
  - Agent badge (if is_agent) - gray
  
Title (large, bold, 2 lines max)

Location (MapPin icon + area, city)

Price Section:
  - Price (large, bold, primary color)
  - Price type ("/month", "/day", "One-time")
```

#### Quick Stats Row (for properties with rooms)
```dart
Row of stats cards:
- Bedrooms (bed icon + count)
- Bathrooms (bath icon + count)  
- Area (sqft icon + value)
```

#### Details Section
```dart
Card with sections:

"Property Details" header

Grid of detail items:
- Property Type
- Category
- Furnishing Status
- Available From
- Floor Number
- Total Floors
- Target Audience (Bachelors/Families)
- PG Type (Boys/Girls/Co-living) - if PG

For Vehicles (Car/Bike):
- Brand
- Model
- Year
- Fuel Type
- Transmission
- KM Driven
- Owners

For Electronics:
- Electronics Type
- Brand
- Model
- Condition
- Warranty
- Year of Purchase
```

#### Amenities Section
```dart
"Amenities" header

Grid of amenity chips:
- Icon + label for each amenity
- Checkmark or relevant icon
- 2-3 columns
```

#### Description Section
```dart
"About this property" header (hidden for business/electronics)

Expandable text (show first 200 chars)
"Read more" button
```

#### Location Section
```dart
"Location" header

Full address display

Embedded Google Map (static or interactive)
- Property marker
- "Get Directions" button
```

#### Business Details Section (for business listings only)
```dart
"Business Details" card

Top-right corner: 5-star rating display
  - Average rating (X.X ★)
  - "(Y reviews)" link
  - Clickable → opens review dialog

Business Category
Year Established
Number of Employees
Services Offered

Operating Hours:
  - Weekday list (Monday-Sunday order)
  - Open/Closed status
  - Hours (09:00 - 18:00)

Social Media Links:
  - Website, Facebook, Instagram, Twitter, LinkedIn
  - Clickable icons

Business Details:
  - GST Number
  - Business License
```

#### Reviews Section (for business listings)
```dart
"Reviews" header

If user can review:
  - "Write a Review" button

Reviews list:
  - ReviewCard for each review
  - Reviewer name, avatar
  - Star rating
  - Review title
  - Comment text
  - Date
  - Verified badge (if verified)

Pagination or "Load More"
```

#### Contact Section
```dart
Card:
  Owner/Agent name
  "Contact Owner" button (opens LeadCaptureDialog)
```

#### Owner Info Card
```dart
Card:
  Avatar (initials or image)
  Name
  "View Profile" link → /user-profile/:userId
  
  Rating display (from useOwnerRating):
    - X.X ★ average
    - (Y reviews)
```

#### Action Buttons (Fixed Bottom Sheet)
```dart
Row:
  - Share button (icon)
  - Chat button (MessageCircle icon) → creates lead + navigates to chat
  - Call button (Phone icon) → creates lead + initiates call

For owner viewing own listing:
  - Edit button → /add-property?edit=:id
```

### 5.4 ADD PROPERTY SCREEN
**Route:** `/add-property`
**Query param:** `?edit=:id` for editing

**Multi-step Form with Stepper:**

#### Step 1: Category Selection
- Grid of category cards
- Icon + label for each
- Single selection (radio behavior)
- Categories: Home, Apartment, Flat, Commercial, Office, Farmland, PG, Hotel, Restaurant, Café, Farmhouse, Warehouse, Car, Bike, Electronics, Business

#### Step 2: Basic Details
```dart
Fields (varies by category):

Common:
- Title* (text, max 100 chars)
- Description (textarea, max 2000 chars)
- Listing Type* (Sale/Rent/Daily) - dropdown

For Properties:
- Target Audience (Bachelors/Families/Both) - if applicable
- PG Type (Boys/Girls/Co-living) - if PG category

For Vehicles (Car/Bike):
- Brand* (searchable dropdown)
- Model* (searchable dropdown)
- Year* (dropdown 1990-current)
- Fuel Type* (Petrol/Diesel/Electric/CNG/Hybrid)
- Transmission (Manual/Automatic) - Car only
- KM Driven* (number)
- Owners* (1st/2nd/3rd/4th+)

For Electronics:
- Electronics Type* (Laptop/Mobile/Tablet/TV/Camera/Other)
- Brand* (text or dropdown)
- Model* (text)
- Condition* (Excellent/Good/Fair/Poor)
- Warranty (Yes/No + months)
- Year of Purchase

For Business:
- Business Type* (searchable dropdown - 60+ types)
- Business Category*
- Year Established
- Number of Employees
- Services (multi-line text)
- Operating Hours (weekday schedule)
- Social Media Links (Website, Facebook, Instagram, Twitter, LinkedIn)
- GST Number, Business License
```

#### Step 3: Price
```dart
For non-business listings:
- Price* (number input with ₹ prefix)
- Price Type (Monthly/Yearly/Daily/One-time)

For business listings:
- Price is optional (defaults to 0)
- Hide price display on listing
```

#### Step 4: Location
```dart
Fields:
- City* (searchable dropdown - Indian cities)
- Area/Locality* (autocomplete from database)
- Pin Code* (6 digits, validates)
- Full Address (textarea)

Buttons:
- "Use Live Location" (GPS icon)
  - Detects coordinates
  - Reverse geocodes to city/area/pincode
  - Auto-fills form

Map Preview:
- Show pin on map
- Draggable to adjust
```

#### Step 5: Property Details (for applicable categories)
```dart
For Properties:
- Bedrooms (0-10 counter)
- Bathrooms (0-10 counter)
- Area (sqft) (number)
- Furnishing (Unfurnished/Semi/Fully Furnished)
- Floor Number (number)
- Total Floors (number)
- Age of Property (years)
- Parking (Yes/No)

For Hotels/Restaurants:
- Rooms/Seating Capacity
- Cuisine type
- Star rating (Hotels)
```

#### Step 6: Amenities (for applicable categories)
```dart
Multi-select chips grid:
- Different amenity options per category
- All pre-defined in categoryConfigs
```

#### Step 7: Images
```dart
Features:
- Upload up to 10 images
- Drag to reorder (first is thumbnail)
- Image preview with delete button
- Camera or gallery picker
- Max size: 5MB per image
- Supported: JPG, PNG, WebP
- Auto-compression before upload
- Progress indicator during upload

Layout:
- Grid of image slots
- Empty slot shows "+" icon
- Filled slots show image with X delete
```

#### Step 8: Contact Info
```dart
Fields:
- Contact Name* (pre-filled from profile)
- Contact Phone* (pre-filled from profile)
- Contact Email (pre-filled from profile)
- "I am an Agent" toggle switch

Pre-fill logic:
- Auto-populate from user profile
- Editable
```

#### Step 9: Review & Submit
```dart
Layout:
- Collapsible sections showing all entered data
- Edit button for each section (goes to that step)
- Terms & Conditions checkbox
- "Submit Property" button
- "Save as Draft" button

Submission:
- Show loading state
- Check subscription limits
- Upload images to Supabase Storage
- Insert to properties table
- Navigate to My Listings on success
- Show error toast on failure
```

### 5.5 MY LISTINGS SCREEN
**Route:** `/my-listings`

**Features:**

#### Header
- "My Properties" title
- FAB (floating action button) for "Add New"
- Filter by status dropdown (All/Active/Rented/Inactive)

#### Stats Row
- Total listings count
- Active count (green)
- Total views
- Total leads

#### Property Cards (Enhanced)
```dart
PropertyCard with additional info:
- All standard property info
- Status badge:
  * Active (green)
  * Rented (orange)
  * Sold (blue)
  * Inactive (gray)
  
- Stats row:
  * Views count (eye icon)
  * Favorites count (heart icon)
  * Leads count (users icon)
  
- Action Menu (3 dots):
  * Edit
  * Mark as Rented/Available
  * Boost (Ad Campaign)
  * Delete (red, with confirmation)
```

#### Empty State
- Illustration
- "You haven't listed any properties yet"
- "Add Property" CTA button

### 5.6 MESSAGES SCREEN
**Route:** `/messages`

**Layout:** 
- Mobile: Conversation list (full screen) → tap to open chat
- Tablet/Desktop: Split view (list left, chat right)

#### Conversation List
```dart
List Items:
- User avatar (image or initials)
- User name (bold if unread)
- Last message preview (1 line, ellipsis)
- Timestamp (relative: "2m ago", "Yesterday")
- Unread badge (count, primary color circle)
- Property thumbnail (if linked to property)

Features:
- Search conversations
- Pull to refresh
- Swipe to delete (with confirmation)
- Real-time updates via Supabase
```

#### Chat View
```dart
Header:
- Back button (mobile)
- User avatar + name
- Property title (subtitle, if linked)
- More menu (3 dots):
  * View Property
  * View Profile
  * Delete Conversation
  * Report User

Messages:
- Sent messages (right, primary blue bubble)
- Received messages (left, muted gray bubble)
- Timestamp below message group
- Read receipts (double check)
- Edited indicator (if edited)
- Deleted message placeholder (if deleted)

Message Types:
- Text (default)
- Voice message (with duration, play button)
- File attachment (icon + name + size)

Input Area:
- Text field (multi-line expandable)
- Send button (primary, enabled when text)
- Attachment button (future)
- Voice record button (future)

Real-time:
- New messages appear instantly
- Typing indicators ("User is typing...")
- Online status indicator
- Message delivery status (sent → delivered → read)
```

### 5.7 FAVORITES SCREEN
**Route:** `/favorites`

**Design:**
- Grid of PropertyCards
- Same design as listings
- Heart icon to remove (toggle)
- Empty state with heart illustration
- "Browse properties" CTA button

**Features:**
- Pull to refresh
- Remove animation
- Real-time sync

### 5.8 MAP VIEW SCREEN
**Route:** `/map-view`

**Zillow-Style Map:**

#### Map Component
```dart
Features:
- Google Maps with custom styling
- Property markers with price labels
- Marker clustering for dense areas
- Current location button (GPS)
- Zoom controls
- Map type toggle (standard/satellite)
```

#### Map Filters (Top Bar)
```dart
Filters:
- Category dropdown
- Min Price
- Max Price
- Price Type (Sale/Rent/Daily)

Filter chips below map
```

#### Price Markers
```dart
Custom markers:
- Background: white rounded rectangle
- Price text: bold, primary color
- "₹25K" format for thousands
- "₹1.5L" format for lakhs
- "₹2Cr" format for crores
- Selected state: primary background, white text
```

#### Property Preview Card
```dart
Shows on marker tap:
- Bottom sheet with property card
- Image, title, price, location
- "View Details" button
- Swipe up for more info
```

#### List View Toggle
- Switch between map and list view
- Sync selected filters

### 5.9 PROFILE SCREEN
**Route:** `/profile`

**Layout:**

#### Profile Header
```dart
Avatar (large, circular, 80px):
  - Image from profile
  - Or initials with gradient background

Full Name (large, bold)
Email (muted)
Phone (muted)
"Edit Profile" button (outlined)
```

#### Rating Display
```dart
Star rating (from useOwnerRating):
  - X.X ★ (Y reviews)
```

#### Menu Items
```dart
List tiles with icons:
- My Listings (with count badge)
- Favorites (with count badge)
- Leads
- CRM
- Ad Campaigns
- Divider
- Settings
- Privacy Policy
- Terms of Service
- Help & Support
- Divider
- Logout (red icon + text)
```

### 5.10 EDIT PROFILE SCREEN
**Route:** `/edit-profile`

**Fields:**
```dart
- Profile Photo (circular, tap to change)
  - Camera option
  - Gallery option
  - Remove option
- Full Name* (text)
- Email* (disabled, verified indicator)
- Phone Number* (10 digits)
- "Save Changes" button
```

### 5.11 USER PROFILE SCREEN (Public)
**Route:** `/user-profile/:userId`

**Layout:**
```dart
Header:
  - Avatar (large)
  - Name
  - Rating (X.X ★ from Y reviews)
  - Member since date

Stats Row:
  - Total Listings
  - Active Listings

Listings Section:
  - Grid of user's active PropertyCards
  - "View All" if many

Reviews Section:
  - List of reviews for this user
  - If eligible: "Write Review" button
```

---

## 6. LEAD MANAGEMENT SYSTEM

### 6.1 Lead Capture Flow

#### Contact Owner Dialog
**Triggered by:** "Contact Owner" button on listings

**Auto-fill for logged-in users:**
- Full Name (from profile)
- Phone (from profile)
- Fields are editable

**For non-logged users:**
- Form with required fields
- Prompts to login after submission

**Fields:**
- Full Name* (text)
- Phone Number* (10 digits)

**On Submit:**
- Create lead in `leads` table
- Set `source = 'listing'`
- Set `lead_type = 'organic'` or 'paid' (if campaign)
- Set `campaign_id` if from sponsored listing
- Show success toast
- Proceed with pending action (call/chat)

### 6.2 Leads Screen
**Route:** `/leads`

#### Overview Stats Cards
```dart
Row of stat cards:
- Total Leads
- New (status = 'new')
- Contacted
- Qualified
- Converted
```

#### Business Leads Breakdown (separate section)
```dart
For business listing owners:
- Total Business Leads
- Organic (no campaign_id)
- Paid Ads (with campaign_id)
- By Source:
  * Contact Form
  * Phone Calls
  * Chats
```

#### Lead Table
```dart
Filterable table:
- Search by name/phone
- Filter by: Status, Category, Source, Date Range
- Sort by: Date, Status

Columns:
- Name
- Phone
- Category
- Source (listing/call/chat)
- Status (badge with color)
- Created Date

Tap row → Lead Detail
```

#### Lead Detail Screen
```dart
Lead Info Card:
- Name, Phone, Email
- Message (if any)
- Created date
- Source

Property Card (if listing_id):
- Mini property card
- Tap to view

Status Dropdown:
- New → Contacted → Qualified → Converted → Closed

Activity Timeline:
- List of lead_activity entries
- Each entry: action_type, note, timestamp

Add Note Form:
- Text input
- "Add Note" button
- Creates lead_activity entry

Action Buttons:
- Call (initiates call)
- Chat (navigates to messages)
- Convert to CRM Client
```

---

## 7. CRM SYSTEM

### 7.1 CRM Screen
**Route:** `/crm`

#### Tabs
- Clients
- Tasks

#### Clients Tab
```dart
Client Cards:
- Name
- Email, Phone
- Stage badge (Lead/Prospect/Customer/Closed)
- Tags chips
- Created date

Actions:
- Add Client button (FAB)
- Filter by stage
- Search

Add/Edit Client Form:
- Name*, Email*, Phone*
- Stage dropdown
- Tags (add/remove chips)
- Link to Lead (optional)
```

#### Tasks Tab
```dart
Task Cards:
- Title
- Description (truncated)
- Due date
- Status badge (Pending/In Progress/Completed)
- Client name

Actions:
- Add Task button
- Filter by status
- Filter by client

Add/Edit Task Form:
- Title*
- Description
- Client dropdown*
- Due Date picker
- Status dropdown
```

---

## 8. AD CAMPAIGN SYSTEM

### 8.1 Campaign Screen
**Route:** `/ad-campaign`

#### Overview Stats
```dart
Row of cards:
- Total Campaigns
- Active Campaigns
- Total Impressions
- Total Clicks
- Total Leads
- Total Spent
```

#### Campaign List
```dart
Campaign Cards:
- Property thumbnail
- Campaign title
- Status badge (Active/Paused/Completed)
- Budget: ₹X / ₹Y spent
- Stats row: Impressions | Clicks | Leads
- Date range
- CTR percentage

Actions:
- Pause/Resume toggle
- Edit button
- View Analytics button
- Delete button
```

#### Create Campaign Dialog
```dart
Form:
- Select Property* (dropdown of owner's listings)
- Campaign Title*
- Budget* (₹, minimum 500)
- Start Date* (date picker)
- End Date* (date picker)
- Category (auto-filled from property)

Preview:
- Show how listing will appear

"Create Campaign" button
```

### 8.2 Campaign Analytics Screen
**Route:** `/campaign-analytics/:id`

```dart
Campaign Header:
- Property info
- Status badge
- Date range

Metrics Cards:
- Total Impressions
- Total Clicks
- CTR (Clicks/Impressions × 100)%
- Total Leads
- Conversion Rate (Leads/Clicks × 100)%
- Cost Per Lead (Spent/Leads)
- Budget Progress (spent/budget)

Charts:
- Line chart: Impressions over time
- Line chart: Clicks over time

Recent Leads Section:
- List of leads with campaign_id = this campaign
- Name, Phone, Status, Date
- Tap to view lead detail
```

---

## 9. REVIEW SYSTEM

### 9.1 Business Listing Reviews
**Purpose:** Rate and review business owners/listings (Google My Business style)

#### Display on Property Details
```dart
For business listings:
- 5-star rating at top-right of Business Details card
- Format: "X.X ★ (Y reviews)"
- Clickable → opens review dialog
```

#### Write Review Dialog
```dart
Trigger: Click on rating display

Form:
- 5-star rating selector (required)
- Title (optional)
- Comment (optional, max 500 chars)

Submit Logic:
- Check review eligibility (has interaction)
- Create/update review with review_type = 'business'
- Set listing_id

Display:
- "You've already reviewed this business" if exists
- Show "Edit Review" button for existing
```

#### Reviews List
```dart
On property details page:
- Show top 2-5 reviews
- "See All Reviews" expands

On owner profile:
- Full paginated list
```

### 9.2 User Profile Reviews
**Purpose:** Rate and review users (separate system)

```dart
On user profile page:
- Similar rating display
- review_type = 'profile'
- listing_id = null

Completely independent from business reviews
```

### 9.3 Review Eligibility
```dart
User can only review if:
- Row exists in review_interaction table
- Matching reviewer_id and owner_id
- Interaction types: lead, chat, view, message
```

---

## 10. SAFETY & MODERATION

### 10.1 Report User Dialog
**Trigger:** Flag icon on listings and profiles

```dart
Form:
- Reason Type* (dropdown):
  * Fraud
  * Cheating
  * Fake Details
  * Inactive Owner
  * Misleading Info
  * Spam
  * Inappropriate Behavior
  
- Description* (textarea, min 20 chars)
- Evidence (image upload, optional)

Submit:
- Create report with status = 'new'
- Show success toast
```

### 10.2 User Reports Screen
**Route:** `/user-reports`

```dart
My submitted reports:
- List of reports by user
- Status badges (New/In Review/Resolved/Dismissed)
- Real-time status updates
```

### 10.3 User Status Alert
```dart
On app load, check profile:
- If is_banned = true → Show banned message, force logout
- If suspended_until > now → Show suspension message with end date
```

---

## 11. ADMIN FEATURES

### 11.1 Admin Dashboard
**Route:** `/admin-dashboard`
**Access:** Only for users with role = 'admin' in user_roles

#### Stats Cards
```dart
- Total Users
- Total Properties (active)
- Total Leads
- Total Campaigns
- Total Reports (pending)
- Revenue (if applicable)
```

#### Quick Actions
```dart
- View Reports (pending count badge)
- User Management
- Review Moderation
```

### 11.2 Admin Reports Screen
**Route:** `/admin-reports`

```dart
Filters:
- Status (New/In Review/Resolved/Dismissed)
- Reason Type
- Date Range

Report Cards:
- Reporter info
- Reported user info
- Listing info (if applicable)
- Reason + description
- Evidence images
- Status badge
- "Take Action" button

Take Action Dialog:
- Action dropdown:
  * Warning
  * Suspend 7 Days
  * Suspend 30 Days
  * Suspend Permanent
  * Ban Permanently
  * Remove Listing
  * Dismiss Report
  
- Admin Notes (required)
- Confirm button

Action Logic:
- Warning: Create user_action entry, notify user
- Suspend: Set suspended_until, deactivate listings
- Ban: Set is_banned = true, remove listings
- Remove Listing: Set status = 'inactive'
```

### 11.3 Review Moderation Screen
**Route:** `/review-moderation`

```dart
All reviews list:
- Filter by type, rating, date
- Search by reviewer/owner name

Actions:
- Delete suspicious reviews
- Force verify reviews
- View reviewer/owner profiles
```

---

## 12. MAPS & GEOLOCATION

### 12.1 Live Location System

#### Use Live Location Button
```dart
On forms and search:
- GPS icon button
- Request location permission
- Get coordinates
- Reverse geocode to city/area/pincode
- Auto-fill form fields
```

#### Error Handling
```dart
- GPS denied → Show error, allow manual selection
- Geocoding failed → Fallback to manual input
- No network → Use cached suggestions
```

### 12.2 Near Me Filter
```dart
On listings page:
- "Near Me" toggle
- Radius selector: 5km, 10km, 25km
- Uses Haversine formula for distance
- Shows distance on property cards
```

### 12.3 Location Selector Modal
```dart
Tabs:
1. City Tab: Searchable dropdown of Indian cities
2. Area Tab: Text input with autocomplete
3. Pin Code Tab: 6-digit input with validation
4. Live Location Tab: GPS button with radius
```

---

## 13. NOTIFICATIONS

### 13.1 In-App Notifications Screen
**Route:** `/notifications`

```dart
Types:
- New Message
- Lead Received
- Property Favorited
- Campaign Status Change
- Report Status Update

Card Design:
- Type icon (colored)
- Title (bold)
- Message (2 lines)
- Timestamp (relative)
- Read/unread indicator (dot)
- Action button (if applicable)

Features:
- Mark as read (tap)
- Mark all as read
- Delete notification (swipe)
- Pull to refresh
```

---

## 14. SETTINGS SCREEN
**Route:** `/settings`

```dart
Sections:

Account Settings:
- Email Notifications toggle
- Push Notifications toggle
- SMS Alerts toggle

Privacy:
- Profile Visibility (Public/Private)
- Show Phone Number toggle
- Show Email toggle

App Preferences:
- Language (English/Hindi)
- Theme (Light/Dark/System)
- Default Location

Data Management:
- Clear Cache
- Download My Data
- Delete Account (red, confirmation dialog)
```

---

## 15. DATA MODELS

### Property Model
```dart
class Property {
  final String id;
  final String userId;
  final String title;
  final String? description;
  final String propertyType; // home, apartment, flat, commercial, office, farmland, pg, hotels, restaurant, cafe, farmhouse, warehouse, cars, bikes, electronics, business
  final double price;
  final String priceType; // rent, sale, daily_rent, monthly, yearly
  final String city;
  final String area;
  final String pinCode;
  final String? address;
  final double? latitude;
  final double? longitude;
  final int? bedrooms;
  final int? bathrooms;
  final int? areaSqft;
  final List<String> images;
  final List<String> amenities;
  final String status; // active, inactive, rented, sold
  final bool verified;
  final bool available;
  final bool isAgent;
  final String? contactName;
  final String? contactPhone;
  final String? contactEmail;
  final int views;
  final bool boosted;
  final int promotedLevel;
  final Map<String, dynamic>? businessMetadata;
  final String? campaignId; // Set when viewed from sponsored listing
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

### User Profile Model
```dart
class UserProfile {
  final String id;
  final String email;
  final String? fullName;
  final String? phone;
  final String? avatarUrl;
  final bool isBanned;
  final DateTime? suspendedUntil;
  final int safetyScore; // 0-100
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

### Message Model
```dart
class Message {
  final String id;
  final String senderId;
  final String receiverId;
  final String? propertyId;
  final String content;
  final String messageType; // text, voice, file
  final String? fileUrl;
  final String? fileName;
  final int? fileSize;
  final int? durationSeconds;
  final bool read;
  final bool deleted;
  final bool edited;
  final DateTime? editedAt;
  final String status; // sent, delivered, read
  final String? senderName;
  final String? senderEmail;
  final DateTime createdAt;
}
```

### Lead Model
```dart
class Lead {
  final String id;
  final String ownerId;
  final String? userId;
  final String? listingId;
  final String? campaignId;
  final String name;
  final String phone;
  final String? email;
  final String? message;
  final String leadType; // organic, paid
  final String? category;
  final String? subcategory;
  final String source; // listing, call, chat
  final String? sourcePage;
  final String status; // new, contacted, qualified, converted, closed
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

### Review Model
```dart
class Review {
  final String id;
  final String reviewerId;
  final String ownerId;
  final String? listingId;
  final String reviewType; // business, profile
  final int rating; // 1-5
  final String? title;
  final String? comment;
  final bool verified;
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

### AdCampaign Model
```dart
class AdCampaign {
  final String id;
  final String userId;
  final String propertyId;
  final String title;
  final String? category;
  final String? subcategory;
  final String status; // active, paused, completed
  final double budget;
  final double spent;
  final int impressions;
  final int clicks;
  final int leadsGenerated;
  final DateTime startDate;
  final DateTime endDate;
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

### Report Model
```dart
class Report {
  final String id;
  final String reporterId;
  final String reportedUserId;
  final String? listingId;
  final String reasonType; // fraud, cheating, fake_details, inactive_owner, misleading_info, spam, inappropriate_behavior
  final String description;
  final List<String>? evidenceUrls;
  final String status; // new, in_review, resolved, dismissed
  final String? adminAction; // warning, suspend_7d, suspend_30d, suspend_permanent, ban, remove_listing
  final String? adminId;
  final String? adminNotes;
  final DateTime createdAt;
  final DateTime updatedAt;
}
```

---

## 16. FLUTTER ARCHITECTURE

### State Management
```dart
Provider: Riverpod 2.0+

Providers:
├── AuthProvider (auth state, user)
├── ProfileProvider (user profile CRUD)
├── PropertiesProvider (listings)
├── PropertyProvider (single property)
├── FavoritesProvider (favorites CRUD)
├── MessagesProvider (chat + realtime)
├── LeadsProvider (lead management)
├── CRMProvider (clients + tasks)
├── CampaignsProvider (ad campaigns)
├── ReviewsProvider (reviews CRUD)
├── ReportsProvider (reports)
├── LocationProvider (city/area/pincode + GPS)
└── NotificationProvider (notifications)
```

### Project Structure
```
lib/
├── main.dart
├── app.dart
├── core/
│   ├── constants/
│   │   ├── app_colors.dart
│   │   ├── app_sizes.dart
│   │   └── app_strings.dart
│   ├── themes/
│   │   ├── app_theme.dart
│   │   └── dark_theme.dart
│   ├── utils/
│   │   ├── validators.dart
│   │   ├── formatters.dart
│   │   └── helpers.dart
│   └── config/
│       └── supabase_config.dart
├── data/
│   ├── models/
│   │   ├── property.dart
│   │   ├── user_profile.dart
│   │   ├── message.dart
│   │   ├── lead.dart
│   │   ├── review.dart
│   │   ├── campaign.dart
│   │   └── report.dart
│   ├── repositories/
│   │   ├── auth_repository.dart
│   │   ├── property_repository.dart
│   │   ├── message_repository.dart
│   │   ├── lead_repository.dart
│   │   └── ...
│   └── services/
│       ├── supabase_service.dart
│       ├── storage_service.dart
│       ├── location_service.dart
│       └── notification_service.dart
├── presentation/
│   ├── screens/
│   │   ├── auth/
│   │   ├── home/
│   │   ├── listings/
│   │   ├── property_details/
│   │   ├── add_property/
│   │   ├── messages/
│   │   ├── leads/
│   │   ├── crm/
│   │   ├── campaigns/
│   │   ├── profile/
│   │   ├── map/
│   │   ├── admin/
│   │   └── settings/
│   ├── widgets/
│   │   ├── common/
│   │   ├── property/
│   │   ├── forms/
│   │   ├── dialogs/
│   │   └── cards/
│   └── providers/
│       └── (all providers)
└── routes/
    └── app_router.dart (go_router)
```

### Required Packages

```yaml
dependencies:
  flutter: sdk
  
  # State Management
  flutter_riverpod: ^2.5.0
  riverpod_annotation: ^2.3.0
  
  # Backend
  supabase_flutter: ^2.5.0
  
  # Navigation
  go_router: ^14.0.0
  
  # UI Components
  flutter_svg: ^2.0.0
  cached_network_image: ^3.3.0
  shimmer: ^3.0.0
  lottie: ^3.0.0
  flutter_animate: ^4.5.0
  
  # Forms & Validation
  flutter_form_builder: ^9.0.0
  form_builder_validators: ^10.0.0
  
  # Maps
  google_maps_flutter: ^2.5.0
  geolocator: ^11.0.0
  geocoding: ^3.0.0
  
  # Media
  image_picker: ^1.0.0
  image_cropper: ^6.0.0
  photo_view: ^0.14.0
  flutter_image_compress: ^2.1.0
  
  # Storage
  shared_preferences: ^2.2.0
  flutter_secure_storage: ^9.0.0
  path_provider: ^2.1.0
  
  # Utilities
  intl: ^0.19.0
  url_launcher: ^6.2.0
  share_plus: ^8.0.0
  uuid: ^4.0.0
  timeago: ^3.6.0
  
  # UI Helpers
  carousel_slider: ^4.2.0
  flutter_rating_bar: ^4.0.1
  flutter_staggered_grid_view: ^0.7.0
  expandable: ^5.0.1
  
  # Notifications
  flutter_local_notifications: ^17.0.0
  firebase_messaging: ^14.7.0
  firebase_core: ^2.25.0
  
  # Analytics
  firebase_analytics: ^10.7.0
  
dev_dependencies:
  flutter_test: sdk
  build_runner: ^2.4.0
  riverpod_generator: ^2.4.0
  flutter_lints: ^3.0.0
```

---

## 17. PERMISSIONS

### iOS (Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>We need your location to show nearby properties and auto-fill your address</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>We need your location to show nearby properties</string>

<key>NSCameraUsageDescription</key>
<string>Take photos of your property to add to your listing</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>Select photos from your gallery for your listing</string>

<key>NSMicrophoneUsageDescription</key>
<string>Record voice messages in chat</string>
```

### Android (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />
```

---

## 18. SECURITY

### Row Level Security (RLS)
All tables have RLS enabled with policies matching React app.

### Data Validation
- All inputs sanitized
- Zod-equivalent validation (form_builder_validators)
- SQL injection prevention (Supabase client)
- XSS protection
- Image file validation (type, size)

### Privacy
- GDPR compliant
- User data export capability
- Right to deletion
- Encryption at rest (Supabase)
- HTTPS only

---

## 19. PERFORMANCE

### Targets
- App launch: < 2 seconds
- Screen navigation: < 300ms
- Image load: Progressive with placeholder
- API calls: < 1 second
- Lighthouse equivalent: 90+ performance

### Optimization Techniques
- Image compression (WebP, quality 80%)
- Lazy loading with CachedNetworkImage
- Pagination (20-50 items per page)
- Offline caching with Hive/SharedPreferences
- Debounced search (300ms)
- Memoization with Riverpod
- Code splitting with deferred loading

### Offline Support
- Cache recent properties
- Cache user profile
- Cache conversations
- Offline queue for messages
- Sync when online

---

## 20. TESTING

### Unit Tests
- All providers/notifiers
- Repositories
- Validators
- Utility functions

### Widget Tests
- All custom widgets
- Forms
- Cards
- Dialogs

### Integration Tests
- Complete user flows
- Authentication
- Property CRUD
- Messaging

### E2E Tests
- Sign up → Create listing → Contact owner
- Admin workflows
- Cross-platform testing

---

## 21. DEPLOYMENT

### iOS
```bash
flutter build ios --release
# Open in Xcode, Archive, Submit to App Store
```

### Android
```bash
flutter build appbundle --release
# Upload AAB to Google Play Console
```

### CI/CD (GitHub Actions)
- Automated builds on push
- Automated tests
- Code quality checks (flutter analyze)
- Deployment to TestFlight/Internal Testing

---

## 22. TIMELINE ESTIMATE

### Phase 1: Setup & Architecture (1 week)
- Project setup, dependencies
- Supabase integration
- Base architecture, theming
- Navigation setup

### Phase 2: Authentication (1 week)
- Login/Signup screens
- OTP verification
- Google OAuth
- Profile setup

### Phase 3: Core Property Features (3 weeks)
- Home screen
- Listings screen with filters
- Property details screen
- Add/Edit property forms (all categories)
- My listings
- Favorites

### Phase 4: Communication (1.5 weeks)
- Messaging system
- Real-time chat
- Lead capture dialog
- Contact owner flow

### Phase 5: Lead Management & CRM (1.5 weeks)
- Leads screen
- Lead detail + activity
- CRM clients
- CRM tasks

### Phase 6: Ad Campaigns (1 week)
- Campaign creation
- Campaign management
- Analytics
- Sponsored listings display

### Phase 7: Reviews & Reports (1 week)
- Business reviews
- Profile reviews
- User reporting
- Report history

### Phase 8: Maps & Location (1 week)
- Google Maps integration
- Map view with markers
- Near me filter
- Location autocomplete

### Phase 9: Admin Features (1 week)
- Admin dashboard
- Reports moderation
- Review moderation
- User management

### Phase 10: Polish & Testing (2 weeks)
- UI refinements
- Bug fixes
- Performance optimization
- Testing all flows

### Phase 11: Deployment (1 week)
- App Store submission
- Play Store submission
- Documentation

**Total: 15 weeks (3.5 months)**

---

## 23. SUPPORT & MAINTENANCE

- Bug fixes
- OS updates compatibility
- Security patches
- Feature updates
- Performance monitoring
- User feedback integration

---

## APPENDIX

### A. Supabase Configuration
```dart
const supabaseUrl = 'https://thxrxacsrwtadvvdwken.supabase.co';
const supabaseAnonKey = '<anon_key>';
```

### B. Google Maps API
```dart
const googleMapsApiKey = '<google_maps_key>';
```

### C. Assets Required
- Logo (SVG, PNG - all sizes)
- App icons (iOS + Android)
- Splash screen
- Placeholder images
- Empty state illustrations
- Category icons (emoji or custom)
- Lottie animations (loading, success, error)

### D. Database Schema
(Refer to main CITYLIFES_PRD.md for complete schema)

---

**Document Version:** 2.0  
**Last Updated:** December 2025  
**Status:** Ready for Development  
**Parity Target:** 100% feature match with React web app
