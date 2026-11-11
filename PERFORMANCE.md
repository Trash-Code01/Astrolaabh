# Performance and responsive pass

## Measured assets

- 34 referenced PNG masters: **44,001,414 bytes → 5,926,342 bytes** in WebP (86.5% smaller). Originals remain intact.
- Four additional 640px gallery/lookbook images serve small screens through `srcSet`.
- Production JavaScript across all routes: **580,331 bytes** uncompressed; largest chunk **133,915 bytes**. Home, product, discovery, bag and checkout load as separate route bundles.
- Regenerate web images with `python scripts/optimize_images.py` (Pillow required). Individual results are in `src/assets/optimized/size-report.json`.

## Runtime changes

- Replaced React Three Fiber gallery canvases with one-pass WebGL image distortion. Textures upload on interaction, cover cropping and pointer coordinates match the image, and rendering stops after the ripple settles. All GPU resources and listeners are cleaned up. The real image remains the fallback for unavailable/lost WebGL, touch devices and reduced motion.
- Hero draws at up to 30 fps, resizes only when dimensions change, and pauses the canvas/video offscreen or in a hidden tab. Phone and reduced-motion layouts use an image composition without requesting the video.
- Removed the fixed-duration entry preloader. Below-fold editorial, product-story and footer images load lazily.
- Removed per-frame global scroll-store updates. Touch/small-screen scrolling is native. Phone lookbooks use normal vertical flow instead of scroll pinning.
- Kept all home section anchors mounted; section links also resolve after lazy route loading.

## Verification

- `npm run build`: TypeScript and Vite production build passed.
- All 34 generated WebP files decoded successfully with Pillow; `git diff --check` passed.
- Browser checks at 320, 390, 1024 and 1440px: no document horizontal overflow in sampled home/product/bag views.
- Mobile navigation: internal scrolling, Escape/focus handling, gemstone routes; four-step discovery with unknown birth time; product metal/form selection; correct product top and collection-anchor navigation.
- Desktop gallery: keyboard interaction rendered the ripple at its actual display size; all four canvas layers returned to opacity zero after blur. Original image color and crop visually checked.

These are local build/asset measurements and responsive browser checks, not a Lighthouse score or a physical-device benchmark.
