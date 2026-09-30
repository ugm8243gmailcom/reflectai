import { createContext, useContext } from "react";

const MOCK_USER = {
  id: "local-user",
  email: "user@reflectai.app",
  user_metadata: { name: "You" },
};

const Ctx = createContext({
  session: { user: MOCK_USER },
  user: MOCK_USER,
  loading: false,
});

export function AuthProvider({ children }) {
  return (
    <Ctx.Provider value={{ session: { user: MOCK_USER }, user: MOCK_USER, loading: false }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  return useContext(Ctx);
}

