import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type A11yCtx = {
  fontScale: number;
  setFontScale: (n: number) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  speak: (text: string, lang?: string) => void;
  stopSpeaking: () => void;
  speaking: boolean;
};

const Ctx = createContext<A11yCtx | null>(null);

export function A11yProvider({ children }: { children: ReactNode }) {
  const [fontScale, setFontScaleState] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const fs = parseFloat(localStorage.getItem("a11y_font") || "1");
    const hc = localStorage.getItem("a11y_contrast") === "1";
    if (!Number.isNaN(fs)) setFontScaleState(fs);
    setHighContrast(hc);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontScale * 100}%`;
    localStorage.setItem("a11y_font", String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    document.documentElement.classList.toggle("high-contrast", highContrast);
    localStorage.setItem("a11y_contrast", highContrast ? "1" : "0");
  }, [highContrast]);

  const setFontScale = (n: number) => setFontScaleState(Math.min(1.4, Math.max(0.9, n)));
  const toggleHighContrast = () => setHighContrast((v) => !v);

  const stopSpeaking = () => {
    if (typeof window === "undefined") return;
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  };

  const speak = (text: string, lang = "ar-SA") => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.95;
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(u);
  };

  return (
    <Ctx.Provider value={{ fontScale, setFontScale, highContrast, toggleHighContrast, speak, stopSpeaking, speaking }}>
      {children}
    </Ctx.Provider>
  );
}

export function useA11y() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useA11y must be inside A11yProvider");
  return c;
}
