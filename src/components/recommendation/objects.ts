import * as T from 'three';

const V = (x: number, y: number, z = 0) => new T.Vector3(x, y, z);
const tau = Math.PI * 2;
export const ease = (a: number, b: number, t: number) => T.MathUtils.smoothstep(t, a, b);
export function solid<M extends T.Material>(geometry: T.BufferGeometry, material: M) {
  const object = new T.Mesh(geometry, material);
  object.castShadow = true;
  object.receiveShadow = true;
  return object;
}

function paperShape(points: number[][]) {
  const shape = new T.Shape(points.map(([x, y]) => new T.Vector2(x, y)));
  const geo = new T.ShapeGeometry(shape);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) geo.attributes.uv.setXY(i, pos.getX(i) / 1.6, pos.getY(i) / 1.6);
  return geo;
}

function sheet(parent: T.Object3D, w: number, h: number, mat: T.Material, z = 0) {
  const m = solid(new T.BoxGeometry(w, h, .022), mat);
  m.position.z = z;
  parent.add(m);
  return m;
}

export function printedTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas');
  canvas.width = width; canvas.height = height;
  draw(canvas.getContext('2d')!);
  const tex = new T.CanvasTexture(canvas);
  tex.colorSpace = T.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function playbookSeal(map:T.Texture,size:number,reflection:{value:number}) {
  // Sample the real wax perimeter and wrap the photographed impression over its face.
  const canvas=document.createElement('canvas');
  const n=map.image.width;canvas.width=canvas.height=n;
  const ctx=canvas.getContext('2d')!;ctx.drawImage(map.image,0,0);
  const pixels=ctx.getImageData(0,0,n,n).data;
  const outline:T.Vector2[]=[];
  for(let i=0;i<96;i++){
    const a=i*tau/96,dx=Math.cos(a),dy=Math.sin(a);
    let r=n/2-1;
    for(;r>0;r--){
      const x=Math.floor(n/2+r*dx),y=Math.floor(n/2-r*dy);
      if(pixels[(y*n+x)*4+3]>128)break;
    }
    outline.push(new T.Vector2(dx*r*size/n,dy*r*size/n));
  }
  const wax=new T.ExtrudeGeometry(new T.Shape(outline),{depth:.029,bevelEnabled:true,bevelSize:.003,bevelThickness:.004,bevelSegments:2});
  const p=wax.attributes.position,uv=wax.attributes.uv;
  for(let i=0;i<p.count;i++)uv.setXY(i,.5+p.getX(i)/size,.5+p.getY(i)/size);
  const face=new T.MeshBasicMaterial({map,toneMapped:false});
  face.onBeforeCompile=shader=>{
    shader.uniforms.sealReflection=reflection;
    shader.fragmentShader='uniform float sealReflection;\n'+shader.fragmentShader.replace('#include <map_fragment>',
      '#include <map_fragment>\nfloat ridge=pow(diffuseColor.r,2.); diffuseColor.rgb+=vec3(.25,.18,.07)*ridge*sealReflection;');
  };
  const rim=new T.MeshStandardMaterial({color:0x91632d,roughness:.4,metalness:.5});
  const seal=new T.Mesh(wax,[face,rim]);seal.castShadow=seal.receiveShadow=true;return seal;
}

