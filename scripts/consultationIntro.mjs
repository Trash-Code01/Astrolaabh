// The live-action plate is the clean 1080p crop of the supplied 24 fps film.
// The seal is the visual anchor for the cut to the interactive desk camera.
export const fps=24;
export const deskFrame=180;
export const frameCount=deskFrame+60;

export async function consultationIntro() {
  const film=document.createElement('video');
  film.muted=true;
  film.preload='auto';
  await new Promise((resolve,reject)=>{
    film.onloadeddata=resolve;
    film.onerror=()=>reject(new Error('Cannot decode the consultation film'));
    film.src='/creative/consultation/recommendation-clean.mp4';
  });
  const canvas=document.createElement('canvas');
  const ctx=canvas.getContext('2d',{alpha:false});
  function frameCentre(t){
    // Follow the visitor to the desk, then switch framing on the film's own cuts.
    if(t<35/24)return .41+.19*Math.min(1,t/(35/24));
    if(t<3)return .54;
    if(t<4.5)return .58;
    return .52+.15*Math.min(1,(t-4.5)/2.85);
  }
  return async function draw(frame,w,h,studio,surface){
    const desk=frame>=deskFrame;
    const elapsed=frame-deskFrame;
    if(desk){
      studio.draw(-.65*(1-elapsed/(frameCount-deskFrame-1)));
      if(elapsed>=4)return surface;
    }
    const t=(frame+.25)/fps;
    await new Promise((resolve,reject)=>{
      film.onseeked=resolve;
      film.onerror=()=>reject(new Error('Cannot seek the consultation film'));
      film.currentTime=t;
    });
    if(canvas.width!==w || canvas.height!==h){canvas.width=w;canvas.height=h;}
    const scale=Math.max(w/film.videoWidth,h/film.videoHeight);
    const cropWidth=w/scale,cropHeight=h/scale;
    const left=Math.min(film.videoWidth-cropWidth,Math.max(0,film.videoWidth*frameCentre(t)-cropWidth/2));
    ctx.drawImage(film,left,(film.videoHeight-cropHeight)/2,cropWidth,cropHeight,0,0,w,h);
    if(desk){
      ctx.globalAlpha=(elapsed+1)/5;
      ctx.drawImage(surface,0,0,w,h);
      ctx.globalAlpha=1;
    }
    return canvas;
  };
}
