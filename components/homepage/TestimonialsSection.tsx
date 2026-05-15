import { Badge } from "@/components/ui/badge"
import { Briefcase, Linkedin, FileText, Users } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const useCases = [
  {
    icon: <Linkedin className="h-8 w-8 text-blue-500" />,
    title: "LinkedIn Profile",
    description: "Make a strong first impression with a professional headshot that stands out in recruiters' feeds.",
  },
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "Job Applications",
    description: "Submit polished headshots with your resume and portfolio — no photographer needed.",
  },
  {
    icon: <FileText className="h-8 w-8 text-green-500" />,
    title: "Company Website",
    description: "Get consistent, professional team headshots without coordinating an expensive photo shoot.",
  },
  {
    icon: <Users className="h-8 w-8 text-orange-500" />,
    title: "Social Media",
    description: "Elevate your personal brand across all platforms with cohesive, professional imagery.",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            Use Cases
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Where Your Headshot Matters</h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            A professional headshot opens doors — on LinkedIn, resumes, company pages, and beyond.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {useCases.map((uc, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-lg border p-6 hover:bg-muted/30 transition-colors"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-muted">
                {uc.icon}
              </div>
              <h3 className="font-semibold text-lg">{uc.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {uc.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/login">
            <Button size="lg">Get Your Headshot Now</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
