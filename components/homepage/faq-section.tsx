"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown } from "lucide-react"

interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onClick: () => void
  index: number
}

function FAQItem({ question, answer, isOpen, onClick, index }: FAQItemProps) {
  return (
    <motion.div
      className="border-b last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between py-4 text-left font-medium transition-all hover:text-primary"
      >
        <span>{question}</span>
        <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-muted-foreground">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "How does AI headshot generation work?",
      answer:
        "Upload 4-10 selfies, choose a professional style (Corporate, Natural, Formal, etc.), then our AI trains on your face and generates studio-quality headshots in ~30 minutes. You get 40+ photos with different backgrounds and outfits.",
    },
    {
      question: "What styles are available?",
      answer:
        "We currently offer 12 professional styles: Corporate Headshots, Partner's Headshots, Lawyer Headshots, Natural Looks, Speaker, Realtor, Styled for Success, Talya Maor, Business Profile Studio, Effortless Professionalism, Office Outfits, and Stylish Studio Portraits. Each style contains 20-81 pre-designed images.",
    },
    {
      question: "Can I buy additional packs later?",
      answer:
        "Yes! You can purchase additional packs anytime. Each pack is $29. You don't need to upload new photos — we use your existing trained model to generate new styles.",
    },
    {
      question: "What kind of photos should I upload?",
      answer:
        "At least 4 high-quality selfies with good lighting. Front-facing, one person per frame, no sunglasses or hats. Different angles and expressions give better variety. Avoid heavily filtered or group photos.",
    },
    {
      question: "How many headshots per style?",
      answer:
        "Each style generates 20-81 professional headshots, depending on the style you choose. Larger styles like Lawyer Headshots produce 81 images (women) or 69 images (men) with diverse backgrounds and outfits.",
    },
    {
      question: "Can I use these headshots professionally?",
      answer:
        "Absolutely. All plans include full commercial rights. Use them on LinkedIn, company websites, resumes, social media, email signatures — anywhere you need a professional look.",
    },
    {
      question: "How quickly will I receive my headshots?",
      answer:
        "Standard processing is ~30 minutes. Pro and Executive plans get priority processing. You'll receive an email when your headshots are ready.",
    },
    {
      question: "What if I'm not satisfied with the results?",
      answer:
        "We stand behind our AI headshots. If you don't get a single headshot you're happy with, we'll refund your entire purchase — no questions asked. Just contact us within 14 days.",
    },
  ]

  return (
    <div className="w-full max-w-3xl mx-auto">
      {faqs.map((faq, index) => (
        <FAQItem
          key={index}
          question={faq.question}
          answer={faq.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
          index={index}
        />
      ))}
    </div>
  )
}
