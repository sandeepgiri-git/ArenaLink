import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 gradient-text">
              Privacy Policy
            </h1>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground space-y-6">
              <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              
              <p>
                This Privacy Policy describes how <strong>ArenaLink</strong> (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, and shares your personal information when you use ArenaLink.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. How We Use Your Information</h2>
              <p>We may use the information we collect about you to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our Services.</li>
                <li>Perform internal operations, including to prevent fraud and abuse of our Services.</li>
                <li>Send you communications we think will be of interest to you, including information about products, services, promotions, news, and events.</li>
                <li>Personalize and improve the Services.</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Sharing of Information</h2>
              <p>
                We do not share your personal information with third parties except as described in this privacy policy, such as with our payment processors (e.g., Razorpay) to facilitate transactions, or as required by law.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Security</h2>
              <p>
                We take reasonable measures to help protect personal information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <ul className="list-none space-y-2 mt-4">
                <li><strong>Entity Name:</strong> ArenaLink</li>
                <li><strong>Email:</strong> er.sandeep.giri25@gmail.com</li>
                <li><strong>Phone:</strong> +91 9644098669</li>
                <li><strong>Address:</strong> B03-401 NEW YORK CITY OPPOSITE SAGE UNIVERSITY DEWAS BYPASS</li>
              </ul>
              
              <div className="mt-12 pt-8 border-t border-border">
                <Link href="/" className="text-primary hover:text-primary/80 transition-colors font-medium">
                  &larr; Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
