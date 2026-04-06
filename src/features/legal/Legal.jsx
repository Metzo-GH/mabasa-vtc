import { useLocation } from 'react-router-dom';
import { BRAND } from '../../config/brand';
import './Legal.css';

const LEGAL_CONTENT = {
  '/mentions-legales': {
    title: 'Mentions Légales',
    content: `
## Éditeur du site

**${BRAND.name}**
Chauffeur VTC/Taxi — Hautes-Alpes, France

- **Email** : ${BRAND.email}
- **Téléphone** : ${BRAND.phone}

## Hébergeur

Ce site est hébergé par Vercel Inc.
440 N Barranca Ave #4133, Covina, CA 91723, États-Unis

## Propriété intellectuelle

L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) est protégé par le droit d'auteur. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.

## Données personnelles

Les informations recueillies via les formulaires de ce site font l'objet d'un traitement informatique destiné à la gestion des réservations et des demandes de contact. Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ce droit, veuillez nous contacter à l'adresse : ${BRAND.email}.

## Cookies

Ce site peut utiliser des cookies à des fins de statistiques et d'amélioration de l'expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser les cookies.
    `,
  },
  '/cgv': {
    title: 'Conditions Générales de Vente',
    content: `
## 1. Objet

Les présentes Conditions Générales de Vente (CGV) régissent les relations entre ${BRAND.name}, chauffeur VTC/Taxi, et ses clients pour toute réservation de transport effectuée via ce site internet.

## 2. Réservation

La réservation est effectuée via le formulaire en ligne ou par téléphone. Toute réservation est considérée comme ferme après confirmation par ${BRAND.name} par email ou téléphone.

## 3. Tarifs

Les tarifs sont communiqués sur devis et dépendent de la distance, du lieu de prise en charge et de destination, ainsi que du type de véhicule demandé. Les prix sont indiqués en euros TTC.

## 4. Paiement

Le paiement s'effectue :
- En espèces à la fin de la course
- Par carte bancaire (sous réserve de disponibilité du terminal)
- Par virement bancaire (pour les réservations à l'avance)

## 5. Annulation et modification

- **Plus de 24 heures avant le départ** : annulation gratuite
- **Moins de 24 heures avant le départ** : des frais d'annulation de 50% du montant total pourront être appliqués
- **Non-présentation (no-show)** : le montant total de la course est dû

Les modifications d'horaire ou de lieu sont possibles sous réserve de disponibilité.

## 6. Retards et attente

- **Transferts aéroport/gare** : 30 minutes d'attente gratuites après l'heure d'atterrissage/arrivée du train
- **Autres prises en charge** : 15 minutes d'attente gratuites
- Au-delà, des frais d'attente pourront être facturés

## 7. Responsabilité

${BRAND.name} s'engage à assurer le transport de ses passagers dans les meilleures conditions de sécurité et de confort. Le chauffeur est couvert par une assurance professionnelle RC Pro.

## 8. Réclamations

Toute réclamation doit être adressée à ${BRAND.email} dans un délai de 7 jours suivant la prestation.

## 9. Droit applicable

Les présentes CGV sont soumises au droit français. En cas de litige, les tribunaux compétents seront ceux du ressort du siège de l'entreprise.
    `,
  },
};

export default function Legal() {
  const { pathname } = useLocation();
  const page = LEGAL_CONTENT[pathname] || LEGAL_CONTENT['/mentions-legales'];

  // Simple markdown-to-HTML (handles ## headings, **, -, and paragraphs)
  const renderContent = (markdown) => {
    const lines = markdown.trim().split('\n');
    const elements = [];
    let currentList = [];

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`}>
            {currentList.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        );
        currentList = [];
      }
    };

    const formatInline = (text) => {
      return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    };

    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        return;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(<h3 key={i}>{trimmed.slice(3)}</h3>);
      } else if (trimmed.startsWith('- ')) {
        currentList.push(trimmed.slice(2));
      } else {
        flushList();
        elements.push(
          <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        );
      }
    });
    flushList();
    return elements;
  };

  return (
    <main className="legal-page">
      <div className="container">
        <div className="legal__content animate-fade-in-up">
          <h1>{page.title}</h1>
          <div className="divider" style={{ margin: 'var(--space-6) 0 var(--space-10)' }} />
          <div className="legal__body">
            {renderContent(page.content)}
          </div>
        </div>
      </div>
    </main>
  );
}
