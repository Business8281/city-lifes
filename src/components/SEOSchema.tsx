import { Property } from '@/types/database';

interface SEOSchemaProps {
  property: Property;
}

export const PropertySchema = ({ property }: SEOSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': ['Product', 'Residence'],
    name: property.title,
    description: property.description,
    image: property.images,
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: property.available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.area,
      addressRegion: property.city,
      postalCode: property.pin_code,
      addressCountry: 'IN'
    },
    geo: property.latitude && property.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: property.latitude,
      longitude: property.longitude
    } : undefined,
    propertyType: property.property_type,
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: property.area_sqft ? {
      '@type': 'QuantitativeValue',
      value: property.area_sqft,
      unitCode: 'FTK'
    } : undefined,
    amenityFeature: property.amenities?.map(amenity => ({
      '@type': 'LocationFeatureSpecification',
      name: amenity
    })),
    url: `${window.location.origin}/property/${property.id}`
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const BreadcrumbSchema = ({ items }: { items: { name: string; url: string }[] }) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${window.location.origin}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Citylifes',
    url: window.location.origin,
    logo: `${window.location.origin}/icon-512.png`,
    description: 'India\'s fastest growing hyperlocal marketplace for properties, vehicles, and electronics',
    sameAs: [
      'https://www.facebook.com/citylifes',
      'https://www.twitter.com/citylifes',
      'https://www.instagram.com/citylifes'
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const WebsiteSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Citylifes',
    url: window.location.origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${window.location.origin}/listings?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
