/**
 * Utility to update SEO metadata (Title, Meta Description, OpenGraph, JSON-LD)
 * dynamically based on the current season/mode (vtc vs medical).
 */

const VTC_METADATA = {
  title: 'MABASA | Chauffeur Privé VTC/Taxi Hautes-Alpes & Genève',
  description: 'Service de VTC et Taxi premium dans les Hautes-Alpes. Transferts gares et aéroports vers Courchevel, Val Thorens, Méribel et Genève. Chauffeurs professionnels.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    'name': 'MABASA VTC & Taxi Premium',
    'description': 'Service de VTC et Taxi premium dans les Hautes-Alpes, Savoie et Genève.',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'MABASA VTC',
      'telephone': '+33 6 17 76 95 97',
      'email': 'ndiayebabacarba@gmail.com',
      'priceRange': '$$$',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Gap',
        'addressRegion': 'Hautes-Alpes',
        'postalCode': '05000',
        'addressCountry': 'FR'
      }
    },
    'areaServed': [
      { '@type': 'AdministrativeArea', 'name': 'Hautes-Alpes (05)' },
      { '@type': 'AdministrativeArea', 'name': 'Auvergne-Rhône-Alpes' },
      { '@type': 'AdministrativeArea', 'name': 'Savoie (73)' },
      { '@type': 'AdministrativeArea', 'name': 'Genève' }
    ]
  }
};

const MEDICAL_METADATA = {
  title: 'Taxi Conventionné Arles | Prise en Charge CPAM 100% - MABASA',
  description: 'Taxi conventionné agréé CPAM à Arles et ses environs. Transport assis personnalisé vers hôpitaux, cliniques et consultations médicales. Tiers-payant, aucun frais à avancer.',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'TaxiService',
    'name': 'MABASA Taxi Conventionné',
    'description': 'Service de Taxi conventionné CPAM agréé pour les transports médicaux à Arles.',
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'MABASA Taxi Conventionné Arles',
      'telephone': '+33 6 17 76 95 97',
      'email': 'ndiayebabacarba@gmail.com',
      'priceRange': '$$',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Arles',
        'addressRegion': 'Bouches-du-Rhône',
        'postalCode': '13200',
        'addressCountry': 'FR'
      }
    },
    'areaServed': [
      { '@type': 'AdministrativeArea', 'name': 'Arles' },
      { '@type': 'AdministrativeArea', 'name': 'Bouches-du-Rhône (13)' },
      { '@type': 'AdministrativeArea', 'name': 'Provence-Alpes-Côte d\'Azur' }
    ]
  }
};

export function updateSEOMetadata(mode) {
  const metadata = mode === 'medical' ? MEDICAL_METADATA : VTC_METADATA;

  // 1. Update document title
  document.title = metadata.title;

  // 2. Update meta description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = metadata.description;

  // 3. Inject / Update JSON-LD Script tag
  let scriptTag = document.getElementById('jsonld-seo');
  if (!scriptTag) {
    scriptTag = document.createElement('script');
    scriptTag.id = 'jsonld-seo';
    scriptTag.type = 'application/ld+json';
    document.head.appendChild(scriptTag);
  }
  scriptTag.innerHTML = JSON.stringify(metadata.jsonLd);
}
