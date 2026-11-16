import { useEffect, useRef, useState } from 'react';

export function AtelierArrival({ includeVisit, onFinish, assetsReady, waiting }: { includeVisit: boolean; onFinish: () => void; assetsReady: boolean; waiting: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [visitSource] = useState(() => {
    if (!includeVisit) return null;
    const prefix = matchMedia('(max-aspect-ratio: 53/100)').matches ? 'tall-' :
      matchMedia('(max-aspect-ratio: 94/100)').matches ? 'mobile-' : '';
    return '/story/frames/' + prefix + 'consultation.webm';
  });
  const [fallbackSource, setFallbackSource] = useState<string | null>(null);
  const fallbackVideo = useRef<HTMLVideoElement>(null);
  const [caption, setCaption] = useState('');
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!canvas.current) return;
    const surface = canvas.current;
    let active = true;
    let stop: (() => void) | undefined;
    import('./openingScene').then(({ playOpening }) => {
      if (!active) return;
      stop = playOpening(surface, visitSource, onFinish, (time, duration) => {
        setCaption(time < 35 / 24 ? 'At the astrologer’s door.' : time >= 7.7 ? 'At the jeweller’s desk.' : '');
        setSettled(time >= duration - .4);
      });
    }).catch(() => { if (active) setFallbackSource('/story/logo-opening.mp4'); });
    return () => { active = false; stop?.(); };
  }, [visitSource, onFinish]);

  // Browsers without WebGL can still play the same full-screen film.
  useEffect(() => {
    const clip = fallbackVideo.current;
    if (!fallbackSource || !clip) return;
    let active = true;
    let timeout = 0;
    const next = () => {
      if (!active) return;
      active = false;
      if (visitSource && fallbackSource !== visitSource) setFallbackSource(visitSource);
      else onFinish();
    };
    const progress = () => {
      clearTimeout(timeout);
      timeout = window.setTimeout(next, 8000);
      if (fallbackSource === visitSource) setSettled(clip.currentTime >= clip.duration - .4);
    };
    progress();
    clip.addEventListener('timeupdate', progress);
    clip.addEventListener('ended', next);
    clip.addEventListener('error', next);
    clip.play().catch(next);
    return () => {
      active = false;
      clearTimeout(timeout);
      clip.removeEventListener('timeupdate', progress);
      clip.removeEventListener('ended', next);
      clip.removeEventListener('error', next);
      clip.pause();
    };
  }, [fallbackSource, visitSource, onFinish]);

  return <div data-lenis-prevent className={'arrival-loading' + (settled && assetsReady ? ' arrival-settled' : '')}>
    <img src="/story/logo-opening.webp" alt="" fetchPriority="high" />
    {fallbackSource
      ? <video key={fallbackSource} ref={fallbackVideo} src={fallbackSource} className="arrival-world" muted playsInline controls={false} disablePictureInPicture disableRemotePlayback aria-hidden="true" />
      : <canvas ref={canvas} className="arrival-world" aria-hidden="true" />}
    <p className="sr-only">The Astro Laabh emblem forms.{includeVisit && ' A visitor enters the astrologer’s study and brings a gemstone recommendation to the jeweller.'}</p>
    {caption && !waiting && <p className="arrival-caption" aria-hidden="true">{caption}</p>}
    {waiting && <p className="arrival-caption" role="status">Preparing your experience…</p>}
  </div>;
}
