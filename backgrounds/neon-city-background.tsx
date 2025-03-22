"use client"

import { useEffect, useRef } from "react"

export default function NeonCityBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let buildings: Building[] = []
    let lights: Light[] = []
    let particles: Particle[] = []
    let time = 0

    // Class declarations
    class Building {
      x: number
      width: number
      height: number
      color: string
      windows: { x: number; y: number; lit: boolean; flickerRate: number }[]

      constructor(x: number, width: number) {
        this.x = x
        this.width = width
        this.height = canvas!.height * (0.3 + Math.random() * 0.5)
        this.color = `rgb(${10 + Math.random() * 15}, ${10 + Math.random() * 15}, ${20 + Math.random() * 20})`

        this.windows = []
        const windowSize = 5
        const windowSpacing = 10
        const windowRows = Math.floor((this.height - 50) / windowSpacing)
        const windowCols = Math.floor((this.width - 10) / windowSpacing)

        for (let row = 0; row < windowRows; row++) {
          for (let col = 0; col < windowCols; col++) {
            if (Math.random() > 0.8) continue

            this.windows.push({
              x: 5 + col * windowSpacing,
              y: 5 + row * windowSpacing,
              lit: Math.random() > 0.3,
              flickerRate: Math.random() > 0.9 ? 0.05 + Math.random() * 0.1 : 0,
            })
          }
        }
      }

      update(time: number) {
        this.windows.forEach((window) => {
          if (window.flickerRate > 0 && Math.random() < window.flickerRate) {
            window.lit = !window.lit
          }
        })
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, canvas!.height - this.height, this.width, this.height)

        this.windows.forEach((window) => {
          if (window.lit) {
            ctx.fillStyle = "rgba(255, 255, 150, 0.1)"
            ctx.fillRect(this.x + window.x - 2, canvas!.height - this.height + window.y - 2, 9, 9)

            ctx.fillStyle = "rgba(255, 255, 150, 0.8)"
            ctx.fillRect(this.x + window.x, canvas!.height - this.height + window.y, 5, 5)
          } else {
            ctx.fillStyle = "rgba(50, 50, 80, 0.8)"
            ctx.fillRect(this.x + window.x, canvas!.height - this.height + window.y, 5, 5)
          }
        })
      }
    }

    class Light {
      x: number
      y: number
      radius: number
      color: string
      intensity: number
      flickerSpeed: number

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = canvas!.height - 100 - Math.random() * 300
        this.radius = 2 + Math.random() * 5

        const colors = [
          "rgba(255, 0, 128, 0.8)",
          "rgba(0, 255, 255, 0.8)",
          "rgba(255, 0, 255, 0.8)",
          "rgba(128, 0, 255, 0.8)",
          "rgba(0, 128, 255, 0.8)",
          "rgba(255, 128, 0, 0.8)",
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.intensity = 0.5 + Math.random() * 0.5
        this.flickerSpeed = Math.random() > 0.7 ? 0.05 + Math.random() * 0.1 : 0
      }

      update(time: number) {
        if (this.flickerSpeed > 0) {
          this.intensity = 0.5 + Math.sin(time * this.flickerSpeed * 10) * 0.5
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 10)
        gradient.addColorStop(0, this.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius * 10, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.globalAlpha = this.intensity * 0.5
        ctx.fill()

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
        ctx.globalAlpha = this.intensity
        ctx.fill()
        ctx.globalAlpha = 1
      }
    }

    class Particle {
      x: number
      y: number
      size: number
      speed: number
      color: string

      constructor() {
        this.x = Math.random() * canvas!.width
        this.y = Math.random() * canvas!.height
        this.size = 0.5 + Math.random() * 1
        this.speed = 1 + Math.random() * 3
        this.color = `rgba(100, 150, 255, ${0.1 + Math.random() * 0.2})`
      }

      update() {
        this.y += this.speed
        if (this.y > canvas!.height) {
          this.y = -10
          this.x = Math.random() * canvas!.width
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.size, this.size * 5)
      }
    }

    // Initialization functions
    const initBuildings = () => {
      buildings = []
      let x = 0
      while (x < canvas!.width) {
        const width = 30 + Math.random() * 100
        buildings.push(new Building(x, width))
        x += width
      }
    }

    const initLights = () => {
      lights = []
      particles = []

      const lightCount = Math.floor(canvas!.width / 20)
      for (let i = 0; i < lightCount; i++) {
        lights.push(new Light())
      }

      const particleCount = Math.floor((canvas!.width * canvas!.height) / 5000)
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    // Canvas setup
    const resizeCanvas = () => {
      canvas!.width = window.innerWidth
      canvas!.height = window.innerHeight
      initBuildings()
      initLights()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Animation functions
    const drawReflection = (ctx: CanvasRenderingContext2D) => {
      const reflectionHeight = canvas!.height * 0.3
      const y = canvas!.height - reflectionHeight

      ctx.save()
      ctx.globalAlpha = 0.2
      ctx.globalCompositeOperation = "lighter"

      for (let i = 0; i < reflectionHeight; i++) {
        const alpha = 1 - i / reflectionHeight
        ctx.globalAlpha = alpha * 0.2
        ctx.drawImage(canvas!, 0, y - 5, canvas!.width, 5, 0, y + i, canvas!.width, 1)
      }

      ctx.restore()
    }

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas!.width, canvas!.height)

      // Fixed gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas!.height)
      gradient.addColorStop(0, "#000510")
      gradient.addColorStop(0.5, "#050530")
      gradient.addColorStop(1, "#101040")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas!.width, canvas!.height)

      ctx.fillStyle = "rgba(20, 30, 80, 0.2)"
      ctx.fillRect(0, 0, canvas!.width, canvas!.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      buildings.forEach((building) => {
        building.update(time)
        building.draw(ctx)
      })

      lights.forEach((light) => {
        light.update(time)
        light.draw(ctx)
      })

      drawReflection(ctx)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

