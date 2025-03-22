"use client"

import { useEffect, useRef } from "react"

export default function BubblesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let bubbles: Bubble[] = []

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initBubbles()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Bubble class
    class Bubble {
      x: number
      y: number
      radius: number
      speed: number
      color: string
      wobble: number
      wobbleSpeed: number

      constructor() {
        this.radius = 5 + Math.random() * 30
        this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius
        this.y = canvas.height + this.radius
        this.speed = 0.5 + Math.random() * 2

        // Bubble color with transparency
        const hue = 180 + Math.random() * 40 // Blue-green range
        this.color = `hsla(${hue}, 80%, 70%, ${0.2 + Math.random() * 0.3})`

        // Wobble properties for natural movement
        this.wobble = Math.random() * Math.PI * 2
        this.wobbleSpeed = 0.03 + Math.random() * 0.03
      }

      update() {
        // Move upward
        this.y -= this.speed

        // Horizontal wobble
        this.x += Math.sin(this.wobble) * 0.5
        this.wobble += this.wobbleSpeed

        // Reset if out of screen
        if (this.y < -this.radius * 2) {
          this.y = canvas.height + this.radius
          this.x = Math.random() * (canvas.width - this.radius * 2) + this.radius
        }
      }

      draw() {
        if (!ctx) return

        // Draw bubble
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)

        // Bubble gradient
        const gradient = ctx.createRadialGradient(
          this.x - this.radius * 0.3,
          this.y - this.radius * 0.3,
          this.radius * 0.1,
          this.x,
          this.y,
          this.radius,
        )
        gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)")
        gradient.addColorStop(0.2, this.color)
        gradient.addColorStop(1, "rgba(255, 255, 255, 0.1)")

        ctx.fillStyle = gradient
        ctx.fill()

        // Highlight
        ctx.beginPath()
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fill()
      }
    }

    // Initialize bubbles
    const initBubbles = () => {
      bubbles = []
      const bubbleCount = Math.floor((canvas.width * canvas.height) / 10000) // Adjust density

      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push(new Bubble())
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#0c4a6e") // Light blue
      gradient.addColorStop(1, "#082f49") // Dark blue
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw bubbles
      bubbles.forEach((bubble) => {
        bubble.update()
        bubble.draw()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

