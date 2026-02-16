import { useState, useEffect } from "react";
import VideoCard from "@/components/VideoCard";
import RentDialog from "@/components/RentDialog";
import { getPublicVideos, getPublicVideosByCategory, getPublicCategories, PublicVideo } from "@/lib/public-videos";

const Library = () => {
  const [active, setActive] = useState("All");
  const [rentOpen, setRentOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string; image: string; price: string } | null>(null);
  const [videos, setVideos] = useState<PublicVideo[]>(getPublicVideos());
  const [categories, setCategories] = useState<string[]>(getPublicCategories());

  useEffect(() => {
    window.scrollTo(0, 0);
    const interval = setInterval(() => {
      setVideos(getPublicVideos());
      setCategories(getPublicCategories());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = getPublicVideosByCategory(active);

  const handleRent = (video: { id: string; title: string; image: string; price: string }) => {
    setSelectedVideo(video);
    setRentOpen(true);
  };

  return (
    <div className="pt-16">
      <section className="bg-primary py-12">
        <div className="container text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-2">Our Library</h1>
          <p className="text-primary-foreground/80 text-sm">Find the resources you need</p>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
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
