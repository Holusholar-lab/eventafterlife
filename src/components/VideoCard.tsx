import { useState, useRef, useCallback } from "react";
import { Play, Clock } from "lucide-react";
import { parseVideoUrl, isEmbedSource, isNativeVideoSource } from "@/lib/video-url";

const PREVIEW_SECONDS = 10;

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  price: string;
  videoUrl?: string;
  onRent?: (video: { id: string; title: string; image: string; price: string }) => void;
}

// Muted autoplay is required by browsers and embed providers (YouTube, Vimeo, etc.)
function buildPreviewEmbedUrl(embedUrl: string, type: "youtube" | "vimeo" | "drive"): string {
  const separator = embedUrl.includes("?") ? "&" : "?";
  if (type === "youtube") {
    return `${embedUrl}${separator}autoplay=1&mute=1&rel=0`;
  }
  if (type === "vimeo") {
    return `${embedUrl}${separator}autoplay=1&muted=1`;
  }
  return embedUrl;
}

const VideoCard = ({
  id,
  title,
  description,
  image,
  category,
  duration,
  price,
  videoUrl,
  onRent,
}: VideoCardProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [thumbError, setThumbError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (!videoUrl?.trim()) return;
    setShowPreview(true);

    timerRef.current = setTimeout(() => {
      setShowPreview(false);
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }, PREVIEW_SECONDS * 1000);
  }, [videoUrl]);

  const handleMouseLeave = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setShowPreview(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const handleClick = () => {
    onRent?.({ id, title, image, price });
  };

  const source = videoUrl ? parseVideoUrl(videoUrl) : null;
  const canPreview =
    source &&
    source.type !== "unknown" &&
    (isEmbedSource(source.type) ? source.embedUrl : isNativeVideoSource(source.type) && source.src);
  const previewEmbedUrl =
    source && isEmbedSource(source.type) && source.embedUrl
      ? buildPreviewEmbedUrl(source.embedUrl, source.type)
      : null;

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--glow-primary)] cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* Thumbnail always visible; fallback if missing or fails to load */}
        {image ? (
          <img
            src={image}
            alt={title}
            onError={() => setThumbError(true)}
            className="absolute inset-0 z-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}
        {(!image || thumbError) && (
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-muted">
            <Play className="w-12 h-12 text-muted-foreground/50" />
          </div>
        )}
        {/* Hover preview: 10s, muted so it actually autoplays (browser requirement) */}
        {canPreview && showPreview && (
          <div className="absolute inset-2 z-10 rounded-md overflow-hidden shadow-lg ring-1 ring-black/20 bg-black">
            {previewEmbedUrl && (
              <iframe
                src={previewEmbedUrl}
                title={`Preview: ${title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full pointer-events-none"
              />
            )}
            {source && isNativeVideoSource(source.type) && source.src && (
              <video
                ref={videoRef}
                src={source.src}
                muted
                playsInline
                autoPlay
                className="absolute inset-0 w-full h-full object-cover"
                onTimeUpdate={() => {
                  if (videoRef.current && videoRef.current.currentTime >= PREVIEW_SECONDS) {
                    videoRef.current.pause();
                  }
                }}
              />
            )}
          </div>
        )}
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: "var(--card-overlay)" }} />
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">{category}</span>
        </div>
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            showPreview ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
            <Play className="w-6 h-6 text-primary-foreground fill-current ml-0.5" />
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-display font-bold text-foreground text-sm leading-tight">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>{duration}</span>
          </div>
          <span className="text-xs font-semibold text-primary">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
