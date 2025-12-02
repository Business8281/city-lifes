# Citylifes - Complete Product Requirements Document (PRD)

## 1. Executive Summary

**Project Name:** Citylifes  
**Platform Type:** Multi-category marketplace platform for Indian cities  
**Tech Stack:** React, TypeScript, Tailwind CSS, Supabase, Capacitor  
**Target Market:** Tier-1 and Tier-2 Indian cities  
**Core Value Proposition:** Zero-broker, hyperlocal marketplace combining property rentals/sales, vehicles, electronics, and business listings

---

## 2. Project Vision & Goals

### Mission
Create the fastest, most comprehensive hyperlocal marketplace in India that beats existing platforms (NoBroker, OLX, Airbnb) with:
- **Zero brokerage** - Direct owner-to-user communication
- **Multi-category structure** - Properties, vehicles, electronics, businesses
- **Hyperlocal dominance** - City → Area → Street level targeting
- **Mobile-first experience** - 100% optimized for mobile devices
- **Speed and simplicity** - Fastest listing creation and search

### Business Goals
- Handle 10+ million concurrent users
- Achieve Lighthouse scores: Performance 90+, SEO 95+, Accessibility 90+
- Support all major Indian cities with hyperlocal accuracy
- Enable verified listings and verified owners
- Provide transparent, trust-based communication

---

## 3. Technical Architecture

### 3.1 Technology Stack

**Frontend:**
- React 18.3.1 + TypeScript
- Vite (build tool)
- TailwindCSS + shadcn/ui components
- React Router DOM v6
- React Hook Form + Zod validation
- TanStack Query for data fetching

**Backend:**
- Supabase (Database, Auth, Storage, Realtime)
- PostgreSQL with PostGIS for geolocation
- Row Level Security (RLS) for all tables
- Edge Functions for serverless logic

**Mobile:**
- Capacitor 7.4.4 (iOS & Android)
- Native integrations: Geolocation, Share, Splash Screen, Status Bar

**Maps & Location:**
- Google Maps API (@vis.gl/react-google-maps)
- Live location tracking
- Haversine formula for distance calculations

**Image Optimization:**
- Supabase Storage with WebP, auto quality, resize
- Lazy loading + blur-up placeholders
- Progressive image loading

---

### 3.2 Design System

**Color Scheme:**
- Primary: `#2C6E91` (Brand Blue)
- Secondary: `#F5A623` (Accent Orange)
- Neutral: `#F8FAFC`, `#1E293B`
- All colors use HSL format via CSS variables
- Full dark/light mode support

**Typography:**
- Avoid default fonts (Inter, Poppins)
- Use distinctive, context-appropriate fonts
- Responsive font scaling

**UI Principles:**
- Shadcn/ui components as base
- Semantic tokens from index.css and tailwind.config.ts
- Mobile-first layouts with responsive grids
- Smooth transitions and micro-interactions
- 1:1 aspect ratio for all images

---

## 4. Database Schema

### 4.1 Core Tables

#### `profiles`
```sql
- id (uuid, PK, references auth.users)
- email (text)
- full_name (text)
- phone (text, 10 digits)
- avatar_url (text)
- is_banned (boolean)
- suspended_until (timestamp)
- safety_score (integer, 0-100)
- created_at, updated_at (timestamp)
```

#### `properties`
```sql
- id (uuid, PK)
- user_id (uuid, FK → profiles)
- title (text)
- description (text)
- property_type (text) -- home, apartment, flat, commercial, office, farmland, pg, hostel, hotel, restaurant, cafe, farmhouse, warehouse, car, bike, electronics, business
- price (numeric)
- price_type (text) -- sale, rent, daily
- city (text)
- area (text)
- pin_code (text)
- address (text)
- latitude, longitude (numeric)
- location (geography point) -- PostGIS
- bedrooms, bathrooms (integer)
- area_sqft (numeric)
- images (text[])
- amenities (text[])
- business_metadata (jsonb) -- For business listings
- status (text) -- active, inactive, rented, sold
- verified (boolean)
- available (boolean)
- contact_name, contact_phone, contact_email (text)
- is_agent (boolean)
- views (integer)
- created_by_name, created_by_email (text)
- created_at, updated_at (timestamp)
```

#### `cities`
```sql
- id (uuid, PK)
- name (text)
- state (text)
- tier (text) -- tier-1, tier-2
- created_at, updated_at (timestamp)
```

#### `areas`
```sql
- id (uuid, PK)
- city_id (uuid, FK → cities)
- name (text)
- pincode_list (text[])
- created_at, updated_at (timestamp)
```

#### `pincodes`
```sql
- id (uuid, PK)
- city_id (uuid, FK → cities)
- area_id (uuid, FK → areas)
- pincode (text)
- created_at, updated_at (timestamp)
```

---

### 4.2 User Engagement Tables

#### `favorites`
```sql
- id (uuid, PK)
- user_id (uuid, FK → profiles)
- property_id (uuid, FK → properties)
- created_at (timestamp)
```

