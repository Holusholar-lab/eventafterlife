import { useMemo } from "react";
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
  const source = useMemo<VideoSource>(() => parseVideoUrl(url), [url]);

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

  if (isEmbedSource(source.type) && source.embedUrl) {
    const isBunny = source.type === "bunny";
    return (
      <iframe
        src={source.embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        loading="eager"
        className={cn("w-full h-full min-h-[300px] rounded-lg", className)}
        referrerPolicy={isBunny ? "strict-origin-when-cross-origin" : undefined}
      />
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
