export interface Review {
  id: string
  name: string
  avatar: string
  role: string
  rating: number
  text: string
  date: string
}

export const reviews: Review[] = [
  {
    id: "1",
    name: "Sarah M.",
    avatar: "/avatars/sarah.jpg",
    role: "Marketing Director",
    rating: 5,
    text: "Absolutely love my AI headshots! The quality is amazing and saved me so much time.",
    date: "2024-01-15"
  },
  {
    id: "2",
    name: "John D.",
    avatar: "/avatars/john.jpg",
    role: "Software Engineer",
    rating: 5,
    text: "Best investment for my professional profile. Highly recommend!",
    date: "2024-01-20"
  },
  {
    id: "3",
    name: "Emily R.",
    avatar: "/avatars/emily.jpg",
    role: "Product Manager",
    rating: 5,
    text: "The turnaround time is incredible. Got my headshots in 30 minutes!",
    date: "2024-02-01"
  },
  {
    id: "4",
    name: "Michael T.",
    avatar: "/avatars/michael.jpg",
    role: "Consultant",
    rating: 4,
    text: "Great quality headshots. The AI did a fantastic job capturing my features.",
    date: "2024-02-10"
  },
  {
    id: "5",
    name: "Jessica L.",
    avatar: "/avatars/jessica.jpg",
    role: "Sales Manager",
    rating: 5,
    text: "Perfect for LinkedIn and professional use. Will definitely use again!",
    date: "2024-02-15"
  },
  {
    id: "6",
    name: "David K.",
    avatar: "/avatars/david.jpg",
    role: "Entrepreneur",
    rating: 5,
    text: "The different styles are amazing. Got exactly what I needed for my business.",
    date: "2024-03-01"
  },
  {
    id: "7",
    name: "Lisa W.",
    avatar: "/avatars/lisa.jpg",
    role: "Lawyer",
    rating: 4,
    text: "Very impressed with the results. The headshots look professional and natural.",
    date: "2024-03-10"
  },
  {
    id: "8",
    name: "Robert H.",
    avatar: "/avatars/robert.jpg",
    role: "Executive",
    rating: 5,
    text: "Excellent service! The AI technology is truly impressive.",
    date: "2024-03-15"
  }
]