#### `messages`
```sql
- id (uuid, PK)
- sender_id (uuid, FK → profiles)
- receiver_id (uuid, FK → profiles)
- property_id (uuid, FK → properties, nullable)
- content (text)
- message_type (text) -- text, voice, file
- file_url, file_name, file_size (text, text, integer)
- duration_seconds (integer) -- for voice messages
- read (boolean)
- deleted, edited (boolean)
- edited_at (timestamp)
- sender_name, sender_email (text)
- created_at (timestamp)
```

#### `reviews`
```sql
- id (uuid, PK)
- reviewer_id (uuid, FK → profiles)
- owner_id (uuid, FK → profiles)
- listing_id (uuid, FK → properties, nullable)
- review_type (text) -- 'business' or 'profile'
- rating (integer, 1-5)
- title (text)
- comment (text)
- verified (boolean)
- created_at, updated_at (timestamp)
```

#### `review_interaction`
```sql
- id (uuid, PK)
- reviewer_id (uuid, FK → profiles)
- owner_id (uuid, FK → profiles)
- listing_id (uuid, FK → properties)
- interaction_type (text) -- lead, chat, booking, message
- created_at (timestamp)
```

---

### 4.3 Lead Management Tables

#### `leads`
```sql
- id (uuid, PK)
- owner_id (uuid, FK → profiles) -- listing owner
- user_id (uuid, FK → profiles, nullable) -- lead submitter
- listing_id (uuid, FK → properties, nullable)
- campaign_id (uuid, FK → ad_campaigns, nullable)
- name (text)
- phone (text)
- email (text, nullable)
- message (text, nullable)
- lead_type (text) -- organic, paid
- category (text)
- subcategory (text)
- source (text) -- listing, call, chat, ad_campaign
- source_page (text)
- status (text) -- new, contacted, qualified, converted, closed
- created_at, updated_at (timestamp)
```

#### `lead_activity`
```sql
- id (uuid, PK)
- lead_id (uuid, FK → leads)
- action_type (text) -- status_change, note_added, called, emailed
- note (text)
- created_at (timestamp)
```

---

### 4.4 CRM Tables

#### `crm_clients`
```sql
- id (uuid, PK)
- owner_id (uuid, FK → profiles)
- lead_id (uuid, FK → leads, nullable)
- name (text)
- email (text)
- phone (text)
- stage (text) -- lead, prospect, customer, closed
- tags (text[])
- created_at, updated_at (timestamp)
```

#### `crm_tasks`
```sql
- id (uuid, PK)
- client_id (uuid, FK → crm_clients)
- owner_id (uuid, FK → profiles)
- title (text)
- description (text)
- due_date (timestamp)
- status (text) -- pending, in_progress, completed
- created_at, updated_at (timestamp)
```

---

### 4.5 Ad Campaign Tables

#### `ad_campaigns`
```sql
- id (uuid, PK)
- user_id (uuid, FK → profiles)
- property_id (uuid, FK → properties)
- title (text)
- category (text)
- subcategory (text)
- status (text) -- active, paused, completed
- budget (numeric)
- spent (numeric)
- impressions (integer)
- clicks (integer)
- leads_generated (integer) -- auto-updated via trigger
- start_date, end_date (timestamp)
- created_by_name, created_by_email (text)
- created_at, updated_at (timestamp)
```

---

### 4.6 Safety & Moderation Tables

#### `reports`
```sql
- id (uuid, PK)
- reporter_id (uuid, FK → profiles)
- reported_user_id (uuid, FK → profiles)
- listing_id (uuid, FK → properties, nullable)
- reason_type (enum) -- fraud, cheating, fake_details, inactive_owner, misleading_info, spam, inappropriate_behavior
- description (text)
- evidence_urls (text[])
- status (enum) -- new, in_review, resolved, dismissed
- admin_action (enum) -- warning, suspend_7d, suspend_30d, suspend_permanent, ban, remove_listing
- admin_id (uuid, FK → profiles, nullable)
- admin_notes (text)
- created_at, updated_at (timestamp)
```

#### `user_actions`
```sql
- id (uuid, PK)
- admin_id (uuid, FK → profiles)
- user_id (uuid, FK → profiles)
- report_id (uuid, FK → reports, nullable)
- action_type (enum) -- warning, suspend_7d, suspend_30d, suspend_permanent, ban
- action_reason (text)
- created_at (timestamp)
```

---

### 4.7 Support Tables

#### `support_tickets`
```sql
- id (uuid, PK)
- user_id (uuid, FK → profiles)
- subject (text)
- description (text)
- status (text) -- open, in_progress, resolved, closed
- created_at, updated_at (timestamp)
```

#### `support_ticket_attachments`
```sql
- id (uuid, PK)
- ticket_id (uuid, FK → support_tickets)
- path (text)
- mime_type (text)
- size (integer)
- created_at (timestamp)
```

---

### 4.8 Database Functions & Triggers

#### `autocomplete_search(query_text, limit_count)`
Returns city, area, pincode suggestions with relevance scoring.

