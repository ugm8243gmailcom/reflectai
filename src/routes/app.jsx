import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-context";
export const Route = createFileRoute("/app")({
  ssr: false,
  component: AppLayout,
});
function AppLayout() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !session) navigate({ to: "/auth", replace: true });
  }, [session, loading, navigate]);
  if (loading || !session) {
    return (
      <div className="min-h-screen grid place-items-center bg-surface">
        <div className="text-sm text-muted-foreground">Loading your journal…</div>
      </div>
    );
  }
  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
