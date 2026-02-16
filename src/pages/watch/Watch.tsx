import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Clock, AlertTriangle } from "lucide-react";
import { getPublicVideo } from "@/lib/public-videos";
import { getAdminVideo, incrementVideoViews } from "@/lib/admin-videos";
import { getActiveRental } from "@/lib/rentals";
import { Button } from "@/components/ui/button";
import RentDialog from "@/components/RentDialog";
import VideoPlayer from "@/components/VideoPlayer";

const Watch = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const publicVideo = getPublicVideo(id || "");
  const adminVideo = id ? getAdminVideo(id) : null;
  const [remaining, setRemaining] = useState<number | null>(null);
  const [expired, setExpired] = useState(false);
  const [rentOpen, setRentOpen] = useState(false);

  useEffect(() => {
    if (!adminVideo) return;
    
    // Increment view count when video page is accessed
    incrementVideoViews(adminVideo.id);
    
    const tick = () => {
      const rental = getActiveRental(adminVideo.id);
      if (!rental) {
        setExpired(true);
        setRemaining(null);
        return;
      }
      const diff = rental.expiresAt - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setRemaining(null);
      } else {
        setExpired(false);
        setRemaining(diff);
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [adminVideo, rentOpen]);

  if (!publicVideo || !adminVideo) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-foreground mb-2">Video not found</h1>
          <Link to="/library" className="text-primary hover:underline text-sm">
            Back to Library
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h}h ${m.toString().padStart(2, "0")}m ${s.toString().padStart(2, "0")}s`;
  };

  const isUrgent = remaining !== null && remaining < 3600000; // < 1 hour

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-card border-b border-border">
        <div className="container flex items-center justify-between h-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          {remaining !== null && (
            <div
              className={`flex items-center gap-2 text-xs font-medium ${
                isUrgent ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              {isUrgent && <AlertTriangle className="w-3.5 h-3.5" />}
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTime(remaining)} remaining</span>
            </div>
          )}
        </div>
      </div>

      {expired ? (
        /* Expired / no rental */
        <div className="container max-w-3xl py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            Rental Required
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Rent this video to start watching. Choose a plan that works for you.
          </p>
          <Button onClick={() => setRentOpen(true)}>Rent "{publicVideo.title}"</Button>
        </div>
      ) : (
        /* Video player area */
        <div className="container max-w-5xl py-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
            <VideoPlayer
              url={adminVideo.videoUrl}
              title={publicVideo.title}
              className="absolute inset-0 w-full h-full"
              fallback={
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <img
                    src={publicVideo.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-40"
                  />
                  <div className="relative text-center text-muted-foreground text-sm p-4">
                    <p>Unable to play this video. Check the video URL in the admin panel.</p>
                  </div>
                </div>
              }
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-primary text-primary-foreground rounded mb-2">
                {publicVideo.category}
              </span>
              <h1 className="font-display text-xl md:text-2xl font-bold text-foreground mb-1">
                {publicVideo.title}
              </h1>
              <p className="text-sm text-muted-foreground">{publicVideo.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-md text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {publicVideo.duration}
              </div>
            </div>
          </div>
        </div>
      )}

      <RentDialog
        open={rentOpen}
        onOpenChange={setRentOpen}
        video={publicVideo ? { id: publicVideo.id, title: publicVideo.title, image: publicVideo.image, price: publicVideo.price } : null}
      />
    </div>
  );
};

export default Watch;
