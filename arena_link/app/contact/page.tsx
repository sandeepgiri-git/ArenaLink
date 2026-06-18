import Navbar from "@/components/ui/Navbar";
import Link from "next/link";
import { MapPinIcon, MailIcon, PhoneIcon } from "lucide-react";

export default function ContactUs() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 sm:p-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6 gradient-text">
              Contact Us
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              We&apos;re here to help! If you have any questions, feedback, or need assistance, please feel free to reach out to us using the contact details below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPinIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Operating Address</h3>
                    <p className="text-muted-foreground mt-1 whitespace-pre-wrap">
                      ArenaLink{"\n"}
                      B03-401 NEW YORK CITY OPPOSITE SAGE UNIVERSITY DEWAS BYPASS
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <MailIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Email Support</h3>
                    <p className="text-muted-foreground mt-1">
                      <a href="mailto:er.sandeep.giri25@gmail.com" className="hover:text-primary transition-colors">
                        er.sandeep.giri25@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                    <PhoneIcon size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Phone Number</h3>
                    <p className="text-muted-foreground mt-1">
                      <a href="tel:+919644098669" className="hover:text-primary transition-colors">
                        +91 9644098669
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-border">
              <Link href="/" className="text-primary hover:text-primary/80 transition-colors font-medium">
                &larr; Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
