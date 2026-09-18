# Landing Page E-commerce COD — Standard & Blueprint de Référence

Ce document constitue la **référence officielle** pour toutes les prochaines landing pages e-commerce COD (Maroc / MENA).

---

## 🏗️ 1. Architecture Technique & Performance
- **Framework** : React 19 + TypeScript + Vite 8.
- **Styling** : Tailwind CSS v4 (`@import "tailwindcss";` dans `src/index.css` sans config PostCSS superflue).
- **Typographie de marque** :
  - `DM Serif Display` (Titres, prix, élégance et prestige).
  - `Manrope` (Corps de texte, lisibilité optimale sur mobile).
- **Vitesse de chargement** : Build ultra-léger (< 90 kB gzippé), images produit réelles optimisées dans `/public/images/`.

---

## 🎯 2. Standard Meta Pixel & Data Tracking (`src/lib/pixel.ts`)
- **Dédoublonnage strict** : Protection via `window.__pageViewFired` et drapeaux de cycle de vie React.
- **`PageView`** : Déclenché 1 seule fois au montage initial.
- **`ViewContent`** : Déclenché lors de la vue produit/hero.
- **`InitiateCheckout`** : Déclenché **uniquement** à la 1ère interaction réelle avec les champs du formulaire (jamais sur un simple clic de bouton ou un scroll).
- **`Lead`** : Déclenché à la soumission valide du formulaire avec un `eventID` unique (compatible Conversions API) et un cooldown anti-double clic (4s).
- **`Contact`** : Déclenché sur les boutons WhatsApp directs d'assistance.
- **Zéro faux `Purchase`** : Respect strict du modèle Cash on Delivery.

---

## 🎨 3. Règle Sémantique des Fonds & Hiérarchie Visuelle
- ⚪ **Fond Blanc Pur (`bg-white`) — Zones de Preuve & Conversion** :
  - Avantages clés et points forts (Key Benefits).
  - Badges de réassurance et engagements de service.
  - Avis et témoignages clients réels avec photos/avatars (Reviews).
  - Cartes d'offres et formulaire de commande.
  - Appel à l'action final (Final CTA).
- 🪵 **Fond Crème / Ivoire (`bg-[#FAF6F0]` / `bg-[#F9F6F1]`) — Zones de Marque & Storytelling** :
  - Section Hero & Présentation générale.
  - Moments de vie et cas d'usage réels (Lifestyle & Editorial).
  - Foire aux questions (FAQ).

---

## 📦 4. Suppression des Boîtes dans des Boîtes (Editorial Unboxed)
- Ne pas enfermer les rangées de storytelling dans de gros conteneurs blancs rigides.
- Utiliser une mise en page 2 colonnes aérée (image haute résolution d'un côté, texte éditorial soigné de l'autre) directement sur le fond crème.
- Réserver les encadrements/cartes uniquement aux éléments interactifs (Packs, Avis, Formulaire).

---

## 💰 5. Cohérence Absolue des Prix & Psychologie de Vente
- **Prix d'appel transparent** : Afficher dès le hero le prix unitaire de base (`À partir de 249 DH`).
- **Synchronisation dynamique 100%** : Le prix sélectionné se répercute instantanément sur :
  1. Le bouton du Header.
  2. La barre Sticky Mobile flottante.
  3. Les sélecteurs de formules (1 Table, Duo, Pack 3).
  4. Le récapitulatif du formulaire.
  5. Le bouton final de validation.
- **Formule "Star" (Best Value)** : Mise en valeur du Pack Duo avec badge `★ Le plus choisi`, encadrement renforcé et calcul de l'économie unitaire.

---

## 📱 6. Expérience Mobile & Tunnel WhatsApp COD
- **Barre Sticky Mobile** : Apparaît après le scroll du hero et se masque automatiquement quand le formulaire est visible.
- **Sélecteur de Villes Marocaines** : Auto-complétion des principales villes marocaines.
- **Message WhatsApp pré-rempli** : Structure claire avec le détail du pack, le montant total, l'adresse et le rappel de la gratuité de livraison.
