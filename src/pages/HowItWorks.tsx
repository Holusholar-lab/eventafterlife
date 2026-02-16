import { useEffect } from "react";
import { BookOpen, Users, Play, Clock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  useEffect(() => {
    // Scroll to top of the page when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-16 pb-16">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Play className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            How It <span className="text-primary">Works</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            From Event to Evergreen - Simple steps to access and share content
          </p>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-lg p-8 md:p-12 space-y-8">
          {/* Main Process */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
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
                  <div key={item.title} className="text-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center font-display font-bold text-primary-foreground mb-4 mx-auto">
                      {item.letter}
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-3">{item.title}</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground text-left">
                      {item.points.map((p, i) => (
                        <li key={i} className="flex gap-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Rental Process */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center flex items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-primary" />
              Renting Videos
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Browse the Library</h3>
                  <p className="text-muted-foreground">
                    Explore our curated collection of event videos. Filter by category, search by topic, or browse featured content.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Choose Your Rental Period</h3>
                  <p className="text-muted-foreground">
                    Select from 24, 48, or 72-hour rental options. Choose the duration that fits your schedule and learning pace.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Pay and Watch</h3>
                  <p className="text-muted-foreground">
                    Complete your payment securely and gain instant access. Watch unlimited times during your rental period.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Learn at Your Pace</h3>
                  <p className="text-muted-foreground">
                    Access your rented videos anytime during the rental period. No subscriptions, no long-term commitments.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="pt-8 border-t border-border">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-center">
              Pay Only for What You Watch
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              No subscriptions. Rent individual sessions for 24-72 hours at affordable prices and learn at your own pace.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { hours: "24 hrs", price: "$2.99", label: "Quick Watch" },
                { hours: "48 hrs", price: "$4.99", label: "Standard" },
                { hours: "72 hrs", price: "$6.99", label: "Extended" },
              ].map((plan) => (
                <div key={plan.label} className="bg-secondary border border-border rounded-lg p-6 hover:border-primary/40 transition-colors text-center">
                  <p className="text-xs text-muted-foreground mb-1">{plan.label}</p>
                  <p className="font-display text-3xl font-bold text-foreground mb-1">{plan.price}</p>
                  <p className="text-sm text-primary font-medium">{plan.hours} access</p>
                </div>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="pt-8 border-t border-border text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Browse our library and start learning today.
            </p>
            <Link
              to="/library"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Explore Library
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
