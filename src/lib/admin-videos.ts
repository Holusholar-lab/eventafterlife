import { supabase, isSupabaseConfigured } from "./supabase";

export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  duration: string;
  price24h: number;
  price48h: number;
  price72h: number;
  isPublic: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  views: number;
  rentals: number;
  revenue: number;
}

const STORAGE_KEY = "admin_videos";

type Row = {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  category: string;
  duration: string;
  price_24h: number;
  price_48h: number;
  price_72h: number;
  is_public: boolean;
  is_active: boolean;
  created_at: number;
  updated_at: number;
  views: number;
  rentals: number;
  revenue: number;
};

function rowToVideo(r: Row): AdminVideo {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    videoUrl: r.video_url,
    thumbnailUrl: r.thumbnail_url,
    category: r.category,
    duration: r.duration,
    price24h: Number(r.price_24h),
    price48h: Number(r.price_48h),
    price72h: Number(r.price_72h),
    isPublic: r.is_public,
    isActive: r.is_active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    views: r.views ?? 0,
    rentals: r.rentals ?? 0,
    revenue: Number(r.revenue ?? 0),
  };
}

function videoToRow(v: Partial<AdminVideo>): Partial<Row> {
  const row: Partial<Row> = {};
  if (v.title !== undefined) row.title = v.title;
  if (v.description !== undefined) row.description = v.description;
  if (v.videoUrl !== undefined) row.video_url = v.videoUrl;
  if (v.thumbnailUrl !== undefined) row.thumbnail_url = v.thumbnailUrl;
  if (v.category !== undefined) row.category = v.category;
  if (v.duration !== undefined) row.duration = v.duration;
  if (v.price24h !== undefined) row.price_24h = v.price24h;
  if (v.price48h !== undefined) row.price_48h = v.price48h;
  if (v.price72h !== undefined) row.price_72h = v.price72h;
  if (v.isPublic !== undefined) row.is_public = v.isPublic;
  if (v.isActive !== undefined) row.is_active = v.isActive;
  if (v.createdAt !== undefined) row.created_at = v.createdAt;
  if (v.updatedAt !== undefined) row.updated_at = v.updatedAt;
  if (v.views !== undefined) row.views = v.views;
  if (v.rentals !== undefined) row.rentals = v.rentals;
  if (v.revenue !== undefined) row.revenue = v.revenue;
  return row;
}

let _cache: AdminVideo[] | null = null;
/** Set when Supabase is configured but fetch failed (so we don't show device-specific localStorage). */
let _loadError: string | null = null;

function getFromStorage(): AdminVideo[] {
  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing);
  } catch {}
  return [];
}

function saveToStorage(videos: AdminVideo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

function initializeFromStorage(): AdminVideo[] {
  const existing = getFromStorage();
  if (existing.length > 0) return existing;
  try {
    const { videos } = require("@/data/content");
    if (videos?.length > 0) {
      const migrated: AdminVideo[] = videos.map((v: any, i: number) => {
        const priceMatch = v.price?.match(/\$([\d.]+)/);
        const p = priceMatch ? parseFloat(priceMatch[1]) : 4.99;
        return {
          id: v.id || `migrated-${i}`,
          title: v.title,
          description: v.description,
          videoUrl: typeof v.image === "string" ? v.image : "",
          thumbnailUrl: typeof v.image === "string" ? v.image : "",
          category: v.category,
          duration: v.duration,
          price24h: p * 0.6,
          price48h: p,
          price72h: p * 1.4,
          isPublic: true,
          isActive: true,
          createdAt: Date.now() - (videos.length - i) * 86400000,
          updatedAt: Date.now(),
          views: 0,
          rentals: 0,
          revenue: 0,
        };
      });
      saveToStorage(migrated);
      return migrated;
    }
  } catch (e) {
    console.error("Migration error:", e);
  }
  return [];
}

/** Call once on app load when using Supabase so getAllAdminVideos() has data. */
export async function ensureAdminVideosLoaded(): Promise<void> {
  _loadError = null;
  if (supabase) {
    const { data, error } = await supabase
      .from("admin_videos")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Supabase admin_videos fetch error:", error);
      _loadError = error.message || "Failed to load videos from server";
      _cache = []; // Don't fall back to localStorage – keep all devices in sync with server only
      return;
    }
    _cache = (data as Row[]).map(rowToVideo);
    return;
  }
  _cache = initializeFromStorage();
}

/** True when Supabase was used but the fetch failed (so you see 0 videos, not device-local data). */
export function getVideosLoadError(): string | null {
  return _loadError;
}

