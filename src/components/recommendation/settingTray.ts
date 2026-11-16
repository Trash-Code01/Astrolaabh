import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { ease, printedTexture, sapphire, solid } from './objects';
import type { SettingForm } from '../../lib/configuredGemstone';
import { pukhrajRing } from './pukhrajRing';
import { carryFrom, lapSurfaceZ, liftProgress } from './polishingBench';

export interface SettingChoice { form: SettingForm; metalId: string }
export const firstSetting: SettingChoice = { form: 'Ring', metalId: 'yellow-gold' };

export function makeSettingTray(ivory: T.MeshStandardMaterial, rim: T.Material, crystal: T.Texture, makersMark:T.Texture) {
  const group = new T.Group();
  group.position.x = 10.8;
  const tray = solid(new RoundedBoxGeometry(3.64, 3.00, .19, 4, .09), rim);
  const cushion = solid(new RoundedBoxGeometry(3.56, 2.92, .22, 5, .10), ivory);
  cushion.position.z = .035;
  group.add(tray, cushion);
  const portraitMaterial=new T.MeshStandardMaterial({map:ivory.map,color:0xedd6b4,transparent:true,depthWrite:false,roughness:.95});
  const showcasePaper={value:0};
  portraitMaterial.onBeforeCompile=shader=>{
    shader.uniforms.showcasePaper=showcasePaper;
    shader.vertexShader='varying vec2 paperXY;\n'+shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\npaperXY=position.xy;');
    shader.fragmentShader='varying vec2 paperXY;uniform float showcasePaper;\n'+shader.fragmentShader.replace('#include <color_fragment>',
      '#include <color_fragment>\ndiffuseColor.a*=mix(smoothstep(-4.,-1.85,paperXY.x),1.,showcasePaper); diffuseColor.rgb*=.87+.13*exp(-.20*dot(paperXY,paperXY));');
  };
  const paperGeometry=new T.PlaneGeometry(60,70),paperUV=paperGeometry.attributes.uv;
  for(let i=0;i<paperUV.count;i++)paperUV.setXY(i,paperUV.getX(i)*20,paperUV.getY(i)*20);
  const portrait=new T.Mesh(paperGeometry,portraitMaterial);
  portrait.position.z=.142;portrait.receiveShadow=true;group.add(portrait);
  const contactMap=printedTexture(128,128,ctx=>{
    const shadow=ctx.createRadialGradient(64,64,0,64,64,64);
    shadow.addColorStop(0,'rgba(71,44,17,.38)');shadow.addColorStop(.40,'rgba(91,61,29,.19)');
    shadow.addColorStop(1,'rgba(100,65,27,0)');ctx.fillStyle=shadow;ctx.fillRect(0,0,128,128);
  });
  const contact=new T.Mesh(new T.PlaneGeometry(1.38,.53),new T.MeshBasicMaterial({map:contactMap,transparent:true,depthWrite:false}));
  contact.position.set(0,-.50,.145);contact.renderOrder=1;group.add(contact);

  const alloy = new T.MeshStandardMaterial({color: 0xe9bc69, metalness: .93, roughness: .20});
  const mounts = new T.Group();
  mounts.position.set(0, -.12, .25);
  mounts.rotation.z = -.12;
  group.add(mounts);
  const silhouettes = { Ring: pukhrajRing(alloy,makersMark), Necklace: new T.Group(), Bracelet: new T.Group() };
  mounts.add(...Object.values(silhouettes));

  const links = new T.TorusGeometry(1, .18, 9, 22);
  function chain(parent: T.Group, path: T.Curve<T.Vector3>, count: number, radius: number) {
    const mesh = new T.InstancedMesh(links, alloy, count);
    const link = new T.Object3D();
    for (let i=0; i<count; i++) {
      const t = i / (count-1);
      link.position.copy(path.getPointAt(t));
      const tangent = path.getTangentAt(t);
      link.rotation.set(0, 0, Math.atan2(tangent.y, tangent.x));
      link.rotateX(i%2 === 0 ? .25 : .99);
      link.scale.set(radius, radius*.62, radius*.78);
      link.updateMatrix();
      mesh.setMatrixAt(i, link.matrix);
    }
    mesh.castShadow = mesh.receiveShadow = true;
    parent.add(mesh);
  }
  const point = (x:number,y:number,z:number) => new T.Vector3(x,y,z);
  const drop = solid(new T.TorusGeometry(.10,.027,12,30),alloy);
  drop.position.set(0,.41,.19); drop.scale.y=1.3; silhouettes.Necklace.add(drop);
  for (const sign of [-1,1]) {
    const path = new T.QuadraticBezierCurve3(point(0,.52,.17),point(sign*.60,.91,.08),point(sign*1.06,1.52,.02));
    chain(silhouettes.Necklace,path,14,.067);
  }
  const braceletPath = new T.CatmullRomCurve3(Array.from({length:17},(_,i)=>{
    const a=(i/16)*Math.PI*2-Math.PI/2+.23*(1-i/8);
    return point(1.27*Math.cos(a),.49+.49*Math.sin(a),.14-.06*Math.sin(a));
  }));
  chain(silhouettes.Bracelet,braceletPath,48,.085);

  const basket=new T.Group(); mounts.add(basket);
  const chainHead=new T.Group();basket.add(chainHead);
  const collar=solid(new T.TorusGeometry(.30,.032,12,60),alloy);
  collar.scale.set(.83,1.16,1);collar.position.z=.22;chainHead.add(collar);
  for (const x of [-1,1]) for (const y of [-1,1]) {
    const prong=solid(new T.CapsuleGeometry(.034,.18,5,10),alloy);
    prong.rotation.x=Math.PI/2;prong.position.set(x*.185,y*.245,.28);chainHead.add(prong);
  }
  const jewel=sapphire(crystal); jewel.scale.setScalar(.327);basket.add(jewel);
  // Rest a real pavilion facet flat on the lap while the grip changes.
  const parked=new T.Quaternion().setFromEuler(new T.Euler(.44,-.23,.53));
  const down=new T.Vector3(0,0,-1),normal=new T.Vector3(),supportNormal=new T.Vector3();
  const normals=jewel.geometry.getAttribute('normal');
  let supportVertex=0;
  for(let i=0;i<normals.count;i+=3){
    normal.fromBufferAttribute(normals,i).applyQuaternion(parked);
    if(normal.z<supportNormal.z){supportNormal.copy(normal);supportVertex=i;}
  }
  parked.premultiply(new T.Quaternion().setFromUnitVectors(supportNormal.normalize(),down));
  const cut=jewel.geometry.getAttribute('opticalPosition');
  const surface=jewel.geometry.getAttribute('position');
  const stock=new Float32Array(cut.count*3);
  const contactAxis=new T.Vector3().fromBufferAttribute(normals,supportVertex);
  const facetOffset=new T.Vector3().fromBufferAttribute(cut,supportVertex).dot(contactAxis);
  const vertex=new T.Vector3(),vertical=new T.Vector3();
  for(let i=0;i<cut.count;i++){
    vertex.fromBufferAttribute(cut,i);
    const nearFacet=1-ease(.04,.94,facetOffset-vertex.dot(contactAxis));
    const lobe=nearFacet*(.80+.20*Math.sin(4*vertex.x+3*vertex.y));
    stock[3*i]=lobe*(.19*contactAxis.x+.17*vertex.x);
    stock[3*i+1]=lobe*(.19*contactAxis.y+.17*vertex.y);
    stock[3*i+2]=lobe*.19*contactAxis.z;
  }
  let lastFinish=-1;
  const lapOrientation=new T.Quaternion();
  const centre=new T.Vector3(), seat=new T.Vector3(),startRotation=new T.Quaternion(),seatedRotation=new T.Quaternion();
  function pose(p:number, choice:SettingChoice, camera:T.Camera, polishingPoint:T.Vector3,finish:number) {
    group.visible=p>1;
    if(!group.visible)return centre;
    for(const [name,model] of Object.entries(silhouettes))model.visible=name===choice.form;
    const ring=choice.form==='Ring';
    tray.visible=cushion.visible=!ring;
    // Let the workbench give way to one continuous sheet once the hand releases.
    showcasePaper.value=ease(1.90,1.96,p);
    portrait.visible=(ring && p>1.53) || showcasePaper.value>0;
    portraitMaterial.opacity=ring?1:showcasePaper.value;
    portrait.position.z=ring?.142:.15;
    contact.visible=ring && p>1.53;
    chainHead.visible=!ring;
    mounts.position.set(0,ring?.29:-.12,ring?1.28:.25);
    mounts.rotation.z=ring?-.07*(1-ease(1.88,1.99,p)):-.12;
    alloy.color.set(choice.metalId==='silver'?0xdce1e3:ring?0xf1b356:0xe9bc69);
    alloy.roughness=ring?.165:.20;
    basket.rotation.z=choice.form==='Bracelet'?-Math.PI/2:0;
    group.updateMatrixWorld(true);
    seat.set(0,0,.30);basket.localToWorld(seat);
    const rest=ease(1.312,1.349,p);
    if(finish!==lastFinish){
      for(let i=0;i<surface.count;i++){
        surface.setXYZ(i,cut.getX(i)+(1-finish)*stock[3*i],cut.getY(i)+(1-finish)*stock[3*i+1],cut.getZ(i)+(1-finish)*stock[3*i+2]);
      }
      surface.needsUpdate=true;jewel.geometry.computeVertexNormals();jewel.geometry.computeBoundingSphere();
      lastFinish=finish;
    }
    lapOrientation.setFromEuler(new T.Euler(.44+.065*Math.sin(Math.PI*finish),-.23,.35+.18*finish)).slerp(parked,rest);
    // The lowest point stays against the copper as the excess material is removed.
    vertical.set(0,0,1).applyQuaternion(startRotation.copy(lapOrientation).invert());
    let bottom=Infinity;
    for(let i=0;i<surface.count;i++)bottom=Math.min(bottom,vertex.fromBufferAttribute(surface,i).dot(vertical));
    const carry=ease(carryFrom,1.77,p),lower=ease(1.775,1.87,p);
    centre.copy(polishingPoint).lerp(seat,carry);
    centre.z+=(lapSurfaceZ-bottom*jewel.scale.z-polishingPoint.z)*(1-carry);
    centre.z+=.62*liftProgress(p)*(1-lower)+.11*Math.sin(Math.PI*carry);
    jewel.position.copy(centre);basket.worldToLocal(jewel.position);
    // Express the lap orientation in basket space so a bracelet choice only turns the stone during the carry.
    basket.getWorldQuaternion(startRotation).invert();
    startRotation.multiply(lapOrientation);
    seatedRotation.setFromEuler(new T.Euler(.09,-.055,Math.PI/2));
    jewel.quaternion.copy(startRotation).slerp(seatedRotation,ease(1.524,1.78,p));
    jewel.material.uniforms.showcase.value=ring?ease(1.69,1.92,p):0;
    jewel.material.uniforms.finish.value=finish;
    jewel.material.uniforms.eye.value.copy(jewel.worldToLocal(camera.position.clone()));
    return centre;
  }
  return { group, pose, jewel };
}