#### `get_sponsored_properties(filter_city, filter_area, filter_pincode, filter_lat, filter_lng, filter_radius_km)`
Returns active sponsored listings based on location filters with distance calculation.

#### `update_campaign_leads_count()` (Trigger)
Automatically updates `ad_campaigns.leads_generated` when leads are inserted/updated/deleted.

#### `apply_admin_action(p_report_id, p_action_type, p_admin_id, p_admin_notes)`
Applies admin actions (warnings, suspensions, bans) to reported users.

---

## 5. Categories & Forms

### 5.1 Property Categories

**Residential:**
1. **Homes**
   - Fields: Bedrooms, Bathrooms, Area (sqft), Furnishing, Target Audience (Bachelors/Families)
   - Price Types: Sale, Rent, Daily

2. **Apartments**
   - Fields: Bedrooms, Bathrooms, Floor, Total Floors, Area (sqft), Furnishing, Amenities
   - Price Types: Sale, Rent

3. **Flats**
   - Fields: Bedrooms, Bathrooms, Floor, Area (sqft), Furnishing, Parking
   - Price Types: Sale, Rent

**Commercial:**
4. **Commercial Spaces**
   - Fields: Area (sqft), Suitable For, Parking, Amenities
   - Price Types: Sale, Rent

5. **Office Spaces**
   - Fields: Area (sqft), Workstations, Cabins, Meeting Rooms, Furnishing
   - Price Types: Rent

6. **Warehouses**
   - Fields: Area (sqft), Height, Loading Docks, Storage Type
   - Price Types: Rent

**Land:**
7. **Farmlands**
   - Fields: Area (acres), Soil Type, Water Source, Fencing
   - Price Types: Sale, Rent

**Accommodation:**
8. **PGs & Hostels**
   - Fields: PG Type (Boys/Girls/Co-living), Occupancy, Food Included, Amenities, Target Audience
   - Price Types: Rent

9. **Hotels**
   - Fields: Room Types, Amenities, Star Rating
   - Price Types: Daily

**Hospitality:**
10. **Restaurants**
    - Fields: Cuisine, Seating Capacity, Operating Hours, Services
    - Price Types: None (Business listing)

11. **Cafes**
    - Fields: Specialties, Seating, Operating Hours, Amenities
    - Price Types: None (Business listing)

**Event Spaces:**
12. **Farmhouses**
    - Fields: Area, Capacity, Amenities, Event Types
    - Price Types: Daily, Rent

**Vehicles:**
13. **Cars**
    - Fields: Brand, Model, Year, Fuel Type, KM Driven, Ownership, Transmission
    - Price Types: Sale, Rent, Daily

14. **Bikes**
    - Fields: Brand, Model, Year, Fuel Type, KM Driven, Ownership
    - Price Types: Sale, Rent, Daily

**Electronics:**
15. **Electronics**
    - Fields: Category (Laptop/Mobile/Accessories), Brand, Model, Condition, Warranty
    - Price Types: Sale, Rent

**Business:**
16. **Business Listings** (Google My Business style)
    - Fields: Business Name, Category, Services, Year Established, Employees, Operating Hours, Social Media Links
    - Price: Optional (defaults to 0)
    - Review System: 5-star ratings + customer reviews

---

### 5.2 Form Implementation Rules

**All Forms Must Include:**
- City, Area, Pincode selectors (cascading dropdowns)
- "Use Live Location" button with GPS detection
- Title, Description
- Price (except business listings)
- Contact Name, Phone, Email
- Multiple image upload (6+ images, 1:1 aspect ratio)
- Amenities/Features checkboxes
- Category-specific fields

**Image Upload:**
- Compression before upload
- WebP conversion on backend
- Lazy loading + progressive loading
- Maximum 10 images per listing

**Validation:**
- Zod schemas for all forms
- Phone: 10-digit Indian numbers
- Email: Valid format
- Required fields enforced
- Real-time validation feedback

---

## 6. Authentication System

### 6.1 Auth Methods

**Email/Password:**
- Sign up with email verification (OTP)
- Login with email/password
- Password reset flow with OTP
- Email change with OTP verification

**Google OAuth:**
- Sign up with Google account
- Login with existing Google account
- Display all previously used Google accounts for re-login
- Auto-populate profile data (name, email)

### 6.2 Profile Setup Flow

**Post-Authentication:**
1. Check if `user_metadata.profile_completed` is true
2. If false, redirect to `/setup-profile`
3. Collect: Full Name, Phone Number
4. Upsert to `profiles` table
5. Update `user_metadata.profile_completed = true`
6. Redirect to home

### 6.3 Session Management

**Requirements:**
- Store both `user` and `session` objects in state
- Use `supabase.auth.onAuthStateChange` for real-time updates
- Check `supabase.auth.getSession()` on app load
- Auto-refresh tokens (handled by Supabase client)
- Safari-compatible storage adapter
- PKCE flow for security

