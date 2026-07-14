import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useA11y } from "@/lib/a11y";
import {
  Accessibility,
  Volume2,
  VolumeX,
  Plus,
  Minus,
  Contrast,
  Languages,
  Heart,
  ArrowLeft,
  ArrowRight,
  UserRound,
  UsersRound,
  Building2,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Welcome,
});

type Choice = "beneficiary" | "caregiver" | "entity";
type Screen = "loading" | "welcome";

const COPY = {
  ar: {
    brand: "وصل",
    region: "المنطقة الشرقية · الدمام · الخبر · الظهران",
    intro:
      "مبادرة وصل هي منصة مجتمعية تجمع أصوات كبار السن وذوي الإعاقة وجميع سكان المنطقة الشرقية، لمشاركة تجاربكم واقتراحاتكم لتحسين المدينة وخدماتها.",
    pickTitle: "من أنت؟",
    pickSub: "اختر ما يصفك لنبدأ رحلتك معنا",
    beneficiary: "من ذوي الإعاقة",
    beneficiary_d: "أشارك تجربتي واحتياجاتي",
    caregiver: "من كبار السن أو مقدم رعاية",
    caregiver_d: "أشارك نيابةً عن نفسي أو عن من أرعاه",
    entity: "مهتم أو جهة داعمة",
    entity_d: "أدعم المبادرة أو أمثل جهة",
    next: "التالي",
    a11y: "إمكانية الوصول",
    font_size: "حجم الخط",
    contrast: "تباين عالٍ",
    read: "استماع",
    stop: "إيقاف",
    lang: "English",
    loading: "جاري التحميل",
    loading_sub: "منصة وصل لأصوات المنطقة الشرقية",
  },
  en: {
    brand: "Wasel",
    region: "Eastern Province · Dammam · Khobar · Dhahran",
    intro:
      "Wasel is a community initiative that brings together the voices of seniors, people with disabilities, and everyone in the Eastern Province — to share experiences and suggestions that improve the city and its services.",
    pickTitle: "Who are you?",
    pickSub: "Pick what describes you so we can start",
    beneficiary: "A person with a disability",
    beneficiary_d: "I share my own experience and needs",
    caregiver: "A senior or caregiver",
    caregiver_d: "I share for myself or someone I care for",
    entity: "Supporter or entity",
    entity_d: "I support the initiative or represent an entity",
    next: "Next",
    a11y: "Accessibility",
    font_size: "Text size",
    contrast: "High contrast",
    read: "Listen",
    stop: "Stop",
    lang: "عربي",
    loading: "Loading",
    loading_sub: "Wasel platform for the Eastern Province voices",
  },
} as const;

const LOADING_MS = 2400;

function SplashScreen({ locale, onDone }: { locale: "ar" | "en"; onDone: () => void }) {
  const c = COPY[locale];
  const [fadeOut, setFadeOut] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), LOADING_MS - 350);
    const doneTimer = setTimeout(onDone, LOADING_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-50 grid place-items-center bg-background transition-opacity duration-300 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center text-center px-6">
        <div
          className={`relative grid h-28 w-28 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-xl mb-6 ${
            prefersReducedMotion ? "" : "animate-pulse"
          }`}
        >
          <Heart size={56} aria-hidden />
        </div>
        <h1 className="text-5xl font-black tracking-tight text-foreground">{c.brand}</h1>
        <p className="mt-3 text-base font-semibold text-muted-foreground">{c.loading_sub}</p>
        <div className="mt-8 h-2.5 w-48 rounded-full bg-muted overflow-hidden" role="progressbar" aria-label={c.loading}>
          <div
            className={`h-full rounded-full bg-primary origin-left ${prefersReducedMotion ? "" : "animate-loading-bar"}`}
            style={{ width: "100%" }}
          />
        </div>
        <p className="mt-2 text-sm font-bold text-primary">{c.loading}...</p>
      </div>
    </div>
  );
}

