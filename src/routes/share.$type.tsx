import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { A11yFab } from "@/components/A11yFab";
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
  Lightbulb as Bulb,
  Volume2,
  ShieldCheck,
  RefreshCw,
  Eye,
  EyeOff,
  Timer,
} from "lucide-react";

type ShareType = "complaint" | "idea" | "positive";
type Method = "text" | "voice" | "video";
type Step = 1 | 2 | 3;

export const Route = createFileRoute("/share/$type")({
  component: SharePage,
  beforeLoad: ({ params }) => {
    if (!["complaint", "idea", "positive"].includes(params.type)) {
      throw new Error("Invalid share type");
    }
  },
});

const WORD_LIMIT = 500;
const AUDIO_LIMIT_SEC = 120; // 2 minutes
const VIDEO_LIMIT_SEC = 120; // 2 minutes

const COPY = {
  ar: {
    back: "رجوع",
    step1: "نوع المشاركة",
    step2: "طريقة المشاركة",
    step3: "مراجعة وإرسال",
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
    words: "كلمة",
    of: "من",
    limit_reached: "وصلت للحد الأقصى",
    tips_title: "قبل التسجيل — تلميحات لمقطع أفضل",
    tip_light: "تأكد من وجود إضاءة جيدة على وجهك",
    tip_sound: "اختر مكانًا هادئًا لتسجيل صوت واضح",
    tip_time_v: "الحد الأقصى للفيديو دقيقتان",
    tip_time_a: "الحد الأقصى للتسجيل الصوتي دقيقتان",
    privacy_toggle: "إخفاء وجهي (خصوصية)",
    privacy_on_note: "سيتم تغطية وجهك للحفاظ على خصوصيتك",
    privacy_hint: "مناسب لمستخدمي لغة الإشارة الذين يفضلون عدم إظهار الوجه",
    flip_cam: "قلب الكاميرا",
    start_rec: "بدء التسجيل",
    stop_rec: "إيقاف التسجيل",
    delete: "حذف والإعادة",
    recording: "جاري التسجيل…",
    permission_err: "تعذّر الوصول إلى الميكروفون / الكاميرا. يرجى السماح بالإذن.",
    review_title: "مراجعة وإرسال",
    review_sub: "تأكد من محتوى مشاركتك قبل الإرسال",
    review_type: "نوع المشاركة",
    review_method: "طريقة المشاركة",
    review_content: "المحتوى",
    contact_q: "هل تود مشاركة بيانات التواصل؟",
    contact_anon: "لا، أرسل فكرتي بشكل مجهول",
    contact_yes: "نعم، أود مشاركة بياناتي",
    name: "الاسم",
    name_ph: "مثال: محمد الشمري",
    phone: "رقم الجوال أو البريد",
    phone_ph: "+966 5X XXX XXXX",
    next: "متابعة",
    prev: "السابق",
    submit: "إرسال",
    thanks_title: "شكرًا لمشاركتك!",
    thanks_sub:
      "تم استلام مشاركتك بنجاح، صوتك يصنع الفرق في تطوير المنطقة الشرقية. سنعمل على مراجعتها ومعالجتها بأسرع وقت.",
    success_badge: "تم الإرسال بنجاح",
    home: "العودة للرئيسية",
    empty_err: "الرجاء إضافة محتوى قبل المتابعة.",
    read: "استماع",
    stop: "إيقاف",
  },
  en: {
    back: "Back",
    step1: "Type",
    step2: "Method",
    step3: "Review & submit",
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
    words: "words",
    of: "of",
    limit_reached: "Limit reached",
    tips_title: "Before recording — tips for a better clip",
    tip_light: "Make sure your face has good lighting",
    tip_sound: "Choose a quiet spot for clear audio",
    tip_time_v: "Video is limited to 2 minutes",
    tip_time_a: "Voice recording is limited to 2 minutes",
    privacy_toggle: "Hide my face (privacy)",
    privacy_on_note: "Your face will be covered to protect your privacy",
    privacy_hint: "Ideal for sign-language users who prefer not to show their face",
    flip_cam: "Flip camera",
    start_rec: "Start recording",
    stop_rec: "Stop recording",
    delete: "Delete & redo",
    recording: "Recording…",
    permission_err: "Could not access the microphone / camera. Please grant permission.",
    review_title: "Review & submit",
    review_sub: "Check your submission before sending",
    review_type: "Type",
    review_method: "Method",
    review_content: "Content",
    contact_q: "Would you like to share your contact details?",
    contact_anon: "No, submit my idea anonymously",
    contact_yes: "Yes, I'd like to share my contact details",
    name: "Name",
    name_ph: "e.g. Mohammed Alshamari",
    phone: "Phone or email",
    phone_ph: "+966 5X XXX XXXX",
    next: "Continue",
    prev: "Back",
    submit: "Submit",
    thanks_title: "Thank you for sharing!",
    thanks_sub:
      "Your contribution was received successfully — your voice is shaping a better Eastern Province. We'll review it as soon as possible.",
    success_badge: "Submitted successfully",
    home: "Back to home",
    empty_err: "Please add content before continuing.",
    read: "Listen",
    stop: "Stop",
  },
} as const;

