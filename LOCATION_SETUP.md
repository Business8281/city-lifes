# Location-Based Properties Setup Guide

## Database Setup

### Step 1: Run the SQL Script

1. Go to your Supabase Dashboard → SQL Editor
2. Open the `database-setup.sql` file in this project
3. Copy all the SQL code
4. Paste it into the SQL Editor
5. Click "Run" to execute

This will create:
- ✅ Properties table with location fields (city, area, PIN code, GPS coordinates)
- ✅ PostGIS extension for geolocation calculations
- ✅ Automatic location indexing for fast queries
- ✅ Row Level Security policies
- ✅ `search_properties_by_location()` function for filtering

### Step 2: Verify the Setup

Run this query to verify:
```sql
SELECT * FROM public.properties LIMIT 1;
```

## How Location Filtering Works

The app filters properties based on:

1. **City Filter**: Shows only properties in the selected city
2. **Area Filter**: Shows properties in a specific area/locality
3. **PIN Code Filter**: Exact PIN code matching
4. **Live Location (GPS)**: Shows properties within radius (default 10km)

### Location Priority

When a user sets location, properties are filtered in this order:
- If GPS is enabled → Show properties within radius, sorted by distance
- If PIN code is set → Show exact PIN code matches only
- If area is set → Show properties in that area
- If city is set → Show properties in that city
- No location → Show all active properties

## Native App GPS Setup

### Android Permissions

After running `npx cap add android`, edit `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest>
  <!-- Add these permissions -->
  <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  
  <application>
    <!-- Your app config -->
  </application>
</manifest>
```

### iOS Permissions

After running `npx cap add ios`, edit `ios/App/App/Info.plist`:

```xml
<dict>
  <!-- Add these entries -->
  <key>NSLocationWhenInUseUsageDescription</key>
  <string>We need your location to show properties near you</string>
  
  <key>NSLocationAlwaysUsageDescription</key>
  <string>We need your location to show properties near you</string>
</dict>
```

## Testing Location Features

### Web Browser
1. Click "Use Current Location" in the app
2. Browser will ask for location permission
3. Allow location access
4. Properties within 10km will be displayed

### Android/iOS App
1. Build and run: `npx cap run android` or `npx cap run ios`
2. App will request location permission on first use
3. Grant permission in device settings if denied
4. Use the location selector in the app

## API Usage Example

### Search by City
```typescript
const { data } = await supabase.rpc('search_properties_by_location', {
  search_city: 'Delhi',
  property_type_filter: 'apartment'
});
```

### Search by GPS Location
```typescript
const { data } = await supabase.rpc('search_properties_by_location', {
  search_latitude: 28.5494,
  search_longitude: 77.2001,
  radius_km: 5
});
```

### Search by PIN Code
```typescript
const { data } = await supabase.rpc('search_properties_by_location', {
  search_pin_code: '110016'
});
```

## Adding Sample Data

To test the system, insert sample properties:

```sql
INSERT INTO public.properties (
  user_id, title, description, property_type, price, 
  city, area, pin_code, latitude, longitude,
  bedrooms, bathrooms, area_sqft, verified, available
) VALUES
  (
    (SELECT id FROM auth.users LIMIT 1), -- Use your user_id
    'Luxury Apartment in Green Park',
    'Modern 3BHK with all amenities',
    'apartment',
    45000,
    'Delhi',
    'Green Park',
    '110016',
    28.5494,
    77.2001,
    3,
    2,
    1850,
    true,
    true
  );
```

## Troubleshooting

### GPS not working on web
- Ensure HTTPS is enabled (required for geolocation API)
- Check browser location permissions
- Some browsers block location on localhost

### GPS not working on mobile
- Check app has location permissions in device settings
- For iOS: Settings → Privacy → Location Services → Your App
- For Android: Settings → Apps → Your App → Permissions

### No properties showing
- Check location is set correctly
- Verify properties exist in selected location
- Try increasing radius: `radius_km: 20`
- Check RLS policies allow reading properties

## Need Help?

- Supabase PostGIS docs: https://supabase.com/docs/guides/database/extensions/postgis
- Capacitor Geolocation: https://capacitorjs.com/docs/apis/geolocation