function Welcome() {
  const { locale, setLocale, dir } = useI18n();
  const { fontScale, setFontScale, highContrast, toggleHighContrast, speak, stopSpeaking, speaking } = useA11y();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [screen, setScreen] = useState<Screen>("loading");
  const navigate = useNavigate();
  const c = COPY[locale];
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  const options = useMemo(
    () =>
      [
        { key: "beneficiary" as Choice, icon: UserRound },
        { key: "caregiver" as Choice, icon: UsersRound },
        { key: "entity" as Choice, icon: Building2 },
      ],
    []
  );

  const readIntro = () => {
    if (speaking) return stopSpeaking();
    const text = `${c.brand}. ${c.intro} ${c.pickTitle}. ${c[options[0].key]}. ${c[options[1].key]}. ${c[options[2].key]}.`;
    speak(text, locale === "ar" ? "ar-SA" : "en-US");
  };

  const goNext = () => {
    if (!choice) return;
    stopSpeaking();
    navigate({ to: "/services" });
  };

  return (
    <div className="min-h-dvh bg-background">
      {screen === "loading" && <SplashScreen locale={locale} onDone={() => setScreen("welcome")} />}

      {/* Top bar: language + a11y quick actions */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="container-page flex items-center gap-2 py-2.5">
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="inline-flex items-center gap-1.5 min-h-11 rounded-full border-2 border-border bg-card px-3 font-bold text-sm hover:border-primary"
            aria-label="Toggle language"
          >
            <Languages size={16} aria-hidden />
            {c.lang}
          </button>

          <button
            onClick={readIntro}
            className={`inline-flex items-center gap-1.5 min-h-11 rounded-full px-3 font-bold text-sm border-2 ${
              speaking ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:border-primary"
            }`}
            aria-pressed={speaking}
            aria-label={speaking ? c.stop : c.read}
          >
            {speaking ? <VolumeX size={16} aria-hidden /> : <Volume2 size={16} aria-hidden />}
            {speaking ? c.stop : c.read}
          </button>

          <div className="ms-auto flex items-center gap-1 rounded-full border-2 border-border bg-card p-1" role="group" aria-label={c.font_size}>
            <button
              onClick={() => setFontScale(fontScale - 0.1)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-primary-soft"
              aria-label="Decrease text size"
            >
              <Minus size={16} aria-hidden />
            </button>
            <span className="text-xs font-bold px-1 min-w-8 text-center tabular-nums" aria-live="polite">
              {Math.round(fontScale * 100)}%
            </span>
            <button
              onClick={() => setFontScale(fontScale + 0.1)}
              className="grid h-9 w-9 place-items-center rounded-full hover:bg-primary-soft"
              aria-label="Increase text size"
            >
              <Plus size={16} aria-hidden />
            </button>
          </div>

          <button
            onClick={toggleHighContrast}
            className={`grid h-11 w-11 place-items-center rounded-full border-2 ${
              highContrast ? "bg-foreground text-background border-foreground" : "border-border bg-card hover:border-primary"
            }`}
            aria-pressed={highContrast}
            aria-label={c.contrast}
            title={c.contrast}
          >
            <Contrast size={18} aria-hidden />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="container-page pb-32 pt-8">
        {/* Logo + brand */}
        <div className="flex flex-col items-center text-center">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lg mb-4">
            <Heart size={40} aria-hidden />
          </div>
          <h1 className="text-4xl font-black tracking-tight">{c.brand}</h1>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">{c.region}</p>
        </div>

        {/* Intro */}
        <section
          aria-labelledby="intro-title"
          className="surface-card mt-8 p-5"
        >
          <h2 id="intro-title" className="sr-only">
            {c.brand}
          </h2>
          <p className="text-[1.05rem] leading-relaxed text-foreground">{c.intro}</p>
        </section>

        {/* 3 options */}
        <section aria-labelledby="pick-title" className="mt-10">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 id="pick-title" className="text-xl font-black">
                {c.pickTitle}
              </h2>
              <p className="text-sm text-muted-foreground">{c.pickSub}</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft text-primary shrink-0" aria-hidden>
              <Accessibility size={20} />
            </span>
          </div>

          <ul className="grid gap-3" role="radiogroup" aria-labelledby="pick-title">
            {options.map(({ key, icon: Icon }) => {
              const active = choice === key;
              return (
                <li key={key}>
                  <button
                    role="radio"
                    aria-checked={active}
                    onClick={() => setChoice(key)}
                    className={`w-full text-start flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      active
                        ? "border-primary bg-primary-soft shadow-md"
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                  >
                    <span
                      className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${
                        active ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"
                      }`}
                    >
                      <Icon size={26} aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-black text-foreground">{c[key]}</span>
                      <span className="block text-sm text-muted-foreground">{c[`${key}_d` as const]}</span>
                    </span>
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 ${
                        active ? "bg-primary border-primary text-primary-foreground" : "border-border"
                      }`}
                      aria-hidden
                    >
                      {active ? <Check size={18} /> : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      {/* Sticky Next */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border">
        <div className="container-page py-3">
          <button
            onClick={goNext}
            disabled={!choice}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {c.next}
            <Arrow size={20} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
