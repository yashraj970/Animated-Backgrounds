"use client"

import { useEffect, useRef } from "react"

export default function CirclesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let circles: Circle[] = []
    let frame = 0

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initCircles()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Circle class
    class Circle {
      x: number
      y: number
      radius: number
      maxRadius: number
      color: string
      phase: number
      speed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.maxRadius = 20 + Math.random() * 80
        this.radius = this.maxRadius * Math.random()
        this.color = `hsla(${340 + Math.random() * 40}, 80%, 60%, 0.15)` // Pink to purple
        this.phase = Math.random() * Math.PI * 2
        this.speed = 0.02 + Math.random() * 0.03
      }

      update() {
        // Pulsate radius
        this.radius = this.maxRadius * Math.abs(Math.sin(frame * this.speed + this.phase))
      }

      draw() {
        if (!ctx) return

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Initialize circles
    const initCircles = () => {
      circles = []
      const circleCount = Math.floor((canvas.width * canvas.height) / 15000) // Adjust density

      for (let i = 0; i < circleCount; i++) {
        circles.push(new Circle())
      }
    }

    // Animation loop
    const animate = () => {
      frame++
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#300030") // Dark purple
      gradient.addColorStop(1, "#100020") // Very dark purple/blue
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw circles
      circles.forEach((circle) => {
        circle.update()
        circle.draw()
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

