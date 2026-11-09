import { useEffect, useRef } from 'react';
import herobg from '../../assets/herobg.png';

interface HeroPortalCanvasProps {
  scrollProgress: number;
  mouseOffset: { x: number; y: number };
  hoveredGemId?: string | null;
}

interface StardustSparkle {
  angle: number;
  radiusFactor: number;
  speed: number;
  size: number;
  alpha: number;
  phase: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export function HeroPortalCanvas({ scrollProgress, mouseOffset, hoveredGemId }: HeroPortalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const bgImgRef = useRef<HTMLImageElement | null>(null);
  const sparklesRef = useRef<StardustSparkle[]>([]);
  const ripplesRef = useRef<WaterRipple[]>([]);
  const lastRippleTimeRef = useRef(0);

  // Offscreen buffering for seamless feathered video blending
  const offscreenVideoRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenMaskRef = useRef<HTMLCanvasElement | null>(null);
  const lastMaskDimRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // Initialize stardust sparkles & ambient ripples
  useEffect(() => {
    const sparkles: StardustSparkle[] = [];
    for (let i = 0; i < 24; i++) {
      sparkles.push({
        angle: Math.random() * Math.PI * 2,
        radiusFactor: 0.7 + Math.random() * 0.3,
        speed: 0.0014 + Math.random() * 0.0018,
        size: 1.0 + Math.random() * 1.5,
        alpha: 0.35 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
      });
    }
    sparklesRef.current = sparkles;

    ripplesRef.current = [
      { x: 0.31, y: 0.76, radius: 14, maxRadius: 70, alpha: 0.3, speed: 0.28 },
      { x: 0.62, y: 0.74, radius: 24, maxRadius: 85, alpha: 0.28, speed: 0.32 },
      { x: 0.89, y: 0.78, radius: 10, maxRadius: 55, alpha: 0.22, speed: 0.26 },
    ];

    offscreenVideoRef.current = document.createElement('canvas');
    offscreenMaskRef.current = document.createElement('canvas');
  }, []);

  // Preload background image & video
  useEffect(() => {
    const img = new Image();
    img.src = herobg;
    bgImgRef.current = img;

    const video = document.createElement('video');
    video.src = '/hero_gemstones.mp4';
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.play().catch(() => {});
    videoRef.current = video;

    return () => {
      video.pause();
      video.src = '';
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animId: number;

    const render = (time: number) => {
      const parent = canvas.parentElement;
      const width = (canvas.width = parent?.clientWidth || window.innerWidth);
      const height = (canvas.height = parent?.clientHeight || window.innerHeight);

      if (width === 0 || height === 0) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Calculate responsive background aspect-ratio (1024x576 = 16:9)
      const imgAspect = 1024 / 576;
      const canvasAspect = width / height;

      let renderW: number;
      let renderH: number;
      let left: number;
      let top: number;

      if (canvasAspect > imgAspect) {
        renderW = width;
        renderH = width / imgAspect;
        left = 0;
        top = (height - renderH) / 2;
      } else {
        renderH = height;
        renderW = height * imgAspect;
        top = 0;
        left = (width - renderW) / 2;
      }

      // Parallax scroll translation (vertical only, smooth depth)
      const scrollY = scrollProgress * 25;

      // 2. Draw pristine background plate (solidly anchored to canvas)
      const bgImg = bgImgRef.current;
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, left, top + scrollY, renderW, renderH);
      }

      // 3. Draw Rotating 3D Video on Canvas with Smooth Horizontal Atmospheric Dissolve
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const vBuf = offscreenVideoRef.current;
        const mBuf = offscreenMaskRef.current;

        // Exactly aligned 1:1 scale with herobg.png
        const drawW = Math.round(renderW);
        const drawH = Math.round(renderH);
        const drawX = Math.round(left + renderW * 0.19875);
        const drawY = Math.round(top + scrollY);

        if (vBuf && mBuf && drawW > 0 && drawH > 0) {
          if (lastMaskDimRef.current.w !== drawW || lastMaskDimRef.current.h !== drawH) {
            lastMaskDimRef.current = { w: drawW, h: drawH };
            mBuf.width = drawW;
            mBuf.height = drawH;
            const mCtx = mBuf.getContext('2d');
            if (mCtx) {
              mCtx.clearRect(0, 0, drawW, drawH);

              // In video coordinates: dissolve region between x0 = 138.4 and x1 = 398.4
              // which in canvas coordinates lands perfectly at X = 520 to 780
              const x0 = Math.round(drawW * 0.0721);
              const x1 = Math.round(drawW * 0.2075);

              // Smooth cosine-like linear gradient from left mist to video
              const grad = mCtx.createLinearGradient(x0, 0, x1, 0);
              grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
              grad.addColorStop(0.2, 'rgba(255, 255, 255, 0.08)');
              grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.50)');
              grad.addColorStop(0.8, 'rgba(255, 255, 255, 0.92)');
              grad.addColorStop(1, 'rgba(255, 255, 255, 1)');

              mCtx.fillStyle = grad;
              mCtx.fillRect(x0, 0, x1 - x0, drawH);

              // Full opacity for the entire portal, gemstones, plinth, and arch
              mCtx.fillStyle = '#ffffff';
              mCtx.fillRect(x1, 0, drawW - x1, drawH);
            }
          }

          if (vBuf.width !== drawW || vBuf.height !== drawH) {
            vBuf.width = drawW;
            vBuf.height = drawH;
          }
          const vbCtx = vBuf.getContext('2d');
          if (vbCtx) {
            vbCtx.clearRect(0, 0, drawW, drawH);
            vbCtx.drawImage(video, 0, 0, drawW, drawH);
            vbCtx.globalCompositeOperation = 'destination-in';
            vbCtx.drawImage(mBuf, 0, 0);
            vbCtx.globalCompositeOperation = 'source-over';
          }

          ctx.drawImage(vBuf, drawX, drawY);
        }
      }

      // 4. Subtle Ruby Aura Glow (Warm, Soft, Screen-Blended)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const rubyX = left + renderW * 0.622;
      const rubyY = top + renderH * 0.473 + scrollY;
      const rubyAura = ctx.createRadialGradient(rubyX, rubyY, 0, rubyX, rubyY, renderW * 0.08);
      rubyAura.addColorStop(0, 'rgba(255, 180, 120, 0.18)');
      rubyAura.addColorStop(0.4, 'rgba(255, 90, 110, 0.08)');
      rubyAura.addColorStop(1, 'rgba(215, 45, 85, 0)');
      ctx.fillStyle = rubyAura;
      ctx.beginPath();
      ctx.arc(rubyX, rubyY, renderW * 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 5. Code-Generated Golden Stardust Sparkles Trailing in 3D Space
      const orbitRadius = renderW * 0.185;
      for (let i = 0; i < sparklesRef.current.length; i++) {
        const s = sparklesRef.current[i];
        s.angle += s.speed;

        // Elliptical orbit projection around ruby
        const rx = orbitRadius * s.radiusFactor;
        const ry = orbitRadius * 0.58 * s.radiusFactor;
        const rot = -0.22;

        const ex = rx * Math.cos(s.angle);
        const ey = ry * Math.sin(s.angle);
        // Foreground 3D depth parallax relative to mouse (subtle 3D shift)
        const px = rubyX + ex * Math.cos(rot) - ey * Math.sin(rot) + mouseOffset.x * 2.5;
        const py = rubyY + ex * Math.sin(rot) + ey * Math.cos(rot) + mouseOffset.y * 2.0;

        const shimmer = 0.6 + 0.4 * Math.sin(time * 0.0035 + s.phase);
        const currentAlpha = s.alpha * shimmer;

        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, s.size * 2.5);
        pGrad.addColorStop(0, `rgba(255, 255, 245, ${currentAlpha})`);
        pGrad.addColorStop(0.4, `rgba(255, 220, 130, ${currentAlpha * 0.7})`);
        pGrad.addColorStop(1, 'rgba(255, 185, 75, 0)');

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, s.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, s.size * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Subtle Shimmering Water Ripples across lake surface
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
          alpha: 0.32,
          speed: 0.28 + Math.random() * 0.14,
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
          const rx = left + rip.x * renderW;
          const ry = top + rip.y * renderH + scrollY;

          ctx.beginPath();
          ctx.ellipse(rx, ry, rip.radius, rip.radius * 0.32, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 245, 210, ${currentAlpha * 0.55})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(rx, ry + 0.6, rip.radius + 0.8, rip.radius * 0.32, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(180, 140, 95, ${currentAlpha * 0.2})`;
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
  }, [scrollProgress, mouseOffset, hoveredGemId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{
        filter: 'contrast(1.06) saturate(1.12) brightness(1.02)',
      }}
    />
  );
}

export default HeroPortalCanvas;
