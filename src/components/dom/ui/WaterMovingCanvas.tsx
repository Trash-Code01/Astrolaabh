import { useEffect, useRef } from 'react';

interface CircularWave {
  x: number;
  y: number;
  startTime: number;
  amplitude: number;
  speed: number;
}

export function WaterMovingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const clickWavesRef = useRef<CircularWave[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number | null = null;
    let isVisible = false;
    let lastFrame = 0;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // User click / touch creates pure golden circular ripple waves
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      clickWavesRef.current.push({
        x: px,
        y: py,
        startTime: performance.now(),
        amplitude: 1.0,
        speed: 0.32,
      });

      if (clickWavesRef.current.length > 5) {
        clickWavesRef.current.shift();
      }
    };

    canvas.addEventListener('mousedown', handlePointerDown, { passive: true });
    canvas.addEventListener('touchstart', handlePointerDown, { passive: true });

    const render = (now: number) => {
      animId = null;
      if (!isVisible || document.hidden) return;
      if (now - lastFrame < 40) {
        scheduleRender();
        return;
      }
      lastFrame = now;
      const t = now * 0.001;

      const centerX = width / 2;
      const centerY = height / 2;
      const maxDim = Math.max(width, height) * 0.85;

      // 1. Pristine White Foundation
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      // 2. Pure Golden Circular Water Waves (Concentric Hairline Rings Expanding from Center)
      const ringCount = 6;
      const ringSpacing = 76;
      const speed = 36;
      const baseDistance = (t * speed) % ringSpacing;

      for (let r = 0; r < ringCount; r++) {
        const radius = baseDistance + r * ringSpacing;
        if (radius < 25 || radius > maxDim) continue;

        // Smooth fade curve
        const fade = Math.sin((radius / maxDim) * Math.PI);
        const waveAlpha = Math.max(0, fade * 0.85);

        // Wave Trough: Ultra-thin delicate shadow
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 0.8, 0, Math.PI * 2);
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = `rgba(215, 205, 190, ${waveAlpha * 0.18})`;
        ctx.stroke();

        // Wave Crest: Ultra-thin, crisp golden hairline ring (No heavy shadowBlur!)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = `rgba(217, 163, 60, ${waveAlpha * 0.65})`;
        ctx.stroke();

        // Inner Sharp Specular Glint (Hairline)
        ctx.beginPath();
        ctx.arc(centerX, centerY, Math.max(0.5, radius - 0.6), 0, Math.PI * 2);
        ctx.lineWidth = 0.35;
        ctx.strokeStyle = `rgba(255, 255, 255, ${waveAlpha * 0.85})`;
        ctx.stroke();
      }

      // 3. User Click/Touch Waves
      const activeClickWaves: CircularWave[] = [];
      for (let i = 0; i < clickWavesRef.current.length; i++) {
        const wave = clickWavesRef.current[i];
        const elapsed = now - wave.startTime;
        const currentRadius = elapsed * wave.speed;
        const maxRadius = Math.max(width, height) * 0.75;
        const life = currentRadius / maxRadius;

        if (life < 1.0) {
          activeClickWaves.push(wave);

          const fade = Math.pow(1 - life, 1.3) * wave.amplitude;
          const subRings = 3;

          for (let s = 0; s < subRings; s++) {
            const r = currentRadius - s * 36;
            if (r <= 2) continue;

            const alpha = Math.max(0, fade * (1 - s / subRings));

            // Trough shadow
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, r + 0.8, 0, Math.PI * 2);
            ctx.lineWidth = 0.5;
            ctx.strokeStyle = `rgba(215, 205, 190, ${alpha * 0.18})`;
            ctx.stroke();

            // Golden Crest
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, r, 0, Math.PI * 2);
            ctx.lineWidth = 0.6;
            ctx.strokeStyle = `rgba(217, 163, 60, ${alpha * 0.65})`;
            ctx.stroke();

            // Specular Glint
            ctx.beginPath();
            ctx.arc(wave.x, wave.y, Math.max(0.5, r - 0.6), 0, Math.PI * 2);
            ctx.lineWidth = 0.35;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
            ctx.stroke();
          }
        }
      }
      clickWavesRef.current = activeClickWaves;

      scheduleRender();
    };

    const scheduleRender = () => {
      if (animId === null && isVisible && !document.hidden) {
        animId = requestAnimationFrame(render);
      }
    };

    const pauseRender = () => {
      if (animId !== null) cancelAnimationFrame(animId);
      animId = null;
    };

    const handleVisibilityChange = () => {
      if (document.hidden) pauseRender();
      else scheduleRender();
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) scheduleRender();
      else pauseRender();
    });
    observer.observe(canvas);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      pauseRender();
      observer.disconnect();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', handlePointerDown);
      canvas.removeEventListener('touchstart', handlePointerDown);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-auto">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block cursor-pointer" />
    </div>
  );
}

export default WaterMovingCanvas;
