import Navbar from "@/components/ui/Navbar";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 gradient-text">
              Terms &amp; Conditions
            </h1>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground space-y-6">
              <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
              
              <p>
                Welcome to ArenaLink. These Terms &amp; Conditions govern your use of our website and services operated by <strong>ArenaLink</strong>. By accessing or using our service, you agree to be bound by these Terms.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">1. Use of Service</h2>
              <p>
                You must use the Service in compliance with all applicable laws. You agree not to use the Service for any unlawful, fraudulent, or malicious purposes. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">2. User Accounts</h2>
              <p>
                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">3. Payments and Billing</h2>
              <p>
                If you purchase any services from us, you agree to pay all applicable fees and taxes. We use Razorpay as our payment gateway. By completing a transaction, you also agree to the terms and policies of the payment processor. 
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">4. Limitation of Liability</h2>
              <p>
                In no event shall <strong>ArenaLink</strong>, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">5. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
              </p>

              <h2 className="text-xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
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