/**
 * Refetch videos from Supabase so the public library shows the latest uploads.
 * Call this periodically or after admin changes so all users see updates.
 */
export async function refetchAdminVideos(): Promise<void> {
  _cache = null;
  _loadError = null;
  await ensureAdminVideosLoaded();
}

export function getAllAdminVideos(): AdminVideo[] {
  if (_cache) return _cache;
  return initializeFromStorage();
}

export function getAdminVideo(id: string): AdminVideo | undefined {
  return getAllAdminVideos().find((v) => v.id === id);
}

export async function createAdminVideo(
  video: Omit<AdminVideo, "id" | "createdAt" | "updatedAt" | "views" | "rentals" | "revenue">
): Promise<AdminVideo> {
  const id = Date.now().toString();
  const now = Date.now();
  const newVideo: AdminVideo = {
    ...video,
    id,
    createdAt: now,
    updatedAt: now,
    views: 0,
    rentals: 0,
    revenue: 0,
  };

  if (supabase) {
    const { error } = await supabase.from("admin_videos").insert({
      id: newVideo.id,
      title: newVideo.title,
      description: newVideo.description,
      video_url: newVideo.videoUrl,
      thumbnail_url: newVideo.thumbnailUrl,
      category: newVideo.category,
      duration: newVideo.duration,
      price_24h: newVideo.price24h,
      price_48h: newVideo.price48h,
      price_72h: newVideo.price72h,
      is_public: newVideo.isPublic,
      is_active: newVideo.isActive,
      created_at: newVideo.createdAt,
      updated_at: newVideo.updatedAt,
      views: 0,
      rentals: 0,
      revenue: 0,
    });
    if (error) {
      const errorMsg = error.message || error.details || JSON.stringify(error);
      throw new Error(`Supabase error: ${errorMsg}`);
    }
    _cache = _cache ? [newVideo, ..._cache] : [newVideo];
    return newVideo;
  }

  const videos = getAllAdminVideos();
  videos.push(newVideo);
  saveToStorage(videos);
  _cache = videos;
  return newVideo;
}

export async function updateAdminVideo(id: string, updates: Partial<AdminVideo>): Promise<AdminVideo | null> {
  const videos = getAllAdminVideos();
  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) return null;

  const updated = { ...videos[index], ...updates, updatedAt: Date.now() };

  if (supabase) {
    const row = videoToRow(updated);
    const { error } = await supabase.from("admin_videos").update(row).eq("id", id);
    if (error) throw error;
    videos[index] = updated;
    _cache = [...videos];
    return updated;
  }

  videos[index] = updated;
  saveToStorage(videos);
  _cache = videos;
  return updated;
}

export async function deleteAdminVideo(id: string): Promise<boolean> {
  const videos = getAllAdminVideos();
  const filtered = videos.filter((v) => v.id !== id);
  if (filtered.length === videos.length) return false;

  if (supabase) {
    const { error } = await supabase.from("admin_videos").delete().eq("id", id);
    if (error) throw error;
    _cache = filtered;
    return true;
  }

  saveToStorage(filtered);
  _cache = filtered;
  return true;
}

export function getVideoAnalytics(id: string) {
  const video = getAdminVideo(id);
  if (!video) return null;
  return {
    views: video.views,
    rentals: video.rentals,
    revenue: video.revenue,
    averageRentalPrice: video.rentals > 0 ? video.revenue / video.rentals : 0,
  };
}

export function getAllAnalytics() {
  const videos = getAllAdminVideos();
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);
  const totalRentals = videos.reduce((sum, v) => sum + v.rentals, 0);
  const totalRevenue = videos.reduce((sum, v) => sum + v.revenue, 0);
  return {
    totalVideos: videos.length,
    activeVideos: videos.filter((v) => v.isActive).length,
    publicVideos: videos.filter((v) => v.isPublic).length,
    totalViews,
    totalRentals,
    totalRevenue,
    averageRevenuePerVideo: videos.length > 0 ? totalRevenue / videos.length : 0,
    averageViewsPerVideo: videos.length > 0 ? totalViews / videos.length : 0,
  };
}

export async function incrementVideoViews(id: string): Promise<void> {
  const video = getAdminVideo(id);
  if (!video) return;
  await updateAdminVideo(id, { views: video.views + 1 });
}

export async function recordVideoRental(id: string, price: number): Promise<void> {
  const video = getAdminVideo(id);
  if (!video) return;
  await updateAdminVideo(id, {
    rentals: video.rentals + 1,
    revenue: video.revenue + price,
  });
}

export { isSupabaseConfigured };
