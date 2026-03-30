/**
 * Brand configuration — MABASA TAXI VTC
 * Change these values to rebrand the entire site
 */

export const BRAND = {
  name: 'MABASA',
  tagline: 'Votre Chauffeur Privé dans les Alpes',
  description: 'Service de VTC premium dans les Hautes-Alpes. Transferts depuis et vers Courchevel, Val Thorens, Genève et toute la région alpine.',
  phone: '+33 6 17 76 95 97',
  email: 'ndiayebabacarba@gmail.com',
  whatsapp: '+33617769597',
};

export const ZONES = {
  primary: 'Hautes-Alpes',
  destinations: [
    'Courchevel',
    'Val Thorens',
    'Méribel',
    'La Tania',
    'Moutiers',
    'Albertville',
    'Chambéry',
    'Grenoble',
    'Lyon',
    'Genève',
    'Aéroport de Genève (GVA)',
    'Aéroport de Lyon Saint-Exupéry (LYS)',
    'Aéroport de Chambéry (CMF)',
    'Gare de Moutiers',
    'Gare d\'Albertville',
  ],
  rule: 'Les Hautes-Alpes doivent être le point de départ ou d\'arrivée.',
};

export const SERVICES = [
  {
    id: 'airport',
    title: 'Transferts Aéroport',
    description: 'Navette privée depuis et vers les aéroports de Genève, Lyon et Chambéry vers les stations des Alpes.',
    icon: 'Plane',
  },
  {
    id: 'ski',
    title: 'Transferts Stations de Ski',
    description: 'Rejoignez Courchevel, Val Thorens, Méribel et les plus belles stations des Alpes en toute sérénité.',
    icon: 'Mountain',
  },
  {
    id: 'business',
    title: 'Déplacements Professionnels',
    description: 'Un service ponctuel et discret pour vos rendez-vous d\'affaires et événements professionnels.',
    icon: 'Briefcase',
  },
  {
    id: 'longdistance',
    title: 'Longue Distance',
    description: 'Trajets longue distance vers Genève, Lyon, Grenoble et au-delà, dans un confort optimal.',
    icon: 'Route',
  },
];
