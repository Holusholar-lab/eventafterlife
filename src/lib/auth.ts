import { supabase } from "./supabase";

export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string; // In production, this should be hashed
  newsletter: boolean;
  createdAt: number;
}

const STORAGE_KEY = "afterlife_users";
const SESSION_KEY = "afterlife_session";

/**
 * Sign up - Uses Supabase for cross-device sync when available
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
      const passwordHash = btoa(password); // Simple encoding (use proper hashing in production)

      const { error } = await supabase.from("users").insert({
        id: userId,
        full_name: fullName,
        email: email.toLowerCase(),
        password_hash: passwordHash,
        newsletter,
        created_at: now,
        updated_at: now,
      });

      if (!error) {
        await createSupabaseSession(userId);
        // Also save to localStorage for backward compatibility
        saveUserToLocalStorage({ id: userId, fullName, email: email.toLowerCase(), password, newsletter, createdAt: now });
        return { success: true };
      }
      
      if (error.code === "23505") {
        return { success: false, error: "Email already registered" };
      }
    } catch (error) {
      console.warn("Supabase signup failed, using localStorage:", error);
    }
  }

  // Fallback to localStorage
  try {
    const users = getUsers();
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
 * Login - Uses Supabase for cross-device sync when available
 */
export async function login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
  // Try Supabase first
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email.toLowerCase())
        .single();

      if (!error && data && btoa(password) === data.password_hash) {
        await createSupabaseSession(data.id);
        const user: User = {
          id: data.id,
          fullName: data.full_name,
          email: data.email,
          password: "",
          newsletter: data.newsletter,
          createdAt: data.created_at,
        };
        // So getCurrentUser() can find the user (it reads from localStorage)
        saveUserToLocalStorage(user);
        return { success: true, user };
      }
    } catch (error) {
      console.warn("Supabase login error, trying localStorage:", error);
    }
  }

  // Fallback to localStorage
  try {
    const users = getUsers();
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
 * Logout - Clears Supabase session and localStorage
 */
export async function logout(): Promise<void> {
  const token = localStorage.getItem(SESSION_KEY);
  if (token && supabase && token.includes("_")) {
    try {
      await supabase.from("user_sessions").delete().eq("token", token);
    } catch (error) {
      console.warn("Supabase logout error:", error);
    }
  }
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(`${SESSION_KEY}_userid`);
}

/**
 * Get current user - Checks Supabase session first, falls back to localStorage
 * Synchronous version for backward compatibility (checks localStorage only)
 */
export function getCurrentUser(): User | null {
  try {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;

    const users = getUsers();
    
    // First try exact match (for localStorage sessions)
    let user = users.find((u) => u.id === sessionId) || null;
    
    // If not found, try to get userId from stored mapping (for Supabase sessions)
    if (!user) {
      const storedUserId = localStorage.getItem(`${SESSION_KEY}_userid`);
      if (storedUserId) {
        user = users.find((u) => u.id === storedUserId) || null;
      }
    }
    
    // If still not found and sessionId looks like Supabase token (userId_timestamp_random)
    if (!user && sessionId.includes("_")) {
      // Try to extract userId from token format: userId_timestamp_random
      // The timestamp is always numeric and 13 digits (milliseconds since epoch)
      const parts = sessionId.split("_");
      
      // Strategy 1: If we have at least 3 parts and second-to-last is numeric (timestamp)
      if (parts.length >= 3) {
        // Check if second-to-last part is a timestamp (10-13 digits)
        const secondToLast = parts[parts.length - 2];
        if (/^\d{10,13}$/.test(secondToLast)) {
          // userId is everything before the timestamp
          const userId = parts.slice(0, -2).join("_");
          user = users.find((u) => u.id === userId) || null;
          // Store the mapping for future lookups
          if (user) {
            localStorage.setItem(`${SESSION_KEY}_userid`, userId);
          }
        }
      }
      
      // Strategy 2: If still not found, try to match by checking if any user's id is a prefix
      if (!user) {
        // Try each user's id as a prefix of the sessionId
        for (const u of users) {
          if (sessionId.startsWith(u.id + "_")) {
            user = u;
            localStorage.setItem(`${SESSION_KEY}_userid`, u.id);
            break;
          }
        }
      }
    }

    // Verify Supabase session is still valid (async, don't wait)
    if (user && supabase && sessionId.includes("_")) {
      verifySupabaseSession(sessionId).catch(() => {});
    }
    
    return user;
  } catch (error) {
    console.warn("getCurrentUser error:", error);
    return null;
  }
}

/**
 * Get current user async - Checks Supabase session first for cross-device sync
 */
export async function getCurrentUserAsync(): Promise<User | null> {
  // Try Supabase session first
  if (supabase) {
    try {
      const token = localStorage.getItem(SESSION_KEY);
      if (token && token.includes("_")) {
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
      // Fall through to localStorage
    }
  }

  // Fallback to localStorage
  try {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;

    const users = getUsers();
    return users.find((u) => u.id === sessionId) || null;
  } catch {
    return null;
  }
}

/**
 * Check if authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

/**
 * Get all users for admin - From Supabase if available, else localStorage
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
      console.warn("Supabase getAllUsers error:", error);
    }
  }

  // Fallback to localStorage
  return getUsers();
}

// Helper functions
function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function setSession(userId: string): void {
  localStorage.setItem(SESSION_KEY, userId);
}

function saveUserToLocalStorage(user: User): void {
  try {
    const users = getUsers();
    const existingIndex = users.findIndex((u) => u.id === user.id);
    if (existingIndex >= 0) {
      // Update existing user
      users[existingIndex] = user;
    } else {
      // Add new user
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.warn("Failed to save user to localStorage:", error);
  }
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
    // Also store userId mapping for easier lookup
    localStorage.setItem(`${SESSION_KEY}_userid`, userId);
  } catch (error) {
    console.warn("Failed to create Supabase session:", error);
    localStorage.setItem(SESSION_KEY, userId);
    localStorage.setItem(`${SESSION_KEY}_userid`, userId);
  }
}

async function verifySupabaseSession(sessionId: string): Promise<void> {
  if (!supabase || !sessionId.includes("_")) return;
  
  try {
    const { data } = await supabase
      .from("user_sessions")
      .select("expires_at")
      .eq("token", sessionId)
      .single();
    
    if (!data || data.expires_at < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch (error) {
    // Session doesn't exist or expired
    localStorage.removeItem(SESSION_KEY);
  }
}
