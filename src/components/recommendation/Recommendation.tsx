import { useEffect, useRef, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { scrollToTarget } from '../../lib/lenis';
import type { StoryRenderer } from './studio';
import type { SettingChoice } from './settingTray';
import { SettingOptions, SettingShop } from './SettingShop';
import handoffFrames from './handoffFrames.json';
import './recommendation.css';

const chapters = [
  { name: 'The letter', title: 'A recommendation.', text: '“I was told to wear a Pukhraj. What should I look for?”', action: 'Open the letter', stop: 0 },
  { name: 'The stone', title: 'Pukhraj.', text: 'Yellow sapphire, seen in the morning light.', action: 'Look closer', stop: .395 },
  { name: 'The lens', title: 'A closer look.', text: 'What is its weight? Has it been treated? May I see the lab report?', action: 'Follow the facet', stop: .645 },
  { name: 'The astrolabe', title: 'Find your bearing.', text: 'The recommendation points to yellow sapphire. At the bench, the jeweller gives this stone its final facet.', action: 'Follow the stone', stop: .98 },
  { name: 'The final polish', title: 'One last facet.', text: 'A turn of the polishing lap brings the facet into the light.', action: 'Set the stone', stop: 1.21 },
  { name: 'The workbench', title: 'Set by hand.', text: 'The jeweller lowers the polished sapphire into four waiting prongs.', action: 'See the finished piece', stop: 1.82 },
  { name: 'Your setting', title: 'Wear your Pukhraj.', text: '', action: '', stop: 2.02 },
];
const storyEnd = 2.18;
const frames = [
  { at: 0, name:'letter' }, { at:.12, name:'reach' }, { at:.176,name:'seal-lift' }, { at:.22,name:'fold' },
  { at:.38,name:'pukhraj' }, { at:.55,name:'loupe' }, { at:.66,name:'lens' },
  { at:.787,name:'facet' }, { at:.982,name:'astrolabe' },
  ...Object.entries(handoffFrames).map(([name,at])=>({name,at})),
  { at:1.635,name:'carry-start' }, { at:1.71,name:'carry' }, { at:1.77,name:'align' }, { at:1.82,name:'lower' }, { at:1.87,name:'seated' },
  { at:1.90,name:'release' }, { at:2.02,name:'setting' },
];
export default function Recommendation({ onSceneReady }: { onSceneReady: () => void }) {
  const section=useRef<HTMLElement>(null), stage=useRef<HTMLDivElement>(null), canvas=useRef<HTMLCanvasElement>(null);
  const progress=useRef(0), renderer=useRef<StoryRenderer|null>(null);
  const [choice,setChoice]=useState<SettingChoice>({form:'Ring',metalId:'yellow-gold'});
  const currentChoice=useRef(choice);
  const playback=useRef<AbortController|null>(null);
  useEffect(()=>()=>playback.current?.abort(),[]);
  function changeSetting(next:SettingChoice) {
    currentChoice.current=next;
    setChoice(next);
    renderer.current?.draw(progress.current,next);
  }
  const [chapter,setChapter]=useState(0), [frame,setFrame]=useState(0), [live,setLive]=useState(false);
  const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{
    if(live || chapter!==4)return;
    const prefix=matchMedia('(max-aspect-ratio: 94/100)').matches?'mobile-':'';
    for(const next of frames.slice(Math.max(0,frame-2),frame+5)){
      if(next.at>=1.12 && next.at<=1.58){
        const image=new Image();
        image.src='/story/frames/'+prefix+next.name+'.webp';
      }
    }
  },[chapter,frame,live]);
  useEffect(()=>{
    const pref=matchMedia('(prefers-reduced-motion: reduce)');
    const sync=()=>setReduced(pref.matches);
    pref.addEventListener('change',sync);return ()=>pref.removeEventListener('change',sync);
  },[]);
  useEffect(()=>{
    const host=section.current!, viewport=stage.current!, surface=canvas.current!;
    let pending=0, spinTimer=0,vis=true,failed=false,angle=0,lastSpin=0;
    const abort=new AbortController();
    let notified = false;
    const ready = () => { if (!notified) { notified = true; onSceneReady(); } };
    const fallback=()=>{
      ready();
      failed=true;setLive(false);
      renderer.current?.dispose();renderer.current=null;
    };
    const paint=()=>{
      pending=0;window.clearTimeout(spinTimer);
      if(!vis || document.hidden){lastSpin=0;return;}
      const rect=host.getBoundingClientRect();
      const p=storyEnd*Math.min(1,Math.max(0,-rect.top/Math.max(1,host.offsetHeight-viewport.offsetHeight)));
      progress.current=p;
      setChapter(p<.29?0:p<.50?1:p<.865?2:p<1.12?3:p<1.53?4:p<1.97?5:6);
      let nearest=0;frames.forEach((f,i)=>{if(Math.abs(f.at-p)<Math.abs(frames[nearest].at-p))nearest=i;});
      setFrame(nearest);
      viewport.style.setProperty('--progress',String(p));
      if(renderer.current && !failed) {
        const spinning=p>1.09 && p<1.35;
        if(p<=1.09)angle=0;
        const now=performance.now();
        if(spinning && lastSpin)angle+=Math.min(now-lastSpin,80)*.0028*Math.min(1,(1.35-p)/.035);
        lastSpin=spinning?now:0;
        try {
          renderer.current.draw(p,currentChoice.current,angle);setLive(true);ready();
          if(spinning)spinTimer=window.setTimeout(queue,32);
        } catch {fallback();}
      }
    };
    const queue=()=>{if(!pending)pending=requestAnimationFrame(paint);};
    const observer=new IntersectionObserver(([entry])=>{vis=entry.isIntersecting;queue();});observer.observe(host);
    const resize=new ResizeObserver(queue);resize.observe(viewport);
    const lost=(event:Event)=>{event.preventDefault();fallback();};
    surface.addEventListener('webglcontextlost',lost);
    window.addEventListener('scroll',queue,{passive:true});document.addEventListener('visibilitychange',queue);
    setLive(false);queue();
    if(!reduced) {
      import('./studio').then(m=>{abort.signal.throwIfAborted();return m.createStory(surface,abort.signal);}).then(result=>{
        if(abort.signal.aborted){result.dispose();return;}
        renderer.current=result;queue();
      }).catch(()=>{if(!abort.signal.aborted)fallback();});
    }
    return ()=>{
      abort.abort();cancelAnimationFrame(pending);window.clearTimeout(spinTimer);observer.disconnect();resize.disconnect();
      surface.removeEventListener('webglcontextlost',lost);window.removeEventListener('scroll',queue);
      document.removeEventListener('visibilitychange',queue);renderer.current?.dispose();renderer.current=null;
    };
  },[reduced,onSceneReady]);
  function goTo(p:number) {
    playback.current?.abort();
    if(!section.current||!stage.current)return;
    const top=window.scrollY+section.current.getBoundingClientRect().top;
    scrollToTarget(top+p/storyEnd*(section.current.offsetHeight-stage.current.offsetHeight));
  }
  function setPiece(){
    const host=section.current,viewport=stage.current;
    if(!host||!viewport)return;
    const end=chapters[6].stop;
    if(reduced){goTo(end);return;}
    playback.current?.abort();
    const run=new AbortController();
    playback.current=run;
    const start=window.scrollY;
    const finish=start+host.getBoundingClientRect().top+end/storyEnd*(host.offsetHeight-viewport.offsetHeight);
    const started=performance.now();
    let frameId=0;
    function advance(now:number){
      const t=Math.min(1,(now-started)/4800);
      scrollToTarget(start+(finish-start)*t*t*(3-2*t),0,true);
      if(t<1)frameId=requestAnimationFrame(advance);
      else run.abort();
    }
    run.signal.addEventListener('abort',()=>cancelAnimationFrame(frameId),{once:true});
    for(const event of ['wheel','touchstart','pointerdown','keydown','resize']){
      window.addEventListener(event,()=>run.abort(),{signal:run.signal,passive:true});
    }
    frameId=requestAnimationFrame(advance);
  }
  const current=chapters[chapter];
  const still=frames[frame].name+(frames[frame].at>=1.635 ? '-'+choice.form.toLowerCase()+'-'+choice.metalId : '');
  return <section id="hero" className="rec-story" ref={section} aria-label="The Pukhraj story">
    <span id="pukhraj-atelier" aria-hidden="true" className="rec-atelier-anchor" style={{top:`calc((100% - 100svh) * ${chapters[3].stop/storyEnd})`}} />
    <div className={'rec-stage'+(chapter===6?' rec-showcase':chapter>=3?' rec-green':'')+(chapter===4||chapter===6?' rec-shopping':'')+(choice.form==='Ring'&&frames[frame].at>=1.71&&frames[frame].name!=='setting'?' rec-ring-portrait':'')} ref={stage}>
      {!live && <picture className="rec-still" aria-hidden="true">
        {(frames[frame].at<.80 || frames[frame].name==='setting') && <source media="(max-aspect-ratio: 53/100)" srcSet={'/story/frames/tall-'+still+'.webp'} />}
        <source media="(max-aspect-ratio: 94/100)" srcSet={'/story/frames/mobile-'+still+'.webp'} />
        <img src={'/story/frames/'+still+'.webp'} alt="" />
      </picture>}
      <canvas ref={canvas} className={'rec-world'+(live?' is-ready':'')} aria-hidden="true" />
      <div className="rec-scrim"/>
      <div className="rec-copy" key={current.name}>
        <span className="rec-chapter"><i/>{chapter===0?'At the jeweller’s desk':current.name}</span>
        <h1>{current.title}</h1>
        {current.text && <p>{current.text}</p>}
        {chapter===4 && <div className="rec-shop rec-polish-choice"><SettingOptions choice={choice} onChange={changeSetting}/></div>}
        {chapter===6 ? <SettingShop choice={choice} onChange={changeSetting}/> :
          <div className="rec-actions"><button className="rec-primary" onClick={chapter===4 ? setPiece : ()=>goTo(chapters[chapter+1].stop)}>{chapter===4 ? 'Set my '+choice.form.toLowerCase() : current.action}<ArrowDown size={15}/></button>
          {chapter===3 && <a className="rec-advisor" href="/find-gem#consultation">Ask an advisor</a>}</div>}
      </div>
      <div className="rec-controls">
        <nav className="rec-stops" aria-label="Story chapters">{chapters.map((item,i)=><button key={item.name} aria-label={'Go to '+item.name.toLowerCase()} aria-current={i===chapter?'step':undefined} title={item.name} onClick={()=>goTo(item.stop)}><span/></button>)}</nav>
        <span className="rec-scroll">{chapter===6?'Continue to the collection':'Scroll to explore'} <ArrowDown size={13}/></span>
      </div>
    </div>
  </section>;
}
