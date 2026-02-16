import { useEffect } from "react";
import { FileText, Scale, AlertCircle, Shield, Users, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
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
            <Scale className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="text-muted-foreground">
            Last updated: February 16, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-card border border-border rounded-lg p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              1. Acceptance of Terms
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using Event Afterlife ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              These Terms of Service ("Terms") govern your access to and use of our website, services, and content. Please read these Terms carefully before using our Service.
            </p>
          </section>

          {/* Use of Service */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              2. Use of Service
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.1 Eligibility</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You must be at least 18 years old to use our Service. By using the Service, you represent and warrant that you are of legal age to form a binding contract and meet all of the eligibility requirements.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.2 Account Registration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To access certain features of the Service, you may be required to register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized use</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">2.3 Acceptable Use</h3>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit harmful, offensive, or illegal content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Use automated systems to access the Service without permission</li>
                  <li>Share your account credentials with others</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content and Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              3. Content and Intellectual Property
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.1 Our Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  All content on the Service, including videos, text, graphics, logos, and software, is the property of Event Afterlife or its content suppliers and is protected by copyright, trademark, and other intellectual property laws.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.2 User Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  If you upload, post, or submit content to our Service, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and distribute such content for the purpose of operating and promoting the Service.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">3.3 Video Rentals</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When you rent a video, you receive a limited, non-exclusive, non-transferable license to view the video during the rental period. You may not download, copy, redistribute, or share rented videos.
                </p>
              </div>
            </div>
          </section>

          {/* Payment and Fees */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment and Fees</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">4.1 Rental Fees</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Video rentals are charged according to the rental period selected (24, 48, or 72 hours). All fees are displayed before you confirm your rental and are non-refundable once the rental period begins.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">4.2 Payment Methods</h3>
                <p className="text-muted-foreground leading-relaxed">
                  We accept payment through our secure payment gateway. You agree to provide current, complete, and accurate purchase and account information for all purchases.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">4.3 Refunds</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Refunds are provided only in cases of technical issues that prevent video playback or as required by law. Refund requests must be submitted within 24 hours of the rental purchase.
                </p>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-primary" />
              5. Prohibited Activities
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              You are expressly prohibited from:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Recording, downloading, or copying any video content</li>
              <li>Sharing your account or rental access with others</li>
              <li>Attempting to bypass security measures or access restrictions</li>
              <li>Reverse engineering or attempting to extract source code</li>
              <li>Using the Service for any illegal or unauthorized purpose</li>
              <li>Violating any applicable laws or regulations</li>
            </ul>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Service is provided "as is" and "as available" without any warranties, express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free. We disclaim all warranties, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              In no event shall Event Afterlife, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or other intangible losses, resulting from your use of the Service.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of Nigeria, without regard to its conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in Lagos, Nigeria.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. Your continued use of the Service after any changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              11. Contact Information
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="bg-secondary rounded-lg p-6 space-y-2">
              <p className="text-foreground"><strong>Event Afterlife</strong></p>
              <p className="text-muted-foreground">
                <strong>Email:</strong> <a href="mailto:info@eventafterlife.com" className="text-primary hover:underline">info@eventafterlife.com</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Phone:</strong> <a href="tel:+2348182745181" className="text-primary hover:underline">+234 818 274 5181</a>
              </p>
              <p className="text-muted-foreground">
                <strong>Address:</strong> Lagos, Nigeria
              </p>
            </div>
          </section>

          {/* Footer Links */}
          <div className="pt-8 border-t border-border flex flex-wrap gap-4 justify-center">
            <Link to="/support" className="text-primary hover:underline text-sm">
              FAQs
            </Link>
            <Link to="/contact" className="text-primary hover:underline text-sm">
              Contact Us
            </Link>
            <Link to="/privacy-policy" className="text-primary hover:underline text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
