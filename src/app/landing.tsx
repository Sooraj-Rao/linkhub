"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
  ArrowRight,
  Rocket,
  Globe,
  Play,
  Palette,
  BarChart2,
  Link2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PublicProfile from "@/components/public/public-profile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/dashboard/dashboard-sidebar";

const InteractiveDemo = () => {
  const [activeTab, setActiveTab] = useState("design");

  const demoFeatures = {
    design: {
      title: "Beautiful Customization",
      description:
        "Design stunning pages with powerful tools—custom themes, background images, colors, and more.",
      preview: (
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-primary/20 to-primary/10 rounded" />
            <div className="h-3 bg-gradient-to-r from-primary/15 to-primary/5 rounded w-3/4" />
          </div>
        </div>
      ),
    },
    mobile: {
      title: "Create Multiple LinkHubs",
      description:
        "Build and manage multiple LinkHubs to suit different purposes or audiences.",
      preview: (
        <div className="flex justify-center">
          <div className="w-16 h-24 bg-gradient-to-b from-muted to-muted/50 rounded-lg border-2 border-muted-foreground/20 flex flex-col items-center justify-center">
            <div className="w-8 h-1 bg-muted-foreground/30 rounded mb-2" />
            <div className="space-y-1">
              <div className="w-10 h-2 bg-primary/30 rounded" />
              <div className="w-8 h-2 bg-primary/20 rounded" />
              <div className="w-10 h-2 bg-primary/30 rounded" />
            </div>
          </div>
        </div>
      ),
    },
    analytics: {
      title: "Click Analytics",
      description: "Track how many times each of your links is clicked.",
      preview: (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Total Clicks</span>
            <span className="font-bold text-primary">2,847</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-primary/50"
              initial={{ width: 0 }}
              animate={{ width: "68%" }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
          </div>
        </div>
      ),
    },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid bg-primary/10 rounded-full w-full grid-cols-3 mb-8">
          <TabsTrigger
            value="design"
            className="flex items-center rounded-full space-x-2"
          >
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Design</span>
          </TabsTrigger>
          <TabsTrigger
            value="mobile"
            className="flex items-center rounded-full space-x-2"
          >
            <Link2Icon className="h-4 w-4" />
            <span className="hidden sm:inline">Multiple LinkHubs</span>
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="flex items-center space-x-2 rounded-full"
          >
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        {Object.entries(demoFeatures).map(([key, feature]) => (
          <TabsContent key={key} value={key}>
            <Card className="border-0 bg-gradient-to-br from-card/50 to-transparent backdrop-blur">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                    <p className="text-muted-foreground text-lg mb-6">
                      {feature.description}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-2xl p-6 backdrop-blur">
                    {feature.preview}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

const linkhub = {
  id: "lhub_abc123",
  userId: "user_xyz789",
  name: "Sooraj Rao",
  slug: "sooraj",
  bio: "Software Developer",
  avatar: "https://soorajrao.in/favicon.ico",
  theme: "modern",
  backgroundType: "gradient",
  backgroundColor: "#f0f4f8",
  backgroundGradient: "linear-gradient(135deg,  0%, #000000 100%)",
  backgroundImage: null,
  textColor: "white",
  buttonStyle: "12px",
  buttonColor: "black",
  buttonTextColor: "#ffffff",
  borderRadius: 12,
  shadowStyle: "soft",
  isPersonal: true,
  isActive: true,
  createdAt: new Date("2025-08-03T12:00:00.000Z"),
  updatedAt: new Date("2025-08-03T12:00:00.000Z"),
  links: [
    {
      id: "",
      linkHubId: "",
      title: "My Portfolio",
      url: "https://soorajrao.in",
      description: "Personal blog and portfolio",
      icon: "https://soorajrao.in/favicon.ico",
      type: "link",
      order: 0,
      isActive: true,
      clicks: 0,
      createdAt: new Date("2025-08-03T12:00:00.000Z"),
      updatedAt: new Date("2025-08-03T12:00:00.000Z"),
    },
    {
      id: "",
      linkHubId: "",
      title: "Showfolio",
      url: "https://showfolio.soorajrao.in",
      description: "Resume Organizer and Portfolio builder",
      icon: "https://showfolio.soorajrao.in/favicon.ico",
      type: "link",
      order: 1,
      isActive: true,
      clicks: 0,
      createdAt: new Date("2025-08-03T12:00:00.000Z"),
      updatedAt: new Date("2025-08-03T12:00:00.000Z"),
    },
    {
      id: "",
      linkHubId: "",
      title: "Mailory",
      url: "https://mailory.site",
      description: "Simple Email for Developers",
      icon: "https://mailory.site/favicon.ico",
      type: "link",
      order: 2,
      isActive: true,
      clicks: 0,
      createdAt: new Date("2025-08-03T12:00:00.000Z"),
      updatedAt: new Date("2025-08-03T12:00:00.000Z"),
    },
    {
      id: "",
      linkHubId: "",
      title: "More Projects",
      url: "https://www.soorajrao.in/?ref=linkhub_srj18#projects",
      description: "Check my other projects",
      icon: "https://quickmart.soorajrao.in/Images/Home/banner2.jpg",
      type: "link",
      order: 3,
      isActive: true,
      clicks: 0,
      createdAt: new Date("2025-08-03T12:00:00.000Z"),
      updatedAt: new Date("2025-08-03T12:00:00.000Z"),
    },
  ],
};

function HomePage() {
  const heroRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: false, amount: 0.2 });

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-black">
      <header className=" flex py-3 backdrop-blur z-[99]  px-10 sticky left-0 top-0 items-center justify-between">
        <Logo />
        <Link href={'/auth/register'}>
        <Button>Get Started</Button>
        </Link>
      </header>
      <div className="  overflow-x-hidden">
        <section
          ref={heroRef}
          className="relative pt-10 pb-8 md:pt-24 md:pb-20 lg:pt-32 lg:pb-24 min-h-screen flex items-center"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 md:w-[32rem] md:h-[32rem] bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-primary/5 to-transparent rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center max-w-5xl mx-auto">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl   font-bold mb-8 leading-tight"
              >
                Share Everything with
                <span className="bg-gradient-to-r ml-2 relative from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  One Link
                  <motion.div
                    className="mt-2 ml-1 sm:h-2 h-1 rounded-xl bg-gradient-to-r bottom-0 left-0 absolute from-primary to-primary/50"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
              >
                Create a beautiful, customizable hub for all your content. Share
                your social media, website, store, videos, music, and more with
                just one link.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    className="px-8 py-6 text-base md:text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                  >
                    Create Your LinkHub
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="#preview">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-base md:text-lg font-semibold bg-transparent hover:bg-primary/5 group"
                  >
                    <Play className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="preview" className=" md:py-24 ">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  See It In Action
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Here&apos;s how your LinkHub will look to your audience
                </p>
              </div>
            </div>

            <div className="max-w-md mx-auto ">
              <Card className="shadow-2xl bg-transparent border-0 overflow-hidden backdrop-blur-xl">
                <div className="bg-muted/50 border-b px-4 py-3 flex items-center space-x-2">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex-1 bg-background/50 rounded-md h-6 flex items-center px-3">
                    <Globe className="h-3 w-3 mr-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      linkhub.soorajrao.in/sooraj
                    </span>
                  </div>
                </div>
                <CardContent className="m-0 p-0">
                  <PublicProfile linkHub={linkhub} track={false} />
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className=" md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  Key Features
                </h2>
              </div>
            </div>

            <div>
              <InteractiveDemo />
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32   relative overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Get Started?
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/login">
                  <Button
                    size="lg"
                    className="px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
                  >
                    Create Your LinkHub Now
                    <Rocket className="ml-2 h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
        <footer className=" flex justify-center  items-center py-10 text-sm">
          <p>
            Developed by
            <a
              href="https://soorajrao.in?ref=linkub_footer"
              className=" ml-1 text-primary hover:underline"
              target="_blank"
            >
              Sooraj Rao
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default HomePage;
