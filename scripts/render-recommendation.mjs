// Render the same camera, geometry, materials and poses used on the homepage.
// Usage: node scripts/render-recommendation.mjs (Playwright and Chrome required).
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { createRequire } from 'node:module';
import { createServer } from 'vite';
import {frameCount} from './consultationIntro.mjs';
const require=createRequire(import.meta.url);
const { chromium }=require(process.env.STORY_PLAYWRIGHT || 'playwright');
const arrival=['arrival',-1];
const opening=[arrival,['letter',0],['reach',.12],['seal-lift',.176],['fold',.22],['pukhraj',.38],['loupe',.55],['lens',.66],['facet',.787],['astrolabe',.982]];
const handoff=JSON.parse(await fs.readFile(new URL('../src/components/recommendation/handoffFrames.json',import.meta.url),'utf8'));
const settings=Object.entries(handoff);
for(const form of ['Ring','Necklace','Bracelet']){
  for(const metalId of ['yellow-gold','silver']){
    for(const [beat,time] of [['carry-start',1.635],['carry',1.71],['align',1.77],['lower',1.82],['seated',1.87],['release',1.90],['setting',2.02]]){
      settings.push([beat+'-'+form.toLowerCase()+'-'+metalId,time,{form,metalId}]);
    }
  }
}
const finalSettings=settings.filter(([name])=>name.startsWith('setting-'));
const finalOnly=process.argv.includes('--final-only');
const deliveryOnly=process.argv.includes('--delivery-only');
const poses=finalOnly ? [arrival,...finalSettings] : process.argv.includes('--opening-only') ? opening : process.argv.includes('--settings-only') ? settings : [...opening,...settings];
const out=path.resolve('public/story/frames');
const server=await createServer({server:{host:'127.0.0.1',port:0,open:false},logLevel:'error'});
await server.listen();
let browser;
try {
  browser=await chromium.launch({channel:'chrome',headless:true,args:['--enable-unsafe-swiftshader','--use-angle=swiftshader']});
  const page=await browser.newPage();
  const errors=[];
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  page.on('pageerror',err=>errors.push(String(err)));
  const origin=server.resolvedUrls.local[0];
  await page.route('**/render-workbench',route=>route.fulfill({contentType:'text/html',body:'<meta name="viewport" content="width=device-width"><style>*{margin:0}canvas{display:block;width:100vw;height:100vh}</style><canvas></canvas>'}));
  await page.goto(origin+'render-workbench');
  await page.evaluate(async withDelivery=>{
    const {createStory}=await import('/src/components/recommendation/studio.ts');
    window.studio=await createStory(document.querySelector('canvas'),new AbortController().signal,withDelivery);
  },deliveryOnly);
  await fs.mkdir(out,{recursive:true});
  if(deliveryOnly){
    await page.evaluate(async()=>{
      const {consultationIntro}=await import('/scripts/consultationIntro.mjs');
      window.drawIntro=await consultationIntro();
    });
    for(const [prefix,width,height] of [['',1440,900],['mobile-',680,1080],['tall-',480,1040]]){
      if(!prefix && process.argv.includes('--portrait-only'))continue;
      await page.setViewportSize({width,height});
      const destination=path.join(out,prefix+'consultation.webm');
      const pending=destination+'.partial.webm';
      const encoder=spawn(process.env.STORY_FFMPEG || 'ffmpeg',['-hide_banner','-loglevel','error','-y',
        '-f','image2pipe','-framerate','24','-c:v','mjpeg','-i','pipe:0','-an','-c:v','libvpx',
        '-pix_fmt','yuv420p','-deadline','good','-cpu-used','4','-b:v','3800k','-crf','9','-threads','4',pending],{stdio:['pipe','ignore','inherit']});
      const completed=once(encoder,'close');
      try{
        for(let frame=0;frame<frameCount;frame++){
          const image=await page.evaluate(async frame=>{
            const canvas=await window.drawIntro(frame,innerWidth,innerHeight,window.studio,document.querySelector('canvas'));
            return {jpeg:canvas.toDataURL('image/jpeg',.96).split(',')[1],
              poster:frame===0?canvas.toDataURL('image/jpeg',.82).split(',')[1]:null};
          },frame);
          if(image.poster)await fs.writeFile(path.join(out,prefix+'consultation.jpg'),Buffer.from(image.poster,'base64'));
          if(!encoder.stdin.write(Buffer.from(image.jpeg,'base64')))await once(encoder.stdin,'drain');
        }
        encoder.stdin.end();
        const [code]=await completed;
        if(code || errors.length)throw new Error('Delivery export failed '+errors.join('\n'));
        try {await fs.rename(pending,destination);}
        catch(error){
          // Windows can hold the old path open while Vite serves a range request.
          if(error.code!=='EPERM' && error.code!=='EBUSY')throw error;
          await fs.copyFile(pending,destination);
          await fs.unlink(pending);
        }
        console.log(destination,(await fs.stat(destination)).size);
      }finally{encoder.kill();}
    }
  }
  const views=deliveryOnly?[]:[['',1440,900,poses],['mobile-',680,1080,poses]];
  const tallPoses=poses.filter(([name])=>name.startsWith('setting-') || opening.slice(0,-1).some(([openingName])=>openingName===name));
  if(!deliveryOnly)views.push(['tall-',480,1040,tallPoses]);
  for(const [prefix,width,height,viewPoses] of views) {
    for(const [name,progress,choice] of viewPoses) {
      const handDetail=['reach','seal-lift','fold','loupe','lens'].includes(name);
      const scale=handDetail ? 4/3 : 1;
      await page.setViewportSize({width:Math.round(width*scale),height:Math.round(height*scale)});
      const productShot=!prefix && name.startsWith('setting-ring-');
      const data=await page.evaluate(({progress,choice,productShot,handDetail})=>{
        window.studio.draw(progress,choice);
        const scene=document.querySelector('canvas');
        let product;
        if(productShot){
          const crop=document.createElement('canvas');
          crop.width=crop.height=672;
          crop.getContext('2d').drawImage(scene,710,145,688,688,0,0,672,672);
          product=crop.toDataURL('image/webp',.93).split(',')[1];
        }
        return {frame:scene.toDataURL('image/webp',handDetail?.95:.89).split(',')[1],product};
      },{progress,choice,productShot,handDetail});
      const buffer=Buffer.from(data.frame,'base64');
      if(buffer.length<3000 || errors.length) throw new Error('Frame render failed: '+errors.join('\n'));
      await fs.writeFile(path.join(out,prefix+name+'.webp'),buffer);
      if(data.product)await fs.writeFile(path.join(out,'..','pukhraj-ring-'+choice.metalId+'.webp'),Buffer.from(data.product,'base64'));
      console.log(prefix+name,buffer.length);
    }
  }
  await page.evaluate(()=>window.studio.dispose());
} finally {await browser?.close();await server.close();}
