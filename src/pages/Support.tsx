import { useState, useMemo, useEffect } from "react";
import { Search, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "1",
    question: "What exactly does Event Afterlife do?",
    answer: "We transform live events into evergreen content libraries, making insights accessible long after the event ends.",
    category: "General",
  },
  {
    id: "2",
    question: "How does the rental model work?",
    answer: "Choose a video, select your rental window (24-72 hours), pay once, and enjoy unlimited replays within that period.",
    category: "Rental",
  },
  {
    id: "3",
    question: "Can I access content on mobile?",
    answer: "Yes! Our platform is fully responsive and works on any device with a web browser.",
    category: "Technical",
  },
  {
    id: "4",
    question: "How do I join the community forum?",
    answer: "Simply create a free account to participate in discussions, share insights, and connect with other learners.",
    category: "Account",
  },
  {
    id: "5",
    question: "Is it free to subscribe as an event owner or speaker?",
    answer: "Yes! Event owners and speakers can create profiles and manage their content at no cost.",
    category: "Account",
  },
  {
    id: "6",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, debit cards, and digital payment methods through our secure payment gateway.",
    category: "Payment",
  },
  {
    id: "7",
    question: "Can I extend my rental period?",
    answer: "Yes, you can extend your rental period by purchasing an additional rental window before your current one expires.",
    category: "Rental",
  },
  {
    id: "8",
    question: "What happens if I don't finish watching within my rental period?",
    answer: "Your access expires at the end of your rental period. You'll need to purchase a new rental to continue watching.",
    category: "Rental",
  },
  {
    id: "9",
    question: "How do I upload my event videos?",
    answer: "Event owners can upload videos through the admin panel. Simply sign up, go to the Upload section, and follow the instructions.",
    category: "Content",
  },
  {
    id: "10",
    question: "Can I download videos for offline viewing?",
    answer: "Currently, videos are only available for streaming. Download functionality may be added in the future.",
    category: "Technical",
  },
  {
    id: "11",
    question: "How do I contact support?",
    answer: "You can reach our support team through the Contact Us page, email us at info@eventafterlife.com, or call +234 818 274 5181.",
    category: "Support",
  },
  {
    id: "12",
    question: "What are your business hours?",
    answer: "Our support team is available Monday - Friday, 9AM - 6PM WAT, and Saturday, 10AM - 4PM WAT. We're closed on Sundays.",
    category: "Support",
  },
];

const Support = () => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Scroll to top of the page when component mounts
    window.scrollTo(0, 0);
  }, []);

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) {
      return faqs;
    }

    const query = searchQuery.toLowerCase();
    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background py-16 pt-24">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Support & <span className="text-primary">FAQs</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find answers to common questions or search for specific information
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for questions or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-base bg-card border-border"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              Found {filteredFAQs.length} {filteredFAQs.length === 1 ? "result" : "results"}
            </p>
          )}
        </div>

        {/* FAQs */}
        {filteredFAQs.length > 0 ? (
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {filteredFAQs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:text-primary py-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded mt-1">
                        {faq.category}
                      </span>
                      <span>{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4 pl-16">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ) : (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try searching with different keywords or{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact our support team
              </a>
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-sm text-primary hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Still Need Help Section */}
        <div className="mt-12 bg-card border border-border rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">Still need help?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Contact Support
            </a>
            <a
              href="mailto:info@eventafterlife.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
