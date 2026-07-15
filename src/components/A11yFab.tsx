import { useEffect, useRef, useState } from "react";
import { Accessibility, Volume2, VolumeX, Plus, Minus, X } from "lucide-react";
import { useA11y } from "@/lib/a11y";
import { useI18n } from "@/lib/i18n";

type A11yFabProps = {
  /** Text to read aloud when the user taps Listen. */
  readText?: string;
};

const COPY = {
  ar: {
    label: "أدوات الوصول",
    tip: "أدوات الوصول: تغيير حجم الخط والاستماع للنص",
    title: "إعدادات إمكانية الوصول",
    sub: "خصّصها بما يناسبك",
    font: "حجم الخط",
    read: "استماع",
    stop: "إيقاف",
    close: "إغلاق",
  },
  en: {
    label: "Accessibility",
    tip: "Accessibility: change text size & listen to the content",
    title: "Accessibility settings",
    sub: "Customize to fit your needs",
    font: "Text size",
    read: "Listen",
    stop: "Stop",
    close: "Close",
  },
} as const;

export function A11yFab({ readText }: A11yFabProps) {
  const { locale, dir } = useI18n();
  const { fontScale, setFontScale, speak, stopSpeaking, speaking } = useA11y();
  const c = COPY[locale];
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onRead = () => {
    if (speaking) return stopSpeaking();
    if (readText && readText.trim()) speak(readText, locale === "ar" ? "ar-SA" : "en-US");
  };

  // Position on the trailing (end) side, bottom.
  const side = dir === "rtl" ? "left-4" : "right-4";
  const panelSide = dir === "rtl" ? "left-4" : "right-4";

  return (
    <>
      <div className={`fixed bottom-24 ${side} z-40 flex flex-col items-center`}>
        {hover && !open && (
          <div
            role="tooltip"
            className="mb-2 max-w-[220px] rounded-xl bg-foreground text-background text-xs font-semibold px-3 py-2 shadow-lg text-center leading-snug"
          >
            {c.tip}
          </div>
        )}
        <button
          type="button"
          aria-label={c.label}
          aria-expanded={open}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onFocus={() => setHover(true)}
          onBlur={() => setHover(false)}
          onClick={() => setOpen((v) => !v)}
          className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl ring-4 ring-primary/20 hover:scale-105 transition-transform"
        >
          <Accessibility size={26} aria-hidden />
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-fab-title"
            className={`fixed bottom-24 ${panelSide} z-50 w-[min(320px,calc(100vw-2rem))] rounded-2xl border-2 border-border bg-card shadow-2xl p-4`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h3 id="a11y-fab-title" className="text-base font-black text-foreground">
                  {c.title}
                </h3>
                <p className="text-xs text-muted-foreground">{c.sub}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label={c.close}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-primary-soft text-foreground"
              >
                <X size={18} aria-hidden />
              </button>
            </div>

            {readText && (
              <button
                onClick={onRead}
                className={`w-full mb-3 inline-flex items-center justify-center gap-2 min-h-12 rounded-xl px-4 font-bold text-sm border-2 ${
                  speaking
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border bg-background hover:border-primary"
                }`}
                aria-pressed={speaking}
              >
                {speaking ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
                {speaking ? c.stop : c.read}
              </button>
            )}

            <div className="rounded-xl border-2 border-border bg-background p-3">
              <p className="text-xs font-bold text-foreground mb-2">{c.font}</p>
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => setFontScale(fontScale - 0.1)}
                  className="grid h-11 w-11 place-items-center rounded-full border-2 border-border hover:border-primary"
                  aria-label="Decrease text size"
                >
                  <Minus size={18} aria-hidden />
                </button>
                <span className="text-base font-black tabular-nums" aria-live="polite">
                  {Math.round(fontScale * 100)}%
                </span>
                <button
                  onClick={() => setFontScale(fontScale + 0.1)}
                  className="grid h-11 w-11 place-items-center rounded-full border-2 border-border hover:border-primary"
                  aria-label="Increase text size"
                >
                  <Plus size={18} aria-hidden />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
