import{xU as te,Iy as ie,Iz as re,Hb as ae,IA as se,IB as oe,Hf as o,Ir as ne,HK as ce,Iq as le,He as y,IC as pe,ID as de,HO as N,Hd as he,Hg as ve,Hh as ue,I6 as me,Hj as fe,IE as R,IF as U,IG as ge,IH as Se,HP as Pe,gp as ye,qP as _e,k0 as we,qR as xe,_ as ze,qT as D,Hl as E,Hm as $e,Hn as q,qU as M,Hp as be,Hq as ke,Hs as Oe,II as Ve,IJ as B,IK as G,IL as Te,IM as Ce,IN as We,ae as d,ah as De,HR as Ie,Hu as m,f$ as Me,Hw as I,HU as Le,IO as K,ts as je,Ii as He,IP as Ae,Hx as Fe,d1 as Q,kR as Ne,gm as Y,n as J,IQ as Re}from"./index-BsIhQCI4.js";function X(r){const e=new te,{space:a,anchor:t,hasTip:_,hasScreenSizePerspective:x}=r,f=a===2,k=a===1;e.attributes.add("position","vec3"),e.vertex.inputs.add("position",()=>"position"),e.include(ie,r),e.include(re,r);const{vertex:i,fragment:S,varyings:g}=e;ae(i,r),e.attributes.add("previousDelta","vec4"),e.attributes.add("uv0","vec2"),g.add("vColor","vec4"),g.add("vpos","vec3",{invariant:!0}),g.add("vUV","vec2"),g.add("vSize","float"),_&&g.add("vLineWidth","float"),i.uniforms.add(new se("nearFar",({camera:c})=>c.nearFar),new oe("viewport",({camera:c})=>c.fullViewport)).code.add(o`vec4 projectAndScale(vec4 pos) {
vec4 posNdc = proj * pos;
posNdc.xy *= viewport.zw / posNdc.w;
return posNdc;
}`),i.code.add(o`void clip(vec4 pos, inout vec4 prev) {
float vnp = nearFar[0] * 0.99;
if (prev.z > -nearFar[0]) {
float interpolation = (-vnp - pos.z) / (prev.z - pos.z);
prev = mix(pos, prev, interpolation);
}
}`),f?(e.attributes.add("normal","vec3"),ne(i),i.constants.add("tiltThreshold","float",.7),i.code.add(o`vec3 perpendicular(vec3 v) {
vec3 n = (viewNormal * vec4(normal.xyz, 1.0)).xyz;
vec3 n2 = cross(v, n);
vec3 forward = vec3(0.0, 0.0, 1.0);
float tiltDot = dot(forward, n);
return abs(tiltDot) < tiltThreshold ? n : n2;
}`)):i.code.add(o`vec2 perpendicular(vec2 v) {
return vec2(v.y, -v.x);
}`);const l=f?"vec3":"vec2";return i.code.add(o`
      ${l} normalizedSegment(${l} pos, ${l} prev) {
        ${l} segment = pos - prev;
        float segmentLen = length(segment);

        // normalize or zero if too short
        return (segmentLen > 0.001) ? segment / segmentLen : ${f?"vec3(0.0, 0.0, 0.0)":"vec2(0.0, 0.0)"};
      }

      ${l} displace(${l} pos, ${l} prev, float displacementLen) {
        ${l} segment = normalizedSegment(pos, prev);

        ${l} displacementDirU = perpendicular(segment);
        ${l} displacementDirV = segment;

        ${t===1?"pos -= 0.5 * displacementLen * displacementDirV;":""}

        return pos + displacementLen * (uv0.x * displacementDirU + uv0.y * displacementDirV);
      }
    `),k&&(i.uniforms.add(new ce("inverseProjectionMatrix",({camera:c})=>c.inverseProjectionMatrix)),i.code.add(o`vec3 inverseProject(vec4 posScreen) {
posScreen.xy = (posScreen.xy / viewport.zw) * posScreen.w;
return (inverseProjectionMatrix * posScreen).xyz;
}`),i.code.add(o`bool rayIntersectPlane(vec3 rayDir, vec3 planeOrigin, vec3 planeNormal, out vec3 intersection) {
float cos = dot(rayDir, planeNormal);
float t = dot(planeOrigin, planeNormal) / cos;
intersection = t * rayDir;
return abs(cos) > 0.001 && t > 0.0;
}`),i.uniforms.add(new le("perScreenPixelRatio",({camera:c})=>c.perScreenPixelRatio)),i.code.add(o`
      vec4 toFront(vec4 displacedPosScreen, vec3 posLeft, vec3 posRight, vec3 prev, float lineWidth) {
        // Project displaced position back to camera space
        vec3 displacedPos = inverseProject(displacedPosScreen);

        // Calculate the plane that we want the marker to lie in. Note that this will always be an approximation since ribbon lines are generally
        // not planar and we do not know the actual position of the displaced prev vertices (they are offset in screen space, too).
        vec3 planeNormal = normalize(cross(posLeft - posRight, posLeft - prev));
        vec3 planeOrigin = posLeft;

        ${y(r.hasCap,`if(prev.z > posLeft.z) {
                vec2 diff = posLeft.xy - posRight.xy;
                planeOrigin.xy += perpendicular(diff) / 2.0;
             }`)};

        // Move the plane towards the camera by a margin dependent on the line width (approximated in world space). This tolerance corrects for the
        // non-planarity in most cases, but sharp joins can place the prev vertices at arbitrary positions so markers can still clip.
        float offset = lineWidth * perScreenPixelRatio;
        planeOrigin *= (1.0 - offset);

        // Intersect camera ray with the plane and make sure it is within clip space
        vec3 rayDir = normalize(displacedPos);
        vec3 intersection;
        if (rayIntersectPlane(rayDir, planeOrigin, planeNormal, intersection) && intersection.z < -nearFar[0] && intersection.z > -nearFar[1]) {
          return vec4(intersection.xyz, 1.0);
        }

        // Fallback: use depth of pos or prev, whichever is closer to the camera
        float minDepth = planeOrigin.z > prev.z ? length(planeOrigin) : length(prev);
        displacedPos *= minDepth / length(displacedPos);
        return vec4(displacedPos.xyz, 1.0);
      }
  `)),pe(i),e.include(de),i.main.add(o`
    // Check for special value of uv0.y which is used by the Renderer when graphics
    // are removed before the VBO is recompacted. If this is the case, then we just
    // project outside of clip space.
    if (uv0.y == 0.0) {
      // Project out of clip space
      gl_Position = ${N};
    }
    else {
      vec4 pos  = view * vec4(position, 1.0);
      vec4 prev = view * vec4(position + previousDelta.xyz * previousDelta.w, 1.0);

      float lineWidth = getLineWidth(${y(x,"pos.xyz")});
      float screenMarkerSize = getScreenMarkerSize(lineWidth);

      clip(pos, prev);

      ${f?o`${y(r.hideOnShortSegments,o`
                if (areWorldMarkersHidden(pos.xyz, prev.xyz)) {
                  gl_Position = ${N};
                  return;
                }`)}
            pos.xyz = displace(pos.xyz, prev.xyz, getWorldMarkerSize(pos.xyz));
            vec4 displacedPosScreen = projectAndScale(pos);`:o`
            vec4 posScreen = projectAndScale(pos);
            vec4 prevScreen = projectAndScale(prev);
            vec4 displacedPosScreen = posScreen;

            displacedPosScreen.xy = displace(posScreen.xy, prevScreen.xy, screenMarkerSize);
            ${y(k,o`
                vec2 displacementDirU = perpendicular(normalizedSegment(posScreen.xy, prevScreen.xy));

                // We need three points of the ribbon line in camera space to calculate the plane it lies in
                // Note that we approximate the third point, since we have no information about the join around prev
                vec3 lineRight = inverseProject(posScreen + lineWidth * vec4(displacementDirU.xy, 0.0, 0.0));
                vec3 lineLeft = pos.xyz + (pos.xyz - lineRight);

                pos = toFront(displacedPosScreen, lineLeft, lineRight, prev.xyz, lineWidth);
                displacedPosScreen = projectAndScale(pos);`)}`}
      // Convert back into NDC
      displacedPosScreen.xy = (displacedPosScreen.xy / viewport.zw) * displacedPosScreen.w;

      // Convert texture coordinate into [0,1]
      vUV = (uv0 + 1.0) / 2.0;
      ${y(!f,"vUV = noPerspectiveWrite(vUV, displacedPosScreen.w);")}
      ${y(_,"vLineWidth = noPerspectiveWrite(lineWidth, displacedPosScreen.w);")}

      vSize = screenMarkerSize;
      vColor = getColor();

      // Use camera space for slicing
      vpos = pos.xyz;

      gl_Position = displacedPosScreen;
    }`),S.include(he,r),e.include(ve,r),S.include(ue),S.uniforms.add(new me("intrinsicColor",({color:c})=>c),new fe("tex",({markerTexture:c})=>c)).constants.add("texelSize","float",1/R).code.add(o`float markerAlpha(vec2 samplePos) {
samplePos += vec2(0.5, -0.5) * texelSize;
float sdf = texture(tex, samplePos).r;
float pixelDistance = sdf * vSize;
pixelDistance -= 0.5;
return clamp(0.5 - pixelDistance, 0.0, 1.0);
}`),_&&(e.include(U),S.constants.add("relativeMarkerSize","float",ge/R).constants.add("relativeTipLineWidth","float",Se).code.add(o`
    float tipAlpha(vec2 samplePos) {
      // Convert coordinates s.t. they are in pixels and relative to the tip of an arrow marker
      samplePos -= vec2(0.5, 0.5 + 0.5 * relativeMarkerSize);
      samplePos *= vSize;

      float halfMarkerSize = 0.5 * relativeMarkerSize * vSize;
      float halfTipLineWidth = 0.5 * max(1.0, relativeTipLineWidth * noPerspectiveRead(vLineWidth));

      ${y(f,"halfTipLineWidth *= fwidth(samplePos.y);")}

      float distance = max(abs(samplePos.x) - halfMarkerSize, abs(samplePos.y) - halfTipLineWidth);
      return clamp(0.5 - distance, 0.0, 1.0);
    }
  `)),e.include(Pe,r),e.include(U),S.main.add(o`
    discardBySlice(vpos);

    vec4 finalColor = intrinsicColor * vColor;

    // Cancel out perspective correct interpolation if in screen space or draped
    vec2 samplePos = ${y(!f,"noPerspectiveRead(vUV)","vUV")};
    finalColor.a *= ${_?"max(markerAlpha(samplePos), tipAlpha(samplePos))":"markerAlpha(samplePos)"};
    outputColorHighlightOLID(applySlice(finalColor, vpos), finalColor.rgb);`),e}const Ue=Object.freeze(Object.defineProperty({__proto__:null,build:X},Symbol.toStringTag,{value:"Module"}));let L=class extends _e{constructor(e,a){super(e,a,we(Z(a))),this.shader=new xe(Ue,()=>ze(()=>Promise.resolve().then(()=>Qe),void 0))}_makePipelineState(e,a){const{output:t,space:_,hasOccludees:x}=e;return D({blending:Oe(t,!1,e.emissionDimmingPass),depthTest:_===0?null:ke(t),depthWrite:be(e),colorWrite:M,stencilWrite:x?q:null,stencilTest:x?a?E:$e:null,polygonOffset:{factor:0,units:-10}})}initializePipeline(e){return e.occluder?(this._occluderPipelineTransparent=D({blending:G,depthTest:B,depthWrite:null,colorWrite:M,stencilWrite:null,stencilTest:Ve}),this._occluderPipelineOpaque=D({blending:G,depthTest:B,depthWrite:null,colorWrite:M,stencilWrite:Ce,stencilTest:Te}),this._occluderPipelineMaskWrite=D({blending:null,depthTest:We,depthWrite:null,colorWrite:null,stencilWrite:q,stencilTest:E})):this._occluderPipelineTransparent=this._occluderPipelineOpaque=this._occluderPipelineMaskWrite=null,this._occludeePipelineState=this._makePipelineState(e,!0),this._makePipelineState(e,!1)}getPipeline(e,a,t){return t?this._occludeePipelineState:e.occluder===11?this._occluderPipelineTransparent??super.getPipeline(e,a,t):e.occluder===10?this._occluderPipelineOpaque??super.getPipeline(e,a,t):this._occluderPipelineMaskWrite??super.getPipeline(e,a,t)}};function Z(r){const e=ye().vec3f("position").vec4f16("previousDelta").vec2f16("uv0");return r.hasVVColor?e.f32("colorFeatureAttribute"):e.vec4u8("color",{glNormalized:!0}),r.hasVVOpacity&&e.f32("opacityFeatureAttribute"),r.hasVVSize?e.f32("sizeFeatureAttribute"):e.f16("size"),r.worldSpace&&e.vec3f16("normal"),e.freeze()}L=d([De("esri.views.3d.webgl-engine.shaders.LineMarkerTechnique")],L);class h extends Ie{constructor(e){super(),this.spherical=e,this.space=1,this.anchor=0,this.occluder=!1,this.writeDepth=!1,this.hideOnShortSegments=!1,this.hasCap=!1,this.hasTip=!1,this.hasVVSize=!1,this.hasVVColor=!1,this.hasVVOpacity=!1,this.hasOccludees=!1,this.hasScreenSizePerspective=!1,this.textureCoordinateType=0,this.emissionSource=0,this.discardInvisibleFragments=!0,this.occlusionPass=!1,this.hasVVInstancing=!1,this.hasSliceTranslatedView=!0,this.olidColorInstanced=!1,this.overlayEnabled=!1,this.snowCover=!1}get draped(){return this.space===0}get worldSpace(){return this.space===2}}d([m({count:3})],h.prototype,"space",void 0),d([m({count:2})],h.prototype,"anchor",void 0),d([m()],h.prototype,"occluder",void 0),d([m()],h.prototype,"writeDepth",void 0),d([m()],h.prototype,"hideOnShortSegments",void 0),d([m()],h.prototype,"hasCap",void 0),d([m()],h.prototype,"hasTip",void 0),d([m()],h.prototype,"hasVVSize",void 0),d([m()],h.prototype,"hasVVColor",void 0),d([m()],h.prototype,"hasVVOpacity",void 0),d([m()],h.prototype,"hasOccludees",void 0),d([m()],h.prototype,"hasScreenSizePerspective",void 0);class Xe extends Me{constructor(e,a){super(e,qe),this.produces=new Map([[2,t=>t===10||I(t)&&this.parameters.renderOccluded===8],[3,t=>Le(t)],[10,t=>K(t)&&this.parameters.renderOccluded===8],[11,t=>K(t)&&this.parameters.renderOccluded===8],[4,t=>I(t)&&this.parameters.writeDepth],[8,t=>I(t)&&!this.parameters.writeDepth],[18,t=>I(t)||t===10]]),this.intersectDraped=void 0,this._configuration=new h(a)}updateConfiguration(e){super.updateConfiguration(e),this._configuration.space=e.slot===18?0:this.parameters.worldSpace?2:1,this._configuration.hideOnShortSegments=this.parameters.hideOnShortSegments,this._configuration.hasCap=this.parameters.cap!==0,this._configuration.anchor=this.parameters.anchor,this._configuration.hasTip=this.parameters.hasTip,this._configuration.hasSlicePlane=this.parameters.hasSlicePlane,this._configuration.hasOccludees=e.hasOccludees,this._configuration.writeDepth=this.parameters.writeDepth,this._configuration.hasVVSize=this.parameters.hasVVSize,this._configuration.hasVVColor=this.parameters.hasVVColor,this._configuration.hasVVOpacity=this.parameters.hasVVOpacity,this._configuration.occluder=this.parameters.renderOccluded===8,this._configuration.hasScreenSizePerspective=this.parameters.screenSizePerspective!=null}get visible(){return this.parameters.color[3]>=je}intersect(){}createBufferWriter(){return new Be(Z(this.parameters),this.parameters)}createGLMaterial(e){return new Ee(e)}}class Ee extends Fe{dispose(){super.dispose(),this._markerTextures?.release(this._markerPrimitive),this._markerPrimitive=null}beginSlot(e){const a=this._material.parameters.markerPrimitive;return a!==this._markerPrimitive&&(this._material.setParameters({markerTexture:this._markerTextures.swap(a,this._markerPrimitive)}),this._markerPrimitive=a),this.getTechnique(L,e)}}class qe extends He{constructor(){super(...arguments),this.width=0,this.color=[1,1,1,1],this.markerPrimitive="arrow",this.placement="end",this.cap=0,this.anchor=0,this.hasTip=!1,this.worldSpace=!1,this.hideOnShortSegments=!1,this.writeDepth=!0,this.hasSlicePlane=!1,this.vvFastUpdate=!1,this.stipplePattern=null,this.markerTexture=null}}class Be{constructor(e,a){this.layout=e,this._parameters=a}elementCount(){return this._parameters.placement==="begin-end"?12:6}write(e,a,t,_,x){const{buffer:f,offset:k}=x,i=t.get("position").data,S=i.length/3;let g=[1,0,0];const l=t.get("normal");this._parameters.worldSpace&&l!=null&&(g=l.data);let c=1,j=0;this._parameters.vvSize?j=t.get("sizeFeatureAttribute").data[0]:t.has("size")&&(c=t.get("size").data[0]);let z=[1,1,1,1],H=0;this._parameters.vvColor?H=t.get("colorFeatureAttribute").data[0]:t.has("color")&&(z=t.get("color").data);let A=0;this._parameters.vvOpacity&&(A=t.get("opacityFeatureAttribute").data[0]);const w=new Float32Array(f.buffer),P=Ae(f.buffer),O=new Uint8Array(f.buffer);let p=k*(this.layout.stride/4);const $=w.BYTES_PER_ELEMENT/P.BYTES_PER_ELEMENT,ee=4/$,b=(n,T,v,u)=>{w[p++]=n[0],w[p++]=n[1],w[p++]=n[2],Re(T,n,P,p*$),p+=ee;let s=p*$;if(P[s++]=v[0],P[s++]=v[1],p=Math.ceil(s/$),this._parameters.vvColor)w[p++]=H;else{const C=Math.min(4*u,z.length-4),W=4*p++;O[W]=255*z[C],O[W+1]=255*z[C+1],O[W+2]=255*z[C+2],O[W+3]=255*z[C+3]}this._parameters.vvOpacity&&(w[p++]=A),s=p*$,this._parameters.vvSize?(w[p++]=j,s+=2):P[s++]=c,this._parameters.worldSpace&&(P[s++]=g[0],P[s++]=g[1],P[s++]=g[2]),p=Math.ceil(s/$)},F=(n,T)=>{const v=Q(Ge,i[3*n],i[3*n+1],i[3*n+2]),u=Ke;let s=n+T;do Q(u,i[3*s],i[3*s+1],i[3*s+2]),s+=T;while(Ne(v,u)&&s>=0&&s<S);e&&(Y(v,v,e),Y(u,u,e)),b(v,u,[-1,-1],n),b(v,u,[1,-1],n),b(v,u,[1,1],n),b(v,u,[-1,-1],n),b(v,u,[1,1],n),b(v,u,[-1,1],n)},V=this._parameters.placement;V!=="begin"&&V!=="begin-end"||F(0,1),V!=="end"&&V!=="begin-end"||F(S-1,-1)}}const Ge=J(),Ke=J(),Qe=Object.freeze(Object.defineProperty({__proto__:null,build:X},Symbol.toStringTag,{value:"Module"}));export{Xe as g};
