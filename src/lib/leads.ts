/* ─────────────────────────────────────────────────────────────────────────────
   LEAD PERSISTENCE & RECOVERY ENGINE
   Ensures zero lost leads if the user exits WhatsApp without sending.
   Stores locally in localStorage and optionally dispatches to a Webhook/API.
───────────────────────────────────────────────────────────────────────────── */

export interface SavedLead {
  id: string;
  nom: string;
  telephone: string;
  ville: string;
  adresse: string;
  quantite: number;
  formule: string;
  montantTotal: number;
  createdAt: string;
  status: "pending_whatsapp" | "submitted";
}

const STORAGE_KEY = "modetrend_leads_store";

export function saveLead(leadData: Omit<SavedLead, "id" | "createdAt" | "status">): SavedLead {
  const newLead: SavedLead = {
    ...leadData,
    id: `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    createdAt: new Date().toISOString(),
    status: "pending_whatsapp",
  };

  try {
    const existing: SavedLead[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    existing.unshift(newLead);
    // Keep last 100 leads locally
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn("Could not save lead to localStorage:", err);
  }

  // Optional Webhook integration (Google Sheets / CRM / Zapier / Make)
  const webhookUrl = (typeof import.meta !== "undefined" && import.meta.env?.VITE_LEADS_WEBHOOK_URL) || "";
  if (webhookUrl) {
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
