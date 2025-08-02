import { LinkIcon, Palette, BarChart3, Share2, Shield, Smartphone, Zap, Globe, QrCode } from "lucide-react"

const features = [
  {
    icon: LinkIcon,
    title: "Unlimited Links",
    description:
      "Add unlimited links with custom titles. Organize them into collections and reorder with drag-and-drop.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Palette,
    title: "Full Customization",
    description: "Upload profile images, choose themes, custom backgrounds, and see changes in real-time preview.",
    gradient: "from-pink-500 to-red-500",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Track clicks, page views, and engagement. Get insights with beautiful charts and detailed stats.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Get custom URLs, generate QR codes, and embed your links anywhere. Perfect for social media.",
    gradient: "from-green-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Enterprise-grade security with JWT authentication, CSRF protection, and data encryption.",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Fully responsive design that looks perfect on all devices. Mobile-first approach.",
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with Next.js for optimal performance. Fast loading times and smooth interactions.",
    gradient: "from-purple-500 to-blue-500",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Use your own domain name for professional branding. Easy DNS setup and SSL included.",
    gradient: "from-teal-500 to-green-500",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description: "Generate beautiful QR codes for offline sharing. Perfect for business cards and print materials.",
    gradient: "from-red-500 to-pink-500",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              build your digital presence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed to help creators, businesses, and influencers showcase their online presence
            beautifully and effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="glass rounded-2xl p-8 hover:scale-105 transition-all duration-300 group">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
