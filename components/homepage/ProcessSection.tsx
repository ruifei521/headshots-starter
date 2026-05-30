"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { motion, useInView } from "motion/react"
import { Palette, Camera, Sparkles, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const processSteps = [
  {
    number: 1,
    title: "Upload Your Selfies",
    description: "Selfies work great! Just 4–6 uploads is all you need. Focus on good lighting, different angles, and one person per photo.",
    icon: <Camera className="h-5 w-5" />,
    images: ["/homepage/before0001.jpg", "/homepage/before0002.jpg", "/homepage/example0003.jpg"]
  },
  {
    number: 2,
    title: "AI Trains on Your Face",
    description: "Our AI gets to work on your photos. Just wait for your results — we'll email you when your headshots are ready!",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    number: 3,
    title: "Download & Use Anywhere",
    description: "Receive up to 100 high-quality headshots to use however you want — LinkedIn, resumes, company websites, and more.",
    icon: <Download className="h-5 w-5" />,
    images: ["/homepage/example0005.jpg", "/homepage/example0007.jpg", "/homepage/example0009.jpg"]
  }
]

function ProcessStep({ step, isActive, index }: { step: typeof processSteps[0], isActive: boolean, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const renderVisual = () => {
    if (index === 2) {
      // AI Processing step - animated spinner
      return (
        <motion.div
          className="relative w-full aspect-[3/2] rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0.5 }}
        >
          {isInView && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full"
            />
          )}
          <p className="absolute bottom-4 text-xs text-muted-foreground">Flux AI processing...</p>
        </motion.div>
      )
    }

    // Image grid for steps 1, 2, 4
    return (
      <div className="grid grid-cols-3 gap-2 p-4">
        {step.images?.map((img, i) => (
          <motion.div
            key={`step-${index}-${i}`}
            className="aspect-square rounded-lg overflow-hidden bg-muted relative"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0.5, y: 10 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Image
              src={img}
              alt={`Step ${index + 1} example`}
              fill
              sizes="150px"
              className="object-cover"
              loading="lazy"
              quality={60}
            />
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={cn(
        "group flex flex-col items-center text-center",
        "rounded-2xl border bg-card p-6 shadow-sm transition-all duration-200 hover:shadow-md",
        isActive && "border-primary"
      )}
    >
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            {step.number}
          </div>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-transform duration-200 group-hover:scale-110">
          {step.icon}
        </div>
      </div>

      {renderVisual()}

      <div className="mt-6 space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
        <p className="text-sm text-muted-foreground">{step.description}</p>
      </div>
    </motion.div>
  )
}

export default function ProcessSection() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section id="how-it-works" className="scroll-mt-16 py-10 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="max-w-[700px] text-muted-foreground text-lg">
            Get your headshots in minutes, not days. It's as easy as 1-2-3-4!
          </p>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-12">
          {processSteps.map((step, index) => (
            <ProcessStep
              key={step.number}
              step={step}
              isActive={activeStep === index}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