**Email Redirect URLs:**
```typescript
emailRedirectTo: `${window.location.origin}/`
```

---

## 7. Lead Management System

### 7.1 Organic Leads

**Trigger Points:**
- User clicks "Contact Owner" button → Lead Capture Dialog
- User sends message in chat → Auto-create lead
- User calls owner → Auto-create lead (if tracked)

**Contact Owner Form:**
- Auto-fill Full Name, Phone from logged-in user profile
- Allow editing before submit
- Fields: Full Name (required), Phone (required)
- Submit creates lead with `source = 'listing'`, `lead_type = 'organic'`

**Cross-Browser Compatibility:**
- Must work in Chrome, Safari, Firefox, Edge
- Safari-specific handling for localStorage
- Google auth metadata extraction
- Real-time display updates for all user types

### 7.2 Paid Leads (Ad Campaigns)

**Campaign Creation:**
- Owner selects property for promotion
- Sets budget, start/end dates
- Campaign runs with sponsored display

**Sponsored Display:**
- Carousel on listings page
- Labeled "Sponsored" in carousel (NOT on individual cards)
- Auto-increment impressions on view
- Auto-increment clicks on click

**Lead Attribution:**
- When user contacts owner from sponsored listing → `campaign_id` set
- `lead_type = 'paid'`
- Triggers `update_campaign_leads_count` to increment `ad_campaigns.leads_generated`

### 7.3 Lead Management Dashboard (`/leads`)

**Overview Stats:**
- Total Leads
- New Leads (status = 'new')
- Qualified Leads (status = 'qualified')
- Converted Leads (status = 'converted')

**Business Listing Stats (separate section):**
- Total Business Leads
- Organic (no `campaign_id`)
- Paid Ads (with `campaign_id`)
- Contact Form (source = 'listing')
- Phone Calls (source = 'call')
- Chats (source = 'chat')

**Lead Table:**
- Filterable by: Status, Category, Source, Date Range
- Columns: Name, Phone, Email, Category, Source, Status, Created Date
- Click row → Lead Detail Page

**Lead Detail Page:**
- Lead Info: Name, Phone, Email, Message
- Property Info: Title, Image, Price
- Activity Timeline: Status changes, notes, calls, emails
- Status Update Dropdown
- Add Note Form
- Real-time updates via Supabase subscriptions

### 7.4 Call & Chat System Integration

**Call System:**
- Click "Call" button → Initiates call
- Auto-create lead with `source = 'call'`
- Log activity in `lead_activity`

**Chat System:**
- In-app messaging via `messages` table
- Real-time with Supabase Realtime
- Auto-create lead on first message with `source = 'chat'`
- Support text, voice, file messages
- Typing indicators
- Read receipts

---

## 8. CRM System

### 8.1 CRM Clients (`/crm`)

**Features:**
- Create client from lead or manually
- Track client stage: Lead → Prospect → Customer → Closed
- Add tags for categorization
- View client details, related tasks, interaction history

**Real-time Updates:**
- Supabase subscriptions on `crm_clients` table
- Auto-refresh on changes

### 8.2 CRM Tasks

**Features:**
- Create task linked to client
- Set due date, description
- Track status: Pending → In Progress → Completed
- Filter by status, client, due date

**Real-time Updates:**
- Supabase subscriptions on `crm_tasks` table

---

## 9. Ad Campaign System

### 9.1 Campaign Management (`/ad-campaign`)

**Campaign Creation Dialog:**
- Select property from owner's listings
- Enter campaign title
- Set budget (₹)
- Set start/end dates
- Auto-status: Active (if start_date ≤ today ≤ end_date)