export function parcel(ivory:T.MeshStandardMaterial,envelopeMap:T.Texture,sealMap:T.Texture,insertMap:T.Texture) {
  const group=new T.Group();group.rotation.z=.18;group.position.z=.035;
  // The rectified envelope from playbook page 49 is 960 × 558. Its seal is a 244px square crop.
  const width=2.86,height=width*558/960;
  const paper=new T.MeshStandardMaterial({map:envelopeMap,color:0xc1beb9,roughness:.94,side:T.DoubleSide});
  const paperEdge=new T.MeshStandardMaterial({color:0x504930,roughness:.96,side:T.DoubleSide});
  const backing=sheet(group,width,height,paper);
  const lining=new T.Mesh(new T.PlaneGeometry(width-.035,height-.035),ivory);lining.position.z=.013;backing.add(lining);
  const hinges:T.Group[]=[];
  function makeFlap(x:number,y:number,z:number,angle:number,half:number,length:number) {
    const anchor=new T.Group();anchor.position.set(x,y,z);anchor.rotation.z=angle;group.add(anchor);
    const hinge=new T.Group();anchor.add(hinge);hinges.push(hinge);
    const positions:number[]=[],uvs:number[]=[],printUV:number[]=[],indices:number[]=[];
    for(let row=0;row<=18;row++){
      const t=row/18,span=half*(1-.993*t);
      for(let col=0;col<=12;col++){
        const across=col/6-1,fx=span*across,fy=t*length;
        positions.push(fx,fy,.012*Math.sin(Math.PI*t)*(.65+across*across));
        uvs.push(fx/1.3,fy/1.3);
        // Register the printed panels to one sheet in their folded orientation.
        printUV.push(.5+(x+fx*Math.cos(angle)+fy*Math.sin(angle))/width,
          .5+(y+fx*Math.sin(angle)-fy*Math.cos(angle))/height);
        if(row<18&&col<12){const i=row*13+col;indices.push(i,i+1,i+13,i+1,i+14,i+13);}
      }
    }
    const face=new T.BufferGeometry();face.setAttribute('position',new T.Float32BufferAttribute(positions,3));
    face.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));face.setIndex(indices);face.computeVertexNormals();
    const outerFace=face.clone();outerFace.setAttribute('uv',new T.Float32BufferAttribute(printUV,2));
    const outside=solid(outerFace,paper);outside.position.z=-.012;
    const edges:number[]=[];
    for(const col of [0,12])for(let row=0;row<18;row++){
      const i=(row*13+col)*3,j=i+39;
      for(const [k,dz] of [[i,0],[i,-.012],[j,0],[j,0],[i,-.012],[j,-.012]]){
        edges.push(positions[k],positions[k+1],positions[k+2]+dz);
      }
    }
    const edge=new T.BufferGeometry();edge.setAttribute('position',new T.Float32BufferAttribute(edges,3));edge.computeVertexNormals();
    hinge.add(solid(face,ivory),outside,solid(edge,paperEdge));return hinge;
  }
  makeFlap(-width/2,0,.022,Math.PI/2,height/2,width*.57);
  makeFlap(width/2,0,.039,-Math.PI/2,height/2,width*.57);
  makeFlap(0,-height/2,.056,Math.PI,width/2,height*.62);
  const top=makeFlap(0,height/2,.075,0,width/2,height*.589);
  const reflection={value:0};
  const seal=playbookSeal(sealMap,width*244/960,reflection);
  seal.rotation.x=Math.PI;seal.position.set(width*(495/960-.5),height*272/558,-.017);top.add(seal);
  const note=new T.Group();note.position.set(1.95,.17,-.014);note.rotation.z=-.10;group.add(note);
  sheet(note,1.05,1.05,ivory);
  const writing=new T.Mesh(new T.PlaneGeometry(1.05,1.05),new T.MeshBasicMaterial({map:insertMap,toneMapped:false}));
  writing.position.z=.014;note.add(writing);
  const tip=V(seal.position.x,height*.572,-.037);
  return {group,note,tipAt:()=>top.localToWorld(tip.clone()),pose(p:number){
    reflection.value=ease(-.42,-.31,p)*(1-ease(-.31,-.17,p));
    hinges[0].rotation.x=T.MathUtils.lerp(Math.PI-.012,.075,ease(.24,.39,p));
    hinges[1].rotation.x=T.MathUtils.lerp(Math.PI-.014,.10,ease(.21,.36,p));
    hinges[2].rotation.x=T.MathUtils.lerp(Math.PI-.016,.095,ease(.19,.325,p));
    top.rotation.x=T.MathUtils.lerp(Math.PI-.019,.14,ease(.125,.30,p));
  }};
}

