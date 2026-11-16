import * as T from 'three';
import { ease, solid } from './objects';

export const lapSurfaceZ=.342;
const toolClear=1.419;
export const carryFrom=1.552;
export const liftProgress=(p:number)=>ease(1.514,1.596,p);

function distanceToRightEdge(worldPoint:T.Vector3,camera:T.Camera,scratch:T.Vector3){
  scratch.copy(worldPoint).project(camera);
  scratch.x=1.04;
  return Math.max(.28,scratch.unproject(camera).x-worldPoint.x);
}

function tweezerBlade(sign:number) {
  // A narrow burnished tip flares into a flat spring arm. The back end extends past the lens.
  const positions:number[]=[],indices:number[]=[];
  const stations=[
    [0,.167,.008,.005,.015], [.17,.214,.013,.008,.041],
    [.75,.288,.025,.013,.21], [2.8,.43,.041,.019,.83], [4.1,.45,.046,.022,1.12],
  ];
  for(const [x,gap,width,depth,rise] of stations){
    for(const [side,height] of [[-1,-.65],[-.72,-1],[.72,-1],[1,-.65],[1,.65],[.72,1],[-.72,1],[-1,.65]]){
      positions.push(x,sign*gap+side*width+.25*x,rise+height*depth);
    }
  }
  for(let row=0;row<stations.length-1;row++){
    for(let j=0;j<8;j++){
      const a=row*8+j,b=row*8+(j+1)%8;
      indices.push(a,b,b+8,a,b+8,a+8);
    }
  }
  for(let i=1;i<7;i++)indices.push(0,i+1,i);
  const geo=new T.BufferGeometry();
  geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));
  geo.setIndex(indices);geo.computeVertexNormals();return geo;
}

export function polishingBench(wear:T.Texture, dark:T.Material) {
  const group=new T.Group();group.position.x=5.8;
  const hardware=new T.Group();group.add(hardware);
  const rotor=new T.Group();rotor.position.set(-.99,-.86,.19);hardware.add(rotor);
  const copper=new T.MeshStandardMaterial({map:wear,color:0xdbb99a,bumpMap:wear,bumpScale:.0035,metalness:.69,roughness:.39});
  const edge=new T.MeshStandardMaterial({color:0x936346,metalness:.78,roughness:.34});
  const radius=1.87;
  const drum=solid(new T.CylinderGeometry(radius,radius-.025,.30,144),edge);
  drum.rotation.x=Math.PI/2;rotor.add(drum);
  const face=solid(new T.CircleGeometry(radius-.003,144),copper);face.position.z=.152;rotor.add(face);
  for(const z of [-.108,-.087,.125,.148]){
    const turning=solid(new T.TorusGeometry(radius-.006,.008,8,144),edge);
    turning.position.z=z;rotor.add(turning);
  }
  const pin=solid(new T.CylinderGeometry(.030,.030,.012,24),dark);
  pin.rotation.x=Math.PI/2;pin.position.z=.154;rotor.add(pin);

  const tongs=new T.Group();hardware.add(tongs);
  const steel=new T.MeshStandardMaterial({color:0xb2aca1,roughness:.31,metalness:.93});
  const blades=[-1,1].map(sign=>{
    const blade=solid(tweezerBlade(sign),steel);tongs.add(blade);return blade;
  });
  const point=new T.Vector3(),worldPoint=new T.Vector3(),edgePoint=new T.Vector3();
  function pose(p:number,idleAngle:number,camera:T.Camera) {
    group.visible=p>1 && p<1.77;
    hardware.position.x=-4.8*ease(carryFrom,1.77,p);
    rotor.rotation.z=18*ease(1.045,1.35,p)+idleAngle;
    const sweep=ease(1.14,1.345,p);
    point.set(.55-.18*sweep,-.45+.15*Math.sin(Math.PI*sweep),.54);
    const release=ease(1.35,1.374,p);
    const withdraw=ease(1.366,toolClear,p);
    tongs.position.copy(point);
    group.localToWorld(worldPoint.copy(point));
    const exitTravel=distanceToRightEdge(worldPoint,camera,edgePoint)+.31;
    tongs.position.x+=.14+exitTravel*withdraw;
    tongs.position.y+=.035+.28*withdraw;
    tongs.position.z+=.035+.23*withdraw;
    tongs.rotation.z=.12;
    blades[0].rotation.z=.036*release;blades[1].rotation.z=-.036*release;
    blades[0].position.y=-.105*release;blades[1].position.y=.105*release;
    tongs.visible=p<toolClear;
    return point;
  }
  function alignGrip(height:number){if(tongs.visible)tongs.position.z+=height;}
  return {group,pose,alignGrip};
}

