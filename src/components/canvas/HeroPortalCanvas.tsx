import { useEffect, useRef } from 'react';
import herobg from '../../assets/herobg.png';

interface HeroPortalCanvasProps {
  scrollProgress: number;
  mouseOffset: { x: number; y: number };
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

export function HeroPortalCanvas({ scrollProgress, mouseOffset }: HeroPortalCanvasProps) {
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
    for (let i = 0; i < 28; i++) {
      sparkles.push({
        angle: Math.random() * Math.PI * 2,
        radiusFactor: 0.6 + Math.random() * 0.4,
        speed: 0.0018 + Math.random() * 0.0022,
        size: 1.0 + Math.random() * 1.5,
        alpha: 0.35 + Math.random() * 0.65,
        phase: Math.random() * Math.PI * 2,
      });
    }
    sparklesRef.current = sparkles;

    ripplesRef.current = [
      { x: 0.31, y: 0.76, radius: 14, maxRadius: 70, alpha: 0.35, speed: 0.3 },
      { x: 0.62, y: 0.74, radius: 24, maxRadius: 85, alpha: 0.3, speed: 0.35 },
      { x: 0.89, y: 0.78, radius: 10, maxRadius: 55, alpha: 0.25, speed: 0.28 },
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

      // Parallax translation
      const parallaxX = mouseOffset.x * 4;
      const parallaxY = scrollProgress * 35 + mouseOffset.y * 4;

      // 2. Draw pristine background plate
      const bgImg = bgImgRef.current;
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, left + parallaxX, top + parallaxY, renderW, renderH);
      }

      // 3. Draw Seamless Rotating 3D Video on Canvas with Cosine Feather Mask
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const vBuf = offscreenVideoRef.current;
        const mBuf = offscreenMaskRef.current;

        const drawW = Math.round(renderW * 0.78875);
        const drawH = Math.round(renderH * 0.78875);
        const drawX = Math.round(left + renderW * 0.2578125 + parallaxX);
        const drawY = Math.round(top + renderH * 0.0677083 + parallaxY);

        if (vBuf && mBuf && drawW > 0 && drawH > 0) {
          // Re-generate feather mask only when dimensions change
          if (lastMaskDimRef.current.w !== drawW || lastMaskDimRef.current.h !== drawH) {
            lastMaskDimRef.current = { w: drawW, h: drawH };
            mBuf.width = drawW;
            mBuf.height = drawH;
            const mCtx = mBuf.getContext('2d');
            if (mCtx) {
              mCtx.clearRect(0, 0, drawW, drawH);
              mCtx.fillStyle = '#ffffff';
              mCtx.fillRect(0, 0, drawW, drawH);

              // Smooth 4-edge cosine feathering to dissolve all boundaries into the scene
              const fx = Math.round(drawW * 0.11); // Left edge feather
              const fy = Math.round(drawH * 0.11); // Top edge feather
              const fyb = Math.round(drawH * 0.15); // Bottom edge feather
              const fxr = Math.round(drawW * 0.06); // Right edge feather

              mCtx.globalCompositeOperation = 'destination-out';

              // Left feather
              const leftGrad = mCtx.createLinearGradient(0, 0, fx, 0);
              leftGrad.addColorStop(0, 'rgba(0,0,0,1)');
              leftGrad.addColorStop(1, 'rgba(0,0,0,0)');
              mCtx.fillStyle = leftGrad;
              mCtx.fillRect(0, 0, fx, drawH);

              // Top feather
              const topGrad = mCtx.createLinearGradient(0, 0, 0, fy);
              topGrad.addColorStop(0, 'rgba(0,0,0,1)');
              topGrad.addColorStop(1, 'rgba(0,0,0,0)');
              mCtx.fillStyle = topGrad;
              mCtx.fillRect(0, 0, drawW, fy);

              // Bottom feather
              const btmGrad = mCtx.createLinearGradient(0, drawH - fyb, 0, drawH);
              btmGrad.addColorStop(0, 'rgba(0,0,0,0)');
              btmGrad.addColorStop(1, 'rgba(0,0,0,1)');
              mCtx.fillStyle = btmGrad;
              mCtx.fillRect(0, drawH - fyb, drawW, fyb);

              // Right feather
              const rgtGrad = mCtx.createLinearGradient(drawW - fxr, 0, drawW, 0);
              rgtGrad.addColorStop(0, 'rgba(0,0,0,0)');
              rgtGrad.addColorStop(1, 'rgba(0,0,0,1)');
              mCtx.fillStyle = rgtGrad;
              mCtx.fillRect(drawW - fxr, 0, fxr, drawH);

              mCtx.globalCompositeOperation = 'source-over';
            }
          }

          // Buffer video frame and apply mask
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

          // Render feathered video directly onto canvas scene
          ctx.drawImage(vBuf, drawX, drawY);
        }
      }

      // 4. Code-Generated Golden Stardust Sparkles on Canvas
      const rubyCenterX = left + renderW * 0.619 + mouseOffset.x * 6 + parallaxX;
      const rubyCenterY = top + renderH * 0.472 + mouseOffset.y * 5 + parallaxY;
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
        const px = rubyCenterX + ex * Math.cos(rot) - ey * Math.sin(rot);
        const py = rubyCenterY + ex * Math.sin(rot) + ey * Math.cos(rot);

        const shimmer = 0.6 + 0.4 * Math.sin(time * 0.004 + s.phase);
        const currentAlpha = s.alpha * shimmer;

        // Draw glowing particle
        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, s.size * 2.5);
        pGrad.addColorStop(0, `rgba(255, 255, 240, ${currentAlpha})`);
        pGrad.addColorStop(0.4, `rgba(255, 215, 120, ${currentAlpha * 0.6})`);
        pGrad.addColorStop(1, 'rgba(255, 180, 70, 0)');

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, s.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.5, s.size * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Subtle Shimmering Water Ripples across lake surface
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
          const rx = left + rip.x * renderW + parallaxX;
          const ry = top + rip.y * renderH + parallaxY;

          ctx.beginPath();
          ctx.ellipse(rx, ry, rip.radius, rip.radius * 0.32, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 240, 195, ${currentAlpha * 0.55})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

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
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
    />
  );
}

export default HeroPortalCanvas;
