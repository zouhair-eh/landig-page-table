import { useState, useEffect, useRef } from "react";
import {
  initMetaPixel,
  trackPageView,
  trackViewContent,
  trackInitiateCheckout,
  trackLead,
  trackContact,
} from "./lib/pixel";

/* ─────────────────────────────────────────────────────────────────────────────
   CONFIG & WHATSAPP LINK GENERATOR
───────────────────────────────────────────────────────────────────────────── */
// Numéro WhatsApp boutique
const WHATSAPP_NUMBER = "212767951563";

interface OrderData {
  nom: string;
  telephone: string;
  ville: string;
  adresse: string;
  quantite: number;
}

const PACKS = {
  1: {
    qty: 1,
    label: "1 Table Mode Trend",
    price: 249,
    savingsText: "Livraison gratuite partout au Maroc",
    unitPrice: 249,
  },
  2: {
    qty: 2,
    label: "Pack 2 Tables Mode Trend (Duo)",
    price: 399,
    savingsText: "Économisez 99 DH (vs 498 DH)",
    unitPrice: 199.5,
  },
  3: {
    qty: 3,
    label: "Pack 3 Tables Mode Trend (Famille)",
    price: 569,
    savingsText: "Économisez 178 DH (vs 747 DH)",
    unitPrice: 189.6,
  },
};

function getOrderSummary(qty: number) {
  if (qty === 1) return PACKS[1];
  if (qty === 2) return PACKS[2];
  if (qty === 3) return PACKS[3];
  const unitPrice = 185;
  const price = qty * unitPrice;
  const individualTotal = qty * 249;
  return {
    qty,
    label: `${qty} Tables Mode Trend`,
    price,
    savingsText: `Économisez ${individualTotal - price} DH`,
    unitPrice,
  };
}

