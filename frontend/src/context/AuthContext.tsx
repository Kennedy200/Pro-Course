"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  getToken,
  getUser,
  setToken as saveToken,
  setUser as saveUser,
  clearAuth,
  AuthUser,
  getDashboardRoute,
} from "@/lib/auth";
import { authApi } from "@/lib/api";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: {
    full_name: string;
    email: string;
    password: string;
    role: string;
    matric_number?: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isLoggingIn = useRef(false); // Prevent duplicate login calls

  // Rehydrate on mount
  useEffect(() => {
    const savedToken = getToken();
    const savedUser  = getUser();
    if (savedToken && savedUser) {
      setTokenState(savedToken);
      setUserState(savedUser);
    }
    setLoading(false);
  }, []);

  // ── Login ──────────────────────────────────────────
  async function login(email: string, password: string) {
    if (isLoggingIn.current) {
      console.log("⚠️ Login already in progress, skipping duplicate call");
      return;
    }

    isLoggingIn.current = true;
    console.log("🔐 LOGIN CALLED WITH:", { email, password });
    
    try {
      const res = await authApi.login(email, password);
      console.log("✅ LOGIN RESPONSE:", res);

      const user: AuthUser = {
        full_name: res.full_name,
        email,
        role: res.role as AuthUser["role"],
      };

      saveToken(res.access_token);
      saveUser(user);
      setTokenState(res.access_token);
      setUserState(user);

      console.log("🚀 REDIRECTING TO:", getDashboardRoute(res.role));
      router.push(getDashboardRoute(res.role));
    } finally {
      // Reset after a delay to allow navigation
      setTimeout(() => {
        isLoggingIn.current = false;
      }, 1000);
    }
  }

  // ── Register ───────────────────────────────────────
  async function register(payload: {
    full_name: string;
    email: string;
    password: string;
    role: string;
    matric_number?: string;
  }) {
    console.log("📝 REGISTER CALLED");
    await authApi.register(payload);
    // Auto-login after register
    console.log("🔄 AUTO-LOGIN AFTER REGISTER");
    await login(payload.email, payload.password);
  }

  // ── Logout ─────────────────────────────────────────
  function logout() {
    console.log("👋 LOGOUT CALLED");
    clearAuth();
    setTokenState(null);
    setUserState(null);
    isLoggingIn.current = false;
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}