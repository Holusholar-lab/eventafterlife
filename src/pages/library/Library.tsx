import { useState, useEffect } from "react";
import VideoCard from "@/components/VideoCard";
import RentDialog from "@/components/RentDialog";
import { getPublicVideos, getPublicVideosByCategory, getPublicCategories, refreshAndGetPublicVideos, PublicVideo } from "@/lib/public-videos";
import { getVideosLoadError } from "@/lib/admin-videos";

const Library = () => {
  const [active, setActive] = useState("All");
  const [rentOpen, setRentOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string; image: string; price: string } | null>(null);
  const [videos, setVideos] = useState<PublicVideo[]>(getPublicVideos());
  const [categories, setCategories] = useState<string[]>(getPublicCategories());
  const [loadError, setLoadError] = useState<string | null>(getVideosLoadError());

  // Keep library in sync with admin uploads (refetch from backend every 30s so new videos appear for everyone)
  useEffect(() => {
    window.scrollTo(0, 0);
    const refresh = async () => {
      const next = await refreshAndGetPublicVideos();
      setVideos(next);
      setCategories(getPublicCategories());
      setLoadError(getVideosLoadError());
    };
    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, []);

  const filtered = getPublicVideosByCategory(active);

  const handleRent = (video: { id: string; title: string; image: string; price: string }) => {
    setSelectedVideo(video);
    setRentOpen(true);
  };

  return (
    <div className="pt-16">
      <section className="bg-primary py-8 sm:py-12">
        <div className="container text-center px-4">
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Our Library</h1>
          <p className="text-primary-foreground/80 text-sm">Find the resources you need</p>
        </div>
      </section>

      <section className="container py-6 sm:py-10 px-4">
        {loadError && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Could not load videos from the server.</p>
            <p className="mt-1 opacity-90">{loadError}</p>
            <p className="mt-2 text-xs opacity-80">Make sure this app is deployed with Supabase env vars (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) so all devices see the same content.</p>
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6 sm:mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 text-sm rounded-full font-medium transition-colors ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video) => (
            <VideoCard key={video.id} {...video} onRent={handleRent} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No videos in this category yet.</p>
        )}
      </section>

      <RentDialog open={rentOpen} onOpenChange={setRentOpen} video={selectedVideo} />
    </div>
  );
};

export default Library;
