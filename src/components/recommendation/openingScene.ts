import * as T from 'three';

function film(source: string) {
  // Detached decoders supply textures. Only the WebGL canvas is displayed.
  const video = document.createElement('video');
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.controls = false;
  video.disablePictureInPicture = true;
  video.disableRemotePlayback = true;
  video.preload = 'auto';
  video.src = source;

  const texture = new T.VideoTexture(video);
  texture.colorSpace = T.SRGBColorSpace;
  texture.wrapT = T.MirroredRepeatWrapping;
  const material = new T.MeshBasicMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false });
  const mesh = new T.Mesh(new T.PlaneGeometry(1, 1), material);
  mesh.visible = false;
  return { video, texture, mesh };
}

export function playOpening(canvas: HTMLCanvasElement, visitSource: string | null, onFinish: () => void, onRoomTime: (time: number, duration: number) => void) {
  const renderer = new T.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.setClearColor(0x000000, 0);
  const camera = new T.PerspectiveCamera(32, 1, .1, 20);
  camera.position.z = 3;
  const scene = new T.Scene();
  const title = film('/story/logo-opening.mp4');
  const room = visitSource ? film(visitSource) : null;
  const plates = room ? [title, room] : [title];
  scene.add(...plates.map(plate => plate.mesh));
  if (room) room.mesh.renderOrder = 1;

  let active = true, inRoom = false, paintedTitle = false, frame = 0;
  let roomBlendStart = -1, lastTime = -1, lastAdvance = performance.now();
  let needsRender = true, lastPlateFrame = -1, captionTick = -1;
  let aimX = 0, aimY = 0, driftX = 0, driftY = 0;
  function finish() {
    if (!active) return;
    active = false;
    onFinish();
  }
  function enterRoom() {
    if (!active || inRoom) return;
    if (!room) { finish(); return; }
    inRoom = true;
    title.video.pause();
    lastTime = -1;
    lastAdvance = performance.now();
    room.video.play().catch(finish);
  }

  function resize() {
    const width = canvas.clientWidth, height = canvas.clientHeight;
    if (!width || !height) return;
    needsRender = true;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.setSize(width, height, false);
    const frameHeight = 2 * camera.position.z * Math.tan(T.MathUtils.degToRad(camera.fov / 2));
    for (const plate of plates) {
      const videoAspect = plate.video.videoWidth / plate.video.videoHeight || 16 / 9;
      // Extend the plain paper above and below the title on very narrow screens.
      // This keeps both rows of lettering inside the camera's safe area.
      const sampledWidth = Math.min(1, Math.max(plate === title ? .38 : 0, camera.aspect / videoAspect));
      const sampledHeight = sampledWidth * videoAspect / camera.aspect;
      plate.texture.repeat.set(sampledWidth, sampledHeight);
      plate.texture.offset.set((1 - sampledWidth) / 2, (1 - sampledHeight) / 2);
      plate.mesh.scale.set(frameHeight * camera.aspect, frameHeight, 1);
    }
  }
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  function pointer(event: PointerEvent) {
    aimX = event.clientX / innerWidth * 2 - 1;
    aimY = 1 - event.clientY / innerHeight * 2;
  }
  function resume() { lastAdvance = performance.now(); }
  window.addEventListener('pointermove', pointer, { passive: true });
  document.addEventListener('visibilitychange', resume);
  canvas.addEventListener('webglcontextlost', finish);
  for (const plate of plates) plate.video.addEventListener('loadedmetadata', resize);
  title.video.addEventListener('ended', enterRoom);
  title.video.addEventListener('error', enterRoom);
  room?.video.addEventListener('ended', finish);
  title.video.play().catch(enterRoom);

  function draw(now: number) {
    if (!active) return;
    const current = inRoom && room ? room.video : title.video;
    if (current.currentTime !== lastTime) {
      lastAdvance = now;
      lastTime = current.currentTime;
    } else if (!document.hidden && now - lastAdvance > 8000) {
      if (inRoom) finish(); else enterRoom();
    }
    if (!active) return;
    if (inRoom && room && room.video.error) { finish(); return; }
    if (title.video.readyState >= 2 && !inRoom) {
      title.mesh.visible = true;
      paintedTitle = true;
    }
    if (inRoom && room && room.video.readyState >= 2) {
      if (roomBlendStart < 0) roomBlendStart = now;
      const blend = paintedTitle ? T.MathUtils.smoothstep(now - roomBlendStart, 0, 400) : 1;
      room.mesh.visible = true;
      room.mesh.material.opacity = blend;
      title.mesh.visible = paintedTitle && blend < 1;
      const tick = Math.floor(room.video.currentTime * 10);
      if (tick !== captionTick) {
        captionTick = tick;
        onRoomTime(room.video.currentTime, room.video.duration);
      }
      if (blend < 1) needsRender = true;
    }
    // A shallow camera drift gives the scene a little depth. Settle exactly on
    // the baked desk framing before revealing the interactive Three.js camera.
    const settle = inRoom && room ? 1 - T.MathUtils.smoothstep(room.video.currentTime, 6.7, 7.5) : 1;
    driftX = T.MathUtils.lerp(driftX, aimX, .06);
    driftY = T.MathUtils.lerp(driftY, aimY, .06);
    const x = .008 * driftX * settle, y = .005 * driftY * settle;
    const zoom = 1 + .022 * settle;
    const plate = inRoom && room ? room : title;
    const decodedFrame = typeof current.requestVideoFrameCallback === 'function'
      ? plate.texture.version : Math.floor(current.currentTime * 30);
    // Static film frames do not need a GPU draw on every display refresh.
    if (needsRender || decodedFrame !== lastPlateFrame || Math.abs(x - camera.position.x) + Math.abs(y - camera.position.y) > .0001 || zoom !== camera.zoom) {
      camera.position.set(x, y, camera.position.z);
      if (zoom !== camera.zoom) { camera.zoom = zoom; camera.updateProjectionMatrix(); }
      renderer.render(scene, camera);
      lastPlateFrame = decodedFrame;
      needsRender = false;
    }
    frame = requestAnimationFrame(draw);
  }
  frame = requestAnimationFrame(draw);

  return () => {
    active = false;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener('pointermove', pointer);
    document.removeEventListener('visibilitychange', resume);
    canvas.removeEventListener('webglcontextlost', finish);
    title.video.removeEventListener('ended', enterRoom);
    title.video.removeEventListener('error', enterRoom);
    room?.video.removeEventListener('ended', finish);
    for (const plate of plates) {
      plate.video.removeEventListener('loadedmetadata', resize);
      plate.video.pause();
      plate.video.removeAttribute('src');
      plate.video.load();
      plate.texture.dispose();
      plate.mesh.material.dispose();
      plate.mesh.geometry.dispose();
    }
    renderer.dispose();
    renderer.forceContextLoss();
  };
}
