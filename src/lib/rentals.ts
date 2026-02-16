export interface Rental {
  videoId: string;
  plan: "24" | "48" | "72";
  rentedAt: number; // timestamp ms
  expiresAt: number; // timestamp ms
}

const STORAGE_KEY = "afterlife_rentals";

export const PLANS = [
  { hours: "24", price: "$2.99", label: "Quick Watch" },
  { hours: "48", price: "$4.99", label: "Standard" },
  { hours: "72", price: "$6.99", label: "Extended" },
] as const;

function getRentals(): Rental[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRentals(rentals: Rental[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rentals));
}

export function getActiveRental(videoId: string): Rental | null {
  const rental = getRentals().find(
    (r) => r.videoId === videoId && r.expiresAt > Date.now()
  );
  return rental || null;
}

export function createRental(videoId: string, plan: "24" | "48" | "72"): Rental {
  const now = Date.now();
  const hours = parseInt(plan);
  const rental: Rental = {
    videoId,
    plan,
    rentedAt: now,
    expiresAt: now + hours * 60 * 60 * 1000,
  };
  const rentals = getRentals().filter(
    (r) => !(r.videoId === videoId && r.expiresAt <= Date.now())
  );
  rentals.push(rental);
  saveRentals(rentals);
  return rental;
}
