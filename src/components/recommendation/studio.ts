import { brandLogo } from '../../lib/brand';
import * as T from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { astrolabe, ease, loupe, parcel, sapphire, solid } from './objects';
import { firstSetting, makeSettingTray, type SettingChoice } from './settingTray';
import { carryFrom, liftProgress, placementHand, polishingBench } from './polishingBench';

export type StoryRenderer = { draw: (progress: number, choice?: SettingChoice, wheelAngle?:number) => void; dispose: () => void };
const blend=T.MathUtils.lerp;
const v=(x:number,y:number,z:number)=>new T.Vector3(x,y,z);
const asset='/story/';
const screenVertex='varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.,1.);}';

function readHand(data:ArrayBuffer) {
  const [count,indices]=new Uint32Array(data,0,2);
  const geo=new T.BufferGeometry();
  geo.setAttribute('position',new T.BufferAttribute(new Float32Array(data,8,count*3),3));
  geo.setAttribute('uv',new T.BufferAttribute(new Float32Array(data,8+count*12,count*2),2));
  geo.setIndex(new T.BufferAttribute(new Uint16Array(data,8+count*20,indices),1));
  geo.computeVertexNormals();
  return geo;
}

export async function createStory(canvas:HTMLCanvasElement, signal:AbortSignal, withDelivery=false):Promise<StoryRenderer> {
  const images=['travertine','ivory','brass','cloth','hand','daylight','crystal','copper-lap',brandLogo,'setter-hand','letter-envelope','letter-seal','letter-insert'];
  if(withDelivery)images.push('delivery-hand');
  // Decode everything before allocating the WebGL context, including on StrictMode remounts.
  const [decoded,handData]=await Promise.all([
    Promise.all(images.map(async name=>{
      const img=new Image(); img.src=name===brandLogo ? brandLogo : asset+name+'.webp'; await img.decode();return img;
    })),
    fetch(asset+'hand.mesh',{signal}).then(response=>{
      if(!response.ok) throw new Error('Hand mesh could not load');
      return response.arrayBuffer();
    }),
  ]);
  signal.throwIfAborted();
  const renderer=new T.WebGLRenderer({canvas,alpha:false,antialias:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
  renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.08;
  const scene=new T.Scene(), ending=new T.Scene();
  const camera=new T.PerspectiveCamera(32,1,.012,65), endCamera=camera.clone();
  const textures=decoded.map((img,i)=>{
    const tex=new T.Texture(img);tex.needsUpdate=true;tex.colorSpace=T.SRGBColorSpace;
    tex.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());
    if(i>0 && i<=3)tex.wrapS=tex.wrapT=T.RepeatWrapping;
    return tex;
  });
  const [deskMap,ivoryMap,brassMap,clothMap,skinMap,daylight,crystal,copperLap,makersMark,setterSkin,envelopePrint,sealPrint,insertPrint,deliverySkin]=textures;
  const generator=new T.PMREMGenerator(renderer);const studio=new RoomEnvironment();
  const environment=generator.fromScene(studio,.035);studio.dispose();generator.dispose();
  let benchLight:T.DirectionalLight | undefined;
  for(const world of [scene,ending]){
    world.background=new T.Color('#ae997c');world.environment=environment.texture;world.environmentIntensity=.59;
    const key=new T.DirectionalLight(0xffe5bc,2.0);key.position.set(-4.2,4.7,6.4);key.castShadow=true;
    key.shadow.mapSize.set(1024,1024);Object.assign(key.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.2,far:22});key.shadow.bias=-.00025;key.shadow.normalBias=.008;
    world.add(key,new T.HemisphereLight(0xfff6e4,0x695539,.82));
    if(world===ending){benchLight=key;world.add(key.target);}
    const rim=new T.DirectionalLight(0xffedce,.52);rim.position.set(4,-1,3);world.add(rim);
  }
  const ivory=new T.MeshStandardMaterial({map:ivoryMap,bumpMap:ivoryMap,bumpScale:.012,roughness:.92,side:T.DoubleSide,color:0xd8c7b4});
  const metal=new T.MeshStandardMaterial({map:brassMap,color:0xffda97,metalness:.84,roughness:.29,side:T.DoubleSide});
  const dark=new T.MeshStandardMaterial({color:0x735b37,metalness:.86,roughness:.35,side:T.DoubleSide});
  const desk=new T.Mesh(new T.PlaneGeometry(20,14),new T.MeshBasicMaterial({map:deskMap,toneMapped:false,color:0xf1e9dd}));
  // Extend the tabletop beyond the travelling camera while retaining its original texel scale.
  desk.geometry.scale(2,2,1);
  const deskUV=desk.geometry.attributes.uv;
  for(let i=0;i<deskUV.count;i++)deskUV.setXY(i,2*deskUV.getX(i)-.5,2*deskUV.getY(i)-.5);
  deskMap.wrapS=deskMap.wrapT=T.MirroredRepeatWrapping;
  const leafOffset={value:new T.Vector2()};
  // The scan is cropped in world space; the projected window crosses upright flaps and flat paper alike.
  for(const surface of [desk.material,ivory]){
    surface.onBeforeCompile=shader=>{
      shader.uniforms.daylight={value:daylight};
      shader.uniforms.leafOffset=leafOffset;
      shader.vertexShader='varying vec3 studioPoint;\n'+shader.vertexShader.replace('#include <project_vertex>','#include <project_vertex>\nstudioPoint=(modelMatrix*vec4(transformed,1.)).xyz;');
      shader.fragmentShader='varying vec3 studioPoint;uniform sampler2D daylight;uniform vec2 leafOffset;\n'+shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\nvec2 lightUV=(studioPoint.xy+vec2(-.42,.55)*studioPoint.z)/vec2(8.5,5.8)+vec2(.52,.47);float sun=texture2D(daylight,clamp(lightUV+leafOffset,0.,1.)).r; diffuseColor.rgb*=mix(vec3(.39,.37,.33),vec3(1.04),sun);');
    };
  }
  desk.position.set(-1,0,-.03);scene.add(desk);
  // The photographed tabletop supplies the room. A coincident shadow catcher grounds all props.
  const catcher=new T.Mesh(new T.PlaneGeometry(45,40),new T.ShadowMaterial({opacity:.43}));catcher.receiveShadow=true;catcher.position.z=-.026;scene.add(catcher);
  const envelope=parcel(ivory,envelopePrint,sealPrint,insertPrint);scene.add(envelope.group);
  // The jeweller's stationery is already on the desk when the letter arrives.
  scene.attach(envelope.note);
  const gem=sapphire(crystal);scene.add(gem);
  const underStone=new T.Mesh(new T.PlaneGeometry(.96,.66),new T.ShaderMaterial({transparent:true,depthWrite:false,
    vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec2 vUv;void main(){float d=length((vUv-.5)*2.);gl_FragColor=vec4(.32,.20,.055,.23*(1.-smoothstep(.1,1.,d)));}'}));
  underStone.position.set(.045,-.10,.063);scene.add(underStone);

  const makeTarget=()=>new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType,depthBuffer:true});
  const lensTarget=makeTarget(), worldTarget=makeTarget(), endTarget=makeTarget();
  const lensMaterial=new T.ShaderMaterial({uniforms:{view:{value:lensTarget.texture},resolution:{value:new T.Vector2(1,1)},centre:{value:new T.Vector2(.5,.5)},power:{value:1}},
    vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:`uniform sampler2D view;uniform vec2 resolution,centre;uniform float power;varying vec2 vUv;
    void main(){vec2 local=vUv*2.-1.;float r=dot(local,local);vec2 screen=gl_FragCoord.xy/resolution;
      vec2 uv=mix(screen,centre+(screen-centre)*(.65+.045*r),power);vec3 col=texture2D(view,uv).rgb;
      float glint=pow(max(0.,1.-abs(dot(local,vec2(.6,.8))-.58)*9.),3.)*.06;
      col=mix(col,vec3(.93,.92,.79),.025+glint+.15*smoothstep(.83,1.,r));gl_FragColor=vec4(col,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`});
  const tool=loupe(metal,dark,lensMaterial);scene.add(tool.group);
  // The curved surface extends beyond the photographed outline. Preserve partial
  // alpha at the cuticle and wrist while casting a solid, hand-shaped shadow.
  const hand=solid(readHand(handData),new T.MeshBasicMaterial({map:skinMap,transparent:true,alphaTest:.025,toneMapped:false}));
  hand.customDepthMaterial=new T.MeshDepthMaterial({map:skinMap,alphaTest:.45,depthPacking:T.RGBADepthPacking});
  scene.add(hand);
  const courier=deliverySkin ? solid(new T.PlaneGeometry(3.9,2.6,16,8),new T.MeshBasicMaterial({
    map:deliverySkin,transparent:true,alphaTest:.025,toneMapped:false
  })) : null;
  if(courier){
    // Register the photographed pinch at the paper edge and lift the wrist above the desk.
    const geometry=courier.geometry, uv=geometry.attributes.uv, points=geometry.attributes.position;
    for(let i=0;i<points.count;i++){
      const u=uv.getX(i),v=uv.getY(i);
      points.setXYZ(i,(u-.065)*3.9,(v-.51)*2.6,.34*ease(.04,.68,u)+.09*ease(.53,.84,v));
    }
    geometry.computeBoundingSphere();
    courier.customDepthMaterial=new T.MeshDepthMaterial({map:deliverySkin,alphaTest:.48,depthPacking:T.RGBADepthPacking});
    scene.add(courier);
  }
  const dial=astrolabe(metal,dark,clothMap,makersMark.image);ending.add(dial.group);
  const settingTray=makeSettingTray(ivory,metal,crystal,makersMark);ending.add(settingTray.group);
  const lap=polishingBench(copperLap,dark), setter=placementHand(setterSkin);
  ending.add(lap.group,setter.hand);
  const cover=new T.Mesh(new T.PlaneGeometry(34,26),new T.MeshStandardMaterial({map:clothMap,color:0x879072,roughness:.96}));
  clothMap.repeat.set(6,5);cover.position.z=-.12;cover.receiveShadow=true;ending.add(cover);
  const clothColour=cover.material.color.clone(),polishColour=new T.Color(0x262b1c);
  const daylightBackground=(ending.background as T.Color).clone(),benchBackground=new T.Color(0x1d2114);
  const compositor=new T.Scene();const screenCamera=new T.Camera();
  const dissolve=new T.ShaderMaterial({depthTest:false,depthWrite:false,uniforms:{from:{value:worldTarget.texture},to:{value:endTarget.texture},mixValue:{value:0},line:{value:new T.Vector2(-.5,.86)}},
    vertexShader:screenVertex,fragmentShader:`varying vec2 vUv;uniform sampler2D from,to;uniform float mixValue;uniform vec2 line;
    void main(){float d=dot(vUv-.5,line);float amt=smoothstep(-.26,.26,mixValue*2.-1.-d);
      gl_FragColor=vec4(mix(texture2D(from,vUv).rgb,texture2D(to,vUv).rgb,amt),1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`});
  compositor.add(new T.Mesh(new T.PlaneGeometry(2,2),dissolve));

  let lastW=0,lastH=0,lastP=-1;
  const eye=v(0,0,0),target=v(0,0,0),projected=v(0,0,0),resolution=new T.Vector2();
  // Two adjacent vertices on the crown table define the edge for the match cut.
  const edgeA=v(1.18*.58,0,.42),edgeB=v(1.18*.58*Math.cos(Math.PI/6),.88*.58*.5,.42);
  const edgeStart=v(0,0,0),edgeEnd=v(0,0,0);
  let lastForm='',lastMetal='';
  let lastWheelAngle=0;
  function draw(p:number, choice:SettingChoice=firstSetting, wheelAngle=lastWheelAngle) {
    const w=canvas.clientWidth,h=canvas.clientHeight;if(!w||!h)return;
    if(w===lastW && h===lastH && p===lastP && choice.form===lastForm && choice.metalId===lastMetal && wheelAngle===lastWheelAngle)return;
    if(w!==lastW||h!==lastH){
      renderer.setSize(w,h,false);renderer.getDrawingBufferSize(resolution);
      for(const rt of [worldTarget,endTarget])rt.setSize(resolution.x,resolution.y);
      lensTarget.setSize(Math.ceil(resolution.x*.72),Math.ceil(resolution.y*.72));
      camera.aspect=endCamera.aspect=w/h;camera.updateProjectionMatrix();endCamera.updateProjectionMatrix();
      lastW=w;lastH=h;
    }
    lastP=p;lastForm=choice.form;lastMetal=choice.metalId;lastWheelAngle=wheelAngle;
    const aspect=w/h, narrow=aspect<.94;
    const approach=ease(.415,.67,p),macro=ease(.64,.831,p);
    const initialDist=narrow?6.9/aspect:7.25;
    const distance=blend(blend(initialDist,3.45,approach),.52,macro);
    const side=narrow?0:-Math.min(1.42,aspect*.78);
    const startY=narrow?-.84:.14;
    const stationeryCentre=narrow?.45:side+.23+Math.max(0,1.60-aspect)*1.3;
    target.set(blend(stationeryCentre,0,approach),blend(startY,-.035,approach),.085+.25*macro);
    eye.set(target.x+.74*(1-approach),target.y-distance*(.57-.47*approach),target.z+distance);
    camera.position.copy(eye);camera.lookAt(target);camera.updateMatrixWorld();

    const delivery=p<0;
    const match=delivery?1-ease(-.65,-.32,p):0;
    const travel=delivery?1-ease(-.94,-.32,p):0;
    const lift=delivery?1-ease(-.64,-.39,p):0;
    const tilt=.13*lift;
    leafOffset.value.set(.012*Math.sin(2*Math.PI*p),.004*Math.sin(Math.PI*p)).multiplyScalar(delivery?1:0);
    const clearance=delivery?.13*(1-ease(-.70,-.49,p)):0;
    envelope.group.position.set(travel*(3.8+aspect*2),travel*.82,.035+1.44*Math.sin(tilt)+clearance+.36*match);
    envelope.group.rotation.x=.43*match;
    envelope.group.rotation.y=-tilt;
    envelope.group.rotation.z=.18-travel*.14-.14*match;
    envelope.pose(p);envelope.group.updateMatrixWorld(true);
    underStone.visible=!delivery;
    // The tiny parcel is shown closed at the start; its inner volume is revealed with the folds.
    gem.visible=p>.196;
    gem.scale.setScalar(.355*blend(.25,1,ease(.195,.34,p)));
    gem.position.z=blend(.075,.252,ease(.195,.34,p));
    gem.material.uniforms.eye.value.copy(gem.worldToLocal(camera.position.clone()));
    const lensIn=ease(.406,.585,p);
    tool.group.position.set(blend(4.6,-.016,lensIn),blend(.74,-.16,lensIn),blend(.68,1.04,lensIn));
    tool.group.rotation.set(blend(.27,-.11,lensIn),blend(-.20,.04,lensIn),blend(-.18,.35,lensIn));
    // Remove the optical pass once the camera is inside the rim, before its projected centre crosses the near plane.
    lensMaterial.uniforms.power.value=1-ease(.702,.755,p);
    tool.group.visible=p>.396 && p<.76;
    tool.group.updateMatrixWorld(true);
    const grip=envelope.tipAt();const arrive=ease(.012,.127,p),release=ease(.245,.344,p);
    const tracking=delivery?1-ease(-.35,-.12,p):0;
    if(tracking>0){
      // Start on the seal at the same screen position as the filmed envelope.
      // Release the camera as the hand lowers it into the familiar opening pose.
      camera.position.sub(target).multiplyScalar(blend(1,narrow?.72:1.34,match)).add(target);
      camera.updateMatrixWorld();
      projected.copy(grip).project(camera);
      const halfHeight=-camera.worldToLocal(eye.copy(grip)).z*Math.tan(T.MathUtils.degToRad(16));
      const anchorX=narrow?.02:blend(.40,.34,match);
      const anchorY=blend(narrow?.18:-.07,-.50,match);
      eye.set((projected.x-anchorX)*halfHeight*aspect,(projected.y-anchorY)*halfHeight,0);
      camera.position.addScaledVector(eye.applyQuaternion(camera.quaternion),tracking);
      camera.updateMatrixWorld();
    }
    if(courier)courier.visible=delivery;
    if(delivery){
      hand.visible=false;
      if(courier){
        const withdraw=ease(-.30,-.07,p);
        courier.position.copy(envelope.group.localToWorld(v(1.36,.22,.092)));
        courier.position.add(v(withdraw*(4+aspect*2),withdraw*.42,.15*ease(-.32,-.22,p)+withdraw*.32));
        courier.rotation.z=.18-travel*.14+.08*withdraw;
        courier.visible=withdraw<1;
      }
    }else if(p<.38) {
      hand.position.copy(grip).add(v((1-arrive)*5.8+release*6.5,(1-arrive)*.76+release*1.8,.028+(1-arrive)*.55+release*.54));
      hand.rotation.set(.065,-.13,blend(.33,.11,arrive)-release*.19);
      hand.visible=p>.006 && p<.338;
    }else{
      const off=ease(.595,.669,p);hand.position.copy(tool.group.localToWorld(v(1.58,0,.09)));
      hand.position.add(v(off*5.7,off*.65,off*.52));hand.rotation.set(.04,-.13,.06);hand.visible=p<.665;
    }
    const depart=ease(.80,.925,p);
    gem.updateWorldMatrix(true,false);
    edgeStart.copy(edgeA).applyMatrix4(gem.matrixWorld).project(camera);
    edgeEnd.copy(edgeB).applyMatrix4(gem.matrixWorld).project(camera);
    const edgeAngle=Math.atan2(edgeEnd.y-edgeStart.y,(edgeEnd.x-edgeStart.x)*aspect);
    const endDistance=narrow?6.0/aspect:6.15;
    const reveal=ease(.805,.949,p);
    const endSide=blend(0,side*.94,reveal);
    const closeDistance=1.15, halfHeight=Math.tan(T.MathUtils.degToRad(16))*(closeDistance-.21);
    const matchX=-(edgeStart.x+edgeEnd.x)*.5*halfHeight*aspect,matchY=-(edgeStart.y+edgeEnd.y)*.5*halfHeight;
    const endX=endSide+matchX*(1-reveal),endY=blend(matchY,startY,reveal);
    const pan=ease(1.01,1.19,p), settle=ease(1.11,1.23,p);
    const follow=ease(carryFrom,1.77,p);
    const benchX=pan*blend(lap.group.position.x,settingTray.group.position.x,follow);
    // Keep both the stone and the approaching fingertips on screen while the wheel is in view.
    const trayX=endX+benchX+pan*(1-follow)*(narrow?.45:.72);
    const trayY=blend(endY,narrow?-.34*(endDistance-.35)*Math.tan(T.MathUtils.degToRad(16)):endY-.12,pan);
    if(benchLight){
      benchLight.target.position.x=benchX;
      benchLight.position.x=benchLight.target.position.x-4.2;
    }
    endCamera.position.set(trayX,trayY-1.2*reveal-.68*pan,blend(closeDistance,endDistance,reveal)-settle*(narrow?.35:1.15));
    target.set(trayX,trayY,.13+.10*pan);
    const polishing=pan*(1-follow);
    // At the lap the camera drops to the stone's girdle, then rises with the setter's hand.
    const focusX=benchX+(narrow?.43:.01);
    const focusY=narrow?-.40:-.16;
    const liftHeight=.62*liftProgress(p)*(1-ease(1.775,1.87,p));
    const focusZ=(narrow?.19:.60)+liftHeight;
    const macroDistance=narrow?Math.max(2.74,1.54/aspect):2.51;
    endCamera.position.lerp(eye.set(focusX,focusY-macroDistance,focusZ+macroDistance*.64),polishing);
    target.lerp(eye.set(focusX,focusY,focusZ),polishing);
    const ringReveal=choice.form==='Ring'?ease(1.61,1.97,p):0;
    if(ringReveal>0){
      const ringX=settingTray.group.position.x;
      const ringY=narrow?.24-.40/aspect:.32;
      const distance=narrow?3.52/aspect:4.63;
      const height=.62+.60*(1-ease(1.775,1.88,p));
      endCamera.position.lerp(eye.set(ringX,ringY-distance*.275,height+distance),ringReveal);
      target.lerp(eye.set(ringX,ringY,height),ringReveal);
    }
    // Shift the lens for the desktop copy, keeping both shoulders equally foreshortened.
    const lensShift=narrow?0:-.46*endCamera.getFilmWidth()*Math.tan(T.MathUtils.degToRad(16))*aspect*ringReveal;
    if(endCamera.filmOffset!==lensShift){endCamera.filmOffset=lensShift;endCamera.updateProjectionMatrix();}
    endCamera.lookAt(target);endCamera.updateMatrixWorld();
    cover.material.color.copy(clothColour).lerp(polishColour,polishing);
    (ending.background as T.Color).copy(daylightBackground).lerp(benchBackground,polishing);
    dial.group.visible=p<1.19;
    const polishingPoint=lap.pose(p,wheelAngle,endCamera);
    lap.group.localToWorld(polishingPoint);
    const finish=1-(1-ease(1.205,1.342,p))*(1-ease(0,7.5,wheelAngle)*ease(1.175,1.21,p));
    const stoneCentre=settingTray.pose(p,choice,endCamera,polishingPoint,finish);
    lap.alignGrip(stoneCentre.z-polishingPoint.z);
    const track=ease(1.53,1.66,p)*(1-ease(1.78,1.87,p));
    if(track>0){
      projected.copy(stoneCentre).project(endCamera);
      const depth=-endCamera.worldToLocal(eye.copy(stoneCentre)).z;
      const halfFrame=depth*Math.tan(T.MathUtils.degToRad(16));
      eye.set((projected.x-(narrow?0:.40))*halfFrame*aspect,(projected.y-(narrow?.32:.05))*halfFrame,0);
      endCamera.position.addScaledVector(eye.applyQuaternion(endCamera.quaternion),track);
      endCamera.updateMatrixWorld();
      settingTray.jewel.material.uniforms.eye.value.copy(settingTray.jewel.worldToLocal(eye.copy(endCamera.position)));
    }
    setter.pose(p,stoneCentre,endCamera,settingTray.jewel);
    dial.group.rotation.z=.05;dial.needle.rotation.z=blend(edgeAngle-Math.PI/2-.05,-.93,ease(.85,.977,p));
    dial.rete.rotation.z=blend(.30,-.17,ease(.811,.986,p));

    function renderDesk(out:T.WebGLRenderTarget|null){
      if(tool.group.visible){
        tool.glass.visible=false;renderer.setRenderTarget(lensTarget);renderer.render(scene,camera);tool.glass.visible=true;
        tool.glass.getWorldPosition(projected).project(camera);
        lensMaterial.uniforms.centre.value.set(projected.x*.5+.5,projected.y*.5+.5);
        lensMaterial.uniforms.resolution.value.copy(resolution);
      }
      renderer.setRenderTarget(out);renderer.render(scene,camera);
    }
    if(depart===0)renderDesk(null);
    else if(depart===1){renderer.setRenderTarget(null);renderer.render(ending,endCamera);}
    else {
      renderDesk(worldTarget);renderer.setRenderTarget(endTarget);renderer.render(ending,endCamera);
      dissolve.uniforms.mixValue.value=depart;renderer.setRenderTarget(null);renderer.render(compositor,screenCamera);
    }
  }
  function dispose(){
    const geo=new Set<T.BufferGeometry>(),mats=new Set<T.Material>(),maps=new Set<T.Texture>(textures);
    for(const world of [scene,ending,compositor])world.traverse(obj=>{
      if(obj instanceof T.Mesh){geo.add(obj.geometry);for(const m of [obj.material].flat()){mats.add(m);if(m.map)maps.add(m.map);}}
      if(obj instanceof T.DirectionalLight)obj.shadow.dispose();
    });
    geo.forEach(g=>g.dispose());mats.forEach(m=>m.dispose());maps.forEach(t=>t.dispose());
    for(const rt of [lensTarget,worldTarget,endTarget,environment])rt.dispose();
    courier?.customDepthMaterial?.dispose();hand.customDepthMaterial?.dispose();setter.hand.customDepthMaterial?.dispose();renderer.dispose();
  }
  return {draw,dispose};
}

