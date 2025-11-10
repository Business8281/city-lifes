# Performance Optimization Guide

## Overview
This document outlines all performance optimizations implemented to handle 10M+ users with fast loading times and zero crashes.

## Frontend Optimizations

### 1. Code Splitting & Lazy Loading
```typescript
// Lazy load routes
const PropertyDetails = lazy(() => import('@/pages/PropertyDetails'));
const AdCampaign = lazy(() => import('@/pages/AdCampaign'));

// Lazy load images
<img loading="lazy" src={image} alt={title} />
```

### 2. React Optimizations

#### Memoization
```typescript
// Prevent unnecessary re-renders
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Memoize callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Memoize components
const MemoizedPropertyCard = React.memo(PropertyCard);
```

#### Virtual Scrolling
For large lists (1000+ items):
```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

const rowVirtualizer = useVirtualizer({
  count: properties.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 300,
});
```

### 3. Asset Optimization

#### Image Optimization
- **Format**: WebP with JPEG fallback
- **Sizes**: Responsive srcset for different screen sizes
- **Compression**: 80% quality for optimal balance
- **Lazy Loading**: Load images as they enter viewport

```typescript
<picture>
  <source srcSet={`${image}.webp`} type="image/webp" />
  <img 
    src={image} 
    loading="lazy"
    srcSet={`${image}-400w.jpg 400w, ${image}-800w.jpg 800w`}
    sizes="(max-width: 768px) 100vw, 50vw"
    alt={title}
  />
</picture>
```

#### Bundle Optimization
- Code splitting by route
- Tree shaking for unused code
- Minification and compression
- Remove console.logs in production

### 4. Network Optimization

#### Request Optimization
```typescript
// Debounce search queries
const debouncedSearch = useMemo(
  () => debounce((query) => fetchResults(query), 300),
  []
);

// Cancel pending requests
const abortController = new AbortController();
fetch(url, { signal: abortController.signal });

// Request batching
const batchedRequests = Promise.all([
  fetchProperties(),
  fetchCampaigns(),
  fetchProfiles()
]);
```

#### Caching Strategy
```typescript
// Service Worker for offline caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// React Query caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});
```

### 5. Rendering Optimization

#### CSS Performance
```css
/* Use CSS containment */
.property-card {
  contain: layout style paint;
}

/* Hardware acceleration */
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}

/* Avoid layout thrashing */
.optimized {
  /* Read all */
  const height = element.offsetHeight;
  const width = element.offsetWidth;
  
  /* Write all */
  element.style.height = `${height}px`;
  element.style.width = `${width}px`;
}
```

#### Intersection Observer
```typescript
// Efficient viewport detection
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        trackImpression(entry.target.id);
      }
    });
  },
  { threshold: 0.5, rootMargin: '50px' }
);
```

## Backend Optimizations

### 1. Database Optimization

#### Indexes
```sql
-- Composite indexes for common queries
CREATE INDEX idx_properties_type_city_status 
ON properties(property_type, city, status, available);

-- Partial indexes for filtered queries
CREATE INDEX idx_active_campaigns 
ON ad_campaigns(property_id, status, end_date) 
WHERE status = 'active' AND end_date > now();

-- GiST index for geospatial queries
CREATE INDEX idx_properties_location 
ON properties USING GIST(location);
```

#### Query Optimization
```sql
-- Use EXPLAIN ANALYZE to check query plans
EXPLAIN ANALYZE
SELECT * FROM properties 
WHERE property_type = 'business' 
AND city = 'Mumbai'
LIMIT 20;

-- Avoid SELECT *
SELECT id, title, price, city FROM properties;

-- Use CTEs for complex queries
WITH active_campaigns AS (
  SELECT property_id, impressions 
  FROM ad_campaigns 
  WHERE status = 'active'
)
SELECT p.*, ac.impressions
FROM properties p
JOIN active_campaigns ac ON p.id = ac.property_id;
```

### 2. Connection Pooling
```typescript
// Supabase client with connection pooling
export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: { 'x-application-name': 'marketplace' }
  }
});
```

### 3. Caching Strategy

#### Database Caching
```sql
-- Materialized views for expensive queries
CREATE MATERIALIZED VIEW popular_properties AS
SELECT p.*, COUNT(f.id) as favorite_count
FROM properties p
LEFT JOIN favorites f ON p.id = f.property_id
GROUP BY p.id
ORDER BY favorite_count DESC
LIMIT 100;

-- Refresh periodically
REFRESH MATERIALIZED VIEW CONCURRENTLY popular_properties;
```

