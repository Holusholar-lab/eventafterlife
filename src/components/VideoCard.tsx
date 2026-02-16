import { Play, Clock } from "lucide-react";

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  duration: string;
  price: string;
  onRent?: (video: { id: string; title: string; image: string; price: string }) => void;
}

const VideoCard = ({ id, title, description, image, category, duration, price, onRent }: VideoCardProps) => {
  const handleClick = () => {
    onRent?.({ id, title, image, price });
  };

  return (
    <div
      onClick={handleClick}
      className="group relative bg-card rounded-lg overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-[var(--glow-primary)] cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: "var(--card-overlay)" }} />
        <div className="absolute top-3 right-3">
          <span className="px-2 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded">{category}</span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
