import { Shield, Clock, CreditCard } from "lucide-react"

export default function TrustBadges() {
  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-8">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span className="font-medium">14-Day Money-Back Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span className="font-medium">Delivery in ~30 Minutes</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span className="font-medium">Secure Payment Processing</span>
        </div>
      </div>

      <p className="text-center font-medium">
        <span className="text-muted-foreground">Professional AI headshots — fast, affordable, and</span>{" "}
        <span className="text-primary font-bold">privacy-first</span>
        <span className="text-muted-foreground">.</span>
      </p>
    </div>
  )
}
