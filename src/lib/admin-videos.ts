export interface AdminVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string; // URL or file path
  thumbnailUrl: string; // URL or file path
  category: string;
  duration: string;
  price24h: number; // Price for 24-hour rental
  price48h: number; // Price for 48-hour rental
  price72h: number; // Price for 72-hour rental
  isPublic: boolean; // Accessibility: public or private
  isActive: boolean; // Whether video is active/available
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  views: number; // Analytics: view count
  rentals: number; // Analytics: rental count
  revenue: number; // Analytics: total revenue
}

const STORAGE_KEY = "admin_videos";

// Initialize with existing videos from content.ts if needed
function initializeVideos(): AdminVideo[] {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) {
    return JSON.parse(existing);
  }
  
  // Migrate existing videos from content.ts if admin videos don't exist
  try {
    const { videos } = require("@/data/content");
    if (videos && videos.length > 0) {
      const migratedVideos: AdminVideo[] = videos.map((v: any, index: number) => {
        // Extract price from string like "$4.99 / 48hrs"
        const priceMatch = v.price?.match(/\$([\d.]+)/);
        const defaultPrice = priceMatch ? parseFloat(priceMatch[1]) : 4.99;
        
        return {
          id: v.id || `migrated-${index}`,
          title: v.title,
          description: v.description,
          videoUrl: typeof v.image === 'string' ? v.image : '', // Use image as video URL placeholder
          thumbnailUrl: typeof v.image === 'string' ? v.image : '',
          category: v.category,
          duration: v.duration,
          price24h: defaultPrice * 0.6, // Estimate 24h price
          price48h: defaultPrice,
          price72h: defaultPrice * 1.4, // Estimate 72h price
          isPublic: true,
          isActive: true,
          createdAt: Date.now() - (videos.length - index) * 86400000, // Stagger creation dates
          updatedAt: Date.now(),
          views: 0,
          rentals: 0,
          revenue: 0,
        };
      });
      saveVideos(migratedVideos);
      return migratedVideos;
    }
  } catch (error) {
    console.error("Error migrating videos:", error);
  }
  
  return [];
}

function saveVideos(videos: AdminVideo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
}

export function getAllAdminVideos(): AdminVideo[] {
  return initializeVideos();
}

export function getAdminVideo(id: string): AdminVideo | undefined {
  const videos = getAllAdminVideos();
  return videos.find((v) => v.id === id);
}

export function createAdminVideo(video: Omit<AdminVideo, "id" | "createdAt" | "updatedAt" | "views" | "rentals" | "revenue">): AdminVideo {
  const videos = getAllAdminVideos();
  const newVideo: AdminVideo = {
    ...video,
    id: Date.now().toString(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    views: 0,
    rentals: 0,
    revenue: 0,
  };
  videos.push(newVideo);
  saveVideos(videos);
  return newVideo;
}

export function updateAdminVideo(id: string, updates: Partial<AdminVideo>): AdminVideo | null {
  const videos = getAllAdminVideos();
  const index = videos.findIndex((v) => v.id === id);
  if (index === -1) return null;
  
  videos[index] = {
    ...videos[index],
    ...updates,
    updatedAt: Date.now(),
  };
  saveVideos(videos);
  return videos[index];
}

export function deleteAdminVideo(id: string): boolean {
  const videos = getAllAdminVideos();
  const filtered = videos.filter((v) => v.id !== id);
  if (filtered.length === videos.length) return false;
  saveVideos(filtered);
  return true;
}

// Analytics helpers
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
  const activeVideos = videos.filter((v) => v.isActive).length;
  const publicVideos = videos.filter((v) => v.isPublic).length;
  
  return {
    totalVideos: videos.length,
    activeVideos,
    publicVideos,
    totalViews,
    totalRentals,
    totalRevenue,
    averageRevenuePerVideo: videos.length > 0 ? totalRevenue / videos.length : 0,
    averageViewsPerVideo: videos.length > 0 ? totalViews / videos.length : 0,
  };
}

// Increment view count (called when video is viewed)
export function incrementVideoViews(id: string) {
  const video = getAdminVideo(id);
  if (video) {
    updateAdminVideo(id, { views: video.views + 1 });
  }
}

// Record rental (called when video is rented)
export function recordVideoRental(id: string, price: number) {
  const video = getAdminVideo(id);
  if (video) {
    updateAdminVideo(id, {
      rentals: video.rentals + 1,
      revenue: video.revenue + price,
    });
  }
}
