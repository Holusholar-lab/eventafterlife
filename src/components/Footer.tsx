import { Link } from "react-router-dom";
import { Play, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";

const Footer = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <footer className="bg-secondary border-t border-border">
        <div className="container py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold mb-4">
                <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-primary-foreground fill-current" />
                </div>
                <span className="text-foreground">EVENT</span>
                <span className="text-primary">AFTERLIFE</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-4">Every event deserves more than a single moment.</p>
              
              {/* Contact Information */}
              <div className="space-y-3 mt-6">
                <a href="mailto:info@eventafterlife.com" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>info@eventafterlife.com</span>
                </a>
                <a href="tel:+2348182745181" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+234 818 274 5181</span>
                </a>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>Lagos, Nigeria</span>
                </div>
              </div>
            </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Company</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/about-us" className="block hover:text-foreground transition-colors">About Us</Link>
              <Link to="/how-it-works" className="block hover:text-foreground transition-colors">How It Works</Link>
              <Link to="/library" className="block hover:text-foreground transition-colors">Library</Link>
              <Link to="/community" className="block hover:text-foreground transition-colors">Community</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Support</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <Link to="/contact" className="block hover:text-foreground transition-colors">Contact Us</Link>
              <Link to="/support" className="block hover:text-foreground transition-colors">FAQ</Link>
              <Link to="/privacy-policy" className="block hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="block hover:text-foreground transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div>
            <h4 className="font-display font-semibold text-foreground mb-3">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-3">Stay updated with our latest content.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">© 2026 Event Afterlife. All rights reserved.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>

    {/* Floating Live Chat Button */}
    <button
      onClick={() => setChatOpen(!chatOpen)}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 flex items-center justify-center"
      aria-label="Live Chat"
    >
      <MessageCircle className="w-6 h-6" />
    </button>

    {/* Chat Window (optional - can be expanded later) */}
    {chatOpen && (
      <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-card border border-border rounded-lg shadow-2xl flex flex-col">
        <div className="bg-primary text-primary-foreground p-4 rounded-t-lg flex items-center justify-between">
          <h3 className="font-semibold">Live Chat</h3>
          <button
            onClick={() => setChatOpen(false)}
            className="text-primary-foreground hover:text-primary-foreground/80"
          >
            ×
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          <p className="text-sm text-muted-foreground">Chat functionality coming soon...</p>
        </div>
      </div>
    )}
    </>
  );
};

export default Footer;
