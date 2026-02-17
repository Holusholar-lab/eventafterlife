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

export function signUp(
  fullName: string,
  email: string,
  password: string,
  newsletter: boolean
): { success: boolean; error?: string } {
  try {
    const users = getUsers();
    
    // Check if email already exists
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: "Email already registered" };
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      fullName,
      email: email.toLowerCase(),
      password, // In production, hash this password
      newsletter,
      createdAt: Date.now(),
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    
    // Auto-login after signup
    setSession(newUser.id);
    
    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export function login(email: string, password: string): { success: boolean; error?: string; user?: User } {
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

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): User | null {
  try {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) return null;

    const users = getUsers();
    return users.find((u) => u.id === sessionId) || null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

/** For admin panel only: returns all registered users. */
export function getAllUsersForAdmin(): User[] {
  return getUsers();
}

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
