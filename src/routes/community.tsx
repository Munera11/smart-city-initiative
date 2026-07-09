import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { MessageSquare, Star, Calendar, MapPin } from "lucide-react";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "المجتمع | وصل" },
      { name: "description", content: "شارك تجاربك ونصائحك عن الأماكن المهيأة وتعرّف على فعاليات المنطقة الشرقية." },
      { property: "og:title", content: "المجتمع | وصل" },
      { property: "og:description", content: "مجتمع يشاركك الطريق في المنطقة الشرقية." },
    ],
  }),
  component: CommunityPage,
});

interface Post {
  id: string;
  author: string;
  city: string;
  rating: number;
  text: { ar: string; en: string };
  place: string;
}

const INITIAL_POSTS: Post[] = [
  {
    id: "p1",
    author: "أم عبدالله",
    city: "الخبر",
    rating: 5,
    place: "كورنيش الخبر",
    text: {
      ar: "المسارات ممتازة للكرسي المتحرك، والمقاعد كثيرة على طول الممشى. تجربة مريحة جدًا لوالدتي.",
      en: "Excellent wheelchair paths and plenty of benches along the walk. A very comfortable experience for my mother.",
    },
  },
  {
    id: "p2",
    author: "Fahad A.",
    city: "الدمام",
    rating: 4,
    place: "حديقة الحواس المتكاملة",
    text: {
      ar: "الألعاب الدامجة أسعدت ابنتي كثيرًا، أتمنى تظليل أكثر في فصل الصيف.",
      en: "Inclusive play made my daughter so happy. Wish there was more shade in the summer.",
    },
  },
  {
    id: "p3",
    author: "سارة",
    city: "الظهران",
    rating: 5,
    place: "نادي كبار السن",
    text: {
      ar: "برنامج أسبوعي رائع، والمشرفون متعاونون جدًا مع الوالد.",
      en: "Wonderful weekly program and the supervisors are very kind to my father.",
    },
  },
];

const EVENTS = [
  { date: "2026-07-18", ar: "ورشة لغة الإشارة للمبتدئين", en: "Beginner Sign Language Workshop", loc: { ar: "الخبر", en: "Khobar" } },
  { date: "2026-07-25", ar: "لقاء كبار السن الشهري", en: "Monthly Seniors Gathering", loc: { ar: "الدمام", en: "Dammam" } },
  { date: "2026-08-02", ar: "يوم رياضي دامج", en: "Inclusive Sports Day", loc: { ar: "الظهران", en: "Dhahran" } },
];

function CommunityPage() {
  const { tr, locale } = useI18n();
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [text, setText] = useState("");
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosts([
      {
        id: `p${Date.now()}`,
        author: name || (locale === "ar" ? "مجهول" : "Anonymous"),
        city: locale === "ar" ? "المنطقة الشرقية" : "Eastern Province",
        rating: 5,
        place: "",
        text: { ar: text, en: text },
      },
      ...posts,
    ]);
    setText("");
    setName("");
  };

  return (
    <div className="container-page py-10 md:py-14">
      <header className="mb-10 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black">{tr("community_title")}</h1>
        <p className="mt-3 text-muted-foreground text-lg leading-relaxed">{tr("community_sub")}</p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <form onSubmit={submit} className="surface-card p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={18} className="text-primary" aria-hidden />
              <h2 className="font-bold">{tr("hero_cta_secondary")}</h2>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={tr("form_name")}
              className="w-full min-h-11 rounded-xl border-2 border-border bg-background px-4 mb-2 focus:border-primary outline-none"
            />
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={tr("post_placeholder")}
              rows={3}
              className="w-full rounded-xl border-2 border-border bg-background px-4 py-3 focus:border-primary outline-none resize-none"
            />
            <div className="mt-3 flex justify-end">
              <button type="submit" className="btn-primary">{tr("post_submit")}</button>
            </div>
          </form>

          <ul className="space-y-4">
            {posts.map((p) => (
              <li key={p.id} className="surface-card p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-soft text-primary font-black">
                      {p.author.charAt(0)}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold truncate">{p.author}</p>
                      <p className="text-xs text-muted-foreground">{p.city}{p.place ? ` · ${p.place}` : ""}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0" aria-label={`${p.rating} / 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < p.rating ? "fill-current text-secondary" : "text-muted-foreground/30"} aria-hidden />
                    ))}
                  </div>
                </div>
                <p className="text-foreground/90 leading-relaxed">{p.text[locale]}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside>
          <div className="surface-card p-5 sticky top-24">
            <h2 className="font-bold flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-accent" aria-hidden />
              {tr("cat_events")}
            </h2>
            <ul className="space-y-4">
              {EVENTS.map((e, i) => (
                <li key={i} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="shrink-0 w-14 text-center rounded-xl bg-primary-soft text-primary py-1.5">
                    <div className="text-[11px] font-semibold uppercase">
                      {new Date(e.date).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", { month: "short" })}
                    </div>
                    <div className="text-xl font-black leading-none">
                      {new Date(e.date).getDate()}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-foreground">{locale === "ar" ? e.ar : e.en}</p>
                    <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                      <MapPin size={12} aria-hidden />
                      {e.loc[locale]}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
