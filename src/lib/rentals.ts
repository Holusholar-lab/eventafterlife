import { supabase } from "./supabase";
import { getCurrentUser } from "./auth";

export interface Rental {
  videoId: string;
  plan: "24" | "48" | "72";
  rentedAt: number;
  expiresAt: number;
}

const STORAGE_KEY = "afterlife_rentals";

export const PLANS = [
  { hours: "24", price: "$2.99", label: "Quick Watch" },
  { hours: "48", price: "$4.99", label: "Standard" },
  { hours: "72", price: "$6.99", label: "Extended" },
] as const;

let _cache: Rental[] | null = null;

function getFromStorage(): Rental[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveToStorage(rentals: Rental[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
}

/** Call after login or on app load so getActiveRental has data when using Supabase. */
export async function ensureRentalsLoaded(): Promise<void> {
  if (supabase) {
    const user = getCurrentUser();
    if (!user) {
      _cache = [];
      return;
    }
    const { data, error } = await supabase
      .from("rentals")
      .select("video_id, plan, rented_at, expires_at")
      .eq("user_id", user.id)
      .gt("expires_at", Date.now());
    if (error) {
      console.error("Supabase rentals fetch error:", error);
      _cache = getFromStorage();
      return;
    }
    _cache = (data || []).map((r: { video_id: string; plan: string; rented_at: number; expires_at: number }) => ({
      videoId: r.video_id,
      plan: r.plan as "24" | "48" | "72",
      rentedAt: r.rented_at,
      expiresAt: r.expires_at,
    }));
    return;
  }
  _cache = getFromStorage();
}

export function getRentals(): Rental[] {
  if (_cache) return _cache;
  return getFromStorage();
}

export function getActiveRental(videoId: string): Rental | null {
  const r = getRentals().find((x) => x.videoId === videoId && x.expiresAt > Date.now());
  return r || null;
}

export async function createRental(videoId: string, plan: "24" | "48" | "72"): Promise<Rental> {
  const now = Date.now();
  const hours = parseInt(plan);
  const rental: Rental = {
    videoId,
    plan,
    rentedAt: now,
    expiresAt: now + hours * 60 * 60 * 1000,
  };

  if (supabase) {
    const user = getCurrentUser();
    const { error } = await supabase.from("rentals").insert({
      video_id: videoId,
      user_id: user?.id ?? null,
      plan,
      rented_at: now,
      expires_at: rental.expiresAt,
      price_paid: 0,
    });
    if (error) throw error;
    _cache = _cache ? [..._cache, rental] : [rental];
    return rental;
  }

  const rentals = getRentals().filter((r) => !(r.videoId === videoId && r.expiresAt <= Date.now()));
  rentals.push(rental);
  saveToStorage(rentals);
  _cache = rentals;
  return rental;
}
