import { useEffect, useRef } from 'react';

interface HeroCelestialCanvasProps {
  scrollProgress: number;
  mouseOffset: { x: number; y: number };
}

interface StardustParticle {
  orbit: 1 | 2;
  angle: number;
  speed: number;
  size: number;
  alpha: number;
  pulsePhase: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export function HeroCelestialCanvas({ scrollProgress, mouseOffset }: HeroCelestialCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<StardustParticle[]>([]);
  const ripplesRef = useRef<WaterRipple[]>([]);
  const lastRippleTimeRef = useRef(0);

  // Initialize delicate stardust particles
  useEffect(() => {
    const particles: StardustParticle[] = [];
    // 16 sparkling stardust specks on inner orbit
    for (let i = 0; i < 16; i++) {
      particles.push({
        orbit: 1,
        angle: (i / 16) * Math.PI * 2 + Math.random() * 0.2,
        speed: 0.0028 + Math.random() * 0.0016,
        size: 1.1 + Math.random() * 1.3,
        alpha: 0.45 + Math.random() * 0.55,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    // 22 sparkling stardust specks on outer orbit
    for (let i = 0; i < 22; i++) {
      particles.push({
        orbit: 2,
        angle: (i / 22) * Math.PI * 2 + Math.random() * 0.2,
        speed: 0.002 + Math.random() * 0.0014,
        size: 1.0 + Math.random() * 1.4,
        alpha: 0.4 + Math.random() * 0.6,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }
    particlesRef.current = particles;

    // Ambient lake ripples
    ripplesRef.current = [
      { x: 0.31, y: 0.76, radius: 14, maxRadius: 70, alpha: 0.35, speed: 0.3 },
      { x: 0.62, y: 0.74, radius: 24, maxRadius: 85, alpha: 0.3, speed: 0.35 },
      { x: 0.89, y: 0.78, radius: 10, maxRadius: 55, alpha: 0.25, speed: 0.28 },
    ];
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = (time: number) => {
      const width = canvas.width;
      const height = canvas.height;
      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Portal focal center mathematically locked to reference art: 62.2% X, 47.3% Y
      const centerX = width * 0.622 + mouseOffset.x * 10;
      const centerY = height * 0.473 + mouseOffset.y * 8;

      // 1. Central Solar Radiant Flare & Light Rays behind the Ruby
      const sunPulse = 1 + Math.sin(time * 0.0016) * 0.05;
      const sunRadius = Math.min(width, height) * 0.25 * sunPulse;

      // Soft ambient golden sunburst bloom
      const sunGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius);
      sunGrad.addColorStop(0, 'rgba(255, 245, 205, 0.58)');
      sunGrad.addColorStop(0.25, 'rgba(255, 205, 125, 0.26)');
      sunGrad.addColorStop(0.6, 'rgba(235, 145, 55, 0.07)');
      sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Sharp golden compass starburst (8-point celestial rays matching reference art)
      ctx.save();
      ctx.translate(centerX, centerY);

      // Cardinal rays (pointing up, down, left, right)
      const cardinalLen = sunRadius * 1.55;
      const diagonalLen = sunRadius * 1.1;

      const drawTaperedRay = (angle: number, length: number, baseWidth: number, alpha: number) => {
        ctx.save();
        ctx.rotate(angle);
        const rayGrad = ctx.createLinearGradient(0, 0, 0, -length);
        rayGrad.addColorStop(0, `rgba(255, 250, 225, ${alpha})`);
        rayGrad.addColorStop(0.3, `rgba(255, 220, 150, ${alpha * 0.8})`);
        rayGrad.addColorStop(1, 'rgba(255, 200, 100, 0)');

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-baseWidth, -length * 0.18);
        ctx.lineTo(0, -length);
        ctx.lineTo(baseWidth, -length * 0.18);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      const rayPulse = 1 + Math.sin(time * 0.0022) * 0.04;
      // 4 Cardinal Rays
      drawTaperedRay(0, cardinalLen * rayPulse, 2.2, 0.45); // pointing straight up to notch
      drawTaperedRay(Math.PI / 2, cardinalLen * rayPulse * 0.88, 2.2, 0.35); // right
      drawTaperedRay(Math.PI, cardinalLen * rayPulse * 0.82, 2.2, 0.32); // down
      drawTaperedRay(-Math.PI / 2, cardinalLen * rayPulse * 0.88, 2.2, 0.35); // left

      // 4 Diagonal Rays
      drawTaperedRay(Math.PI / 4, diagonalLen * rayPulse, 1.6, 0.28);
      drawTaperedRay((3 * Math.PI) / 4, diagonalLen * rayPulse, 1.6, 0.22);
      drawTaperedRay((-3 * Math.PI) / 4, diagonalLen * rayPulse, 1.6, 0.22);
      drawTaperedRay(-Math.PI / 4, diagonalLen * rayPulse, 1.6, 0.28);

      ctx.restore();

      // 2. Dynamic 3D Luminous Orbital Filament Rings
      // Inner tilted ellipse (Emerald to Diamond plane)
      const rot1 = -0.25 + scrollProgress * 0.18 + mouseOffset.x * 0.03;
      const rx1 = width * 0.162 * (1 + scrollProgress * 0.12);
      const ry1 = height * 0.108 * (1 + scrollProgress * 0.1);

      // Outer tilted ellipse (Sapphire to Yellow Sapphire to Pearl plane)
      const rot2 = 0.33 + scrollProgress * 0.22 - mouseOffset.x * 0.03;
      const rx2 = width * 0.240 * (1 + scrollProgress * 0.15);
      const ry2 = height * 0.155 * (1 + scrollProgress * 0.12);

      // Function to render a luminous golden filament ring with glow layers
      const renderOrbitalRing = (rot: number, rx: number, ry: number, baseAlpha: number) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rot);

        // Soft wide bloom
        ctx.strokeStyle = `rgba(255, 215, 130, ${baseAlpha * 0.22})`;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Medium aura
        ctx.strokeStyle = `rgba(255, 230, 160, ${baseAlpha * 0.45})`;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Core crisp golden filament
        ctx.strokeStyle = `rgba(255, 250, 220, ${baseAlpha * 0.88})`;
        ctx.lineWidth = 1.15;
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      };

      // Draw Orbit 1 (Inner)
      renderOrbitalRing(rot1, rx1, ry1, 0.75);

      // Draw Orbit 2 (Outer)
      renderOrbitalRing(rot2, rx2, ry2, 0.7);

      // 3. Delicate Sparkling Stardust Specks along the golden orbits
      for (let i = 0; i < particlesRef.current.length; i++) {
        const p = particlesRef.current[i];
        p.angle += p.speed;

        const isOrbit1 = p.orbit === 1;
        const rx = isOrbit1 ? rx1 : rx2;
        const ry = isOrbit1 ? ry1 : ry2;
        const rot = isOrbit1 ? rot1 : rot2;

        // Current particle position along the ellipse
        const cosA = Math.cos(p.angle);
        const sinA = Math.sin(p.angle);
        const ex = rx * cosA;
        const ey = ry * sinA;

        const cosR = Math.cos(rot);
        const sinR = Math.sin(rot);
        const px = centerX + ex * cosR - ey * sinR;
        const py = centerY + ex * sinR + ey * cosR;

        // Subtle glint pulse
        const shimmer = 0.7 + 0.3 * Math.sin(time * 0.005 + p.pulsePhase);
        const currentAlpha = p.alpha * shimmer;

        // Soft halo
        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, p.size * 2.2);
        pGrad.addColorStop(0, `rgba(255, 255, 240, ${currentAlpha})`);
        pGrad.addColorStop(0.4, `rgba(255, 220, 130, ${currentAlpha * 0.5})`);
        pGrad.addColorStop(1, 'rgba(255, 180, 70, 0)');

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Pinpoint sharp core glint
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.6, p.size * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Subtle Shimmering Water Ripples across lake surface
      if (time - lastRippleTimeRef.current > 1800) {
        lastRippleTimeRef.current = time;
        const lotusPositions = [
          { x: 0.31, y: 0.76 },
          { x: 0.62, y: 0.74 },
          { x: 0.89, y: 0.78 },
          { x: 0.22, y: 0.83 },
        ];
        const pick = lotusPositions[Math.floor(Math.random() * lotusPositions.length)];
        ripplesRef.current.push({
          x: pick.x,
          y: pick.y,
          radius: 3,
          maxRadius: 45 + Math.random() * 35,
          alpha: 0.35,
          speed: 0.3 + Math.random() * 0.15,
        });
      }

      const activeRipples: WaterRipple[] = [];
      for (let r = 0; r < ripplesRef.current.length; r++) {
        const rip = ripplesRef.current[r];
        rip.radius += rip.speed;
        const progress = rip.radius / rip.maxRadius;

        if (progress < 1.0) {
          activeRipples.push(rip);
          const currentAlpha = rip.alpha * Math.sin((1 - progress) * Math.PI);
          const rx = rip.x * width;
          const ry = rip.y * height;

          // Water ripple ellipse (compressed vertically for perspective)
          ctx.beginPath();
          ctx.ellipse(rx, ry, rip.radius, rip.radius * 0.32, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 240, 195, ${currentAlpha * 0.55})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Under-ripple delicate shadow
          ctx.beginPath();
          ctx.ellipse(rx, ry + 0.6, rip.radius + 0.8, rip.radius * 0.32, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(160, 130, 90, ${currentAlpha * 0.2})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
      ripplesRef.current = activeRipples;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [scrollProgress, mouseOffset]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-15"
    />
  );
}

export default HeroCelestialCanvas;
