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

  // Smooth lerp mouse coordinates for butter-smooth 3D lighting response
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  // Offscreen buffering for seamless feathered video blending
  const offscreenVideoRef = useRef<HTMLCanvasElement | null>(null);
  const offscreenMaskRef = useRef<HTMLCanvasElement | null>(null);
  const lastMaskDimRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  // Initialize stardust sparkles & ambient ripples
  useEffect(() => {
    const sparkles: StardustSparkle[] = [];
    for (let i = 0; i < 32; i++) {
      sparkles.push({
        angle: Math.random() * Math.PI * 2,
        radiusFactor: 0.65 + Math.random() * 0.38,
        speed: 0.0016 + Math.random() * 0.002,
        size: 1.2 + Math.random() * 1.8,
        alpha: 0.4 + Math.random() * 0.6,
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

      // Smooth mouse lerp for cinematic 3D lighting follow
      smoothMouseRef.current.x += (mouseOffset.x - smoothMouseRef.current.x) * 0.08;
      smoothMouseRef.current.y += (mouseOffset.y - smoothMouseRef.current.y) * 0.08;
      const smX = smoothMouseRef.current.x;
      const smY = smoothMouseRef.current.y;

      ctx.clearRect(0, 0, width, height);

      // 1. Responsive background aspect-ratio (1024x576 = 16:9)
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

      // Scroll depth translation (Vertical only; NO flat left-to-right video sliding)
      const scrollY = scrollProgress * 30;

      // 2. Draw pristine background plate (anchored rock-solid to the canvas)
      const bgImg = bgImgRef.current;
      if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
        ctx.drawImage(bgImg, left, top + scrollY, renderW, renderH);
      }

      // 3. Draw Rotating 3D Video on Canvas with Cosine Feather Mask (Solidly Anchored)
      const video = videoRef.current;
      if (video && video.readyState >= 2) {
        const vBuf = offscreenVideoRef.current;
        const mBuf = offscreenMaskRef.current;

        const drawW = Math.round(renderW * 0.78875);
        const drawH = Math.round(renderH * 0.78875);
        const drawX = Math.round(left + renderW * 0.2578125);
        const drawY = Math.round(top + renderH * 0.0677083 + scrollY);

        if (vBuf && mBuf && drawW > 0 && drawH > 0) {
          if (lastMaskDimRef.current.w !== drawW || lastMaskDimRef.current.h !== drawH) {
            lastMaskDimRef.current = { w: drawW, h: drawH };
            mBuf.width = drawW;
            mBuf.height = drawH;
            const mCtx = mBuf.getContext('2d');
            if (mCtx) {
              mCtx.clearRect(0, 0, drawW, drawH);
              mCtx.fillStyle = '#ffffff';
              mCtx.fillRect(0, 0, drawW, drawH);

              const fx = Math.round(drawW * 0.11);
              const fy = Math.round(drawH * 0.11);
              const fyb = Math.round(drawH * 0.15);
              const fxr = Math.round(drawW * 0.06);

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

      // =========================================================================
      // 4. RADIANT 3D LIGHTING & VOLUMETRIC SUNBEAM ENGINE (SCREEN / ADDITIVE)
      // =========================================================================
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const sunOriginX = left + renderW * 0.94;
      const sunOriginY = top + renderH * 0.44 + scrollY;
      const rubyX = left + renderW * 0.619;
      const rubyY = top + renderH * 0.472 + scrollY;

      // 4A. Morning Dawn Sunbeam Godrays streaming from the Right Arch
      const godrayPulse = 0.85 + 0.15 * Math.sin(time * 0.0018);
      const sunGrad = ctx.createRadialGradient(sunOriginX, sunOriginY, 0, sunOriginX, sunOriginY, renderW * 0.48);
      sunGrad.addColorStop(0, `rgba(255, 235, 180, ${0.48 * godrayPulse})`);
      sunGrad.addColorStop(0.25, `rgba(255, 205, 125, ${0.32 * godrayPulse})`);
      sunGrad.addColorStop(0.65, `rgba(240, 160, 65, ${0.14 * godrayPulse})`);
      sunGrad.addColorStop(1, 'rgba(215, 130, 45, 0)');
      ctx.fillStyle = sunGrad;
      ctx.fillRect(left + renderW * 0.45, top + scrollY, renderW * 0.55, renderH);

      // 4B. Golden Solar Starburst Beams radiating downward from Central Ruby
      const beamPulse = 0.88 + 0.12 * Math.sin(time * 0.003);
      const rubyLightX = rubyX + smX * 8; // Dynamic 3D specular response to mouse
      const rubyLightY = rubyY + smY * 6;

      ctx.save();
      ctx.beginPath();
      for (let b = -4; b <= 4; b++) {
        const angle = Math.PI / 2 + (b * 0.048);
        const rayLen = renderH * (0.24 + Math.abs(b) * 0.02) * beamPulse;
        const targetX = rubyLightX + rayLen * Math.cos(angle);
        const targetY = rubyLightY + rayLen * Math.sin(angle);

        const rayGrad = ctx.createLinearGradient(rubyLightX, rubyLightY, targetX, targetY);
        rayGrad.addColorStop(0, `rgba(255, 245, 195, ${0.45 * beamPulse})`);
        rayGrad.addColorStop(0.4, `rgba(255, 200, 100, ${0.28 * beamPulse})`);
        rayGrad.addColorStop(1, 'rgba(255, 180, 70, 0)');

        ctx.strokeStyle = rayGrad;
        ctx.lineWidth = 2.2 + (4 - Math.abs(b)) * 0.6;
        ctx.moveTo(rubyLightX, rubyLightY + 6);
        ctx.lineTo(targetX, targetY);
      }
      ctx.stroke();
      ctx.restore();

      // 4C. Solar Core Warm Radiance Halo around Ruby
      const rubyHalo = ctx.createRadialGradient(rubyLightX, rubyLightY, 0, rubyLightX, rubyLightY, renderW * 0.12);
      rubyHalo.addColorStop(0, 'rgba(255, 230, 165, 0.48)');
      rubyHalo.addColorStop(0.3, 'rgba(255, 80, 110, 0.28)');
      rubyHalo.addColorStop(0.7, 'rgba(215, 45, 85, 0.12)');
      rubyHalo.addColorStop(1, 'rgba(180, 20, 50, 0)');
      ctx.fillStyle = rubyHalo;
      ctx.beginPath();
      ctx.arc(rubyLightX, rubyLightY, renderW * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // 4D. Prismatic 3D Gemstone Starbursts & Cursor Specular Glints
      // Solitaire Diamond (fx: 0.733, fy: 0.310)
      const diamondX = left + renderW * 0.733;
      const diamondY = top + renderH * 0.310 + scrollY;
      const dHover = hoveredGemId === 'diamond' ? 1.6 : 1.0;
      const dShimmer = (0.75 + 0.25 * Math.sin(time * 0.005 + 1.2)) * dHover;

      // Diamond 4-point brilliant star diffraction spikes
      const dFlareLen = 18 * dShimmer;
      ctx.save();
      ctx.translate(diamondX + smX * 4, diamondY + smY * 3);
      ctx.rotate(0.08 * Math.sin(time * 0.002));
      const dGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, dFlareLen);
      dGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * dShimmer})`);
      dGrad.addColorStop(0.3, `rgba(220, 240, 255, ${0.65 * dShimmer})`);
      dGrad.addColorStop(1, 'rgba(200, 235, 255, 0)');
      ctx.strokeStyle = dGrad;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(-dFlareLen, 0); ctx.lineTo(dFlareLen, 0);
      ctx.moveTo(0, -dFlareLen); ctx.lineTo(0, dFlareLen);
      ctx.moveTo(-dFlareLen * 0.45, -dFlareLen * 0.45); ctx.lineTo(dFlareLen * 0.45, dFlareLen * 0.45);
      ctx.moveTo(-dFlareLen * 0.45, dFlareLen * 0.45); ctx.lineTo(dFlareLen * 0.45, -dFlareLen * 0.45);
      ctx.stroke();
      ctx.restore();

      // Yellow Sapphire (fx: 0.819, fy: 0.421)
      const ysX = left + renderW * 0.819;
      const ysY = top + renderH * 0.421 + scrollY;
      const ysHover = hoveredGemId === 'gold' ? 1.5 : 1.0;
      const ysPulse = (0.8 + 0.2 * Math.sin(time * 0.004 + 2.5)) * ysHover;
      const ysGrad = ctx.createRadialGradient(ysX + smX * 3, ysY + smY * 2, 0, ysX, ysY, 26 * ysPulse);
      ysGrad.addColorStop(0, `rgba(255, 240, 180, ${0.75 * ysPulse})`);
      ysGrad.addColorStop(0.5, `rgba(255, 180, 40, ${0.38 * ysPulse})`);
      ysGrad.addColorStop(1, 'rgba(255, 150, 0, 0)');
      ctx.fillStyle = ysGrad;
      ctx.beginPath();
      ctx.arc(ysX, ysY, 26 * ysPulse, 0, Math.PI * 2);
      ctx.fill();

      // Blue Sapphire (fx: 0.466, fy: 0.563)
      const bsX = left + renderW * 0.466;
      const bsY = top + renderH * 0.563 + scrollY;
      const bsHover = hoveredGemId === 'sapphire' ? 1.5 : 1.0;
      const bsPulse = (0.78 + 0.22 * Math.sin(time * 0.004 + 4.1)) * bsHover;
      const bsGrad = ctx.createRadialGradient(bsX + smX * 3, bsY + smY * 2, 0, bsX, bsY, 24 * bsPulse);
      bsGrad.addColorStop(0, `rgba(210, 235, 255, ${0.7 * bsPulse})`);
      bsGrad.addColorStop(0.4, `rgba(60, 140, 255, ${0.35 * bsPulse})`);
      bsGrad.addColorStop(1, 'rgba(30, 80, 240, 0)');
      ctx.fillStyle = bsGrad;
      ctx.beginPath();
      ctx.arc(bsX, bsY, 24 * bsPulse, 0, Math.PI * 2);
      ctx.fill();

      // Colombian Emerald (fx: 0.481, fy: 0.389)
      const emX = left + renderW * 0.481;
      const emY = top + renderH * 0.389 + scrollY;
      const emHover = hoveredGemId === 'emerald' ? 1.5 : 1.0;
      const emPulse = (0.78 + 0.22 * Math.sin(time * 0.004 + 0.8)) * emHover;
      const emGrad = ctx.createRadialGradient(emX + smX * 3, emY + smY * 2, 0, emX, emY, 24 * emPulse);
      emGrad.addColorStop(0, `rgba(220, 255, 220, ${0.7 * emPulse})`);
      emGrad.addColorStop(0.4, `rgba(40, 220, 110, ${0.35 * emPulse})`);
      emGrad.addColorStop(1, 'rgba(10, 170, 70, 0)');
      ctx.fillStyle = emGrad;
      ctx.beginPath();
      ctx.arc(emX, emY, 24 * emPulse, 0, Math.PI * 2);
      ctx.fill();

      // South Sea Pearl (fx: 0.749, fy: 0.564)
      const pX = left + renderW * 0.749;
      const pY = top + renderH * 0.564 + scrollY;
      const pHover = hoveredGemId === 'pearl' ? 1.5 : 1.0;
      const pPulse = (0.8 + 0.2 * Math.sin(time * 0.0035 + 3.3)) * pHover;
      const pGrad = ctx.createRadialGradient(pX - 4 + smX * 2, pY - 4 + smY * 2, 0, pX, pY, 26 * pPulse);
      pGrad.addColorStop(0, `rgba(255, 255, 250, ${0.8 * pPulse})`);
      pGrad.addColorStop(0.5, `rgba(255, 235, 205, ${0.4 * pPulse})`);
      pGrad.addColorStop(1, 'rgba(255, 220, 180, 0)');
      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.arc(pX, pY, 26 * pPulse, 0, Math.PI * 2);
      ctx.fill();

      // 4E. Luminous Golden Orbital Rings Glow
      // Draws an additive bloom along the elliptical orbital path around the ruby
      const orbitRadius = renderW * 0.185;
      ctx.save();
      ctx.translate(rubyLightX, rubyLightY);
      ctx.rotate(-0.22);
      ctx.beginPath();
      ctx.ellipse(0, 0, orbitRadius * 0.95, orbitRadius * 0.56, 0, 0, Math.PI * 2);
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = `rgba(255, 225, 140, ${0.28 * beamPulse})`;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, orbitRadius * 0.72, orbitRadius * 0.38, 0, 0, Math.PI * 2);
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = `rgba(255, 235, 170, ${0.2 * beamPulse})`;
      ctx.stroke();
      ctx.restore();

      ctx.restore(); // Restore from 'screen' mode

      // =========================================================================
      // 5. STARDUST SPARKLES TRAILING ALONG THE 3D ORBITAL PATH
      // =========================================================================
      for (let i = 0; i < sparklesRef.current.length; i++) {
        const s = sparklesRef.current[i];
        s.angle += s.speed;

        const rx = orbitRadius * s.radiusFactor;
        const ry = orbitRadius * 0.58 * s.radiusFactor;
        const rot = -0.22;

        const ex = rx * Math.cos(s.angle);
        const ey = ry * Math.sin(s.angle);
        const px = rubyLightX + ex * Math.cos(rot) - ey * Math.sin(rot);
        const py = rubyLightY + ex * Math.sin(rot) + ey * Math.cos(rot);

        const shimmer = 0.6 + 0.4 * Math.sin(time * 0.004 + s.phase);
        const currentAlpha = s.alpha * shimmer;

        const pGrad = ctx.createRadialGradient(px, py, 0, px, py, s.size * 2.8);
        pGrad.addColorStop(0, `rgba(255, 255, 245, ${currentAlpha})`);
        pGrad.addColorStop(0.4, `rgba(255, 220, 130, ${currentAlpha * 0.7})`);
        pGrad.addColorStop(1, 'rgba(255, 185, 75, 0)');

        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(px, py, s.size * 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, Math.max(0.6, s.size * 0.45), 0, Math.PI * 2);
        ctx.fill();
      }

      // =========================================================================
      // 6. SHIMMERING LAKE WATER RIPPLES WITH SPECULAR DAWN HIGHLIGHTS
      // =========================================================================
      if (time - lastRippleTimeRef.current > 1600) {
        lastRippleTimeRef.current = time;
        const lotusPositions = [
          { x: 0.31, y: 0.76 },
          { x: 0.62, y: 0.74 },
          { x: 0.89, y: 0.78 },
          { x: 0.22, y: 0.83 },
          { x: 0.52, y: 0.81 },
        ];
        const pick = lotusPositions[Math.floor(Math.random() * lotusPositions.length)];
        ripplesRef.current.push({
          x: pick.x,
          y: pick.y,
          radius: 3,
          maxRadius: 50 + Math.random() * 35,
          alpha: 0.4,
          speed: 0.32 + Math.random() * 0.16,
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
          ctx.strokeStyle = `rgba(255, 245, 210, ${currentAlpha * 0.65})`;
          ctx.lineWidth = 1.0;
          ctx.stroke();

          ctx.beginPath();
          ctx.ellipse(rx, ry + 0.6, rip.radius + 0.8, rip.radius * 0.32, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(180, 140, 95, ${currentAlpha * 0.25})`;
          ctx.lineWidth = 0.7;
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
    />
  );
}

export default HeroPortalCanvas;