function generateWhatsAppLink(d: OrderData) {
  const summary = getOrderSummary(d.quantite);
  const text = `Bonjour Mode Trend Maroc,

Je souhaite commander :
• Produit : Table d'Appoint Mode Trend (Réglable & Inclinable)
• Formule : ${summary.label} (Quantité : ${d.quantite})
• Montant total : ${summary.price} DH
• Livraison : Gratuite partout au Maroc
• Paiement : À la livraison (Cash on Delivery)

Mes coordonnées de livraison :
• Nom complet : ${d.nom.trim() || "Non renseigné"}
• Téléphone : ${d.telephone.trim() || "Non renseigné"}
• Ville : ${d.ville.trim() || "Non renseigné"}
• Adresse complète : ${d.adresse.trim() || "Non renseigné"}

Merci de me confirmer la commande pour expédition !`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

const MOROCCAN_CITIES = [
  "Casablanca", "Rabat", "Marrakech", "Tanger", "Fès", "Agadir", "Salé",
  "Meknès", "Oujda", "Kénitra", "Tétouan", "Temara", "Safi", "Mohammédia",
  "El Jadida", "Béni Mellal", "Nador", "Khouribga", "Settat", "Berrechid"
];

/* ─────────────────────────────────────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────────────────────────────────────── */
function IconWhatsApp({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function IconCheck({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconTruck({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="1" y="3" width="15" height="13" rx="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function IconBanknote({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="3" />
      <path d="M6 12h.01M18 12h.01" />
    </svg>
  );
}

function IconPhoneCall({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconHeight({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3v18" />
      <path d="M8 6l4-3 4 3" />
      <path d="M8 18l4 3 4-3" />
      <path d="M3 12h18" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
}

function IconTilt({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 20h18" strokeWidth="2.5" />
      <path d="M5 19L19 9" strokeWidth="2.5" />
      <path d="M16 6l4 3-2 3" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 19a7 7 0 0 0 6-7" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

function IconBase({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* Table top */}
      <rect x="4" y="4" width="16" height="3" rx="1.5" fill="currentColor" fillOpacity="0.15" />
      <rect x="4" y="4" width="16" height="3" rx="1.5" />
      {/* Offset leg on right */}
      <line x1="16" y1="7" x2="16" y2="18" />
      {/* Ultra flat sliding base */}
      <rect x="2" y="18" width="20" height="3.5" rx="1.75" fill="currentColor" fillOpacity="0.25" />
      <rect x="2" y="18" width="20" height="3.5" rx="1.75" strokeWidth="1.75" />
    </svg>
  );
}

function IconComfort({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 11a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6H4v-6z" />
      <path d="M6 9V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
      <path d="M4 17v3" />
      <path d="M20 17v3" />
      <circle cx="12" cy="13" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconChevronDown({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN COMPONENT — Mode Trend Maroc
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState<"sofa" | "bed" | "tilt" | "details">("sofa");
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [cityFilter, setCityFilter] = useState("");
  const [touched, setTouched] = useState(false);

  const [form, setForm] = useState<OrderData>({
    nom: "",
    telephone: "",
    ville: "",
    adresse: "",
    quantite: 1,
  });

  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const orderFormRef = useRef<HTMLDivElement>(null);

  // Meta Pixel tracking deduplication refs
  const pixelInitializedRef = useRef(false);
  const viewContentTrackedRef = useRef(false);
  const initiateCheckoutTrackedRef = useRef(false);

  // 1. Meta Pixel: Initialize & Track PageView on mount
  useEffect(() => {
    if (!pixelInitializedRef.current) {
      initMetaPixel();
      trackPageView();
      pixelInitializedRef.current = true;
    }
  }, []);

  // 2. Meta Pixel: Track ViewContent when Hero / Product is viewed
  useEffect(() => {
    if (!viewContentTrackedRef.current) {
      trackViewContent({
        content_name: "Table d'Appoint Mode Trend (Réglable & Inclinable)",
        content_category: "Mobilier",
        value: 249,
        currency: "MAD",
      });
      viewContentTrackedRef.current = true;
    }
  }, []);

  // Auto-hide sticky bar when the order form enters the screen (NO InitiateCheckout on scroll)
  useEffect(() => {
    const target = orderFormRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFormVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Show sticky bar after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 380);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close city dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Guard against double submit / rapid double clicks
  const isSubmittingRef = useRef(false);

  // 3. Meta Pixel: Trigger InitiateCheckout ONLY on genuine interaction with form fields (first focus or input)
  const triggerInitiateCheckout = () => {
    if (!initiateCheckoutTrackedRef.current) {
      initiateCheckoutTrackedRef.current = true;
      const s = getOrderSummary(form.quantite);
      trackInitiateCheckout({
        content_name: "Table d'Appoint Mode Trend (Réglable & Inclinable)",
        value: s.price,
        currency: "MAD",
        num_items: form.quantite,
      });
    }
  };

  const scrollToOrder = (qtyChoice?: number) => {
    if (qtyChoice) {
      setForm((prev) => ({ ...prev, quantite: qtyChoice }));
    }
    // No InitiateCheckout event triggered on button click / scroll
    const el = document.getElementById("order-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // 4. Meta Pixel: Track Lead strictly on valid form submit, protected against double clicks & duplicate eventIDs
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    // Double submit protection: ignore any rapid re-clicks / double clicks
    if (isSubmittingRef.current) {
      return;
    }

    const nomTrimmed = form.nom.trim();
    const phoneTrimmed = form.telephone.trim();
    const villeTrimmed = form.ville.trim();
    const adresseTrimmed = form.adresse.trim();

    // Strict validation of required fields
    if (!nomTrimmed || !phoneTrimmed || !villeTrimmed || !adresseTrimmed) {
      return;
    }

    // Lock submission immediately to prevent duplicate Lead firing
    isSubmittingRef.current = true;

    const currentSummary = getOrderSummary(form.quantite);
    // 1 Submit = 1 Single EventID generated ONCE
    const leadEventId = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Fire 1 single Lead event with the unique eventID
    trackLead(
      {
        content_name: "Table d'Appoint Mode Trend (Réglable & Inclinable)",
        value: currentSummary.price,
        currency: "MAD",
        quantity: form.quantite,
      },
      leadEventId
    );

    // Open WhatsApp
    const url = generateWhatsAppLink(form);
    window.open(url, "_blank", "noopener,noreferrer");

    // Cooldown lock to ensure double clicks never generate duplicate leads
    setTimeout(() => {
      isSubmittingRef.current = false;
    }, 4000);
  };

  // 5. Meta Pixel: Track Contact on direct WhatsApp support click
  const handleDirectWhatsAppContact = () => {
    trackContact("WhatsApp");
    const text = "Bonjour Mode Trend Maroc, je souhaite avoir des informations sur la table d'appoint.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  };

  const summary = getOrderSummary(form.quantite);

  const gallery = {
    sofa: {
      src: "/images/exact_sofa.jpg",
      badge: "Utilisation au canapé",
      title: "Glisse facilement sous le canapé",
      desc: "Base plate ultra-fine qui passe sous les assises pour travailler ou manger confortablement.",
    },
    bed: {
      src: "/images/exact_bed.jpg",
      badge: "Utilisation au lit",
      title: "Table de chevet ou plateau de lecture",
      desc: "Idéale pour poser un ordinateur portable, un livre ou votre téléphone au lit.",
    },
    tilt: {
      src: "/images/exact_tilt.jpg",
      badge: "Plateau inclinable",
      title: "Réglette d'arrêt intégrée",
      desc: "Inclinez le plateau pour lire ou taper au clavier sans risque de glissement.",
    },
    details: {
      src: "/images/exact_product.png",
      badge: "Modèle & Détails",
      title: "Table Mode Trend Réglable & Inclinable",
      desc: "Plateau finition bois noyer et armature métallique noir mat avec positions multiples.",
    },
  };

  const faqs = [
    {
      q: "Comment fonctionne le paiement ?",
      a: "Le paiement s'effectue à 100% à la livraison (Cash on Delivery). Vous réglez directement le montant en espèces au livreur après réception de votre table.",
    },
    {
      q: "La livraison est-elle vraiment gratuite ?",
      a: "Oui, la livraison est 100% gratuite partout au Maroc pour toute commande de 1, 2 ou 3 tables Mode Trend.",
    },
    {
      q: "Comment se déroule la confirmation de commande ?",
      a: "Après avoir complété vos coordonnées et cliqué sur le bouton WhatsApp, votre message est généré automatiquement. Dès que vous l'envoyez, notre service client vous contacte par téléphone ou message pour valider votre adresse et lancer l'expédition.",
    },
    {
      q: "Quelles sont les dimensions et réglages de la table Mode Trend ?",
      a: "Le plateau mesure 60 cm × 40 cm. La hauteur est réglable en continu de 65 cm à 90 cm via la molette de serrage, et le plateau s'incline avec une réglette d'arrêt pour retenir vos appareils et livres.",
    },
    {
      q: "Le montage de la table est-il facile ?",
      a: "Très facile et rapide : le montage s'effectue en moins de 5 minutes. Tous les outils et les vis nécessaires sont fournis dans le colis.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9F6F1] text-[#1C1008] font-sans antialiased selection:bg-[#8A5C38] selection:text-white flex flex-col overflow-x-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          1. COMPACT ANNOUNCEMENT BAR (32-36px)
      ───────────────────────────────────────────────────────────── */}
      <div className="bg-[#1C1008] text-[#F9F6F1] h-8 sm:h-9 px-3 text-center text-[11px] sm:text-xs font-semibold tracking-wide flex items-center justify-center gap-2 shrink-0">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#25D366]" />
        <span>Livraison partout au Maroc • Paiement à la livraison</span>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. COMPACT PREMIUM HEADER (56-64px)
      ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[#F9F6F1]/95 backdrop-blur-md border-b border-[#E6D9C8] transition-all">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Logo / Wordmark Mode Trend */}
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#8A5C38] text-white flex items-center justify-center font-bold font-serif text-sm shadow-sm">
              MT
            </div>
            <div>
              <span className="font-serif text-lg sm:text-xl font-extrabold text-[#1C1008] tracking-tight block leading-none">
                Mode Trend
              </span>
              <span className="text-[9px] font-bold text-[#8A5C38] uppercase tracking-wider block">
                Mobilier Pratique Maroc
              </span>
            </div>
          </a>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToOrder()}
              className="bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-full shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <IconWhatsApp size={16} />
              <span>Commander — 249 DH</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          3. HERO SECTION (CRO & Visual Quality Focused)
      ───────────────────────────────────────────────────────────── */}
      <section id="hero" className="pt-3 pb-8 sm:py-10 lg:py-14 border-b border-[#E6D9C8]/70">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center">
            
            {/* ── PRODUCT IMAGE (Order 1 on mobile) ── */}
            <div className="w-full lg:col-span-6 xl:col-span-7 order-1 lg:order-2">
              <div className="bg-white p-2 sm:p-4 rounded-2xl sm:rounded-3xl border border-[#E6D9C8] shadow-sm">
                
                {/* Main image container */}
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF6F0] h-[290px] sm:h-[360px] lg:h-[450px] flex items-center justify-center mb-2.5">
                  <img
                    src={gallery[activeTab].src}
                    alt={gallery[activeTab].title}
                    className={`w-full h-full ${activeTab === "details" ? "object-contain p-2" : "object-cover"} object-center transition-all duration-300`}
                    loading="eager"
                  />

                  <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-xs">
                    {gallery[activeTab].badge}
                  </div>
                </div>

                {/* Fast Image Switcher Tabs: Canapé -> Lit -> Incliné -> Détails */}
                <div className="grid grid-cols-4 gap-1.5">
                  {(["sofa", "bed", "tilt", "details"] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`py-2 px-1 rounded-lg text-[11px] sm:text-xs font-bold text-center border transition-all cursor-pointer ${
                        activeTab === key
                          ? "bg-[#8A5C38] text-white border-[#8A5C38] shadow-xs"
                          : "bg-[#F9F6F1] text-[#5C3A1C] border-[#E6D9C8] hover:bg-[#F2EBE0]"
                      }`}
                    >
                      {key === "sofa" && "🛋️ Canapé"}
                      {key === "bed" && "🛏️ Lit"}
                      {key === "tilt" && "📐 Incliné"}
                      {key === "details" && "🔍 Détails"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── HEADLINE, VALUE PROP, PRICE & PRIMARY CTA ── */}
            <div className="w-full lg:col-span-6 xl:col-span-5 max-w-[560px] order-2 lg:order-1">
              
              {/* Product Badge */}
              <span className="inline-block bg-[#8A5C38]/10 text-[#8A5C38] px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2">
                Table d'Appoint Polyvalente Mode Trend
              </span>

              {/* Headline */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1C1008] leading-tight mb-2">
                Travaillez, mangez et détendez-vous confortablement avec Mode Trend.
              </h1>

              {/* Short Value Proposition */}
              <p className="text-xs sm:text-sm text-[#5C3A1C] leading-relaxed mb-3.5">
                Une table d'appoint ingénieuse avec hauteur réglable (65 à 90 cm), plateau inclinable et socle extra-plat qui glisse facilement sous votre canapé ou votre lit.
              </p>

              {/* Price & Offer Box */}
              <div className="bg-white border-2 border-[#8A5C38]/25 rounded-2xl p-3.5 sm:p-4 mb-2 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#8A5C38] uppercase tracking-wider block">
                      Offre de lancement
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-serif text-3xl sm:text-4xl font-black text-[#1C1008]">
                        249 DH
                      </span>
                      <span className="text-sm text-neutral-400 line-through font-semibold">
                        299 DH
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col gap-1.5 items-end">
                    <span className="inline-flex items-center gap-1 bg-[#128C4F]/10 text-[#128C4F] text-xs font-bold px-2.5 py-1 rounded-full">
                      ✓ Livraison Gratuite
                    </span>
                    <span className="text-[10px] font-semibold text-[#8A5C38] bg-[#8A5C38]/8 px-2 py-0.5 rounded-full">
                      Offre valable cette semaine
                    </span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#8A5C38]/10 to-[#128C4F]/10 rounded-xl px-3 py-2 text-center">
                  <p className="text-[11px] sm:text-xs font-bold text-[#1C1008]">
                    🎉 OFFRE DE LANCEMENT — Livraison gratuite partout au Maroc
                  </p>
                </div>
              </div>

              {/* Trust Compact Line */}
              <div className="flex items-center justify-between text-xs font-semibold text-[#1C1008] bg-[#FAF6F0] border border-[#E6D9C8] rounded-xl px-3 py-2.5 mb-3.5">
                <span className="flex items-center gap-1.5 text-[#128C4F] font-bold">
                  <IconBanknote size={16} />
                  <span>Paiement à la livraison</span>
                </span>
                <span className="flex items-center gap-1.5 text-[#5C3A1C] text-[11px]">
                  <IconTruck size={14} />
                  <span>Partout au Maroc</span>
                </span>
              </div>

              {/* Primary Full-Width CTA */}
              <button
                onClick={() => scrollToOrder(1)}
                className="w-full min-h-[54px] bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white py-3.5 px-5 rounded-2xl font-bold text-base shadow-md shadow-[#25D366]/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <IconWhatsApp size={22} />
                <span>Commander maintenant — Paiement à la livraison</span>
              </button>

              <p className="text-[11px] text-center text-[#5C3A1C] mt-2">
                ✅ Confirmation WhatsApp avant expédition
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. 4 KEY BENEFITS SECTION (Short & Visual)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 bg-white border-b border-[#E6D9C8]/70">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008]">
              Les points forts de la table Mode Trend
            </h2>
            <p className="text-xs sm:text-sm text-[#5C3A1C] mt-1">
              Une conception pensée pour simplifier votre quotidien.
            </p>
          </div>

          {/* 4 Clean Benefit Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            
            <div className="group bg-white p-5 rounded-2xl border border-[#E6D9C8] hover:border-[#8A5C38] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#8A5C38]/10 text-[#8A5C38] group-hover:bg-[#8A5C38] group-hover:text-white flex items-center justify-center mb-3.5 transition-all duration-300 shadow-xs ring-1 ring-[#8A5C38]/20 group-hover:ring-[#8A5C38] group-hover:scale-105">
                  <IconHeight size={22} />
                </div>
                <h3 className="font-bold text-sm text-[#1C1008] mb-1.5 group-hover:text-[#8A5C38] transition-colors">Hauteur réglable</h3>
                <p className="text-xs text-[#5C3A1C] leading-relaxed">
                  Ajustable de 65 à 90 cm pour s'aligner exactement avec votre canapé, lit ou fauteuil.
                </p>
              </div>
            </div>

            <div className="group bg-white p-5 rounded-2xl border border-[#E6D9C8] hover:border-[#8A5C38] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#8A5C38]/10 text-[#8A5C38] group-hover:bg-[#8A5C38] group-hover:text-white flex items-center justify-center mb-3.5 transition-all duration-300 shadow-xs ring-1 ring-[#8A5C38]/20 group-hover:ring-[#8A5C38] group-hover:scale-105">
                  <IconTilt size={22} />
                </div>
                <h3 className="font-bold text-sm text-[#1C1008] mb-1.5 group-hover:text-[#8A5C38] transition-colors">Plateau inclinable</h3>
                <p className="text-xs text-[#5C3A1C] leading-relaxed">
                  Angle réglable avec réglette d'arrêt pour lire ou taper au clavier sans risque de glisse.
                </p>
              </div>
            </div>

            <div className="group bg-white p-5 rounded-2xl border border-[#E6D9C8] hover:border-[#8A5C38] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#8A5C38]/10 text-[#8A5C38] group-hover:bg-[#8A5C38] group-hover:text-white flex items-center justify-center mb-3.5 transition-all duration-300 shadow-xs ring-1 ring-[#8A5C38]/20 group-hover:ring-[#8A5C38] group-hover:scale-105">
                  <IconBase size={22} />
                </div>
                <h3 className="font-bold text-sm text-[#1C1008] mb-1.5 group-hover:text-[#8A5C38] transition-colors">Base ultra-plate & stable</h3>
                <p className="text-xs text-[#5C3A1C] leading-relaxed">
                  Socle fin en métal noir qui glisse sous vos meubles les plus bas sans encombrer la pièce.
                </p>
              </div>
            </div>

            <div className="group bg-white p-5 rounded-2xl border border-[#E6D9C8] hover:border-[#128C4F] shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#128C4F]/10 text-[#128C4F] group-hover:bg-[#128C4F] group-hover:text-white flex items-center justify-center mb-3.5 transition-all duration-300 shadow-xs ring-1 ring-[#128C4F]/20 group-hover:ring-[#128C4F] group-hover:scale-105">
                  <IconComfort size={22} />
                </div>
                <h3 className="font-bold text-sm text-[#1C1008] mb-1.5 group-hover:text-[#128C4F] transition-colors">Multi-usages quotidien</h3>
                <p className="text-xs text-[#5C3A1C] leading-relaxed">
                  Parfaite pour le canapé, le lit, le télétravail, la lecture ou pour prendre un repas.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. SECTION "COMMENT L'UTILISER" (Visual Real Use Cases)
      ───────────────────────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 bg-[#FAF6F0] border-b border-[#E6D9C8]/70">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="text-[10px] font-bold text-[#8A5C38] uppercase tracking-wider block mb-1">
              Utilisation Quotidienne
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008]">
              Une table pour tous vos moments de la journée
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            
            {/* Card 1: Lit & PC */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E6D9C8] shadow-xs hover:border-[#8A5C38]/50 transition-colors">
              <div className="h-52 sm:h-60 lg:h-64 overflow-hidden bg-[#FAF6F0] flex items-center justify-center p-1">
                <img
                  src="/images/use_bed_laptop.jpg"
                  alt="Table Mode Trend au lit avec ordinateur"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3 sm:p-3.5">
                <span className="text-[9px] sm:text-[10px] font-bold text-[#8A5C38] uppercase block mb-0.5">Chambre & Confort</span>
                <h3 className="font-bold text-xs sm:text-sm text-[#1C1008] mb-0.5">Au lit & Télétravail</h3>
                <p className="text-[10px] sm:text-xs text-[#5C3A1C] leading-relaxed hidden sm:block">
                  Glisse sous le cadre du lit pour soutenir confortablement votre PC portable, livre et café.
                </p>
              </div>
            </div>

            {/* Card 2: Tablette & Salon */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E6D9C8] shadow-xs hover:border-[#8A5C38]/50 transition-colors">
              <div className="h-52 sm:h-60 lg:h-64 overflow-hidden bg-[#FAF6F0] flex items-center justify-center p-1">
                <img
                  src="/images/use_tablet_relax.jpg"
                  alt="Table Mode Trend avec tablette et smartphone"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3 sm:p-3.5">
                <span className="text-[9px] sm:text-[10px] font-bold text-[#8A5C38] uppercase block mb-0.5">Salon & Détente</span>
                <h3 className="font-bold text-xs sm:text-sm text-[#1C1008] mb-0.5">Depuis le fauteuil</h3>
                <p className="text-[10px] sm:text-xs text-[#5C3A1C] leading-relaxed hidden sm:block">
                  Support stable pour regarder vos séries sur tablette, poser votre boisson ou prendre un encas.
                </p>
              </div>
            </div>

            {/* Card 3: Multi-usages 180° */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E6D9C8] shadow-xs hover:border-[#8A5C38]/50 transition-colors">
              <div className="h-52 sm:h-60 lg:h-64 overflow-hidden bg-[#FAF6F0] flex items-center justify-center p-1">
                <img
                  src="/images/use_tilt_multipurpose.jpg"
                  alt="Table Mode Trend inclinaison 0 à 180 degrés"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3 sm:p-3.5">
                <span className="text-[9px] sm:text-[10px] font-bold text-[#8A5C38] uppercase block mb-0.5">Polyvalence 0° - 180°</span>
                <h3 className="font-bold text-xs sm:text-sm text-[#1C1008] mb-0.5">Multi-usages & Pupitre</h3>
                <p className="text-[10px] sm:text-xs text-[#5C3A1C] leading-relaxed hidden sm:block">
                  Plateau inclinable avec réglette d'arrêt pour lecture, dessin, repas ou support de partitions.
                </p>
              </div>
            </div>

            {/* Card 4: Réglages & Détails */}
            <div className="bg-white rounded-2xl overflow-hidden border border-[#E6D9C8] shadow-xs hover:border-[#8A5C38]/50 transition-colors">
              <div className="h-52 sm:h-60 lg:h-64 overflow-hidden bg-[#FAF6F0] flex items-center justify-center p-1">
                <img
                  src="/images/use_structure_details.jpg"
                  alt="Table Mode Trend détails de réglage et rotation"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
              <div className="p-3 sm:p-3.5">
                <span className="text-[9px] sm:text-[10px] font-bold text-[#8A5C38] uppercase block mb-0.5">Finition & Réglages</span>
                <h3 className="font-bold text-xs sm:text-sm text-[#1C1008] mb-0.5">Hauteur & Rangement</h3>
                <p className="text-[10px] sm:text-xs text-[#5C3A1C] leading-relaxed hidden sm:block">
                  Molette rotative pour ajuster la hauteur en douceur et plateau rabattable pour un gain de place.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6. RÉASSURANCE & ENGAGEMENTS DE SERVICE
      ───────────────────────────────────────────────────────────── */}
      <section className="py-6 sm:py-8 bg-white border-b border-[#E6D9C8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            
            <div className="bg-[#F9F6F1] p-3.5 rounded-2xl border border-[#E6D9C8] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A5C38]/10 text-[#8A5C38] flex items-center justify-center shrink-0">
                <IconBanknote size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1C1008]">Paiement à la livraison</p>
                <p className="text-[11px] text-[#5C3A1C]">Règlement en espèces au livreur</p>
              </div>
            </div>

            <div className="bg-[#F9F6F1] p-3.5 rounded-2xl border border-[#E6D9C8] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A5C38]/10 text-[#8A5C38] flex items-center justify-center shrink-0">
                <IconTruck size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1C1008]">Livraison partout au Maroc</p>
                <p className="text-[11px] text-[#5C3A1C]">100% Gratuite sans frais cachés</p>
              </div>
            </div>

            <div className="bg-[#F9F6F1] p-3.5 rounded-2xl border border-[#E6D9C8] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A5C38]/10 text-[#8A5C38] flex items-center justify-center shrink-0">
                <IconPhoneCall size={20} />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1C1008]">Vérification téléphonique</p>
                <p className="text-[11px] text-[#5C3A1C]">Confirmation avant expédition</p>
              </div>
            </div>

            <div className="bg-[#F9F6F1] p-3.5 rounded-2xl border border-[#E6D9C8] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8A5C38]/10 text-[#8A5C38] flex items-center justify-center shrink-0">
                <IconWhatsApp size={20} className="text-[#128C4F]" />
              </div>
              <div>
                <p className="font-bold text-xs text-[#1C1008]">Service client WhatsApp</p>
                <p className="text-[11px] text-[#5C3A1C]">Assistance rapide 7j/7</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          6b. TÉMOIGNAGES CLIENTS — Comment ils ont reçu leur produit
      ───────────────────────────────────────────────────────────── */}
      <section className="py-8 sm:py-12 bg-[#FAF6F0] border-b border-[#E6D9C8]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
            <span className="text-[10px] font-bold text-[#8A5C38] uppercase tracking-wider block mb-1">
              Avis Clients
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008]">
              Ils ont adopté Mode Trend chez eux
            </h2>
            <p className="text-xs sm:text-sm text-[#5C3A1C] mt-1">
              Découvrez comment nos clients ont reçu leur table partout au Maroc.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[960px] mx-auto">

            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl border border-[#E6D9C8] p-5 shadow-xs hover:shadow-md hover:border-[#8A5C38]/40 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Sara avis client"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#8A5C38]/30 shadow-xs shrink-0"
                  loading="lazy"
                />
                <div>
                  <p className="font-bold text-sm text-[#1C1008] leading-tight">Sara</p>
                  <p className="text-[10px] text-[#5C3A1C]">📍 Casablanca</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#8A5C38"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <p className="text-xs text-[#5C3A1C] leading-relaxed flex-1">
                "Le colis est arrivé bien emballé en 3 jours. Le montage était super rapide, en moins de 5 minutes. La table est stable et très pratique pour travailler depuis le canapé."
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#E6D9C8]/60 flex items-center gap-1.5 text-[10px] text-[#128C4F] font-semibold">
                <IconCheck size={12} />
                <span>Avis client — Livraison en 3 jours</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl border border-[#E6D9C8] p-5 shadow-xs hover:shadow-md hover:border-[#8A5C38]/40 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Youssef avis client"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#8A5C38]/30 shadow-xs shrink-0"
                  loading="lazy"
                />
                <div>
                  <p className="font-bold text-sm text-[#1C1008] leading-tight">Youssef</p>
                  <p className="text-[10px] text-[#5C3A1C]">📍 Rabat</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#8A5C38"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <p className="text-xs text-[#5C3A1C] leading-relaxed flex-1">
                "J'ai commandé via WhatsApp, le service client m'a rappelé pour confirmer. La livraison était gratuite et le livreur m'a contacté avant de venir. Produit solide et bien fini."
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#E6D9C8]/60 flex items-center gap-1.5 text-[10px] text-[#128C4F] font-semibold">
                <IconCheck size={12} />
                <span>Avis client — Livraison en 2 jours</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl border border-[#E6D9C8] p-5 shadow-xs hover:shadow-md hover:border-[#8A5C38]/40 transition-all flex flex-col">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&h=120&q=80"
                  alt="Imane avis client"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#8A5C38]/30 shadow-xs shrink-0"
                  loading="lazy"
                />
                <div>
                  <p className="font-bold text-sm text-[#1C1008] leading-tight">Imane</p>
                  <p className="text-[10px] text-[#5C3A1C]">📍 Marrakech</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#8A5C38"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                ))}
              </div>
              <p className="text-xs text-[#5C3A1C] leading-relaxed flex-1">
                "J'en ai commandé deux pour le salon et la chambre. Le Pack Duo était vraiment avantageux. Tout est arrivé en bon état, bien protégé. Le paiement à la livraison m'a rassurée."
              </p>
              <div className="mt-3 pt-2.5 border-t border-[#E6D9C8]/60 flex items-center gap-1.5 text-[10px] text-[#128C4F] font-semibold">
                <IconCheck size={12} />
                <span>Avis client — Pack Duo</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          7. PACKS & DEDICATED ORDER FORM SECTION
      ───────────────────────────────────────────────────────────── */}
      <section
        id="order-form-section"
        ref={orderFormRef}
        className="py-10 sm:py-14 bg-gradient-to-b from-[#F9F6F1] to-[#F2EBE0] border-b border-[#E6D9C8]"
      >
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1C1008]">
              Commandez votre table Mode Trend
            </h2>
            <p className="text-xs sm:text-sm text-[#5C3A1C] mt-1">
              Choisissez votre formule ci-dessous puis indiquez votre adresse de livraison.
            </p>
          </div>

          {/* 3 Pack Selection Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8 items-stretch">
            
            {/* Pack 1 — Standard */}
            <div
              onClick={() => setForm((p) => ({ ...p, quantite: 1 }))}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                form.quantite === 1
                  ? "bg-white border-[#8A5C38] shadow-md ring-2 ring-[#8A5C38]/15"
                  : "bg-white/80 border-[#E6D9C8] hover:border-[#8A5C38]/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#8A5C38]">1 Table Mode Trend</span>
                  <span className="text-[10px] font-semibold text-[#128C4F] bg-[#128C4F]/10 px-2 py-0.5 rounded-full">Livraison gratuite</span>
                </div>
                <div className="font-serif text-2xl font-black text-[#1C1008] my-1">
                  249 DH
                </div>
                <p className="text-[11px] text-[#5C3A1C]">Prix unitaire standard.</p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#E6D9C8]/60">
                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    form.quantite === 1
                      ? "bg-[#8A5C38] text-white"
                      : "bg-[#F9F6F1] text-[#8A5C38] hover:bg-[#F2EBE0]"
                  }`}
                >
                  {form.quantite === 1 ? "✓ Formule choisie" : "Choisir 1 table"}
                </button>
              </div>
            </div>

            {/* Pack 2 (Duo) — VISUELLEMENT DOMINANT */}
            <div
              onClick={() => setForm((p) => ({ ...p, quantite: 2 }))}
              className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                form.quantite === 2
                  ? "bg-white border-[#8A5C38] shadow-xl ring-2 ring-[#8A5C38]/20"
                  : "bg-white border-[#8A5C38]/50 shadow-lg hover:border-[#8A5C38] hover:shadow-xl"
              }`}
            >
              {/* Badge LE PLUS CHOISI */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#8A5C38] text-white text-[10px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                ★ Le plus choisi
              </div>
              <div>
                <div className="flex items-center justify-between mb-1 mt-1">
                  <span className="text-xs font-bold text-[#8A5C38]">Pack 2 Tables (Duo)</span>
                  <span className="text-[10px] font-bold text-white bg-[#128C4F] px-2 py-0.5 rounded-full">-99 DH</span>
                </div>
                <div className="font-serif text-3xl font-black text-[#1C1008] my-1">
                  399 DH
                </div>
                <p className="text-xs font-bold text-[#8A5C38] mb-0.5">Soit 199,50 DH / table</p>
                <p className="text-[11px] text-[#5C3A1C]">Idéal pour salon + chambre</p>
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#128C4F] font-semibold">
                  <IconTruck size={13} />
                  <span>Livraison gratuite sur les 2 tables</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-[#E6D9C8]/60">
                <button
                  type="button"
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                    form.quantite === 2
                      ? "bg-[#25D366] text-white shadow-md"
                      : "bg-[#8A5C38] text-white hover:bg-[#7A4F30] shadow-md"
                  }`}
                >
                  {form.quantite === 2 ? "✓ Pack Duo choisi" : "Choisir le Pack Duo — 399 DH"}
                </button>
              </div>
            </div>

            {/* Pack 3 (Family) */}
            <div
              onClick={() => setForm((p) => ({ ...p, quantite: 3 }))}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                form.quantite === 3
                  ? "bg-white border-[#8A5C38] shadow-md ring-2 ring-[#8A5C38]/15"
                  : "bg-white/80 border-[#E6D9C8] hover:border-[#8A5C38]/40"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[#8A5C38]">Pack 3 Tables (Famille)</span>
                  <span className="text-[10px] font-bold text-[#8A5C38] bg-[#8A5C38]/10 px-2 py-0.5 rounded-full">Meilleur prix / table</span>
                </div>
                <div className="font-serif text-2xl font-black text-[#1C1008] my-1">
                  569 DH
                </div>
                <p className="text-xs font-semibold text-[#8A5C38] mb-0.5">Soit 189,67 DH / table</p>
                <p className="text-[11px] text-[#5C3A1C]">Économisez 178 DH (vs 747 DH).</p>
              </div>
              <div className="mt-3 pt-2 border-t border-[#E6D9C8]/60">
                <button
                  type="button"
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                    form.quantite === 3
                      ? "bg-[#8A5C38] text-white"
                      : "bg-[#F9F6F1] text-[#8A5C38] hover:bg-[#F2EBE0]"
                  }`}
                >
                  {form.quantite === 3 ? "✓ Pack Famille choisi" : "Choisir le Pack Famille"}
                </button>
              </div>
            </div>

          </div>

          {/* Dedicated Order Form Card */}
          <div className="max-w-[560px] mx-auto bg-white rounded-3xl p-5 sm:p-7 border border-[#CDB99A] shadow-xl">
            
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1008] mb-1 text-center">
              Vos coordonnées de livraison
            </h3>
            <p className="text-xs text-[#5C3A1C] text-center mb-5">
              Remplissez ce formulaire pour préparer votre message de commande WhatsApp.
            </p>

            <form onSubmit={handleOrderSubmit} className="space-y-3.5">
              
              {/* Quantity selector (+ / -) */}
              <div>
                <label className="block text-xs font-bold text-[#1C1008] mb-1">
                  Quantité commandée :
                </label>
                <div className="flex items-center justify-between bg-[#F9F6F1] border border-[#E6D9C8] rounded-xl p-2.5">
                  <span className="text-xs font-bold text-[#5C3A1C]">
                    {summary.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, quantite: Math.max(1, p.quantite - 1) }))}
                      className="w-8 h-8 rounded-lg bg-white border border-[#E6D9C8] font-bold text-[#1C1008] flex items-center justify-center hover:bg-neutral-100 active:scale-95 cursor-pointer"
                      aria-label="Diminuer la quantité"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm w-6 text-center">{form.quantite}</span>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, quantite: p.quantite + 1 }))}
                      className="w-8 h-8 rounded-lg bg-white border border-[#E6D9C8] font-bold text-[#1C1008] flex items-center justify-center hover:bg-neutral-100 active:scale-95 cursor-pointer"
                      aria-label="Augmenter la quantité"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#1C1008] mb-1">
                  Nom et Prénom *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Ex: Mohamed Alami"
                  value={form.nom}
                  onFocus={() => triggerInitiateCheckout()}
                  onChange={(e) => {
                    triggerInitiateCheckout();
                    setForm((p) => ({ ...p, nom: e.target.value }));
                  }}
                  className="w-full bg-[#F9F6F1] border border-[#E6D9C8] focus:border-[#8A5C38] focus:bg-white rounded-xl px-3.5 py-3 text-sm text-[#1C1008] outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-[#1C1008] mb-1">
                  Numéro de Téléphone *
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="tel"
                  placeholder="Ex: 06 12 34 56 78"
                  value={form.telephone}
                  onFocus={() => triggerInitiateCheckout()}
                  onChange={(e) => {
                    triggerInitiateCheckout();
                    setForm((p) => ({ ...p, telephone: e.target.value }));
                  }}
                  className="w-full bg-[#F9F6F1] border border-[#E6D9C8] focus:border-[#8A5C38] focus:bg-white rounded-xl px-3.5 py-3 text-sm text-[#1C1008] outline-none transition-all"
                />
              </div>

              {/* City with Auto-suggest */}
              <div className="relative" ref={cityDropdownRef}>
                <label className="block text-xs font-bold text-[#1C1008] mb-1">
                  Ville au Maroc *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="address-level2"
                  placeholder="Ex: Casablanca, Rabat, Marrakech..."
                  value={form.ville}
                  onFocus={() => {
                    triggerInitiateCheckout();
                    setShowCityDropdown(true);
                  }}
                  onChange={(e) => {
                    triggerInitiateCheckout();
                    setForm((p) => ({ ...p, ville: e.target.value }));
                    setCityFilter(e.target.value);
                    setShowCityDropdown(true);
                  }}
                  className="w-full bg-[#F9F6F1] border border-[#E6D9C8] focus:border-[#8A5C38] focus:bg-white rounded-xl px-3.5 py-3 text-sm text-[#1C1008] outline-none transition-all"
                />
                
                {showCityDropdown && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-[#E6D9C8] rounded-xl shadow-xl z-30 max-h-40 overflow-y-auto p-1">
                    {MOROCCAN_CITIES.filter((c) =>
                      c.toLowerCase().includes(cityFilter.toLowerCase())
                    ).map((city) => (
                      <button
                        type="button"
                        key={city}
                        onClick={() => {
                          triggerInitiateCheckout();
                          setForm((p) => ({ ...p, ville: city }));
                          setShowCityDropdown(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-semibold text-[#1C1008] hover:bg-[#F2EBE0] rounded-lg cursor-pointer"
                      >
                        📍 {city}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs font-bold text-[#1C1008] mb-1">
                  Adresse de livraison complète *
                </label>
                <input
                  type="text"
                  required
                  autoComplete="street-address"
                  placeholder="Quartier, Rue, N° Immeuble ou Maison"
                  value={form.adresse}
                  onFocus={() => triggerInitiateCheckout()}
                  onChange={(e) => {
                    triggerInitiateCheckout();
                    setForm((p) => ({ ...p, adresse: e.target.value }));
                  }}
                  className="w-full bg-[#F9F6F1] border border-[#E6D9C8] focus:border-[#8A5C38] focus:bg-white rounded-xl px-3.5 py-3 text-sm text-[#1C1008] outline-none transition-all"
                />
              </div>

              {touched && (!form.nom.trim() || !form.telephone.trim() || !form.ville.trim() || !form.adresse.trim()) && (
                <p className="text-xs text-red-600 font-bold bg-red-50 p-2.5 rounded-xl text-center">
                  ⚠️ Veuillez remplir tous les champs obligatoires avant de valider.
                </p>
              )}

              {/* Pricing Recap Box */}
              <div className="bg-[#FAF6F0] rounded-2xl p-3.5 border border-[#E6D9C8] space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Formule :</span>
                  <span className="font-semibold text-[#1C1008]">{summary.label}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Livraison :</span>
                  <span className="font-bold text-[#128C4F]">Gratuite (0 DH)</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Paiement :</span>
                  <span className="font-semibold text-[#1C1008]">À la livraison (espèces)</span>
                </div>
                <div className="pt-2 border-t border-[#E6D9C8] flex justify-between items-baseline font-bold">
                  <span className="text-xs text-[#1C1008]">Total à régler :</span>
                  <span className="font-serif text-2xl text-[#8A5C38]">{summary.price} DH</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full min-h-[54px] bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white py-3.5 px-5 rounded-2xl font-bold text-base shadow-lg shadow-[#25D366]/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer"
              >
                <IconWhatsApp size={22} />
                <span>Finaliser ma commande sur WhatsApp</span>
              </button>

              {/* Clarification text */}
              <p className="text-[11px] text-[#128C4F] font-semibold text-center leading-relaxed">
                ✅ Confirmation WhatsApp avant expédition — Aucun engagement sans votre validation
              </p>
              <p className="text-[10px] text-neutral-400 text-center mt-1">
                Votre message de commande est préparé automatiquement. Envoyez-le pour que nous validions votre livraison.
              </p>
            </form>

          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          8. FAQ SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-white border-b border-[#E6D9C8]">
        <div className="max-w-[760px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1C1008]">
              Questions fréquentes
            </h2>
            <p className="text-xs sm:text-sm text-[#5C3A1C] mt-1">
              Tout ce que vous devez savoir sur la table Mode Trend.
            </p>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#F9F6F1] border border-[#E6D9C8] rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full text-left p-4 flex items-center justify-between gap-3 font-bold text-xs sm:text-sm text-[#1C1008] hover:bg-[#FAF6F0] transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <IconChevronDown
                      size={16}
                      className={`text-[#8A5C38] transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-0 text-xs text-[#5C3A1C] leading-relaxed border-t border-[#E6D9C8]/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Direct Contact Support Button (triggers Contact event) */}
          <div className="mt-8 text-center bg-[#FAF6F0] p-4 rounded-2xl border border-[#E6D9C8]">
            <p className="text-xs font-semibold text-[#5C3A1C] mb-2.5">
              Une question avant de passer commande ? Notre équipe vous répond directement.
            </p>
            <button
              onClick={handleDirectWhatsAppContact}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#128C4F] bg-[#128C4F]/10 hover:bg-[#128C4F]/20 active:scale-95 px-5 py-2.5 rounded-full transition-all cursor-pointer"
            >
              <IconWhatsApp size={17} />
              <span>Poser une question sur WhatsApp</span>
            </button>
          </div>

        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          9. FINAL REASSURING CTA SECTION
      ───────────────────────────────────────────────────────────── */}
      <section className="py-10 sm:py-14 bg-[#FAF6F0] border-b border-[#E6D9C8] text-center">
        <div className="max-w-[640px] mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold text-[#8A5C38] uppercase tracking-wider block mb-2">
            Paiement à la livraison • Partout au Maroc
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#1C1008] mb-2">
            Commandez votre table Mode Trend aujourd'hui
          </h2>
          <p className="text-sm font-bold text-[#128C4F] mb-5">
            249 DH — Livraison gratuite
          </p>
          <button
            onClick={() => scrollToOrder()}
            className="w-full sm:w-auto min-h-[52px] bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-bold text-base py-3.5 px-8 rounded-2xl shadow-lg shadow-[#25D366]/25 inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <IconWhatsApp size={20} />
            <span>Commander maintenant</span>
          </button>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          10. FOOTER
      ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#1C1008] text-neutral-400 py-8 text-xs">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-serif text-sm font-bold text-white block">Mode Trend Maroc</span>
            <p className="text-[11px] text-neutral-400 mt-0.5">La table d'appoint ajustable et inclinable pour votre confort.</p>
          </div>
          <p className="text-[11px] text-neutral-500">
            © {new Date().getFullYear()} Mode Trend Maroc. Paiement à la livraison.
          </p>
        </div>
      </footer>

      {/* ─────────────────────────────────────────────────────────────
          11. MOBILE STICKY BOTTOM BAR (Auto-hides when form is in view)
      ───────────────────────────────────────────────────────────── */}
      {showStickyBar && !isFormVisible && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#E6D9C8] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-2xl z-40 flex items-center justify-between gap-3 animate-fadeIn">
          <div>
            <span className="text-[10px] font-bold text-[#8A5C38] uppercase block leading-none">
              Livraison Gratuite
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl font-black text-[#1C1008]">
                {summary.price} DH
              </span>
              <span className="text-[10px] text-neutral-500 font-medium">
                ({form.quantite} {form.quantite > 1 ? "tables" : "table"})
              </span>
            </div>
          </div>

          <button
            onClick={() => scrollToOrder()}
            className="min-h-[46px] bg-[#25D366] hover:bg-[#20bd5a] active:scale-95 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#25D366]/25 transition-all cursor-pointer"
          >
            <IconWhatsApp size={16} />
            <span>Commander — Paiement à la livraison</span>
          </button>
        </div>
      )}

    </div>
  );
}