**Campaign Dashboard:**
- List all campaigns (owner's only)
- Stats per campaign: Impressions, Clicks, Leads Generated, Budget Spent
- Filter by status: Active, Paused, Completed
- Pause/Resume/End campaign actions

### 9.2 Campaign Analytics (`/campaign-analytics/:id`)

**Metrics:**
- Total Impressions
- Total Clicks
- Click-Through Rate (CTR) = (Clicks / Impressions) × 100
- Total Leads Generated
- Conversion Rate = (Leads / Clicks) × 100
- Cost Per Lead = Budget Spent / Leads
- Budget Spent / Total Budget

**Recent Leads Section:**
- List leads generated by this campaign
- Show: Name, Phone, Status, Created Date
- Link to Lead Detail Page

### 9.3 Sponsored Listings Display

**Implementation:**
- `useSponsoredProperties` hook fetches active campaigns
- Display in carousel on listings page
- Show "Sponsored" label in carousel header
- Increment impressions via RPC call on carousel view
- Increment clicks via RPC call on sponsored listing click
- Real-time updates via subscriptions to `ad_campaigns` and `leads` tables

---

## 10. Review Systems

### 10.1 Business Listing Reviews

**Purpose:** Rate and review business owners/listings (like Google My Business)

**Implementation:**
- Display 5-star rating at top-right of Business Details card
- Click rating → Open review dialog
- Review Form: Rating (1-5 stars), Title, Comment
- Submit creates review with `review_type = 'business'`, `listing_id = <property_id>`

**Eligibility:**
- User must have interaction in `review_interaction` table
- Interaction types: lead, chat, booking, message
- Only 1 review per user per business owner
- User can edit their existing review

**Display:**
- Average rating + review count on business cards
- Top 2-5 reviews on listing detail page
- All reviews on owner profile (paginated)
- Admin moderation panel

### 10.2 User Profile Reviews

**Purpose:** Rate and review users themselves (separate from business listings)

**Implementation:**
- Display on user profile page
- Review Form: Rating (1-5 stars), Title, Comment
- Submit creates review with `review_type = 'profile'`, `listing_id = null`

**Separation:**
- Completely independent from business reviews
- Separate database queries, RLS policies, subscriptions
- Separate review calculation and display logic

---

## 11. Safety & Moderation System

### 11.1 User Reporting

**Report Form (on listings & profiles):**
- Select reason type: Fraud, Cheating, Fake Details, Inactive Owner, Misleading Info, Spam, Inappropriate Behavior
- Description (required)
- Upload evidence (images, optional)
- Submit creates entry in `reports` table with `status = 'new'`

**My Reports Page (`/user-reports`):**
- View all reports submitted by user
- Filter by status
- Real-time status updates

**Reporting Limits:**
- Once every 48 hours per reported user
- Auto-flag users with high report counts (3+ fraud, 5+ total in 30 days)

### 11.2 Admin Reports Dashboard (`/admin-reports`)

**Access:** Admin users only (via `user_roles` table)

**Features:**
- View all reports with filters: Status, Reason Type, Date Range
- Stats cards: Total Reports, New, In Review, Resolved
- Report Detail: Reporter, Reported User, Listing, Description, Evidence
- Take Action Button → Action Dialog

**Admin Actions:**
- **Warning:** Create entry in `user_actions`, notify user
- **Suspend 7 Days:** Set `profiles.suspended_until = now() + 7 days`, deactivate listings
- **Suspend 30 Days:** Set `profiles.suspended_until = now() + 30 days`, deactivate listings
- **Suspend Permanent:** Set `profiles.suspended_until = 'infinity'`, deactivate listings
- **Ban:** Set `profiles.is_banned = true`, remove all listings, prevent login
- **Remove Listing:** Set listing `status = 'inactive'`

**Safety Score:**
- 0-100 score visible to admin
- Reduces with negative reports and actions
- Logic: Start at 100, -5 per report, -10 per warning, -20 per suspension, -50 per ban

---

## 12. Maps & Geolocation

### 12.1 Live Location System

**Features:**
- "Use Live Location" button on forms
- Request GPS permission
- Reverse geocode coordinates → City, Area, Pincode
- Auto-fill form fields with geocoded data
- Map to nearest city/area/pincode in database

**Error Handling:**
- GPS denied → Show error, allow manual selection
- Geocoding failed → Fallback to manual input
- No network → Cached suggestions

### 12.2 Near Me Filter

**Implementation:**
- "Near Me" filter on listings page
- Radius options: 5km, 10km, 25km
- Use Haversine formula for distance calculation
- Display distance on property cards

### 12.3 Zillow-Style Map View (`/map-view`)

**Features:**
- Interactive Google Map with property markers
- Price markers on map (show price on marker)
- Click marker → Info window with property details
- Filter by category, price range, price type
- Real-time property updates
- Cluster markers for dense areas
- Sync map bounds with property list

---

## 13. Search & Discovery

### 13.1 Search Bar

**Autocomplete:**
- Search by city name, area name, pincode
- Fuzzy matching with relevance scoring
- Call `autocomplete_search(query_text, limit_count)` RPC
- Display suggestions grouped by type (City, Area, Pincode)

**Filters:**
- Category dropdown (all categories)
- Min/Max price
- Price type (Sale, Rent, Daily)
- Bedrooms, Bathrooms (for properties)
- Near Me (radius filter)

**Sorting:**
- Newest First (default)
- Price: Low to High
- Price: High to Low

### 13.2 Category Pages

**URL Structure:**
- `/listings?category=<category_name>`
- Example: `/listings?category=homes`

**Display:**
- Filter properties by `property_type = category`
- Grid layout with PropertyCard components
- Infinite scroll / pagination
- Sponsored carousel at top

### 13.3 City/Area Pages (SEO)

**URL Structure:**
- `/city/<city_name>`
- `/city/<city_name>/<area_name>`
- `/<city_name>/<category_name>`

**Dynamic Metadata:**
- Title: "Properties in {city} | Citylifes"
- Description: "Find {category} for sale and rent in {city}, {area}. Zero brokerage listings."
- Canonical URL

---

## 14. SEO & Performance

### 14.1 SEO Schema (JSON-LD)

**Listing Pages:**
```json
{
  "@context": "https://schema.org",
  "@type": ["Residence", "Product"],
  "name": "{{title}}",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "{{area}}",
    "addressRegion": "{{city}}",
    "postalCode": "{{pin_code}}"
  },
  "offers": {
    "@type": "Offer",
    "price": "{{price}}",
    "priceCurrency": "INR"
  },
  "image": "{{images[0]}}",
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{{latitude}}",
    "longitude": "{{longitude}}"
  }
}
```

**Global Schemas:**
- Organization (Citylifes branding)
- Website (navigation)
- BreadcrumbList (category pages)

### 14.2 Real-Time Sitemaps

**Endpoints:**
- `/sitemap.xml` (master index)
- `/sitemap-listings.xml` (auto-generated from DB)
- `/sitemap-categories.xml`
- `/sitemap-cities.xml`

**Auto-Update:**
- Regenerate on listing create/update/delete
- Invalidate cache
- Use streams for generation (not full array load)

### 14.3 Performance Optimization

**Image Optimization:**
- Supabase Storage transformations: WebP, auto quality, resize
- `<OptimizedImage>` component with lazy loading
- Blur-up placeholders
- Responsive sizing (srcset)
- 1:1 aspect ratio for all images

**Page Loading:**
- Lazy load heavy components
- Remove blocking scripts
- Prefetch critical routes
- Global caching (stale-while-revalidate)
- Browser cache headers (.htaccess)

**Database:**
- Indexed columns: city, area, pin_code, property_type, status, created_at
- RPC functions for complex queries (avoid N+1)
- Cached queries with Supabase
- Pagination + infinite scroll

**Targets:**
- Lighthouse Performance: 90+
- SEO: 95+
- Best Practices: 90+
- Accessibility: 90+
- Load time: < 2 seconds

---

## 15. Security

### 15.1 Row Level Security (RLS)

**All tables must have RLS enabled with policies:**

**profiles:**
- SELECT: Public (for displaying owner info)
- UPDATE: Own profile only (`auth.uid() = id`)

**properties:**
- SELECT: Public (all active listings)
- INSERT: Authenticated users
- UPDATE: Owner only (`auth.uid() = user_id`)
- DELETE: Owner only (`auth.uid() = user_id`)

**favorites:**
- SELECT: Own favorites (`auth.uid() = user_id`)
- INSERT: Authenticated users
- DELETE: Own favorites

**messages:**
- SELECT: Sender or receiver (`auth.uid() IN (sender_id, receiver_id)`)
- INSERT: Authenticated users (sender_id = auth.uid())
- UPDATE: Sender only (for edit/delete)

**leads:**
- SELECT: Owner or submitter (`auth.uid() IN (owner_id, user_id)`)
- INSERT: Authenticated users
- UPDATE: Owner only (`auth.uid() = owner_id`)

**reviews:**
- SELECT: Public
- INSERT: Authenticated users with interaction
- UPDATE: Own review (`auth.uid() = reviewer_id`)
- DELETE: Own review or admin

**reports:**
- SELECT: Own reports or admin (`auth.uid() = reporter_id OR is_admin()`)
- INSERT: Authenticated users
- UPDATE: Admin only

**ad_campaigns:**
- SELECT: Own campaigns (`auth.uid() = user_id`)
- INSERT: Authenticated users
- UPDATE: Own campaigns
- DELETE: Own campaigns

**CRM tables (crm_clients, crm_tasks):**
- SELECT: Owner only (`auth.uid() = owner_id`)
- INSERT: Authenticated users
- UPDATE: Owner only
- DELETE: Owner only

### 15.2 Input Validation

**All Forms:**
- Zod schema validation on frontend
- Server-side validation in Supabase functions
- Sanitize user input (escape HTML, SQL injection prevention)
- Rate limiting on API endpoints

**File Uploads:**
- Max file size: 10MB per image
- Allowed types: image/jpeg, image/png, image/webp
- Scan for malware (if possible)
- Store in Supabase Storage with RLS

---

## 16. Notification System (Removed)

**Note:** In-app notifications feature was deprecated. Use email/SMS for critical notifications.

---

## 17. Mobile App (Capacitor)

### 17.1 iOS Configuration

**App ID:** `com.citylifes.marketplace`

**Permissions (Info.plist):**
- NSLocationWhenInUseUsageDescription: "We need your location to show nearby listings"
- NSCameraUsageDescription: "Take photos of your property"
- NSPhotoLibraryUsageDescription: "Select photos from your gallery"

**Splash Screen:**
- Use `splash-2732x2732.png` with Citylifes logo
- Background: Brand color

### 17.2 Android Configuration

**Package:** `com.citylifes.marketplace`

**Permissions (AndroidManifest.xml):**
- ACCESS_FINE_LOCATION
- ACCESS_COARSE_LOCATION
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE

**Splash Screen:**
- `splash_with_citylifes_logo.png` in drawable folders

### 17.3 Capacitor Plugins

- `@capacitor/geolocation` (live location)
- `@capacitor/share` (share listings)
- `@capacitor/splash-screen` (splash screen)
- `@capacitor/status-bar` (status bar styling)
- `@capacitor/app` (app lifecycle)

---

## 18. Admin Dashboard

### 18.1 Admin Access Control

**Admin Role:**
- Table: `user_roles` with `role = 'admin'`
- Function: `is_admin()` checks `auth.uid()` against `user_roles`

**Admin Routes:**
- `/admin-dashboard` (overview stats)
- `/admin-reports` (user reports moderation)
- `/review-moderation` (review moderation)

### 18.2 Admin Dashboard Features

**Stats Overview:**
- Total Users
- Total Listings (active)
- Total Leads
- Total Ad Campaigns
- Revenue (if applicable)

**User Management:**
- View all users
- Search/filter users
- View user details, listings, reports
- Take action: Warning, Suspension, Ban

**Listing Management:**
- View all listings
- Approve/Reject listings (if verification required)
- Remove flagged listings

**Review Moderation:**
- View all reviews
- Filter by type, rating, date
- Delete suspicious reviews
- Force verify reviews

---

## 19. Additional Features

### 19.1 Favorites

**Implementation:**
- Heart icon on PropertyCard and PropertyDetails
- Click → Toggle favorite
- Store in `favorites` table
- Real-time sync via Supabase
- Favorites page (`/favorites`) shows all saved listings

### 19.2 View Scheduling

**Future Feature (not currently implemented):**
- User requests property viewing
- Owner receives notification
- Owner approves/rejects
- Calendar integration

### 19.3 Payment Gateway

**Future Feature (not currently implemented):**
- Advance booking payments
- Escrow model for rentals
- Owner subscription plans (premium listings)

---

## 20. Routing Structure

```
/ (Index) - Homepage with hero, categories, featured listings
/auth - Authentication (login/signup)
/auth-callback - OAuth callback handler
/setup-profile - Profile setup after auth
/forgot-password - Password reset flow

/listings - All listings with filters
/property/:id - Property details page
/add-property - Create new listing
/edit-property/:id - Edit existing listing

/favorites - Saved listings
/my-listings - Owner's listings

/messages - Chat inbox
/messages/:propertyId/:otherUserId - Chat conversation

/leads - Lead management dashboard
/crm - CRM dashboard

/ad-campaign - Ad campaign management
/campaign-analytics/:id - Campaign analytics

/profile - User profile
/edit-profile - Edit user profile
/user-profile/:userId - Public user profile

/my-reviews - User's submitted reviews
/user-reports - User's submitted reports

/map-view - Map view of listings

/settings - App settings
/privacy-policy - Privacy policy
/terms-of-service - Terms of service

/admin-dashboard - Admin overview (admin only)
/admin-reports - Admin reports moderation (admin only)
/review-moderation - Review moderation (admin only)

/404 - Not found page
```

---

## 21. Component Architecture

### 21.1 Page Components (src/pages/)
- Index.tsx
- Auth.tsx, AuthCallback.tsx, ProfileSetup.tsx, ForgotPassword.tsx
- Listings.tsx, PropertyDetails.tsx, AddProperty.tsx
- Favorites.tsx, MyListings.tsx
- Messages.tsx
- Leads.tsx, CRM.tsx, AdCampaign.tsx, CampaignAnalytics.tsx
- Profile.tsx, EditProfile.tsx, UserProfile.tsx
- MyReviews.tsx, UserReports.tsx
- MapView.tsx
- Settings.tsx, PrivacyPolicy.tsx, TermsOfService.tsx
- AdminDashboard.tsx, AdminReports.tsx, ReviewModeration.tsx
- NotFound.tsx

### 21.2 UI Components (src/components/)

**Core:**
- Layout.tsx (sidebar + bottom nav wrapper)
- AppSidebar.tsx (desktop sidebar)
- BottomNav.tsx (mobile bottom navigation)
- RequireAuth.tsx (auth guard)
- Logo.tsx, AppIcon.tsx

**Property:**
- PropertyCard.tsx (listing card)
- PromotedListingCard.tsx (sponsored listing card)
- ListingGallery.tsx (image carousel)
- OptimizedImage.tsx (lazy loading wrapper)

**Forms:**
- ImageUploadWithCompression.tsx
- LocationSelector.tsx (city/area/pincode)
- CityAreaPincodeSelector.tsx
- LiveLocationButton.tsx
- BusinessProfileForm.tsx

**Search & Filters:**
- SearchBar.tsx
- EnhancedSearchBar.tsx
- NearMeFilter.tsx
- MapFilters.tsx

**Category:**
- CategoryCard.tsx

**Reviews:**
- ReviewForm.tsx
- ReviewCard.tsx
- ReviewsList.tsx
- WriteReviewDialog.tsx

**Leads & CRM:**
- LeadCaptureDialog.tsx
- CreateCampaignDialog.tsx
- CampaignLeadsSection.tsx

**Maps:**
- PriceMarker.tsx (map price markers)

**Moderation:**
- ReportUserDialog.tsx

**SEO:**
- SEOSchema.tsx (JSON-LD injection)

**Shadcn/ui Components (src/components/ui/):**
- All shadcn components (button, card, dialog, form, etc.)

### 21.3 Custom Hooks (src/hooks/)

**Data Fetching:**
- useProperties.tsx (fetch properties)
- useProperty.tsx (single property)
- useMyListings.tsx (owner's listings)
- useSponsoredProperties.tsx (sponsored listings)
- useNearbyProperties.tsx (near me filter)

**User:**
- useUserProfile.tsx (user profile CRUD)
- useFavorites.tsx (favorites CRUD)
- useOwnerRating.tsx (owner ratings)

**Communication:**
- useMessages.tsx (chat CRUD + realtime)
- useNotifications.tsx (deprecated)

**Lead & CRM:**
- useLeads.tsx (lead management)
- useLeadActivity.tsx (lead activity)
- useCRM.tsx (CRM clients)
- useCRMTasks.tsx (CRM tasks)

**Campaigns:**
- useAdCampaigns.tsx (ad campaigns CRUD)
- useCampaignAnalytics.tsx (campaign stats)

**Reviews:**
- useReviews.tsx (review CRUD)

**Moderation:**
- useReports.tsx (user reports)
- useAdminReports.tsx (admin report management)
- useAdminUsers.tsx (admin user management)
- useAdminProperties.tsx (admin property management)
- useAdminStats.tsx (admin stats)

**Location:**
- useLocationData.tsx (city/area/pincode)
- useAutocomplete.tsx (search autocomplete)
- useAdvancedSearch.tsx (search logic)

**Admin:**
- useAdminCheck.tsx (check admin role)

**Other:**
- useSupport.tsx (support tickets)
- useAppInitialize.tsx (app initialization)
- useImagePreload.tsx (preload images)
- useMapClusters.tsx (map clustering)

### 21.4 Contexts (src/contexts/)
- AuthContext.tsx (authentication state)
- LocationContext.tsx (location state)

---

## 22. Environment Variables

```env
VITE_SUPABASE_URL=https://thxrxacsrwtadvvdwken.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key>
VITE_GOOGLE_MAPS_API_KEY=<google_maps_key>
```

---

## 23. Deployment

### 23.1 Web Deployment (Hostinger)

**Build Command:**
```bash
npm run build
```

**Output:** `dist/` folder

**Deployment:**
- Upload `dist/` contents to Hostinger public_html
- Configure `.htaccess` for SPA routing
- Set cache headers for assets

### 23.2 Mobile Deployment

**iOS:**
```bash
npx cap sync ios
npx cap open ios
```
- Build in Xcode
- Submit to App Store

**Android:**
```bash
npx cap sync android
npx cap open android
```
- Build APK/AAB in Android Studio
- Submit to Google Play Store

---

## 24. Testing Requirements

### 24.1 Unit Tests
- All custom hooks
- Validation schemas
- Utility functions

### 24.2 Integration Tests
- Form submissions
- API calls
- Authentication flows

### 24.3 E2E Tests
- Complete user journeys: Sign up → Create listing → Contact owner
- Admin workflows: Review reports → Take action
- Mobile app flows

### 24.4 Performance Tests
- Load testing (10M+ users)
- Database query performance
- Image loading performance

---

## 25. Future Enhancements

1. **AI Features:**
   - Auto property description generator
   - AI price recommendation
   - Image enhancement

2. **Advanced Search:**
   - Voice search
   - Visual search (upload image, find similar properties)

3. **Social Features:**
   - User profiles with badges
   - Referral system
   - Community forums

4. **Analytics:**
   - Listing performance analytics for owners
   - User behavior tracking
   - Heatmaps

5. **Internationalization:**
   - Multi-language support (Hindi, Tamil, Telugu, etc.)
   - Currency conversion

6. **Accessibility:**
   - Full WCAG 2.1 AA compliance
   - Screen reader optimization
   - Keyboard navigation

---

## 26. Success Metrics

**User Metrics:**
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- User Retention Rate

**Listing Metrics:**
- Total Active Listings
- Listings per Category
- Average Listing Quality Score

**Engagement Metrics:**
- Average Session Duration
- Leads Generated per Day
- Messages Sent per Day
- Favorites per User

**Conversion Metrics:**
- Lead → Qualified Rate
- Qualified → Converted Rate
- Ad Campaign ROI

**Performance Metrics:**
- Page Load Time (< 2s)
- Lighthouse Scores (90+)
- API Response Time (< 500ms)
- Uptime (99.9%)

---

## 27. Support & Maintenance

**User Support:**
- In-app support ticket system
- Email support: support@citylifes.com
- FAQ/Help Center

**Platform Updates:**
- Monthly feature releases
- Weekly bug fixes
- Real-time security patches

**Data Backup:**
- Daily automated Supabase backups
- Point-in-time recovery

---

## END OF PRD

This document covers the complete Citylifes project architecture and requirements for a full rebuild. All features, components, database schema, and business logic are documented here.

**Version:** 1.0  
**Last Updated:** December 2025  
**Contact:** Tech Team @ Citylifes
