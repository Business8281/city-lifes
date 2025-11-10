# Ad Campaign System Documentation

## Overview
The ad campaign system allows business owners to promote their business listings through location-based advertisements. This system is designed to scale to 10M+ users with optimized performance and data security.

## Key Features

### 1. **Business Listings Only**
- Only properties with `property_type = 'business'` can have ad campaigns
- Database trigger enforces this constraint at the data level
- Frontend validation prevents non-business properties from being selected

### 2. **Location-Based Advertising**
The system supports multiple location targeting methods:

#### **City-Based Targeting**
```sql
WHERE p.city ILIKE '%Mumbai%'
```
- Shows ads to users browsing properties in specific cities
- Case-insensitive matching

#### **Area-Based Targeting**
```sql
WHERE p.area ILIKE '%Andheri%'
```
- Targets specific neighborhoods or localities
- More granular than city-level targeting

#### **PIN Code Targeting**
```sql
WHERE p.pin_code = '400053'
```
- Precise targeting using postal codes
- Exact match only

#### **Live Location (GPS) Targeting**
```sql
WHERE ST_DWithin(
  p.location::geography,
  ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
  10000  -- 10km radius in meters
)
```
- Real-time location-based ads within 10km radius
- Uses PostGIS for efficient geospatial queries
- Automatically calculates distance for sorting

### 3. **Campaign Metrics**
Each campaign tracks:
- **Impressions**: Count when ad is 50%+ visible in viewport
- **Clicks**: Count when user clicks on the ad
- **Budget**: Total campaign budget
- **Spent**: Amount consumed (auto-calculated)
- **Start/End Date**: Campaign duration

### 4. **Performance Optimization**

#### Database Indexes
```sql
-- Active campaigns index
CREATE INDEX idx_ad_campaigns_status_end_date 
ON ad_campaigns(status, end_date) 
WHERE status = 'active';

-- Property lookup index
CREATE INDEX idx_ad_campaigns_property_id 
ON ad_campaigns(property_id);

-- Business properties index
CREATE INDEX idx_properties_type_status 
ON properties(property_type, status, available) 
WHERE property_type = 'business';

-- Geospatial index for location queries
CREATE INDEX idx_properties_location 
ON properties USING GIST(location);
```

#### Frontend Optimizations
- **IntersectionObserver**: Tracks impressions only when ads are visible
- **Fire-and-forget metrics**: Non-blocking impression/click tracking
- **Memoization**: Uses `useCallback` and `useRef` to prevent re-renders
- **Lazy loading**: Images load on-demand
- **Virtual scrolling**: Only renders visible items

### 5. **Security Features**

#### Row-Level Security (RLS)
```sql
-- Users can only manage their own campaigns
CREATE POLICY "Users can update own campaigns"
ON ad_campaigns FOR UPDATE
USING (auth.uid() = user_id);

-- Only business properties allowed
CREATE TRIGGER ensure_business_property_campaign
BEFORE INSERT OR UPDATE ON ad_campaigns
FOR EACH ROW
EXECUTE FUNCTION check_business_property_for_campaign();
```

#### Data Protection
- Encrypted connections (HTTPS/WSS)
- JWT-based authentication
- API rate limiting
- SQL injection prevention via parameterized queries

### 6. **Ad Display Logic**

#### Priority Sorting
Ads are displayed based on:
1. **Remaining Budget**: Higher budget = higher priority
2. **Impressions**: Lower impressions = higher priority (fair distribution)
3. **Creation Date**: Newer campaigns prioritized

```sql
ORDER BY 
  (ac.budget - ac.spent) DESC,
  ac.impressions ASC,
  ac.created_at DESC
LIMIT 10;
```

#### Display Locations
- **Home Page**: Top 4 sponsored businesses
- **Listings Page**: Horizontal scrollable section at top
- **Labeled**: Clear "Sponsored" or "AD" badge

### 7. **Campaign Management**

#### Creating a Campaign
```typescript
const campaign = {
  property_id: 'uuid',
  title: 'Summer Sale',
  budget: 5000,
  start_date: '2025-01-01',
  end_date: '2025-01-31',
  status: 'active'
};
```

#### Status Management
- **Active**: Campaign is running
- **Paused**: Temporarily stopped (no impressions/clicks counted)
- **Completed**: End date reached or budget exhausted

#### Budget Management
```sql
-- Only show ads with remaining budget
WHERE ac.budget > ac.spent
```

### 8. **Scalability for 10M+ Users**

#### Database Scaling
- **Connection Pooling**: Supabase handles 1000+ concurrent connections
- **Read Replicas**: Distribute read queries
- **Caching**: Redis for hot data
- **Partitioning**: Partition by date for large tables

#### Frontend Scaling
- **CDN**: Static assets via CDN
- **Code Splitting**: Lazy load routes
- **Image Optimization**: WebP format, responsive sizes
- **Service Workers**: Cache API responses

#### API Optimization
- **Pagination**: Limit 10 results per query
- **Debouncing**: Search queries debounced 300ms
- **Request Batching**: Group multiple requests
- **Compression**: Gzip/Brotli for API responses

### 9. **Monitoring & Analytics**

#### Performance Metrics
- Query execution time
- API response time
- Error rates
- Cache hit rates

#### Business Metrics
- Campaign CTR (Click-Through Rate)
- Cost per click
- Impression distribution
- Budget utilization

### 10. **Best Practices**

#### For Business Owners
1. Set realistic budgets based on target audience
2. Use specific location targeting for local businesses
3. Monitor campaign performance regularly
4. Pause campaigns to preserve budget
5. Update business details for better engagement

#### For Developers
1. Always use prepared statements (SQL injection prevention)
2. Implement proper error handling
3. Log all campaign operations for audit
4. Test location queries with various inputs
5. Monitor database performance regularly

## API Reference

### Get Sponsored Properties
```typescript
const { data } = await supabase.rpc('get_sponsored_properties', {
  filter_city: 'Mumbai',
  filter_area: null,
  filter_pin_code: null,
  filter_lat: null,
  filter_lng: null,
  radius_km: 10
});
```

### Increment Impressions
```typescript
await supabase.rpc('increment_campaign_impressions', {
  campaign_id: 'uuid'
});
```

### Increment Clicks
```typescript
await supabase.rpc('increment_campaign_clicks', {
  campaign_id: 'uuid'
});
```

## Troubleshooting

### Ads Not Showing
1. Check campaign status is 'active'
2. Verify end_date > now()
3. Ensure budget > spent
4. Confirm property_type = 'business'
5. Check location filters match property location

### Performance Issues
1. Check database indexes exist
2. Monitor query execution time
3. Verify network latency
4. Check for N+1 query problems
5. Review frontend bundle size

### Location Targeting Not Working
1. Verify latitude/longitude are set
2. Check PostGIS extension is enabled
3. Ensure SRID is 4326 (WGS 84)
4. Test ST_DWithin query manually
5. Verify location column is populated

## Future Enhancements

1. **A/B Testing**: Test different ad creatives
2. **Bidding System**: Real-time ad auction
3. **Advanced Analytics**: Conversion tracking, heat maps
4. **Scheduling**: Time-of-day targeting
5. **Audience Segments**: Target specific user demographics
6. **Video Ads**: Support for video content
7. **Native Integration**: Seamless ad blending
8. **Fraud Detection**: Click fraud prevention
