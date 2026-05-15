import { Briefcase, Globe, Palette, Building2, GraduationCap, Mic } from "lucide-react"

const useCases = [
  { icon: <Briefcase className="h-5 w-5" />, label: "Job Seekers" },
  { icon: <Globe className="h-5 w-5" />, label: "Freelancers" },
  { icon: <Palette className="h-5 w-5" />, label: "Creatives" },
  { icon: <Building2 className="h-5 w-5" />, label: "Corporate Teams" },
  { icon: <GraduationCap className="h-5 w-5" />, label: "Students" },
  { icon: <Mic className="h-5 w-5" />, label: "Speakers" },
]

export default function BrandsSection() {
  return (
    <section className="border-y bg-muted/40 py-10">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h2 className="text-xl font-medium text-muted-foreground">Perfect headshots for every professional</h2>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            {useCases.map((uc) => (
              <div key={uc.label} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                {uc.icon}
                <span className="font-medium">{uc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
