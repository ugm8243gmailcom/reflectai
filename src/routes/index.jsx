import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Sparkles,
  BookOpen,
  BarChart3,
  Heart,
  Lock,
  Mic,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ReflectAI — Understand Yourself Better Every Day" },
      {
        name: "description",
        content:
          "A private space for your thoughts, powered by AI that finds the patterns you can't. Journaling, mood tracking, and habits for people who think deeply.",
      },
      { property: "og:title", content: "ReflectAI — Understand Yourself Better Every Day" },
      {
        property: "og:description",
        content: "AI-powered journaling, mood tracking, and personal growth.",
      },
    ],
  }),
  component: Landing,
});
function Landing() {
  return (
    <div className="min-h-screen bg-surface text-foreground">
      <Nav />
      <Hero />
      <Logos />
      <Features />
      <AIShowcase />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
function Nav() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary grid place-items-center">
            <div className="size-2.5 rounded-full bg-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">ReflectAI</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#features" className="hover:text-foreground">
            Features
          </a>
          <a href="#ai" className="hover:text-foreground">
            AI Insights
          </a>
          <a href="#pricing" className="hover:text-foreground">
            Pricing
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/auth"
            className="hidden sm:inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-foreground hover:bg-muted"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            Start free
          </Link>
        </div>
      </div>
    </nav>
  );
}
function Hero() {
  return (
    <section className="pt-36 pb-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 border border-primary/10 text-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.15em] mb-8">
          <Sparkles className="size-3" />
          The Art of Self-Observation
        </div>
        <h1 className="font-serif italic text-5xl md:text-7xl leading-[1.05] text-balance">
          Understand yourself <br className="hidden md:block" />
          better <span className="text-primary">every single day.</span>
        </h1>
        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          A private notebook with the intelligence of a coach. Capture thoughts, track moods, build
          habits, and let AI reveal the patterns shaping your life.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/auth"
            className="w-full sm:w-auto inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-bold text-primary-foreground shadow-premium hover:opacity-95"
          >
            Start journaling free
            <ArrowRight className="size-4" />
          </Link>
          <button className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-full bg-card border border-border px-7 text-sm font-semibold hover:bg-muted">
            Watch demo
          </button>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          Free forever for personal use · No credit card required
        </div>
      </div>

      <div className="mt-16 max-w-5xl mx-auto rounded-[2rem] p-2 bg-gradient-to-b from-primary/10 to-transparent">
        <HeroPreview />
      </div>
    </section>
  );
}
function HeroPreview() {
  return (
    <div className="rounded-[1.75rem] bg-card ring-1 ring-border shadow-premium overflow-hidden">
      <div className="grid md:grid-cols-[240px_1fr] min-h-[460px]">
        <div className="hidden md:flex flex-col gap-6 p-6 border-r border-border bg-surface">
          <div className="flex items-center gap-2">
            <div className="size-7 rounded-lg bg-primary grid place-items-center">
              <div className="size-2 rounded-full bg-primary-foreground" />
            </div>
            <div className="font-bold text-sm">ReflectAI</div>
          </div>
          <div className="space-y-1 text-sm">
            {["Dashboard", "Journal", "Habits", "Insights"].map((l, i) => (
              <div
                key={l}
                className={cn(
                  "px-3 py-2 rounded-lg",
                  i === 0
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground",
                )}
              >
                {l}
              </div>
            ))}
          </div>
          <div className="mt-auto rounded-xl bg-primary/5 border border-primary/10 p-3">
            <div className="text-[9px] font-bold uppercase tracking-widest text-primary">
              Streak
            </div>
            <div className="font-serif italic text-2xl">12 days</div>
          </div>
        </div>
        <div className="p-6 md:p-8 space-y-6">
          <div>
            <h3 className="font-serif italic text-2xl">Good evening, you.</h3>
            <p className="text-sm text-muted-foreground">It's a quiet Tuesday. How are you?</p>
          </div>
          <div className="flex justify-between items-center bg-surface rounded-2xl p-4">
            {["😊", "😌", "😐", "😔", "😡"].map((e, i) => (
              <div
                key={e}
                className={cn(
                  "text-3xl transition",
                  i === 1 ? "scale-110" : "grayscale opacity-50",
                )}
              >
                {e}
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-primary p-5 text-primary-foreground relative overflow-hidden">
            <div className="absolute -top-8 -right-8 size-32 rounded-full border-4 border-white/10" />
            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-2">
              AI Reflection
            </div>
            <p className="italic font-light leading-relaxed">
              "You've mentioned feeling 'focused' in 80% of your morning entries this week. Consider
              moving your deep work to 8 AM."
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Meditation", v: 80, c: "bg-emerald-growth" },
              { name: "Reading", v: 65, c: "bg-primary-soft" },
            ].map((h) => (
              <div key={h.name} className="bg-surface rounded-xl p-3">
                <div className="text-xs font-semibold mb-2">{h.name}</div>
                <div className="h-1.5 rounded-full bg-border overflow-hidden">
                  <div className={cn("h-full rounded-full", h.c)} style={{ width: `${h.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function Logos() {
  return (
    <section className="py-12 border-y border-border bg-card/50">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
          A daily ritual for thinkers, builders, and quiet observers
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 font-serif italic text-xl text-muted-foreground/60">
          <span>Cortex Labs</span>
          <span>Northwind</span>
          <span>Atelier &amp; Co</span>
          <span>Linden</span>
          <span>Studio Volta</span>
        </div>
      </div>
    </section>
  );
}
function Features() {
  const items = [
    {
      icon: BookOpen,
      title: "Effortless capture",
      body: "Rich text, voice notes, images, tags. Free-writing or guided prompts — whichever the moment asks for.",
    },
    {
      icon: Heart,
      title: "Mood &amp; habit tracking",
      body: "Five moods, gentle streaks, beautiful charts. Watch the shape of your weeks emerge.",
    },
    {
      icon: BarChart3,
      title: "Pattern analytics",
      body: "Weekly, monthly, yearly views. Topic breakdowns. Habit consistency scores.",
    },
    {
      icon: Sparkles,
      title: "AI reflections",
      body: "Daily summaries, weekly reviews, and a private coach that has actually read your journal.",
    },
    {
      icon: Mic,
      title: "Voice journaling",
      body: "Talk it out. We'll transcribe, tag, and pull the throughlines for you.",
    },
    {
      icon: Lock,
      title: "Absolute privacy",
      body: "End-to-end encrypted by design. Your inner world stays entirely yours.",
    },
  ];
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
            What's inside
          </div>
          <h2 className="font-serif italic text-4xl md:text-5xl">
            Built for the way you actually think.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-3xl bg-card border border-border p-7 hover:shadow-elevated transition-shadow"
              >
                <div className="size-11 rounded-2xl bg-primary/5 text-primary grid place-items-center mb-5">
                  <Icon className="size-5" />
                </div>
                <h3
                  className="font-bold text-lg mb-2"
                  dangerouslySetInnerHTML={{ __html: f.title }}
                />
                <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function AIShowcase() {
  return (
    <section id="ai" className="py-24 px-6 bg-card border-y border-border">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
            AI insights
          </div>
          <h2 className="font-serif italic text-4xl md:text-5xl leading-tight">
            An AI that <span className="text-primary">listens</span>, then reflects.
          </h2>
          <p className="mt-6 text-muted-foreground text-lg max-w-md">
            ReflectAI reads your entries the way a thoughtful friend would — looking for the
            patterns you're too close to see.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              "Weekly reflection: wins, challenges, lessons",
              "Mood–habit correlation analysis",
              "Personal growth coaching, in chat",
              "Semantic search across years of entries",
            ].map((l) => (
              <li key={l} className="flex items-center gap-3 text-sm">
                <div className="size-5 rounded-full bg-emerald-growth/15 text-emerald-growth grid place-items-center">
                  <Check className="size-3" />
                </div>
                {l}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4">
          {[
            {
              tag: "Weekly Pattern",
              text: "Your mood improves 24% on days you mention 'reading' or 'walking'. Stress entries cluster on Mondays at 9 PM.",
            },
            {
              tag: "Topic Trend",
              text: "Career mentions are up 38% this month. Family mentions are at a 6-month low.",
            },
            {
              tag: "Habit Insight",
              text: "Mornings with meditation are followed by 2.1× more 'focused' entries.",
            },
          ].map((c) => (
            <div key={c.tag} className="rounded-2xl bg-surface border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 rounded-md px-2 py-0.5">
                  {c.tag}
                </div>
                <div className="size-1.5 rounded-full bg-emerald-growth animate-pulse" />
              </div>
              <p className="text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Testimonials() {
  const items = [
    {
      quote:
        "The first journaling app that actually changed how I see my own week. The Sunday reflection is uncanny.",
      name: "Sarah J.",
      role: "Product Designer",
    },
    {
      quote: "I've kept it open every morning for four months. That's never happened with any app.",
      name: "Marcus L.",
      role: "Founder",
    },
    {
      quote: "It feels like a quiet room. The AI never lectures — it just notices what I missed.",
      name: "Priya K.",
      role: "Therapist",
    },
  ];
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
            Loved by careful thinkers
          </div>
          <h2 className="font-serif italic text-4xl md:text-5xl">Words from the journal.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {items.map((t) => (
            <div key={t.name} className="rounded-3xl bg-card border border-border p-7">
              <div className="flex gap-0.5 mb-4 text-orange-warm">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-current" />
                ))}
              </div>
              <p className="font-serif italic text-lg leading-snug mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-gradient-to-br from-primary to-primary-soft" />
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6 bg-card border-y border-border">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
            Simple pricing
          </div>
          <h2 className="font-serif italic text-4xl md:text-5xl">Pick your practice.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="rounded-3xl bg-surface border border-border p-8">
            <div className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Essence
            </div>
            <div className="font-serif italic text-5xl">Free</div>
            <p className="mt-3 text-sm text-muted-foreground">For the daily ritual.</p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Unlimited text entries",
                "Mood &amp; habit tracking",
                "Calendar &amp; timeline views",
                "1 AI weekly summary",
              ].map((l) => (
                <li key={l} className="flex items-start gap-2">
                  <Check className="size-4 text-primary mt-0.5 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: l }} />
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="mt-8 w-full inline-flex h-11 items-center justify-center rounded-full border border-primary text-primary font-semibold"
            >
              Start free
            </Link>
          </div>
          <div className="rounded-3xl bg-primary text-primary-foreground p-8 shadow-premium relative">
            <div className="absolute -top-3 right-6 rounded-full bg-orange-warm text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
              Recommended
            </div>
            <div className="text-[11px] font-bold uppercase tracking-widest opacity-70 mb-2">
              Growth
            </div>
            <div className="font-serif italic text-5xl">
              $9<span className="text-lg opacity-70 align-middle">/mo</span>
            </div>
            <p className="mt-3 text-sm opacity-80">For deeper reflection.</p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Everything in Essence",
                "Unlimited AI summaries",
                "AI Coach chat",
                "Voice journaling &amp; transcription",
                "Advanced analytics &amp; PDF export",
              ].map((l) => (
                <li key={l} className="flex items-start gap-2">
                  <Check className="size-4 mt-0.5 shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: l }} />
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="mt-8 w-full inline-flex h-11 items-center justify-center rounded-full bg-card text-primary font-semibold"
            >
              Go premium
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
function FAQ() {
  const items = [
    {
      q: "Is my data private?",
      a: "Yes. Entries are encrypted at rest and never used to train external models. You can export or delete everything in one click.",
    },
    {
      q: "Do I need to write every day?",
      a: "No. ReflectAI rewards consistency but doesn't punish gaps. Streaks are gentle, not guilt-inducing.",
    },
    {
      q: "Can I use it offline?",
      a: "Writing works offline. Sync and AI features resume when you're back online.",
    },
    {
      q: "What AI powers the insights?",
      a: "A modern large language model with retrieval over your encrypted entries. You can disable AI features anytime.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes — one click in Settings. You keep your entries forever.",
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary mb-3">
            FAQ
          </div>
          <h2 className="font-serif italic text-4xl md:text-5xl">Quiet answers.</h2>
        </div>
        <div className="space-y-2">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <button
                key={it.q}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left rounded-2xl bg-card border border-border p-5 hover:bg-muted/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold">{it.q}</span>
                  <span
                    className={cn(
                      "text-2xl text-primary transition-transform",
                      isOpen && "rotate-45",
                    )}
                  >
                    +
                  </span>
                </div>
                {isOpen ? (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{it.a}</p>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
function CTA() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto rounded-[2rem] bg-primary text-primary-foreground p-12 md:p-16 text-center shadow-premium relative overflow-hidden">
        <div className="absolute -top-20 -right-20 size-72 rounded-full border-[20px] border-white/5" />
        <div className="absolute -bottom-24 -left-16 size-72 rounded-full bg-white/5" />
        <div className="relative">
          <h2 className="font-serif italic text-4xl md:text-5xl">
            Start the conversation with yourself.
          </h2>
          <p className="mt-4 text-primary-foreground/80 max-w-md mx-auto">
            Three minutes a day. A clearer mind in a month.
          </p>
          <Link
            to="/auth"
            className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-card text-primary px-7 text-sm font-bold"
          >
            Begin journaling free
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer className="px-6 py-12 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-lg bg-primary grid place-items-center">
            <div className="size-1.5 rounded-full bg-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight text-sm">ReflectAI</span>
        </div>
        <div className="flex gap-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          <a href="#">Privacy</a>
          <a href="#">Security</a>
          <a href="#">Ethics</a>
          <a href="#">Contact</a>
        </div>
        <div className="text-xs text-muted-foreground">
          © 2026 ReflectAI · Built for introspection.
        </div>
      </div>
    </footer>
  );
}
