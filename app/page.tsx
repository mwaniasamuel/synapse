import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Target,
  Network,
  BarChart3,
  Globe,
  ArrowRight,
  CheckCircle,
  Zap,
  Shield,
  Chrome,
  Download,
  Monitor,
  BookOpen,
  Eye,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Synapse
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              How It Works
            </Link>
            <Link href="#research" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              Research
            </Link>
            <Link href="#about" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link
              href="/chrome-store-assets"
              className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
            >
              Store Assets
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
              Documentation
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              asChild
            >
              <Link href="/chrome-store-assets">
                <Chrome className="w-4 h-4 mr-2" />
                Store Assets
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  <Chrome className="w-3 h-3 mr-1" />
                  Chrome Extension
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                    Cognitive Learning
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Acceleration Platform
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
                  A revolutionary Chrome extension that adapts to your cognitive patterns in real-time, optimizing
                  content presentation and building personalized knowledge maps to accelerate your learning journey.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Install from Chrome Web Store
                </Button>
                <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Documentation
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Open Source
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                    Privacy-First
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                    Research-Based
                  </Badge>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <Image
                  src="/images/hero-education.webp"
                  alt="Digital learning visualization showing an open book on a laptop with futuristic network connections"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">Cognitive State</h3>
                      <Badge className="bg-green-100 text-green-700">Focused</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Attention Level</span>
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-4/5 h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">Learning Efficiency</span>
                        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-5/6 h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full opacity-20 animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-20 animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700">
              Core Features
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Intelligent Learning Acceleration</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Synapse combines cognitive science with cutting-edge technology to create a personalized learning
              environment that adapts to your unique patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Cognitive State Detection",
                description:
                  "Real-time analysis of your browser interaction patterns to identify focus, fatigue, and optimal learning states through typing rhythm, mouse movements, and scrolling behavior.",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: Target,
                title: "Adaptive Content Presentation",
                description:
                  "Dynamic content modification based on your cognitive state - simplified layouts during fatigue, enhanced highlighting during peak focus periods.",
                color: "from-green-500 to-teal-600",
              },
              {
                icon: Network,
                title: "Knowledge Mapping",
                description:
                  "Automatic extraction and visualization of concept relationships across your learning journey, building a personal knowledge graph.",
                color: "from-purple-500 to-pink-600",
              },
              {
                icon: BarChart3,
                title: "Learning Analytics",
                description:
                  "Comprehensive insights into your learning patterns, cognitive state transitions, and knowledge acquisition progress.",
                color: "from-orange-500 to-red-600",
              },
              {
                icon: Eye,
                title: "Session Management",
                description:
                  "Create focused learning sessions with specific goals, track progress, and receive personalized recommendations.",
                color: "from-yellow-500 to-orange-600",
              },
              {
                icon: Shield,
                title: "Privacy-First Design",
                description:
                  "All processing happens locally in your browser with encrypted storage and complete user control over data.",
                color: "from-slate-500 to-slate-700",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300 border-slate-200 hover:border-slate-300"
              >
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              How It Works
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Three Steps to Enhanced Learning</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Install & Configure",
                description:
                  "Install the Synapse Chrome extension from the Web Store and complete the initial setup to calibrate cognitive pattern detection.",
                icon: Download,
              },
              {
                step: "02",
                title: "Learn & Adapt",
                description:
                  "Browse educational content naturally while Synapse analyzes your interaction patterns and adapts content presentation in real-time.",
                icon: Target,
              },
              {
                step: "03",
                title: "Connect & Grow",
                description:
                  "Build a personalized knowledge graph that reveals connections between concepts and accelerates understanding across domains.",
                icon: Network,
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{step.step}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-slate-900">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
                {index < 2 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              Research Foundation
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Evidence-Based Learning Enhancement</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our approach is grounded in cognitive science research and addresses real challenges in digital learning
              environments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { value: "8 sec", label: "Average attention span in 2024", color: "text-blue-600", trend: "down" },
              { value: "2.5 hrs", label: "Daily time lost to distractions", color: "text-red-600", trend: "up" },
              { value: "76%", label: "Learners report focus difficulties", color: "text-orange-600", trend: "up" },
              { value: "82%", label: "Struggle to connect concepts", color: "text-purple-600", trend: "up" },
            ].map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`text-4xl lg:text-5xl font-bold ${stat.color}`}>{stat.value}</div>
                  <TrendingUp
                    className={`w-6 h-6 ${stat.trend === "up" ? "text-red-500" : "text-green-500"} ${stat.trend === "down" ? "rotate-180" : ""}`}
                  />
                </div>
                <div className="text-slate-600 leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl lg:text-3xl font-bold text-slate-900">
                  Addressing African Learning Challenges
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  With 570 million mobile internet users across Africa and growing demand for accessible digital
                  learning solutions, Synapse addresses critical needs in educational technology that works with limited
                  resources and diverse learning contexts.
                </p>
                <div className="space-y-3">
                  {[
                    "60% of students lack practical digital learning tools (UNESCO, 2023)",
                    "68% struggle with online focus due to poor platform design (EduTech Africa, 2022)",
                    "22% improved engagement in adaptive learning trials (Kenya & Nigeria, 2023)",
                    "12% annual growth in mobile internet usage (GSMA, 2024)",
                  ].map((point, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 p-8 flex items-center justify-center">
                  <Globe className="w-24 h-24 text-white opacity-80" />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-4 shadow-lg border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <Monitor className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-slate-900">570M+ Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              Technical Specifications
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Built for Performance & Privacy</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Browser Compatibility",
                items: ["Chrome 88+", "Edge 88+", "Opera 74+", "Firefox (planned)"],
                icon: Chrome,
              },
              {
                title: "Performance",
                items: ["<3s page load impact", "<5% CPU usage", "<100MB memory", "Real-time processing"],
                icon: Zap,
              },
              {
                title: "Privacy & Security",
                items: ["Local processing only", "Encrypted data storage", "GDPR compliant", "No external tracking"],
                icon: Shield,
              },
            ].map((spec, index) => (
              <Card key={index} className="border-slate-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <spec.icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-slate-900">{spec.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {spec.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to Transform Your Learning?</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Install the Synapse Chrome extension and experience cognitive learning acceleration designed for the
              modern digital learner.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8">
                <Chrome className="mr-2 h-4 w-4" />
                Install Chrome Extension
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Synapse</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Revolutionizing digital learning through cognitive adaptation and intelligent knowledge mapping.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Extension</h4>
              <div className="space-y-2">
                <Link href="#" className="block hover:text-white transition-colors">
                  Install
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  System Requirements
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  Release Notes
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Resources</h4>
              <div className="space-y-2">
                <Link href="#" className="block hover:text-white transition-colors">
                  Documentation
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  Research Papers
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  Developer API
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  Support
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Project</h4>
              <div className="space-y-2">
                <Link href="#" className="block hover:text-white transition-colors">
                  About
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="block hover:text-white transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center">
            <p className="text-slate-400">
              © 2024 Synapse Cognitive Learning Platform. Open source project for educational advancement.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
