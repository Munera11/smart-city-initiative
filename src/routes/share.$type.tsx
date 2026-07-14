import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  Type,
  Mic,
  Video,
  Square,
  Play,
  Trash2,
  CheckCircle2,
  Home,
} from "lucide-react";

type ShareType = "complaint" | "idea" | "positive";
type Method = "text" | "voice" | "video";

export const Route = createFileRoute("/share/$type")({
  component: SharePage,
  beforeLoad: ({ params }) => {
    if (!["complaint", "idea", "positive"].includes(params.type)) {
      throw new Error("Invalid share type");
    }
  },
});

const COPY = {
  ar: {
    back: "رجوع",
    title_complaint: "شكوى أو بلاغ",
    title_idea: "فكرة تطويرية",
    title_positive: "رأي إيجابي",
    sub_complaint: "أخبرنا بالمشكلة أو البلاغ لنعمل على معالجته.",
    sub_idea: "اقترح فكرة أو تحسينًا يفيد المدينة والمجتمع.",
    sub_positive: "شاركنا تجربة أو ملاحظة إيجابية.",
    method_title: "اختر طريقة المشاركة",
    method_sub: "استخدم الطريقة التي تناسبك",
    text: "كتابة نص",
    voice: "تسجيل صوتي",
    video: "تسجيل فيديو",
    text_ph: "اكتب مشاركتك هنا…",
    start_rec: "بدء التسجيل",
    stop_rec: "إيقاف التسجيل",
    delete: "حذف والإعادة",
    recording: "جاري التسجيل…",
    permission_err: "تعذّر الوصول إلى الميكروفون / الكاميرا. يرجى السماح بالإذن.",
    participant_title: "بيانات المشارك",
    participant_sub: "اختياري — للتواصل معك حول فكرتك",
    name: "الاسم",
    contact: "رقم الجوال أو البريد",
    submit: "إرسال",
    thanks_title: "شكرًا لمشاركتك!",
    thanks_sub: "تم استلام مشاركتك، صوتك يصنع الفرق في تطوير المنطقة الشرقية.",
    home: "العودة للرئيسية",
    empty_err: "الرجاء إضافة محتوى قبل الإرسال.",
  },
  en: {
    back: "Back",
    title_complaint: "Complaint / Report",
    title_idea: "Improvement idea",
    title_positive: "Positive feedback",
    sub_complaint: "Tell us the issue so we can help address it.",
    sub_idea: "Suggest an idea that improves the city and community.",
    sub_positive: "Share a good experience or a nice note.",
    method_title: "Pick a sharing method",
    method_sub: "Use whichever is easier for you",
    text: "Written text",
    voice: "Voice recording",
    video: "Video recording",
    text_ph: "Type your message here…",
    start_rec: "Start recording",
    stop_rec: "Stop recording",
    delete: "Delete & redo",
    recording: "Recording…",
    permission_err: "Could not access the microphone / camera. Please grant permission.",
    participant_title: "Your info",
    participant_sub: "Optional — so we can follow up on your idea",
    name: "Name",
    contact: "Phone or email",
    submit: "Submit",
    thanks_title: "Thank you for sharing!",
    thanks_sub: "We received your contribution — your voice is shaping a better Eastern Province.",
    home: "Back to home",
    empty_err: "Please add some content before submitting.",
  },
} as const;

const META: Record<ShareType, { icon: typeof AlertTriangle; tone: string }> = {
  complaint: { icon: AlertTriangle, tone: "bg-destructive/10 text-destructive" },
  idea: { icon: Lightbulb, tone: "bg-secondary/15 text-secondary" },
  positive: { icon: ThumbsUp, tone: "bg-accent/15 text-accent" },
};

