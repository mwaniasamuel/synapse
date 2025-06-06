import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Download, ImageIcon, Palette, Monitor, Chrome, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ChromeStoreAssets() {
  const iconSizes = [
    { size: "16x16", description: "Toolbar icon (small)" },
    { size: "32x32", description: "Toolbar icon (medium)" },
    { size: "48x48", description: "Extension management page" },
    { size: "128x128", description: "Chrome Web Store listing" },
    { size: "192x192", description: "PWA icon" },
    { size: "512x512", description: "Chrome Web Store large icon" },
  ]

  const promotionalImages = [
    {
      size: "1280x800",
      name: "Large Promotional Tile",
      description: "Main promotional image for Chrome Web Store",
      required: true,
    },
    {
      size: "440x280",
      name: "Small Promotional Tile",
      description: "Secondary promotional image",
      required: true,
    },
    {
      size: "920x680",
      name: "Marquee Promotional Tile",
      description: "Featured section promotional image",
      required: false,
    },
  ]

  const screenshots = [
    {
      name: "Extension Popup",
      description: "Main extension interface showing cognitive state",
      size: "1280x800",
    },
    {
      name: "Dashboard View",
      description: "Knowledge mapping and analytics dashboard",
      size: "1280x800",
    },
    {
      name: "Content Adaptation",
      description: "Before and after content adaptation example",
      size: "1280x800",
    },
    {
      name: "Settings Panel",
      description: "Extension configuration and preferences",
      size: "1280x800",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Chrome Store Assets
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            <Chrome className="w-3 h-3 mr-1" />
            Chrome Web Store Assets
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
            Complete Asset Package for Chrome Web Store Submission
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            All required icons, promotional images, and screenshots optimized for Chrome Web Store listing and extension
            functionality.
          </p>
        </div>

        {/* Icons Section */}
        <section className="mb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Extension Icons</h2>
            <p className="text-lg text-slate-600">
              Complete icon set for all Chrome extension contexts and display sizes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {iconSizes.map((icon, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 relative">
                    <div
                      className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
                      style={{
                        width: Math.min(Number.parseInt(icon.size.split("x")[0]), 64),
                        height: Math.min(Number.parseInt(icon.size.split("x")[1]), 64),
                      }}
                    >
                      <Brain className="text-white" style={{ width: "60%", height: "60%" }} />
                    </div>
                    <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white text-slate-700 border">
                      {icon.size}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">icon-{icon.size}.png</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{icon.description}</CardDescription>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Promotional Images Section */}
        <section className="mb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Promotional Images</h2>
            <p className="text-lg text-slate-600">High-quality promotional tiles for Chrome Web Store marketing</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {promotionalImages.map((promo, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{promo.name}</CardTitle>
                    {promo.required && (
                      <Badge variant="destructive" className="bg-red-100 text-red-700">
                        Required
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{promo.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center relative overflow-hidden"
                    style={{ aspectRatio: promo.size.replace("x", "/") }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-700/20" />
                    <div className="text-center text-white z-10">
                      <Brain className="w-16 h-16 mx-auto mb-4 opacity-80" />
                      <h3 className="text-2xl font-bold mb-2">Synapse</h3>
                      <p className="text-sm opacity-90">Cognitive Learning Acceleration</p>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 text-white border-white/30">{promo.size}</Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download PNG
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Palette className="w-4 h-4 mr-2" />
                      Edit Design
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Screenshots Section */}
        <section className="mb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Extension Screenshots</h2>
            <p className="text-lg text-slate-600">Showcase screenshots demonstrating key features and functionality</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {screenshots.map((screenshot, index) => (
              <Card key={index} className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{screenshot.name}</CardTitle>
                  <CardDescription>{screenshot.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center"
                    style={{ aspectRatio: "16/10" }}
                  >
                    <div className="text-center text-slate-500">
                      <Monitor className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-sm font-medium">{screenshot.size}</p>
                      <p className="text-xs">Screenshot Preview</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="mb-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Technical Specifications</h2>
            <p className="text-lg text-slate-600">Chrome Web Store asset requirements and guidelines</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  <span>Icon Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Format</span>
                    <Badge variant="secondary">PNG</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Color Space</span>
                    <Badge variant="secondary">sRGB</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Transparency</span>
                    <Badge variant="secondary">Supported</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Max File Size</span>
                    <Badge variant="secondary">2MB</Badge>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-2">Required Sizes</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {["16x16", "32x32", "48x48", "128x128"].map((size) => (
                      <Badge key={size} variant="outline" className="justify-center">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-green-600" />
                  <span>Promotional Images</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Format</span>
                    <Badge variant="secondary">PNG or JPEG</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Quality</span>
                    <Badge variant="secondary">High Resolution</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Text Overlay</span>
                    <Badge variant="secondary">Minimal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Max File Size</span>
                    <Badge variant="secondary">16MB</Badge>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-2">Required Sizes</h4>
                  <div className="space-y-1 text-xs">
                    <Badge variant="outline" className="w-full justify-center">
                      1280x800 (Large Tile)
                    </Badge>
                    <Badge variant="outline" className="w-full justify-center">
                      440x280 (Small Tile)
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Download All Section */}
        <section className="text-center">
          <Card className="border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-12">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-3xl font-bold text-slate-900">Complete Asset Package</h2>
                  <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Download the complete package containing all icons, promotional images, and screenshots ready for
                    Chrome Web Store submission.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8">
                    <Download className="mr-2 h-5 w-5" />
                    Download Complete Package
                  </Button>
                  <Button variant="outline" size="lg">
                    <Chrome className="mr-2 h-5 w-5" />
                    View Store Guidelines
                  </Button>
                </div>
                <div className="flex items-center justify-center space-x-6 pt-4 text-sm text-slate-500">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>All sizes included</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Store compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>High resolution</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
