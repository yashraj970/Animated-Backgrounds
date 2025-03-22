"use client"

import { useEffect, useRef } from "react"

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let time = 0
    let auroraPoints: AuroraPoint[][] = []
    let stars: Star[] = []

    // Aurora point class
    class AuroraPoint {
      x: number
      y: number
      baseY: number
      speed: number

      constructor(x: number, baseY: number) {
        this.x = x
        this.baseY = baseY
        this.y = baseY
        this.speed = 0.5 + Math.random() * 1.5
      }

      update(time: number, index: number, totalPoints: number) {
        const waveHeight = 50 + Math.sin(time * 0.2) * 20
        const frequency = 0.008
        const phaseShift = (index / totalPoints) * Math.PI * 4
        this.y = this.baseY + Math.sin(time * this.speed + phaseShift) * waveHeight
      }
    }

    // Star class
    class Star {
      x: number
      y: number
      size: number
      twinkleSpeed: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height * 0.7
        this.size = 0.5 + Math.random() * 1.5
        this.twinkleSpeed = 0.03 + Math.random() * 0.05
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        const twinkle = Math.sin(time * this.twinkleSpeed) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + twinkle * 0.7})`
        ctx.fill()
      }
    }

    // Initialize aurora bands
    const initAurora = () => {
      auroraPoints = []
      const bandCount = 5

      for (let b = 0; b < bandCount; b++) {
        const points: AuroraPoint[] = []
        const segments = Math.ceil(canvas.width / 20)
        const baseY = canvas.height * (0.4 + b * 0.1)

        for (let i = 0; i <= segments; i++) {
          const x = (canvas.width / segments) * i
          points.push(new AuroraPoint(x, baseY))
        }
        auroraPoints.push(points)
      }
    }

    // Initialize stars
    const initStars = () => {
      stars = []
      const starCount = Math.min(200, Math.floor((canvas.width * canvas.height) / 5000))

      for (let i = 0; i < starCount; i++) {
        stars.push(new Star())
      }
    }

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initAurora()
      initStars()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Animation loop
    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "#000510")
      gradient.addColorStop(0.5, "#001025")
      gradient.addColorStop(1, "#000510")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => star.draw(ctx, time))

      // Draw mountain silhouette
      drawMountains(ctx, canvas.width, canvas.height)

      // Update and draw aurora bands
      auroraPoints.forEach((points, bandIndex) => {
        points.forEach((point, i) => {
          point.update(time, i, points.length)
        })
        drawAuroraBand(ctx, points, bandIndex)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Draw aurora band
    const drawAuroraBand = (ctx: CanvasRenderingContext2D, points: AuroraPoint[], bandIndex: number) => {
      const hue = (140 + bandIndex * 30) % 360
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.0)`)
      gradient.addColorStop(0.5, `hsla(${hue}, 100%, 70%, 0.5)`)
      gradient.addColorStop(1, `hsla(${hue}, 100%, 50%, 0.0)`)

      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)

      for (let i = 1; i < points.length - 2; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2
        const yc = (points[i].y + points[i + 1].y) / 2
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
      }

      if (points.length > 2) {
        const last = points.length - 1
        ctx.quadraticCurveTo(points[last - 1].x, points[last - 1].y, points[last].x, points[last].y)
      }

      ctx.lineTo(canvas.width, canvas.height)
      ctx.lineTo(0, canvas.height)
      ctx.closePath()

      ctx.fillStyle = gradient
      ctx.fill()

      ctx.shadowColor = `hsla(${hue}, 100%, 70%, 0.8)`
      ctx.shadowBlur = 15
      ctx.strokeStyle = `hsla(${hue}, 100%, 80%, 0.5)`
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.shadowBlur = 0
    }

    // Draw mountain silhouette
    const drawMountains = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = "#000000"

      // First mountain range
      ctx.beginPath()
      ctx.moveTo(0, height * 0.85)
      const segments = 10
      for (let i = 0; i <= segments; i++) {
        const x = (width / segments) * i
        const y = height * (0.85 - Math.sin((i / segments) * Math.PI) * 0.1)
        ctx.lineTo(x, y)
      }
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fill()

      // Second mountain range
      ctx.beginPath()
      ctx.moveTo(0, height * 0.9)
      for (let i = 0; i <= segments * 2; i++) {
        const x = (width / (segments * 2)) * i
        const y = height * (0.9 - Math.sin((i / (segments * 0.8)) * Math.PI) * 0.05)
        ctx.lineTo(x, y)
      }
      ctx.lineTo(width, height)
      ctx.lineTo(0, height)
      ctx.closePath()
      ctx.fill()
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