function SharePage() {
  const { type } = Route.useParams();
  const shareType = type as ShareType;
  const { locale, dir } = useI18n();
  const navigate = useNavigate();
  const c = COPY[locale];
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;
  const meta = META[shareType];
  const TypeIcon = meta.icon;

  const [method, setMethod] = useState<Method>("text");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Recording state
  const [recording, setRecording] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [recError, setRecError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);

  const title = c[`title_${shareType}` as const];
  const sub = c[`sub_${shareType}` as const];
  const isIdea = shareType === "idea";

  const cleanup = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
  };

  useEffect(() => cleanup, []);

  // Reset when switching method
  useEffect(() => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(null);
    setRecError(null);
    setRecording(false);
    cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  const startRecording = async () => {
    setRecError(null);
    try {
      const constraints: MediaStreamConstraints =
        method === "video" ? { video: true, audio: true } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (method === "video" && liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.muted = true;
        await liveVideoRef.current.play().catch(() => {});
      }
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: method === "video" ? "video/webm" : "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setMediaUrl(url);
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };
      mr.start();
      setRecording(true);
    } catch (e) {
      console.error(e);
      setRecError(c.permission_err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const deleteRecording = () => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(null);
    setRecError(null);
  };

  const submit = () => {
    setError(null);
    if (method === "text" && text.trim().length === 0) {
      setError(c.empty_err);
      return;
    }
    if (method !== "text" && !mediaUrl) {
      setError(c.empty_err);
      return;
    }
    cleanup();
    setSubmitted(true);
  };

  const methods = useMemo(
    () =>
      [
        { key: "text" as Method, icon: Type, label: c.text },
        { key: "voice" as Method, icon: Mic, label: c.voice },
        { key: "video" as Method, icon: Video, label: c.video },
      ],
    [c]
  );

  if (submitted) {
    return (
      <div className="min-h-dvh grid place-items-center bg-background px-4 py-16">
        <div className="max-w-md text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent/15 text-accent mb-5">
            <CheckCircle2 size={44} aria-hidden />
          </div>
          <h1 className="text-2xl font-black text-foreground">{c.thanks_title}</h1>
          <p className="mt-3 text-muted-foreground">{c.thanks_sub}</p>
          <button
            onClick={() => navigate({ to: "/" })}
            className="btn-primary mt-8"
          >
            <Home size={18} aria-hidden />
            {c.home}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-background/90 backdrop-blur border-b border-border">
        <div className="container-page flex items-center gap-2 py-2.5">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 min-h-11 rounded-full border-2 border-border bg-card px-3 font-bold text-sm hover:border-primary"
          >
            <BackArrow size={16} aria-hidden />
            {c.back}
          </Link>
        </div>
      </div>

      <main className="container-page pb-32 pt-6">
        {/* Header */}
        <div className={`flex items-center gap-4 p-4 rounded-2xl border-2 border-border bg-card`}>
          <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${meta.tone}`}>
            <TypeIcon size={26} aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{sub}</p>
          </div>
        </div>

        {/* Method picker */}
        <section aria-labelledby="method-title" className="mt-8">
          <div className="mb-4">
            <h2 id="method-title" className="text-lg font-black">{c.method_title}</h2>
            <p className="text-sm text-muted-foreground">{c.method_sub}</p>
          </div>

          <div role="tablist" aria-labelledby="method-title" className="grid grid-cols-3 gap-2">
            {methods.map(({ key, icon: Icon, label }) => {
              const active = method === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setMethod(key)}
                  className={`flex flex-col items-center justify-center gap-2 min-h-24 p-3 rounded-2xl border-2 transition-all ${
                    active
                      ? "border-primary bg-primary-soft shadow-md"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <span
                    className={`grid h-11 w-11 place-items-center rounded-full ${
                      active ? "bg-primary text-primary-foreground" : "bg-primary-soft text-primary"
                    }`}
                  >
                    <Icon size={22} aria-hidden />
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-center leading-tight">{label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Method content */}
        <section aria-live="polite" className="mt-6">
          {method === "text" && (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={c.text_ph}
              rows={7}
              className="w-full rounded-2xl border-2 border-border bg-card p-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          )}

          {method === "voice" && (
            <div className="rounded-2xl border-2 border-border bg-card p-5">
              {!mediaUrl && (
                <div className="flex flex-col items-center gap-4 py-4">
                  <span
                    className={`grid h-24 w-24 place-items-center rounded-full ${
                      recording ? "bg-destructive/15 text-destructive animate-pulse" : "bg-primary-soft text-primary"
                    }`}
                  >
                    <Mic size={44} aria-hidden />
                  </span>
                  {recording && <p className="text-sm font-bold text-destructive">{c.recording}</p>}
                  {!recording ? (
                    <button onClick={startRecording} className="btn-primary">
                      <Mic size={18} aria-hidden /> {c.start_rec}
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="btn-primary"
                      style={{ backgroundColor: "var(--color-destructive)" }}
                    >
                      <Square size={18} aria-hidden /> {c.stop_rec}
                    </button>
                  )}
                </div>
              )}
              {mediaUrl && (
                <div className="flex flex-col items-center gap-3">
                  <audio src={mediaUrl} controls className="w-full" />
                  <button
                    onClick={deleteRecording}
                    className="btn-outline"
                    style={{ borderColor: "var(--color-destructive)", color: "var(--color-destructive)" }}
                  >
                    <Trash2 size={18} aria-hidden /> {c.delete}
                  </button>
                </div>
              )}
              {recError && <p className="mt-3 text-sm font-bold text-destructive">{recError}</p>}
            </div>
          )}

          {method === "video" && (
            <div className="rounded-2xl border-2 border-border bg-card p-5">
              {!mediaUrl && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-full aspect-video rounded-xl bg-black overflow-hidden grid place-items-center">
                    {recording ? (
                      <video ref={liveVideoRef} className="h-full w-full object-cover" playsInline muted />
                    ) : (
                      <Video size={56} className="text-white/60" aria-hidden />
                    )}
                  </div>
                  {recording && <p className="text-sm font-bold text-destructive">{c.recording}</p>}
                  {!recording ? (
                    <button onClick={startRecording} className="btn-primary">
                      <Play size={18} aria-hidden /> {c.start_rec}
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="btn-primary"
                      style={{ backgroundColor: "var(--color-destructive)" }}
                    >
                      <Square size={18} aria-hidden /> {c.stop_rec}
                    </button>
                  )}
                </div>
              )}
              {mediaUrl && (
                <div className="flex flex-col items-center gap-3">
                  <video src={mediaUrl} controls className="w-full rounded-xl aspect-video bg-black" />
                  <button
                    onClick={deleteRecording}
                    className="btn-outline"
                    style={{ borderColor: "var(--color-destructive)", color: "var(--color-destructive)" }}
                  >
                    <Trash2 size={18} aria-hidden /> {c.delete}
                  </button>
                </div>
              )}
              {recError && <p className="mt-3 text-sm font-bold text-destructive">{recError}</p>}
            </div>
          )}
        </section>

        {/* Participant info — only for ideas */}
        {isIdea && (
          <section aria-labelledby="participant-title" className="mt-8 rounded-2xl border-2 border-border bg-card p-5">
            <div className="mb-4">
              <h2 id="participant-title" className="text-lg font-black">{c.participant_title}</h2>
              <p className="text-sm text-muted-foreground">{c.participant_sub}</p>
            </div>
            <div className="grid gap-3">
              <label className="block">
                <span className="block text-sm font-bold mb-1.5">{c.name}</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full min-h-12 rounded-xl border-2 border-border bg-background px-4 focus:outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="block text-sm font-bold mb-1.5">{c.contact}</span>
                <input
                  type="text"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  inputMode="email"
                  className="w-full min-h-12 rounded-xl border-2 border-border bg-background px-4 focus:outline-none focus:border-primary"
                />
              </label>
            </div>
          </section>
        )}

        {error && (
          <p className="mt-4 text-sm font-bold text-destructive" role="alert">{error}</p>
        )}
      </main>

      {/* Sticky Submit */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border">
        <div className="container-page py-3">
          <button onClick={submit} className="btn-primary w-full">
            {c.submit}
            <Arrow size={20} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}
