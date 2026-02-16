/**
 * Detects video URL type and returns embed URL or type for playback.
 * Supports: YouTube, Vimeo, Google Drive, direct video URLs, and base64 (file uploads).
 */

export type VideoSourceType = "youtube" | "vimeo" | "drive" | "direct" | "base64" | "unknown";

export interface VideoSource {
  type: VideoSourceType;
  /** URL to use in iframe src or video src */
  embedUrl?: string;
  /** For direct/base64: use as <video src>. For embed types: use embedUrl in iframe */
  src?: string;
}

/**
 * Extract YouTube video ID from various URL formats.
 * e.g. youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 */
function getYouTubeId(url: string): string | null {
  const trimmed = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = trimmed.match(re);
    if (m) return m[1];
  }
  return null;
}

/**
 * Extract Vimeo video ID.
 * e.g. vimeo.com/123456789, player.vimeo.com/video/123456789
 */
function getVimeoId(url: string): string | null {
  const trimmed = url.trim();
  const m = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  return m ? m[1] : null;
}

/**
 * Extract Google Drive file ID.
 * e.g. drive.google.com/file/d/FILE_ID/view, drive.google.com/open?id=FILE_ID
 */
function getDriveFileId(url: string): string | null {
  const trimmed = url.trim();
  const m = trimmed.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

/**
 * Check if URL is a direct video file (mp4, webm, ogg, etc.)
 */
function isDirectVideoUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase();
  if (trimmed.startsWith("data:video/")) return false; // base64 handled separately
  return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(trimmed) || trimmed.includes("video/");
}

export function parseVideoUrl(input: string): VideoSource {
  if (!input || typeof input !== "string") {
    return { type: "unknown" };
  }

  const trimmed = input.trim();

  // Base64 (e.g. from file upload)
  if (trimmed.startsWith("data:video/")) {
    return { type: "base64", src: trimmed, embedUrl: undefined };
  }

  const ytId = getYouTubeId(trimmed);
  if (ytId) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${ytId}?rel=0`,
      src: undefined,
    };
  }

  const vimeoId = getVimeoId(trimmed);
  if (vimeoId) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      src: undefined,
    };
  }

  const driveId = getDriveFileId(trimmed);
  if (driveId) {
    return {
      type: "drive",
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      src: undefined,
    };
  }

  // Direct video URL
  if (isDirectVideoUrl(trimmed) || /^https?:\/\//.test(trimmed)) {
    return { type: "direct", src: trimmed, embedUrl: trimmed };
  }

  return { type: "unknown" };
}

/**
 * Whether this source can be played in an iframe (YouTube, Vimeo, Drive).
 */
export function isEmbedSource(type: VideoSourceType): boolean {
  return type === "youtube" || type === "vimeo" || type === "drive";
}

/**
 * Whether this source should use <video> tag (direct URL or base64).
 */
export function isNativeVideoSource(type: VideoSourceType): boolean {
  return type === "direct" || type === "base64";
}
