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
      className="border rounded-lg p-4 transition-all hover:shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <button
        onClick={onClick}
        className="flex w-full items-center justify-between text-left font-medium transition-all hover:text-primary"
      >
        <span className="pr-2">{question}</span>
        <ChevronDown className={`h-5 w-5 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
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
            <div className="pt-3 text-muted-foreground">{answer}</div>
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
        "Yes! You can purchase additional packs anytime. Packs start at $29. You don't need to upload new photos — we use your existing trained model to generate new styles.",
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
    {
      question: "How does SnapProHead compare to other AI headshot services?",
      answer:
        "SnapProHead offers 12 curated professional styles with up to 100 headshots per pack, starting at just $29. All plans use advanced Flux AI for enhanced 1024×1024 resolution — higher than most competitors. Plus, we offer a 14-day money-back guarantee and 30-day auto-delete privacy that many alternatives don't.",
    },
    {
      question: "I love my headshots! How can I spread the word?",
      answer:
        "We're glad you love them! Share your experience on social media and tag us, or tell your colleagues and friends. Word of mouth helps us keep prices affordable for everyone. If you have a large audience, reach out about our affiliate program at contact@snapprohead.com.",
    },
    {
      question: "What do you do with my uploaded photos? Are they safe?",
      answer:
        "We never sell or share your photos. All uploaded photos are automatically deleted 30 days after AI training completes. We are GDPR compliant and take your privacy seriously.",
    },
    {
      question: "How long do you keep my photos?",
      answer:
        "Uploaded photos are used to train your AI model and are automatically deleted 30 days after training completes. You can request earlier deletion anytime from your account settings.",
    },
    {
      question: "Can other people see my headshots?",
      answer:
        "No. Your headshots are visible only to you. We never display, share, or showcase your headshots publicly. Your privacy is our priority.",
    },
    {
      question: "Is my data encrypted and secure?",
      answer:
        "Yes. All data is transmitted with SSL encryption and stored with AES-256 encryption. We use industry-standard security practices to protect your information.",
    },
    {
      question: "How does SnapProHead compare to a $500 photographer?",
      answer:
        "A professional photographer costs $500+ and takes 2-3 weeks. SnapProHead starts at just $29 and delivers 40+ headshots in ~30 minutes. That's 97% cheaper and 95% faster — with a money-back guarantee.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "We don't offer a free trial because AI model training has real computing costs. But we do offer a 14-day no-questions-asked money-back guarantee — so there's zero risk to try.",
    },
    {
      question: "How many selfies do I need to upload?",
      answer:
        "We recommend 4-10 clear selfies with good lighting. Front-facing only, no sunglasses or hats. Different angles and expressions give you better variety. Phone selfies work great — no professional equipment needed.",
    },
    {
      question: "Are the headshots realistic? Will people know they're AI-generated?",
      answer:
        "Our AI uses the latest Flux technology, generating 1024×1024 high-resolution headshots. 95% of our customers say the results look very natural and indistinguishable from real photos — perfect for LinkedIn and professional use.",
    },
    {
      question: "How many good photos can I expect?",
      answer:
        "Based on customer feedback, the average customer gets 25-35 usable headshots and 10-15 photos they're very happy with, per pack. With 40+ headshots per pack, you'll have plenty to choose from.",
    },
    {
      question: "Who owns the copyright? Can I use them commercially?",
      answer:
        "You have full copyright and commercial rights to your headshots. Use them on LinkedIn, company websites, resumes, marketing materials, print — anywhere you need. No additional licensing or attribution required.",
    },
    {
      question: "What devices can I use? Can I upload from my phone?",
      answer:
        "Any device works — phone, computer, or tablet. Upload directly from your camera roll. We recommend iPhone 11+ or recent Android phones for best photo quality. No professional camera needed.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
