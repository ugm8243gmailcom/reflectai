import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
const Ctx = createContext({ session: null, user: null, loading: true });
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return (
    <Ctx.Provider value={{ session, user: session?.user ?? null, loading }}>
      {children}
    </Ctx.Provider>
  );
}
export function useAuth() {
  return useContext(Ctx);
}
