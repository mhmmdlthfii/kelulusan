/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}

const COLORS = ["#3B82F6", "#06B6D4", "#22C55E", "#10B981", "#8B5CF6", "#A855F7", "#F59E0B", "#FB923C"];

export default function Confetti() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const freshParticles = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage of viewport width
      y: -10 - Math.random() * 20, // start above the screen
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 12 + 6,
      rotation: Math.random() * 360,
      delay: Math.random() * 3
    }));
    setParticles(freshParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ 
            opacity: 1, 
            x: `${p.x}vw`, 
            y: `${p.y}vh`, 
            rotate: p.rotation 
          }}
          animate={{
            y: "110vh",
            x: `${p.x + (Math.random() * 20 - 10)}vw`,
            rotate: p.rotation + 720,
          }}
          transition={{
            duration: Math.random() * 4 + 4,
            delay: p.delay,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          }}
        />
      ))}
    </div>
  );
}
