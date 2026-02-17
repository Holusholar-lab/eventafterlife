import { useMemo, useState } from "react";
import {
  parseVideoUrl,
  isEmbedSource,
  isNativeVideoSource,
  type VideoSource,
} from "@/lib/video-url";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  /** Video URL: YouTube, Vimeo, Google Drive share link, direct MP4, or base64 */
  url: string;
  className?: string;
  title?: string;
  /** Show a message when URL is invalid or unsupported */
  fallback?: React.ReactNode;
}

export default function VideoPlayer({
  url,
  className,
  title = "Video",
  fallback,
}: VideoPlayerProps) {
  const source = useMemo<VideoSource>(() => {
    const parsed = parseVideoUrl(url);
    console.log("[VideoPlayer] Parsed URL:", url, "→", parsed);
    return parsed;
  }, [url]);
  const [bunnyDirectFailed, setBunnyDirectFailed] = useState(false);

  if (source.type === "unknown" || (!source.embedUrl && !source.src)) {
    if (fallback) return <>{fallback}</>;
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground rounded-lg",
          className
        )}
      >
        <p className="text-sm p-4 text-center">
          This video cannot be played. Use a valid Bunny.net, YouTube, Vimeo, Google Drive, or direct video URL.
        </p>
      </div>
    );
  }

  // Bunny with direct MP4: try direct first, fallback to embed if it fails
  if (source.type === "bunny") {
    if (source.src && !bunnyDirectFailed) {
      const baseUrl = source.src.replace(/\/play_\d+p\.mp4$/, "");
      return (
        <video
          controls
          playsInline
          className={cn("w-full h-full rounded-lg", className)}
          title={title}
          onError={() => {
            console.warn("Bunny direct MP4 failed, falling back to embed");
            setBunnyDirectFailed(true);
          }}
        >
          <source src={`${baseUrl}/play_1080p.mp4`} type="video/mp4" />
          <source src={`${baseUrl}/play_720p.mp4`} type="video/mp4" />
          <source src={`${baseUrl}/play_480p.mp4`} type="video/mp4" />
          <source src={`${baseUrl}/play_360p.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }
    // Fallback to embed if direct MP4 failed or not available
    if (source.embedUrl) {
      return (
        <div
          className={cn("relative w-full h-full min-h-[200px] sm:min-h-[300px]", className)}
          style={{ pointerEvents: "auto", zIndex: 0 }}
        >
          <iframe
            src={source.embedUrl}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            loading="eager"
            className="absolute inset-0 w-full h-full rounded-lg"
            style={{ border: "none", pointerEvents: "auto", width: "100%", height: "100%" }}
          />
        </div>
      );
    }
  }

  if (isEmbedSource(source.type) && source.embedUrl) {
    return (
      <div
        className={cn("relative w-full h-full min-h-[300px]", className)}
        style={{ pointerEvents: "auto", zIndex: 0 }}
      >
        <iframe
          src={source.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          loading="eager"
          className="absolute inset-0 w-full h-full rounded-lg"
          style={{ border: "none", pointerEvents: "auto" }}
        />
      </div>
    );
  }

  if (isNativeVideoSource(source.type) && source.src) {
    return (
      <video
        src={source.src}
        controls
        playsInline
        className={cn("w-full h-full rounded-lg", className)}
        title={title}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  if (fallback) return <>{fallback}</>;
  return null;
}
