import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card"
import {
  HOMEPAGE_PRIVACY_CARD_DESCRIPTION,
  HOMEPAGE_PRIVACY_CARD_TITLE,
} from "@/lib/data-retention-policy";



const features = [

  {

    icon: "/icons/icon-thumb.svg",

    title: "AI Headshots You Can Actually Use",

    description:

      "Studio-quality results built for LinkedIn, resumes, and professional profiles — polished lighting and backgrounds from your selfies.",

  },

  {

    icon: "/icons/icon-user-secure.svg",

    title: "You Own Your Headshots",

    description:

      "We are an independently owned company that takes privacy seriously. We never sell your photos. You have full commercial rights and ownership of your photos — use them however you want.",

  },

  {

    icon: "/icons/icon-lock-secure.svg",

    title: HOMEPAGE_PRIVACY_CARD_TITLE,

    description: HOMEPAGE_PRIVACY_CARD_DESCRIPTION,

  },

]



export default function PrivacySection() {

  return (

    <section className="py-10 md:py-16 bg-muted/30 border-t">

      <div className="container px-4 md:px-6">

        <div className="flex flex-col items-center justify-center gap-3 text-center mb-12">

          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">

            Professional AI That Respects Your Privacy

          </h2>

          <p className="max-w-[700px] text-muted-foreground text-lg">

            Your headshots, your data, your peace of mind.

          </p>

        </div>



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">

          {features.map(({ icon, title, description }) => (

            <Card key={title} className="flex flex-col items-center text-center p-6 shadow-md">

              <div className="mb-4">

                <Image src={icon} alt="" width={48} height={48} className="h-12 w-12" />

              </div>

              <CardContent className="p-0 space-y-2">

                <h3 className="text-lg font-bold">{title}</h3>

                <p className="text-muted-foreground text-sm leading-relaxed">

                  {description}

                </p>

              </CardContent>

            </Card>

          ))}

        </div>

      </div>

    </section>

  )

}


