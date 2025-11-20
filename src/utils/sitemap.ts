import { supabase } from '@/integrations/supabase/client';

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const generateSitemapXML = (entries: SitemapEntry[]): string => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : ''}
  </url>`).join('\n')}
</urlset>`;
  return xml;
};

export const getListingsSitemap = async (): Promise<SitemapEntry[]> => {
  const { data: properties } = await supabase
    .from('properties')
    .select('id, updated_at')
    .eq('status', 'active')
    .eq('available', true);

  if (!properties) return [];

  return properties.map(property => ({
    url: `${window.location.origin}/property/${property.id}`,
    lastmod: new Date(property.updated_at).toISOString(),
    changefreq: 'weekly' as const,
    priority: 0.8
  }));
};

export const getCategoriesSitemap = (): SitemapEntry[] => {
  const categories = [
    'homes', 'apartments', 'flats', 'commercial', 'office',
    'farmland', 'pg', 'hostel', 'hotel', 'restaurant',
    'cafe', 'farmhouse', 'warehouse', 'car', 'bike',
    'electronics', 'roommate', 'business'
  ];

  return categories.map(category => ({
    url: `${window.location.origin}/listings?property_type=${category}`,
    changefreq: 'daily' as const,
    priority: 0.7
  }));
};

export const getCitiesSitemap = (): SitemapEntry[] => {
  const cities = [
    'hyderabad', 'bangalore', 'mumbai', 'delhi', 'chennai',
    'kolkata', 'pune', 'ahmedabad', 'jaipur', 'lucknow'
  ];

  return cities.map(city => ({
    url: `${window.location.origin}/listings?city=${city}`,
    changefreq: 'daily' as const,
    priority: 0.7
  }));
};

export const getMasterSitemap = (): string => {
  const baseUrl = window.location.origin;
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-listings.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-categories.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-cities.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`;
};

// Cache configuration
const SITEMAP_CACHE_KEY = 'sitemap_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const getCachedSitemap = async (type: 'listings' | 'categories' | 'cities'): Promise<string | null> => {
  const cached = localStorage.getItem(`${SITEMAP_CACHE_KEY}_${type}`);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(`${SITEMAP_CACHE_KEY}_${type}`);
    return null;
  }

  return data;
};

export const cacheSitemap = (type: 'listings' | 'categories' | 'cities', data: string) => {
  localStorage.setItem(`${SITEMAP_CACHE_KEY}_${type}`, JSON.stringify({
    data,
    timestamp: Date.now()
  }));
};
