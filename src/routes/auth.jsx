import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in — ReflectAI" },
      { name: "description", content: "Sign in or create your ReflectAI account." },
    ],
  }),
  component: AuthPage,
});
function AuthPage() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!loading && session) navigate({ to: "/app" });
  }, [session, loading, navigate]);
  async function handleGoogle() {
    setBusy(true);
    const res = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/app",
    });
    if (res.error) {
      toast.error(res.error.message || "Sign-in failed");
      setBusy(false);
      return;
    }
    if (res.redirected) return;
    navigate({ to: "/app" });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: window.location.origin + "/app",
          },
        });
        if (error) throw error;
        toast.success("Welcome to ReflectAI.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/app" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-surface">
      <div className="hidden md:flex flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-32 -left-32 size-96 rounded-full border-[20px] border-white/5" />
        <div className="absolute -bottom-32 -right-20 size-96 rounded-full bg-white/5" />
        <Link to="/" className="flex items-center gap-2 relative">
          <div className="size-9 rounded-2xl bg-card grid place-items-center">
            <div className="size-3 rounded-full bg-primary" />
          </div>
          <span className="font-bold text-lg">ReflectAI</span>
        </Link>
        <div className="relative max-w-md">
          <p className="font-serif italic text-3xl leading-tight">
            "The unexamined life is not worth living — but the examined one is unrecognizably
            better."
          </p>
          <div className="mt-6 text-sm opacity-70">— A user, three months in</div>
        </div>
        <div className="relative text-xs uppercase tracking-widest opacity-60">
          End-to-end private · Cancel anytime
        </div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm">
          <Link to="/" className="md:hidden flex items-center gap-2 mb-8">
            <div className="size-8 rounded-xl bg-primary grid place-items-center">
              <div className="size-2.5 rounded-full bg-primary-foreground" />
            </div>
            <span className="font-bold">ReflectAI</span>
          </Link>

          <h1 className="font-serif italic text-3xl">
            {mode === "signin" ? "Welcome back." : "Begin your practice."}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to continue your reflection."
              : "Create an account in less than a minute."}
          </p>

          <button
            onClick={handleGoogle}
            disabled={busy}
            className="mt-8 w-full h-11 rounded-full bg-card border border-border font-semibold text-sm flex items-center justify-center gap-3 hover:bg-muted disabled:opacity-60"
          >
            <GoogleG />
            Continue with Google
          </button>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-border" />
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">or</div>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" ? (
              <Field
                label="Name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={setName}
              />
            ) : null}
            <Field
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={setEmail}
              required
            />
            <Field
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={setPassword}
              required
            />
            <button
              type="submit"
              disabled={busy}
              className="w-full h-11 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-soft hover:opacity-95 disabled:opacity-60"
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-primary font-semibold"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </div>

          <div className="mt-10 text-center text-[11px] text-muted-foreground">
            By continuing you agree to our{" "}
            <a className="underline" href="#">
              Terms
            </a>{" "}
            and{" "}
            <a className="underline" href="#">
              Privacy
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
function Field({ label, type, placeholder, value, onChange, required }) {
  return (
    <label className="block">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">
        {label}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={cn(
          "w-full h-11 rounded-xl border border-input bg-card px-4 text-sm",
          "outline-none focus:ring-2 focus:ring-ring/40 focus:border-ring",
        )}
      />
    </label>
  );
}
function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="size-4">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35.5 24 35.5c-6.3 0-11.5-5.2-11.5-11.5S17.7 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.3 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5c10.7 0 19.5-7.7 19.5-19.5 0-1.2-.1-2.4-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12.5 24 12.5c2.9 0 5.6 1.1 7.6 2.9l5.7-5.7C33.7 6.3 29.1 4.5 24 4.5 16.5 4.5 10 8.7 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 43.5c5 0 9.6-1.9 13.1-5l-6-5.1c-2 1.5-4.5 2.4-7.1 2.4-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.8 39.2 16.4 43.5 24 43.5z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.3 4.1-4.2 5.4l6 5.1c-.4.4 6.4-4.7 6.4-14.5 0-1.2-.1-2.4-.4-3.5z"
      />
    </svg>
  );
}