const META: Record<ShareType, { icon: typeof AlertTriangle; tone: string }> = {
  complaint: { icon: AlertTriangle, tone: "bg-destructive/10 text-destructive" },
  idea: { icon: Lightbulb, tone: "bg-secondary/15 text-secondary" },
  positive: { icon: ThumbsUp, tone: "bg-accent/15 text-accent" },
};

function countWords(s: string): number {
  const t = s.trim();
  if (!t) return 0;
  return t.split(/\s+/).length;
}

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function Stepper({ step, labels, dir }: { step: Step; labels: [string, string, string]; dir: "ltr" | "rtl" }) {
  const items: { n: Step; label: string }[] = [
    { n: 1, label: labels[0] },
    { n: 2, label: labels[1] },
    { n: 3, label: labels[2] },
  ];
  return (
    <ol
      className="flex items-center gap-1.5 w-full"
      aria-label="Progress"
      style={{ direction: dir }}
    >
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <li key={it.n} className="flex items-center gap-1.5 flex-1 min-w-0">
            <span
              className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black border-2 ${
                done
                  ? "bg-primary border-primary text-primary-foreground"
                  : active
                  ? "bg-primary-soft border-primary text-primary"
                  : "bg-card border-border text-muted-foreground"
              }`}
              aria-current={active ? "step" : undefined}
            >
              {done ? <CheckCircle2 size={16} aria-hidden /> : it.n}
            </span>
            <span
              className={`text-xs font-bold truncate ${
                active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {it.label}
            </span>
            {i < items.length - 1 && (
              <span className={`flex-1 h-0.5 rounded-full ${done ? "bg-primary" : "bg-border"}`} aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

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

  const [step, setStep] = useState<Step>(2);
  const [method, setMethod] = useState<Method | null>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Contact prefs (only for idea)
  const [shareContact, setShareContact] = useState<"anon" | "yes" | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  // Recording state
  const [recording, setRecording] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [recError, setRecError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [blurFace, setBlurFace] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const title = c[`title_${shareType}` as const];
  const sub = c[`sub_${shareType}` as const];
  const isIdea = shareType === "idea";
  const limitSec = method === "video" ? VIDEO_LIMIT_SEC : AUDIO_LIMIT_SEC;
  const wordCount = countWords(text);

  const cleanup = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {}
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    mediaRecorderRef.current = null;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => cleanup, []);

  useEffect(() => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(null);
    setRecError(null);
    setRecording(false);
    setElapsed(0);
    cleanup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, facing, blurFace]);

  const startRecording = async () => {
    setRecError(null);
    setElapsed(0);
    try {
      const constraints: MediaStreamConstraints =
        method === "video"
          ? { video: { facingMode: facing }, audio: true }
          : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      let recordStream: MediaStream = stream;

      if (method === "video" && liveVideoRef.current) {
        liveVideoRef.current.srcObject = stream;
        liveVideoRef.current.muted = true;
        await liveVideoRef.current.play().catch(() => {});

        if (blurFace && canvasRef.current) {
          const video = liveVideoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          const setSize = () => {
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
          };
          setSize();
          const draw = () => {
            if (!ctx || !streamRef.current) return;
            if (canvas.width !== video.videoWidth) setSize();
            ctx.filter = "blur(28px)";
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            rafRef.current = requestAnimationFrame(draw);
          };
          draw();
          const canvasStream = canvas.captureStream(30);
          const audioTracks = stream.getAudioTracks();
          audioTracks.forEach((t) => canvasStream.addTrack(t));
          recordStream = canvasStream;
        }
      }

      const mimeCandidates =
        method === "video"
          ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
          : ["audio/webm;codecs=opus", "audio/webm"];
      const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m));
      const mr = new MediaRecorder(recordStream, mimeType ? { mimeType } : undefined);
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
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
        if (timerRef.current) window.clearInterval(timerRef.current);
        timerRef.current = null;
      };
      mr.start();
      setRecording(true);

      timerRef.current = window.setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1;
          if (next >= limitSec) {
            try {
              mediaRecorderRef.current?.stop();
            } catch {}
            setRecording(false);
          }
          return next;
        });
      }, 1000);
    } catch (e) {
      console.error(e);
      setRecError(c.permission_err);
    }
  };

  const stopRecording = () => {
    try {
      mediaRecorderRef.current?.stop();
    } catch {}
    setRecording(false);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const deleteRecording = () => {
    if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    setMediaUrl(null);
    setRecError(null);
    setElapsed(0);
  };

  const flipCamera = () => {
    setFacing((f) => (f === "user" ? "environment" : "user"));
  };

  const canStep2Continue = () => {
    if (!method) return false;
    if (method === "text") return text.trim().length > 0;
    return !!mediaUrl;
  };

  const goNext = () => {
    setError(null);
    if (step === 2) {
      if (!canStep2Continue()) {
        setError(c.empty_err);
        return;
      }
      cleanup();
      setStep(3);
    }
  };

  const goPrev = () => {
    setError(null);
    if (step === 3) setStep(2);
    else if (step === 2) {
      cleanup();
      setStep(1);
      setMethod(null);
    }
  };

  const submit = () => {
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

  // Success screen with blurred content behind
  if (submitted) {
    return (
      <div className="relative min-h-dvh bg-background">
        <div className="absolute inset-0 blur-md opacity-40 pointer-events-none" aria-hidden>
          <div className="container-page py-10">
            <div className="h-8 w-40 bg-muted rounded-full mb-4" />
            <div className="h-32 rounded-2xl bg-card border-2 border-border mb-3" />
            <div className="h-24 rounded-2xl bg-card border-2 border-border mb-3" />
            <div className="h-40 rounded-2xl bg-card border-2 border-border" />
          </div>
        </div>
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm" aria-hidden />
        <div className="relative z-10 min-h-dvh grid place-items-center px-4 py-16">
          <div className="max-w-md w-full text-center rounded-3xl border-2 border-border bg-card shadow-2xl p-8">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-accent/15 text-accent mb-5">
              <CheckCircle2 size={56} aria-hidden />
            </div>
            <span className="inline-block text-[11px] font-black uppercase tracking-wide bg-accent/15 text-accent px-3 py-1 rounded-full mb-3">
              {c.success_badge}
            </span>
            <h1 className="text-2xl font-black text-foreground">{c.thanks_title}</h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">{c.thanks_sub}</p>
            <button onClick={() => navigate({ to: "/" })} className="btn-primary mt-8 w-full">
              <Home size={18} aria-hidden />
              {c.home}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const readContent =
    step === 2 && method === "text"
      ? text || c.text_ph
      : `${title}. ${sub}. ${c[`step${step}` as "step1" | "step2" | "step3"]}.`;

  return (
    <div className="min-h-dvh bg-background">
      {/* Top bar with stepper */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="container-page py-2.5 flex items-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 min-h-11 rounded-full border-2 border-border bg-card px-3 font-bold text-sm hover:border-primary shrink-0"
          >
            <BackArrow size={16} aria-hidden />
            {c.back}
          </Link>
        </div>
        <div className="container-page pb-3">
          <Stepper step={step} labels={[c.step1, c.step2, c.step3]} dir={dir} />
        </div>
      </div>

      <main className="container-page pb-32 pt-6">
        {/* Header: type card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-border bg-card">
          <span className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${meta.tone}`}>
            <TypeIcon size={26} aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="text-xl font-black text-foreground">{title}</h1>
            <p className="text-sm text-muted-foreground">{sub}</p>
          </div>
        </div>

        {/* STEP 2: method + input */}
        {step === 2 && (
          <>
            <section aria-labelledby="method-title" className="mt-8">
              <div className="mb-4">
                <h2 id="method-title" className="text-lg font-black">
                  {c.method_title}
                </h2>
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
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary-soft text-primary"
                        }`}
                      >
                        <Icon size={22} aria-hidden />
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-center leading-tight">
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section aria-live="polite" className="mt-6">
              {method === "text" && (
                <div>
                  <textarea
                    value={text}
                    onChange={(e) => {
                      const next = e.target.value;
                      if (countWords(next) <= WORD_LIMIT) setText(next);
                      else {
                        // trim to limit
                        const words = next.trim().split(/\s+/).slice(0, WORD_LIMIT);
                        setText(words.join(" "));
                      }
                    }}
                    placeholder={c.text_ph}
                    rows={7}
                    className="w-full rounded-2xl border-2 border-border bg-card p-4 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <div className="mt-2 flex items-center justify-between text-xs">
                    <span
                      className={`font-bold ${
                        wordCount >= WORD_LIMIT ? "text-destructive" : "text-muted-foreground"
                      }`}
                    >
                      {wordCount} {c.of} {WORD_LIMIT} {c.words}
                    </span>
                    {wordCount >= WORD_LIMIT && (
                      <span className="font-bold text-destructive">{c.limit_reached}</span>
                    )}
                  </div>
                </div>
              )}

              {method === "voice" && (
                <div className="rounded-2xl border-2 border-border bg-card p-5">
                  <div className="mb-4 flex items-start gap-3 rounded-xl bg-primary-soft p-3">
                    <Bulb size={18} className="text-primary shrink-0 mt-0.5" aria-hidden />
                    <div className="text-sm">
                      <p className="font-bold text-foreground mb-1">{c.tips_title}</p>
                      <ul className="space-y-0.5 text-muted-foreground">
                        <li>• {c.tip_sound}</li>
                        <li>• {c.tip_time_a}</li>
                      </ul>
                    </div>
                  </div>

                  {!mediaUrl && (
                    <div className="flex flex-col items-center gap-4 py-4">
                      <span
                        className={`grid h-24 w-24 place-items-center rounded-full ${
                          recording
                            ? "bg-destructive/15 text-destructive animate-pulse"
                            : "bg-primary-soft text-primary"
                        }`}
                      >
                        <Mic size={44} aria-hidden />
                      </span>
                      {recording && (
                        <div className="flex items-center gap-2 text-sm font-black text-destructive">
                          <Timer size={16} aria-hidden />
                          {formatTime(elapsed)} / {formatTime(limitSec)}
                        </div>
                      )}
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
                        style={{
                          borderColor: "var(--color-destructive)",
                          color: "var(--color-destructive)",
                        }}
                      >
                        <Trash2 size={18} aria-hidden /> {c.delete}
                      </button>
                    </div>
                  )}
                  {recError && (
                    <p className="mt-3 text-sm font-bold text-destructive">{recError}</p>
                  )}
                </div>
              )}

              {method === "video" && (
                <div className="rounded-2xl border-2 border-border bg-card p-5">
                  {/* Tips */}
                  <div className="mb-4 flex items-start gap-3 rounded-xl bg-primary-soft p-3">
                    <Bulb size={18} className="text-primary shrink-0 mt-0.5" aria-hidden />
                    <div className="text-sm">
                      <p className="font-bold text-foreground mb-1">{c.tips_title}</p>
                      <ul className="space-y-0.5 text-muted-foreground">
                        <li>• {c.tip_light}</li>
                        <li>• {c.tip_sound}</li>
                        <li>• {c.tip_time_v}</li>
                      </ul>
                    </div>
                  </div>

                  {/* Privacy toggle */}
                  <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border-2 border-border p-3">
                    <div className="flex items-start gap-2 min-w-0">
                      <ShieldCheck size={18} className="text-primary shrink-0 mt-0.5" aria-hidden />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">{c.privacy_toggle}</p>
                        <p className="text-xs text-muted-foreground">{c.privacy_hint}</p>
                      </div>
                    </div>
                    <button
                      role="switch"
                      aria-checked={blurFace}
                      onClick={() => setBlurFace((v) => !v)}
                      disabled={recording}
                      className={`inline-flex items-center gap-1.5 min-h-11 shrink-0 rounded-full px-3 font-bold text-xs border-2 ${
                        blurFace
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border hover:border-primary"
                      } disabled:opacity-50`}
                    >
                      {blurFace ? <EyeOff size={14} aria-hidden /> : <Eye size={14} aria-hidden />}
                      {blurFace ? "ON" : "OFF"}
                    </button>
                  </div>

                  {blurFace && (
                    <div
                      role="note"
                      className="mb-3 rounded-xl border-2 border-primary/40 bg-primary-soft px-3 py-2 text-xs font-bold text-primary text-center"
                    >
                      {c.privacy_on_note}
                    </div>
                  )}

                  {!mediaUrl && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative w-full aspect-video rounded-xl bg-black overflow-hidden grid place-items-center">
                        {recording ? (
                          <>
                            <video
                              ref={liveVideoRef}
                              className={`h-full w-full object-cover ${blurFace ? "opacity-0" : ""}`}
                              playsInline
                              muted
                            />
                            {blurFace && (
                              <canvas
                                ref={canvasRef}
                                className="absolute inset-0 h-full w-full object-cover"
                              />
                            )}

                            {/* Camera flip — top start (left in LTR) */}
                            <button
                              type="button"
                              onClick={flipCamera}
                              aria-label={c.flip_cam}
                              className="absolute top-2 start-2 inline-flex items-center gap-1 rounded-full bg-black/60 text-white px-3 py-1.5 text-xs font-bold backdrop-blur"
                            >
                              <RefreshCw size={14} aria-hidden />
                              {c.flip_cam}
                            </button>

                            {/* Timer — top end (right in LTR) */}
                            <div className="absolute top-2 end-2 inline-flex items-center gap-1 rounded-full bg-destructive text-destructive-foreground px-3 py-1.5 text-xs font-black">
                              <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
                              {formatTime(elapsed)} / {formatTime(limitSec)}
                            </div>
                          </>
                        ) : (
                          <Video size={56} className="text-white/60" aria-hidden />
                        )}
                      </div>

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
                        style={{
                          borderColor: "var(--color-destructive)",
                          color: "var(--color-destructive)",
                        }}
                      >
                        <Trash2 size={18} aria-hidden /> {c.delete}
                      </button>
                    </div>
                  )}
                  {recError && <p className="mt-3 text-sm font-bold text-destructive">{recError}</p>}
                </div>
              )}
            </section>
          </>
        )}

        {/* STEP 3: review + contact */}
        {step === 3 && (
          <section className="mt-8">
            <div className="mb-4">
              <h2 className="text-lg font-black">{c.review_title}</h2>
              <p className="text-sm text-muted-foreground">{c.review_sub}</p>
            </div>

            <div className="rounded-2xl border-2 border-border bg-card p-4 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xs font-black uppercase text-muted-foreground w-24 pt-0.5">{c.review_type}</span>
                <span className="font-bold text-foreground">{title}</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xs font-black uppercase text-muted-foreground w-24 pt-0.5">{c.review_method}</span>
                <span className="font-bold text-foreground">
                  {method === "text" ? c.text : method === "voice" ? c.voice : c.video}
                </span>
              </div>
              <div>
                <p className="text-xs font-black uppercase text-muted-foreground mb-2">{c.review_content}</p>
                {method === "text" && (
                  <div className="rounded-xl border-2 border-border bg-background p-3 text-sm text-foreground whitespace-pre-wrap">
                    {text}
                  </div>
                )}
                {method === "voice" && mediaUrl && <audio src={mediaUrl} controls className="w-full" />}
                {method === "video" && mediaUrl && (
                  <video src={mediaUrl} controls className="w-full rounded-xl aspect-video bg-black" />
                )}
              </div>
            </div>

            {isIdea && (
              <div className="mt-6 rounded-2xl border-2 border-border bg-card p-5">
                <p className="text-base font-black text-foreground mb-3">{c.contact_q}</p>
                <div className="grid gap-2">
                  {(["anon", "yes"] as const).map((k) => {
                    const active = shareContact === k;
                    return (
                      <button
                        key={k}
                        role="radio"
                        aria-checked={active}
                        onClick={() => setShareContact(k)}
                        className={`w-full text-start flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                          active
                            ? "border-primary bg-primary-soft"
                            : "border-border bg-background hover:border-primary/50"
                        }`}
                      >
                        <span
                          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                            active
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border"
                          }`}
                          aria-hidden
                        >
                          {active && <CheckCircle2 size={14} />}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {k === "anon" ? c.contact_anon : c.contact_yes}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {shareContact === "yes" && (
                  <div className="grid gap-3 mt-4">
                    <label className="block">
                      <span className="block text-sm font-bold mb-1.5">{c.name}</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={c.name_ph}
                        className="w-full min-h-12 rounded-xl border-2 border-border bg-background px-4 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60"
                      />
                    </label>
                    <label className="block">
                      <span className="block text-sm font-bold mb-1.5">{c.phone}</span>
                      <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={c.phone_ph}
                        inputMode="tel"
                        dir="ltr"
                        className="w-full min-h-12 rounded-xl border-2 border-border bg-background px-4 focus:outline-none focus:border-primary placeholder:text-muted-foreground/60"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {error && (
          <p className="mt-4 text-sm font-bold text-destructive" role="alert">
            {error}
          </p>
        )}
      </main>

      {/* Sticky bottom action bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 bg-background/95 backdrop-blur border-t border-border">
        <div className="container-page py-3 flex items-center gap-2">
          {step === 1 && (
            <button onClick={() => setStep(2)} className="btn-primary w-full">
              {c.next}
              <Arrow size={20} aria-hidden />
            </button>
          )}
          {step === 2 && (
            <>
              <button onClick={goPrev} className="btn-outline min-h-12 px-4">
                {c.prev}
              </button>
              <button onClick={goNext} className="btn-primary flex-1">
                {c.next}
                <Arrow size={20} aria-hidden />
              </button>
            </>
          )}
          {step === 3 && (
            <>
              <button onClick={goPrev} className="btn-outline min-h-12 px-4">
                {c.prev}
              </button>
              <button onClick={submit} className="btn-primary flex-1">
                <Volume2 size={0} className="hidden" aria-hidden />
                {c.submit}
                <Arrow size={20} aria-hidden />
              </button>
            </>
          )}
        </div>
      </div>

      <A11yFab readText={readContent} />
    </div>
  );
}
