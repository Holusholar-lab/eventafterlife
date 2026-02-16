import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Play, Users, BookOpen, Clock, ChevronRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import VideoCard from "@/components/VideoCard";
import RentDialog from "@/components/RentDialog";
import { getPublicVideos } from "@/lib/public-videos";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Index = () => {
  const [rentOpen, setRentOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string; image: string; price: string } | null>(null);
  const [videos, setVideos] = useState(getPublicVideos());

  useEffect(() => {
    // Scroll to top of the page when component mounts
    window.scrollTo(0, 0);
    
    // Reload videos when component mounts or when storage changes
    const interval = setInterval(() => {
      setVideos(getPublicVideos());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRent = (video: { id: string; title: string; image: string; price: string }) => {
    setSelectedVideo(video);
    setRentOpen(true);
  };

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "var(--hero-overlay)" }} />
        <div className="relative z-10 text-center max-w-3xl mx-auto px-4 animate-fade-in">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Welcome to <span className="text-primary">Afterlife</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-2">
            Every event, idea and conversation deserve more than a single moment.
          </p>
          <p className="text-muted-foreground text-sm md:text-base mb-8">
            Step into a growing library of insights and moments designed to last longer than a single day.
          </p>
          <Link
            to="/library"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-display font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-[var(--glow-primary)]"
          >
            Access Our Library
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Available Now */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-2xl font-bold text-foreground">Available Now</h2>
          <Link to="/library" className="text-sm text-primary hover:underline flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {videos.length > 0 ? (
            videos.slice(0, 4).map((video) => (
              <VideoCard key={video.id} {...video} onRent={handleRent} />
            ))
          ) : (
            <div className="col-span-4 text-center py-12 text-muted-foreground">
              <p>No videos available yet. Upload videos in the admin panel to get started.</p>
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-secondary py-16">
        <div className="container">
          <div className="inline-block px-3 py-1 border border-border rounded text-xs font-medium text-muted-foreground mb-4">
            How it Works
          </div>
          <h2 className="font-display text-3xl font-bold mb-12">
            From Event to <span className="text-primary">Evergreen</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                letter: "E",
                title: "For Event Owners",
                points: [
                  "Purpose-driven documentation aligned with your growth goals.",
                  "Intentional creation beyond random coverage.",
                  "Sustainable content systems for ongoing storytelling.",
                ],
              },
              {
                icon: Users,
                letter: "A",
                title: "For Audience",
                points: [
                  "Meaningful curation keeping powerful insights accessible.",
                  "Relive the experience through highlights and recaps.",
                  "Beyond one-time gatherings into ongoing experiences.",
                ],
              },
              {
                icon: Play,
                letter: "S",
                title: "For Speakers",
                points: [
                  "Evergreen messaging that outlasts the stage moment.",
                  "Platform-ready visuals for social reuse.",
                  "Extended reach strengthening your personal brand.",
                ],
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title}>
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-display font-bold text-primary-foreground mb-4">
                    {item.letter}
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-3">{item.title}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {item.points.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Rental Model */}
      <section className="container py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-border rounded text-xs font-medium text-muted-foreground mb-4">
          <Clock className="w-3.5 h-3.5" /> Rent to Watch
        </div>
        <h2 className="font-display text-3xl font-bold mb-4 text-foreground">Pay Only for What You Watch</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          No subscriptions. Rent individual sessions for 24-72 hours at affordable prices and learn at your own pace.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { hours: "24 hrs", price: "$2.99", label: "Quick Watch" },
            { hours: "48 hrs", price: "$4.99", label: "Standard" },
            { hours: "72 hrs", price: "$6.99", label: "Extended" },
          ].map((plan) => (
            <div key={plan.label} className="bg-card border border-border rounded-lg p-6 hover:border-primary/40 transition-colors">
              <p className="text-xs text-muted-foreground mb-1">{plan.label}</p>
              <p className="font-display text-3xl font-bold text-foreground mb-1">{plan.price}</p>
              <p className="text-sm text-primary font-medium">{plan.hours} access</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary py-16">
        <div className="container max-w-3xl">
          <h2 className="font-display text-3xl font-bold mb-8 text-foreground">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {[
              { q: "What exactly does Event Afterlife do?", a: "We transform live events into evergreen content libraries, making insights accessible long after the event ends." },
              { q: "How does the rental model work?", a: "Choose a video, select your rental window (24-72 hours), pay once, and enjoy unlimited replays within that period." },
              { q: "Can I access content on mobile?", a: "Yes! Our platform is fully responsive and works on any device with a web browser." },
              { q: "How do I join the community forum?", a: "Simply create a free account to participate in discussions, share insights, and connect with other learners." },
              { q: "Is it free to subscribe as an event owner or speaker?", a: "Yes! Event owners and speakers can create profiles and manage their content at no cost." },
            ].map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-card border border-border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <RentDialog open={rentOpen} onOpenChange={setRentOpen} video={selectedVideo} />
    </div>
  );
};

export default Index;
