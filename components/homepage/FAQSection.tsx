import { Badge } from "@/components/ui/badge"
import { FAQ_DATA } from "@/lib/json-ld"

/** Server-rendered FAQ — full Q&A in HTML for SEO (no client-only accordion). */
export default function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-16 py-10 md:py-22">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center md:gap-8">
          <Badge variant="outline" className="mb-2">
            FAQ
          </Badge>
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-[700px] text-muted-foreground text-base sm:text-lg px-2">
            Everything you need to know about our AI headshot service.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {FAQ_DATA.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-lg border p-3 sm:p-4 transition-all hover:shadow-md open:shadow-md"
            >
              <summary className="cursor-pointer list-none text-sm sm:text-base font-medium transition-colors hover:text-primary [&::-webkit-details-marker]:hidden">
                <span className="flex w-full items-start justify-between gap-2 text-left">
                  <span className="pr-2">{faq.question}</span>
                  <span
                    className="text-muted-foreground transition-transform group-open:rotate-180"
                    aria-hidden
                  >
                    ▼
                  </span>
                </span>
              </summary>
              <p className="pt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