#### Redis Caching
```typescript
// Cache hot data in Redis
const cacheKey = `sponsored:${city}:${area}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const data = await fetchFromDB();
await redis.setex(cacheKey, 300, JSON.stringify(data)); // 5 min TTL
return data;
```

### 4. Rate Limiting
```sql
-- Track API rate limits
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  ip_address TEXT,
  endpoint TEXT,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ DEFAULT now()
);

-- Clean old entries
DELETE FROM rate_limits 
WHERE window_start < now() - interval '1 hour';
```

## Mobile App Optimizations

### 1. Native Performance

#### Capacitor Optimizations
```typescript
// Optimize app startup
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar } from '@capacitor/status-bar';

// Hide splash when ready
await SplashScreen.hide();

// Configure status bar
await StatusBar.setStyle({ style: Style.Dark });
```

#### Image Loading
```typescript
// Use native image caching
import { Filesystem } from '@capacitor/filesystem';

const cachedImage = await Filesystem.readFile({
  path: `cache/${imageId}.jpg`,
  directory: Directory.Cache
});
```

### 2. Memory Management

#### Cleanup
```typescript
useEffect(() => {
  const subscription = setupSubscription();
  
  return () => {
    // Clean up subscriptions
    subscription.unsubscribe();
    
    // Clear intervals/timeouts
    clearInterval(intervalId);
    
    // Remove event listeners
    element.removeEventListener('click', handler);
  };
}, []);
```

#### Image Optimization
```typescript
// Limit concurrent image loads
const loadQueue = new PQueue({ concurrency: 3 });

images.forEach(image => {
  loadQueue.add(() => loadImage(image));
});
```

## Monitoring & Analytics

### 1. Performance Metrics

#### Web Vitals
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

#### Custom Metrics
```typescript
// Track component render time
const startTime = performance.now();
// ... component render
const renderTime = performance.now() - startTime;
console.log(`Render time: ${renderTime}ms`);

// Track API response time
const apiStart = performance.now();
const response = await fetch(url);
const apiTime = performance.now() - apiStart;
console.log(`API time: ${apiTime}ms`);
```

### 2. Error Tracking
```typescript
// Global error handler
window.addEventListener('error', (event) => {
  logError({
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logError({
    message: event.reason,
    type: 'unhandledrejection'
  });
});
```

### 3. Database Monitoring
```sql
-- Log slow queries
CREATE TABLE query_performance_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query_name TEXT,
  execution_time_ms INTEGER,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Alert on slow queries
CREATE OR REPLACE FUNCTION log_slow_query()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.execution_time_ms > 1000 THEN
    -- Alert or log
    RAISE WARNING 'Slow query detected: % took %ms', 
      NEW.query_name, NEW.execution_time_ms;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Scaling Strategy

### 1. Horizontal Scaling
- Load balancer distributes traffic
- Multiple app instances
- Database read replicas
- CDN for static assets

### 2. Vertical Scaling
- Increase server resources
- Optimize database configuration
- Upgrade to better hardware

### 3. Auto-scaling
```yaml
# Example auto-scaling config
min_instances: 2
max_instances: 20
cpu_threshold: 70%
memory_threshold: 80%
scale_up_cooldown: 300s
scale_down_cooldown: 600s
```

## Best Practices Checklist

### Frontend
- [ ] Implement code splitting
- [ ] Use lazy loading for routes
- [ ] Optimize images (WebP, lazy load)
- [ ] Implement proper caching
- [ ] Minimize bundle size
- [ ] Use production builds
- [ ] Enable compression (Gzip/Brotli)
- [ ] Implement service workers
- [ ] Use CDN for assets
- [ ] Monitor Web Vitals

### Backend
- [ ] Add database indexes
- [ ] Implement connection pooling
- [ ] Use prepared statements
- [ ] Add query timeouts
- [ ] Implement rate limiting
- [ ] Use caching (Redis)
- [ ] Optimize queries (EXPLAIN)
- [ ] Set up monitoring
- [ ] Implement backups
- [ ] Use read replicas

### Mobile
- [ ] Optimize app size
- [ ] Implement offline mode
- [ ] Use native image caching
- [ ] Minimize network requests
- [ ] Implement proper error handling
- [ ] Test on low-end devices
- [ ] Optimize battery usage
- [ ] Use native components
- [ ] Implement background sync
- [ ] Test on various screen sizes

## Performance Targets

### Load Times
- **First Contentful Paint**: < 1.8s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.8s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### API Response Times
- **Database queries**: < 100ms
- **RPC functions**: < 200ms
- **File uploads**: < 2s
- **Page loads**: < 1s

### Mobile App
- **App launch**: < 2s
- **Screen transitions**: < 300ms
- **List scrolling**: 60 FPS
- **Memory usage**: < 150MB
- **Battery drain**: < 5% per hour
