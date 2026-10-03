import { useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Login from "../components/Login";
import { AuthModalContext, type AuthMode } from "./authModalContext";

export default function AuthModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setMode] = useState<AuthMode | null>(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const value = useMemo(
    () => ({ openAuth: setMode, closeAuth: () => setMode(null) }),
    [],
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      <Login
        mode={mode}
        onModeChange={setMode}
        onClose={() => setMode(null)}
        onAuthenticated={() => {
          setMode(null);
          // On the VS Code sign-in page, stay there to finish connecting.
          if (pathname !== "/auth") navigate("/dashboard");
        }}
      />
    </AuthModalContext.Provider>
  );
}
