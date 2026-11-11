import { useEffect, useRef } from 'react';

// A single image pass, allocated on interaction and rendered only while rippling.
const vertex = `attribute vec2 position; varying vec2 uv;
void main(){uv=position*.5+.5;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision mediump float;
uniform sampler2D picture;
uniform vec2 size, imageSize, pointer;
uniform float time, amplitude, radius;
varying vec2 uv;
void main(){
  float aspect=size.x/size.y;
  float imageAspect=imageSize.x/imageSize.y;
  vec2 cover=vec2(min(aspect/imageAspect,1.),min(imageAspect/aspect,1.));
  vec2 delta=(uv-pointer)*vec2(aspect,1.);
  float d=length(delta);
  float falloff=1.-smoothstep(0.,radius,d);
  vec2 direction=delta/max(d,.001)/vec2(aspect,1.);
  float broadRipple=sin(d*23.-time*2.8)*.34;
  float fineRipple=sin(d*47.-time*4.6)*.66;
  float wave=(broadRipple+fineRipple)*falloff*falloff;
  vec2 sampleUv=(uv-.5+direction*wave*amplitude)*cover+.5;
  gl_FragColor=texture2D(picture,clamp(sampleUv,.001,.999));
}`;

export interface LiquidDistortionImageProps {
  imageUrl: string;
  alt?: string;
  className?: string;
  strength?: number;
  radius?: number;
  srcSet?: string;
  sizes?: string;
}

export function LiquidDistortionImage({ imageUrl, alt = 'Astrolaabh jewellery', className = '', strength = .035, radius = .38, srcSet, sizes }: LiquidDistortionImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current, img = imageRef.current, canvas = canvasRef.current;
    if (!container || !img || !canvas) return;
    const preference = matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let dispose: (() => void) | undefined;
    const setup = () => {
      dispose?.(); dispose = undefined;
      if (!preference.matches) return;
      let gl: WebGLRenderingContext | null = null;
      let program: WebGLProgram | null = null, texture: WebGLTexture | null = null, buffer: WebGLBuffer | null = null;
      const shaders: WebGLShader[] = [];
      let frame = 0, amount = 0, previous = 0, elapsed = 0, uploadedSource = '';
      let hovered = false, visible = true, failed = false;
      const target = { x: .5, y: .5 }, point = { ...target };
      let locations: Record<string, WebGLUniformLocation | null> = {};
      const hide = () => { cancelAnimationFrame(frame); frame = 0; amount = 0; canvas.style.opacity = '0'; };
      const initialize = () => {
        if (failed || !img.complete || !img.naturalWidth) return false;
        try {
          if (!gl) {
            gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, powerPreference: 'low-power' });
            if (!gl) throw new Error('WebGL unavailable');
            program = gl.createProgram();
            for (const [type, source] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]] as const) {
              const shader = gl.createShader(type)!; shaders.push(shader);
              gl.shaderSource(shader, source); gl.compileShader(shader);
              if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('Shader unavailable');
              gl.attachShader(program!, shader);
            }
            gl.linkProgram(program!);
            if (!gl.getProgramParameter(program!, gl.LINK_STATUS)) throw new Error('Program unavailable');
            gl.useProgram(program);
            buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
            const position = gl.getAttribLocation(program!, 'position');
            gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
            texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
            locations = Object.fromEntries(['size','imageSize','pointer','time','amplitude','radius'].map(name => [name, gl!.getUniformLocation(program!, name)]));
          }
          if (uploadedSource !== img.currentSrc) {
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            uploadedSource = img.currentSrc;
          }
          return true;
        } catch { failed = true; hide(); return false; }
      };
      const render = (now: number) => {
        frame = 0;
        if (!visible || document.hidden || !gl) { hide(); return; }
        const dt = Math.min((now - previous) / 1000, .05); previous = now; elapsed += dt;
        const blend = 1 - Math.exp(-dt * 10);
        amount += ((hovered ? strength : 0) - amount) * blend;
        point.x += (target.x - point.x) * blend; point.y += (target.y - point.y) * blend;
        const rect = container.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 1.5);
        const width = Math.max(1, Math.round(rect.width * dpr)), height = Math.max(1, Math.round(rect.height * dpr));
        if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
        gl.viewport(0, 0, width, height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform2f(locations.size, width, height); gl.uniform2f(locations.imageSize, img.naturalWidth, img.naturalHeight);
        gl.uniform2f(locations.pointer, point.x, point.y); gl.uniform1f(locations.time, elapsed);
        gl.uniform1f(locations.amplitude, amount); gl.uniform1f(locations.radius, radius);
        gl.drawArrays(gl.TRIANGLES, 0, 6); canvas.style.opacity = '1';
        if (hovered || amount > .0001) frame = requestAnimationFrame(render); else hide();
      };
      const start = () => { if (!frame && visible && !document.hidden && initialize()) { previous = performance.now(); frame = requestAnimationFrame(render); } };
      const move = (event: PointerEvent) => { const rect = container.getBoundingClientRect(); target.x = (event.clientX - rect.left) / rect.width; target.y = 1 - (event.clientY - rect.top) / rect.height; };
      const enter = (event: PointerEvent) => { hovered = true; move(event); point.x = target.x; point.y = target.y; start(); };
      const leave = () => { hovered = false; };
      const anchor = container.closest('a');
      const focus = () => { hovered = true; target.x = .5; target.y = .5; start(); };
      const onLoad = () => { if (hovered) start(); };
      const onVisibility = () => { if (document.hidden) hide(); else if (hovered) start(); };
      const onLost = (event: Event) => { event.preventDefault(); failed = true; hide(); };
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) { hovered = false; hide(); } });
      observer.observe(container);
      container.addEventListener('pointerenter', enter); container.addEventListener('pointermove', move); container.addEventListener('pointerleave', leave);
      anchor?.addEventListener('focus', focus); anchor?.addEventListener('blur', leave);
      img.addEventListener('load', onLoad); canvas.addEventListener('webglcontextlost', onLost); document.addEventListener('visibilitychange', onVisibility);
      dispose = () => {
        hide(); observer.disconnect();
        container.removeEventListener('pointerenter', enter); container.removeEventListener('pointermove', move); container.removeEventListener('pointerleave', leave);
        anchor?.removeEventListener('focus', focus); anchor?.removeEventListener('blur', leave);
        img.removeEventListener('load', onLoad); canvas.removeEventListener('webglcontextlost', onLost); document.removeEventListener('visibilitychange', onVisibility);
        if (gl) { gl.deleteTexture(texture); gl.deleteBuffer(buffer); gl.deleteProgram(program); shaders.forEach(shader => gl!.deleteShader(shader)); }
      };
    };
    setup(); preference.addEventListener('change', setup);
    return () => { dispose?.(); preference.removeEventListener('change', setup); };
  }, [imageUrl, strength, radius]);

  return <div ref={containerRef} className={`liquid-image relative w-full h-full overflow-hidden ${className}`}>
    <img ref={imageRef} src={imageUrl} srcSet={srcSet} sizes={sizes} alt={alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
    <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0 }} />
  </div>;
}
export default LiquidDistortionImage;
