import { useEffect } from "react";
import { Users, Target, Award, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
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
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            About <span className="text-primary">Us</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transforming live events into evergreen content libraries
          </p>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-lg p-8 md:p-12 space-y-8">
          {/* Mission */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-primary" />
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              At Event Afterlife, we believe that every event, idea, and conversation deserves more than a single moment. Our mission is to transform live events into evergreen content libraries, making powerful insights and moments accessible long after the event ends.
            </p>
          </section>

          {/* What We Do */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Award className="w-6 h-6 text-primary" />
              What We Do
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We provide a platform that bridges the gap between event creators and their audiences:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li><strong>For Event Owners:</strong> Purpose-driven documentation aligned with your growth goals, intentional creation beyond random coverage, and sustainable content systems for ongoing storytelling.</li>
              <li><strong>For Audience:</strong> Meaningful curation keeping powerful insights accessible, the ability to relive experiences through highlights and recaps, and access to content beyond one-time gatherings.</li>
              <li><strong>For Speakers:</strong> Evergreen messaging that outlasts the stage moment, platform-ready visuals for social reuse, and extended reach strengthening your personal brand.</li>
            </ul>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">Accessibility</h3>
                <p className="text-muted-foreground text-sm">
                  We believe knowledge should be accessible. Our flexible rental model ensures everyone can access valuable content without long-term commitments.
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">Quality</h3>
                <p className="text-muted-foreground text-sm">
                  We curate and deliver high-quality content that provides real value to our users, ensuring every video meets our standards of excellence.
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">Innovation</h3>
                <p className="text-muted-foreground text-sm">
                  We continuously innovate to improve the user experience, making it easier for creators to share and audiences to discover meaningful content.
                </p>
              </div>
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-2">Community</h3>
                <p className="text-muted-foreground text-sm">
                  We foster a community where learners, creators, and speakers can connect, share insights, and grow together.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="pt-8 border-t border-border">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Join Us</h2>
              <p className="text-muted-foreground mb-6">
                Whether you're an event owner, speaker, or learner, we'd love to have you as part of our community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/library"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                  Explore Library
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
