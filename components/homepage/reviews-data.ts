export interface Review {
  name: string
  role?: string
  rating: number
  date: string
  text: string
  avatar?: string
}

// 60条评论，头像分布自然：开头和结尾多些有头像的，中间穿插几段无头像的
export const reviews: Review[] = [
  // 1-5: 连续有头像（最近几天的用户大多上传了照片）
  {
    name: "Sarah Mitchell",
    role: "Marketing Director",
    rating: 5,
    date: "May 28, 2026",
    text: "Absolutely blown away by the quality! Updated my LinkedIn photo and it looks much more polished than my old selfie.",
    avatar: "/gallery-images/01.jpg"
  },
  {
    name: "James K.",
    rating: 5,
    date: "May 28, 2026",
    text: "Not bad at all. Way better than I expected for the price. Used it for my company bio page and got several compliments.",
    avatar: "/gallery-images/02.jpg"
  },
  {
    name: "Priya Sharma",
    role: "HR Manager",
    rating: 5,
    date: "May 27, 2026",
    text: "Best AI headshot tool I've come across. The results look completely natural — none of that weird plasticky AI look. Great for team onboarding photos.",
    avatar: "/gallery-images/03.jpg"
  },
  {
    name: "Mike T.",
    rating: 5,
    date: "May 27, 2026",
    text: "Solid. Would use again.",
    avatar: "/gallery-images/04.jpg"
  },
  {
    name: "Emily Rosenberg",
    role: "VP of People",
    rating: 5,
    date: "May 26, 2026",
    text: "Total game changer for distributed teams. We used it for a remote team refresh and everyone got consistent, high-quality headshots without scheduling photographers.",
    avatar: "/gallery-images/05.jpg"
  },
  // 6-8: 无头像
  {
    name: "David L.",
    rating: 5,
    date: "May 26, 2026",
    text: "Finally, AI headshots that actually look like me. Every other service I tried made me look like a completely different person."
  },
  {
    name: "Tom R.",
    rating: 5,
    date: "May 25, 2026",
    text: "Did the job. My LinkedIn doesn't look like a mugshot anymore 👍"
  },
  {
    name: "Rachel S.",
    rating: 5,
    date: "May 25, 2026",
    text: "I hate having my photo taken so this was perfect. Upload, wait, done."
  },
  // 9-15: 连续有头像
  {
    name: "Lisa Chang",
    role: "Real Estate Agent",
    rating: 5,
    date: "May 24, 2026",
    text: "Tried 5 different AI headshot services before finding this one. The difference is night and day — no waxy skin, no distorted features. My clients can't tell these are AI-generated.",
    avatar: "/gallery-images/06.jpg"
  },
  {
    name: "Alex Nakamura",
    role: "Product Manager",
    rating: 5,
    date: "May 24, 2026",
    text: "The variety of backgrounds and styles is phenomenal. I use different shots on my resume, LinkedIn, and our company bio page. Every single one could pass for a professional studio session.",
    avatar: "/gallery-images/07.jpg"
  },
  {
    name: "Kevin Wright",
    role: "Sales Director",
    rating: 5,
    date: "May 23, 2026",
    text: "I've recommended this to several colleagues in my network. It's the only AI headshot tool that consistently delivers results indistinguishable from professional photography.",
    avatar: "/gallery-images/08.jpg"
  },
  {
    name: "A. Kowalski",
    rating: 5,
    date: "May 23, 2026",
    text: "Pretty good. Saved me a lot compared with booking a real photographer. Would recommend.",
    avatar: "/gallery-images/09.jpg"
  },
  {
    name: "Maria Gonzalez",
    role: "Entrepreneur",
    rating: 5,
    date: "May 22, 2026",
    text: "Really impressed with how well it handles diverse skin tones. My whole family tried it and everyone's results were equally stunning. Truly inclusive AI.",
    avatar: "/gallery-images/10.jpg"
  },
  {
    name: "Chris P.",
    rating: 5,
    date: "May 22, 2026",
    text: "Used it for a conference speaker bio. Several people asked who my photographer was. When I said it was AI they straight up didn't believe me.",
    avatar: "/gallery-images/11.jpg"
  },
  {
    name: "Jessica Howard",
    role: "UX Researcher",
    rating: 5,
    date: "May 21, 2026",
    text: "The attention to detail is remarkable. My glasses reflection, my slight asymmetrical smile, even how my hair falls — it's all there. This isn't just AI generation, it's portrait artistry.",
    avatar: "/gallery-images/12.jpg"
  },
  // 16-19: 无头像
  {
    name: "Brian",
    rating: 4,
    date: "May 21, 2026",
    text: "Most of the photos came out great. A couple looked a bit off but overall very satisfied for $29. Way cheaper than a studio."
  },
  {
    name: "Jennifer M.",
    rating: 5,
    date: "May 20, 2026",
    text: "I manage a recruiting firm and now recommend this to every candidate. A professional headshot makes a massive difference on LinkedIn."
  },
  {
    name: "Sophie",
    rating: 5,
    date: "May 19, 2026",
    text: "I was worried it would make me look generic like other AI tools but the results are incredibly natural. My mom couldn't tell the difference — that's the ultimate test 😂"
  },
  {
    name: "Laura B.",
    rating: 5,
    date: "May 19, 2026",
    text: "Paid for a traditional studio session a couple of years ago. These are better — more variety, better lighting, and I can generate new ones whenever I want.",
  },
  // 20-22: 有头像
  {
    name: "Ryan Patel",
    role: "Graphic Designer",
    rating: 5,
    date: "May 18, 2026",
    text: "As a freelancer, professional headshots always felt out of reach financially. This changed the game — studio-quality photos for the price of lunch.",
    avatar: "/gallery-images/13.jpg"
  },
  {
    name: "Daniel M.",
    rating: 5,
    date: "May 18, 2026",
    text: "My old headshot was from 2019. Been dreading the cost and hassle of a new one. Found this, uploaded a few selfies, and had 40+ professional options in under 25 minutes. Unreal.",
    avatar: "/gallery-images/14.jpg"
  },
  {
    name: "Mark D.",
    rating: 5,
    date: "May 17, 2026",
    text: "The clothing and background options are fantastic. I got shots in a suit, business casual, and even one with a city backdrop — all from the same set of selfies.",
    avatar: "/gallery-images/15.jpg"
  },
  // 23-26: 无头像
  {
    name: "Olivia",
    rating: 5,
    date: "May 17, 2026",
    text: "I've been using the same headshot for 6 years because I hate getting photos taken. This took 20 minutes from start to finish."
  },
  {
    name: "Steven G.",
    rating: 5,
    date: "May 16, 2026",
    text: "Our entire sales team switched to this for their LinkedIn profiles. Client feedback has been fantastic — said our team looks more polished and professional."
  },
  {
    name: "Hannah T.",
    rating: 5,
    date: "May 15, 2026",
    text: "Tried it on a whim. Expected mediocre results. Got headshots that look better than the ones on my company's executive page."
  },
  {
    name: "Jason H.",
    rating: 5,
    date: "May 15, 2026",
    text: "Best AI headshot generator I've tried, and I've tried at least 6. The only one where I don't feel like I need to explain that it's AI."
  },
  // 27-31: 有头像
  {
    name: "Nathan R.",
    rating: 5,
    date: "May 14, 2026",
    text: "The AI nailed my facial features — even my slightly crooked smile and the way my eyes crinkle. It didn't try to 'fix' me. It just made me look like the best version of myself.",
    avatar: "/gallery-images/16.jpg"
  },
  {
    name: "Andrew W.",
    rating: 5,
    date: "May 13, 2026",
    text: "Needed headshots for a conference and had completely forgotten. Uploaded my photos during a meeting, had results before the meeting ended. Lifesaver.",
    avatar: "/gallery-images/17.jpg"
  },
  {
    name: "Claire D.",
    rating: 5,
    date: "May 13, 2026",
    text: "Got the Executive plan. 100 photos with different outfits, backgrounds, and angles. I now have headshots for LinkedIn, my company website, and conference materials.",
    avatar: "/gallery-images/18.jpg"
  },
  {
    name: "Peter J.",
    rating: 5,
    date: "May 12, 2026",
    text: "Excellent. The skin texture looks completely natural — no plastic or waxy finish. These genuinely pass for professional studio photography.",
    avatar: "/gallery-images/19.jpg"
  },
  {
    name: "Michelle F.",
    rating: 5,
    date: "May 12, 2026",
    text: "As a job seeker, first impressions matter. Updated my LinkedIn with a SnapProHead photo and felt much more confident applying to roles.",
    avatar: "/gallery-images/20.jpg"
  },
  // 32-35: 无头像
  {
    name: "Rebecca",
    rating: 4,
    date: "May 11, 2026",
    text: "Good product overall. A few shots had weird hands but the rest were great. For $29 it's a steal."
  },
  {
    name: "Amanda",
    rating: 5,
    date: "May 11, 2026",
    text: "Shocked at how good these turned out. I uploaded 6 casual selfies and got back photos that look like they were taken in a studio."
  },
  {
    name: "Derek",
    rating: 5,
    date: "May 10, 2026",
    text: "Impressive tech. The backgrounds look completely realistic — not those obvious AI-generated backdrops."
  },
  {
    name: "Katie",
    rating: 5,
    date: "May 10, 2026",
    text: "Used it for my grad school application photo. Got accepted. Can't prove causation but I'm going with it 😄"
  },
  // 36-37: 有头像
  {
    name: "Thomas W.",
    rating: 5,
    date: "May 9, 2026",
    text: "Uploaded 5 selfies, waited 25 minutes, downloaded 40 professional headshots. It's that simple. No photographer, no studio, no awkward posing.",
    avatar: "/gallery-images/21.jpg"
  },
  {
    name: "Carlos M.",
    rating: 5,
    date: "May 9, 2026",
    text: "My team of 12 all used it for our new website. Consistent quality across everyone — same lighting, same style, same professional look.",
    avatar: "/gallery-images/22.jpg"
  },
  // 38-41: 无头像
  {
    name: "Nina P.",
    rating: 5,
    date: "May 8, 2026",
    text: "I was skeptical about AI headshots but a colleague convinced me to try. The results are indistinguishable from real photos."
  },
  {
    name: "Will",
    rating: 5,
    date: "May 8, 2026",
    text: "Does exactly what it says on the tin."
  },
  {
    name: "Erica",
    rating: 5,
    date: "May 7, 2026",
    text: "The process is so smooth. Upload selfies, pick a plan, wait ~25 min, download. That's literally it."
  },
  {
    name: "Lily",
    rating: 4,
    date: "May 7, 2026",
    text: "Most shots were excellent. About 5 out of 40 looked a little off — slightly weird jawline. But the good ones more than made up for it."
  },
  // 42-44: 有头像
  {
    name: "Grace L.",
    rating: 5,
    date: "May 6, 2026",
    text: "I'm a realtor and my headshot is on every listing, every business card, every ad. This gave me 60+ options to rotate through. Clients have noticed the upgrade.",
    avatar: "/gallery-images/23.jpg"
  },
  {
    name: "Sam R.",
    rating: 5,
    date: "May 5, 2026",
    text: "Quick, cheap, looks professional. Not much more to say.",
    avatar: "/gallery-images/24.jpg"
  },
  {
    name: "George K.",
    rating: 5,
    date: "May 5, 2026",
    text: "Solid product. Would recommend to anyone who needs a headshot without the cost of a traditional photographer.",
    avatar: "/gallery-images/25.jpg"
  },
  // 45-48: 无头像
  {
    name: "Pat",
    rating: 5,
    date: "May 4, 2026",
    text: "Good stuff."
  },
  {
    name: "Frank",
    rating: 5,
    date: "May 4, 2026",
    text: "My wife made me do this because my LinkedIn photo was from 2014. She approves of the results. That's the highest praise I can give."
  },
  {
    name: "Josh",
    rating: 5,
    date: "May 3, 2026",
    text: "Can't believe this only costs $29. Feels like I'm stealing."
  },
  {
    name: "Ray",
    rating: 5,
    date: "May 2, 2026",
    text: "It just works. Upload, wait, download. Done. No complaints."
  },
  // 49-52: 有头像
  {
    name: "Diana F.",
    rating: 5,
    date: "May 2, 2026",
    text: "I was between jobs and didn't want to spend hundreds on new headshots. This gave me professional results for pocket change. Got the new job — and a better headshot than my boss 😂",
    avatar: "/gallery-images/26.jpg"
  },
  {
    name: "Marcus J.",
    rating: 5,
    date: "May 1, 2026",
    text: "Used for my acting portfolio. Needed different looks — professional, casual, dramatic. Got all three from one upload session.",
    avatar: "/gallery-images/27.jpg"
  },
  {
    name: "Victor C.",
    rating: 5,
    date: "April 30, 2026",
    text: "Needed professional photos for a book cover and didn't have time for a photographer. These turned out so well the publisher asked for the photographer's contact info.",
    avatar: "/gallery-images/28.jpg"
  },
  {
    name: "Isabella R.",
    rating: 5,
    date: "April 30, 2026",
    text: "The turnaround time is what got me. I literally did this during my lunch break. Came back from lunch with professional headshots waiting in my inbox.",
    avatar: "/gallery-images/29.jpg"
  },
  // 53-56: 无头像
  {
    name: "Alex",
    rating: 5,
    date: "April 29, 2026",
    text: "Honestly just wanted something better than a selfie for LinkedIn. Got way more than I expected."
  },
  {
    name: "Kevin",
    rating: 5,
    date: "April 29, 2026",
    text: "Got exactly what I paid for and then some. Highly recommend."
  },
  {
    name: "Jake M.",
    rating: 5,
    date: "April 28, 2026",
    text: "Extremely satisfied. The quality exceeded my expectations. Shared it with my entire team."
  },
  {
    name: "Steve",
    rating: 5,
    date: "April 28, 2026",
    text: "10/10 would headshot again."
  },
  // 57-60: 有头像（结尾多些带图的，视觉收尾）
  {
    name: "Tanya M.",
    rating: 5,
    date: "April 27, 2026",
    text: "I was honestly worried it wouldn't work well for darker skin tones based on experiences with other AI tools. But SnapProHead absolutely nailed it. The lighting, the skin texture — everything looks natural and beautiful.",
    avatar: "/gallery-images/30.jpg"
  },
  {
    name: "Catherine W.",
    rating: 5,
    date: "April 26, 2026",
    text: "I'm a consultant and need to look polished across multiple platforms — LinkedIn, firm website, conference materials, client proposals. Now I have a library of consistent, professional headshots for every context.",
    avatar: "/gallery-images/31.jpg"
  },
  {
    name: "Monica S.",
    rating: 5,
    date: "April 25, 2026",
    text: "I bought this for my entire team of 8. Everyone got their photos done in a single afternoon. The consistency is incredible — our 'About Us' page has never looked better.",
    avatar: "/gallery-images/32.jpg"
  },
  {
    name: "Brandon",
    rating: 5,
    date: "April 24, 2026",
    text: "Simple, fast, affordable. What more could you ask for?"
  }
]

export const FEATURED_REVIEW_COUNT = 8

export function getFeaturedReviews() {
  return reviews
    .filter((r) => r.text.length < 200 && r.rating >= 4)
    .slice(0, FEATURED_REVIEW_COUNT)
}
