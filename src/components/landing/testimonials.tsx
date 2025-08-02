import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Content Creator",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "LinkHub transformed how I share my content. The analytics help me understand my audience better, and the customization options are endless!",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Small Business Owner",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "Perfect for my business. I can showcase all my services, track which ones get the most interest, and the professional look builds trust.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Influencer",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The drag-and-drop feature is so intuitive! I love how I can organize my links by topic and see real-time engagement data.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Musician",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "As a musician, I need to share multiple platforms. LinkHub makes it easy and the QR codes are perfect for my gig posters!",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "Freelancer",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "The custom domain feature gives me a professional edge. Clients love the clean, organized way I present my portfolio and services.",
    rating: 5,
  },
  {
    name: "Alex Park",
    role: "YouTuber",
    avatar: "/placeholder.svg?height=60&width=60",
    content:
      "LinkHub analytics show me exactly which content resonates with my audience. It's like having a marketing team in my pocket!",
    rating: 5,
  },
]

export default function Testimonials() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Loved by creators
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              around the world
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of creators who have transformed their online presence with LinkHub
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <Quote className="w-8 h-8 text-purple-400 mb-4" />

              <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.content}</p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
