"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PARTICLE_COUNT = 40;

const colors = [
  "#c9a96e", // gold
  "#e8c547", // amber
  "#d4a5a5", // rose
  "#b8c5b0", // sage
  "#f5f0eb", // cream
  "#8b6914", // dark gold
  "#e8d5b0", // champagne
  "#c49a6c", // copper
];

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  angle: number;
  distance: number;
  duration: number;
  delay: number;
}

function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: randomBetween(-120, 120),
    y: randomBetween(-200, -40),
    color: colors[Math.floor(Math.random() * colors.length)],
    size: randomBetween(4, 10),
    angle: randomBetween(0, Math.PI * 2),
    distance: randomBetween(30, 180),
    duration: randomBetween(0.8, 2.2),
    delay: randomBetween(0, 0.4),
  }));
}

export function ConfettiEffect({
  active,
  onComplete,
}: {
  active: boolean;
  onComplete?: () => void;
}) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      setParticles(generateParticles());
    } else {
      setParticles([]);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 1,
              scale: 0,
              x: 0,
              y: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1, 1],
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance + 80,
              rotate: randomBetween(-360, 360),
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              left: `calc(50% + ${p.x}px)`,
              top: `calc(50% + ${p.y}px)`,
              width: p.size,
              height: p.size * randomBetween(0.5, 1.5),
              borderRadius: randomBetween(1, 4),
              backgroundColor: p.color,
            }}
            onAnimationComplete={
              p.id === Math.floor(PARTICLE_COUNT / 2) ? onComplete : undefined
            }
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