// The photo carries the fingertip silhouette. A continuous UV surface flexes at
// the knuckles so opening the pinch never exposes a cut edge of the texture.
export function placementHand(texture:T.Texture) {
  const geometry=new T.PlaneGeometry(1,1,64,48);
  const uv=geometry.getAttribute('uv'),positions=geometry.getAttribute('position');
  const fingertipWeight=new Float32Array(uv.count);
  const texel=.001377;
  for(let i=0;i<uv.count;i++){
    const x=uv.getX(i)*1536,y=(1-uv.getY(i))*1024;
    const weight=1-ease(230,850,x);
    fingertipWeight[i]=weight*(2*ease(-37,37,490-y)-1);
    positions.setXYZ(i,(x-163)*texel,(490-y)*texel,.01275*weight);
  }
  const rest=positions.clone();
  const material=new T.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.025,
    side:T.FrontSide,toneMapped:false});
  const hand=solid(geometry,material);
  hand.frustumCulled=false;
  hand.customDepthMaterial=new T.MeshDepthMaterial({map:texture,alphaTest:.45,depthPacking:T.RGBADepthPacking});
  const edgePoint=new T.Vector3(),offset=new T.Vector3(),axis=new T.Vector3();
  const cameraLocal=new T.Vector3();
  const orientation=new T.Quaternion(),roll=new T.Quaternion(),zAxis=new T.Vector3(0,0,1);
  function pose(p:number,centre:T.Vector3,camera:T.Camera,jewel:T.Mesh<T.BufferGeometry>) {
    const arrive=ease(toolClear,1.495,p),leave=ease(1.895,1.99,p);
    hand.visible=arrive>0 && leave<1;
    if(!hand.visible)return;
    roll.setFromAxisAngle(zAxis,.73+.08*ease(1.54,1.79,p));
    hand.quaternion.copy(camera.quaternion).multiply(roll);
    // Measure the current stone along the pinch axis as it turns into its setting.
    jewel.getWorldQuaternion(orientation);
    axis.set(0,1,0).applyQuaternion(hand.quaternion).applyQuaternion(orientation.invert());
    const vertices=jewel.geometry.getAttribute('position');
    let high=-Infinity,low=Infinity;
    for(let i=0;i<vertices.count;i++){
      const projection=offset.fromBufferAttribute(vertices,i).dot(axis)*jewel.scale.z;
      high=Math.max(high,projection);low=Math.min(low,projection);
    }
    const opening=Math.max(1-ease(1.482,1.514,p),ease(1.873,1.907,p));
    const spread=(high-low)*.425-38*texel+.16*opening;
    hand.position.copy(centre).add(offset.set(.016,(high+low)*.5,.055).applyQuaternion(hand.quaternion));
    const away=1-arrive+leave;
    hand.position.x+=(distanceToRightEdge(centre,camera,edgePoint)+.30)*away;
    hand.position.y+=.35*away;
    hand.position.z+=.30*away+.08*Math.sin(Math.PI*arrive);
    hand.updateWorldMatrix(true,false);
    cameraLocal.copy(camera.position);hand.worldToLocal(cameraLocal);
    const m=hand.matrixWorld.elements;
    const clearance=T.MathUtils.lerp(lapSurfaceZ+.026,centre.z+.32,ease(1.60,1.78,p));
    // Bend the near thumb towards the lens above the wheel and the shoulders.
    // Moving on the view ray preserves the photographed nail and pad outlines.
    for(let i=0;i<positions.count;i++){
      const w=fingertipWeight[i];
      offset.set(rest.getX(i),rest.getY(i)+spread*w,rest.getZ(i)+.085*Math.max(0,-w));
      const worldZ=m[2]*offset.x+m[6]*offset.y+m[10]*offset.z+m[14];
      if(worldZ<clearance)offset.lerp(cameraLocal,(clearance-worldZ)/(camera.position.z-worldZ));
      positions.setXYZ(i,offset.x,offset.y,offset.z);
    }
    positions.needsUpdate=true;
  }
  return {hand,pose};
}
