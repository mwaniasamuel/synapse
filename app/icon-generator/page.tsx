"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Brain, Download, Palette, RotateCcw, ArrowLeft, Zap, Circle, Square } from "lucide-react"
import Link from "next/link"

export default function IconGenerator() {
  const [iconColor, setIconColor] = useState("#3b82f6")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [borderRadius, setBorderRadius] = useState([20])
  const [iconSize, setIconSize] = useState([60])
  const [gradientEnabled, setGradientEnabled] = useState(true)

  const iconSizes = [
    { size: 16, name: "16x16", description: "Toolbar (small)" },
    { size: 32, name: "32x32", description: "Toolbar (medium)" },
    { size: 48, name: "48x48", description: "Extension page" },
    { size: 128, name: "128x128", description: "Web Store" },
    { size: 192, name: "192x192", description: "PWA" },
    { size: 512, name: "512x512", description: "Large display" },
  ]

  const presetColors = [
    { name: "Blue", primary: "#3b82f6", secondary: "#1d4ed8" },
    { name: "Indigo", primary: "#6366f1", secondary: "#4338ca" },
    { name: "Purple", primary: "#8b5cf6", secondary: "#7c3aed" },
    { name: "Green", primary: "#10b981", secondary: "#059669" },
    { name: "Orange", primary: "#f59e0b", secondary: "#d97706" },
    { name: "Red", primary: "#ef4444", secondary: "#dc2626" },
  ]

  const generateIcon = (size: number) => {
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext("2d")

    if (!ctx) return ""

    // Background
    if (gradientEnabled) {
      const gradient = ctx.createLinearGradient(0, 0, size, size)
      gradient.addColorStop(0, iconColor)
      gradient.addColorStop(1, iconColor + "80")
      ctx.fillStyle = gradient
    } else {
      ctx.fillStyle = backgroundColor
    }

    // Apply border radius
    const radius = (borderRadius[0] / 100) * (size / 2)
    ctx.beginPath()
    ctx.roundRect(0, 0, size, size, radius)
    ctx.fill()

    // Brain icon (simplified)
    const iconSizePercent = iconSize[0] / 100
    const brainSize = size * iconSizePercent * 0.6
    const centerX = size / 2
    const centerY = size / 2

    ctx.fillStyle = gradientEnabled ? "#ffffff" : iconColor
    ctx.strokeStyle = gradientEnabled ? "#ffffff" : iconColor
    ctx.lineWidth = size * 0.02

    // Draw simplified brain shape
    ctx.beginPath()
    ctx.ellipse(centerX, centerY, brainSize * 0.4, brainSize * 0.35, 0, 0, Math.PI * 2)
    ctx.fill()

    // Add some brain details
    ctx.beginPath()
    ctx.ellipse(
      centerX - brainSize * 0.15,
      centerY - brainSize * 0.1,
      brainSize * 0.15,
      brainSize * 0.12,
      0,
      0,
      Math.PI * 2,
    )
    ctx.stroke()

    ctx.beginPath()
    ctx.ellipse(
      centerX + brainSize * 0.15,
      centerY - brainSize * 0.1,
      brainSize * 0.15,
      brainSize * 0.12,
      0,
      0,
      Math.PI * 2,
    )
    ctx.stroke()

    return canvas.toDataURL("image/png")
  }

  const downloadIcon = (size: number, name: string) => {
    const dataUrl = generateIcon(size)
    const link = document.createElement("a")
    link.download = `synapse-icon-${name}.png`
    link.href = dataUrl
    link.click()
  }

  const downloadAllIcons = () => {
    iconSizes.forEach((icon) => {
      setTimeout(() => downloadIcon(icon.size, icon.name), icon.size) // Stagger downloads
    })
  }

  const resetToDefaults = () => {
    setIconColor("#3b82f6")
    setBackgroundColor("#ffffff")
    setBorderRadius([20])
    setIconSize([60])
    setGradientEnabled(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link
              href="/chrome-store-assets"
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Back to Assets</span>
            </Link>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Icon Generator
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="w-5 h-5 text-blue-600" />
                  <span>Customize Icon</span>
                </CardTitle>
                <CardDescription>Adjust colors, size, and style to match your brand</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Color Presets */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Color Presets</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {presetColors.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        className="h-12 p-2"
                        onClick={() => setIconColor(preset.primary)}
                      >
                        <div
                          className="w-full h-full rounded"
                          style={{
                            background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                          }}
                        />
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Primary Color */}
                <div className="space-y-3">
                  <Label htmlFor="iconColor" className="text-sm font-medium">
                    Primary Color
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="iconColor"
                      type="color"
                      value={iconColor}
                      onChange={(e) => setIconColor(e.target.value)}
                      className="w-16 h-10 p-1 border-slate-300"
                    />
                    <Input
                      type="text"
                      value={iconColor}
                      onChange={(e) => setIconColor(e.target.value)}
                      className="flex-1"
                      placeholder="#3b82f6"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-3">
                  <Label htmlFor="backgroundColor" className="text-sm font-medium">
                    Background Color
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-16 h-10 p-1 border-slate-300"
                      disabled={gradientEnabled}
                    />
                    <Input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1"
                      placeholder="#ffffff"
                      disabled={gradientEnabled}
                    />
                  </div>
                </div>

                {/* Gradient Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="gradient"
                    checked={gradientEnabled}
                    onChange={(e) => setGradientEnabled(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <Label htmlFor="gradient" className="text-sm font-medium">
                    Use gradient background
                  </Label>
                </div>

                {/* Border Radius */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Border Radius: {borderRadius[0]}%</Label>
                  <Slider
                    value={borderRadius}
                    onValueChange={setBorderRadius}
                    max={50}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Icon Size */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Icon Size: {iconSize[0]}%</Label>
                  <Slider value={iconSize} onValueChange={setIconSize} max={100} min={30} step={5} className="w-full" />
                </div>

                {/* Reset Button */}
                <Button variant="outline" onClick={resetToDefaults} className="w-full">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview and Download */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Preview */}
            <Card className="border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-green-600" />
                  <span>Live Preview</span>
                </CardTitle>
                <CardDescription>See how your icon looks at different sizes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {iconSizes.map((icon) => (
                    <div key={icon.size} className="text-center space-y-3">
                      <div className="flex justify-center">
                        <img
                          src={generateIcon(icon.size) || "/placeholder.svg"}
                          alt={`Icon ${icon.name}`}
                          className="border border-slate-200 rounded"
                          style={{
                            width: Math.min(icon.size, 64),
                            height: Math.min(icon.size, 64),
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{icon.name}</div>
                        <div className="text-xs text-slate-500">{icon.description}</div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadIcon(icon.size, icon.name)}
                        className="w-full"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Download All */}
            <Card className="border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-8 text-center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Download Complete Icon Set</h3>
                    <p className="text-slate-600">Get all icon sizes optimized for Chrome Web Store submission</p>
                  </div>
                  <Button size="lg" onClick={downloadAllIcons} className="bg-gradient-to-r from-blue-500 to-indigo-600">
                    <Download className="mr-2 h-5 w-5" />
                    Download All Icons
                  </Button>
                  <div className="flex items-center justify-center space-x-4 pt-2 text-sm text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Circle className="w-2 h-2 fill-current" />
                      <span>6 sizes included</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Square className="w-2 h-2 fill-current" />
                      <span>PNG format</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
