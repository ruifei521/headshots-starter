import Link from "next/link";
import { Camera } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-8 md:py-14">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Camera className="h-5 w-5 text-primary" />
              <span>SnapProHead</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Professional AI-generated headshots for your online presence.
            </p>
            <p className="text-sm text-muted-foreground">
              <a href="mailto:contact@snapprohead.com" className="hover:text-foreground transition-colors">contact@snapprohead.com</a>
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Headshots</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/headshots/linkedin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  LinkedIn Headshots
                </Link>
              </li>
              <li>
                <Link href="/headshots/lawyer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Lawyer Headshots
                </Link>
              </li>
              <li>
                <Link href="/headshots/realtor" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Realtor Headshots
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  All Styles
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Product</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Choose Your Style
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Support</h3>
            <ul className="space-y-1.5">
              <li>
                <Link href="/refund" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Support & Refunds
                </Link>
              </li>
              <li>
                <a href="mailto:contact@snapprohead.com" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t pt-6 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SnapProHead. Operated by Fei Rui. Secure payments.
          </p>
        </div>
      </div>
    </footer>
  );
}
