import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  Target,
  BarChart3,
  Sparkles,
  Settings,
  LayoutGrid,
  Heart,
  ListTodo,
  Plus,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutGrid },
  { to: "/app/journal", label: "Journal", icon: BookOpen },
  { to: "/app/calendar", label: "Calendar", icon: Calendar },
  { to: "/app/timeline", label: "Timeline", icon: ListTodo },
  { to: "/app/habits", label: "Habits", icon: Target },
  { to: "/app/goals", label: "Goals", icon: Sparkles },
  { to: "/app/coach", label: "AI Coach", icon: Sparkles },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/memory", label: "Memory Vault", icon: Heart },
  { to: "/app/settings", label: "Settings", icon: Settings },
];
const BOTTOM = NAV.filter((n) =>
  ["/app", "/app/journal", "/app/coach", "/app/analytics"].includes(n.to),
);
export function AppShell({ children }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);
  return (
    <div className="min-h-screen bg-surface text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-border bg-card/60 backdrop-blur-xl px-4 py-6 z-40">
        <Link to="/app" className="flex items-center gap-2 px-2 mb-8">
          <div className="size-9 rounded-2xl bg-primary grid place-items-center shadow-soft">
            <div className="size-3 rounded-full bg-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">ReflectAI</span>
        </Link>

        <div className="px-2 mb-4">
          <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-sm text-muted-foreground">
            <Search className="size-4" />
            <span>Search entries…</span>
            <kbd className="ml-auto text-[10px] rounded bg-card border border-border px-1.5 py-0.5">
              ⌘K
            </kbd>
          </div>
        </div>

        <nav className="space-y-0.5 flex-1">
          {NAV.map((item) => {
            const active = item.to === "/app" ? pathname === "/app" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 rounded-2xl bg-primary/5 border border-primary/10 p-4">
          <div className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">
            Current streak
          </div>
          <div className="font-serif italic text-2xl text-foreground">12 days</div>
          <div className="mt-2 h-1 rounded-full bg-primary/10 overflow-hidden">
            <div className="h-full w-3/4 bg-primary rounded-full" />
          </div>
        </div>

        <button
          onClick={() => setDark((d) => !d)}
          className="mt-4 flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-40 glass border-b border-border px-4 py-3 flex items-center justify-between">
        <Link to="/app" className="flex items-center gap-2">
          <div className="size-8 rounded-xl bg-primary grid place-items-center">
            <div className="size-2.5 rounded-full bg-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">ReflectAI</span>
        </Link>
        <button
          onClick={() => setDark((d) => !d)}
          className="size-9 grid place-items-center rounded-full bg-muted text-muted-foreground"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </header>

      <main className="md:pl-64 pb-28 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">{children}</div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-border px-6 py-3 flex items-center justify-between">
        {BOTTOM.slice(0, 2).map((item) => {
          const active = pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 text-[10px] font-semibold",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
        <Link
          to="/app/journal/new"
          className="-translate-y-7 size-14 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-premium"
          aria-label="New entry"
        >
          <Plus className="size-6" />
        </Link>
        {BOTTOM.slice(2).map((item) => {
          const active = pathname.startsWith(item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 text-[10px] font-semibold",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
export function PageHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
      <div>
        {eyebrow ? (
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary/60 mb-2">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="text-3xl md:text-4xl font-serif italic text-foreground">{title}</h1>
        {description ? <p className="mt-2 text-muted-foreground max-w-xl">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
