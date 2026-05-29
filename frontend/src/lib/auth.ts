import Cookies from "js-cookie";

const TOKEN_KEY = "procourse_token";
const USER_KEY  = "procourse_user";

export type AuthUser = {
  id?: number;
  full_name: string;
  email: string;
  role: "student" | "lecturer" | "admin";
};

// ── Token ─────────────────────────────────────────────
export function setToken(token: string) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    sameSite: "strict",
  });
}

export function getToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function removeToken() {
  Cookies.remove(TOKEN_KEY);
}

// ── User ──────────────────────────────────────────────
export function setUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function removeUser() {
  localStorage.removeItem(USER_KEY);
}

// ── Clear all ─────────────────────────────────────────
export function clearAuth() {
  removeToken();
  removeUser();
}

// ── Role-based redirect ───────────────────────────────
export function getDashboardRoute(role: string): string {
  switch (role) {
    case "lecturer": return "/lecturer/dashboard";
    case "admin":    return "/admin/dashboard";
    default:         return "/student/dashboard";
  }
}