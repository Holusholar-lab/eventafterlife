import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Grid3x3, List, LayoutGrid, User } from "lucide-react";
import VideoCard from "@/components/VideoCard";
import RentDialog from "@/components/RentDialog";
import { getPublicVideos, getPublicCategories, refreshAndGetPublicVideos, PublicVideo } from "@/lib/public-videos";
import { getVideosLoadError } from "@/lib/admin-videos";
import { getCurrentUser } from "@/lib/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Discussion categories matching Community page
const discussionCategories = [
  {
    id: "leadership",
    name: "Leadership & Management",
  },
  {
    id: "politics",
    name: "Politics & Governance",
  },
  {
    id: "innovation",
    name: "Innovation & Tech",
  },
];

type ViewMode = "grid" | "list";
type SortOption = "popular" | "newest" | "oldest" | "title";

const Library = () => {
  const user = getCurrentUser();
  const [rentOpen, setRentOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string; image: string; price: string } | null>(null);
  const [videos, setVideos] = useState<PublicVideo[]>(getPublicVideos());
  const [categories, setCategories] = useState<string[]>(getPublicCategories());
  const [loadError, setLoadError] = useState<string | null>(getVideosLoadError());
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTypes, setEventTypes] = useState<string[]>(["All Events"]);
  const [topics, setTopics] = useState<string[]>([]);
  const [durations, setDurations] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 12;

  // Keep library in sync with admin uploads
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

  // Filter and sort videos
  const filteredAndSorted = useMemo(() => {
    let result = [...videos];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      );
    }

    // Event Type filter (using categories) - keep for backward compatibility
    if (!eventTypes.includes("All Events") && eventTypes.length > 0) {
      result = result.filter((v) => eventTypes.includes(v.category));
    }

    // Categories filter (matching discussion categories)
    if (topics.length > 0) {
      result = result.filter((v) => {
        // Check if video category matches any selected discussion category
        return topics.some((selectedCategory) => {
          // Find matching discussion category
          const categoryMatch = discussionCategories.find(
            (dc) => dc.name === selectedCategory || dc.id === selectedCategory
          );
          
          if (categoryMatch) {
            const videoCatLower = v.category.toLowerCase();
            const discussionNameLower = categoryMatch.name.toLowerCase();
            const discussionIdLower = categoryMatch.id.toLowerCase();
            
            // Match video category to discussion category
            // Try exact match first
            if (videoCatLower === discussionNameLower || videoCatLower === discussionIdLower) {
              return true;
            }
            // Try partial match (e.g., "Leadership" matches "Leadership & Management")
            if (
              videoCatLower.includes(discussionNameLower) ||
              discussionNameLower.includes(videoCatLower) ||
              videoCatLower.includes(discussionIdLower) ||
              discussionIdLower.includes(videoCatLower)
            ) {
              return true;
            }
            // Try keyword matching (e.g., "Leadership" in video category)
            const keywords = discussionNameLower.split(/[&\s]+/).filter(k => k.length > 2);
            if (keywords.some(keyword => videoCatLower.includes(keyword))) {
              return true;
            }
          }
          
          // Fallback to exact match with video category
          return v.category === selectedCategory;
        });
      });
    }

    // Duration filter (parse duration string like "45 min" or "1 hour")
    if (durations.length > 0) {
      result = result.filter((v) => {
        const durationStr = v.duration.toLowerCase();
        let minutes = 0;
        // Parse "45 min", "1 hour", "1h 30m", etc.
        const minMatch = durationStr.match(/(\d+)\s*(?:min|m)/);
        const hourMatch = durationStr.match(/(\d+)\s*(?:hour|hr|h)/);
        if (hourMatch) minutes += parseInt(hourMatch[1]) * 60;
        if (minMatch) minutes += parseInt(minMatch[1]);
        if (durations.includes("<15")) return minutes < 15;
        if (durations.includes("15-30")) return minutes >= 15 && minutes <= 30;
        if (durations.includes("30-60")) return minutes > 30 && minutes <= 60;
        if (durations.includes("60+")) return minutes > 60;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") return b.id.localeCompare(a.id); // Using ID as timestamp proxy
      if (sortBy === "oldest") return a.id.localeCompare(b.id);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0; // Popular (default order)
    });

    return result;
  }, [videos, searchQuery, eventTypes, topics, durations, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSorted.length / videosPerPage);
  const paginatedVideos = filteredAndSorted.slice(
    (currentPage - 1) * videosPerPage,
    currentPage * videosPerPage
  );

  // Featured video (most recent or first)
  const featuredVideo = filteredAndSorted[0] || null;

  const handleRent = (video: { id: string; title: string; image: string; price: string }) => {
    setSelectedVideo(video);
    setRentOpen(true);
  };

  const toggleEventType = (type: string) => {
    if (type === "All Events") {
      setEventTypes(["All Events"]);
    } else {
      setEventTypes((prev) => {
        const filtered = prev.filter((t) => t !== "All Events");
        if (filtered.includes(type)) {
          return filtered.length === 1 ? ["All Events"] : filtered.filter((t) => t !== type);
        }
        return [...filtered, type];
      });
    }
  };

  const toggleTopic = (topic: string) => {
    setTopics((prev) => (prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]));
  };

  const toggleDuration = (duration: string) => {
    setDurations((prev) => (prev.includes(duration) ? prev.filter((d) => d !== duration) : [...prev, duration]));
  };

  const clearAllFilters = () => {
    setEventTypes(["All Events"]);
    setTopics([]);
    setDurations([]);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters = eventTypes.length > 1 || topics.length > 0 || durations.length > 0 || searchQuery.trim() !== "";

  const initials = user
    ? user.fullName
        .trim()
        .split(/\s+/)
        .map((s) => s[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "";

  // Get unique categories for filters
  const availableCategories = categories.filter((c) => c !== "All");

  return (
    <div className="pt-16 min-h-screen bg-background">
      {/* Header */}
      <section className="bg-primary py-6 sm:py-8 border-b border-primary/20">
        <div className="container px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-primary-foreground mb-2">
                OUR LIBRARY
              </h1>
              <p className="text-primary-foreground/80 text-sm sm:text-base">Find the resources you need</p>
            </div>
            {user && (
              <Link to="/profile" className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-primary-foreground/30">
                  <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground text-sm font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for events, speakers, topics..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 h-12 bg-background/50 border-primary-foreground/20 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-6 sm:py-8 px-4">
        {loadError && (
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 p-4 text-sm text-amber-800 dark:text-amber-200">
            <p className="font-medium">Could not load videos from the server.</p>
            <p className="mt-1 opacity-90">{loadError}</p>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <Card className="border border-border">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Event Type */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Event Type</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="all-events"
                          checked={eventTypes.includes("All Events")}
                          onCheckedChange={() => toggleEventType("All Events")}
                        />
                        <Label htmlFor="all-events" className="text-sm cursor-pointer">
                          All Events
                        </Label>
                      </div>
                      {availableCategories.slice(0, 3).map((cat) => (
                        <div key={cat} className="flex items-center space-x-2">
                          <Checkbox
                            id={`event-${cat}`}
                            checked={eventTypes.includes(cat)}
                            onCheckedChange={() => toggleEventType(cat)}
                          />
                          <Label htmlFor={`event-${cat}`} className="text-sm cursor-pointer capitalize">
                            {cat}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Categories</h3>
                    <div className="space-y-2">
                      {discussionCategories.map((cat) => {
                        const isChecked = topics.includes(cat.name) || topics.includes(cat.id);
                        return (
                          <div key={cat.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`category-${cat.id}`}
                              checked={isChecked}
                              onCheckedChange={() => {
                                if (isChecked) {
                                  setTopics(topics.filter(t => t !== cat.name && t !== cat.id));
                                } else {
                                  setTopics([...topics, cat.name]);
                                }
                              }}
                            />
                            <Label htmlFor={`category-${cat.id}`} className="text-sm cursor-pointer">
                              {cat.name}
                            </Label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Duration</h3>
                    <div className="space-y-2">
                      {[
                        { id: "<15", label: "< 15 min" },
                        { id: "15-30", label: "15-30 min" },
                        { id: "30-60", label: "30-60 min" },
                        { id: "60+", label: "60+ min" },
                      ].map((dur) => (
                        <div key={dur.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`duration-${dur.id}`}
                            checked={durations.includes(dur.id)}
                            onCheckedChange={() => toggleDuration(dur.id)}
                          />
                          <Label htmlFor={`duration-${dur.id}`} className="text-sm cursor-pointer">
                            {dur.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Clear All */}
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearAllFilters} className="w-full">
                      Clear All
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Featured This Week */}
            {featuredVideo && (
              <Card className="mb-6 border-2 border-primary/30 overflow-hidden">
                <Link to={`/watch/${featuredVideo.id}`} className="block">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative aspect-video md:aspect-auto md:h-[280px]">
                      <img
                        src={featuredVideo.image}
                        alt={featuredVideo.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="mb-2 bg-primary text-primary-foreground">Featured This Week</Badge>
                        <h2 className="font-display text-xl md:text-2xl font-bold text-white mb-1 line-clamp-2">
                          {featuredVideo.title}
                        </h2>
                        <p className="text-sm text-white/90 line-clamp-2">{featuredVideo.description}</p>
                      </div>
                    </div>
                    <CardContent className="p-6 flex flex-col justify-center bg-muted/30">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="secondary">{featuredVideo.category}</Badge>
                          <span>•</span>
                          <span>{featuredVideo.duration}</span>
                        </div>
                        <p className="text-sm text-foreground line-clamp-3">{featuredVideo.description}</p>
                        <Button
                          onClick={(e) => {
                            e.preventDefault();
                            handleRent(featuredVideo);
                          }}
                          className="w-full sm:w-auto bg-primary hover:bg-primary/90"
                        >
                          Watch Now
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Link>
              </Card>
            )}

            {/* Sort and View Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="title">Title A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">View:</span>
                <div className="flex border border-border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Video Grid/List */}
            {paginatedVideos.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    {hasActiveFilters ? "No videos match your filters." : "No videos available yet."}
                  </p>
                  {hasActiveFilters && (
                    <Button variant="outline" onClick={clearAllFilters} className="mt-4">
                      Clear Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {paginatedVideos.map((video) => (
                      <VideoCard key={video.id} {...video} onRent={handleRent} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedVideos.map((video) => (
                      <Card
                        key={video.id}
                        onClick={() => handleRent(video)}
                        className="cursor-pointer hover:border-primary/40 transition-all"
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative w-full sm:w-48 aspect-video rounded-lg overflow-hidden bg-muted shrink-0">
                              <img
                                src={video.image}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-display font-bold text-foreground text-lg line-clamp-2">{video.title}</h3>
                                <Badge variant="secondary">{video.category}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{video.duration}</span>
                                <span className="text-sm font-semibold text-primary">{video.price}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                    <p className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="min-w-[40px]"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <RentDialog open={rentOpen} onOpenChange={setRentOpen} video={selectedVideo} />
    </div>
  );
};

export default Library;
