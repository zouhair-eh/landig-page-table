/* ─────────────────────────────────────────────────────────────────────────────
   META PIXEL TRACKING UTILITY
   Clean, GDPR/Privacy-conscious tracking helper for React/Vite.
   Prevents duplicate initialization and duplicate event firing during re-renders.
───────────────────────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

// Pixel ID configuré (Remplacez par votre Pixel ID réel ici ou dans un fichier .env avec VITE_META_PIXEL_ID)
export const DEFAULT_META_PIXEL_ID = "1686363418579842";
export const META_PIXEL_ID =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_META_PIXEL_ID) ||
  DEFAULT_META_PIXEL_ID;

let isInitialized = false;

/**
 * Initialise le script Meta Pixel de manière sécurisée (une seule fois).
 */
export function initMetaPixel(pixelId: string = META_PIXEL_ID) {
  if (typeof window === "undefined") return;
  if (isInitialized || window.fbq) {
    return;
  }

  /* eslint-disable */
  (function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  if (window.fbq) {
    // Si l'ID est configuré (même en placeholder), initialiser fbq
    window.fbq("init", pixelId);
    isInitialized = true;
  }
}

/**
 * 1. PageView — Déclenché à la visite de la page
 */
export function trackPageView() {
  if (typeof window !== "undefined" && window.fbq) {
    if ((window as any).__pageViewFired) {
      return;
    }
    window.fbq("track", "PageView");
    (window as any).__pageViewFired = true;
  }
}

/**
 * 2. ViewContent — Déclenché quand l'utilisateur consulte le produit / hero
 */
export function trackViewContent(data?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_name: data?.content_name || "Table d'Appoint Mode Trend (Réglable & Inclinable)",
      content_category: data?.content_category || "Mobilier & Maison",
      value: data?.value || 249,
      currency: data?.currency || "MAD",
    });
  }
}

/**
 * 3. InitiateCheckout — Déclenché lors de la première interaction avec les champs du formulaire
 */
export function trackInitiateCheckout(data?: {
  content_name?: string;
  value?: number;
  currency?: string;
  num_items?: number;
}) {
  if (typeof window !== "undefined" && window.fbq) {
    if ((window as any).__initiateCheckoutFired) {
      return;
    }
    (window as any).__initiateCheckoutFired = true;
    window.fbq("track", "InitiateCheckout", {
      content_name: data?.content_name || "Table d'Appoint Mode Trend (Réglable & Inclinable)",
      value: data?.value || 249,
      currency: data?.currency || "MAD",
      num_items: data?.num_items || 1,
    });
  }
}

/**
 * 4. Lead — Déclenché quand l'utilisateur soumet correctement le formulaire de commande.
 * Dédoublonnage strict :
 *   - Par eventId (lead ID unique) : si le même ID a déjà été envoyé, on ignore.
 *   - Par session (window flag) : empêche tout re-fire sur navigation retour ou re-montage.
 * (AUCUN événement Purchase n'est envoyé ici conformément aux exigences)
 * Compatible Conversions API (CAPI).
 */
export function trackLead(
  data?: {
    content_name?: string;
    value?: number;
    currency?: string;
    quantity?: number;
  },
  eventId?: string
) {
  if (typeof window === "undefined" || !window.fbq) return;

  // Dedup by eventId: never fire the same lead ID twice in the same session
  const firedIds: string[] = (window as any).__leadFiredIds ?? [];
  if (eventId && firedIds.includes(eventId)) {
    return;
  }

  const payload = {
    content_name: data?.content_name || "Table d'Appoint Mode Trend (Réglable & Inclinable)",
    value: data?.value || 249,
    currency: data?.currency || "MAD",
    num_items: data?.quantity || 1,
  };

  if (eventId) {
    window.fbq("track", "Lead", payload, { eventID: eventId });
    // Record this ID so it can never be fired again in the same browser session
    firedIds.push(eventId);
    (window as any).__leadFiredIds = firedIds;
  } else {
    // No eventId: fall back to a single-fire-per-session guard
    if ((window as any).__leadFiredAnonymous) return;
    window.fbq("track", "Lead", payload);
    (window as any).__leadFiredAnonymous = true;
  }
}

/**
 * Reset Lead deduplication flags — for testing only, never call in production.
 */
export function resetLeadDedup() {
  if (typeof window !== "undefined") {
    delete (window as any).__leadFiredIds;
    delete (window as any).__leadFiredAnonymous;
  }
}

/**
 * 5. Contact — Déclenché quand l'utilisateur clique sur un lien ou bouton de contact direct WhatsApp
 */
export function trackContact(channel: string = "WhatsApp") {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", "Contact", {
      content_name: `Contact via ${channel}`,
    });
  }
}
