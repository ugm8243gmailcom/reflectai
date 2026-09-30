import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { Bell, Lock, User, Crown, Download, Trash, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
export const Route = createFileRoute("/app/settings")({
  component: Settings,
});
function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      return data;
    },
  });
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <div>
      <PageHeader eyebrow="Settings" title="Tune the practice." />

      <div className="space-y-4">
        <Section icon={<User className="size-4" />} title="Profile">
          <Field label="Name" value={profile?.display_name ?? ""} />
          <Field label="Email" value={user?.email ?? ""} />
        </Section>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl border border-border bg-card text-sm font-semibold text-foreground hover:bg-muted"
        >
          <LogOut className="size-4" /> Sign out
        </button>

        <Section icon={<Bell className="size-4" />} title="Notifications">
          <Toggle label="Daily journaling reminder" defaultOn />
          <Toggle label="Habit check-in nudge" defaultOn />
          <Toggle label="Weekly reflection ready" defaultOn />
          <Toggle label="Monthly summary email" />
        </Section>

        <Section icon={<Lock className="size-4" />} title="Privacy & Security">
          <Toggle label="App lock with PIN" />
          <Toggle label="Biometric unlock" />
          <Toggle label="End-to-end encrypted backups" defaultOn />
          <button className="text-sm text-primary font-semibold mt-2">Manage recovery key</button>
        </Section>

        <Section icon={<Crown className="size-4" />} title="Plan">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/15">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Growth
              </div>
              <div className="font-serif italic text-xl">$9 / month</div>
            </div>
            <button className="text-xs font-semibold text-primary">Manage</button>
          </div>
        </Section>

        <Section icon={<Download className="size-4" />} title="Data">
          <button className="text-sm font-semibold text-foreground hover:text-primary text-left">
            Export all entries as PDF
          </button>
          <button className="text-sm font-semibold text-foreground hover:text-primary text-left">
            Export as Markdown archive
          </button>
          <button className="text-sm font-semibold text-destructive hover:opacity-80 text-left flex items-center gap-2">
            <Trash className="size-4" /> Delete account &amp; all data
          </button>
        </Section>

        <div className="pt-6">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Sign out
          </Link>
        </div>
      </div>
    </div>
  );
}
function Section({ icon, title, children }) {
  return (
    <div className="rounded-3xl bg-card border border-border p-6">
      <div className="flex items-center gap-2 text-primary mb-5">
        {icon}
        <div className="font-bold text-foreground">{title}</div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Field({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 border-b border-border last:border-0">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-sm font-semibold">{value}</div>
    </div>
  );
}
function Toggle({ label, defaultOn }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center justify-between py-2">
      <div className="text-sm">{label}</div>
      <button
        onClick={() => setOn(!on)}
        className={cn(
          "h-6 w-11 rounded-full p-0.5 transition-colors",
          on ? "bg-primary" : "bg-muted",
        )}
      >
        <div
          className={cn(
            "size-5 rounded-full bg-card shadow-sm transition-transform",
            on && "translate-x-5",
          )}
        />
      </button>
    </div>
  );
}
