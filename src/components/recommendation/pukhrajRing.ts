import * as T from 'three';
import { solid } from './objects';

const radius=.775;
const start=.245;
const end=2*Math.PI-start;
const steps=216;

// Bend the jeweller's flat pattern around a circular mandrel. Width runs along
// the finger, and depth runs radially through the metal.
function surface(angle:number,width:number,depth:number) {
  const r=radius+depth, height=r*Math.cos(angle);
  return new T.Vector3(r*Math.sin(angle),-.386+height*.5+width*.866,-.39+height*.866-width*.5);
}

function aperture(angle:number,from:number,to:number) {
  const t=T.MathUtils.clamp((angle-from)/(to-from),0,1);
  return Math.pow(Math.max(0,Math.sin(Math.PI*t)),.83);
}

export function pukhrajRing(alloy:T.Material,stamp:T.Texture) {
  const ring=new T.Group();
  // Two piercing cuts on each shoulder leave three continuous, bevelled gold ribbons.
  for(let rail=0;rail<3;rail++){
    const pos:number[]=[],idx:number[]=[];
    for(let i=0;i<=steps;i++){
      const a=T.MathUtils.lerp(start,end,i/steps),s=Math.min(a,2*Math.PI-a);
      const shoulder=1-T.MathUtils.smoothstep(s,.37,1.95);
      const width=.111+.236*shoulder;
      const scallop=.20*Math.sin(5.1*(s-.48))*shoulder;
      const first=(-.45+scallop)*width,second=(.47+scallop)*width;
      const holeA=.34*width*aperture(s,.30,1.72),holeB=.34*width*aperture(s,.32,1.54);
      const lo=[-width,first+holeA,second+holeB][rail];
      const hi=[first-holeA,second-holeB,width][rail];
      const l=Math.min((hi-lo)*.18,rail===0?.011:[holeA,holeB][rail-1]);
      const h=Math.min((hi-lo)*.18,rail===2?.011:[holeA,holeB][rail]);
      const section=[[lo+l,-.044],[hi-h,-.044],[hi,-.044+h],[hi,.035-h],
        [hi-h,.035],[lo+l,.035],[lo,.035-l],[lo,-.044+l]];
      for(const [v,d] of section)pos.push(...surface(a,v,d).toArray());
    }
    for(let i=0;i<steps;i++)for(let j=0;j<8;j++){
      const a=8*i+j,b=8*i+(j+1)%8;
      idx.push(a,b,a+8,b,b+8,a+8);
    }
    for(let j=1;j<7;j++)idx.push(0,j,j+1,8*steps,8*steps+j+1,8*steps+j);
    const geo=new T.BufferGeometry();
    geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();
    ring.add(solid(geo,alloy));
  }
  const collar=solid(new T.TorusGeometry(.29,.029,16,84),alloy);
  collar.scale.set(.91,1.29,1);collar.position.z=.238;ring.add(collar);
  for(const x of [-1,1])for(const y of [-1,1]){
    const rail=new T.CatmullRomCurve3([
      new T.Vector3(x*.196,y*.222,.13),new T.Vector3(x*.231,y*.247,.225),
      new T.Vector3(x*.253,y*.265,.345),new T.Vector3(x*.235,y*.269,.426)]);
    ring.add(solid(new T.TubeGeometry(rail,20,.039,16,false),alloy));
    const claw=solid(new T.SphereGeometry(.046,24,16),alloy);
    claw.position.copy(rail.getPoint(1));ring.add(claw);
  }
  // Stamp the inner wall of the lower band so the signature follows the metal.
  const pos:number[]=[],uv:number[]=[],indices:number[]=[];
  const stampHeight=.141;
  const image=stamp.image as HTMLImageElement;
  const stampArc=stampHeight*(image.naturalWidth/image.naturalHeight)/radius;
  for(let i=0;i<=64;i++){
    const u=i/64,a=Math.PI+(.5-u)*stampArc;
    for(const t of [0,1]){
      pos.push(...surface(a,(t-.5)*stampHeight,-.0455).toArray());uv.push(u,t);
    }
    if(i<64){const b=2*i;indices.push(b,b+2,b+1,b+2,b+3,b+1);}
  }
  const strip=new T.BufferGeometry();
  strip.setAttribute('position',new T.Float32BufferAttribute(pos,3));strip.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  strip.setIndex(indices);
  ring.add(new T.Mesh(strip,new T.MeshBasicMaterial({map:stamp,transparent:true,depthWrite:false,side:T.DoubleSide})));
  return ring;
}
