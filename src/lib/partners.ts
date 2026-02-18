import { supabase } from "./supabase";

export interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl?: string;
  description?: string;
  order: number; // For sorting/ordering partners
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = "afterlife_partners";
let _cache: Partner[] | null = null;
let _loadError: string | null = null;

/**
 * Get all active partners - from Supabase if available, else localStorage
 */
export async function getAllPartners(): Promise<Partner[]> {
  await ensurePartnersLoaded();
  return (_cache || []).filter(p => p.isActive).sort((a, b) => a.order - b.order);
}

/**
 * Get all partners (including inactive) - for admin
 */
export async function getAllPartnersForAdmin(): Promise<Partner[]> {
  await ensurePartnersLoaded();
  return _cache || [];
}

/**
 * Get partners synchronously from cache
 */
export function getPartners(): Partner[] {
  if (_cache) return _cache.filter(p => p.isActive).sort((a, b) => a.order - b.order);
  
  // Fallback to localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const partners = JSON.parse(stored);
      return partners.filter((p: Partner) => p.isActive).sort((a: Partner, b: Partner) => a.order - b.order);
    }
  } catch (error) {
    console.warn("Failed to load partners from localStorage:", error);
  }
  
  return [];
}

/**
 * Ensure partners are loaded from Supabase
 */
async function ensurePartnersLoaded(): Promise<void> {
  if (_cache !== null) return;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("order", { ascending: true });

      if (!error && data) {
        _cache = data.map((row) => ({
          id: row.id,
          name: row.name,
          logoUrl: row.logo_url,
          websiteUrl: row.website_url || undefined,
          description: row.description || undefined,
          order: row.order || 0,
          isActive: row.is_active !== false,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));
        // Cache in localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(_cache));
        _loadError = null;
        return;
      }
      
      if (error && (error.code === "PGRST116" || error.message?.includes("404") || error.code === "42P01")) {
        // Table doesn't exist, use empty array
        console.warn("partners table not found, using empty list");
        _cache = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        _loadError = null;
        return;
      }
      
      _loadError = error?.message || "Failed to load partners";
    } catch (error: any) {
      if (error?.code === "PGRST116" || error?.message?.includes("404") || error?.status === 404) {
        // Table doesn't exist, use empty array
        _cache = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        _loadError = null;
        return;
      }
      console.warn("Supabase partners load error:", error);
      _loadError = error?.message || "Failed to load partners";
    }
  }

  // Fallback to localStorage or empty
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      _cache = JSON.parse(stored);
    } else {
      _cache = [];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  } catch (error) {
    console.warn("Failed to load partners from localStorage:", error);
    _cache = [];
  }
}

/**
 * Create a new partner
 */
export async function createPartner(
  name: string,
  logoUrl: string,
  websiteUrl?: string,
  description?: string,
  order?: number
): Promise<Partner> {
  const partners = await getAllPartnersForAdmin();
  const maxOrder = partners.length > 0 ? Math.max(...partners.map(p => p.order)) : 0;
  
  const partner: Partner = {
    id: `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    logoUrl: logoUrl.trim(),
    websiteUrl: websiteUrl?.trim(),
    description: description?.trim(),
    order: order !== undefined ? order : maxOrder + 1,
    isActive: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  if (supabase) {
    try {
      const { error } = await supabase.from("partners").insert({
        id: partner.id,
        name: partner.name,
        logo_url: partner.logoUrl,
        website_url: partner.websiteUrl || null,
        description: partner.description || null,
        order: partner.order,
        is_active: partner.isActive,
        created_at: partner.createdAt,
        updated_at: partner.updatedAt,
      });

      if (error && !(error.code === "PGRST116" || error.message?.includes("404") || error.code === "42P01")) {
        throw new Error(error.message || "Failed to create partner");
      }
    } catch (error: any) {
      if (!(error?.code === "PGRST116" || error?.message?.includes("404") || error?.status === 404)) {
        console.warn("Failed to create partner in Supabase:", error);
      }
    }
  }

  // Save to localStorage
  const allPartners = await getAllPartnersForAdmin();
  allPartners.push(partner);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allPartners));
  _cache = allPartners;

  return partner;
}

/**
 * Update a partner
 */
export async function updatePartner(
  id: string,
  updates: Partial<Pick<Partner, "name" | "logoUrl" | "websiteUrl" | "description" | "order" | "isActive">>
): Promise<void> {
  const partners = await getAllPartnersForAdmin();
  const index = partners.findIndex((p) => p.id === id);
  
  if (index === -1) {
    throw new Error("Partner not found");
  }

  partners[index] = {
    ...partners[index],
    ...updates,
    updatedAt: Date.now(),
  };

  if (supabase) {
    try {
      const { error } = await supabase
        .from("partners")
        .update({
          name: partners[index].name,
          logo_url: partners[index].logoUrl,
          website_url: partners[index].websiteUrl || null,
          description: partners[index].description || null,
          order: partners[index].order,
          is_active: partners[index].isActive,
          updated_at: partners[index].updatedAt,
        })
        .eq("id", id);

      if (error && !(error.code === "PGRST116" || error.message?.includes("404") || error.code === "42P01")) {
        throw new Error(error.message || "Failed to update partner");
      }
    } catch (error: any) {
      if (!(error?.code === "PGRST116" || error?.message?.includes("404") || error?.status === 404)) {
        console.warn("Failed to update partner in Supabase:", error);
      }
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(partners));
  _cache = partners;
}

/**
 * Delete a partner
 */
export async function deletePartner(id: string): Promise<void> {
  const partners = await getAllPartnersForAdmin();
  const filtered = partners.filter((p) => p.id !== id);
  
  if (filtered.length === partners.length) {
    throw new Error("Partner not found");
  }

  if (supabase) {
    try {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error && !(error.code === "PGRST116" || error.message?.includes("404") || error.code === "42P01")) {
        throw new Error(error.message || "Failed to delete partner");
      }
    } catch (error: any) {
      if (!(error?.code === "PGRST116" || error?.message?.includes("404") || error?.status === 404)) {
        console.warn("Failed to delete partner from Supabase:", error);
      }
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  _cache = filtered;
}

/**
 * Refetch partners from Supabase
 */
export async function refetchPartners(): Promise<void> {
  _cache = null;
  _loadError = null;
  await ensurePartnersLoaded();
}
