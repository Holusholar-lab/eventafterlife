import { useState } from "react";
import { Play, Clock } from "lucide-react";

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

const VideoCard = ({
  id,
  title,
  description,
  image,
  category,
  duration,
  price,
  onRent,
}: VideoCardProps) => {
  const [thumbError, setThumbError] = useState(false);

  const handleClick = () => {
    onRent?.({ id, title, image, price });
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--glow-primary)] cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {/* Thumbnail */}
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
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: "var(--card-overlay)" }} />
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">{category}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100">
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
