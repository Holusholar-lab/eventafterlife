/**
 * Hybrid authentication: Uses Supabase when available for cross-device sync,
 * falls back to localStorage when Supabase is not configured
 */

import { supabase } from "./supabase";

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  newsletter: boolean;
  createdAt: number;
}

const STORAGE_KEY = "afterlife_users";
const SESSION_KEY = "afterlife_session";

/**
 * Sign up - tries Supabase first, falls back to localStorage
 */
export async function signUp(
  fullName: string,
  email: string,
  password: string,
  newsletter: boolean
): Promise<{ success: boolean; error?: string }> {
  // Try Supabase first (for cross-device sync)
  if (supabase) {
    try {
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const now = Date.now();
      // Simple password encoding (use proper hashing in production)
      const passwordHash = btoa(password);

      const { error } = await supabase.from("users").insert({
        id: userId,
        full_name: fullName,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        newsletter,
        created_at: now,
        updated_at: now,
      });

      if (error) {
        if (error.code === "23505") {
          return { success: false, error: "Email already registered" };
        }
        // If Supabase fails, fall back to localStorage
        console.warn("Supabase signup failed, using localStorage:", error);
      } else {
        // Success in Supabase - create session
        await createSupabaseSession(userId);
        return { success: true };
      }
    } catch (error) {
      console.warn("Supabase signup error, falling back to localStorage:", error);
    }
  }

  // Fallback to localStorage
  try {
    const users = getUsersFromStorage();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already registered" };
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fullName,
      email: email.toLowerCase(),
      password,
      newsletter,
      createdAt: Date.now(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    setSession(newUser.id);
    
    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

/**
 * Login - tries Supabase first, falls back to localStorage
 */
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();

      if (!error && data) {
        // Verify password
        if (btoa(password) === data.password_hash) {
          await createSupabaseSession(data.id);
          return {
            success: true,
            user: {
              id: data.id,
              fullName: data.full_name,
              email: data.email,
              password: "",
              newsletter: data.newsletter,
              createdAt: data.created_at,
            },
          };
        }
      }
    } catch (error) {
      console.warn("Supabase login error, trying localStorage:", error);
    }
  }

  // Fallback to localStorage
  try {
    const users = getUsersFromStorage();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    setSession(user.id);
    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to login" };
  }
}

/**
 * Get current user - tries Supabase session first, falls back to localStorage
 */
export async function getCurrentUser(): Promise<User | null> {
  // Try Supabase session first
  if (supabase) {
    try {
      const token = localStorage.getItem(SESSION_KEY);
      if (token && token.includes("_")) {
        // Supabase session token format
        const { data: session } = await supabase
          .from("user_sessions")
          .select("user_id, expires_at")
          .eq("token", token)
          .single();

        if (session && session.expires_at > Date.now()) {
          const { data: userData } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user_id)
            .single();

          if (userData) {
            return {
              id: userData.id,
              fullName: userData.full_name,
              email: userData.email,
              password: "",
              newsletter: userData.newsletter,
              createdAt: userData.created_at,
            };
          }
        }
      }
    } catch (error) {
      console.warn("Supabase getCurrentUser error, trying localStorage:", error);
    }
  }

  // Fallback to localStorage
  try {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;

    const users = getUsersFromStorage();
    return users.find((u) => u.id === sessionId) || null;
  } catch {
    return null;
  }
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem(SESSION_KEY);
  if (token && supabase) {
    try {
      await supabase.from("user_sessions").delete().eq("token", token);
    } catch (error) {
      console.warn("Supabase logout error:", error);
    }
  }
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Check if authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Get all users for admin (from Supabase if available, else localStorage)
 */
export async function getAllUsersForAdmin(): Promise<User[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((u) => ({
          id: u.id,
          fullName: u.full_name,
          email: u.email,
          password: "",
          newsletter: u.newsletter,
          createdAt: u.created_at,
        }));
      }
    } catch (error) {
      console.warn("Supabase getAllUsers error, using localStorage:", error);
    }
  }

  // Fallback to localStorage
  return getUsersFromStorage();
}

// Helper functions
function getUsersFromStorage(): User[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

async function createSupabaseSession(userId: string): Promise<void> {
  if (!supabase) return;

  const token = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  try {
    await supabase.from("user_sessions").insert({
      user_id: userId,
      token,
      expires_at: expiresAt,
      created_at: Date.now(),
    });
    localStorage.setItem(SESSION_KEY, token);
  } catch (error) {
    console.warn("Failed to create Supabase session, using localStorage:", error);
    localStorage.setItem(SESSION_KEY, userId);
  }
}