// Intersect actual pavilion planes after refraction at the crown. Internal reflection
// produces the alternating light and dark facets as the camera approaches the stone.
export function sapphire(crystal:T.Texture) {
  const points:number[] = [];
  const planes:T.Vector4[]=[];
  const n=12;
  const ring=(r:number,z:number,phase:number)=>Array.from({length:n},(_,i)=>V(r*Math.cos(tau*i/n+phase)*1.18,r*Math.sin(tau*i/n+phase)*.88,z));
  const table=ring(.58,.42,0), crown=ring(.81,.29,Math.PI/n), girdle=ring(1,.045,0), base=ring(.995,-.025,0);
  function facet(a:T.Vector3,b:T.Vector3,c:T.Vector3) {
    let normal=b.clone().sub(a).cross(c.clone().sub(a)).normalize();
    if(normal.dot(a.clone().sub(V(0,0,-.04)))<0){[b,c]=[c,b];normal.negate();}
    points.push(...a.toArray(),...b.toArray(),...c.toArray());
    const d=normal.dot(a);
    if(!planes.some(q=>Math.abs(q.w-d)<.0001 && q.x*normal.x+q.y*normal.y+q.z*normal.z>.9999)) planes.push(new T.Vector4(normal.x,normal.y,normal.z,d));
  }
  for(let i=0;i<n;i++){const j=(i+1)%n;
    facet(V(0,0,.42),table[i],table[j]);facet(table[i],table[j],crown[i]);
    facet(table[i],crown[i],crown[(i+n-1)%n]);facet(girdle[i],crown[(i+n-1)%n],crown[i]);
    facet(girdle[i],girdle[j],crown[i]);facet(girdle[i],girdle[j],base[i]);facet(base[i],girdle[j],base[j]);
    facet(base[i],base[j],V(.03,-.02,-.65));
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(points,3));geometry.computeVertexNormals();
  geometry.setAttribute('opticalPosition',geometry.getAttribute('position').clone());
  const material=new T.ShaderMaterial({uniforms:{planes:{value:planes},eye:{value:V(0,0,5)},crystal:{value:crystal},finish:{value:1},showcase:{value:0}},
    vertexShader:`attribute vec3 opticalPosition; varying vec3 pos; varying vec3 norm; void main(){pos=opticalPosition;norm=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader:`varying vec3 pos; varying vec3 norm; uniform vec3 eye; uniform sampler2D crystal; uniform float finish,showcase; uniform vec4 planes[${planes.length}];
    vec3 room(vec3 d){
      float window=smoothstep(.15,.85,d.z*.8-d.x*.7+d.y*.2);
      float mullion=1.-.76*(1.-smoothstep(.03,.095,abs(d.x+.26*d.z-.15)));
      float strip=smoothstep(.955,.995,dot(d,normalize(vec3(.65,-.25,.72))));
      return mix(vec3(.12,.075,.028),vec3(1.85,1.61,1.18),window*mullion)+vec3(3.4,3.1,2.4)*strip;
    }
    void main(){vec3 n=normalize(norm), I=normalize(pos-eye);vec3 ray=refract(I,n,1./1.76), o=pos+ray*.001;
      vec3 result=vec3(0.);float path=0.;float energy=1.;
      for(int b=0;b<4;b++){float dist=1.e5; vec3 N=vec3(0.,0.,1.);
        for(int i=0;i<${planes.length};i++){vec4 pl=planes[i];float den=dot(ray,pl.xyz);if(den>.001){float t=(pl.w-dot(o,pl.xyz))/den;if(t>.0001&&t<dist){dist=t;N=pl.xyz;}}}
        if(dist>100.)break;path+=dist;vec3 exitRay=refract(ray,-N,1.76);float exitPart=dot(exitRay,exitRay)>.1?.83:0.;
        result+=energy*exitPart*room(exitRay)*exp(-vec3(.06,.38,1.85)*path);
        energy*=1.-exitPart;o+=ray*dist;ray=reflect(ray,N);o+=ray*.002;
      }
      result+=energy*room(ray)*vec3(.86,.48,.13);
      vec2 mineralUV=vec2(.497,.5)+pos.xy*vec2(.375,.54)+I.xy*.021*(.46-pos.z);
      vec3 silk=texture2D(crystal,mineralUV).rgb;
      result=mix(result,silk*(.66+.65*dot(result,vec3(.27,.61,.12))),mix(.58,.22,showcase));
      result=mix(result,result*vec3(1.28,.86,.36)+vec3(.15,.052,.003),showcase);
      float f=.078+.922*pow(1.-max(0.,dot(-I,n)),5.);vec3 col=mix(result,room(reflect(I,n)),f);
      if(finish<1.) {
        float silkLight=dot(silk,vec3(.26,.58,.16));
        float grain=texture2D(crystal,fract(pos.xy*2.9+.36)).g;
        vec3 frosted=vec3(.68,.46,.19)*(.49+.53*silkLight+.17*grain+.16*max(n.z,0.));
        col=mix(col,frosted,(1.-finish)*(.71+.22*smoothstep(-.3,.8,n.z)));
      }
      gl_FragColor=vec4(col,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`});
  const gem=solid(geometry,material);gem.scale.setScalar(.355);gem.rotation.set(.10,-.12,.23);gem.position.set(0,-.035,.25);
  return gem;
}

function ringMesh(radius:number, tube:number, metal:T.Material) {
  return solid(new T.TorusGeometry(radius,tube,12,96),metal);
}

export function loupe(metal:T.MeshStandardMaterial, dark:T.MeshStandardMaterial, lensMaterial:T.ShaderMaterial) {
  const group=new T.Group();
  for(const [r,t,z] of [[.62,.058,0],[.625,.036,.085],[.575,.022,.073],[.62,.04,-.065]]){
    const ring=ringMesh(r,t,metal);ring.position.z=z;group.add(ring);
  }
  const barrel=solid(new T.CylinderGeometry(.636,.644,.145,96,1,true),dark);
  barrel.rotation.x=Math.PI/2;group.add(barrel);
  const spine=new T.Shape();spine.moveTo(.49,.13);spine.quadraticCurveTo(.77,.24,1.75,.155);spine.quadraticCurveTo(2.05,0,1.75,-.155);spine.quadraticCurveTo(.85,-.22,.49,-.12);spine.closePath();
  const arm=solid(new T.ExtrudeGeometry(spine,{depth:.072,bevelEnabled:true,bevelSize:.026,bevelThickness:.022,bevelSegments:3}),metal);arm.position.z=-.03;group.add(arm);
  const hinge=solid(new T.CylinderGeometry(.08,.08,.105,36),dark);hinge.rotation.x=Math.PI/2;hinge.position.set(1.71,0,.036);group.add(hinge);
  const screw=solid(new T.BoxGeometry(.09,.012,.008),metal);screw.position.set(1.71,0,.093);group.add(screw);
  const glass=new T.Mesh(new T.CircleGeometry(.587,96),lensMaterial);glass.position.z=.08;group.add(glass);
  return {group,glass};
}

export function astrolabe(metal:T.MeshStandardMaterial,dark:T.MeshStandardMaterial,cloth:T.Texture,brandImage:HTMLImageElement) {
  const group=new T.Group();
  const faceMat=new T.MeshStandardMaterial({map:cloth,color:0x626849,roughness:.8,metalness:.18});
  const disk=solid(new T.CylinderGeometry(1.54,1.57,.145,128),faceMat);disk.rotation.x=Math.PI/2;group.add(disk);
  for(const [r,t] of [[1.55,.045],[1.48,.013],[1.20,.014],[1.02,.012],[.51,.012],[.28,.01]]){
    const band=ringMesh(r,t,metal);band.position.z=.09;group.add(band);
  }
  const dial=printedTexture(1024,1024,ctx=>{
    ctx.translate(512,512);
    ctx.strokeStyle='#c7a56a';ctx.fillStyle='#e2cfaa';ctx.textAlign='center';ctx.textBaseline='middle';
    for(let i=0;i<180;i++){const major=i%15===0;ctx.save();ctx.rotate(i*tau/180);
      ctx.lineWidth=major?3:1.6;ctx.beginPath();ctx.moveTo(0,-472);ctx.lineTo(0,major?-427:i%5===0?-443:-457);ctx.stroke();
      if(major){ctx.font='18px Georgia';ctx.fillText(String(i*2).padStart(3,'0'),0,-401);}ctx.restore();}
    for(let i=0;i<8;i++){ctx.save();ctx.rotate(i*tau/8);ctx.beginPath();ctx.ellipse(0,-107,98,189,0,0,tau);ctx.stroke();ctx.restore();}
    const logoWidth=112;
    const logoHeight=logoWidth*brandImage.naturalHeight/brandImage.naturalWidth;
    ctx.drawImage(brandImage,-logoWidth/2,235-logoHeight/2,logoWidth,logoHeight);
  });
  const engraving=new T.Mesh(new T.PlaneGeometry(3.1,3.1),new T.MeshBasicMaterial({map:dial,transparent:true,depthWrite:false}));engraving.position.z=.081;group.add(engraving);
  const rete=new T.Group();group.add(rete);
  for(const [r,x,y] of [[.92,.1,.10],[.65,-.28,.13],[.45,.32,-.19]]){
    const band=ringMesh(r,.018,metal);band.position.set(x,y,.13);rete.add(band);
  }
  const needle=new T.Group();group.add(needle);
  for(const direction of [-1,1]){
    const blade=solid(paperShape([[-.07,0],[0,1.32*direction],[.07,0]]),metal);blade.position.z=.20;needle.add(blade);
    const shade=solid(paperShape([[0,0],[0,1.32*direction],[.07,0]]),dark);shade.position.z=.202;needle.add(shade);
  }
  const pivot=solid(new T.SphereGeometry(.108,32,20),metal);pivot.scale.z=.55;pivot.position.z=.21;group.add(pivot);
  const hanger=ringMesh(.19,.035,metal);hanger.position.set(0,1.71,0);group.add(hanger);
  return {group,needle,rete};
}

