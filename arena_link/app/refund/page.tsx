import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

export default function RefundPolicy() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 gradient-text">
              Cancellation &amp; Refund Policy
            </h1>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground space-y-6">
              <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              
              <p>
                <strong>ArenaLink</strong> believes in helping its customers as far as possible, and has therefore a liberal cancellation policy. 
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Cancellations</h2>
              <p>
                Under this policy:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cancellations will be considered only if the request is made immediately after placing the order or before the service has been rendered.</li>
                <li><strong>ArenaLink</strong> does not accept cancellation requests for items or services that have already been fulfilled or completed.</li>
              </ul>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. Refunds</h2>
              <p>
                In case you feel that the service received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <strong>7-14</strong> days of receiving the product/service. The Customer Service Team after looking into your complaint will take an appropriate decision.
              </p>

              <p>
                In case of any Refunds approved by <strong>ArenaLink</strong>, it&apos;ll take <strong>3-5 days</strong> for the refund to be processed to the end customer.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Contact Us</h2>
              <p>
                If you have any questions or concerns regarding your refund, please contact us at:
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
