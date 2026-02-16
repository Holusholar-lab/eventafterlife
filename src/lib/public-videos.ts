import { getAllAdminVideos, AdminVideo } from "./admin-videos";

export interface PublicVideo {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  price: string;
  /** Used for hover preview on cards; same as admin videoUrl */
  videoUrl?: string;
}

// Convert AdminVideo to PublicVideo format
function adminVideoToPublic(video: AdminVideo): PublicVideo {
  return {
    id: video.id,
    title: video.title,
    description: video.description,
    image: video.thumbnailUrl || video.videoUrl, // Use thumbnail or fallback to video URL
    category: video.category,
    duration: video.duration,
    price: `$${video.price48h.toFixed(2)} / 48hrs`,
    videoUrl: video.videoUrl,
  };
}

// Get all public videos (active and public)
export function getPublicVideos(): PublicVideo[] {
  const adminVideos = getAllAdminVideos();
  return adminVideos
    .filter((video) => video.isActive && video.isPublic)
    .map(adminVideoToPublic)
    .sort((a, b) => {
      // Sort by creation date, newest first
      const videoA = adminVideos.find((v) => v.id === a.id);
      const videoB = adminVideos.find((v) => v.id === b.id);
      if (!videoA || !videoB) return 0;
      return videoB.createdAt - videoA.createdAt;
    });
}

// Get video by ID for public display
export function getPublicVideo(id: string): PublicVideo | undefined {
  const adminVideo = getAllAdminVideos().find((v) => v.id === id && v.isActive && v.isPublic);
  return adminVideo ? adminVideoToPublic(adminVideo) : undefined;
}

// Get videos by category
export function getPublicVideosByCategory(category: string): PublicVideo[] {
  const videos = getPublicVideos();
  if (category === "All") return videos;
  return videos.filter((video) => video.category === category);
}

// Get all unique categories from public videos
export function getPublicCategories(): string[] {
  const videos = getPublicVideos();
  const categories = new Set(videos.map((v) => v.category));
  return ["All", ...Array.from(categories).sort()];
}
