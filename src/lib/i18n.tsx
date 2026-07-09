import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "ar" | "en";

type Dict = Record<string, { ar: string; en: string }>;

export const t: Dict = {
  brand: { ar: "وصل", en: "Wasel" },
  tagline: {
    ar: "منصة خدمات ذوي الاحتياجات الخاصة وكبار السن في المنطقة الشرقية",
    en: "Services hub for people of determination and seniors in the Eastern Province",
  },
  nav_home: { ar: "الرئيسية", en: "Home" },
  nav_services: { ar: "الخدمات والمرافق", en: "Services & Facilities" },
  nav_community: { ar: "المجتمع", en: "Community" },
  nav_about: { ar: "عن المنصة", en: "About" },
  nav_contact: { ar: "تواصل", en: "Contact" },
  lang_switch: { ar: "EN", en: "عربي" },
  hero_eyebrow: { ar: "الدمام • الخبر • الظهران", en: "Dammam • Khobar • Dhahran" },
  hero_title: {
    ar: "دليلك الشامل للخدمات والمرافق المهيأة في المنطقة الشرقية",
    en: "Your complete guide to accessible services and facilities in the Eastern Province",
  },
  hero_sub: {
    ar: "اعثر بسهولة على المستشفيات، مراكز التأهيل، الأماكن المهيأة، والجمعيات الداعمة، وشارك تجربتك مع المجتمع.",
    en: "Easily find hospitals, rehabilitation centers, accessible venues, and supporting associations — and share your experience with the community.",
  },
  hero_cta_primary: { ar: "استكشف الخدمات", en: "Explore Services" },
  hero_cta_secondary: { ar: "شارك تجربتك", en: "Share your Experience" },

  stat_services: { ar: "خدمة ومرفق", en: "Services & Facilities" },
  stat_cities: { ar: "مدن رئيسية", en: "Main Cities" },
  stat_categories: { ar: "فئات مختلفة", en: "Categories" },
  stat_community: { ar: "أفراد المجتمع", en: "Community Members" },

  categories_title: { ar: "تصفح حسب الفئة", en: "Browse by Category" },
  cat_health: { ar: "صحية وتأهيل", en: "Health & Rehab" },
  cat_health_desc: { ar: "مستشفيات ومراكز تأهيل ذات كفاءة عالية", en: "Hospitals & specialized rehabilitation centers" },
  cat_accessible: { ar: "أماكن مهيأة", en: "Accessible Places" },
  cat_accessible_desc: { ar: "مطاعم، حدائق ومولات صديقة للجميع", en: "Restaurants, parks and malls friendly to all" },
  cat_transport: { ar: "مواصلات", en: "Transportation" },
  cat_transport_desc: { ar: "خدمات نقل مخصصة ومهيأة", en: "Dedicated accessible transport services" },
  cat_associations: { ar: "جمعيات ودعم", en: "Associations & Support" },
  cat_associations_desc: { ar: "جمعيات خيرية ومراكز دعم اجتماعي", en: "Charitable associations & support centers" },
  cat_gov: { ar: "خدمات حكومية", en: "Government Services" },
  cat_gov_desc: { ar: "المرافق الحكومية المخصصة والمهيأة", en: "Government facilities & dedicated services" },
  cat_events: { ar: "فعاليات وأنشطة", en: "Events & Activities" },
  cat_events_desc: { ar: "ورش وأنشطة اجتماعية دورية", en: "Workshops & regular social activities" },

  filter_city: { ar: "المدينة", en: "City" },
  filter_category: { ar: "الفئة", en: "Category" },
  filter_all: { ar: "الكل", en: "All" },
  search_placeholder: { ar: "ابحث باسم الخدمة أو المرفق…", en: "Search by name of service or facility…" },
  results_count: { ar: "نتيجة", en: "results" },

  city_dammam: { ar: "الدمام", en: "Dammam" },
  city_khobar: { ar: "الخبر", en: "Khobar" },
  city_dhahran: { ar: "الظهران", en: "Dhahran" },

  feat_a11y: { ar: "مدخل كراسي متحركة", en: "Wheelchair Access" },
  feat_parking: { ar: "مواقف مخصصة", en: "Reserved Parking" },
  feat_ramp: { ar: "منحدرات", en: "Ramps" },
  feat_wc: { ar: "دورات مياه مهيأة", en: "Accessible Restrooms" },
  feat_signlang: { ar: "لغة إشارة", en: "Sign Language" },
  feat_braille: { ar: "لوحات برايل", en: "Braille Signage" },
  feat_elderly: { ar: "خدمات كبار السن", en: "Senior Services" },
  feat_home: { ar: "خدمة منزلية", en: "Home Service" },

  view_details: { ar: "عرض التفاصيل", en: "View Details" },
  call_now: { ar: "اتصال", en: "Call" },
  directions: { ar: "الاتجاهات", en: "Directions" },

  community_title: { ar: "مجتمع يشاركك الطريق", en: "A Community that Walks with You" },
  community_sub: {
    ar: "شارك تجاربك عن الأماكن المهيأة، وأضف تقييمات تُفيد الآخرين، وتعرّف على فعاليات المنطقة.",
    en: "Share your experiences about accessible places, add reviews that help others, and discover events across the region.",
  },
  post_placeholder: { ar: "شارك تجربتك أو نصيحتك…", en: "Share your experience or a tip…" },
  post_submit: { ar: "نشر", en: "Publish" },

  about_title: { ar: "منصة وطنية بروح خدمة", en: "A National Platform with a Spirit of Service" },
  about_p: {
    ar: "وصل هي مبادرة تجمع الجهات الحكومية والقطاع الخاص والجمعيات لتقديم دليل موثوق ومحدث للخدمات والمرافق المخصصة والمهيأة لذوي الاحتياجات الخاصة وكبار السن في محافظات المنطقة الشرقية.",
    en: "Wasel is an initiative bringing together government, private sector and associations to provide a trusted, up-to-date guide to services and facilities dedicated for people of determination and seniors across the Eastern Province.",
  },
  value_trusted: { ar: "معلومات موثوقة", en: "Trusted Information" },
  value_trusted_d: { ar: "مراجعة دورية بالتعاون مع الجهات الرسمية.", en: "Regular review in cooperation with official entities." },
  value_a11y: { ar: "إمكانية وصول", en: "Accessibility" },
  value_a11y_d: { ar: "تصميم يراعي معايير WCAG وأحجام خطوط مريحة.", en: "Designed with WCAG in mind, comfortable font sizes." },
  value_community: { ar: "مشاركة مجتمعية", en: "Community Participation" },
  value_community_d: { ar: "تقييمات وتجارب حقيقية من المستفيدين.", en: "Real reviews and experiences from beneficiaries." },

  contact_title: { ar: "تواصل معنا", en: "Contact Us" },
  contact_sub: { ar: "نسعد بتلقي اقتراحاتكم لإضافة خدمات أو تحديث بيانات.", en: "We welcome your suggestions to add services or update data." },
  form_name: { ar: "الاسم", en: "Name" },
  form_email: { ar: "البريد الإلكتروني", en: "Email" },
  form_message: { ar: "رسالتك", en: "Your Message" },
  form_send: { ar: "إرسال", en: "Send" },
  form_thanks: { ar: "شكرًا لتواصلك، سيتم الرد قريبًا.", en: "Thanks for reaching out. We'll reply soon." },

  footer_rights: { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  footer_partner: { ar: "بالشراكة مع الجهات الداعمة في المنطقة الشرقية", en: "In partnership with supporting entities in the Eastern Province" },
  emergency: { ar: "الطوارئ 997", en: "Emergency 997" },
};

interface I18nCtx {
  locale: Locale;
  dir: "rtl" | "ltr";
  setLocale: (l: Locale) => void;
  tr: (key: keyof typeof t) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && (localStorage.getItem("locale") as Locale)) || null;
    if (saved === "ar" || saved === "en") setLocaleState(saved);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") localStorage.setItem("locale", l);
  };

  const tr = (key: keyof typeof t) => t[key][locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  return <Ctx.Provider value={{ locale, dir, setLocale, tr }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
