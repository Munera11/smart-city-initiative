export type City = "dammam" | "khobar" | "dhahran";
export type Category = "health" | "accessible" | "transport" | "associations" | "gov" | "events";

export interface Feature {
  key: string;
}

export interface Service {
  id: string;
  name: { ar: string; en: string };
  category: Category;
  city: City;
  address: { ar: string; en: string };
  phone: string;
  features: string[];
  description: { ar: string; en: string };
}

export const SERVICES: Service[] = [
  {
    id: "kfsh-dammam",
    name: { ar: "مستشفى الملك فهد التخصصي", en: "King Fahd Specialist Hospital" },
    category: "health",
    city: "dammam",
    address: { ar: "طريق الأمير محمد بن سعود، الدمام", en: "Prince Mohammed bin Saud Rd, Dammam" },
    phone: "+966138431111",
    features: ["feat_a11y", "feat_parking", "feat_ramp", "feat_wc", "feat_elderly"],
    description: {
      ar: "مستشفى تخصصي بخدمات متكاملة للتأهيل الطبي وكبار السن ومسارات ميسّرة.",
      en: "Specialist hospital with rehabilitation, geriatric services and step-free routes.",
    },
  },
  {
    id: "disabled-care-center",
    name: { ar: "مركز رعاية الأشخاص ذوي الإعاقة", en: "Disability Care Center" },
    category: "health",
    city: "dammam",
    address: { ar: "حي الفيصلية، الدمام", en: "Al Faisaliyah, Dammam" },
    phone: "+966138100000",
    features: ["feat_a11y", "feat_signlang", "feat_wc", "feat_home"],
    description: {
      ar: "مركز تأهيل حركي وعلاج طبيعي وجلسات نطق لجميع الأعمار.",
      en: "Physical therapy, motor rehabilitation and speech sessions for all ages.",
    },
  },
  {
    id: "khobar-corniche",
    name: { ar: "كورنيش الخبر", en: "Khobar Corniche" },
    category: "accessible",
    city: "khobar",
    address: { ar: "الكورنيش الشمالي، الخبر", en: "North Corniche, Khobar" },
    phone: "+966138650000",
    features: ["feat_a11y", "feat_parking", "feat_ramp", "feat_wc"],
    description: {
      ar: "ممشى بحري بمسارات مهيأة للكراسي المتحركة ومقاعد مريحة على الطريق.",
      en: "Seaside promenade with wheelchair-friendly paths and comfortable resting benches.",
    },
  },
  {
    id: "mall-of-dhahran",
    name: { ar: "الظهران مول", en: "Mall of Dhahran" },
    category: "accessible",
    city: "dhahran",
    address: { ar: "طريق الملك فهد، الظهران", en: "King Fahd Rd, Dhahran" },
    phone: "+966138948888",
    features: ["feat_a11y", "feat_parking", "feat_wc", "feat_elderly"],
    description: {
      ar: "مواقف مخصصة، مصاعد واسعة، وكراسي متحركة مجانية عند مكتب الاستقبال.",
      en: "Reserved parking, wide elevators, and free wheelchairs at the guest service desk.",
    },
  },
  {
    id: "accessible-taxi",
    name: { ar: "أجرة الوصول (نقل مهيأ)", en: "Wasel Taxi (Accessible Transport)" },
    category: "transport",
    city: "dammam",
    address: { ar: "يخدم الدمام والخبر والظهران", en: "Serves Dammam, Khobar and Dhahran" },
    phone: "+966920000111",
    features: ["feat_a11y", "feat_elderly", "feat_home"],
    description: {
      ar: "خدمة نقل بمركبات مهيأة لركاب على كراسي متحركة وكبار السن على مدار الساعة.",
      en: "24/7 transport with vehicles equipped for wheelchair passengers and seniors.",
    },
  },
  {
    id: "harakia",
    name: { ar: "جمعية الأطفال ذوي الإعاقة", en: "Disabled Children's Association" },
    category: "associations",
    city: "khobar",
    address: { ar: "شارع الملك عبدالله، الخبر", en: "King Abdullah St, Khobar" },
    phone: "+966138960000",
    features: ["feat_signlang", "feat_wc", "feat_ramp"],
    description: {
      ar: "برامج تأهيل تعليمي وأنشطة اجتماعية لأسر ذوي الإعاقة.",
      en: "Educational rehabilitation programs and social activities for families.",
    },
  },
  {
    id: "elderly-club",
    name: { ar: "نادي كبار السن الاجتماعي", en: "Seniors Social Club" },
    category: "events",
    city: "dhahran",
    address: { ar: "حي الدوحة، الظهران", en: "Doha District, Dhahran" },
    phone: "+966138990000",
    features: ["feat_elderly", "feat_a11y", "feat_wc"],
    description: {
      ar: "لقاءات أسبوعية، ورش، ورحلات ترفيهية لكبار السن بإشراف مختصين.",
      en: "Weekly gatherings, workshops, and recreational trips for seniors supervised by specialists.",
    },
  },
  {
    id: "ministry-hr",
    name: { ar: "فرع وزارة الموارد البشرية", en: "Ministry of HR Branch" },
    category: "gov",
    city: "dammam",
    address: { ar: "طريق الخليج، الدمام", en: "Gulf Road, Dammam" },
    phone: "+966198010",
    features: ["feat_a11y", "feat_parking", "feat_wc", "feat_signlang", "feat_braille"],
    description: {
      ar: "نافذة مخصصة لخدمات ذوي الإعاقة وكبار السن مع مترجم لغة إشارة عند الطلب.",
      en: "Dedicated counter for disability and senior services with sign-language interpreter on request.",
    },
  },
  {
    id: "home-nursing",
    name: { ar: "خدمة التمريض المنزلي", en: "Home Nursing Service" },
    category: "health",
    city: "khobar",
    address: { ar: "يخدم كامل المنطقة الشرقية", en: "Serving the entire Eastern Province" },
    phone: "+966920033444",
    features: ["feat_home", "feat_elderly"],
    description: {
      ar: "ممرضون مؤهلون لزيارات منزلية دورية لكبار السن والحالات المزمنة.",
      en: "Qualified nurses for scheduled home visits to seniors and chronic patients.",
    },
  },
  {
    id: "sensory-park",
    name: { ar: "حديقة الحواس المتكاملة", en: "Inclusive Sensory Park" },
    category: "accessible",
    city: "dammam",
    address: { ar: "حي الشاطئ، الدمام", en: "Al Shati District, Dammam" },
    phone: "+966138550000",
    features: ["feat_a11y", "feat_ramp", "feat_wc", "feat_braille"],
    description: {
      ar: "حديقة عامة بألعاب دامجة ومسارات حسية للأطفال من جميع القدرات.",
      en: "Public park with inclusive play equipment and sensory paths for children of all abilities.",
    },
  },
];
