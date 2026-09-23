/* ─────────────────────────────────────────────────────────────────────────────
   LEAD PERSISTENCE & RECOVERY ENGINE
   Ensures zero lost leads if the user exits WhatsApp without sending.
   Stores locally in localStorage and dispatches to Google Apps Script Webhook.
   Supports full 18-column schema:
   Lead ID | Created At | Name | Phone | City | Address | Product | Pack |
   Quantity | Unit Price (DH) | Total (DH) | UTM Source | UTM Medium |
   UTM Campaign | UTM Content | Status | Notes | Last Updated
───────────────────────────────────────────────────────────────────────────── */

export interface SavedLead {
  id: string;
  lead_id?: string;
  nom: string;
  name?: string;
  telephone: string;
  phone?: string;
  ville: string;
  city?: string;
  adresse: string;
  address?: string;
  product?: string;
  quantite: number;
  quantity?: number;
  formule: string;
  pack?: string;
  unit_price?: number;
  montantTotal: number;
  total?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  createdAt: string;
  created_at?: string;
  status: "Lead" | "pending_whatsapp" | "submitted";
  notes?: string;
  last_updated?: string;
}

const STORAGE_KEY = "modetrend_leads_store";

function getUtmParams() {
  if (typeof window === "undefined" || !window.location) {
    return { utm_source: "", utm_medium: "", utm_campaign: "", utm_content: "" };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
  };
}

export function saveLead(leadData: {
  nom: string;
  telephone: string;
  ville: string;
  adresse: string;
  quantite: number;
  formule: string;
  montantTotal: number;
  product?: string;
  notes?: string;
}): SavedLead {
  const nowIso = new Date().toISOString();
  const uniqueId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const utm = getUtmParams();
  const unitPrice = leadData.quantite > 0 ? Math.round(leadData.montantTotal / leadData.quantite) : 249;

  const newLead: SavedLead = {
    id: uniqueId,
    lead_id: uniqueId,
    nom: leadData.nom,
    name: leadData.nom,
    telephone: leadData.telephone,
    phone: leadData.telephone,
    ville: leadData.ville,
    city: leadData.ville,
    adresse: leadData.adresse,
    address: leadData.adresse,
    product: leadData.product || "Table d'Appoint Mode Trend (Réglable & Inclinable)",
    quantite: leadData.quantite,
    quantity: leadData.quantite,
    formule: leadData.formule,
    pack: leadData.formule,
    unit_price: unitPrice,
    montantTotal: leadData.montantTotal,
    total: leadData.montantTotal,
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    createdAt: nowIso,
    created_at: nowIso,
    status: "Lead",
    notes: leadData.notes || "",
    last_updated: nowIso,
  };

  try {
    const existing: SavedLead[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.unshift(newLead);
    // Keep last 100 leads locally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn("Could not save lead to localStorage:", err);
  }

  // Webhook integration (Google Sheets Apps Script / CRM / Zapier)
  const webhookUrl = (typeof import.meta !== "undefined" && import.meta.env?.VITE_LEADS_WEBHOOK_URL) || "";
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(newLead),
      mode: "no-cors",
    }).catch((err) => {
      console.warn("Webhook dispatch error:", err);
    });
  }

  return newLead;
}

export function getSavedLeads(): SavedLead[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

