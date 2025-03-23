"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ConfettiBackground from "./backgrounds/confetti-background";
import NoiseBackground from "./backgrounds/noise-background";
import CirclesBackground from "./backgrounds/circles-background";
import GradientMeshBackground from "./backgrounds/gradient-mesh-background";
import SpotlightBackground from "./backgrounds/spotlight-background";
import BubblesBackground from "./backgrounds/bubbles-background";
import RippleBackground from "./backgrounds/ripple-background";
import GalaxyBackground from "./backgrounds/galaxy-background";
import FirefliesBackground from "./backgrounds/fireflies-background";
import GradientWaveBackground from "./backgrounds/gradient-wave";
import FloatingShapesBackground from "./backgrounds/floating-shapes";
import ParticleBackground from "./backgrounds/particles-background";
import GridMeshBackground from "./backgrounds/grid-mesh-background";
import BlobBackground from "./backgrounds/blob-background";

export default function AnimatedBackgroundsShowcase() {
  const [currentBackground, setCurrentBackground] = useState(0);

  const backgrounds = [
    {
      component: <GradientWaveBackground key="gradient-wave" />,
      name: "Gradient Wave",
    },
    {
      component: <FloatingShapesBackground key="floating-shapes" />,
      name: "Floating Shapes",
    },
    { component: <ParticleBackground key="particles" />, name: "Particles" },
    { component: <GridMeshBackground key="grid-mesh" />, name: "Grid Mesh" },
    { component: <BlobBackground key="blob" />, name: "Blob" },
    {
      component: <GalaxyBackground key="galaxy" />,
      name: "Galaxy & Milky Way",
    },
    { component: <FirefliesBackground key="fireflies" />, name: "Fireflies" },
    { component: <ConfettiBackground key="confetti" />, name: "Confetti" },
    { component: <NoiseBackground key="noise" />, name: "Noise Texture" },
    { component: <CirclesBackground key="circles" />, name: "Pulsing Circles" },
    {
      component: <GradientMeshBackground key="gradient-mesh" />,
      name: "Gradient Mesh",
    },
    { component: <SpotlightBackground key="spotlight" />, name: "Spotlight" },
    { component: <BubblesBackground key="bubbles" />, name: "Bubbles" },

    { component: <RippleBackground key="ripple" />, name: "Ripple Effect" },
  ];

  const nextBackground = () => {
    setCurrentBackground((prev) => (prev + 1) % backgrounds.length);
  };

  const prevBackground = () => {
    setCurrentBackground(
      (prev) => (prev - 1 + backgrounds.length) % backgrounds.length
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {backgrounds[currentBackground].component}

      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={prevBackground}
          className="bg-white/20 backdrop-blur-sm border-white/20 hover:bg-white/30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2 items-center">
          {backgrounds.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentBackground ? "bg-white" : "bg-white/30"
              }`}
              onClick={() => setCurrentBackground(index)}
            />
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={nextBackground}
          className="bg-white/20 backdrop-blur-sm border-white/20 hover:bg-white/30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <div className="text-center max-w-3xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md mb-4">
            {backgrounds[currentBackground].name}
          </h1>
          <p className="text-xl text-white/90 drop-shadow-md">
            Beautiful animated backgrounds for your website hero sections
          </p>
        </div>
      </div>
    </div>
  );
}
