/**
 * Supabase-based authentication for cross-device sync
 * This allows users to log in on any device and see their data everywhere
 */

import { supabase } from "./supabase";

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string; // In production, this should be hashed
  newsletter: boolean;
  createdAt: number;
}

const SESSION_KEY = "afterlife_session_token";

// Simple password hashing (use bcrypt in production)
function hashPassword(password: string): string {
  // For now, just return as-is. In production, use bcrypt or similar
  return btoa(password); // Base64 encoding (NOT secure, just for demo)
}

function verifyPassword(password: string, hash: string): boolean {
  return btoa(password) === hash;
}

/**
 * Sign up a new user (stores in Supabase for cross-device sync)
 */
export async function signUp(
  fullName: string,
  email: string,
  password: string,
  newsletter: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) {
      // Fallback to localStorage if Supabase not configured
      return { success: false, error: "Supabase not configured" };
    }

    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const passwordHash = hashPassword(password);

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
        // Unique constraint violation (email already exists)
        return { success: false, error: "Email already registered" };
      }
      return { success: false, error: error.message || "Failed to create account" };
    }

    // Create session
    await createSession(userId);
    
    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

/**
 * Login user (checks Supabase, creates session)
 */
export async function login(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    if (!supabase) {
      return { success: false, error: "Supabase not configured" };
    }

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email.toLowerCase())
      .single();

    if (error || !data) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    if (!verifyPassword(password, data.password_hash)) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create session
    await createSession(data.id);

    // Return user (without password hash)
    const user: User = {
      id: data.id,
      fullName: data.full_name,
      email: data.email,
      password: "", // Don't return password
      newsletter: data.newsletter,
      createdAt: data.created_at,
    };

    return { success: true, user };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to login" };
  }
}

/**
 * Logout user (removes session)
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem(SESSION_KEY);
  if (token && supabase) {
    try {
      await supabase.from("user_sessions").delete().eq("token", token);
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  localStorage.removeItem(SESSION_KEY);
}

/**
 * Get current logged-in user (from Supabase session)
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token || !supabase) return null;

    // Verify session exists and is valid
    const { data: session } = await supabase
      .from("user_sessions")
      .select("user_id, expires_at")
      .eq("token", token)
      .single();

    if (!session || session.expires_at < Date.now()) {
      // Session expired
      localStorage.removeItem(SESSION_KEY);
      return null;
    }

    // Get user data
    const { data: userData } = await supabase
      .from("users")
      .select("*")
      .eq("id", session.user_id)
      .single();

    if (!userData) return null;

    return {
      id: userData.id,
      fullName: userData.full_name,
      email: userData.email,
      password: "",
      newsletter: userData.newsletter,
      createdAt: userData.created_at,
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Get all users for admin panel (from Supabase)
 */
export async function getAllUsersForAdmin(): Promise<User[]> {
  try {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error || !data) return [];

    return data.map((u) => ({
      id: u.id,
      fullName: u.full_name,
      email: u.email,
      password: "",
      newsletter: u.newsletter,
      createdAt: u.created_at,
    }));
  } catch (error) {
    console.error("Get all users error:", error);
    return [];
  }
}

/**
 * Create a session token for cross-device sync
 */
async function createSession(userId: string): Promise<void> {
  if (!supabase) {
    // Fallback to localStorage
    localStorage.setItem(SESSION_KEY, userId);
    return;
  }

  const token = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days

  await supabase.from("user_sessions").insert({
    user_id: userId,
    token,
    expires_at: expiresAt,
    created_at: Date.now(),
  });

  localStorage.setItem(SESSION_KEY, token);
}
