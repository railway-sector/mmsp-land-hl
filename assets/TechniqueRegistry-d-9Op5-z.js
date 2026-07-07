import{bG as et,ae as r,bR as co,oQ as I,tr as po,lD as Xi,mC as fo,BK as j,GP as J,GQ as ie,GR as Kt,GS as Q,GT as me,GU as ne,lL as he,eV as ui,G7 as mo,G5 as gn,G8 as _n,ru as hn,bV as vo,lG as go,bW as _o,eW as yn,bT as xn,GV as Sn,GW as ho,GX as Ji,GY as yo,ms as Qi,j as xo,E_ as So,sX as bo,F7 as To,X as wo,GZ as Oo,G_ as Io,G$ as zo}from"./index-YoCdWHqb.js";import{g as m,C as o,c as g,r as G,$ as Y,j as H,k as $,U as bn,d as k,H as Co,u as De,a5 as bt,a as Ke,_ as S,F as Vt,M as W,P as xt,e as D,X as N,v as y,a6 as Se,f as v,K as le,z as M,I as Rt,a7 as Xt,w as Jt,N as Pi,q as pe,E as ce,G as R,A as B,a8 as de,S as Le,b as tt,p as it,a0 as ci,n as _e,a9 as Pt,aa as Ao,D as ee,ab as Po,y as Qt,O as te,B as nt,ac as gi,x as ot,ad as Tn,m as gt,ae as wn,Q as qe,Y as ge,i as z,af as en,o as tn,s as On,t as In,R as zn,V as Di,W as Zt,ag as Do,T as Vo,ah as Ro,ai as Fo,Z as Eo,aj as Lo}from"./GraphShaderModule-4zNstrIQ.js";import{o as ye,g as Mo,r as nn,e as on,a as ti}from"./gradientStrokeConstants-DBVurMyz.js";import{M as fe,L as Cn,K as X,F as No,e as an,p as An,g as rn,o as ki,u as Pn,A as $o,r as Bo,s as Ho,f as Go,z as Yo,J as ko,I as Wo,H as Uo,D as Zo,E as sn,B as qo,C as jo}from"./constants-Cyw2BPc7.js";import{B as Ko,q as zi,A as Xo,h as K,g as Jo,x as je,C as _i,k as at,z as Qo,w as ln,D as un,E as ii}from"./utils-BEsV7wce.js";import{s as ea}from"./SimpleMesh-CTbSVf1v.js";import{o as ta}from"./utils-C5qwzvzB.js";import{a as ia}from"./heatmapTextureUtils-TMR2_mfq.js";import{e as na}from"./ShaderCompiler-G2XYGDs6.js";let oa=class{get forceStaticPath(){return et("esri-cim-animations-enable-status")==="disabled"}get forceAnimatedPath(){return et("esri-cim-animations-enable-status")==="forced"}get freezeGlobalTime(){return et("esri-cim-animations-freeze-time")??!1}get spotlightAnimatedSymbols(){return!!et("esri-cim-animations-spotlight")}get forceGlobalTimeOrigin(){return et("esri-cim-animations-freeze-time")!==!1}};const Wi=new oa,aa={bitBlit:{"bitBlit.frag":`uniform lowp sampler2D u_tex;
uniform lowp float u_opacity;
varying mediump vec2 v_uv;
void main() {
lowp vec4 color = texture2D(u_tex, v_uv);
gl_FragColor = color * u_opacity;
}`,"bitBlit.vert":`attribute vec2 a_pos;
attribute vec2 a_tex;
varying mediump vec2 v_uv;
void main(void) {
gl_Position = vec4(a_pos , 0.0, 1.0);
v_uv = a_tex;
}`},debug:{overlay:{"overlay.frag":`precision mediump float;
varying vec4 v_color;
void main(void) {
gl_FragColor = v_color;
}`,"overlay.vert":`attribute vec3 a_PositionAndFlags;
uniform mat3 u_dvsMat3;
uniform vec4 u_colors[4];
uniform float u_opacities[4];
varying vec4 v_color;
void main(void) {
vec2 position = a_PositionAndFlags.xy;
float flags = a_PositionAndFlags.z;
int colorIndex = int(mod(flags, 4.0));
vec4 color;
for (int i = 0; i < 4; i++) {
color = u_colors[i];
if (i == colorIndex) {
break;
}
}
int opacityIndex = int(mod(floor(flags / 4.0), 4.0));
float opacity;
for (int i = 0; i < 4; i++) {
opacity = u_opacities[i];
if (i == opacityIndex) {
break;
}
}
v_color = color * opacity;
gl_Position = vec4((u_dvsMat3 * vec3(position, 1.0)).xy, 0.0, 1.0);
}`}},dot:{dot:{"dot.frag":`precision mediump float;
varying vec4 v_color;
varying float v_dotRatio;
varying float v_invEdgeRatio;
uniform highp float u_tileZoomFactor;
void main()
{
float dist = length(gl_PointCoord - vec2(.5, .5)) * 2.;
float alpha = smoothstep(0., 1., v_invEdgeRatio * (dist - v_dotRatio) + 1.);
gl_FragColor = v_color * alpha;
}`,"dot.vert":`precision highp float;
attribute vec2 a_pos;
uniform sampler2D u_texture;
uniform highp mat3 u_dvsMat3;
uniform highp float u_tileZoomFactor;
uniform highp float u_dotSize;
uniform highp float u_pixelRatio;
varying vec2 v_pos;
varying vec4 v_color;
varying float v_dotRatio;
varying float v_invEdgeRatio;
const float EPSILON = 0.000001;
void main()
{
mat3 tileToTileTexture = mat3(  1., 0., 0.,
0., -1., 0.,
0., 1., 1.  );
vec3 texCoords = tileToTileTexture * vec3(a_pos.xy / 512., 1.);
v_color = texture2D(u_texture, texCoords.xy);
float smoothEdgeWidth = max(u_dotSize / 2., 1.) ;
float z = 0.;
z += 2.0 * step(v_color.a, EPSILON);
gl_PointSize = (smoothEdgeWidth + u_dotSize);
gl_Position = vec4((u_dvsMat3 * vec3(a_pos + .5, 1.)).xy, z, 1.);
v_dotRatio = u_dotSize / gl_PointSize;
v_invEdgeRatio = -1. / ( smoothEdgeWidth / gl_PointSize );
gl_PointSize  *= (u_pixelRatio * u_tileZoomFactor);
}`}},filtering:{"bicubic.glsl":`vec4 computeWeights(float v) {
float b = 1.0 / 6.0;
float v2 = v * v;
float v3 = v2 * v;
float w0 = b * (-v3 + 3.0 * v2 - 3.0 * v + 1.0);
float w1 = b * (3.0 * v3  - 6.0 * v2 + 4.0);
float w2 = b * (-3.0 * v3 + 3.0 * v2 + 3.0 * v + 1.0);
float w3 = b * v3;
return vec4(w0, w1, w2, w3);
}
vec4 bicubicOffsetsAndWeights(float v) {
vec4 w = computeWeights(v);
float g0 = w.x + w.y;
float g1 = w.z + w.w;
float h0 = 1.0 - (w.y / g0) + v;
float h1 = 1.0 + (w.w / g1) - v;
return vec4(h0, h1, g0, g1);
}
vec4 sampleBicubicBSpline(sampler2D sampler, vec2 coords, vec2 texSize) {
vec2 eX = vec2(1.0 / texSize.x, 0.0);
vec2 eY = vec2(0.0, 1.0 / texSize.y);
vec2 texel = coords * texSize - 0.5;
vec3 hgX = bicubicOffsetsAndWeights(fract(texel).x).xyz;
vec3 hgY = bicubicOffsetsAndWeights(fract(texel).y).xyz;
vec2 coords10 = coords + hgX.x * eX;
vec2 coords00 = coords - hgX.y * eX;
vec2 coords11 = coords10 + hgY.x * eY;
vec2 coords01 = coords00 + hgY.x * eY;
coords10 = coords10 - hgY.y * eY;
coords00 = coords00 - hgY.y * eY;
vec4 color00 = texture2D(sampler, coords00);
vec4 color10 = texture2D(sampler, coords10);
vec4 color01 = texture2D(sampler, coords01);
vec4 color11 = texture2D(sampler, coords11);
color00 = mix(color00, color01, hgY.z);
color10 = mix(color10, color11, hgY.z);
color00 = mix(color00, color10, hgX.z);
return color00;
}`,"bilinear.glsl":`vec4 sampleBilinear(sampler2D sampler, vec2 coords, vec2 texSize) {
vec2 texelStart = floor(coords * texSize);
vec2 coord0 = texelStart / texSize;
vec2 coord1 = (texelStart +  vec2(1.0, 0.0)) / texSize;
vec2 coord2 = (texelStart +  vec2(0.0, 1.0)) / texSize;
vec2 coord3 = (texelStart +  vec2(1.0, 1.0)) / texSize;
vec4 color0 = texture2D(sampler, coord0);
vec4 color1 = texture2D(sampler, coord1);
vec4 color2 = texture2D(sampler, coord2);
vec4 color3 = texture2D(sampler, coord3);
vec2 blend = fract(coords * texSize);
vec4 color01 = mix(color0, color1, blend.x);
vec4 color23 = mix(color2, color3, blend.x);
vec4 color = mix(color01, color23, blend.y);
#ifdef NNEDGE
float alpha = floor(color0.a * color1.a * color2.a * color3.a + 0.5);
color = color * alpha + (1.0 - alpha) * texture2D(sampler, coords);
#endif
return color;
}`,"epx.glsl":`vec4 sampleEPX(sampler2D sampler, float size, vec2 coords, vec2 texSize) {
vec2 invSize = 1.0 / texSize;
vec2 texel = coords * texSize;
vec2 texel_i = floor(texel);
vec2 texel_frac = fract(texel);
vec4 colorP = texture2D(sampler, texel_i * invSize);
vec4 colorP1 = vec4(colorP);
vec4 colorP2 = vec4(colorP);
vec4 colorP3 = vec4(colorP);
vec4 colorP4 = vec4(colorP);
vec4 colorA = texture2D(sampler, (texel_i - vec2(0.0, 1.0)) * invSize);
vec4 colorB = texture2D(sampler, (texel_i + vec2(1.0, 0.0)) * invSize);
vec4 colorC = texture2D(sampler, (texel_i - vec2(1.0, 0.0)) * invSize);
vec4 colorD = texture2D(sampler, (texel_i + vec2(0.0, 1.0)) * invSize);
if (colorC == colorA && colorC != colorD && colorA != colorB) {
colorP1 = colorA;
}
if (colorA == colorB && colorA != colorC && colorB != colorD) {
colorP2 = colorB;
}
if (colorD == colorC && colorD != colorB && colorC != colorA) {
colorP3 = colorC;
}
if (colorB == colorD && colorB != colorA && colorD != colorC) {
colorP4 = colorD;
}
vec4 colorP12 = mix(colorP1, colorP2, texel_frac.x);
vec4 colorP34 = mix(colorP1, colorP2, texel_frac.x);
return mix(colorP12, colorP34, texel_frac.y);
}`},heatmap:{heatmapResolve:{"heatmapResolve.frag":`precision highp float;
#ifdef HEATMAP_PRECISION_HALF_FLOAT
#define COMPRESSION_FACTOR 4.0
#else
#define COMPRESSION_FACTOR 1.0
#endif
uniform sampler2D u_texture;
uniform sampler2D u_gradient;
uniform vec2 u_densityMinAndInvRange;
uniform float u_densityNormalization;
varying vec2 v_uv;
void main() {
vec4 data = texture2D(u_texture, v_uv);
float density = data.r * COMPRESSION_FACTOR;
density *= u_densityNormalization;
density = (density - u_densityMinAndInvRange.x) * u_densityMinAndInvRange.y;
vec4 color = texture2D(u_gradient, vec2(density, 0.5));
gl_FragColor = vec4(color.rgb * color.a, color.a);
}`,"heatmapResolve.vert":`precision highp float;
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
v_uv = a_pos;
gl_Position = vec4(a_pos * 2.0 - 1.0, 1., 1.);
}`}},highlight:{"blur.frag":`varying mediump vec2 v_texcoord;
uniform mediump vec4 u_direction;
uniform mediump mat4 u_channelSelector;
uniform mediump float u_sigma;
uniform sampler2D u_texture;
mediump float gauss1(mediump vec2 dir) {
return exp(-dot(dir, dir) / (2.0 * u_sigma * u_sigma));
}
mediump vec4 selectChannel(mediump vec4 sample) {
return u_channelSelector * sample;
}
void accumGauss1(mediump float i, inout mediump float tot, inout mediump float weight) {
mediump float w = gauss1(i * u_direction.xy);
tot += selectChannel(texture2D(u_texture, v_texcoord + i * u_direction.zw))[3] * w;
weight += w;
}
void main(void) {
mediump float tot = 0.0;
mediump float weight = 0.0;
accumGauss1(-5.0, tot, weight);
accumGauss1(-4.0, tot, weight);
accumGauss1(-3.0, tot, weight);
accumGauss1(-2.0, tot, weight);
accumGauss1(-1.0, tot, weight);
accumGauss1(0.0, tot, weight);
accumGauss1(1.0, tot, weight);
accumGauss1(2.0, tot, weight);
accumGauss1(3.0, tot, weight);
accumGauss1(4.0, tot, weight);
accumGauss1(5.0, tot, weight);
gl_FragColor = vec4(0.0, 0.0, 0.0, tot / weight);
}`,"textured.vert":`attribute mediump vec2 a_position;
attribute mediump vec2 a_texcoord;
varying mediump vec2 v_texcoord;
void main(void) {
gl_Position = vec4(a_position, 0.0, 1.0);
v_texcoord = a_texcoord;
}`,"highlight.frag":`varying mediump vec2 v_texcoord;
uniform sampler2D u_texture;
uniform mediump float u_sigma;
uniform sampler2D u_shade;
uniform mediump vec2 u_minMaxDistance;
mediump float estimateDistance() {
mediump float y = texture2D(u_texture, v_texcoord)[3];
const mediump float y0 = 0.5;
mediump float m0 = 1.0 / (sqrt(2.0 * 3.1415) * u_sigma);
mediump float d = (y - y0) / m0;
return d;
}
mediump vec4 shade(mediump float d) {
mediump float mappedDistance = (d - u_minMaxDistance.x) / (u_minMaxDistance.y - u_minMaxDistance.x);
mappedDistance = clamp(mappedDistance, 0.0, 1.0);
return texture2D(u_shade, vec2(mappedDistance, 0.5));
}
void main(void) {
mediump float d = estimateDistance();
gl_FragColor = shade(d);
}`},materials:{"attributeData.glsl":`uniform highp sampler2D filterFlags;
uniform highp sampler2D animation;
uniform highp sampler2D gpgpu;
uniform highp sampler2D visualVariableData;
uniform highp sampler2D dataDriven0;
uniform highp sampler2D dataDriven1;
uniform highp sampler2D dataDriven2;
uniform float size;
highp vec2 getAttributeDataCoords(in highp vec3 id) {
highp vec3  texel = unpackDisplayIdTexel(id);
highp float u32 = float(int(texel.r) + int(texel.g) * 256 + int(texel.b) * 256 * 256);
highp float col = mod(u32, size);
highp float row = (u32 - col) / size;
highp float u = col / size;
highp float v = row / size;
return vec2(u, v);
}
highp vec2 getAttributeDataTextureCoords(in highp vec3 id) {
return (getAttributeDataCoords(id) * 2.0) - 1.0 + (.5 / vec2(size));
}
highp vec4 getFilterData(in highp vec3 id) {
vec2 coords = getAttributeDataCoords(id);
return texture2D(filterFlags, coords);
}
highp vec4 getAnimation(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(animation, coords);
}
highp vec4 getVisualVariableData(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(visualVariableData, coords);
}
highp vec4 getDataDriven0(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(dataDriven0, coords);
}
highp vec4 getDataDriven1(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(dataDriven1, coords);
}
highp vec4 getGPGPU(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(gpgpu, coords);
}
highp vec4 getDataDriven2(in highp vec3 id) {
highp vec2 coords = getAttributeDataCoords(id);
return texture2D(dataDriven2, coords);
}
float u88VVToFloat(in vec2 v) {
bool isMagic = v.x == 255.0 && v.y == 255.0;
if (isMagic) {
return NAN_MAGIC_NUMBER;
}
return (v.x + v.y * float(0x100)) - 32768.0;
}`,"barycentric.glsl":`float inTriangle(vec3 bary) {
vec3 absBary = abs(bary);
return step((absBary.x + absBary.y + absBary.z), 1.05);
}
vec3 xyToBarycentric(in vec2 pos, in vec2 v0,  in vec2 v1, in vec2 v2) {
mat3 xyToBarycentricMat3 = mat3(
v1.x * v2.y - v2.x * v1.y, v2.x * v0.y - v0.x * v2.y, v0.x * v1.y - v1.x * v0.y,
v1.y - v2.y, v2.y - v0.y, v0.y - v1.y,
v2.x - v1.x, v0.x - v2.x, v1.x - v0.x
);
float A2 = v0.x * (v1.y - v2.y) + v1.x * (v2.y - v0.y) + v2.x * (v0.y - v1.y);
return (1. / A2) * xyToBarycentricMat3 * vec3(1., pos);
}`,fill:{"fill.vert":`#include <materials/symbologyTypeUtils.glsl>
#define PACKED_LINE
precision highp float;
attribute float a_bitset;
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
attribute float a_inverseArea;
vec4 a_color = vec4(0.0, 0.0, 0.0, 1.0);
vec2 a_zoomRange = vec2(0.0, 10000.0);
#else
attribute vec4 a_color;
attribute vec4 a_aux2;
attribute vec4 a_aux3;
#ifndef SYMBOLOGY_TYPE_IS_SIMPLE_LIKE
attribute vec4 a_aux1;
attribute vec2 a_zoomRange;
#else
vec2 a_zoomRange = vec2(0.0, 10000.0);
#endif
#endif
uniform vec2 u_tileOffset;
uniform vec2 u_maxIntNumOfCrossing;
#include <util/encoding.glsl>
#include <materials/vcommon.glsl>
#include <materials/fill/common.glsl>
#include <materials/fill/hittest.glsl>
const float INV_SCALE_COMPRESSION_FACTOR = 1.0 / 128.0;
const float MAX_REPRESENTABLE_INT = 16777216.0;
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
vec4 dotThreshold(vec4 featureAttrOverFeatureArea, float dotValue, float tileDotsOverArea) {
return featureAttrOverFeatureArea * (1.0 / dotValue)  * (1.0 / tileDotsOverArea);
}
#endif
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#include <materials/shared/line/common.glsl>
#include <materials/shared/line/line.vert>
void drawLine(out lowp vec4 out_color, out highp vec3 out_pos) {
LineData outputs = buildLine(
out_pos,
a_id,
a_pos,
a_color,
(a_aux3.xy - 128.) / 16.,
(a_aux3.zw - 128.) / 16.,
0.,
a_aux2.z / 16.,
a_bitset,
vec4(0.),
vec2(0.),
a_aux2.w / 16.
);
v_id      = outputs.id;
v_opacity = outputs.opacity;
v_aux1    = vec4(outputs.lineHalfWidth, outputs.normal, 0.);
out_color = outputs.color;
}
#endif
void drawFill(out lowp vec4 out_color, out highp vec3 out_pos) {
float a_bitSet = a_bitset;
out_color = getColor(a_color, a_bitSet, BITSET_GENERIC_LOCK_COLOR);
v_opacity = getOpacity();
v_id      = norm(a_id);
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
mat3 tileToTileNormalized = mat3(  2. / 512.,  0.,  0.,
0., -2. / 512.,  0.,
-1.,  1.,  1.  );
out_pos   = tileToTileNormalized * vec3((a_pos * FILL_POSITION_PRECISION), 1.);
#else
out_pos   = u_dvsMat3 * vec3(a_pos * FILL_POSITION_PRECISION, 1.);
#endif
#ifdef PATTERN
vec4  a_tlbr   = a_aux1;
float a_width  = a_aux2.x;
float a_height = a_aux2.y;
vec2  a_offset = a_aux2.zw;
vec2  a_scale  = a_aux3.xy;
float a_angle  = a_aux3.z;
if (getBit(a_bitset, BITSET_FILL_HAS_PATTERN_WIDTH_PRECISION_FACTOR) > 0.5) {
a_width *= INV_SCALE_COMPRESSION_FACTOR;
}
if (getBit(a_bitset, BITSET_FILL_HAS_PATTERN_HEIGHT_PRECISION_FACTOR) > 0.5) {
a_height *= INV_SCALE_COMPRESSION_FACTOR;
}
vec2 scale = INV_SCALE_COMPRESSION_FACTOR * a_scale;
float width = u_zoomFactor * a_width * scale.x;
float height = u_zoomFactor * a_height * scale.y;
float angle = C_256_TO_RAD * a_angle;
float sinA = sin(angle);
float cosA = cos(angle);
float dx = 0.0;
float dy = 0.0;
if (getBit(a_bitset, BITSET_FILL_RANDOM_PATTERN_OFFSET) > 0.5) {
float id = rgba2float(vec4(a_id, 0.0));
dx = rand(vec2(id, 0.0));
dy = rand(vec2(0.0, id));
}
mat3 patternMatrix = mat3(cosA / width, sinA / height, 0,
-sinA / width, cosA / height, 0,
dx,            dy,           1);
vec2 patternSize = vec2(a_width, a_height);
vec2 numPatternsPerMaxInt = vec2(MAX_REPRESENTABLE_INT) / patternSize;
vec2 maxIntCrossingOffsetCorrection = patternSize * fract(u_maxIntNumOfCrossing * numPatternsPerMaxInt);
vec2 tileOffset = u_tileOffset + maxIntCrossingOffsetCorrection - 0.5 * patternSize;
tileOffset = vec2(tileOffset.x * cosA - tileOffset.y * sinA, tileOffset.x * sinA + tileOffset.y * cosA);
tileOffset = mod(tileOffset, patternSize);
vec2 symbolOffset = u_zoomFactor * scale * vec2(a_offset - tileOffset) / vec2(width, height);
v_tileTextureCoord = (patternMatrix * vec3(a_pos * FILL_POSITION_PRECISION, 1.0)).xy - symbolOffset;
v_aux1 = a_tlbr / u_mosaicSize.xyxy;
v_sampleAlphaOnly = getBit(a_bitset, BITSET_GENERIC_CONSIDER_ALPHA_ONLY);
if (getBit(a_bitSet, BITSET_FILL_HAS_UNRESOLVED_REPLACEMENT_COLOR) > 0.5) {
#ifdef VV_COLOR
v_sampleAlphaOnly *= (1.0 - float(isNan(VV_ADATA[ATTR_VV_COLOR]))) * (1.0 - getBit(a_bitSet, BITSET_GENERIC_LOCK_COLOR));
#else
v_sampleAlphaOnly = 0.0;
#endif
}
#elif SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
vec4 ddAttributeData0 = getAttributeData2(a_id) * u_isActive[0] * a_inverseArea;
vec4 ddAttributeData1 = getAttributeData3(a_id) * u_isActive[1] * a_inverseArea;
float size = u_tileZoomFactor * 512.0 * 1.0 / u_pixelRatio;
v_dotThresholds[0] = dotThreshold(ddAttributeData0, u_dotValue, u_tileDotsOverArea);
v_dotThresholds[1] = dotThreshold(ddAttributeData1, u_dotValue, u_tileDotsOverArea);
v_dotTextureCoords = (a_pos * FILL_POSITION_PRECISION + 0.5) / size;
#endif
}
#ifdef HITTEST
void draw(out lowp vec4 out_color, out highp vec3 out_pos) {
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
if (getBit(a_bitset, BITSET_TYPE_FILL_OUTLINE) > 0.5) {
out_pos = vec3(0., 0., 2.);
return;
}
#endif
hittestFill(out_color, out_pos);
gl_PointSize = 1.0;
}
#elif defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE)
void draw(out lowp vec4 out_color, out highp vec3 out_pos) {
v_isOutline = getBit(a_bitset, BITSET_TYPE_FILL_OUTLINE);
if (v_isOutline > 0.5) {
drawLine(out_color, out_pos);
} else {
drawFill(out_color, out_pos);
}
}
#else
#define draw drawFill
#endif
void main()
{
INIT;
highp vec3 pos  = vec3(0.);
highp vec4 color  = vec4(0.);
draw(color, pos);
v_color = color;
gl_Position = vec4(clip(v_color, pos, getFilterFlags(), a_zoomRange), 1.0);
}`,"common.glsl":`#include <materials/symbologyTypeUtils.glsl>
#ifdef PATTERN
uniform mediump vec2 u_mosaicSize;
varying mediump float v_sampleAlphaOnly;
#endif
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
uniform lowp vec4 u_isActive[ 2 ];
uniform highp float u_dotValue;
uniform highp float u_tileDotsOverArea;
uniform highp float u_dotTextureDotCount;
uniform mediump float u_tileZoomFactor;
#endif
varying highp vec3 v_id;
varying lowp vec4 v_color;
varying lowp float v_opacity;
varying mediump vec4 v_aux1;
#ifdef PATTERN
varying mediump vec2 v_tileTextureCoord;
#endif
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
varying lowp float v_isOutline;
#endif
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
varying highp vec2 v_dotTextureCoords;
varying highp vec4 v_dotThresholds[ 2 ];
#endif`,"fill.frag":`precision highp float;
#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/fill/common.glsl>
#ifdef PATTERN
uniform lowp sampler2D u_texture;
#endif
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY
uniform mediump mat4 u_dotColors[ 2 ];
uniform sampler2D u_dotTextures[ 2 ];
uniform vec4 u_dotBackgroundColor;
#endif
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#include <materials/shared/line/common.glsl>
#include <materials/shared/line/line.frag>
lowp vec4 drawLine() {
float v_lineWidth = v_aux1.x;
vec2  v_normal    = v_aux1.yz;
LineData inputs = LineData(
v_color,
v_normal,
v_lineWidth,
v_opacity,
v_id
);
return shadeLine(inputs);
}
#endif
lowp vec4 drawFill() {
lowp vec4 out_color = vec4(0.);
#ifdef HITTEST
out_color = v_color;
#elif defined(PATTERN)
mediump vec4 v_tlbr = v_aux1;
mediump vec2 normalizedTextureCoord = mod(v_tileTextureCoord, 1.0);
mediump vec2 samplePos = mix(v_tlbr.xy, v_tlbr.zw, normalizedTextureCoord);
lowp vec4 color = texture2D(u_texture, samplePos);
if (v_sampleAlphaOnly > 0.5) {
color.rgb = vec3(color.a);
}
out_color = v_opacity * v_color * color;
#elif SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_DOT_DENSITY && !defined(HIGHLIGHT)
vec4 textureThresholds0 = texture2D(u_dotTextures[0], v_dotTextureCoords);
vec4 textureThresholds1 = texture2D(u_dotTextures[1], v_dotTextureCoords);
vec4 difference0 = v_dotThresholds[0] - textureThresholds0;
vec4 difference1 = v_dotThresholds[1] - textureThresholds1;
#ifdef DD_DOT_BLENDING
vec4 isPositive0 = step(0.0, difference0);
vec4 isPositive1 = step(0.0, difference1);
float weightSum = dot(isPositive0, difference0) + dot(isPositive1, difference1);
float lessThanEqZero = step(weightSum, 0.0);
float greaterThanZero = 1.0 - lessThanEqZero ;
float divisor = (weightSum + lessThanEqZero);
vec4 weights0 = difference0 * isPositive0 / divisor;
vec4 weights1 = difference1 * isPositive1 / divisor;
vec4 dotColor = u_dotColors[0] * weights0 + u_dotColors[1] * weights1;
vec4 preEffectColor = greaterThanZero * dotColor + lessThanEqZero * u_dotBackgroundColor;
#else
float diffMax = max(max4(difference0), max4(difference1));
float lessThanZero = step(diffMax, 0.0);
float greaterOrEqZero = 1.0 - lessThanZero;
vec4 isMax0 = step(diffMax, difference0);
vec4 isMax1 = step(diffMax, difference1);
vec4 dotColor = u_dotColors[0] * isMax0 + u_dotColors[1] * isMax1;
vec4 preEffectColor = greaterOrEqZero * dotColor + lessThanZero * u_dotBackgroundColor;
#endif
out_color = preEffectColor;
#else
out_color = v_opacity * v_color;
#endif
#ifdef HIGHLIGHT
out_color.a = 1.0;
#endif
return out_color;
}
void main() {
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
if (v_isOutline > 0.5) {
gl_FragColor = drawLine();
} else {
gl_FragColor = drawFill();
}
#else
gl_FragColor = drawFill();
#endif
}`,"hittest.glsl":`#ifdef HITTEST
#include <materials/hittest/common.glsl>
attribute vec2 a_pos1;
attribute vec2 a_pos2;
void hittestFill(
out lowp vec4 out_color,
out highp vec3 out_pos
) {
vec3 pos        = u_viewMat3 * u_tileMat3 * vec3(a_pos  * FILL_POSITION_PRECISION, 1.);
vec3 pos1       = u_viewMat3 * u_tileMat3 * vec3(a_pos1 * FILL_POSITION_PRECISION, 1.);
vec3 pos2       = u_viewMat3 * u_tileMat3 * vec3(a_pos2 * FILL_POSITION_PRECISION, 1.);
float hittestDist = u_hittestDist;
float dist = distPointTriangle(u_hittestPos, pos.xy, pos1.xy, pos2.xy);
out_pos = vec3(getAttributeDataTextureCoords(a_id), 0.0);
if (dist < 0. || dist >= hittestDist) {
out_pos.z += 2.0;
}
out_color = vec4(1. / 255., 0, 0, dist == 0. ? (1. / 255.) : 0.);
}
#endif`},"constants.glsl":`const float C_DEG_TO_RAD = 3.14159265359 / 180.0;
const float C_256_TO_RAD = 3.14159265359 / 128.0;
const float C_RAD_TO_DEG = 180.0 / 3.141592654;
const float POSITION_PRECISION = 1.0 / 8.0;
const float FILL_POSITION_PRECISION = 1.0 / 1.0;
const float SOFT_EDGE_RATIO = 1.0;
const float THIN_LINE_WIDTH_FACTOR = 1.1;
const float THIN_LINE_HALF_WIDTH = 1.0;
const float EXTRUDE_SCALE_PLACEMENT_PADDING = 1.0 / 4.0;
const float OFFSET_PRECISION = 1.0 / 8.0;
const float OUTLINE_SCALE = 1.0 / 5.0;
const float SDF_FONT_SIZE = 24.0;
const float MAX_SDF_DISTANCE = 8.0;
const float PLACEMENT_PADDING = 8.0;
const float EPSILON = 0.00001;
const float EPSILON_HITTEST = 0.05;
const int MAX_FILTER_COUNT = 2;
const int ATTR_VV_SIZE = 0;
const int ATTR_VV_COLOR = 1;
const int ATTR_VV_OPACITY = 2;
const int ATTR_VV_ROTATION = 3;
const highp float NAN_MAGIC_NUMBER = 1e-30;
const int BITSET_GENERIC_LOCK_COLOR = 1;
const int BITSET_GENERIC_CONSIDER_ALPHA_ONLY = 4;
const int BITSET_MARKER_ALIGNMENT_MAP = 0;
const int BITSET_MARKER_OUTLINE_ALLOW_COLOR_OVERRIDE = 2;
const int BITSET_MARKER_SCALE_SYMBOLS_PROPORTIONALLY = 3;
const int BITSET_TYPE_FILL_OUTLINE = 0;
const int BITSET_FILL_RANDOM_PATTERN_OFFSET = 2;
const int BITSET_FILL_HAS_UNRESOLVED_REPLACEMENT_COLOR = 3;
const int BITSET_FILL_HAS_PATTERN_HEIGHT_PRECISION_FACTOR = 5;
const int BITSET_FILL_HAS_PATTERN_WIDTH_PRECISION_FACTOR = 6;
const int BITSET_LINE_SCALE_DASH = 2;`,hittest:{"common.glsl":`#ifdef HITTEST
uniform float hittestDist;
uniform highp vec2 hittestPos;
float projectScalar(vec2 a, vec2 b) {
return dot(a, normalize(b));
}
float distPointSegment(vec2 p0, vec2 p1, vec2 p2) {
vec2 L = p2 - p1;
vec2 A = p0 - p1;
float projAL = projectScalar(A, L);
float t = clamp(projAL / length(L), 0., 1.);
return distance(p0, p1 + t * (p2 - p1));
}
void hittestMarker(out lowp vec4 out_color, out highp vec3 out_pos, in highp vec3 pos, float size) {
float dist = distance(pos, vec3(hittestPos, 1.));
out_pos = vec3(getAttributeDataTextureCoords(a_id), 0.0);
if ((dist - size) > hittestDist) {
out_pos.z += 2.0;
}
out_color = vec4(1. / 255., 0, 0, (dist - size) < 0. ? (1. / 255.) : 0.);
}
float intersectPointTriangleBary(vec2 p, vec2 a, vec2 b, vec2 c) {
return inTriangle(xyToBarycentric(p, a, b, c));
}
float distPointTriangle(vec2 p, vec2 a, vec2 b, vec2 c) {
vec2 ba = b - a;
vec2 ca = c - a;
float crossProduct = ba.x * ca.y - ca.x * ba.y;
bool isParallel = crossProduct < EPSILON_HITTEST && crossProduct > -EPSILON_HITTEST;
if (isParallel) {
return -1.;
}
if (intersectPointTriangleBary(p.xy, a, b, c) == 1.) {
return 0.;
}
float distAB = distPointSegment(p, a, b);
float distBC = distPointSegment(p, b, c);
float distCA = distPointSegment(p, c, a);
return min(min(distAB, distBC), distCA);
}
#endif`},icon:{heatmapAccumulate:{"common.glsl":`varying lowp vec4 v_hittestResult;
varying mediump vec2 v_offsetFromCenter;
varying highp float v_fieldValue;`,"heatmapAccumulate.frag":`precision mediump float;
#include <materials/icon/heatmapAccumulate/common.glsl>
#ifdef HEATMAP_PRECISION_HALF_FLOAT
#define COMPRESSION_FACTOR 0.25
#else
#define COMPRESSION_FACTOR 1.0
#endif
uniform lowp sampler2D u_texture;
void main() {
#ifdef HITTEST
gl_FragColor = v_hittestResult;
#else
float radius = length(v_offsetFromCenter);
float shapeWeight = step(radius, 1.0);
float oneMinusRadiusSquared = 1.0 - radius * radius;
float kernelWeight = oneMinusRadiusSquared * oneMinusRadiusSquared;
gl_FragColor = vec4(shapeWeight * kernelWeight * v_fieldValue * COMPRESSION_FACTOR);
#endif
}`,"heatmapAccumulate.vert":`precision highp float;
attribute vec2 a_vertexOffset;
vec4 a_color = vec4(0.0);
vec2 a_zoomRange = vec2(0.0, 10000.0);
uniform float u_radius;
uniform float u_isFieldActive;
#include <materials/vcommon.glsl>
#include <materials/hittest/common.glsl>
#include <materials/icon/heatmapAccumulate/common.glsl>
void main() {
float filterFlags = getFilterFlags();
#ifdef HITTEST
highp vec4 out_hittestResult = vec4(0.);
highp vec3 out_pos = vec3(0.);
vec3 pos = u_viewMat3 * u_tileMat3 * vec3(a_pos * POSITION_PRECISION, 1.0);
hittestMarker(out_hittestResult, out_pos, pos, u_radius);
v_hittestResult = out_hittestResult;
gl_PointSize = 1.;
gl_Position = vec4(clip(a_color, out_pos, filterFlags, a_zoomRange), 1.0);
#else
v_offsetFromCenter = sign(a_vertexOffset);
v_fieldValue = getAttributeData2(a_id).x * u_isFieldActive + 1.0 - u_isFieldActive;
vec3 centerPos = u_dvsMat3 * vec3(a_pos * POSITION_PRECISION, 1.0);
vec3 vertexPos = centerPos + u_displayViewMat3 * vec3(v_offsetFromCenter, 0.0) * u_radius;
gl_Position = vec4(clip(a_color, vertexPos, filterFlags, a_zoomRange), 1.0);
#endif
}`},"common.glsl":`#include <util/encoding.glsl>
uniform lowp vec2 u_mosaicSize;
varying lowp vec4 v_color;
varying highp vec3 v_id;
varying highp vec4 v_sizeTex;
varying mediump vec3 v_pos;
varying lowp float v_opacity;
uniform lowp sampler2D u_texture;
#ifdef SDF
varying lowp vec4 v_outlineColor;
varying mediump float v_outlineWidth;
varying mediump float v_distRatio;
varying mediump float v_overridingOutlineColor;
varying mediump float v_isThin;
#endif
#ifdef SDF
vec4 getColor(vec2 v_size, vec2 v_tex) {
#ifdef HITTEST
lowp vec4 fillPixelColor = vec4(1.0);
#else
lowp vec4 fillPixelColor = v_color;
#endif
float d = 0.5 - rgba2float(texture2D(u_texture, v_tex));
float size = max(v_size.x, v_size.y);
float dist = d * size * SOFT_EDGE_RATIO * v_distRatio;
fillPixelColor *= clamp(0.5 - dist, 0.0, 1.0);
float outlineWidth = v_outlineWidth;
#ifdef HIGHLIGHT
outlineWidth = max(outlineWidth, 4.0 * v_isThin);
#endif
if (outlineWidth > 0.25) {
lowp vec4 outlinePixelColor = v_overridingOutlineColor * v_color + (1.0 - v_overridingOutlineColor) * v_outlineColor;
float clampedOutlineSize = min(outlineWidth, size);
outlinePixelColor *= clamp(0.5 - abs(dist) + clampedOutlineSize * 0.5, 0.0, 1.0);
return v_opacity * ((1.0 - outlinePixelColor.a) * fillPixelColor + outlinePixelColor);
}
return v_opacity * fillPixelColor;
}
#else
vec4 getColor(vec2 _v_size, vec2 v_tex) {
lowp vec4 texColor = texture2D(u_texture, v_tex);
return v_opacity * texColor * v_color;
}
#endif`,"icon.frag":`precision mediump float;
#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/icon/common.glsl>
void main()
{
#ifdef HITTEST
vec4 color = v_color;
#else
vec4 color = getColor(v_sizeTex.xy, v_sizeTex.zw);
#endif
#ifdef HIGHLIGHT
color.a = step(1.0 / 255.0, color.a);
#endif
gl_FragColor = color;
}`,"hittest.glsl":`#ifdef HITTEST
#include <materials/hittest/common.glsl>
attribute vec2 a_vertexOffset1;
attribute vec2 a_vertexOffset2;
attribute vec2 a_texCoords1;
attribute vec2 a_texCoords2;
vec2 getTextureCoords(in vec3 bary, in vec2 texCoords0, in vec2 texCoords1, in vec2 texCoords2) {
return texCoords0 * bary.x + texCoords1 * bary.y + texCoords2 * bary.z;
}
void hittestIcon(
inout lowp vec4 out_color,
out highp vec3 out_pos,
in vec3 pos,
in vec3 offset,
in vec2 size,
in float scaleFactor,
in float isMapAligned
) {
out_pos = vec3(getAttributeDataTextureCoords(a_id), 0.0);
vec3 posBase = u_viewMat3 * u_tileMat3  * pos;
vec3 offset1 = scaleFactor * vec3(a_vertexOffset1 / 16.0, 0.);
vec3 offset2 = scaleFactor * vec3(a_vertexOffset2 / 16.0, 0.);
vec2 pos0    = (posBase + getMatrixNoDisplay(isMapAligned) * offset).xy;
vec2 pos1    = (posBase + getMatrixNoDisplay(isMapAligned) * offset1).xy;
vec2 pos2    = (posBase + getMatrixNoDisplay(isMapAligned) * offset2).xy;
vec3 bary0 = xyToBarycentric(u_hittestPos + vec2(-u_hittestDist, -u_hittestDist), pos0, pos1, pos2);
vec3 bary1 = xyToBarycentric(u_hittestPos + vec2(0., -u_hittestDist), pos0, pos1, pos2);
vec3 bary2 = xyToBarycentric(u_hittestPos + vec2(u_hittestDist, -u_hittestDist), pos0, pos1, pos2);
vec3 bary3 = xyToBarycentric(u_hittestPos + vec2(-u_hittestDist, 0.), pos0, pos1, pos2);
vec3 bary4 = xyToBarycentric(u_hittestPos, pos0, pos1, pos2);
vec3 bary5 = xyToBarycentric(u_hittestPos + vec2(u_hittestDist, 0.), pos0, pos1, pos2);
vec3 bary6 = xyToBarycentric(u_hittestPos + vec2(-u_hittestDist, u_hittestDist), pos0, pos1, pos2);
vec3 bary7 = xyToBarycentric(u_hittestPos + vec2(0., u_hittestDist), pos0, pos1, pos2);
vec3 bary8 = xyToBarycentric(u_hittestPos + vec2(u_hittestDist, u_hittestDist), pos0, pos1, pos2);
vec2 tex0 = a_texCoords  / u_mosaicSize;
vec2 tex1 = a_texCoords1 / u_mosaicSize;
vec2 tex2 = a_texCoords2 / u_mosaicSize;
float alphaSum = 0.;
alphaSum += inTriangle(bary0) * getColor(size, getTextureCoords(bary0, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary1) * getColor(size, getTextureCoords(bary1, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary2) * getColor(size, getTextureCoords(bary2, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary3) * getColor(size, getTextureCoords(bary3, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary4) * getColor(size, getTextureCoords(bary4, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary5) * getColor(size, getTextureCoords(bary5, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary6) * getColor(size, getTextureCoords(bary6, tex0, tex1, tex2)).a;
alphaSum += inTriangle(bary7) * getColor(size, getTextureCoords(bary7, tex0, tex1, tex2)).a;
out_pos.z += step(alphaSum, .05) * 2.0;
out_color = vec4(1. / 255., 0., 0., alphaSum / 255.);
}
#endif`,"icon.vert":`precision highp float;
attribute vec4 a_color;
attribute vec4 a_outlineColor;
attribute vec4 a_sizeAndOutlineWidth;
attribute vec2 a_vertexOffset;
attribute vec2 a_texCoords;
attribute vec2 a_bitSetAndDistRatio;
attribute vec2 a_zoomRange;
#include <materials/vcommon.glsl>
#include <materials/icon/common.glsl>
#include <materials/icon/hittest.glsl>
float getMarkerScaleFactor(inout vec2 size, in float referenceSize) {
#ifdef VV_SIZE
float f = getSize(size.y) / size.y;
float sizeFactor = size.y / referenceSize;
return getSize(referenceSize) / referenceSize;
#else
return 1.;
#endif
}
void main()
{
INIT;
float a_bitSet = a_bitSetAndDistRatio.x;
vec3  pos           = vec3(a_pos * POSITION_PRECISION, 1.0);
vec2  size          = a_sizeAndOutlineWidth.xy * a_sizeAndOutlineWidth.xy / 128.0;
vec3  offset        = vec3(a_vertexOffset / 16.0, 0.);
float outlineSize   = a_sizeAndOutlineWidth.z * a_sizeAndOutlineWidth.z / 128.0;
float isMapAligned  = getBit(a_bitSet, BITSET_MARKER_ALIGNMENT_MAP);
float referenceSize = a_sizeAndOutlineWidth.w * a_sizeAndOutlineWidth.w / 128.0;
float scaleSymbolProportionally = getBit(a_bitSet, BITSET_MARKER_SCALE_SYMBOLS_PROPORTIONALLY);
float scaleFactor               = getMarkerScaleFactor(size, referenceSize);
size.xy     *= scaleFactor;
offset.xy   *= scaleFactor;
outlineSize *= scaleSymbolProportionally * (scaleFactor - 1.0) + 1.0;
vec2 v_tex   = a_texCoords / u_mosaicSize;
float filterFlags = getFilterFlags();
v_color    = getColor(a_color, a_bitSet, BITSET_GENERIC_LOCK_COLOR);
v_opacity  = getOpacity();
v_id       = norm(a_id);
v_pos      = u_dvsMat3 * pos + getMatrix(isMapAligned) * getRotation()  * offset;
v_sizeTex  = vec4(size.xy, v_tex.xy);
#ifdef SDF
v_isThin   = getBit(a_bitSet, BITSET_MARKER_OUTLINE_ALLOW_COLOR_OVERRIDE);
#ifdef VV_COLOR
v_overridingOutlineColor = v_isThin;
#else
v_overridingOutlineColor = 0.0;
#endif
v_outlineWidth = min(outlineSize, max(max(size.x, size.y) - 0.99, 0.0));
v_outlineColor = a_outlineColor;
v_distRatio = a_bitSetAndDistRatio.y / 128.0;
#endif
#ifdef HITTEST
highp vec4 out_color = vec4(0.);
highp vec3 out_pos   = vec3(0.);
hittestIcon(out_color, out_pos, pos, offset, size, scaleFactor, isMapAligned);
v_color = out_color;
gl_PointSize = 1.;
gl_Position = vec4(clip(v_color, out_pos, filterFlags, a_zoomRange), 1.0);
#else
gl_Position = vec4(clip(v_color, v_pos, filterFlags, a_zoomRange), 1.0);
#endif
}`},label:{"common.glsl":`uniform mediump float u_zoomLevel;
uniform mediump float u_mapRotation;
uniform mediump float u_mapAligned;
uniform mediump vec2 u_mosaicSize;
varying mediump float v_antialiasingWidth;
varying mediump float v_edgeDistanceOffset;
varying mediump vec2 v_tex;
varying mediump vec4 v_color;
varying lowp vec4 v_animation;`,"label.frag":"#include <materials/text/text.frag>","label.vert":`precision highp float;
#include <materials/vcommon.glsl>
#include <materials/text/common.glsl>
attribute vec4 a_color;
attribute vec4 a_haloColor;
attribute vec4 a_texAndSize;
attribute vec4 a_refSymbolAndPlacementOffset;
attribute vec4 a_glyphData;
attribute vec2 a_vertexOffset;
attribute vec2 a_texCoords;
uniform float u_isHaloPass;
uniform float u_isBackgroundPass;
uniform float u_mapRotation;
uniform float u_mapAligned;
float getZ(in float minZoom, in float maxZoom, in float angle) {
float glyphAngle = angle * 360.0 / 254.0;
float mapAngle = u_mapRotation * 360.0 / 254.0;
float diffAngle = min(360.0 - abs(mapAngle - glyphAngle), abs(mapAngle - glyphAngle));
float z = 0.0;
z += u_mapAligned * (2.0 * (1.0 - step(minZoom, u_currentZoom)));
z += u_mapAligned * 2.0 * step(90.0, diffAngle);
z += 2.0 * (1.0 - step(u_currentZoom, maxZoom));
return z;
}
void main()
{
INIT;
float groupMinZoom    = getMinZoom();
float glyphMinZoom    = a_glyphData.x;
float glyphMaxZoom    = a_glyphData.y;
float glyphAngle      = a_glyphData.z;
float a_isBackground  = a_glyphData.w;
float a_minZoom          = max(groupMinZoom, glyphMinZoom);
float a_placementPadding = a_refSymbolAndPlacementOffset.x * EXTRUDE_SCALE_PLACEMENT_PADDING;
vec2  a_placementDir     = unpack_u8_nf32(a_refSymbolAndPlacementOffset.zw);
float a_refSymbolSize    = a_refSymbolAndPlacementOffset.y;
float fontSize           = a_texAndSize.z;
float haloSize           = a_texAndSize.w * OUTLINE_SCALE;
vec2  vertexOffset = a_vertexOffset * OFFSET_PRECISION;
vec3  pos          = vec3(a_pos * POSITION_PRECISION, 1.0);
float z            = getZ(a_minZoom, glyphMaxZoom, glyphAngle);
float fontScale    = fontSize / SDF_FONT_SIZE;
float halfSize     = getSize(a_refSymbolSize) / 2.0;
float animation    = pow(getAnimationState(), vec4(2.0)).r;
float isText = 1.0 - a_isBackground;
float isBackground = u_isBackgroundPass * a_isBackground;
vec4  nonHaloColor = (isBackground + isText) * a_color;
v_color     = animation * ((1.0 - u_isHaloPass) * nonHaloColor + (u_isHaloPass * a_haloColor));
v_opacity   = 1.0;
v_tex       = a_texCoords / u_mosaicSize;
v_edgeDistanceOffset = u_isHaloPass * haloSize / fontScale / MAX_SDF_DISTANCE;
v_antialiasingWidth  = 0.105 * SDF_FONT_SIZE / fontSize / u_pixelRatio;
vec2 placementOffset = a_placementDir * (halfSize + a_placementPadding);
vec3 glyphOffset     = u_displayMat3 * vec3(vertexOffset + placementOffset, 0.0);
vec3 v_pos           = vec3((u_dvsMat3 * pos + glyphOffset).xy, z);
float isHidden = u_isBackgroundPass * isText + (1.0 - u_isBackgroundPass) * a_isBackground;
v_pos.z += 2.0 * isHidden;
gl_Position = vec4(v_pos, 1.0);
#ifdef DEBUG
v_color = vec4(a_color.rgb, z == 0.0 ? 1.0 : 0.645);
#endif
}`},line:{"common.glsl":`varying lowp vec4 v_color;
varying highp vec3 v_id;
varying mediump vec2 v_normal;
varying mediump float v_lineHalfWidth;
varying lowp float v_opacity;
#ifdef PATTERN
varying mediump vec4 v_tlbr;
varying mediump vec2 v_patternSize;
#endif
#if defined(PATTERN) || defined(SDF)
varying highp float v_accumulatedDistance;
#endif
#ifdef SDF
varying mediump float v_lineWidthRatio;
#endif`,"hittest.glsl":`#include <materials/hittest/common.glsl>
#ifdef HITTEST
attribute vec2 a_pos1;
attribute vec2 a_pos2;
void hittestLine(out lowp vec4 out_color, out highp vec3 out_pos, float halfWidth) {
vec3 pos        = u_viewMat3 * u_tileMat3 * vec3(a_pos  * POSITION_PRECISION, 1.);
vec3 pos1       = u_viewMat3 * u_tileMat3 * vec3(a_pos1 * POSITION_PRECISION, 1.);
vec3 pos2       = u_viewMat3 * u_tileMat3 * vec3(a_pos2 * POSITION_PRECISION, 1.);
vec3 outTextureCoords = vec3(getAttributeDataTextureCoords(a_id), 0.0);
float dist = min(distPointSegment(u_hittestPos, pos.xy, pos1.xy),
distPointSegment(u_hittestPos, pos.xy, pos2.xy)) - halfWidth;
out_pos = vec3(getAttributeDataTextureCoords(a_id), 0.0);
if (dist >= u_hittestDist) {
out_pos.z += 2.0;
}
out_color = vec4(1. / 255., 0, 0, dist <= 0. ? (1. / 255.) : 0.);
}
#endif`,"line.frag":`precision lowp float;
#include <util/encoding.glsl>
#include <materials/constants.glsl>
#include <materials/symbologyTypeUtils.glsl>
#include <materials/line/common.glsl>
#include <materials/shared/line/common.glsl>
#include <materials/shared/line/line.frag>
#ifdef HITTEST
void main() {
gl_FragColor = v_color;
}
#else
void main() {
LineData inputs = LineData(
v_color,
v_normal,
v_lineHalfWidth,
v_opacity,
#ifndef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#ifdef PATTERN
v_tlbr,
v_patternSize,
#endif
#ifdef SDF
v_lineWidthRatio,
#endif
#if defined(PATTERN) || defined(SDF)
v_accumulatedDistance,
#endif
#endif
v_id
);
gl_FragColor = shadeLine(inputs);
}
#endif`,"line.vert":`precision highp float;
attribute vec4 a_color;
attribute vec4 a_offsetAndNormal;
attribute vec2 a_accumulatedDistanceAndHalfWidth;
attribute vec4 a_tlbr;
attribute vec4 a_segmentDirection;
attribute vec2 a_aux;
attribute vec2 a_zoomRange;
#include <materials/vcommon.glsl>
#include <materials/symbologyTypeUtils.glsl>
#include <materials/line/common.glsl>
#include <materials/line/hittest.glsl>
#include <materials/shared/line/common.glsl>
#include <materials/shared/line/line.vert>
#ifdef HITTEST
void draw() {
float aa        = 0.5 * u_antialiasing;
float a_halfWidth = a_accumulatedDistanceAndHalfWidth.y / 16.;
float a_cimHalfWidth = a_aux.x / 16. ;
vec2  a_offset = a_offsetAndNormal.xy / 16.;
float baseWidth = getBaseLineHalfWidth(a_halfWidth, a_cimHalfWidth);
float halfWidth = getLineHalfWidth(baseWidth, aa);
highp vec3 pos  = vec3(0.);
v_color = vec4(0.);
hittestLine(v_color, pos, halfWidth);
gl_PointSize = 1.;
gl_Position = vec4(clip(v_color, pos, getFilterFlags(), a_zoomRange), 1.0);
}
#else
void draw()
{
highp vec3 pos = vec3(0.);
LineData outputs = buildLine(
pos,
a_id,
a_pos,
a_color,
a_offsetAndNormal.xy / 16.,
a_offsetAndNormal.zw / 16.,
a_accumulatedDistanceAndHalfWidth.x,
a_accumulatedDistanceAndHalfWidth.y / 16.,
a_segmentDirection.w,
a_tlbr,
a_segmentDirection.xy / 16.,
a_aux.x / 16.
);
v_id              = outputs.id;
v_color           = outputs.color;
v_normal          = outputs.normal;
v_lineHalfWidth   = outputs.lineHalfWidth;
v_opacity         = outputs.opacity;
#ifndef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#ifdef PATTERN
v_tlbr          = outputs.tlbr;
v_patternSize   = outputs.patternSize;
#endif
#ifdef SDF
v_lineWidthRatio = outputs.lineWidthRatio;
#endif
#if defined(PATTERN) || defined(SDF)
v_accumulatedDistance = outputs.accumulatedDistance;
#endif
#endif
gl_Position = vec4(clip(outputs.color, pos, getFilterFlags(), a_zoomRange), 1.0);
}
#endif
void main() {
INIT;
draw();
}`},pie:{"pie.common.glsl":`uniform float outlineWidth;
uniform mediump float sectorThreshold;
varying vec3  v_id;
varying vec3  v_pos;
varying vec2  v_offset;
varying vec4  v_color;
varying float v_size;
varying float v_numOfEntries;
varying float v_maxSectorAngle;
varying vec2  v_filteredSectorToColorId[numberOfFields];
varying vec2  v_texCoords;
varying float v_outlineWidth;
varying float v_opacity;
struct FilteredChartInfo {
float endSectorAngle;
int colorId;
};`,"pie.frag":`precision highp float;
#include <util/atan2.glsl>
#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/pie/pie.common.glsl>
uniform lowp vec4 colors[numberOfFields];
uniform lowp vec4 defaultColor;
uniform lowp vec4 othersColor;
uniform lowp vec4 outlineColor;
uniform float donutRatio;
lowp vec4 getSectorColor(in int index, in vec2 filteredSectorToColorId[numberOfFields]) {
mediump int colorIndex = int(filteredSectorToColorId[index].y);
return colors[colorIndex];
}
const int OTHER_SECTOR_ID = 255;
#ifdef HITTEST
vec4 getColor() {
float distanceSize = length(v_offset) * v_size;
float donutSize = donutRatio * v_size;
float alpha = step(donutSize, distanceSize) * (1.0 - step(v_size, distanceSize));
return v_color;
}
#else
vec4 getColor() {
float angle = mod(90.0 - C_RAD_TO_DEG * atan2(v_offset.y, v_offset.x), 360.0);
int numOfEntries = int(v_numOfEntries);
float maxSectorAngle = v_maxSectorAngle;
lowp vec4 fillColor = (maxSectorAngle > 0.0 || sectorThreshold > 0.0) ? othersColor : defaultColor;
lowp vec4 prevColor = vec4(0.0);
lowp vec4 nextColor = vec4(0.0);
float startSectorAngle = 0.0;
float endSectorAngle = 0.0;
if (angle < maxSectorAngle) {
for (int index = 0; index < numberOfFields; ++index) {
startSectorAngle = endSectorAngle;
endSectorAngle = v_filteredSectorToColorId[index].x;
if (endSectorAngle > angle) {
fillColor = getSectorColor(index, v_filteredSectorToColorId);
prevColor = sectorThreshold != 0.0 && index == 0 && maxSectorAngle + EPSILON < 360. ? othersColor :
getSectorColor(index > 0 ? index - 1 : numOfEntries - 1, v_filteredSectorToColorId);
nextColor = sectorThreshold != 0.0 && abs(endSectorAngle - maxSectorAngle) < EPSILON && maxSectorAngle + EPSILON < 360. ? othersColor :
getSectorColor(index < numOfEntries - 1 ? index + 1 : 0, v_filteredSectorToColorId);
break;
}
if (index == numOfEntries - 1) {
break;
}
}
} else if (numOfEntries <= 0) {
prevColor = nextColor = fillColor;
} else {
prevColor = getSectorColor(numOfEntries - 1, v_filteredSectorToColorId);
nextColor = getSectorColor(0, v_filteredSectorToColorId);
startSectorAngle = maxSectorAngle;
endSectorAngle = 360.0;
}
lowp vec4 outlineColor = outlineColor;
float offset = length(v_offset);
float distanceSize = offset * v_size;
float distanceToStartSector = (angle - startSectorAngle);
float distanceToEndSector = (endSectorAngle - angle);
float sectorThreshold = 0.75;
float beginSectorAlpha = smoothstep(-sectorThreshold, sectorThreshold, distanceToStartSector * offset);
float endSectorAlpha = smoothstep(-sectorThreshold, sectorThreshold, distanceToEndSector * offset);
fillColor = mix(prevColor, fillColor, beginSectorAlpha) + mix(nextColor, fillColor, endSectorAlpha) - fillColor;
float aaThreshold = 0.75;
float startOfOutline = v_size - v_outlineWidth - aaThreshold;
float donutSize = donutRatio * startOfOutline;
float endOfDonut = donutSize - v_outlineWidth;
float innerCircleAlpha = endOfDonut > aaThreshold ? smoothstep(endOfDonut - aaThreshold, endOfDonut + aaThreshold, distanceSize) : 1.0;
float outerCircleAlpha = 1.0 - smoothstep(v_size - 2.0 * aaThreshold, v_size, distanceSize);
float circleAlpha = innerCircleAlpha * outerCircleAlpha;
if (startOfOutline > 0.0 && v_outlineWidth > 0.25) {
float outlineFactor = smoothstep(startOfOutline - aaThreshold, startOfOutline + aaThreshold, distanceSize);
float innerLineFactor = donutSize - aaThreshold > 0.0 ? 1.0 - smoothstep(donutSize - aaThreshold, donutSize + aaThreshold , distanceSize) : 0.0;
fillColor = mix(fillColor, outlineColor, innerLineFactor + outlineFactor);
}
return v_opacity * circleAlpha * fillColor;
}
#endif
void main()
{
vec4 color = getColor();
#ifdef highlight
color.a = step(1.0 / 255.0, color.a);
#endif
gl_FragColor = color;
}`,"pie.vert":`#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/barycentric.glsl>
#include <materials/vcommon.glsl>
#include <materials/vv.glsl>
#include <materials/attributeData.glsl>
#include <materials/pie/pie.common.glsl>
#include <materials/hittest/common.glsl>
attribute float a_bitSet;
attribute vec2  a_offset;
attribute vec2  a_texCoords;
attribute float a_referenceSize;
attribute vec2  a_zoomRange;
int filterValue(in float sectorAngle,
in int currentIndex,
inout FilteredChartInfo filteredInfo,
inout vec2 filteredSectorToColorId[numberOfFields]) {
if (sectorAngle > sectorThreshold * 360.0) {
filteredInfo.endSectorAngle += sectorAngle;
filteredSectorToColorId[filteredInfo.colorId] = vec2(filteredInfo.endSectorAngle, currentIndex);
++filteredInfo.colorId;
}
return 0;
}
int filterValues(inout vec2 filteredSectorToColorId[numberOfFields],
inout FilteredChartInfo filteredInfo,
in float sectorAngles[numberOfFields]) {
for (int index = 0; index < numberOfFields; ++index) {
float sectorValue = sectorAngles[index];
filterValue(sectorValue, index, filteredInfo, filteredSectorToColorId);
}
return filteredInfo.colorId;
}
float getMarkerSize(inout vec2 offset, inout float outlineSize, in float referenceSize, in float bitSet) {
float outSize = referenceSize * 0.5;
#ifdef VV_SIZE
float r = getSize(referenceSize, currentScale) / referenceSize;
outSize *= r;
offset.xy *= r;
float scaleSymbolProportionally = getBit(bitSet, BITSET_MARKER_SCALE_SYMBOLS_PROPORTIONALLY);
outlineSize *= scaleSymbolProportionally * (r - 1.0) + 1.0;
#endif
return outSize;
}
vec3 getOffset(in vec2 in_offset, float a_bitSet) {
float isMapAligned = getBit(a_bitSet, BITSET_MARKER_ALIGNMENT_MAP);
vec3  offset       = vec3(in_offset, 0.0);
return getMatrix(isMapAligned) * offset;
}
float filterNaNValues(in float value) {
return value != NAN_MAGIC_NUMBER && value > 0.0 ? value : 0.0;
}
void main()
{
INIT;
vec2  a_offset = a_offset / 16.0;
float outlineSize = outlineWidth;
float a_bitSet = a_bitSet;
float a_referenceSize = a_referenceSize;
vec2 a_texCoords = a_texCoords / 4.0;
float markerSize = getMarkerSize(a_offset, outlineSize, a_referenceSize, a_bitSet);
float filterFlags = getFilterFlags();
vec3  pos         = vec3(a_pos / 10.0, 1.0);
v_opacity      = getOpacity();
v_pos          = displayViewScreenMat3 * pos + getOffset(a_offset, a_bitSet);
v_offset       = sign(a_texCoords - 0.5);
v_size         = markerSize;
v_outlineWidth = outlineSize;
float attributeData[10];
vec4 attributeData3 = getDataDriven0(a_id);
attributeData[0] = filterNaNValues(attributeData3.x);
attributeData[1] = filterNaNValues(attributeData3.y);
attributeData[2] = filterNaNValues(attributeData3.z);
attributeData[3] = filterNaNValues(attributeData3.w);
#if (numberOfFields > 4)
vec4 attributeData4 = getDataDriven1(a_id);
attributeData[4] = filterNaNValues(attributeData4.x);
attributeData[5] = filterNaNValues(attributeData4.y);
attributeData[6] = filterNaNValues(attributeData4.z);
attributeData[7] = filterNaNValues(attributeData4.w);
#endif
#if (numberOfFields > 8)
vec4 attributeData5 = getDataDriven2(a_id);
attributeData[8] = filterNaNValues(attributeData5.x);
attributeData[9] = filterNaNValues(attributeData5.y);
#endif
float sum = 0.0;
for (int i = 0; i < numberOfFields; ++i) {
sum += attributeData[i];
}
float sectorAngles[numberOfFields];
for (int i = 0; i < numberOfFields; ++i) {
sectorAngles[i] = 360.0 * attributeData[i] / sum;
}
vec2 filteredSectorToColorId[numberOfFields];
FilteredChartInfo filteredInfo = FilteredChartInfo(0.0, 0);
int numOfEntries = filterValues(filteredSectorToColorId, filteredInfo, sectorAngles);
v_numOfEntries = float(numOfEntries);
v_maxSectorAngle = filteredInfo.endSectorAngle;
v_filteredSectorToColorId = filteredSectorToColorId;
#ifdef HITTEST
highp vec3 out_pos = vec3(0.0);
v_color            = vec4(0.0);
hittestMarker(v_color, out_pos, viewMat3 * tileMat3 *  pos, v_size);
gl_PointSize = 1.0;
gl_Position = vec4(clip(v_color, out_pos, filterFlags, a_zoomRange), 1.0);
#else
gl_Position = vec4(clip(v_color, v_pos, filterFlags, a_zoomRange), 1.0);
#endif
}`},shared:{line:{"common.glsl":`#if !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE) && defined(PATTERN)
uniform mediump vec2 u_mosaicSize;
varying mediump float v_sampleAlphaOnly;
#endif
struct LineData {
lowp vec4 color;
mediump vec2 normal;
mediump float lineHalfWidth;
lowp float opacity;
#ifndef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#ifdef PATTERN
mediump vec4 tlbr;
mediump vec2 patternSize;
#endif
#ifdef SDF
mediump float lineWidthRatio;
#endif
#if defined(PATTERN) || defined(SDF)
highp float accumulatedDistance;
#endif
#endif
highp vec3 id;
};`,"line.frag":`uniform lowp float u_blur;
#if !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE) && !defined(HIGHLIGHT)
#if defined(PATTERN) || defined(SDF)
uniform sampler2D u_texture;
uniform highp float u_pixelRatio;
#endif
#endif
#if defined(SDF) && !defined(HIGHLIGHT) && !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE)
lowp vec4 getLineColor(LineData line) {
mediump float adjustedPatternWidth = line.patternSize.x * 2.0 * line.lineWidthRatio;
mediump float relativeTexX = fract(line.accumulatedDistance / adjustedPatternWidth);
mediump float relativeTexY = 0.5 + 0.25 * line.normal.y;
mediump vec2 texCoord = mix(line.tlbr.xy, line.tlbr.zw, vec2(relativeTexX, relativeTexY));
mediump float d = rgba2float(texture2D(u_texture, texCoord)) - 0.5;
float dist = d * line.lineHalfWidth;
return line.opacity * clamp(0.5 - dist, 0.0, 1.0) * line.color;
}
#elif defined(PATTERN) && !defined(HIGHLIGHT) && !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE)
lowp vec4 getLineColor(LineData line) {
mediump float lineHalfWidth = line.lineHalfWidth;
mediump float adjustedPatternHeight = line.patternSize.y * 2.0 * lineHalfWidth / line.patternSize.x;
mediump float relativeTexY = fract(line.accumulatedDistance / adjustedPatternHeight);
mediump float relativeTexX = 0.5 + 0.5 * line.normal.y;
mediump vec2 texCoord = mix(line.tlbr.xy, line.tlbr.zw, vec2(relativeTexX, relativeTexY));
lowp vec4 color = texture2D(u_texture, texCoord);
#ifdef VV_COLOR
if (v_sampleAlphaOnly > 0.5) {
color.rgb = vec3(color.a);
}
#endif
return line.opacity * line.color * color;
}
#else
lowp vec4 getLineColor(LineData line) {
return line.opacity * line.color;
}
#endif
vec4 shadeLine(LineData line)
{
mediump float thinLineFactor = max(THIN_LINE_WIDTH_FACTOR * step(line.lineHalfWidth, THIN_LINE_HALF_WIDTH), 1.0);
mediump float fragDist = length(line.normal) * line.lineHalfWidth;
lowp float alpha = clamp(thinLineFactor * (line.lineHalfWidth - fragDist) / (u_blur + thinLineFactor - 1.0), 0.0, 1.0);
lowp vec4 out_color = getLineColor(line) * alpha;
#ifdef HIGHLIGHT
out_color.a = step(1.0 / 255.0, out_color.a);
#endif
#ifdef ID
if (out_color.a < 1.0 / 255.0) {
discard;
}
out_color = vec4(line.id, 0.0);
#endif
return out_color;
}`,"line.vert":`float getBaseLineHalfWidth(in float lineHalfWidth, in float referenceHalfWidth) {
#ifdef VV_SIZE
float refLineWidth = 2.0 * referenceHalfWidth;
return 0.5 * (lineHalfWidth / max(referenceHalfWidth, EPSILON)) * getSize(refLineWidth);
#else
return lineHalfWidth;
#endif
}
float getLineHalfWidth(in float baseWidth, in float aa) {
float halfWidth = max(baseWidth + aa, 0.45) + 0.1 * aa;
#ifdef HIGHLIGHT
halfWidth = max(halfWidth, 2.0);
#endif
return halfWidth;
}
vec2 getDist(in vec2 offset, in float halfWidth) {
float thinLineFactor = max(THIN_LINE_WIDTH_FACTOR * step(halfWidth, THIN_LINE_HALF_WIDTH), 1.0);
return thinLineFactor * halfWidth * offset;
}
LineData buildLine(
out vec3 out_pos,
in vec3 in_id,
in vec2 in_pos,
in vec4 in_color,
in vec2 in_offset,
in vec2 in_normal,
in float in_accumulatedDist,
in float in_lineHalfWidth,
in float in_bitSet,
in vec4 in_tlbr,
in vec2 in_segmentDirection,
in float in_referenceHalfWidth
)
{
float aa        = 0.5 * u_antialiasing;
float baseWidth = getBaseLineHalfWidth(in_lineHalfWidth, in_referenceHalfWidth);
float halfWidth = getLineHalfWidth(baseWidth, aa);
float z         = 2.0 * step(baseWidth, 0.0);
vec2  dist      = getDist(in_offset, halfWidth);
vec3  offset    = u_displayViewMat3 * vec3(dist, 0.0);
vec3  pos       = u_dvsMat3 * vec3(in_pos * POSITION_PRECISION, 1.0) + offset;
#ifdef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
vec4  color     = in_color;
float opacity   = 1.0;
#else
vec4  color     = getColor(in_color, in_bitSet, BITSET_GENERIC_LOCK_COLOR);
float opacity   = getOpacity();
#ifdef SDF
const float SDF_PATTERN_HALF_WIDTH = 15.5;
float scaleDash = getBit(in_bitSet, BITSET_LINE_SCALE_DASH);
float lineWidthRatio = (scaleDash * max(halfWidth - 0.55 * u_antialiasing, 0.25) + (1.0 - scaleDash)) / SDF_PATTERN_HALF_WIDTH;
#endif
#endif
#if !defined(SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE) && defined(PATTERN)
v_sampleAlphaOnly = getBit(in_bitSet, BITSET_GENERIC_CONSIDER_ALPHA_ONLY);
#endif
out_pos = vec3(pos.xy, z);
return LineData(
color,
in_normal,
halfWidth,
opacity,
#ifndef SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#ifdef PATTERN
in_tlbr / u_mosaicSize.xyxy,
vec2(in_tlbr.z - in_tlbr.x, in_tlbr.w - in_tlbr.y),
#endif
#ifdef SDF
lineWidthRatio,
#endif
#if defined(PATTERN) || defined(SDF)
in_accumulatedDist * u_zoomFactor + dot(in_segmentDirection, dist),
#endif
#endif
norm(in_id)
);
}`}},"symbologyTypeUtils.glsl":`#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_OUTLINE_FILL || SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_OUTLINE_FILL_SIMPLE
#define SYMBOLOGY_TYPE_IS_OUTLINE_FILL_LIKE
#endif
#if SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_SIMPLE || SYMBOLOGY_TYPE == SYMBOLOGY_TYPE_OUTLINE_FILL_SIMPLE
#define SYMBOLOGY_TYPE_IS_SIMPLE_LIKE
#endif`,text:{"common.glsl":`uniform highp vec2 u_mosaicSize;
varying highp vec3 v_id;
varying mediump vec3 v_pos;
varying lowp float v_opacity;
varying lowp vec4 v_color;
varying highp vec2 v_tex;
varying mediump float v_antialiasingWidth;
varying mediump float v_edgeDistanceOffset;
varying lowp float v_transparency;`,"hittest.glsl":"#include <materials/hittest/common.glsl>","text.vert":`precision highp float;
#include <materials/utils.glsl>
#include <materials/vcommon.glsl>
#include <materials/text/common.glsl>
#include <materials/text/hittest.glsl>
attribute vec4 a_color;
attribute vec4 a_haloColor;
attribute vec4 a_texFontSize;
attribute vec4 a_aux;
attribute vec2 a_zoomRange;
attribute vec2 a_vertexOffset;
attribute vec2 a_texCoords;
uniform float u_isHaloPass;
uniform float u_isBackgroundPass;
float getTextSize(inout vec2 offset, inout float baseSize, in float referenceSize) {
#ifdef VV_SIZE
float r = getSize(referenceSize) / referenceSize;
baseSize *= r;
offset.xy *= r;
return baseSize;
#endif
return baseSize;
}
void main()
{
INIT;
float a_isBackground  = a_aux.y;
float a_referenceSize = a_aux.z * a_aux.z / 256.0;
float a_bitSet        = a_aux.w;
float a_fontSize      = a_texFontSize.z;
vec2  a_offset        = a_vertexOffset * OFFSET_PRECISION;
vec3  in_pos        = vec3(a_pos * POSITION_PRECISION, 1.0);
float fontSize      = getTextSize(a_offset, a_fontSize, a_referenceSize);
float fontScale     = fontSize / SDF_FONT_SIZE;
vec3  offset        = getRotation() * vec3(a_offset, 0.0);
mat3  extrudeMatrix = getBit(a_bitSet, 0) == 1.0 ? u_displayViewMat3 : u_displayMat3;
float isText = 1.0 - a_isBackground;
float isBackground = u_isBackgroundPass * a_isBackground;
vec4  nonHaloColor  = (isBackground * a_color) + (isText * getColor(a_color, a_bitSet, 1));
v_color   = u_isHaloPass * a_haloColor + (1.0 - u_isHaloPass) * nonHaloColor;
v_opacity = getOpacity();
v_id      = norm(a_id);
v_tex     = a_texCoords / u_mosaicSize;
v_pos     = u_dvsMat3 * in_pos + extrudeMatrix * offset;
float isHidden = u_isBackgroundPass * isText + (1.0 - u_isBackgroundPass) * a_isBackground;
v_pos.z += 2.0 * isHidden;
v_edgeDistanceOffset = u_isHaloPass * OUTLINE_SCALE * a_texFontSize.w / fontScale / MAX_SDF_DISTANCE;
v_antialiasingWidth  = 0.105 * SDF_FONT_SIZE / fontSize / u_pixelRatio;
#ifdef HITTEST
highp vec3 out_pos  = vec3(0.);
v_color = vec4(0.);
hittestMarker(v_color, out_pos, u_viewMat3 * u_tileMat3 *  vec3(a_pos * POSITION_PRECISION, 1.0)
+ u_tileMat3 * offset, fontSize / 2.);
gl_PointSize = 1.;
gl_Position = vec4(clip(v_color, out_pos, getFilterFlags(), a_zoomRange), 1.0);
#else
gl_Position =  vec4(clip(v_color, v_pos, getFilterFlags(), a_zoomRange), 1.0);
#endif
}`,"text.frag":`precision mediump float;
#include <materials/text/common.glsl>
uniform lowp sampler2D u_texture;
#ifdef HITTEST
vec4 getColor() {
return v_color;
}
#else
vec4 getColor()
{
float SDF_CUTOFF = (2.0 / 8.0);
float SDF_BASE_EDGE_DIST = 1.0 - SDF_CUTOFF;
lowp float dist = texture2D(u_texture, v_tex).a;
mediump float edge = SDF_BASE_EDGE_DIST - v_edgeDistanceOffset;
#ifdef HIGHLIGHT
edge /= 2.0;
#endif
lowp float aa = v_antialiasingWidth;
lowp float alpha = smoothstep(edge - aa, edge + aa, dist);
return alpha * v_color * v_opacity;
}
#endif
void main()
{
gl_FragColor = getColor();
}`},"vv.glsl":`#if defined(VV_SIZE_MIN_MAX_VALUE) || defined(VV_SIZE_SCALE_STOPS) || defined(VV_SIZE_FIELD_STOPS) || defined(VV_SIZE_UNIT_VALUE)
#define VV_SIZE
#endif
#if defined(VV_COLOR) || defined(VV_SIZE) || defined(VV_OPACITY) || defined(VV_ROTATION)
#define VV
#endif
#ifdef VV_COLOR
uniform highp float colorValues[8];
uniform vec4 colors[8];
#endif
#ifdef VV_SIZE_MIN_MAX_VALUE
uniform highp vec4 minMaxValueAndSize;
#endif
#ifdef VV_SIZE_SCALE_STOPS
uniform highp float values[8];
uniform float sizes[8];
#endif
#ifdef VV_SIZE_FIELD_STOPS
uniform highp float values[8];
uniform float sizes[8];
#endif
#ifdef VV_SIZE_UNIT_VALUE
uniform highp float unitMeterRatio;
#endif
#ifdef VV_OPACITY
uniform highp float opacityValues[8];
uniform float opacities[8];
#endif
#ifdef VV_ROTATION
uniform lowp float rotationType;
#endif
bool isNan(float val) {
return (val == NAN_MAGIC_NUMBER);
}
#ifdef VV_SIZE_MIN_MAX_VALUE
float getVVMinMaxSize(float sizeValue, float fallback) {
if (isNan(sizeValue)) {
return fallback;
}
float interpolationRatio = (sizeValue  - minMaxValueAndSize.x) / (minMaxValueAndSize.y - minMaxValueAndSize.x);
interpolationRatio = clamp(interpolationRatio, 0.0, 1.0);
return minMaxValueAndSize.z + interpolationRatio * (minMaxValueAndSize.w - minMaxValueAndSize.z);
}
#endif
#ifdef VV_SIZE_SCALE_STOPS
float getVVScaleStopsSize(float currentScale) {
float outSize;
if (currentScale <= values[0]) {
outSize = sizes[0];
} else {
if (currentScale >= values[7]) {
outSize = sizes[7];
} else {
int index;
index = -1;
for (int i = 0; i < 8; i++) {
if (values[i] > currentScale) {
index = i;
break;
}
}
int prevIndex = index - 1;
float a = currentScale - values[prevIndex];
float b = values[index] - values[prevIndex];
outSize = mix(sizes[prevIndex], sizes[index], a / b);
}
}
return outSize;
}
#endif
#ifdef VV_SIZE_FIELD_STOPS
const int VV_SIZE_N = 8;
float getVVStopsSize(float sizeValue, float fallback) {
if (isNan(sizeValue)) {
return fallback;
}
if (sizeValue <= values[0]) {
return sizes[0];
}
if (sizeValue >= values[VV_SIZE_N - 1]) {
return sizes[VV_SIZE_N - 1];
}
for (int i = 1; i < VV_SIZE_N; ++i) {
if (values[i] >= sizeValue) {
float f = (sizeValue - values[i-1]) / (values[i] - values[i-1]);
return mix(sizes[i-1], sizes[i], f);
}
}
return sizes[VV_SIZE_N - 1];
}
#endif
#ifdef VV_SIZE_UNIT_VALUE
float getVVUnitValue(float sizeValue, float fallback) {
if (isNan(sizeValue)) {
return fallback;
}
return sizeValue * (metersPerSRUnit / unitMeterRatio);
}
#endif
#ifdef VV_OPACITY
const int VV_OPACITY_N = 8;
float getVVOpacity(float opacityValue) {
if (isNan(opacityValue)) {
return 1.0;
}
if (opacityValue <= opacityValues[0]) {
return opacities[0];
}
for (int i = 1; i < VV_OPACITY_N; ++i) {
if (opacityValues[i] >= opacityValue) {
float f = (opacityValue - opacityValues[i-1]) / (opacityValues[i] - opacityValues[i-1]);
return mix(opacities[i-1], opacities[i], f);
}
}
return opacities[VV_OPACITY_N - 1];
}
#endif
#ifdef VV_ROTATION
mat4 getVVRotation(float rotationValue) {
if (isNan(rotationValue)) {
return mat4(1, 0, 0, 0,
0, 1, 0, 0,
0, 0, 1, 0,
0, 0, 0, 1);
}
float rotation = rotationValue;
if (rotationType == 1.0) {
rotation = 90.0 - rotation;
}
float angle = C_DEG_TO_RAD * rotation;
float sinA = sin(angle);
float cosA = cos(angle);
return mat4(cosA, sinA, 0, 0,
-sinA,  cosA, 0, 0,
0,     0, 1, 0,
0,     0, 0, 1);
}
mat3 getVVRotationMat3(float rotationValue) {
if (isNan(rotationValue)) {
return mat3(1, 0, 0,
0, 1, 0,
0, 0, 1);
}
float rotation = rotationValue;
if (rotationType == 1.0) {
rotation = 90.0 - rotation;
}
float angle = C_DEG_TO_RAD * -rotation;
float sinA = sin(angle);
float cosA = cos(angle);
return mat3(cosA, -sinA, 0,
sinA, cosA, 0,
0,    0,    1);
}
#endif
#ifdef VV_COLOR
const int VV_COLOR_N = 8;
vec4 getVVColor(float colorValue, vec4 fallback, float isColorLocked) {
if (isNan(colorValue) || isColorLocked == 1.0) {
return fallback;
}
if (colorValue <= colorValues[0]) {
return colors[0];
}
for (int i = 1; i < VV_COLOR_N; ++i) {
if (colorValues[i] >= colorValue) {
float f = (colorValue - colorValues[i-1]) / (colorValues[i] - colorValues[i-1]);
return mix(colors[i-1], colors[i], f);
}
}
return colors[VV_COLOR_N - 1];
}
#endif
float getVVSize(in float size, in float vvSize, in float currentScale)  {
#ifdef VV_SIZE_MIN_MAX_VALUE
return getVVMinMaxSize(vvSize, size);
#elif defined(VV_SIZE_SCALE_STOPS)
float outSize = getVVScaleStopsSize(currentScale);
return isNan(outSize) ? size : outSize;
#elif defined(VV_SIZE_FIELD_STOPS)
float outSize = getVVStopsSize(vvSize, size);
return isNan(outSize) ? size : outSize;
#elif defined(VV_SIZE_UNIT_VALUE)
return getVVUnitValue(vvSize, size);
#else
return size;
#endif
}`,"utils.glsl":`float rshift(in float u32, in int amount) {
return floor(u32 / pow(2.0, float(amount)));
}
float getBit(in float bitset, in int bitIndex) {
float offset = pow(2.0, float(bitIndex));
return mod(floor(bitset / offset), 2.0);
}
const int maxHighlightReasons = 6;
float getFilterBit(in float bitset, in int bitIndex) {
return getBit(bitset, bitIndex + maxHighlightReasons);
}
float getHighlightBit(in float bitset, in int bitIndex) {
return getBit(bitset, bitIndex);
}
highp vec3 unpackDisplayIdTexel(in highp vec3 bitset) {
float isAggregate = getBit(bitset.b, 7);
return (1.0 - isAggregate) * bitset + isAggregate * (vec3(bitset.rgb) - vec3(0.0, 0.0, float(0x80)));
}
vec4 unpack(in float u32) {
float r = mod(rshift(u32, 0), 255.0);
float g = mod(rshift(u32, 8), 255.0);
float b = mod(rshift(u32, 16), 255.0);
float a = mod(rshift(u32, 24), 255.0);
return vec4(r, g, b, a);
}
vec3 norm(in vec3 v) {
return v /= 255.0;
}
vec4 norm(in vec4 v) {
return v /= 255.0;
}
float max4(vec4 target) {
return max(max(max(target.x, target.y), target.z), target.w);
}
vec2 unpack_u8_nf32(vec2 bytes) {
return (bytes - 127.0) / 127.0;
}
highp float rand(in vec2 co) {
highp float a = 12.9898;
highp float b = 78.233;
highp float c = 43758.5453;
highp float dt = dot(co, vec2(a,b));
highp float sn = mod(dt, 3.14);
return fract(sin(sn) * c);
}`,"vcommon.glsl":`#include <materials/constants.glsl>
#include <materials/utils.glsl>
#include <materials/attributeData.glsl>
#include <materials/vv.glsl>
#include <materials/barycentric.glsl>
attribute vec2 a_pos;
attribute highp vec3 a_id;
uniform highp mat3 displayViewScreenMat3;
uniform highp mat3 displayViewMat3;
uniform highp mat3 displayMat3;
uniform highp mat3 tileMat3;
uniform highp mat3 viewMat3;
uniform highp float pixelRatio;
uniform mediump float zoomFactor;
uniform mediump float antialiasing;
uniform mediump float currentScale;
uniform mediump float currentZoom;
uniform mediump float metersPerSRUnit;
uniform mediump float activeReasons;
uniform mediump float highlightAll;
vec4 VV_ADATA = vec4(0.0);
void loadVisualVariableData(inout vec4 target) {
target.rgba = getVisualVariableData(a_id);
}
#ifdef VV
#define INIT loadVisualVariableData(VV_ADATA)
#else
#define INIT
#endif
vec4 getColor(in vec4 a_color, in float a_bitSet, int index) {
#ifdef VV_COLOR
float isColorLocked   = getBit(a_bitSet, index);
return getVVColor(VV_ADATA[ATTR_VV_COLOR], a_color, isColorLocked);
#else
return a_color;
#endif
}
float getOpacity() {
#ifdef VV_OPACITY
return getVVOpacity(VV_ADATA[ATTR_VV_OPACITY]);
#else
return 1.0;
#endif
}
float getSize(in float in_size, in float currentScale) {
#ifdef VV_SIZE
return getVVSize(in_size, VV_ADATA[ATTR_VV_SIZE], currentScale);
#else
return in_size;
#endif
}
mat3 getRotation() {
#ifdef VV_ROTATION
return getVVRotationMat3(mod(VV_ADATA[ATTR_VV_ROTATION], 360.0));
#else
return mat3(1.0);
#endif
}
float getFilterFlags() {
#ifdef IGNORES_SAMPLER_PRECISION
return ceil(getFilterData(a_id).x * 255.0);
#else
return getFilterData(a_id).x * 255.0;
#endif
}
vec4 getAnimationState() {
return getAnimation(a_id);
}
float getMinZoom() {
vec4 data0 = getFilterData(a_id) * 255.0;
return data0.g;
}
mat3 getMatrixNoDisplay(float isMapAligned) {
return isMapAligned * viewMat3 * tileMat3 + (1.0 - isMapAligned) * tileMat3;
}
mat3 getMatrix(float isMapAligned) {
return isMapAligned * displayViewMat3 + (1.0 - isMapAligned) * displayMat3;
}
float checkHighlightBit(float filterFlags, int index) {
return getHighlightBit(filterFlags, index) * getBit(activeReasons, index);
}
float checkHighlight(float filterFlags) {
float result = checkHighlightBit(filterFlags, 0);
for (int i = 1; i < maxHighlightReasons; i++) {
result = result + checkHighlightBit(filterFlags, i);
}
return step(0.1, result + highlightAll);
}
vec3 clip(inout vec4 color, inout vec3 pos, in float filterFlags, in vec2 minMaxZoom) {
pos.z += 2.0 * (1.0 - getFilterBit(filterFlags, 0));
#ifdef inside
pos.z += 2.0 * (1.0 - getFilterBit(filterFlags, 1));
#elif defined(outside)
pos.z += 2.0 * getFilterBit(filterFlags, 1);
#elif defined(highlight)
pos.z += 2.0 * (1.0 - checkHighlight(filterFlags));
#endif
pos.z += 2.0 * (step(minMaxZoom.y, currentZoom) + (1.0 - step(minMaxZoom.x, currentZoom)));
return pos;
}`},"post-processing":{dra:{"dra.frag":`precision mediump float;
uniform sampler2D u_minColor;
uniform sampler2D u_maxColor;
uniform sampler2D u_texture;
varying vec2 v_uv;
void main() {
vec4 minColor = texture2D(u_minColor, vec2(0.5));
vec4 maxColor = texture2D(u_maxColor, vec2(0.5));
vec4 color = texture2D(u_texture, v_uv);
vec3 minColorUnpremultiply = minColor.rgb / minColor.a;
vec3 maxColorUnpremultiply = maxColor.rgb / maxColor.a;
vec3 colorUnpremultiply = color.rgb / color.a;
vec3 range = maxColorUnpremultiply - minColorUnpremultiply;
gl_FragColor = vec4(color.a * (colorUnpremultiply - minColorUnpremultiply) / range, color.a);
}`,"min-max":{"min-max.frag":`#extension GL_EXT_draw_buffers : require
precision mediump float;
#define CELL_SIZE 2
uniform sampler2D u_minTexture;
uniform sampler2D u_maxTexture;
uniform vec2 u_srcResolution;
uniform vec2 u_dstResolution;
varying vec2 v_uv;
void main() {
vec2 srcPixel = floor(gl_FragCoord.xy) * float(CELL_SIZE);
vec2 onePixel = vec2(1.0) / u_srcResolution;
vec2 uv = (srcPixel + 0.5) / u_srcResolution;
vec4 minColor = vec4(1.0);
vec4 maxColor = vec4(0.0);
for (int y = 0; y < CELL_SIZE; ++y) {
for (int x = 0; x < CELL_SIZE; ++x) {
vec2 offset = uv + vec2(x, y) * onePixel;
minColor = min(minColor, texture2D(u_minTexture, offset));
maxColor = max(maxColor, texture2D(u_maxTexture, offset));
}
}
gl_FragData[0] = minColor;
gl_FragData[1] = maxColor;
}`}},"edge-detect":{"frei-chen":{"frei-chen.frag":`precision mediump float;
uniform sampler2D u_colorTexture;
uniform vec2 u_texSize;
varying vec2 v_uv;
vec2 texel = vec2(1.0 / u_texSize.x, 1.0 / u_texSize.y);
mat3 G[9];
const mat3 g0 = mat3( 0.3535533845424652, 0, -0.3535533845424652, 0.5, 0, -0.5, 0.3535533845424652, 0, -0.3535533845424652 );
const mat3 g1 = mat3( 0.3535533845424652, 0.5, 0.3535533845424652, 0, 0, 0, -0.3535533845424652, -0.5, -0.3535533845424652 );
const mat3 g2 = mat3( 0, 0.3535533845424652, -0.5, -0.3535533845424652, 0, 0.3535533845424652, 0.5, -0.3535533845424652, 0 );
const mat3 g3 = mat3( 0.5, -0.3535533845424652, 0, -0.3535533845424652, 0, 0.3535533845424652, 0, 0.3535533845424652, -0.5 );
const mat3 g4 = mat3( 0, -0.5, 0, 0.5, 0, 0.5, 0, -0.5, 0 );
const mat3 g5 = mat3( -0.5, 0, 0.5, 0, 0, 0, 0.5, 0, -0.5 );
const mat3 g6 = mat3( 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.6666666865348816, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204 );
const mat3 g7 = mat3( -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, 0.6666666865348816, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408 );
const mat3 g8 = mat3( 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408 );
void main() {
G[0] = g0,
G[1] = g1,
G[2] = g2,
G[3] = g3,
G[4] = g4,
G[5] = g5,
G[6] = g6,
G[7] = g7,
G[8] = g8;
mat3 I;
float cnv[9];
vec3 sample;
for (float i = 0.0; i < 3.0; i++) {
for (float j = 0.0; j < 3.0; j++) {
sample = texture2D(u_colorTexture, v_uv + texel * vec2(i - 1.0,j - 1.0)).rgb;
I[int(i)][int(j)] = length(sample);
}
}
for (int i = 0; i < 9; i++) {
float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
cnv[i] = dp3 * dp3;
}
float M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);
float S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M);
gl_FragColor = vec4(vec3(sqrt(M / S)), texture2D(u_colorTexture, v_uv).a);
}`},sobel:{"sobel.frag":`precision mediump float;
uniform sampler2D u_colorTexture;
varying vec2 v_uv;
uniform vec2 u_texSize;
vec2 texel = vec2(1.0 / u_texSize.x, 1.0 / u_texSize.y);
mat3 G[2];
const mat3 g0 = mat3( 1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0 );
const mat3 g1 = mat3( 1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0 );
void main() {
mat3 I;
float cnv[2];
vec3 sample;
G[0] = g0;
G[1] = g1;
for (float i = 0.0; i < 3.0; i++) {
for (float j = 0.0; j < 3.0; j++) {
sample = texture2D( u_colorTexture, v_uv + texel * vec2(i-1.0,j-1.0) ).rgb;
I[int(i)][int(j)] = length(sample);
}
}
for (int i = 0; i < 2; i++) {
float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
cnv[i] = dp3 * dp3;
}
gl_FragColor = vec4(vec3(0.5 * sqrt(cnv[0] * cnv[0] + cnv[1] * cnv[1])), texture2D(u_colorTexture, v_uv).a);
}`}},"edge-enhance":{"edge-enhance.frag":`precision mediump float;
uniform sampler2D u_colorTexture;
varying vec2 v_uv;
uniform vec2 u_texSize;
vec2 texel = vec2(1.0 / u_texSize.x, 1.0 / u_texSize.y);
mat3 G[2];
const mat3 g0 = mat3( 1.0, 0.0, -1.0, 1.0, 0.0, -1.0, 1.0, 0.0, -1.0 );
const mat3 g1 = mat3( 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, -1.0, -1.0, -1.0 );
void main() {
mat3 I;
float cnv[2];
vec3 sample;
G[0] = g0;
G[1] = g1;
for (float i = 0.0; i < 3.0; i++) {
for (float j = 0.0; j < 3.0; j++) {
sample = texture2D( u_colorTexture, v_uv + texel * vec2(i-1.0,j-1.0) ).rgb;
I[int(i)][int(j)] = length(sample);
}
}
for (int i = 0; i < 2; i++) {
float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);
cnv[i] = dp3 * dp3;
}
vec4 color = texture2D(u_colorTexture, v_uv);
gl_FragColor = vec4(0.5 * sqrt(cnv[0] * cnv[0] + cnv[1] * cnv[1]) * color);
}`},filterEffect:{"filterEffect.frag":`precision mediump float;
uniform sampler2D u_colorTexture;
uniform mat4 u_coefficients;
varying vec2 v_uv;
void main() {
vec4 color = texture2D(u_colorTexture, v_uv);
vec4 rgbw = u_coefficients * vec4(color.a > 0.0 ? color.rgb / color.a : vec3(0.0), 1.0);
float a = color.a;
gl_FragColor = vec4(a * rgbw.rgb, a);
}`},pp:{"pp.vert":`precision mediump float;
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
gl_Position = vec4(a_position, 0.0, 1.0);
v_uv = (a_position + 1.0) / 2.0;
}`}},raster:{common:{"common.glsl":`uniform sampler2D u_image;
uniform int u_bandCount;
uniform bool u_flipY;
uniform float u_opacity;
uniform int u_resampling;
uniform vec2 u_srcImageSize;
#ifdef APPLY_PROJECTION
#include <raster/common/projection.glsl>
#endif
#ifdef BICUBIC
#include <filtering/bicubic.glsl>
#endif
#ifdef BILINEAR
#include <filtering/bilinear.glsl>
#endif
vec2 getPixelLocation(vec2 coords) {
vec2 targetLocation = u_flipY ? vec2(coords.s, 1.0 - coords.t) : coords;
#ifdef APPLY_PROJECTION
targetLocation = projectPixelLocation(targetLocation);
#endif
return targetLocation;
}
bool isOutside(vec2 coords){
if (coords.t>1.00001 ||coords.t<-0.00001 || coords.s>1.00001 ||coords.s<-0.00001) {
return true;
} else {
return false;
}
}
vec4 getPixel(vec2 pixelLocation) {
#ifdef BICUBIC
vec4 color = sampleBicubicBSpline(u_image, pixelLocation, u_srcImageSize);
#elif defined(BILINEAR)
vec4 color = sampleBilinear(u_image, pixelLocation, u_srcImageSize);
#else
vec4 color = texture2D(u_image, pixelLocation);
#endif
return color;
}`,"projection.glsl":`uniform sampler2D u_transformGrid;
uniform vec2 u_transformSpacing;
uniform vec2 u_transformGridSize;
uniform vec2 u_targetImageSize;
vec2 projectPixelLocation(vec2 coords) {
#ifdef LOOKUP_PROJECTION
vec4 pv = texture2D(u_transformGrid, coords);
return vec2(pv.r, pv.g);
#endif
vec2 index_image = floor(coords * u_targetImageSize);
vec2 oneTransformPixel = vec2(0.25 / u_transformGridSize.s, 1.0 / u_transformGridSize.t);
vec2 index_transform = floor(index_image / u_transformSpacing) / u_transformGridSize;
vec2 pos = fract((index_image + vec2(0.5, 0.5)) / u_transformSpacing);
vec2 srcLocation;
vec2 transform_location = index_transform + oneTransformPixel * 0.5;
if (pos.s <= pos.t) {
vec4 ll_abc = texture2D(u_transformGrid, vec2(transform_location.s, transform_location.t));
vec4 ll_def = texture2D(u_transformGrid, vec2(transform_location.s + oneTransformPixel.s, transform_location.t));
srcLocation.s = dot(ll_abc.rgb, vec3(pos, 1.0));
srcLocation.t = dot(ll_def.rgb, vec3(pos, 1.0));
} else {
vec4 ur_abc = texture2D(u_transformGrid, vec2(transform_location.s + 2.0 * oneTransformPixel.s, transform_location.t));
vec4 ur_def = texture2D(u_transformGrid, vec2(transform_location.s + 3.0 * oneTransformPixel.s, transform_location.t));
srcLocation.s = dot(ur_abc.rgb, vec3(pos, 1.0));
srcLocation.t = dot(ur_def.rgb, vec3(pos, 1.0));
}
return srcLocation;
}`},flow:{"getDisplayOpacity.glsl":`uniform float u_displayOpacity;
float getDisplayOpacity() {
return u_displayOpacity;
}`,"getFragmentColor.glsl":`vec4 getFragmentColor(vec4 color, float dist, float size, float featheringSize) {
float featheringStart = clamp(0.5 - featheringSize / size, 0.0, 0.5);
if (dist > featheringStart) {
color *= 1.0 - (dist - featheringStart) / (0.5 - featheringStart);
}
return color;
}`,"getTimeSeed.glsl":`float getTimeSeed(float firstTime, float lastTime) {
return mod(firstTime * 3.634f + lastTime * 5.153f + 7.381f, 1.0f);
}`,"getFadeOpacity.glsl":`uniform float u_decayRate;
uniform float u_fadeToZero;
float getFadeOpacity(float x) {
float cutOff = mix(0.0, exp(-u_decayRate), u_fadeToZero);
return (exp(-u_decayRate * x) - cutOff) / (1.0 - cutOff);
}`,"getRangeOpacity.glsl":`uniform float u_startTime;
uniform float u_endTime;
float getRangeOpacity(float vertexTime, float cycle, float totalTime, float flowSpeed) {
float vTime = (vertexTime + cycle * totalTime) / flowSpeed;
if (vTime < u_startTime) {
return 0.0;
}
if (vTime > u_endTime) {
return 0.0;
}
return 1.0;
}`,imagery:{"imagery.frag":`precision highp float;
varying vec2 v_texcoord;
uniform sampler2D u_texture;
uniform float u_Min;
uniform float u_Max;
uniform float u_featheringSize;
#include <raster/flow/vv.glsl>
float getIntensity(float v) {
return u_Min + v * (u_Max - u_Min);
}
void main(void) {
vec4 sampled = texture2D(u_texture, v_texcoord);
float intensity = getIntensity(sampled.r);
gl_FragColor = getColor(intensity);
gl_FragColor.a *= getOpacity(sampled.r);
gl_FragColor.a *= sampled.a;
gl_FragColor.rgb *= gl_FragColor.a;
}`,"imagery.vert":`attribute vec2 a_position;
attribute vec2 a_texcoord;
uniform mat3 u_dvsMat3;
varying vec2 v_texcoord;
void main(void) {
vec2 xy = (u_dvsMat3 * vec3(a_position, 1.0)).xy;
gl_Position = vec4(xy, 0.0, 1.0);
v_texcoord = a_texcoord;
}`},particles:{"particles.frag":`precision highp float;
varying vec4 v_color;
varying vec2 v_texcoord;
varying float v_size;
uniform float u_featheringSize;
#include <raster/flow/getFragmentColor.glsl>
void main(void) {
gl_FragColor = getFragmentColor(v_color, length(v_texcoord - 0.5), v_size, u_featheringSize);
}`,"particles.vert":`attribute vec4 a_xyts0;
attribute vec4 a_xyts1;
attribute vec4 a_typeIdFirstTimeLastTime;
attribute vec4 a_extrudeInfo;
uniform mat3 u_dvsMat3;
uniform mat3 u_displayViewMat3;
uniform float u_time;
uniform float u_trailLength;
uniform float u_flowSpeed;
varying vec4 v_color;
varying vec2 v_texcoord;
varying float v_size;
uniform float u_featheringSize;
uniform float u_introFade;
#include <raster/flow/vv.glsl>
#include <raster/flow/getFadeOpacity.glsl>
#include <raster/flow/getDisplayOpacity.glsl>
#include <raster/flow/getTimeSeed.glsl>
void main(void) {
float firstTime = a_typeIdFirstTimeLastTime.z;
float lastTime = a_typeIdFirstTimeLastTime.w;
float duration = lastTime - firstTime;
vec2 position0 = a_xyts0.xy;
float t0 = a_xyts0.z - firstTime;
float speed0 = a_xyts0.w;
vec2 position1 = a_xyts1.xy;
float t1 = a_xyts1.z - firstTime;
float speed1 = a_xyts1.w;
float type = a_typeIdFirstTimeLastTime.x;
float id = a_typeIdFirstTimeLastTime.y;
float seed = getTimeSeed(firstTime, lastTime);
vec2 e0 = a_extrudeInfo.xy;
vec2 e1 = a_extrudeInfo.zw;
float animationPeriod = duration + u_trailLength;
float scaledTime = u_time * u_flowSpeed;
float t = mod(scaledTime, animationPeriod);
float fUnclamped = (t - t0) / (t1 - t0);
float f = clamp(fUnclamped, 0.0, 1.0);
float clampedTime = mix(t0, t1, f);
float speed = mix(speed0, speed1, f);
vec2 extrude;
vec2 position;
float fadeOpacity;
float introOpacity;
if (type == 2.0) {
if (fUnclamped < 0.0 || (fUnclamped > 1.0 && t1 != duration)) {
gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
return;
}
vec2 ortho = mix(e0, e1, f);
vec2 parallel;
parallel = normalize(position1 - position0) * 0.5;
if (id == 1.0) {
extrude = ortho;
v_texcoord = vec2(0.5, 0.0);
} else if (id == 2.0) {
extrude = -ortho;
v_texcoord = vec2(0.5, 1.0);
} else if (id == 3.0) {
extrude = ortho + parallel;
v_texcoord = vec2(1.0, 0.0);
} else if (id == 4.0) {
extrude = -ortho + parallel;
v_texcoord = vec2(1.0, 1.0);
}
fadeOpacity = getFadeOpacity((t - clampedTime) / u_trailLength);
introOpacity = 1.0 - exp(-clampedTime);
v_size = getSize(speed);
v_color = getColor(speed);
v_color.a *= getOpacity(speed);
position = mix(position0, position1, f);
} else {
if (fUnclamped < 0.0) {
gl_Position = vec4(0.0, 0.0, -2.0, 1.0);
return;
}
if (id == 1.0) {
extrude = e0;
v_texcoord = vec2(0.5, 0.0);
fadeOpacity = getFadeOpacity((t - t0) / u_trailLength);
introOpacity = 1.0 - exp(-t0);
v_size = getSize(speed0);
v_color = getColor(speed0);
v_color.a *= getOpacity(speed0);
position = position0;
} else if (id == 2.0) {
extrude = -e0;
v_texcoord = vec2(0.5, 1.0);
fadeOpacity = getFadeOpacity((t - t0) / u_trailLength);
introOpacity = 1.0 - exp(-t0);
v_size = getSize(speed0);
v_color = getColor(speed0);
v_color.a *= getOpacity(speed0);
position = position0;
} else if (id == 3.0) {
extrude = mix(e0, e1, f);
v_texcoord = vec2(0.5, 0.0);
fadeOpacity = getFadeOpacity((t - clampedTime) / u_trailLength);
introOpacity = 1.0 - exp(-clampedTime);
v_size = getSize(speed);
v_color = getColor(speed);
v_color.a *= getOpacity(speed);
position = mix(position0, position1, f);
} else if (id == 4.0) {
extrude = -mix(e0, e1, f);
v_texcoord = vec2(0.5, 1.0);
fadeOpacity = getFadeOpacity((t - clampedTime) / u_trailLength);
introOpacity = 1.0 - exp(-clampedTime);
v_size = getSize(speed);
v_color = getColor(speed);
v_color.a *= getOpacity(speed);
position = mix(position0, position1, f);
}
}
vec2 xy = (u_dvsMat3 * vec3(position, 1.0) + u_displayViewMat3 * vec3(extrude * v_size, 0.0)).xy;
gl_Position = vec4(xy, 0.0, 1.0);
v_color.a *= fadeOpacity;
v_color.a *= mix(1.0, introOpacity, u_introFade);
v_color.a *= getDisplayOpacity();
v_color.rgb *= v_color.a;
}`},streamlines:{"streamlines.frag":`precision highp float;
varying float v_side;
varying float v_time;
varying float v_firstTime;
varying float v_lastTime;
varying vec4 v_color;
varying float v_size;
uniform float u_time;
uniform float u_trailLength;
uniform float u_flowSpeed;
uniform float u_featheringSize;
uniform float u_introFade;
#include <raster/flow/getFragmentColor.glsl>
#include <raster/flow/getFadeOpacity.glsl>
#include <raster/flow/getRangeOpacity.glsl>
#include <raster/flow/getDisplayOpacity.glsl>
#include <raster/flow/getTimeSeed.glsl>
void main(void) {
float totalTime = v_lastTime - v_firstTime;
float trailLength = u_trailLength;
float period = totalTime + trailLength;
float seed = getTimeSeed(v_firstTime, v_lastTime);
float t = mod(seed * period + u_time * u_flowSpeed, period) + v_firstTime - v_time;
float fading = t / trailLength;
vec4 color = v_color;
color *= getDisplayOpacity();
color *= fading < 0.0 ? 0.0 : getFadeOpacity(fading);
gl_FragColor = getFragmentColor(color, length((v_side + 1.0) / 2.0 - 0.5), v_size, u_featheringSize);
}`,"streamlines.vert":`attribute vec3 a_positionAndSide;
attribute vec3 a_timeInfo;
attribute vec2 a_extrude;
attribute float a_speed;
uniform mat3 u_dvsMat3;
uniform mat3 u_displayViewMat3;
varying float v_time;
varying float v_firstTime;
varying float v_lastTime;
varying vec4 v_color;
varying float v_side;
varying float v_size;
uniform float u_featheringSize;
#include <raster/flow/vv.glsl>
void main(void) {
vec4 lineColor = getColor(a_speed);
float lineOpacity = getOpacity(a_speed);
float lineSize = getSize(a_speed);
vec2 position = a_positionAndSide.xy;
v_side = a_positionAndSide.z;
vec2 xy = (u_dvsMat3 * vec3(position, 1.0) + u_displayViewMat3 * vec3(a_extrude * lineSize, 0.0)).xy;
gl_Position = vec4(xy, 0.0, 1.0);
v_time = a_timeInfo.x;
v_firstTime = a_timeInfo.y;
v_lastTime = a_timeInfo.z;
v_color = lineColor;
v_color.a *= lineOpacity;
v_color.rgb *= v_color.a;
v_size = lineSize;
}`},"vv.glsl":`#define MAX_STOPS 8
#ifdef VV_COLOR
uniform float u_color_stops[MAX_STOPS];
uniform vec4 u_color_values[MAX_STOPS];
uniform int u_color_count;
#else
uniform vec4 u_color;
#endif
#ifdef VV_OPACITY
uniform float u_opacity_stops[MAX_STOPS];
uniform float u_opacity_values[MAX_STOPS];
uniform int u_opacity_count;
#else
uniform float u_opacity;
#endif
#ifdef VV_SIZE
uniform float u_size_stops[MAX_STOPS];
uniform float u_size_values[MAX_STOPS];
uniform int u_size_count;
#else
uniform float u_size;
#endif
uniform float u_featheringOffset;
vec4 getColor(float x) {
#ifdef VV_COLOR
vec4 color = u_color_values[0];
{
for (int i = 1; i < MAX_STOPS; i++) {
if (i >= u_color_count) {
break;
}
float x1 = u_color_stops[i - 1];
if (x < x1) {
break;
}
float x2 = u_color_stops[i];
vec4 y2 = u_color_values[i];
if (x < x2) {
vec4 y1 = u_color_values[i - 1];
color = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
} else {
color = y2;
}
}
}
#else
vec4 color = u_color;
#endif
return color;
}
float getOpacity(float x) {
#ifdef VV_OPACITY
float opacity = u_opacity_values[0];
{
for (int i = 1; i < MAX_STOPS; i++) {
if (i >= u_opacity_count) {
break;
}
float x1 = u_opacity_stops[i - 1];
if (x < x1) {
break;
}
float x2 = u_opacity_stops[i];
float y2 = u_opacity_values[i];
if (x < x2) {
float y1 = u_opacity_values[i - 1];
opacity = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
} else {
opacity = y2;
}
}
}
#else
float opacity = u_opacity;
#endif
return opacity;
}
float getSize(float x) {
#ifdef VV_SIZE
float size = u_size_values[0];
{
for (int i = 1; i < MAX_STOPS; i++) {
if (i >= u_size_count) {
break;
}
float x1 = u_size_stops[i - 1];
if (x < x1) {
break;
}
float x2 = u_size_stops[i];
float y2 = u_size_values[i];
if (x < x2) {
float y1 = u_size_values[i - 1];
size = y1 + (y2 - y1) * (x - x1) / (x2 - x1);
} else {
size = y2;
}
}
}
#else
float size = u_size;
#endif
return size + 2.0 * u_featheringSize * u_featheringOffset;
}`},reproject:{"reproject.vert":`precision mediump float;
attribute vec2 a_position;
varying highp vec2 v_texcoord;
void main()
{
v_texcoord = a_position;
gl_Position = vec4(2.0 * (a_position - 0.5), 0.0, 1.0);
}`,"reproject.frag":`precision mediump float;
varying vec2 v_texcoord;
#include <raster/common/common.glsl>
void main() {
vec2 pixelLocation = getPixelLocation(v_texcoord);
if (isOutside(pixelLocation)) {
gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
return;
}
vec4 currentPixel = getPixel(pixelLocation);
gl_FragColor = vec4(currentPixel.rgb, 1.0) * currentPixel.a * u_opacity;
}`}},stencil:{"stencil.frag":`void main() {
gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`,"stencil.vert":`attribute vec2 a_pos;
uniform mat3 u_worldExtent;
void main() {
gl_Position = vec4(u_worldExtent * vec3(a_pos, 1.0), 1.0);
}`},test:{"TestShader.common.glsl":`#ifndef RETURN_RED
varying    vec4      v_color;
#endif
varying    vec2      v_offset;`,"TestShader.frag":`precision highp float;
#include <test/TestShader.common.glsl>
void main() {
if (v_offset.x > -.5 && v_offset.y > -.5 && v_offset.x < .5 && v_offset.y < .5) {
discard;
}
#ifdef RETURN_RED
gl_FragColor = vec4(1., 0., 0., 1.);
#else
gl_FragColor = v_color;
#endif
}`,"TestShader.vert":`const float POS_PRECISION_FACTOR = 10.;
const float OFFSET_PRECISION_FACTOR = 10.;
const float SIZE_PRECISION_FACTOR = 10.;
attribute  vec2      a_pos_packed;
attribute  vec2      a_offset_packed;
attribute  float     a_size_packed;
#ifdef DATA_DRIVEN_COLOR
const float u_dataDrivenColor_validValues[4] = float[4](0., 0., 1., 0.);
uniform    vec4      u_dataDrivenColor_colorFallback;
uniform    vec4      u_dataDrivenColor_color;
#endif
uniform    float     u_view_zoomLevel;
#include <test/TestShader.common.glsl>
#ifdef DATA_DRIVEN_COLOR
vec4 getColor(float value) {
int index = -1;
for (int i = 0; i < 4; i++) {
if (u_dataDrivenColor_validValues[i] == value) {
index = i;
break;
}
}
if (index == -1) {
return u_dataDrivenColor_colorFallback;
}
return u_dataDrivenColor_color;
}
#endif
void main() {
vec2  a_pos = a_pos_packed / POS_PRECISION_FACTOR;
vec2  a_offset = a_offset_packed / OFFSET_PRECISION_FACTOR;
float a_size = a_size_packed / SIZE_PRECISION_FACTOR;
vec4 color = vec4(1., 0., 0., 1.);
#ifdef DATA_DRIVEN_COLOR
color = getColor(1.);
#endif
vec2 offsetScaled = a_offset * a_size;
vec4 pos = vec4(a_pos.xy + offsetScaled, 0., 1.);
gl_Position = pos;
#ifndef RETURN_RED
v_color = color;
#endif
v_offset = a_offset;
}`},util:{"atan2.glsl":`float atan2(in float y, in float x) {
float t0, t1, t2, t3, t4;
t3 = abs(x);
t1 = abs(y);
t0 = max(t3, t1);
t1 = min(t3, t1);
t3 = 1.0 / t0;
t3 = t1 * t3;
t4 = t3 * t3;
t0 =         - 0.013480470;
t0 = t0 * t4 + 0.057477314;
t0 = t0 * t4 - 0.121239071;
t0 = t0 * t4 + 0.195635925;
t0 = t0 * t4 - 0.332994597;
t0 = t0 * t4 + 0.999995630;
t3 = t0 * t3;
t3 = (abs(y) > abs(x)) ? 1.570796327 - t3 : t3;
t3 = x < 0.0 ?  3.141592654 - t3 : t3;
t3 = y < 0.0 ? -t3 : t3;
return t3;
}`,"encoding.glsl":`const vec4 rgba2float_factors = vec4(
255.0 / (256.0),
255.0 / (256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0),
255.0 / (256.0 * 256.0 * 256.0 * 256.0)
);
float rgba2float(vec4 rgba) {
return dot(rgba, rgba2float_factors);
}`}};function ra(a){return function(e){let t=a;return e.split("/").forEach(i=>{t&&(t=t[i])}),t}}const sa=new na(ra(aa));function cn(a){return sa.resolveIncludes(a)}let ut=class extends Y{};r([m(o)],ut.prototype,"globalTime",void 0),r([m(g)],ut.prototype,"animationTextureSize",void 0),r([m(G)],ut.prototype,"toScreen",void 0),r([m(G)],ut.prototype,"toNdc",void 0),r([m(o)],ut.prototype,"mapRotation",void 0),r([m(o)],ut.prototype,"pixelRatio",void 0);let $e=class extends bn{getVisualVariableData(e){return this._vvData||(this._vvData=k(this.visualVariableData,e).setDebugName("storage2")),this._vvData}getFilterData(e){return k(this.filterFlags,e).setDebugName("storage0")}getAnimationData(e){return k(this.animation,e).setDebugName("storage1")}getVVData(e){return this.getVisualVariableData(e)}getDataDrivenData0(e){return k(this.dataDriven0,e).setDebugName("storage30")}getDataDrivenData1(e){return k(this.dataDriven1,e).setDebugName("storage31")}getDataDrivenData2(e){return k(this.dataDriven2,e).setDebugName("storage32")}getGPGPUData(e){return k(this.gpgpu,e).setDebugName("storage4")}getLocalTimeOrigin(e){return k(this.localTimeOrigin,e).x.setDebugName("storage5")}getFilterFlags(e){return et("webgl-ignores-sampler-precision")?Co(this.getFilterData(e).x.multiply(De(255))):this.getFilterData(e).x.multiply(De(255))}getLabelVisibility(e){const t=this.getFilterData(e).y.multiply(255);return new o(1).subtract(t)}getAnimationValue(e){return this.getAnimationData(e).x}getSizeValue(e){return this.getVisualVariableData(e).x}getColorValue(e){return this.getVisualVariableData(e).y}getOpacityValue(e){return this.getVisualVariableData(e).z}getRotationValue(e){return this.getVisualVariableData(e).w}};r([H($)],$e.prototype,"filterFlags",void 0),r([H($)],$e.prototype,"animation",void 0),r([H($)],$e.prototype,"gpgpu",void 0),r([H($)],$e.prototype,"localTimeOrigin",void 0),r([H($)],$e.prototype,"visualVariableData",void 0),r([H($)],$e.prototype,"dataDriven0",void 0),r([H($)],$e.prototype,"dataDriven1",void 0),r([H($)],$e.prototype,"dataDriven2",void 0);let Dn=class extends Y{getAttributeDataCoords(e){if(!this._uv){const t=Ko(e),i=this.size,n=bt(t.x),s=bt(t.y).multiply(bt(256)),l=bt(t.z).multiply(bt(256)).multiply(bt(256)),u=De(n.add(s).add(l)),c=Ke(u,i),p=u.subtract(c).divide(i);this._uv=new g(c,p).add(.5).divide(i)}return this._uv}};r([m(o)],Dn.prototype,"size",void 0);let Vi=class extends Y{};r([m(o)],Vi.prototype,"activeReasons",void 0),r([m(o)],Vi.prototype,"highlightAll",void 0);let Tt=class extends Y{};r([m(g)],Tt.prototype,"position",void 0),r([m(o)],Tt.prototype,"distance",void 0),r([m(o)],Tt.prototype,"smallSymbolDistance",void 0),r([m(o)],Tt.prototype,"smallSymbolSizeThreshold",void 0),r([m(S)],Tt.prototype,"tlbr",void 0);let re=class extends Y{};r([m(G)],re.prototype,"displayViewScreenMat3",void 0),r([m(G)],re.prototype,"displayViewMat3",void 0),r([m(G)],re.prototype,"displayMat3",void 0),r([m(G)],re.prototype,"viewMat3",void 0),r([m(G)],re.prototype,"tileMat3",void 0),r([m(o)],re.prototype,"displayZoomFactor",void 0),r([m(o)],re.prototype,"requiredZoomFactor",void 0),r([m(g)],re.prototype,"tileOffset",void 0),r([m(o)],re.prototype,"currentScale",void 0),r([m(o)],re.prototype,"currentZoom",void 0),r([m(o)],re.prototype,"metersPerSRUnit",void 0),r([m(o)],re.prototype,"rotation",void 0),r([m(o)],re.prototype,"pixelRatio",void 0),r([m(o)],re.prototype,"scaleFactor",void 0);let ze=class extends Rt{};r([v(0,D)],ze.prototype,"id",void 0),r([v(1,o)],ze.prototype,"bitset",void 0),r([v(2,g)],ze.prototype,"pos",void 0);let Ce=class extends Xt{};r([v(14,g)],Ce.prototype,"nextPos1",void 0),r([v(15,g)],Ce.prototype,"nextPos2",void 0);let Ve=class extends Jt{},ue=class extends Vt{clip(e,t){let i=new o(0);const n=this.getFilterFlags(e);if(i=i.add(De(2).multiply(De(1).subtract(zi(n,0)))),this.inside?i=i.add(De(2).multiply(De(1).subtract(zi(n,1)))):this.outside?i=i.add(De(2).multiply(zi(n,1))):this.highlight&&(i=i.add(De(2).multiply(De(1).subtract(this._checkHighlight(n))))),t!=null){const s=new o(1).subtract(W(t.x,this.view.currentZoom)),l=W(t.y,this.view.currentZoom);i=i.add(new o(2).multiply(s.add(l)))}return i}getFragmentOutput(e,t,i=new o(1/255)){const n=new xt;return n.fragColor=this._maybeWriteHittest(t)??this._maybeHighlight(e,i)??e,n}_maybeHighlight(e,t){return this.highlight?new S(e.rgb,W(t,e.a)):null}_checkHighlight(e){let t=this._checkHighlightBit(e,0);for(let i=1;i<co;i++)t=t.add(this._checkHighlightBit(e,i));return W(new o(.1),t.add(this.highlight.highlightAll))}_checkHighlightBit(e,t){return Xo(e,t).multiply(K(this.highlight.activeReasons,t))}computeHittestTriangle(e,t,i){const{viewMat3:n,tileMat3:s}=this.view,l=n.multiply(s),{nextPos1:u,nextPos2:c}=t;return{pos0:l.multiply(new D(e.pos,1)).xy,pos1:l.multiply(new D(u,1)).xy,pos2:l.multiply(new D(c,1)).xy}}maybeRunHittest(e,t,i){if(this.hittestRequest==null)return null;const n=this.hittest(e,t,i),s=N(n,new o(fe)),l=N(n,new o(Cn)),u=y(l,()=>new S(new o(1/255),0,0,0),y(s,()=>new S(new o(2/255),0,0,0),new S(X)));let c=y(Se(s,l),new o(0),new o(2));const p=this.getAttributeDataCoords(e.id),d=Jo(p);return c=c.add(this.clip(e.id,e.zoomRange)),{glPointSize:new o(1),glPosition:new S(d,c,1),color:u}}_maybeWriteHittest(e){return this.hittestRequest!=null?e.color:null}getAttributeDataCoords(e){return this.storage.getAttributeDataCoords(e)}getVVData(e){return this.storageTextures.getVVData(this.getAttributeDataCoords(e))}getFilterFlags(e){return this.storageTextures.getFilterFlags(this.getAttributeDataCoords(e))}getLocalTimeOrigin(e){return this.storageTextures.getLocalTimeOrigin(this.getAttributeDataCoords(e))}getSizeValue(e){return this.storageTextures.getSizeValue(this.getAttributeDataCoords(e))}getColorValue(e){return this.storageTextures.getColorValue(this.getAttributeDataCoords(e))}getOpacityValue(e){return this.storageTextures.getOpacityValue(this.getAttributeDataCoords(e))}getRotationValue(e){return this.storageTextures.getRotationValue(this.getAttributeDataCoords(e))}};r([le],ue.prototype,"inside",void 0),r([le],ue.prototype,"outside",void 0),r([M(Vi)],ue.prototype,"highlight",void 0),r([m(Dn)],ue.prototype,"storage",void 0),r([H($e)],ue.prototype,"storageTextures",void 0),r([m(re)],ue.prototype,"view",void 0),r([M(Tt)],ue.prototype,"hittestRequest",void 0);let _t=class extends Y{getPatternOffsetAtTileOrigin(e,t=new o(0),i=new o(1)){const n=new g(No).divide(e);let s=e.multiply(Pi(this.maxIntsToLocalOrigin.multiply(n))).add(this.tileOffsetFromLocalOrigin).subtract(new o(.5).multiply(e));return s=new g(s.x.multiply(i).subtract(s.y.multiply(t)),s.x.multiply(t).add(s.y.multiply(i))),Ke(s,e)}};r([m(g)],_t.prototype,"tileOffsetFromLocalOrigin",void 0),r([m(g)],_t.prototype,"maxIntsToLocalOrigin",void 0);let Re=class extends Y{};r([m(g)],Re.prototype,"size",void 0);let rt=class extends Y{getColor(e,t,i){return ce([Se(je(e),i),t],[Le(e,this.values.first()),this.colors.first()],[de(e,this.values.last()),this.colors.last()],[!0,()=>{const n=this.values.findIndex(p=>R(p,e)),s=this.values.get(n),l=n.subtract(1),u=this.values.get(l),c=e.subtract(u).divide(s.subtract(u));return B(this.colors.get(l),this.colors.get(n),c)}])}};r([m(pe.ofType(S,8))],rt.prototype,"colors",void 0),r([m(pe.ofType(o,8))],rt.prototype,"values",void 0);let st=class extends Y{getOpacity(e){return ce([je(e),new o(1)],[Le(e,this.opacityValues.first()),this.opacities.first()],[de(e,this.opacityValues.last()),this.opacities.last()],[!0,()=>{const t=this.opacityValues.findIndex(u=>R(u,e)),i=this.opacityValues.get(t),n=t.subtract(1),s=this.opacityValues.get(n),l=e.subtract(s).divide(i.subtract(s));return B(this.opacities.get(n),this.opacities.get(t),l)}])}};r([m(pe.ofType(o,8))],st.prototype,"opacities",void 0),r([m(pe.ofType(o,8))],st.prototype,"opacityValues",void 0);let hi=class extends Y{getVVRotationMat4(e){return y(je(e),ci.identity(),()=>{const t=this.getNormalizedAngle(e).multiply(an),i=tt(t),n=it(t);return new ci(n,i,0,0,i.multiply(new o(-1)),n,0,0,0,0,1,0,0,0,0,1)})}getVVRotationMat3(e){return y(je(e),G.identity(),()=>{const t=this.getNormalizedAngle(e).multiply(an),i=tt(t),n=it(t);return new G(n,i,0,i.multiply(new o(-1)),n,0,0,0,1)})}getNormalizedAngle(e){const t=N(this.rotationType,new o(1));return y(t,new o(90).subtract(e),e)}};r([m(o)],hi.prototype,"rotationType",void 0);let Ft=class extends Y{getSize(e,t){const i=this.minMaxValueAndSize.xy,n=this.minMaxValueAndSize.zw;return y(je(e),t,()=>{const s=e.subtract(i.x).divide(i.y.subtract(i.x)),l=_e(s,new o(0),new o(1));return n.x.add(l.multiply(n.y.subtract(n.x)))})}};r([m(S)],Ft.prototype,"minMaxValueAndSize",void 0);let ht=class extends Y{getSizeForViewScale(e){return ce([Le(e,this.values.first()),this.sizes.first()],[de(e,this.values.last()),this.sizes.last()],[!0,()=>{const t=this.values.findIndex(u=>R(u,e)),i=this.values.get(t),n=t.subtract(1),s=this.values.get(n),l=e.subtract(s).divide(i.subtract(s));return B(this.sizes.get(n),this.sizes.get(t),l)}])}};r([m(pe.ofType(o,8))],ht.prototype,"sizes",void 0),r([m(pe.ofType(o,8))],ht.prototype,"values",void 0);let yt=class extends Y{getSize(e,t){const i=ce([je(e),t],[Le(e,this.values.first()),this.sizes.first()],[de(e,this.values.last()),this.sizes.last()],[!0,()=>{const n=this.values.findIndex(p=>R(p,e)),s=this.values.get(n),l=n.subtract(1),u=this.values.get(l),c=e.subtract(u).divide(s.subtract(u));return B(this.sizes.get(l),this.sizes.get(n),c)}]);return y(je(i),t,i)}};r([m(pe.ofType(o,8))],yt.prototype,"sizes",void 0),r([m(pe.ofType(o,8))],yt.prototype,"values",void 0);let Et=class extends Y{getSize(e,t){return y(je(e),t,e.multiply(this.unitValueToPixelsRatio))}};r([m(o)],Et.prototype,"unitValueToPixelsRatio",void 0);function Vn(a){return a.visualVariableSizeMinMaxValue!=null||a.visualVariableSizeScaleStops!=null||a.visualVariableSizeStops!=null||a.visualVariableSizeUnitValue!=null}function qt(a,e,t){if(Vn(a)){const i=a.getSizeValue(e);return a.visualVariableSizeMinMaxValue?.getSize(i,t)??a.visualVariableSizeScaleStops?.getSizeForViewScale(a.view.currentScale)??a.visualVariableSizeStops?.getSize(i,t)??a.visualVariableSizeUnitValue?.getSize(i,t)}return t}function Lt(a,e,t,i=new Pt(!1)){if(a.visualVariableColor==null)return t;const n=a.getColorValue(e);return a.visualVariableColor.getColor(n,t,i)}function Mt(a,e){if(a.visualVariableOpacity==null)return new o(1);const t=a.getOpacityValue(e);return a.visualVariableOpacity.getOpacity(t)}function Rn(a,e){if(a.visualVariableRotation==null)return G.identity();const t=a.getRotationValue(e);return a.visualVariableRotation.getVVRotationMat3(t)}function la(a,e){if(a.visualVariableRotation==null)return new o(0);const t=a.getRotationValue(e);return a.visualVariableRotation.getNormalizedAngle(t)}let Je=class extends ze{};r([v(3,g)],Je.prototype,"offset",void 0),r([v(4,S)],Je.prototype,"sizing",void 0),r([v(5,S)],Je.prototype,"value1Position2Value2",void 0),r([v(6,S)],Je.prototype,"animationPointerAndBaseSizeAndReferenceSize",void 0),r([v(7,g)],Je.prototype,"zoomRange",void 0),r([v(8,o)],Je.prototype,"lineLength",void 0);let Fn=class extends Ve{},ve=class extends ue{_vertexPreamble(e,t,i){const{id:n,offset:s,animationPointerAndBaseSizeAndReferenceSize:l,sizing:u}=e,c=l.xy,p=l.z,d=l.w,f=u.xy,h=this._getEvalParams(e,f,i);let _,x;if(e.value1Position2Value2){let U;U=this.hittestRequest?new o(0):xe(c,6,h).a;const ae=e.pos,be=e.value1Position2Value2.yz,ei=e.value1Position2Value2.x,Oi=e.value1Position2Value2.w,Nt=U.subtract(ei).divide(Oi.subtract(ei));x=ae.add(be.subtract(ae).multiply(Nt)),_=W(new o(1),Nt).add(W(new o(0),ee(Nt)))}else x=e.pos,_=new o(0);const b=u.z,T=K(e.bitset,ye.bitset.isStroke),C=u.w,w=K(e.bitset,ye.bitset.scaleSymbolsProportionally),P=xe(c,0,h),E=ce([N(K(e.bitset,ye.bitset.isMapAligned),new o(1)),this.view.rotation.divide(180).multiply(Math.PI)],[!0,new o(0)]),A=new Po(it(E),tt(E.multiply(-1)),tt(E),it(E)).multiply(P.xy),V=P.z.subtract(E).subtract(t),F=P.w,L=K(e.bitset,ye.bitset.isSDF),O=qt(this,n,new o(d)).divide(new o(d));return{baseSize:p,animationPointer:c,strokeWidth:b,isOutline:T,unscaledDistanceToPx:C,scaleSymbolsProportionally:w,isSDF:L,position:this._getScreenPosition({id:n,pos:x,offset:s,referenceSize:d,translation:A,rotation:V,scale:F,vvScale:O}),evalParams:h,vvScale:O,scale:F,clip:_}}_getScreenPosition(e){const{pos:t,translation:i,rotation:n,scale:s,offset:l,id:u,vvScale:c}=e,p=la(this,u).multiply(Math.PI/180),d=i.x.multiply(4/3),f=i.y.multiply(-1).multiply(4/3),h=tt(p),_=it(p),x=_.multiply(d).add(ee(h).multiply(f)),b=h.multiply(d).add(_.multiply(f)),T=tt(n.subtract(p)),C=it(n.subtract(p)),w=new o(0),P=new o(1),{pixelRatio:E}=this.animationInfo,A=new G(P,w,w,w,P,w,x.multiply(E),b.multiply(E),P),V=new G(C,T.multiply(-1),w,T,C,w,0,0,P),F=s.multiply(c).multiply(E).multiply(4/3),L=V.multiply(F),O=this.animationInfo.toScreen.multiply(new D(t,1)),U=A.multiply(O).xy,ae=L.multiply(new D(l,0)).xy;return U.add(ae)}_clip(e,t){let i=super.clip(e,t);const n=Le(this._getLocalTimeOrigin(e),new o(0));return Wi.forceGlobalTimeOrigin||(i=i.add(ce([n,()=>new o(2)],[!0,()=>new o(0)]))),i}_getLocalTimeOrigin(e){return this.getLocalTimeOrigin(e)}_toNdc(e){return this.animationInfo.toNdc.multiply(new D(e,1)).xy}_getEvalParams(e,t,i){const{globalTime:n,animationTextureSize:s}=this.animationInfo;return{globalTime:n,localTimeOrigin:this._getLocalTimeOrigin(e.id),animationTextureSize:s,animationTexture:this.animationTexture,pixelDimensions:t,lineLength:i}}_getColor(e,t){return y(N(t.isSDF,new o(1)),this._getSDFColor(e,t),this._getSpriteColor(e,t))}_getSpriteColor(e,t){return k(this.mosaicTexture,e).multiply(t.color)}_getSDFColor(e,t){const i=k(this.mosaicTexture,e),n=new o(.5).subtract(_i(i)).multiply(t.distanceToPx).multiply(An),s=_e(new o(.5).subtract(n),new o(0),new o(1)),l=t.color.multiply(s),u=t.outlineSize.multiply(.5),c=Qt(n).subtract(u),p=_e(new o(.5).subtract(c),new o(0),new o(1)),d=t.outlineColor.multiply(p);return new o(1).subtract(d.a).multiply(l).add(d)}};function xe(a,e,t){const i=a.add(new g(e,0)),n=k(t.animationTexture,i.add(.5).divide(t.animationTextureSize)).xy;return a=a.add(n),Ao({animationPointer:a,...t},S,null,s=>{const{out:l}=s;if(!l)throw new Error("out is null");return Mo({...s,out:l})})}r([m(Re)],ve.prototype,"mosaicInfo",void 0),r([m(ut)],ve.prototype,"animationInfo",void 0),r([m(_t)],ve.prototype,"localTileOffset",void 0),r([H($)],ve.prototype,"mosaicTexture",void 0),r([M(rt)],ve.prototype,"visualVariableColor",void 0),r([M(st)],ve.prototype,"visualVariableOpacity",void 0),r([M(Ft)],ve.prototype,"visualVariableSizeMinMaxValue",void 0),r([M(ht)],ve.prototype,"visualVariableSizeScaleStops",void 0),r([M(yt)],ve.prototype,"visualVariableSizeStops",void 0),r([M(Et)],ve.prototype,"visualVariableSizeUnitValue",void 0),r([M(hi)],ve.prototype,"visualVariableRotation",void 0),r([H($)],ve.prototype,"animationTexture",void 0);let di=class extends Je{};r([v(9,S)],di.prototype,"tlbr",void 0),r([v(10,o)],di.prototype,"angle",void 0);let pi=class extends Xt{};r([v(13,g)],pi.prototype,"nextPos1",void 0),r([v(14,g)],pi.prototype,"nextPos2",void 0);let En=class extends Fn{},Ln=class extends ve{constructor(){super(...arguments),this.computeAttributes={pos:["nextPos1","nextPos2"]}}_fragmentPoly(e){const t=Ke(e.uv,new o(1)),i=B(e.tlbr.xy,e.tlbr.zw,t);return this._getColor(i,{color:e.color,distanceToPx:e.distanceToPx,isSDF:e.isSDF,outlineColor:e.outlineColor,outlineSize:e.strokeWidth})}_vertexPoly(e){const{position:t,animationPointer:i,evalParams:n,isOutline:s,unscaledDistanceToPx:l,vvScale:u,strokeWidth:c,scaleSymbolsProportionally:p,scale:d,isSDF:f,baseSize:h,clip:_}=this._vertexPreamble(e,new o(0),e.lineLength||new o(0)),x=this._toNdc(t);let b=xe(i,1,n);b=new S(b.rgb.multiply(b.a),b.a);let T=y(at(e.bitset,ye.bitset.colorLocked),b,xe(i,2,n));T=new S(T.rgb.multiply(T.a),T.a);let C=xe(i,3,n);C=new S(C.rgb.multiply(C.a),C.a);const w=xe(i,4,n).a,P=xe(i,5,n).a,E=Lt(this,e.id,b,Se(at(e.bitset,ye.bitset.colorLocked),new Pt(s))),A=B(E,T,C),V=Mt(this,e.id),F=B(V,w,P),L=A.multiply(F),O=this.clip(e.id,e.zoomRange).add(_.multiply(2)),U=l.multiply(u);return{unscaledDistanceToPx:l,vvScale:u,strokeWidth:c,scaleSymbolsProportionally:p,scale:d,isSDF:f,baseSize:h,ndc:x,color:L,z:O,isOutline:s,evalParams:n,distanceToPx:U}}};function ua(a,e){return gt(a,wn(e))}function vt(a,e,t){const i=t.subtract(e),n=ua(a.subtract(e),i),s=_e(n.divide(nt(i)),new o(0),new o(1));return gi(a,e.add(s.multiply(t.subtract(e))))}function Z(a){const e=Qt(a);return W(e.x.add(e.y).add(e.z),new o(1.05))}function q(a,e,t,i){const n=new G(t.x.multiply(i.y).subtract(i.x.multiply(t.y)),i.x.multiply(e.y).subtract(e.x.multiply(i.y)),e.x.multiply(t.y).subtract(t.x.multiply(e.y)),t.y.subtract(i.y),i.y.subtract(e.y),e.y.subtract(t.y),i.x.subtract(t.x),e.x.subtract(i.x),t.x.subtract(e.x)),s=e.x.multiply(t.y.subtract(i.y)),l=t.x.multiply(i.y.subtract(e.y)),u=i.x.multiply(e.y.subtract(t.y)),c=s.add(l).add(u);return new o(1).divide(c).multiply(n.multiply(new D(1,a)))}function ca(a,e,t,i){return N(Z(q(a,e,t,i)),new o(1))}function yi(a,e,t,i){const n=t.subtract(e),s=i.subtract(e),l=Qo(n,s),u=te(ot(l,new o(rn)),R(l,new o(-rn)));return ce([te(Tn(u),ca(a.xy,e,t,i)),new o(-1)],[!0,()=>{const c=vt(a,e,t),p=vt(a,t,i),d=vt(a,i,e);return qe(qe(c,p),d)}])}function xi(a,e,t){const{viewMat3:i,tileMat3:n}=a.view,s=i.multiply(n),l=s.multiply(new D(e.pos,1)),u=s.multiply(new D(t.nextPos1,1)),c=s.multiply(new D(t.nextPos2,1));return yi(a.hittestRequest.position,l.xy,u.xy,c.xy)}function da(a,e,t){return gi(a,t).subtract(e)}function Te(a,e,t,i){const n=a.x,s=a.y,l=e.x,u=e.y,c=t.x,p=t.y,d=i.x,f=i.y,h=d.subtract(c),_=n.subtract(c),x=l.subtract(n),b=f.subtract(p),T=s.subtract(p),C=u.subtract(s),w=b.multiply(x).subtract(h.multiply(C)),P=h.multiply(T).subtract(b.multiply(_)).divide(w),E=x.multiply(T).subtract(C.multiply(_)).divide(w),A=te(Tn(N(w,new o(0))),te(te(de(P,new o(0)),Le(P,new o(1))),te(de(E,new o(0)),Le(E,new o(1)))));return y(A,new o(1),new o(0))}function Ci(a,e,t,i,n){return te(te(de(a.x,e),de(a.y,t)),te(ot(a.x,i),Le(a.y,n)))}function Mn(a,e,t,i){const n=i.xy,s=i.zw,l=new g(s.x,n.y),u=new g(n.x,s.y),c=qe(n.x,s.x),p=qe(n.y,s.y),d=ge(n.x,s.x),f=ge(n.y,s.y),h=q(new g(c,p),a,e,t),_=q(new g(d,f),a,e,t),x=q(new g(c,f),a,e,t),b=q(new g(d,p),a,e,t),T=te(N(Z(h),new o(1)),te(N(Z(_),new o(1)),te(N(Z(x),new o(1)),N(Z(b),new o(1))))),C=Te(n,l,a.xy,e.xy).add(Te(l,s,a.xy,e.xy)).add(Te(u,s,a.xy,e.xy)).add(Te(u,n,a.xy,e.xy)),w=Te(n,l,a.xy,t.xy).add(Te(l,s,a.xy,t.xy)).add(Te(u,s,a.xy,t.xy)).add(Te(u,n,a.xy,t.xy)),P=Te(n,l,e.xy,t.xy).add(Te(l,s,e.xy,t.xy)).add(Te(u,s,e.xy,t.xy)).add(Te(u,n,e.xy,t.xy)),E=Ci(a.xy,c,p,d,f),A=Ci(e.xy,c,p,d,f),V=Ci(t.xy,c,p,d,f),F=te(E,te(A,V));return{hasIntersectingSegments:Se(R(C,new o(0)),Se(R(w,new o(0)),R(P,new o(0)))),allTriangleVerticesInside:F,triangleContainsRect:T}}function Nn(a,e,t,i){const{hasIntersectingSegments:n,allTriangleVerticesInside:s,triangleContainsRect:l}=Mn(a,e,t,i);return y(n,new o(Cn),y(Se(s,l),new o(fe),new o(X)))}function lt(a,e,t,i){const{hasIntersectingSegments:n,allTriangleVerticesInside:s,triangleContainsRect:l}=Mn(a,e,t,i);return y(Se(n,Se(s,l)),new o(fe),new o(X))}function Xe(a){return te(de(a.tlbr.x,new o(0)),de(a.tlbr.y,new o(0)),de(a.tlbr.z,new o(0)),de(a.tlbr.w,new o(0)))}let Dt=class extends ze{};r([v(3,S)],Dt.prototype,"color",void 0),r([v(4,g)],Dt.prototype,"zoomRange",void 0);let Ue=class extends ue{constructor(){super(...arguments),this.type="FillShader",this.computeAttributes={pos:["nextPos1","nextPos2"]}}vertex(e,t){const i=Mt(this,e.id),n=Lt(this,e.id,e.color).multiply(i),s=this.view.displayViewScreenMat3.multiply(new D(e.pos.xy,1)),l=this.clip(e.id,e.zoomRange);return{glPosition:new S(s.xy,l,1),color:n,...this.maybeRunHittest(e,t,null)}}fragment(e){return this.getFragmentOutput(e.color,e,new o(0))}hittest(e,t){const{pos0:i,pos1:n,pos2:s}=this.computeHittestTriangle(e,t,null),l=Xe(this.hittestRequest);return y(l,()=>{const{tlbr:u}=this.hittestRequest;return lt(i,n,s,u)},()=>{const u=xi(this,e,t);return y(R(u,this.hittestRequest.distance),new o(X),new o(fe))})}};r([M(rt)],Ue.prototype,"visualVariableColor",void 0),r([M(st)],Ue.prototype,"visualVariableOpacity",void 0),r([I(0,z(Dt)),I(1,z(Ce))],Ue.prototype,"vertex",null),r([I(0,z(Ve))],Ue.prototype,"fragment",null);let ct=class extends Dt{};r([v(5,S)],ct.prototype,"tlbr",void 0),r([v(6,o)],ct.prototype,"width",void 0),r([v(7,o)],ct.prototype,"height",void 0),r([v(8,g)],ct.prototype,"offset",void 0),r([v(9,g)],ct.prototype,"scale",void 0),r([v(10,o)],ct.prototype,"angle",void 0);class pa extends Ve{}function $n(a,e,t,i,n){const s=N(K(n,$o),De(1)),l=_i(new S(a,0));return y(s,en(i.divide(e.x),t.divide(e.y),0,ee(t.divide(e.x)),i.divide(e.y),0,ln(tn(l,0)),ln(tn(0,l)),1),en(i.divide(e.x),t.divide(e.y),0,ee(t.divide(e.x)),i.divide(e.y),0,0,0,1))}function Bn(a,e){const t=a.view.requiredZoomFactor,i=new g(e.width,e.height),n=i.multiply(e.scale).multiply(t),s=e.angle.multiply(ki),l=tt(s),u=it(s),c=$n(e.id,n,l,u,e.bitset),p=a.localTileOffset.getPatternOffsetAtTileOrigin(i,l,u),d=t.multiply(e.scale).multiply(e.offset.subtract(p)).divide(n),f=new D(e.pos,1),h=c.multiply(f).xy.subtract(d),_=e.tlbr.divide(a.mosaicInfo.size.xyxy);let x=K(e.bitset,Pn);return a.visualVariableColor!=null&&(x=y(je(a.getColorValue(e.id)),new o(0),x)),{tileTextureCoord:h,tlbr:_,sampleAlphaOnly:x}}function Hn(a,e){const t=Ke(e.tileTextureCoord,new o(1)),i=B(e.tlbr.xy,e.tlbr.zw,t);let n=k(a.mosaicTexture,i);return n=y(R(e.sampleAlphaOnly,new o(.5)),n.aaaa,n),e.color.multiply(n)}let wt=class extends Ue{constructor(){super(...arguments),this.type="ComplexFillShader"}vertex(e,t){return{...super.vertex(e,t),...Bn(this,e)}}fragment(e){const t=Hn(this,e);return this.getFragmentOutput(t,e,new o(0))}};r([m(Re)],wt.prototype,"mosaicInfo",void 0),r([H($)],wt.prototype,"mosaicTexture",void 0),r([m(_t)],wt.prototype,"localTileOffset",void 0),r([I(0,z(ct)),I(1,z(Ce))],wt.prototype,"vertex",null),r([I(0,z(pa))],wt.prototype,"fragment",null);let Ri=class extends Ln{constructor(){super(...arguments),this.type="AnimatedFillShader"}vertex(e,t){const{distanceToPx:i,ndc:n,z:s,color:l,isOutline:u,strokeWidth:c,isSDF:p,scale:d,scaleSymbolsProportionally:f}=this._vertexPoly(e),h=this.view.requiredZoomFactor,_=e.sizing.xy,x=_.multiply(h),b=e.angle?e.angle.multiply(ki):new o(0),T=tt(b),C=it(b),w=$n(e.id,x,T,C,e.bitset),P=this.localTileOffset.getPatternOffsetAtTileOrigin(_,T,C),E=h.multiply(e.offset.subtract(P)).divide(x),A=new D(e.pos,1),V=w.multiply(A).xy.subtract(E),F=e.tlbr.divide(this.mosaicInfo.size.xyxy);return{glPosition:new S(n,s,1),tlbr:F,uv:V,color:l.multiply(new o(1).subtract(u)),outlineColor:l.multiply(u),distanceToPx:i,strokeWidth:c.multiply(B(new o(1),d,f)),isOutline:u,isSDF:p,...this.maybeRunHittest(e,t,{})}}fragment(e){const t=this._fragmentPoly(e);return this.getFragmentOutput(t,e)}hittest(e,t,i){const{pos0:n,pos1:s,pos2:l}=this.computeHittestTriangle(e,t,null),u=Xe(this.hittestRequest);return y(u,()=>{const{tlbr:c}=this.hittestRequest;return lt(n,s,l,c)},()=>{const c=xi(this,e,t);return y(R(c,this.hittestRequest.distance),new o(X),new o(fe))})}};r([I(0,z(di)),I(1,z(pi))],Ri.prototype,"vertex",null),r([I(0,z(En))],Ri.prototype,"fragment",null);let ke=class extends ze{};r([v(3,S)],ke.prototype,"color",void 0),r([v(4,g)],ke.prototype,"offset",void 0),r([v(5,g)],ke.prototype,"normal",void 0),r([v(6,o)],ke.prototype,"halfWidth",void 0),r([v(7,o)],ke.prototype,"referenceHalfWidth",void 0),r([v(8,g)],ke.prototype,"zoomRange",void 0);let Gn=class extends Ve{},jt=class extends Y{};function Ui(a){return ge(new o(Bo).multiply(W(a,new o(Ho))),new o(1))}function Si(a,e){const{halfWidth:t,normal:i}=a,n=Ui(t),s=nt(i).multiply(t);return _e(n.multiply(t.subtract(s)).divide(e.add(n).subtract(new o(1))),new o(0),new o(1))}function fa(a,e){const{id:t,halfWidth:i,referenceHalfWidth:n}=e;if(Vn(a)){const s=new o(2).multiply(n),l=qt(a,t,s),u=new o(Go),c=y(R(i,u),i.divide(ge(n,u)),new o(1));return new o(.5).multiply(c).multiply(l)}return i}function bi(a,e){const{id:t,offset:i,pos:n,normal:s,zoomRange:l}=e,{displayViewScreenMat3:u,displayViewMat3:c}=a.view,p=Lt(a,t,e.color),d=Mt(a,t),f=fa(a,e),h=new o(.5).multiply(a.antialiasingControls.antialiasing),_=ge(f.add(h),new o(.45)).add(new o(.1).multiply(h)),x=Ui(_).multiply(_).multiply(i).multiply(a.view.scaleFactor),b=c.multiply(new D(x,new o(0))),T=u.multiply(new D(n,new o(1))).add(b),C=new o(2).multiply(W(f,new o(0))).add(a.clip(t,l)),w=new S(T.xy,C,1);return{color:p,opacity:d,halfWidth:_,normal:s,scaledOffset:x,scaledHalfWidth:f,glPosition:new S(w.xy,C,1)}}function Ti(a,e){const{opacity:t,color:i}=a,n=Si(a,e);return t.multiply(i).multiply(n)}r([m(o)],jt.prototype,"antialiasing",void 0),r([m(o)],jt.prototype,"blur",void 0);class Ie extends ue{constructor(){super(...arguments),this.type="LineShader",this.computeAttributes={pos:["nextPos1","nextPos2"]}}vertex(e,t){const i=bi(this,e);return{...i,...this.maybeRunHittest(e,t,i.halfWidth)}}fragment(e){const t=Ti(e,this.antialiasingControls.blur);return this.getFragmentOutput(t,e)}hittest(e,t,i){const{pos0:n,pos1:s,pos2:l}=this.computeHittestTriangle(e,t,null),u=Xe(this.hittestRequest),{distance:c,smallSymbolDistance:p,smallSymbolSizeThreshold:d,tlbr:f}=this.hittestRequest,h=W(i,d.multiply(.5)).multiply(c.subtract(p)),_=this.hittestRequest.position,x=qe(vt(_,n,s),vt(_,n,l)).subtract(i).add(h);return y(u,lt(n,s,l,f),y(R(x,c),new o(X),new o(fe)))}}r([m(jt)],Ie.prototype,"antialiasingControls",void 0),r([M(rt)],Ie.prototype,"visualVariableColor",void 0),r([M(st)],Ie.prototype,"visualVariableOpacity",void 0),r([M(Ft)],Ie.prototype,"visualVariableSizeMinMaxValue",void 0),r([M(ht)],Ie.prototype,"visualVariableSizeScaleStops",void 0),r([M(yt)],Ie.prototype,"visualVariableSizeStops",void 0),r([M(Et)],Ie.prototype,"visualVariableSizeUnitValue",void 0),r([I(0,z(ke)),I(1,z(Ce))],Ie.prototype,"vertex",null),r([I(0,z(Gn))],Ie.prototype,"fragment",null);let ni=class extends di{};r([v(10,o)],ni.prototype,"accumulatedDistance",void 0),r([v(11,g)],ni.prototype,"normal",void 0),r([v(12,g)],ni.prototype,"segmentDirection",void 0);let ma=class extends En{};class oi extends Ln{constructor(){super(...arguments),this.type="AnimatedLineShader"}vertex(e,t){const{animationPointerAndBaseSizeAndReferenceSize:i}=e,n=i.xy,{distanceToPx:s,ndc:l,z:u,color:c,isOutline:p,strokeWidth:d,isSDF:f,baseSize:h,scale:_,scaleSymbolsProportionally:x,evalParams:b}=this._vertexPoly(e),T=e.sizing.xy,C=T.x.multiply(h).divide(T.y),w=xe(n,6,b).a,P=e.accumulatedDistance.subtract(w),{normal:E}=e,A=e.normal.y,V=P.divide(this.view.displayZoomFactor).add(gt(e.segmentDirection,e.offset)).divide(C),F=A.add(1).divide(2),L=new g(V,F),O=e.tlbr.divide(this.mosaicInfo.size.xyxy),U=h.divide(2),ae=new o(.5).multiply(this.antialiasingControls.antialiasing),be=ge(U.add(ae),new o(.45)).add(new o(.1).multiply(ae));return{glPosition:new S(l,u,1),tlbr:O,uv:L,color:c.multiply(new o(1).subtract(p)),outlineColor:c.multiply(p),distanceToPx:s,strokeWidth:d.multiply(B(new o(1),_,x)),isOutline:p,isSDF:f,halfWidth:be,normal:E,...this.maybeRunHittest(e,t,be)}}fragment(e){const t=this._fragmentPoly(e),i=Si(e,this.antialiasingControls.blur),{halfWidth:n,normal:s}=e,l=Ui(n),u=nt(s).multiply(n),c=_e(l.multiply(n.subtract(u)).divide(l.subtract(new o(1))),new o(0),new o(1));return this.getFragmentOutput(t.multiply(c).multiply(i),e)}hittest(e,t,i){const{pos0:n,pos1:s,pos2:l}=this.computeHittestTriangle(e,t,null),u=Xe(this.hittestRequest),{distance:c,smallSymbolDistance:p,smallSymbolSizeThreshold:d,tlbr:f}=this.hittestRequest,h=W(i,d.multiply(.5)).multiply(c.subtract(p)),_=this.hittestRequest.position,x=qe(vt(_,n,s),vt(_,n,l)).subtract(i).add(h);return y(u,lt(n,s,l,f),y(R(x,c),new o(X),new o(fe)))}}r([m(jt)],oi.prototype,"antialiasingControls",void 0),r([I(0,z(ni)),I(1,z(pi))],oi.prototype,"vertex",null),r([I(0,z(ma))],oi.prototype,"fragment",null);let Fi=class extends Je{};r([v(9,g)],Fi.prototype,"uv",void 0),r([v(10,o)],Fi.prototype,"angle",void 0);let $t=class extends Xt{};r([v(11,g)],$t.prototype,"offsetNextVertex1",void 0),r([v(12,g)],$t.prototype,"offsetNextVertex2",void 0),r([v(13,g)],$t.prototype,"textureUVNextVertex1",void 0),r([v(14,g)],$t.prototype,"textureUVNextVertex2",void 0);let va=class extends Fn{};function Me(a,e,t,i){return e.multiply(a.x).add(t.multiply(a.y)).add(i.multiply(a.z))}let fi=class extends ve{constructor(){super(...arguments),this.type="AnimatedMarkerShader",this.computeAttributes={offset:["offsetNextVertex1","offsetNextVertex2"],uv:["textureUVNextVertex1","textureUVNextVertex2"]}}vertex(e,t){const i=e.uv.divide(this.mosaicInfo.size),{position:n,animationPointer:s,evalParams:l,isOutline:u,unscaledDistanceToPx:c,vvScale:p,strokeWidth:d,scaleSymbolsProportionally:f,scale:h,isSDF:_,baseSize:x,clip:b}=this._vertexPreamble(e,e.angle,e.lineLength||new o(0)),T=this._toNdc(n);let C=xe(s,1,l);C=new S(C.rgb.multiply(C.a),C.a);let w=y(at(e.bitset,ye.bitset.colorLocked),C,xe(s,2,l));w=new S(w.rgb.multiply(w.a),w.a);let P=xe(s,3,l);P=new S(P.rgb.multiply(P.a),P.a);const E=xe(s,4,l).a,A=xe(s,5,l).a,V=Lt(this,e.id,C,Se(at(e.bitset,ye.bitset.colorLocked),new Pt(u))),F=B(V,w,P),L=Mt(this,e.id),O=B(L,E,A),U=F.multiply(O),ae=this.clip(e.id,e.zoomRange).add(b.multiply(2)),be=c.multiply(p);return{glPosition:new S(T,ae,1),uv:i,color:U.multiply(new o(1).subtract(u)),outlineColor:U.multiply(u),distanceToPx:be,strokeWidth:d.multiply(B(new o(1),h,f)),isOutline:u,isSDF:_,...this.maybeRunHittest(e,t,{pos:e.pos,size:x,sizeCorrection:new o(1),isMapAligned:new o(1),vvRotationMat3:new G(1,0,0,0,1,0,0,0,1),placementMat3:new G(1,0,0,0,1,0,0,0,1),outlineSize:new o(1),distanceToPx:be,isSDF:_})}}fragment(e){let t=this._getColor(e.uv,{color:e.color,distanceToPx:e.distanceToPx,isSDF:e.isSDF,outlineColor:e.outlineColor,outlineSize:e.strokeWidth});return Wi.spotlightAnimatedSymbols&&(t=t.add(new S(0,.3,0,.3))),this.getFragmentOutput(t,e)}hittest(e,t,i){const{pos0:n,pos1:s,pos2:l}=this.computeHittestTriangle(e,t,i),u=Xe(this.hittestRequest);return y(u,()=>{const{tlbr:c}=this.hittestRequest;return Nn(n,s,l,c)},()=>y(ot(i.size,this.hittestRequest.smallSymbolSizeThreshold),this._hittestSmallMarker(e,t,i),this._hittestMarker(e,t,i)))}_hittestSmallMarker(e,t,i){const{position:n,distance:s,smallSymbolDistance:l}=this.hittestRequest,u=s.subtract(l),{viewMat3:c,tileMat3:p}=this.view,d=c.multiply(p).multiply(new D(i.pos,1)).xy,f=i.size.multiply(.5),h=gi(d,n).subtract(f).add(u);return y(R(h,this.hittestRequest.distance),new o(X),new o(fe))}_hittestMarker(e,t,i){const n=this._vertexPreamble({...e},e.angle,new o(0)).position,s=this._vertexPreamble({...e,offset:t.offsetNextVertex1},e.angle,new o(0)).position,l=this._vertexPreamble({...e,offset:t.offsetNextVertex2},e.angle,new o(0)).position,u=this.hittestRequest.position,c=this.hittestRequest.distance,p=yi(u,n,s,l);return y(R(p,c),new o(X),this._hittestSamples(n,s,l,e,t,i))}_hittestSamples(e,t,i,n,s,l){const{outlineSize:u,isSDF:c,distanceToPx:p}=l,d=this.hittestRequest.position,f=this.hittestRequest.distance,h=q(d.add(new g(ee(f),ee(f))),e,t,i),_=q(d.add(new g(0,ee(f))),e,t,i),x=q(d.add(new g(f,ee(f))),e,t,i),b=q(d.add(new g(ee(f),0)),e,t,i),T=q(d,e,t,i),C=q(d.add(new g(f,0)),e,t,i),w=q(d.add(new g(ee(f),f)),e,t,i),P=q(d.add(new g(0,f)),e,t,i),E=q(d.add(new g(f,f)),e,t,i),A=n.uv.divide(this.mosaicInfo.size),V=s.textureUVNextVertex1.divide(this.mosaicInfo.size),F=s.textureUVNextVertex2.divide(this.mosaicInfo.size),L={color:new S(1,1,1,1),outlineSize:u,outlineColor:new S(1,1,1,1),isSDF:c,distanceToPx:p};let O=new o(0);return O=O.add(Z(h).multiply(this._getColor(Me(h,A,V,F),L).a)),O=O.add(Z(_).multiply(this._getColor(Me(_,A,V,F),L).a)),O=O.add(Z(x).multiply(this._getColor(Me(x,A,V,F),L).a)),O=O.add(Z(b).multiply(this._getColor(Me(b,A,V,F),L).a)),O=O.add(Z(T).multiply(this._getColor(Me(T,A,V,F),L).a)),O=O.add(Z(C).multiply(this._getColor(Me(C,A,V,F),L).a)),O=O.add(Z(w).multiply(this._getColor(Me(w,A,V,F),L).a)),O=O.add(Z(P).multiply(this._getColor(Me(P,A,V,F),L).a)),O=O.add(Z(E).multiply(this._getColor(Me(E,A,V,F),L).a)),y(R(O,new o(.05)),new o(fe),new o(X))}};r([I(0,z(Fi)),I(1,z($t))],fi.prototype,"vertex",null),r([I(0,z(va))],fi.prototype,"fragment",null);let oe=class extends On{constructor(){super(...arguments),this.symbologyPlane=0,this._input=null}};function St(a){const e=1/a;return{antialiasing:e,blur:0+e}}let wi=class extends oe{render(e,t){const{context:i,painter:n,pixelRatio:s}=e,{target:l}=t,{freezeGlobalTime:u}=Wi,c=0,p=n.textureManager.animationStore.getTexture(i,c),d=[2/e.state.size[0],0,0,0,-2/e.state.size[1],0,-1,1,1],f=Array.from(po(Xi(),d)),h=Array.from(fo(Xi(),f,l.transforms.displayViewScreenMat3)),_=t.instance.getInput(),x=n.textureManager.getMosaicInfo(e,t.textureKey,!1),{optionalAttributes:b}=_,T=b.zoomRange,C=b.value1Position2Value2,w="accumulatedDistance"in b&&b.accumulatedDistance,P="segmentDirection"in b&&b.segmentDirection,E="normal"in b&&b.normal;n.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,_.uniforms),...Q(e,t.target),antialiasingControls:St(s),mosaicInfo:x,animationInfo:{globalTime:e.animationsEnabled?u===!1?e.time/1e3:u:0,animationTextureSize:[p.descriptor.width,p.descriptor.height],toScreen:h,toNdc:d,mapRotation:e.state.rotation,pixelRatio:e.state.pixelRatio},localTileOffset:Kt(t.target)},textures:{...ie(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey,!1),animationTexture:{unit:6,texture:p}},defines:{...J(e)},optionalAttributes:{zoomRange:T,value1Position2Value2:C,accumulatedDistance:w,segmentDirection:P,normal:E},useComputeBuffer:j(e)}),n.setPipelineState({...ne(e)}),n.submitDraw(e,t),u===!1&&e.animationsEnabled&&l.requestRender()}},ga=class extends wi{constructor(){super(...arguments),this.type=2,this.symbologyPlane=2,this.shaders={geometry:new fi}}},_a=class extends wi{constructor(){super(...arguments),this.type=3,this.symbologyPlane=2,this.shaders={geometry:new fi}}},ha=class extends wi{constructor(){super(...arguments),this.type=0,this.symbologyPlane=0,this.shaders={geometry:new Ri}}},ya=class extends wi{constructor(){super(...arguments),this.type=1,this.symbologyPlane=1,this.shaders={geometry:new oi}}},Yn=class extends Rt{};r([v(0,g)],Yn.prototype,"pos",void 0);class xa extends Ve{}let kn=class extends Y{};r([m(o)],kn.prototype,"dotSize",void 0);let Ei=class extends Y{};r([m(o)],Ei.prototype,"pixelRatio",void 0),r([m(o)],Ei.prototype,"tileZoomFactor",void 0);const Sa=1e-6;class dt extends Vt{constructor(){super(...arguments),this.type="DotDensityPointShader"}vertex(e){const t=new G(1,0,0,0,-1,0,0,1,1).multiply(new D(e.pos.xy.divide(he),1)),i=k(this.drawLocations,t.xy),n=ge(this.instance.dotSize.divide(2),new o(1));let s=new o(0);s=s.add(W(i.a,new o(Sa)).multiply(2));let l=n.add(this.instance.dotSize);const u=this.view.displayViewScreenMat3.multiply(new D(e.pos.add(.5),1)),c=new S(u.xy,s,1),p=this.instance.dotSize.divide(l),d=new o(-1).divide(n.divide(l));return l=l.multiply(this.draw.pixelRatio.multiply(this.draw.tileZoomFactor)),{glPosition:c,glPointSize:l,color:i,ratio:p,invEdgeRatio:d}}fragment(e){const t=nt(e.glPointCoord.subtract(.5)).multiply(2),i=In(new o(0),new o(1),e.invEdgeRatio.multiply(t.subtract(e.ratio)).add(1)),n=new xt;return n.fragColor=e.color.multiply(i),n}}r([m(kn)],dt.prototype,"instance",void 0),r([m(Ei)],dt.prototype,"draw",void 0),r([m(re)],dt.prototype,"view",void 0),r([H($)],dt.prototype,"drawLocations",void 0),r([I(0,z(Yn))],dt.prototype,"vertex",null),r([I(0,z(xa))],dt.prototype,"fragment",null);let Wn=class extends ze{};r([v(3,o)],Wn.prototype,"inverseArea",void 0);let ai=class extends Y{};r([m(pe.ofType(S,2))],ai.prototype,"isActive",void 0),r([m(pe.ofType(S,8))],ai.prototype,"colors",void 0),r([m(o)],ai.prototype,"dotValue",void 0);let ri=class extends Y{};r([m(o)],ri.prototype,"tileZoomFactor",void 0),r([m(o)],ri.prototype,"pixelRatio",void 0),r([m(o)],ri.prototype,"tileDotsOverArea",void 0);class Li extends bn{}r([H($)],Li.prototype,"dotTexture0",void 0),r([H($)],Li.prototype,"dotTexture1",void 0);let pt=class extends ue{constructor(){super(...arguments),this.type="DotDensityPolygonShader"}_dotThreshold(e,t,i){return e.divide(t).divide(i)}vertex(e){const t=new G(2/he,0,0,0,-2/he,0,-1,1,1).multiply(new D(e.pos,1)),i=this.clip(e.id),n=new S(t.xy,i,1),s=this.getVVData(e.id).multiply(this.instance.isActive.get(0)).multiply(e.inverseArea),l=this.storageTextures.getDataDrivenData0(this.getAttributeDataCoords(e.id)).multiply(this.instance.isActive.get(1)).multiply(e.inverseArea),u=this.draw.tileZoomFactor.multiply(he).divide(this.draw.pixelRatio),c=this._dotThreshold(s,this.instance.dotValue,this.draw.tileDotsOverArea),p=this._dotThreshold(l,this.instance.dotValue,this.draw.tileDotsOverArea),d=e.pos.add(.5).divide(u);return{glPosition:n,color:new S(0,0,0,0),textureCoords:d,thresholds0:c,thresholds1:p}}fragment(e){const t=new xt,i=k(this.drawTextures.dotTexture0,e.textureCoords),n=k(this.drawTextures.dotTexture1,e.textureCoords),s=e.thresholds0.subtract(i),l=e.thresholds1.subtract(n);let u;const c=ci.fromColumns(this.instance.colors.get(0),this.instance.colors.get(1),this.instance.colors.get(2),this.instance.colors.get(3)),p=ci.fromColumns(this.instance.colors.get(4),this.instance.colors.get(5),this.instance.colors.get(6),this.instance.colors.get(7));if(this.blending){const d=W(new o(0),s),f=W(new o(0),l),h=gt(d,s).add(gt(f,l)),_=W(h,new o(0)),x=new o(1).subtract(_),b=h.add(_),T=s.multiply(d).divide(b),C=l.multiply(f).divide(b),w=c.multiply(T).add(p.multiply(C));u=x.multiply(w)}else{const d=ge(un(s),un(l)),f=W(d,new o(0)),h=new o(1).subtract(f),_=W(d,s),x=W(d,l),b=c.multiply(_).add(p.multiply(x));u=h.multiply(b)}return t.fragColor=u,t}hittest(e){return new o(X)}};r([le],pt.prototype,"blending",void 0),r([m(ai)],pt.prototype,"instance",void 0),r([m(ri)],pt.prototype,"draw",void 0),r([H(Li)],pt.prototype,"drawTextures",void 0),r([I(0,z(Wn))],pt.prototype,"vertex",null),r([I(0,z(Ve))],pt.prototype,"fragment",null);const ba={pos:{count:2,type:vo.UNSIGNED_SHORT}};let Ta=class{constructor(){this._dotTextureSize=0,this._dotTextures=null,this._dotMesh=null}destroy(){this._disposeTextures(),this._dotFBO?.dispose(),this._dotMesh?.destroy()}getFBO(e){if(this._dotFBO==null){const t=he,i=he,n=new ui(t,i);n.samplingMode=9728,n.wrapMode=33071;const s=new mo(e,new gn(_n.DEPTH24_STENCIL8,t,i));this._dotFBO=new hn(e,n,s)}return this._dotFBO}getDotDensityMesh(e){if(this._dotMesh==null){const t=he,i=t*t,n=2,s=new Int16Array(i*n);for(let l=0;l<t;l++)for(let u=0;u<t;u++)s[n*(u+l*t)]=u,s[n*(u+l*t)+1]=l;this._dotMesh=ea.create(e,{primitive:go.POINTS,vertex:s,count:i,layout:ba})}return this._dotMesh}getDotDensityTextures(e,t,i){if(this._dotTextureSize===t&&this._seed===i||(this._disposeTextures(),this._dotTextureSize=t,this._seed=i),this._dotTextures===null){const n=new _o(i);this._dotTextures=[this._allocDotDensityTexture(e,t,n),this._allocDotDensityTexture(e,t,n)]}return this._dotTextures}_disposeTextures(){if(this._dotTextures){for(let e=0;e<this._dotTextures.length;e++)this._dotTextures[e].dispose();this._dotTextures=null}}_allocDotDensityTexture(e,t,i){const n=new Float32Array(t*t*4);for(let l=0;l<n.length;l++)n[l]=i.getFloat();const s=new ui(t);return s.dataType=xn.FLOAT,s.samplingMode=9728,new yn(e,s,n)}},wa=class extends oe{constructor(){super(...arguments),this.type=12,this.shaders={polygon:new pt,point:new dt,fill:new Ue},this._resources=new Map}render(e,t){Sn(e)||j(e)?this._renderPolygons(e,t):this._renderDotDensity(e,t)}_renderPolygons(e,t){const{painter:i}=e;i.setShader({shader:this.shaders.fill,uniforms:{...Q(e,t.target),visualVariableColor:null,visualVariableOpacity:null},textures:ie(e),defines:{...J(e)},optionalAttributes:{zoomRange:!1},useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}_renderDotDensity(e,t){const{context:i,painter:n,requiredLevel:s}=e,l=t.instance.getInput().uniforms,u=this._getOrCreateResourcesRecord(i),c=u.getDotDensityTextures(i,he,l.seed),p=1/2**(s-t.target.key.level),d=he,f=d*window.devicePixelRatio*d*window.devicePixelRatio,h=1/p*(1/p),_=l.dotScale?e.state.scale/l.dotScale:1,x=l.dotValue*_*h;n.setShader({shader:this.shaders.polygon,uniforms:{...Q(e,t.target),instance:{isActive:l.isActive,colors:l.colors,dotValue:Math.max(1,x)},draw:{tileZoomFactor:p,pixelRatio:window.devicePixelRatio,tileDotsOverArea:f/(he*window.devicePixelRatio*he*window.devicePixelRatio)}},textures:{...ie(e),drawTextures:{dotTexture0:{unit:Ji,texture:c[0]},dotTexture1:{unit:ho,texture:c[1]}}},defines:{...J(e),blending:l.blending},optionalAttributes:{},useComputeBuffer:!1});const b=i.getViewport();i.setViewport(0,0,he,he);const T=i.boundFramebuffer,C=u.getFBO(i);i.bindFramebuffer(C),i.setClearColor(0,0,0,0),i.clear(16384),n.setPipelineState({color:{write:[!0,!0,!0,!0],blendMode:"composite"},depth:!1,stencil:!1}),n.updatePipelineState(i),n.submitDraw(e,t),i.bindFramebuffer(T),i.setViewport(b.x,b.y,b.width,b.height);const w=u.getFBO(i).colorTexture,P={shader:this.shaders.point,uniforms:{view:yo(e,t.target),instance:{dotSize:l.dotSize},draw:{tileZoomFactor:1,pixelRatio:window.devicePixelRatio}},textures:{drawLocations:{unit:Ji,texture:w}},defines:{...J(e)},optionalAttributes:{},useComputeBuffer:!1};n.setPipelineState(ne(e)),n.submitDrawMesh(i,P,u.getDotDensityMesh(i),{stencilRef:t.getStencilReference()})}shutdown(e){super.shutdown(e),this._resources.get(e)?.destroy(),this._resources.delete(e)}_getOrCreateResourcesRecord(e){let t=this._resources.get(e);return t==null&&(t=new Ta,this._resources.set(e,t)),t}},Oa=class extends oe{constructor(){super(...arguments),this.type=10,this.shaders={geometry:new wt}}render(e,t){const{painter:i}=e,n=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,n.uniforms),...Q(e,t.target),mosaicInfo:i.textureManager.getMosaicInfo(e,t.textureKey),localTileOffset:Kt(t.target)},textures:{...ie(e),mosaicTexture:i.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...J(e)},optionalAttributes:n.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}},Qe=class extends ze{};r([v(3,g)],Qe.prototype,"offset",void 0),r([v(4,S)],Qe.prototype,"color",void 0),r([v(5,g)],Qe.prototype,"normal",void 0),r([v(6,o)],Qe.prototype,"halfWidth",void 0),r([v(7,o)],Qe.prototype,"referenceHalfWidth",void 0),r([v(8,g)],Qe.prototype,"zoomRange",void 0);let Un=class extends Gn{};function Zi(a,e,t){const{id:i,bitset:n}=e,s=K(n,Yo),l=R(s,new o(.5)),u=bi(a,e),c=y(l,u.halfWidth,new o(0)),p=Mt(a,i),d=Lt(a,i,e.color),f=y(l,y(at(n,ko),d,e.color),d.multiply(p)),h=a.view.displayViewScreenMat3.multiply(new D(e.pos.xy,1)),_=a.clip(e.id),x=new S(h.xy,_,1),b=y(l,u.glPosition,x),T=t&&a.maybeRunHittest(e,t,l);return{isOutline:s,color:f,opacity:new o(1),halfWidth:c,normal:u.normal,glPosition:b,...T}}let Ge=class extends ue{constructor(){super(...arguments),this.computeAttributes={pos:["nextPos1","nextPos2"]}}};r([m(jt)],Ge.prototype,"antialiasingControls",void 0),r([M(rt)],Ge.prototype,"visualVariableColor",void 0),r([M(st)],Ge.prototype,"visualVariableOpacity",void 0),r([M(Ft)],Ge.prototype,"visualVariableSizeMinMaxValue",void 0),r([M(ht)],Ge.prototype,"visualVariableSizeScaleStops",void 0),r([M(yt)],Ge.prototype,"visualVariableSizeStops",void 0),r([M(Et)],Ge.prototype,"visualVariableSizeUnitValue",void 0);class mi extends Ge{constructor(){super(...arguments),this.type="OutlineFillShader"}vertex(e,t){return Zi(this,e,t)}fragment(e){const{color:t,isOutline:i}=e,n=R(i,new o(.5)),s=Ti(e,this.antialiasingControls.blur),l=y(n,s,t),u=y(n,new o(1/255),new o(0));return this.getFragmentOutput(l,e,u)}hittest(e,t,i){const{pos0:n,pos1:s,pos2:l}=this.computeHittestTriangle(e,t,null),u=Xe(this.hittestRequest);return y(u,()=>{const{tlbr:c}=this.hittestRequest;return lt(n,s,l,c)},()=>{const c=xi(this,e,t);return y(Se(i,R(c,this.hittestRequest.distance)),new o(X),new o(fe))})}}r([I(0,z(Qe)),I(1,z(Ce))],mi.prototype,"vertex",null),r([I(0,z(Un))],mi.prototype,"fragment",null);let Mi=class extends Dt{};r([v(5,S)],Mi.prototype,"tlbr",void 0),r([v(6,o)],Mi.prototype,"inverseRasterizationScale",void 0);let Ia=class extends Ve{};function za(a){const e=new o(1),t=new o(0);return new G(e.divide(a.x),t.divide(a.y),0,ee(t.divide(a.x)),e.divide(a.y),0,0,0,1)}function Zn(a,e){const t=e.tlbr.xy,i=e.tlbr.zw,n=i.x.subtract(t.x),s=t.y.subtract(i.y),l=new g(n,s).multiply(e.inverseRasterizationScale),u=l.multiply(a.view.requiredZoomFactor),c=za(u),p=a.localTileOffset.getPatternOffsetAtTileOrigin(l).divide(u),d=new D(e.pos,1);return{tileTextureCoord:c.multiply(d).xy.subtract(p),tlbr:e.tlbr.divide(a.mosaicInfo.size.xyxy)}}function qn(a,e){const t=Ke(a.tileTextureCoord,new o(1)),i=B(a.tlbr.xy,a.tlbr.zw,t),n=k(e.mosaicTexture,i);return a.color.multiply(n)}let Ot=class extends Ue{constructor(){super(...arguments),this.type="PatternFillShader"}vertex(e,t){return{...super.vertex(e,t),...Zn(this,e)}}fragment(e){const t=qn(e,this);return this.getFragmentOutput(t,e,new o(0))}};r([m(Re)],Ot.prototype,"mosaicInfo",void 0),r([H($)],Ot.prototype,"mosaicTexture",void 0),r([m(_t)],Ot.prototype,"localTileOffset",void 0),r([I(0,z(Mi)),I(1,z(Ce))],Ot.prototype,"vertex",null),r([I(0,z(Ia))],Ot.prototype,"fragment",null);let Ni=class extends Qe{};r([v(9,S)],Ni.prototype,"tlbr",void 0),r([v(10,o)],Ni.prototype,"inverseRasterizationScale",void 0);let jn=class extends Un{},It=class extends mi{constructor(){super(...arguments),this.type="PatternOutlineFillShader"}vertex(e,t){return{...Zi(this,e,t),...Zn(this,e)}}fragment(e){const{isOutline:t}=e,i=R(t,new o(.5)),n=Ti(e,this.antialiasingControls.blur),s=qn(e,this),l=y(i,n,s),u=y(i,new o(1/255),new o(0));return this.getFragmentOutput(l,e,u)}};r([m(Re)],It.prototype,"mosaicInfo",void 0),r([H($)],It.prototype,"mosaicTexture",void 0),r([m(_t)],It.prototype,"localTileOffset",void 0),r([I(0,z(Ni)),I(1,z(Ce))],It.prototype,"vertex",null),r([I(0,z(jn))],It.prototype,"fragment",null);const dn=1/Uo;let Be=class extends ze{};r([v(3,S)],Be.prototype,"color",void 0),r([v(4,S)],Be.prototype,"tlbr",void 0),r([v(5,o)],Be.prototype,"angle",void 0),r([v(6,o)],Be.prototype,"aux1",void 0),r([v(7,o)],Be.prototype,"aux2",void 0),r([v(8,g)],Be.prototype,"aux3",void 0),r([v(9,g)],Be.prototype,"aux4",void 0),r([v(10,g)],Be.prototype,"zoomRange",void 0);class Ca extends jn{}let zt=class extends Ge{constructor(){super(...arguments),this.type="ComplexOutlineFillShader"}vertex(e,t){const{aux1:i,aux2:n,aux3:s,aux4:l}=e,u={...e,width:i,height:n,offset:s,scale:l.multiply(dn)},c={...e,halfWidth:i,referenceHalfWidth:n,offset:s,normal:l.subtract(Wo).multiply(dn)},p=Zi(this,c),d=Bn(this,u),f=R(p.isOutline,new o(.5));return{...p,...d,...Object.assign({},this.maybeRunHittest(e,t,f))}}fragment(e){const{isOutline:t}=e,i=R(t,new o(.5)),n=Ti(e,this.antialiasingControls.blur),s=Hn(this,e),l=y(i,n,s),u=y(i,new o(1/255),new o(0));return this.getFragmentOutput(l,e,u)}hittest(e,t,i){const{pos0:n,pos1:s,pos2:l}=this.computeHittestTriangle(e,t,null),u=Xe(this.hittestRequest);return y(u,()=>{const{tlbr:c}=this.hittestRequest;return lt(n,s,l,c)},()=>{const c=xi(this,e,t);return y(Se(i,R(c,this.hittestRequest.distance)),new o(X),new o(fe))})}};r([m(Re)],zt.prototype,"mosaicInfo",void 0),r([H($)],zt.prototype,"mosaicTexture",void 0),r([m(_t)],zt.prototype,"localTileOffset",void 0),r([I(0,z(Be)),I(1,z(Ce))],zt.prototype,"vertex",null),r([I(0,z(Ca))],zt.prototype,"fragment",null);let Aa=class extends oe{constructor(){super(...arguments),this.type=11,this.shaders={geometry:new zt}}render(e,t){const{painter:i,pixelRatio:n}=e,s=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,s.uniforms),...Q(e,t.target),antialiasingControls:St(n),mosaicInfo:i.textureManager.getMosaicInfo(e,t.textureKey),localTileOffset:Kt(t.target)},textures:{...ie(e),mosaicTexture:i.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...J(e)},optionalAttributes:s.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}},Pa=class extends oe{constructor(){super(...arguments),this.type=15,this.shaders={geometry:new Ue}}render(e,t){const{painter:i}=e,n=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,n.uniforms),...Q(e,t.target)},textures:ie(e),defines:J(e),optionalAttributes:n.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}},Bt=class extends Dt{};r([v(5,S)],Bt.prototype,"tlbr",void 0),r([v(6,g)],Bt.prototype,"relativePosition",void 0),r([v(7,o)],Bt.prototype,"gradientMethod",void 0),r([v(8,g)],Bt.prototype,"relativeGradientSize",void 0);let Da=class extends Ve{},Ht=class extends Ue{constructor(){super(...arguments),this.type="GradientFillShader"}vertex(e,t){const{tlbr:i,relativePosition:n,gradientMethod:s,relativeGradientSize:l}=e,u=y(at(e.bitset,on.isAbsolute),this.view.displayZoomFactor,new o(1));return{...super.vertex(e,t),tlbr:i,relativePosition:n,gradientMethod:s,gradientSize:l.multiply(u),isDiscrete:K(e.bitset,on.isDiscrete)}}fragment(e){const{tlbr:t,relativePosition:i,gradientMethod:n,gradientSize:s,isDiscrete:l}=e,u=y(R(l,new o(.5)),s.subtract(1),new g(0)),c=ce([N(n,new o(nn.rectangular)),()=>{const _=Qt(i).add(u).divide(s);return ii(ge(_.x,_.y))}],[N(n,new o(nn.circular)),ii(zn(gt(i,i)).add(u.x).divide(s.x))],[!0,ii(i.x.add(u.x).divide(s.x))]),p=new g(_e(c,new o(0),new o(1)),.5),d=B(t.xy,t.zw,p).divide(this.mosaicInfo.size),f=k(this.mosaicTexture,d),h=e.color.a;return this.getFragmentOutput(f.multiply(h),e,new o(0))}};r([m(Re)],Ht.prototype,"mosaicInfo",void 0),r([H($)],Ht.prototype,"mosaicTexture",void 0),r([I(0,z(Bt)),I(1,z(Ce))],Ht.prototype,"vertex",null),r([I(0,z(Da))],Ht.prototype,"fragment",null);let Va=class extends oe{constructor(){super(...arguments),this.type=16,this.shaders={geometry:new Ht},this.symbologyPlane=0}render(e,t){const{painter:i}=e,n=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,n.uniforms),...Q(e,t.target),mosaicInfo:i.textureManager.getMosaicInfo(e,t.textureKey)},textures:{...ie(e),mosaicTexture:i.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...J(e)},optionalAttributes:n.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}},Ra=class extends oe{constructor(){super(...arguments),this.type=26,this.shaders={geometry:new mi}}render(e,t){const{painter:i,pixelRatio:n}=e,s=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,s.uniforms),...Q(e,t.target),antialiasingControls:St(n)},textures:ie(e),defines:{...J(e)},optionalAttributes:s.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}},Fa=class extends oe{constructor(){super(...arguments),this.type=28,this.shaders={geometry:new Ot}}render(e,t){const{painter:i}=e,n=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,n.uniforms),...Q(e,t.target),mosaicInfo:i.textureManager.getMosaicInfo(e,t.textureKey),localTileOffset:Kt(t.target)},textures:{...ie(e),mosaicTexture:i.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...J(e)},optionalAttributes:n.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}},Ea=class extends oe{constructor(){super(...arguments),this.type=29,this.shaders={geometry:new It}}render(e,t){const{painter:i,pixelRatio:n}=e,s=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,s.uniforms),...Q(e,t.target),antialiasingControls:St(n),mosaicInfo:i.textureManager.getMosaicInfo(e,t.textureKey),localTileOffset:Kt(t.target)},textures:{...ie(e),mosaicTexture:i.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...J(e)},optionalAttributes:s.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}};class La{constructor(e,t,i,n){this.startTime=e,this.startValue=t,this.endTime=i,this.endValue=n}getValue(e){if(e<=this.startTime)return this.startValue;if(e>=this.endTime)return this.endValue;const t=(e-this.startTime)/(this.endTime-this.startTime);return this.startValue+t*(this.endValue-this.startValue)}isForeverZero(e){return this.startValue===0&&this.endValue===0||this.endValue===0&&e>=this.endTime}}function Kn(a,e){return typeof a=="number"?a:a.getValue(e)}function Ma(a){return typeof a=="number"?a:a.endValue}function Ks(a,e){return typeof a=="number"?a===0:a.isForeverZero(e)}function Na(a,e,t,i){return a===t?a:new La(a,e,t,i)}function Xs(a,e,t){const i=Kn(a,t),n=i*e;return n===0?0:Na(t,i,t+n,0)}function pn(a){const e=a.toRgba();return[e[0]/255,e[1]/255,e[2]/255,e[3]]}function Js(a){return{kind:"constant",value:[.1,.1,.1,1]}}function Qs(a){if(!a.hasVisualVariables("color"))return{kind:"constant",value:pn(a.color)};const e=a.getVisualVariablesForType("color")[0],t=[],i=[];for(const n of e.stops)t.push(n.value),Array.prototype.push.apply(i,pn(n.color));return{kind:"ramp",stops:t,values:i,count:e.stops.length}}function el(a){if(!a.hasVisualVariables("opacity"))return{kind:"constant",value:[1]};const e=a.getVisualVariablesForType("opacity")[0],t=[],i=[];for(const n of e.stops)t.push(n.value),i.push(n.opacity);return{kind:"ramp",stops:t,values:i,count:e.stops.length}}const Ee=8;function tl(a){if(a.kind==="constant")return{constant:a.value,count:1,stops:new Array(Ee).fill(0),values:new Array(Ee).fill(a.value)};const e=Math.min(a.count,Ee),t=new Array(Ee).fill(a.stops[e-1]),i=new Array(Ee).fill(null).map((n,s)=>{const l=4*Math.min(s,e-1);return a.values.slice(l,l+4)});for(let n=0;n<e;n++)t[n]=a.stops[n];return{constant:[0,0,0,0],count:e,stops:t,values:i}}function il(a){if(a.kind==="constant")return{constant:a.value[0],count:1,stops:new Array(Ee).fill(0),values:new Array(Ee).fill(a.value[0])};const e=Math.min(a.count,Ee),t=new Array(Ee).fill(a.stops[e-1]),i=new Array(Ee).fill(a.values[e-1]);for(let n=0;n<e;n++)t[n]=a.stops[n],i[n]=a.values[n];return{constant:0,count:e,stops:t,values:i}}function $a(a,e){return a===e||a!=null&&e!=null&&a.equals(e)}function nl(a,e){if(!ta(a.simulationSettings,e.simulationSettings)||!$a(a.timeExtent,e.timeExtent))return!1;let t=!0;return t=t&&a.loadImagery===e.loadImagery,t=t&&a.createFlowMesh===e.createFlowMesh,t=t&&a.color.kind===e.color.kind,t=t&&a.opacity.kind===e.opacity.kind,t=t&&a.size.kind===e.size.kind,t}const Ba=36e5,ol=3600;class We extends Y{}r([m(o)],We.prototype,"time",void 0),r([m(G)],We.prototype,"dvsMat3",void 0),r([m(G)],We.prototype,"displayViewMat3",void 0),r([m(o)],We.prototype,"displayOpacity",void 0),r([m(o)],We.prototype,"startTime",void 0),r([m(o)],We.prototype,"endTime",void 0);let Ye=class extends Y{};r([m(o)],Ye.prototype,"trailLength",void 0),r([m(o)],Ye.prototype,"flowSpeed",void 0),r([m(o)],Ye.prototype,"featheringSize",void 0),r([m(o)],Ye.prototype,"featheringOffset",void 0),r([m(o)],Ye.prototype,"introFade",void 0),r([m(o)],Ye.prototype,"fadeToZero",void 0),r([m(o)],Ye.prototype,"decayRate",void 0);let $i=class extends Y{};r([m(o)],$i.prototype,"min",void 0),r([m(o)],$i.prototype,"max",void 0);let mt=class extends Y{getValue(e,t){return t?ce([Le(e,this.stops.first()),this.values.first()],[de(e,this.stops.get(this.count.subtract(1))),this.values.get(this.count.subtract(1))],[!0,()=>{const i=this.stops.findIndex(c=>R(c,e)),n=this.stops.get(i),s=i.subtract(1),l=this.stops.get(s),u=e.subtract(l).divide(n.subtract(l));return B(this.values.get(s),this.values.get(i),u)}]):this.constant}};r([m(S)],mt.prototype,"constant",void 0),r([m(pe.ofType(o,8))],mt.prototype,"stops",void 0),r([m(pe.ofType(S,8))],mt.prototype,"values",void 0),r([m(Zt)],mt.prototype,"count",void 0);class Ze extends Y{getValue(e,t){return t?ce([Le(e,this.stops.first()),this.values.first()],[de(e,this.stops.get(this.count.subtract(1))),this.values.get(this.count.subtract(1))],[!0,()=>{const i=this.stops.findIndex(c=>R(c,e)),n=this.stops.get(i),s=i.subtract(1),l=this.stops.get(s),u=e.subtract(l).divide(n.subtract(l));return B(this.values.get(s),this.values.get(i),u)}]):this.constant}}function Xn(a,e,t){return a.add(e.multiply(new o(2)).multiply(t))}function Jn(a,e,t,i){return a.dvsMat3.multiply(new D(e,1)).add(a.displayViewMat3.multiply(new D(t.multiply(i),0))).xy}function si(a,e,t){const i=B(new o(0),Di(e.multiply(new o(-1))),t);return Di(e.multiply(a).multiply(new o(-1))).subtract(i).divide(new o(1).subtract(i))}function Qn(a,e,t,i){const n=_e(new o(.5).subtract(i.divide(t)),new o(0),new o(.5)),s=y(R(e,n),new o(1).subtract(e.subtract(n).divide(new o(.5).subtract(n))),new o(1));return a.multiply(s)}function qi(a,e){return new S(a.rgb.multiply(e),e)}function Ha(a,e){return Ke(a.multiply(3.634).add(e.multiply(5.153)).add(7.381),new o(1))}r([m(o)],Ze.prototype,"constant",void 0),r([m(pe.ofType(o,8))],Ze.prototype,"stops",void 0),r([m(pe.ofType(o,8))],Ze.prototype,"values",void 0),r([m(Zt)],Ze.prototype,"count",void 0);let Bi=class extends Rt{};r([v(0,g)],Bi.prototype,"position",void 0),r([v(1,g)],Bi.prototype,"texcoord",void 0);let Ga=class extends Jt{};class Fe extends Vt{constructor(){super(...arguments),this.type="FlowImageryShader",this.vvColor=null,this.vvOpacity=null}vertex(e){const t=this.state.dvsMat3.multiply(new D(e.position,1)).xy;return{glPosition:new S(t,0,1),texcoord:e.texcoord}}fragment(e){const t=k(this.texture,e.texcoord),i=this.config.min.add(t.r.multiply(this.config.max.subtract(this.config.min))),n=this.color.getValue(i,this.vvColor),s=n.a.multiply(this.opacity.getValue(t.r,this.vvOpacity)).multiply(t.a),l=new xt;return l.fragColor=qi(n,s),l}}r([le],Fe.prototype,"vvColor",void 0),r([le],Fe.prototype,"vvOpacity",void 0),r([m(We)],Fe.prototype,"state",void 0),r([m($i)],Fe.prototype,"config",void 0),r([H($)],Fe.prototype,"texture",void 0),r([m(mt)],Fe.prototype,"color",void 0),r([m(Ze)],Fe.prototype,"opacity",void 0),r([I(0,z(Bi))],Fe.prototype,"vertex",null),r([I(0,z(Ga))],Fe.prototype,"fragment",null);let Gt=class extends Rt{};r([v(0,S)],Gt.prototype,"xyts0",void 0),r([v(1,S)],Gt.prototype,"xyts1",void 0),r([v(2,S)],Gt.prototype,"typeIdFirstTimeLastTime",void 0),r([v(3,S)],Gt.prototype,"extrudeInfo",void 0);class Ya extends Jt{}let Ae=class extends Vt{constructor(){super(...arguments),this.type="FlowParticlesShader",this.vvColor=null,this.vvOpacity=null,this.vvSize=null}vertex(e){const t=e.typeIdFirstTimeLastTime.z,i=e.typeIdFirstTimeLastTime.w.subtract(t),n=e.xyts0.xy,s=e.xyts0.z.subtract(t),l=e.xyts0.w,u=e.xyts1.xy,c=e.xyts1.z.subtract(t),p=e.xyts1.w,d=e.typeIdFirstTimeLastTime.x,f=e.typeIdFirstTimeLastTime.y,h=new o(2),_=new o(1),x=new o(2),b=new o(3),T=e.extrudeInfo.xy,C=e.extrudeInfo.zw,w=i.add(this.config.trailLength),P=Ke(this.state.time.multiply(this.config.flowSpeed),w),E=P.subtract(s).divide(c.subtract(s)),A=_e(E,new o(0),new o(1)),V=B(s,c,A),F=B(l,p,A),L=B(T,C,A),O=wn(u.subtract(n)).multiply(new o(.5)),U=N(d,h),ae=Se(N(f,_),N(f,x)),be=y(U,Se(ot(E,new o(0)),te(R(E,new o(1)),Do(c,i))),ot(E,new o(0))),ei=y(U,ce([N(f,_),L],[N(f,x),L.multiply(new o(-1))],[N(f,b),L.add(O)],[!0,L.multiply(new o(-1)).add(O)]),ce([N(f,_),T],[N(f,x),T.multiply(new o(-1))],[N(f,b),L],[!0,L.multiply(new o(-1))])),Oi=y(U,ce([N(f,_),new g(.5,0)],[N(f,x),new g(.5,1)],[N(f,b),new g(1,0)],[!0,new g(1,1)]),ce([N(f,_),new g(.5,0)],[N(f,x),new g(.5,1)],[N(f,b),new g(.5,0)],[!0,new g(.5,1)])),Nt=y(U,V,y(ae,s,V)),Ii=y(U,F,y(ae,l,F)),ao=y(U,si(P.subtract(V).divide(this.config.trailLength),this.config.decayRate,this.config.fadeToZero),y(ae,si(P.subtract(s).divide(this.config.trailLength),this.config.decayRate,this.config.fadeToZero),si(P.subtract(V).divide(this.config.trailLength),this.config.decayRate,this.config.fadeToZero))),ro=new o(1).subtract(Di(Nt.multiply(new o(-1)))),ji=Xn(this.size.getValue(Ii,this.vvSize),this.config.featheringSize,this.config.featheringOffset),Ki=this.color.getValue(Ii,this.vvColor),so=Ki.a.multiply(this.opacity.getValue(Ii,this.vvOpacity)).multiply(ao).multiply(B(new o(1),ro,this.config.introFade)).multiply(this.state.displayOpacity),lo=y(U,B(n,u,A),y(ae,n,B(n,u,A))),uo=Jn(this.state,lo,ei,ji);return{glPosition:y(be,new S(0,0,-2,1),new S(uo,0,1)),color:qi(Ki,so),texcoord:Oi,size:ji}}fragment(e){const t=new xt;return t.fragColor=Qn(e.color,nt(e.texcoord.subtract(new g(.5))),e.size,this.config.featheringSize),t}};r([le],Ae.prototype,"vvColor",void 0),r([le],Ae.prototype,"vvOpacity",void 0),r([le],Ae.prototype,"vvSize",void 0),r([m(We)],Ae.prototype,"state",void 0),r([m(Ye)],Ae.prototype,"config",void 0),r([m(mt)],Ae.prototype,"color",void 0),r([m(Ze)],Ae.prototype,"opacity",void 0),r([m(Ze)],Ae.prototype,"size",void 0),r([I(0,z(Gt))],Ae.prototype,"vertex",null),r([I(0,z(Ya))],Ae.prototype,"fragment",null);class Yt extends Rt{}r([v(0,D)],Yt.prototype,"positionAndSide",void 0),r([v(1,D)],Yt.prototype,"timeInfo",void 0),r([v(2,g)],Yt.prototype,"extrude",void 0),r([v(3,o)],Yt.prototype,"speed",void 0);let ka=class extends Jt{};class Pe extends Vt{constructor(){super(...arguments),this.type="FlowStreamlinesShader",this.vvColor=null,this.vvOpacity=null,this.vvSize=null}vertex(e){const t=e.positionAndSide.xy,i=this.color.getValue(e.speed,this.vvColor),n=this.opacity.getValue(e.speed,this.vvOpacity),s=Xn(this.size.getValue(e.speed,this.vvSize),this.config.featheringSize,this.config.featheringOffset),l=Jn(this.state,t,e.extrude,s),u=i.a.multiply(n);return{glPosition:new S(l,0,1),side:e.positionAndSide.z,timeInfo:e.timeInfo,color:qi(i,u),size:s}}fragment(e){const t=e.timeInfo.z.subtract(e.timeInfo.y).add(this.config.trailLength),i=Ha(e.timeInfo.y,e.timeInfo.z),n=Ke(i.multiply(t).add(this.state.time.multiply(this.config.flowSpeed)),t).add(e.timeInfo.y).subtract(e.timeInfo.x).divide(this.config.trailLength),s=e.color.multiply(this.state.displayOpacity).multiply(y(ot(n,new o(0)),new o(0),si(n,this.config.decayRate,this.config.fadeToZero))),l=new xt;return l.fragColor=Qn(s,Qt(e.side).divide(new o(2)),e.size,this.config.featheringSize),l}}r([le],Pe.prototype,"vvColor",void 0),r([le],Pe.prototype,"vvOpacity",void 0),r([le],Pe.prototype,"vvSize",void 0),r([m(We)],Pe.prototype,"state",void 0),r([m(Ye)],Pe.prototype,"config",void 0),r([m(mt)],Pe.prototype,"color",void 0),r([m(Ze)],Pe.prototype,"opacity",void 0),r([m(Ze)],Pe.prototype,"size",void 0),r([I(0,z(Yt))],Pe.prototype,"vertex",null),r([I(0,z(ka))],Pe.prototype,"fragment",null);let Wa=class extends On{constructor(){super(...arguments),this.type=14,this.drawPhase=1,this.shaders={imagery:new Fe,particles:new Ae,streamlines:new Pe}}render(e,t){const{painter:i}=e;i.setPipelineState({depth:!1,color:{write:[!0,!0,!0,!0],blendMode:"composite"},stencil:{write:!1,test:{compare:514,op:{fail:7680,zFail:7680,zPass:7680},mask:255}}}),this._renderResource(e,t.item.resources,this._createVisualState(e,t))}_renderResource(e,t,i){switch(t.kind){case"stack":return void this._renderStackResources(e,t,i);case"imagery":return void this._renderImageryResources(e,t,i);case"particles":return void this._renderParticlesResources(e,t,i);case"streamlines":return void this._renderStreamlinesResources(e,t,i)}}_createVisualState(e,t){const{item:i,dvsMat3:n}=t,s=e.time/1e3;return{time:e.animationsEnabled?s:Ba,dvsMat3:n,displayViewMat3:e.state.displayViewMat3,displayOpacity:e.animationsEnabled?Kn(i.displayOpacity,s):Ma(i.displayOpacity),startTime:i.startTime,endTime:i.endTime}}_renderStackResources(e,t,i){for(const n of t.resources)this._renderResource(e,n,i)}_renderImageryResources({context:e,painter:t},i,n){const s=i.getProgramSpec(n);t.submitDrawMeshUntyped(e,{shader:this.shaders.imagery,uniforms:s.uniforms,textures:s.textures,defines:s.defines,optionalAttributes:s.optionalAttributes,useComputeBuffer:!1},i.mesh,{stencilRef:0})}_renderParticlesResources({context:e,painter:t},i,n){const s=i.getProgramSpec(n);t.submitDrawMeshUntyped(e,{shader:this.shaders.particles,uniforms:s.uniforms,textures:s.textures,defines:s.defines,optionalAttributes:s.optionalAttributes,useComputeBuffer:!1},i.mesh,{stencilRef:0})}_renderStreamlinesResources({context:e,painter:t},i,n){const s=i.getProgramSpec(n);t.submitDrawMeshUntyped(e,{shader:this.shaders.streamlines,uniforms:s.uniforms,textures:s.textures,defines:s.defines,optionalAttributes:s.optionalAttributes,useComputeBuffer:!1},i.mesh,{stencilRef:0})}};const Ua=()=>xo.getLogger("esri.views.2d.engine.webgl.shaderGraph.techniques.heatmap.HeatmapResources");let Za=class{destroy(){this._accumulateFramebuffer=Qi(this._accumulateFramebuffer),this._resolveGradientTexture=Qi(this._resolveGradientTexture),this._prevGradientHash=null,this._qualityProfile=null}get initialized(){return this._accumulateFramebuffer!=null&&this._resolveGradientTexture!=null}get accumulateFramebuffer(){return this._accumulateFramebuffer}get resolveGradientTexture(){return this._resolveGradientTexture}loadQualityProfile(e){if(this._qualityProfile==null){const t=ia(e,Ua());this._qualityProfile={...t,defines:{usesHalfFloatPrecision:t.dataType!==xn.FLOAT}}}return this._qualityProfile}ensureAccumulateFBO(e,t,i){if(this._accumulateFramebuffer==null){const{dataType:n,samplingMode:s,pixelFormat:l,internalFormat:u}=this.loadQualityProfile(e),c=new ui(t,i);c.pixelFormat=l,c.internalFormat=u,c.dataType=n,c.samplingMode=s,c.wrapMode=33071;const p=new gn(_n.DEPTH24_STENCIL8,t,i);this._accumulateFramebuffer=new hn(e,c,p)}else{const{width:n,height:s}=this._accumulateFramebuffer;n===t&&s===i||this._accumulateFramebuffer.resize(t,i)}return this._accumulateFramebuffer}ensureResolveGradientTexture(e,t,i){if(this._resolveGradientTexture==null){const n=new ui;n.wrapMode=33071,this._resolveGradientTexture=new yn(e,n),this._prevGradientHash=null}return this._prevGradientHash!==t&&(this._resolveGradientTexture.resize(i.length/4,1),this._resolveGradientTexture.setData(i),this._prevGradientHash=t),this._resolveGradientTexture}};function eo(a){return a?.25:1}class to extends ze{}r([v(5,g)],to.prototype,"offset",void 0);class qa extends Ve{}let Hi=class extends Y{};r([m(o)],Hi.prototype,"radius",void 0),r([m(o)],Hi.prototype,"isFieldActive",void 0);let kt=class extends ue{constructor(){super(...arguments),this.type="HeatmapAccumulateShader",this.usesHalfFloatPrecision=!1}vertex(e){const{radius:t,isFieldActive:i}=this.kernelControls,n=e.offset,s=i.multiply(this.getVVData(e.id).x).add(new o(1).subtract(i)),l=this.view.displayViewScreenMat3.multiply(new D(e.pos,1)).add(this.view.displayViewMat3.multiply(new D(n,0)).multiply(t)),u=this.clip(e.id);return{glPosition:new S(l.xy,u,1),offset:n,fieldValue:s,color:new S(0),...this.maybeRunHittest(e,{},null)}}fragment(e){const{offset:t,fieldValue:i}=e,n=nt(t),s=W(n,new o(1)),l=new o(1).subtract(n.multiply(n)),u=l.multiply(l),c=s.multiply(u).multiply(i).multiply(new o(eo(this.usesHalfFloatPrecision)));return this.getFragmentOutput(new S(c),e)}hittest(e){const{viewMat3:t,tileMat3:i}=this.view,n=t.multiply(i).multiply(new D(e.pos,1)),s=da(n.xy,this.kernelControls.radius,this.hittestRequest.position);return y(R(s,this.hittestRequest.distance),new o(X),new o(fe))}};r([le],kt.prototype,"usesHalfFloatPrecision",void 0),r([m(Hi)],kt.prototype,"kernelControls",void 0),r([I(0,z(to))],kt.prototype,"vertex",null),r([I(0,z(qa))],kt.prototype,"fragment",null);let io=class extends Rt{};r([v(0,g)],io.prototype,"position",void 0);let ja=class extends Jt{};class Gi extends Y{}r([m(g)],Gi.prototype,"minAndInvRange",void 0),r([m(o)],Gi.prototype,"normalization",void 0);class ft extends Vt{constructor(){super(...arguments),this.type="HeatmapResolveShader",this.usesHalfFloatPrecision=!1}vertex(e){return{glPosition:new S(e.position.multiply(2).subtract(1),1,1),uv:e.position}}fragment(e){const{accumulatedDensity:t}=this;let i=k(this.densityTexture,e.uv).r.divide(new o(eo(this.usesHalfFloatPrecision)));i=i.multiply(t.normalization),i=i.subtract(t.minAndInvRange.x).multiply(t.minAndInvRange.y);const n=k(this.gradientTexture,new g(i,.5)),s=new xt;return s.fragColor=new S(n.rgb.multiply(n.a),n.a),s}}r([le],ft.prototype,"usesHalfFloatPrecision",void 0),r([m(Gi)],ft.prototype,"accumulatedDensity",void 0),r([H($)],ft.prototype,"densityTexture",void 0),r([H($)],ft.prototype,"gradientTexture",void 0),r([I(0,z(io))],ft.prototype,"vertex",null),r([I(0,z(ja))],ft.prototype,"fragment",null);class Ka extends oe{constructor(){super(...arguments),this.type=19,this.drawPhase=73,this.shaders={accumulate:new kt,resolve:new ft},this._isBound=!1,this._resources=new Map}shutdown(e){super.shutdown(e),this._resources.get(e)?.destroy(),this._resources.delete(e),this._prevFBO=null,this._unbind()}render(e,t){const{context:i,painter:n,state:s}=e,l=t.instance.getInput(),{isFieldActive:u}=l.uniforms,c=this._getOrCreateResourcesRecord(i),p=c.loadQualityProfile(i);j(e)||this._bind(e,c,l),n.setShader({shader:this.shaders.accumulate,uniforms:{...Q(e,t.target),kernelControls:{radius:fn(l,s),isFieldActive:u?1:0}},textures:ie(e),defines:{...J(e),...p.defines},optionalAttributes:{},useComputeBuffer:j(e)});const d=j(e)?Qa:no;n.setPipelineState(d),n.submitDraw(e,t)}getStencilReference(e){return Ja(e)}renderResolvePass(e,t){if(j(e))return;const{context:i,painter:n}=e,s=this._resources.get(i);if(this._prevFBO==null||this._prevViewport==null||!s?.initialized)return;const{defines:l}=s.loadQualityProfile(i),{minDensity:u,maxDensity:c,radius:p}=t.getInput().uniforms,d=8,f=9,h=s.accumulateFramebuffer,_=s.resolveGradientTexture,x={shader:this.shaders.resolve,uniforms:{accumulatedDensity:{minAndInvRange:[u,1/(c-u)],normalization:3/(p*p*Math.PI)}},textures:{densityTexture:{unit:d,texture:h.colorTexture},gradientTexture:{unit:f,texture:_}},defines:l,optionalAttributes:{},useComputeBuffer:!1};i.bindFramebuffer(this._prevFBO),i.setViewport(0,0,this._prevViewport.width,this._prevViewport.height),i.bindTexture(h.colorTexture,d),i.bindTexture(_,f),n.setPipelineState(er),n.submitDrawMesh(i,x,n.quadMesh),this._unbind()}_getOrCreateResourcesRecord(e){let t=this._resources.get(e);return t==null&&(t=new Za,this._resources.set(e,t)),t}_unbind(){this._prevFBO=null,this._prevViewport=null,this._isBound=!1}_bind(e,t,i){const{context:n,state:s,pixelRatio:l}=e,u=n.boundFramebuffer;if(this._isBound||u==null)return;const c=n.getViewport();this._prevFBO=u,this._prevViewport=c;const{gradient:p,gradientHash:d}=i.uniforms;t.ensureResolveGradientTexture(n,d,p);const{width:f,height:h}=c,_=Xa(fn(i,s),l),x=f*_,b=h*_,T=t.ensureAccumulateFBO(n,x,b);n.blitFramebuffer(u,T,1024),n.bindFramebuffer(T),n.setViewport(0,0,T.width,T.height),n.setColorMask(!0,!0,!0,!0),n.setClearColor(0,0,0,0),n.clear(16384),this._isBound=!0}}function Xa(a,e){const t=e>1.5?.25:.5;return a<1/(2*t)?1:t}function Ja(a){return a.key.level+1}const no={color:{write:[!0,!0,!0,!0],blendMode:"additive"},depth:!1,stencil:{write:!1,test:{compare:518,mask:255,op:{fail:7680,zFail:7680,zPass:7681}}}},Qa={...no,stencil:!1},er={color:{write:[!0,!0,!0,!0],blendMode:"composite"},depth:!1,stencil:!1};function fn(a,e){const{referenceScale:t,radius:i}=a.uniforms;return i*(t!==0?t/e.scale:1)}const tr=1/To;let we=class extends ze{};r([v(3,S)],we.prototype,"color",void 0),r([v(4,g)],we.prototype,"offset",void 0),r([v(5,g)],we.prototype,"textureUV",void 0),r([v(6,S)],we.prototype,"fontAndReferenceSize",void 0),r([v(7,S)],we.prototype,"outlineColor",void 0),r([v(8,S)],we.prototype,"haloColor",void 0),r([v(9,g)],we.prototype,"outlineAndHaloSize",void 0),r([v(10,g)],we.prototype,"zoomRange",void 0),r([v(11,o)],we.prototype,"clipAngle",void 0),r([v(12,S)],we.prototype,"referenceSymbol",void 0),r([v(15,o)],we.prototype,"visibility",void 0);let Yi=class extends Xt{};r([v(13,g)],Yi.prototype,"offsetNextVertex1",void 0),r([v(14,g)],Yi.prototype,"offsetNextVertex2",void 0);let ir=class extends Ve{},se=class extends ue{constructor(){super(...arguments),this.type="TextShader",this.computeAttributes={offset:["offsetNextVertex1","offsetNextVertex2"]},this.textRenderPassType=0,this.isBackgroundPass=!1,this.isLabel=!1}clipLabel(e,t){const{clipAngle:i,zoomRange:n,visibility:s}=e,l=i.multiply(tr),u=Ke(l.subtract(this.view.rotation),new o(360));let c=new o(0);const p=So,d=Vo(this.view.currentZoom.multiply(p)).divide(p),f=n.x,h=n.y,_=new o(1).subtract(W(f,d)).multiply(2),x=new o(te(de(u,new o(90)),ot(u,new o(270)))).multiply(2),b=new o(2).multiply(new o(1).subtract(W(d,h)));return c=c.add(t.multiply(_)),c=c.add(t.multiply(x)),c=c.add(b),s&&(c=c.add(s)),c}vertex(e,t){const i=K(e.bitset,Zo),n=new o(1).subtract(i);let s=e.fontAndReferenceSize[0];const l=e.fontAndReferenceSize[1],u=e.fontAndReferenceSize[2],c=e.fontAndReferenceSize[3];let p=s.divide(u);const d=this.textRenderPassType===1?e.outlineColor:this.textRenderPassType===2?e.haloColor:this._getVertexColor(e),f=this.view.displayViewScreenMat3.multiply(new D(e.pos,1));let h=e.offset,_=new o(1),x=G.identity(),b=new g(0);if(this.isLabel){if(!e.referenceSymbol)throw new Error("InternalError: Optional attribute 'referenceSymbol' expected for labels");const A=e.referenceSymbol,V=A.xy,F=A.z,L=this._unpackDirection(A.w),O=qt(this,e.id,F).divide(2),U=L.multiply(O.add(bo));b=V.add(U),h=h.add(b)}else _=qt(this,e.id,l).divide(l),s=s.multiply(_),p=p.multiply(_),h=h.multiply(_),x=Rn(this,e.id),h=x.multiply(new D(h,0)).xy;const T=K(e.bitset,sn),C=this._getViewRotationMatrix(T).multiply(new D(h,0)).multiply(this.view.scaleFactor);let w=this.isLabel?this.clipLabel(e,T):this.clip(e.id,e.zoomRange);w=this.isBackgroundPass?w.add(n.multiply(2)):w.add(i.multiply(2));let P=new o(0);if(this.textRenderPassType===1&&(w=w.add(y(N(e.outlineAndHaloSize.x,new o(0)),new o(2),new o(0))),P=new o(e.outlineAndHaloSize.x).divide(p).divide(c)),this.textRenderPassType===2){const A=e.outlineAndHaloSize.x,V=new o(e.outlineAndHaloSize.y);w=w.add(y(N(V,new o(0)),new o(2),new o(0))),P=V.add(A).divide(p).divide(c)}const E=this.isLabel?R(w,new o(1)):new Pt(!1);return{glPosition:new S(f.xy.add(C.xy),w,1),color:d,size:p,textureUV:e.textureUV.divide(this.mosaicInfo.size),antialiasingWidth:new o(.105).multiply(u).divide(s).divide(this.view.pixelRatio),outlineDistanceOffset:P,...this.maybeRunHittest(e,t,{vvSizeAdjustment:_,vvRotation:x,labelOffset:b,labelClipped:E,scaleFactor:this.view.scaleFactor})}}_getViewRotationMatrix(e){const t=this.view.displayViewMat3,i=this.view.displayMat3,n=new o(1).subtract(e);return t.multiply(e).add(i.multiply(n))}_getHittestAlignmentMatrix(e){const t=this.view.viewMat3.multiply(this.view.tileMat3),i=this.view.tileMat3,n=new o(1).subtract(e);return t.multiply(e).add(i.multiply(n))}fragment(e){const t=new o(.25),i=new o(1).subtract(t),n=k(this.mosaicTexture,e.textureUV).a;let s=i.subtract(e.outlineDistanceOffset);this.highlight&&(s=s.divide(2));const l=e.antialiasingWidth,u=In(s.subtract(l),s.add(l),n);return this.getFragmentOutput(e.color.multiply(u),e)}computeHittestTriangle(e,t,{vvSizeAdjustment:i,vvRotation:n,labelOffset:s,scaleFactor:l}){let u,c,p;this.isLabel?(u=new D(e.offset.multiply(l).add(s),0),c=new D(t.offsetNextVertex1.multiply(l).add(s),0),p=new D(t.offsetNextVertex2.multiply(l).add(s),0)):(u=n.multiply(new D(e.offset.multiply(l).multiply(i),0)),c=n.multiply(new D(t.offsetNextVertex1.multiply(l).multiply(i),0)),p=n.multiply(new D(t.offsetNextVertex2.multiply(l).multiply(i),0)));const{viewMat3:d,tileMat3:f}=this.view,h=d.multiply(f).multiply(new D(e.pos,1)),_=K(e.bitset,sn),x=this._getHittestAlignmentMatrix(_);return{pos0:h.add(x.multiply(u)).xy,pos1:h.add(x.multiply(c)).xy,pos2:h.add(x.multiply(p)).xy}}hittest(e,t,i){const{vvSizeAdjustment:n,vvRotation:s,labelOffset:l,labelClipped:u,scaleFactor:c}=i,p=Xe(this.hittestRequest),{pos0:d,pos1:f,pos2:h}=this.computeHittestTriangle(e,t,{vvSizeAdjustment:n,vvRotation:s,labelOffset:l,scaleFactor:c});return y(p,()=>{const{tlbr:_}=this.hittestRequest;return this.isLabel?y(u,new o(X),lt(d,f,h,_)):lt(d,f,h,_)},()=>{const _=yi(this.hittestRequest.position,d,f,h),x=this.isLabel?u:new Pt(!1);return y(x,new o(X),y(R(_,this.hittestRequest.distance),new o(X),new o(fe)))})}_unpackDirection(e){const t=new Zt(e),i=Ro(t,new Zt(2)),n=Fo(t,new Zt(3));return new g(new o(i).subtract(1),new o(n).subtract(1))}_getVertexColor(e){let t=e.color;if(this.visualVariableColor){const i=this.getColorValue(e.id);t=this.visualVariableColor.getColor(i,e.color,new Pt(!1))}if(this.visualVariableOpacity){const i=this.getOpacityValue(e.id),n=this.visualVariableOpacity.getOpacity(i);t=t.multiply(n)}return t}};r([M(rt)],se.prototype,"visualVariableColor",void 0),r([M(st)],se.prototype,"visualVariableOpacity",void 0),r([M(hi)],se.prototype,"visualVariableRotation",void 0),r([M(Ft)],se.prototype,"visualVariableSizeMinMaxValue",void 0),r([M(ht)],se.prototype,"visualVariableSizeScaleStops",void 0),r([M(yt)],se.prototype,"visualVariableSizeStops",void 0),r([M(Et)],se.prototype,"visualVariableSizeUnitValue",void 0),r([m(Re)],se.prototype,"mosaicInfo",void 0),r([H($)],se.prototype,"mosaicTexture",void 0),r([le],se.prototype,"textRenderPassType",void 0),r([le],se.prototype,"isBackgroundPass",void 0),r([le],se.prototype,"isLabel",void 0),r([I(0,z(we)),I(1,z(Yi))],se.prototype,"vertex",null),r([I(0,z(ir))],se.prototype,"fragment",null);let nr=class extends oe{constructor(){super(...arguments),this.type=20,this.shaders={geometry:new se},this.drawPhase=14,this.symbologyPlane=3}render(e,t){const{painter:i}=e,n=J(e),s={...ne(e),stencil:{write:!1,test:{compare:516,mask:255,op:{fail:7680,zFail:7680,zPass:7680}}}},l=t.instance.getInput(),u={shader:this.shaders.geometry,uniforms:{...me(e,t.target,l.uniforms),...Q(e,t.target),mosaicInfo:i.textureManager.getMosaicInfo(e,t.textureKey)},textures:{...ie(e),mosaicTexture:i.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...n,textRenderPassType:0,isBackgroundPass:!0,isLabel:!0},optionalAttributes:l.optionalAttributes,useComputeBuffer:j(e)};i.setPipelineState(s),i.setShader(u),i.submitDraw(e,t,{stencilRef:255}),i.setShader({...u,defines:{...n,textRenderPassType:2,isBackgroundPass:!1,isLabel:!0}}),i.submitDraw(e,t,{stencilRef:255}),i.setShader({...u,defines:{...n,textRenderPassType:0,isBackgroundPass:!1,isLabel:!0}}),i.submitDraw(e,t,{stencilRef:255})}};function or(a){return W(new o(0),a).multiply(2).subtract(1)}class Ct extends ke{}r([v(9,o)],Ct.prototype,"accumulatedDistance",void 0),r([v(10,o)],Ct.prototype,"totalLength",void 0),r([v(11,o)],Ct.prototype,"gradientSize",void 0),r([v(12,g)],Ct.prototype,"segmentDirection",void 0),r([v(13,S)],Ct.prototype,"tlbr",void 0);class oo extends Y{}r([m(o)],oo.prototype,"isColorPass",void 0);class Wt extends Ie{constructor(){super(...arguments),this.type="GradientStrokeShader"}vertex(e,t){const{totalLength:i,gradientSize:n,segmentDirection:s,tlbr:l}=e,u=bi(this,e),c=K(e.bitset,ti.isAlongLine),p=i.divide(this.view.displayZoomFactor),d=y(at(e.bitset,ti.isAbsoluteSize),()=>{const _=y(R(c,new o(.5)),p,u.halfWidth);return n.divide(_)},n),f=e.accumulatedDistance.add(gt(s,u.scaledOffset).divide(p)),h=l.divide(this.mosaicInfo.size.xyxy);return{...u,tlbr:h,relativePositionAlongLine:f,relativeGradientSize:d,isAlongLine:K(e.bitset,ti.isAlongLine),isDiscrete:K(e.bitset,ti.isDiscrete),...this.maybeRunHittest(e,t,u.halfWidth)}}fragment(e){const{isAlongLine:t,isDiscrete:i,relativePositionAlongLine:n,relativeGradientSize:s,normal:l,tlbr:u}=e,c=Si(e,this.antialiasingControls.blur),p=or(l.y).multiply(qe(nt(l),new o(1))),d=new o(.5).multiply(p).add(new o(.5)),f=y(R(t,new o(.5)),n,d),h=y(R(i,new o(.5)),s.subtract(1),new o(0));let _=f.add(h).divide(s);_=y(R(t,new o(.5)),_,ii(_));const x=B(u.xy,u.zw,new g(_e(_,new o(0),new o(1)),.5)),b=k(this.mosaicTexture,x),T=e.opacity.multiply(c),C=this.getFragmentOutput(b.multiply(T),e),w=W(new o(.5),this.technique.isColorPass).multiply(et("gradient-depth-epsilon")),P=W(new o(0),l.y).multiply(new o(et("gradient-depth-bias")).subtract(w));return C.glFragDepth=_e(nt(l).add(P),new o(0),new o(1)),C}}r([m(Re)],Wt.prototype,"mosaicInfo",void 0),r([H($)],Wt.prototype,"mosaicTexture",void 0),r([m(oo)],Wt.prototype,"technique",void 0),r([I(0,z(Ct)),I(1,z(Ce))],Wt.prototype,"vertex",null);class ar extends oe{constructor(){super(...arguments),this.type=17,this.shaders={geometry:new Wt},this.symbologyPlane=1}_getShaderOptions(e,t,i){const{painter:n,pixelRatio:s}=e,l=t.instance.getInput();return{shader:this.shaders.geometry,uniforms:{...me(e,t.target,l.uniforms),...Q(e,t.target),antialiasingControls:St(s),mosaicInfo:n.textureManager.getMosaicInfo(e,t.textureKey),technique:{isColorPass:i}},textures:{...ie(e),mosaicTexture:n.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...J(e)},optionalAttributes:l.optionalAttributes,useComputeBuffer:j(e)}}render(e,t){const{painter:i}=e;if(j(e)||Sn(e)){const l=ne(e);return i.setPipelineState(l),i.setShader(this._getShaderOptions(e,t,1)),void i.submitDraw(e,t)}e.context.setClearDepth(1),e.context.clear(256);const n={color:!1,depth:{write:{zNear:0,zFar:1},test:513},stencil:{write:!1,test:{compare:514,mask:255,op:{fail:7680,zFail:7680,zPass:7680}}}};i.setShader(this._getShaderOptions(e,t,0)),i.setPipelineState(n),i.submitDraw(e,t);const s={color:{write:[!0,!0,!0,!0],blendMode:"composite"},depth:{write:!1,test:515},stencil:{write:!1,test:{compare:514,mask:255,op:{fail:7680,zFail:7680,zPass:7680}}}};i.setShader(this._getShaderOptions(e,t,1)),i.setPipelineState(s),i.submitDraw(e,t)}}let rr=class extends oe{constructor(){super(...arguments),this.type=21,this.shaders={geometry:new Ie},this.symbologyPlane=1}render(e,t){const{painter:i,pixelRatio:n}=e,s=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,s.uniforms),...Q(e,t.target),antialiasingControls:St(n)},textures:ie(e),defines:{...J(e)},optionalAttributes:s.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}};class At extends ke{}r([v(9,o)],At.prototype,"accumulatedDistance",void 0),r([v(10,g)],At.prototype,"segmentDirection",void 0),r([v(11,o)],At.prototype,"offsetAlongLine",void 0),r([v(12,o)],At.prototype,"capType",void 0),r([v(13,S)],At.prototype,"tlbr",void 0);class li extends Ie{constructor(){super(...arguments),this.type="TexturedLineShader"}_getDistanceRatio(e,t){const i=K(e.bitset,qo);return i.multiply(ge(t,new o(.25)).multiply(new o(2))).add(new o(1).subtract(i).multiply(wo(1)))}_getSDFAlpha(e){const{halfWidth:t,normal:i,tlbr:n,patternSize:s,accumulatedDistance:l,offsetAlongLine:u,dashToPx:c,capType:p}=e,d=s.x.divide(Oo).multiply(c),f=Pi(l.add(u).divide(d)),h=B(n.xy,n.zw,new g(f,.5)),_=_i(k(this.mosaicTexture,h)).multiply(2).subtract(1).multiply(Io).multiply(c),x=i.y.multiply(t),b=ce([N(p,new o(1)),_.subtract(t)],[N(p,new o(2)),zn(Eo(ge(_,new o(0)),new o(2)).add(x.multiply(x))).subtract(t)],[!0,_]),T=_e(new o(.25).subtract(b),new o(0),new o(1));return new S(T)}_getPatternColor(e){const{halfWidth:t,normal:i,color:n,accumulatedDistance:s,patternSize:l,sampleAlphaOnly:u,tlbr:c}=e,p=l.y.multiply(new o(2).multiply(t).divide(l.x)),d=Pi(s.divide(p)),f=new o(.5).multiply(i.y).add(new o(.5)),h=B(c.xy,c.zw,new g(f,d));let _=k(this.mosaicTexture,h);return this.visualVariableColor!=null&&(_=y(R(u,new o(.5)),new S(n.a),n)),_}vertex(e,t){const{segmentDirection:i,tlbr:n,bitset:s}=e,l=bi(this,e),u=e.accumulatedDistance.divide(this.view.displayZoomFactor).add(gt(i,l.scaledOffset)),c=new g(n.z.subtract(n.x),n.w.subtract(n.y)),p=n.divide(this.mosaicInfo.size.xyxy),d=K(s,jo),f=K(s,Pn),h=y(R(d,new o(.5)),this._getDistanceRatio(e,l.scaledHalfWidth),new o(1));return{...l,tlbr:p,patternSize:c,accumulatedDistance:u,isSDF:d,sampleAlphaOnly:f,dashToPx:h,offsetAlongLine:e.offsetAlongLine,capType:e.capType,...this.maybeRunHittest(e,t,l.halfWidth)}}fragment(e){const{color:t,opacity:i,isSDF:n}=e,s=Si(e,this.antialiasingControls.blur),l=y(R(n,new o(.5)),this._getSDFAlpha(e),this._getPatternColor(e)),u=t.multiply(i).multiply(s).multiply(l);return this.getFragmentOutput(u,e)}}r([m(Re)],li.prototype,"mosaicInfo",void 0),r([H($)],li.prototype,"mosaicTexture",void 0),r([I(0,z(At)),I(1,z(Ce))],li.prototype,"vertex",null);class sr extends oe{constructor(){super(...arguments),this.type=33,this.shaders={geometry:new li},this.symbologyPlane=1}render(e,t){const{painter:i,pixelRatio:n}=e,s=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,s.uniforms),...Q(e,t.target),antialiasingControls:St(n),mosaicInfo:i.textureManager.getMosaicInfo(e,t.textureKey)},textures:{...ie(e),mosaicTexture:i.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...J(e)},optionalAttributes:s.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}}class He extends ze{}r([v(3,S)],He.prototype,"color",void 0),r([v(4,S)],He.prototype,"outlineColor",void 0),r([v(5,g)],He.prototype,"offset",void 0),r([v(6,g)],He.prototype,"textureUV",void 0),r([v(7,S)],He.prototype,"sizing",void 0),r([v(8,o)],He.prototype,"placementAngle",void 0),r([v(9,o)],He.prototype,"sdfDecodeCoeff",void 0),r([v(10,g)],He.prototype,"zoomRange",void 0);class Ut extends Xt{}r([v(11,g)],Ut.prototype,"offsetNextVertex1",void 0),r([v(12,g)],Ut.prototype,"offsetNextVertex2",void 0),r([v(13,g)],Ut.prototype,"textureUVNextVertex1",void 0),r([v(14,g)],Ut.prototype,"textureUVNextVertex2",void 0);class lr extends Ve{}function Ne(a,e,t,i){return e.multiply(a.x).add(t.multiply(a.y)).add(i.multiply(a.z))}function Ai(a){return a.multiply(a).divide(128)}class Oe extends ue{constructor(){super(...arguments),this.type="MarkerShader",this.computeAttributes={offset:["offsetNextVertex1","offsetNextVertex2"],textureUV:["textureUVNextVertex1","textureUVNextVertex2"]}}vertex(e,t){const i=Ai(e.sizing.x),n=Ai(e.sizing.y),s=Ai(e.sizing.z),l=e.placementAngle,u=K(e.bitset,ye.bitset.isSDF),c=K(e.bitset,ye.bitset.isMapAligned),p=K(e.bitset,ye.bitset.scaleSymbolsProportionally),d=at(e.bitset,ye.bitset.colorLocked),f=Mt(this,e.id),h=Lt(this,e.id,e.color,d).multiply(f),_=this.view.displayViewScreenMat3.multiply(new D(e.pos.xy,1)),x=qt(this,e.id,s).divide(s),b=i.multiply(x),T=e.offset.xy.multiply(x);let C=n.multiply(p.multiply(x.subtract(1)).add(1));C=qe(C,ge(b.subtract(.99),new o(0)));const w=ge(C,new o(1)),P=qe(C,new o(1)),E=G.fromRotation(l.multiply(ki)),A=Rn(this,e.id),V=this._getViewRotationMatrix(c).multiply(A).multiply(E).multiply(new D(T.xy,0)).multiply(this.view.scaleFactor),F=this.clip(e.id,e.zoomRange),L=new S(_.xy.add(V.xy),F,1),O=e.textureUV.divide(this.mosaicInfo.size),U=e.outlineColor.multiply(P),ae=K(e.bitset,ye.bitset.overrideOutlineColor),be=e.sdfDecodeCoeff.multiply(b);return{glPosition:L,color:h,textureUV:O,outlineColor:U,outlineSize:w,distanceToPx:be,isSDF:u,overrideOutlineColor:ae,...this.maybeRunHittest(e,t,{pos:e.pos,size:b,sizeCorrection:x,scaleFactor:this.view.scaleFactor,isMapAligned:c,vvRotationMat3:A,placementMat3:E,outlineSize:w,distanceToPx:be,isSDF:u})}}fragment(e){const t=this._getColor(e.textureUV,e);return this.getFragmentOutput(t,e)}hittest(e,t,i){const{pos0:n,pos1:s,pos2:l}=this.computeHittestTriangle(e,t,i),u=Xe(this.hittestRequest);return y(u,()=>{const{tlbr:c}=this.hittestRequest;return Nn(n,s,l,c)},()=>y(ot(i.size,this.hittestRequest.smallSymbolSizeThreshold),this._hittestSmallMarker(e,t,i),this._hittestMarker(e,t,i)))}_getViewRotationMatrix(e){const t=this.view.displayViewMat3,i=this.view.displayMat3,n=new o(1).subtract(e);return t.multiply(e).add(i.multiply(n))}_getViewScreenMatrix(e){const t=this.view.viewMat3.multiply(this.view.tileMat3),i=this.view.tileMat3,n=new o(1).subtract(e);return t.multiply(e).add(i.multiply(n))}_getColor(e,t){return y(N(t.isSDF,new o(1)),this._getSDFColor(e,t),this._getSpriteColor(e,t))}_getSpriteColor(e,t){return k(this.mosaicTexture,e).multiply(t.color)}_getSDFColor(e,t){const i=k(this.mosaicTexture,e),n=new o(.5).subtract(_i(i)).multiply(t.distanceToPx).multiply(An),s=_e(new o(.5).subtract(n),new o(0),new o(1)),l=t.color.multiply(s);let u=t.outlineSize;this.highlight&&(u=ge(u,t.overrideOutlineColor.multiply(4)));const c=u.multiply(.5),p=Qt(n).subtract(c),d=_e(new o(.5).subtract(p),new o(0),new o(1)),f=B(t.outlineColor,t.color,t.overrideOutlineColor).multiply(d);return new o(1).subtract(f.a).multiply(l).add(f)}_hittestSmallMarker(e,t,i){const{position:n,distance:s,smallSymbolDistance:l}=this.hittestRequest,u=s.subtract(l),{viewMat3:c,tileMat3:p}=this.view,d=c.multiply(p).multiply(new D(i.pos,1)).xy,f=i.size.multiply(.5),h=gi(d,n).subtract(f).add(u);return y(R(h,this.hittestRequest.distance),new o(X),new o(fe))}_hittestMarker(e,t,i){const{pos0:n,pos1:s,pos2:l}=this.computeHittestTriangle(e,t,i),u=this.hittestRequest.position,c=this.hittestRequest.distance,p=yi(u,n,s,l);return y(R(p,c),new o(X),this._hittestSamples(n,s,l,e,t,i))}computeHittestTriangle(e,t,i){const{pos:n,sizeCorrection:s,scaleFactor:l,isMapAligned:u}=i,c=new D(e.offset.multiply(s).multiply(l),0),p=new D(t.offsetNextVertex1.multiply(s).multiply(l),0),d=new D(t.offsetNextVertex2.multiply(s).multiply(l),0),{viewMat3:f,tileMat3:h}=this.view,_=f.multiply(h).multiply(new D(n,1)),x=this._getViewScreenMatrix(u).multiply(i.vvRotationMat3).multiply(i.placementMat3);return{pos0:_.add(x.multiply(c)).xy,pos1:_.add(x.multiply(p)).xy,pos2:_.add(x.multiply(d)).xy}}_hittestSamples(e,t,i,n,s,l){const{outlineSize:u,isSDF:c,distanceToPx:p}=l,d=this.hittestRequest.position,f=this.hittestRequest.distance,h=q(d.add(new g(ee(f),ee(f))),e,t,i),_=q(d.add(new g(0,ee(f))),e,t,i),x=q(d.add(new g(f,ee(f))),e,t,i),b=q(d.add(new g(ee(f),0)),e,t,i),T=q(d,e,t,i),C=q(d.add(new g(f,0)),e,t,i),w=q(d.add(new g(ee(f),f)),e,t,i),P=q(d.add(new g(0,f)),e,t,i),E=q(d.add(new g(f,f)),e,t,i),A=n.textureUV.divide(this.mosaicInfo.size),V=s.textureUVNextVertex1.divide(this.mosaicInfo.size),F=s.textureUVNextVertex2.divide(this.mosaicInfo.size),L={color:new S(1),outlineColor:new S(1),overrideOutlineColor:new o(1),outlineSize:u,distanceToPx:p,isSDF:c};let O=new o(0);return O=O.add(Z(h).multiply(this._getColor(Ne(h,A,V,F),L).a)),O=O.add(Z(_).multiply(this._getColor(Ne(_,A,V,F),L).a)),O=O.add(Z(x).multiply(this._getColor(Ne(x,A,V,F),L).a)),O=O.add(Z(b).multiply(this._getColor(Ne(b,A,V,F),L).a)),O=O.add(Z(T).multiply(this._getColor(Ne(T,A,V,F),L).a)),O=O.add(Z(C).multiply(this._getColor(Ne(C,A,V,F),L).a)),O=O.add(Z(w).multiply(this._getColor(Ne(w,A,V,F),L).a)),O=O.add(Z(P).multiply(this._getColor(Ne(P,A,V,F),L).a)),O=O.add(Z(E).multiply(this._getColor(Ne(E,A,V,F),L).a)),y(R(O,new o(.05)),new o(fe),new o(X))}}r([M(rt)],Oe.prototype,"visualVariableColor",void 0),r([M(st)],Oe.prototype,"visualVariableOpacity",void 0),r([M(hi)],Oe.prototype,"visualVariableRotation",void 0),r([M(Ft)],Oe.prototype,"visualVariableSizeMinMaxValue",void 0),r([M(ht)],Oe.prototype,"visualVariableSizeScaleStops",void 0),r([M(yt)],Oe.prototype,"visualVariableSizeStops",void 0),r([M(Et)],Oe.prototype,"visualVariableSizeUnitValue",void 0),r([m(Re)],Oe.prototype,"mosaicInfo",void 0),r([H($)],Oe.prototype,"mosaicTexture",void 0),r([I(0,z(He)),I(1,z(Ut))],Oe.prototype,"vertex",null),r([I(0,z(lr))],Oe.prototype,"fragment",null);let ur=class extends oe{constructor(){super(...arguments),this.type=23,this.shaders={geometry:new Oe},this.symbologyPlane=2}render(e,t){const{painter:i}=e,n=t.instance.getInput();i.setShader({shader:this.shaders.geometry,uniforms:{...me(e,t.target,n.uniforms),...Q(e,t.target),mosaicInfo:i.textureManager.getMosaicInfo(e,t.textureKey,!0)},textures:{...ie(e),mosaicTexture:i.textureManager.getMosaicTexture(e,t.textureKey,!0)},defines:{...J(e)},optionalAttributes:n.optionalAttributes,useComputeBuffer:j(e)}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}};class cr{constructor(){this.computeAttributes={}}get locationsMap(){const e=new Map;for(const t in this.locations)e.set(t,this.locations[t].index);return e}get optionPropertyKeys(){if(!this._optionPropertyKeys){const e=new Set(Object.keys(this.options));this._optionPropertyKeys=e}return this._optionPropertyKeys}get _transformFeedbackBindings(){return[]}get locationInfo(){if(!this._locationInfo){const e=this.locationsMap,t=Array.from(e.entries()).map(([i,n])=>`${i}.${n}`).join(".");this._locationInfo={stringHash:t,locations:e,computeAttributeMap:this.computeAttributes}}return this._locationInfo}get renamedLocationsMap(){const e=new Map;for(const[t,i]of this.locationsMap.entries())e.set("a_"+t,i);return e}getShaderKey(e,t,i,n,s){return`${Object.keys(e).map(l=>`${l}.${e[l]}`).join(".")}.${Object.keys(n).filter(l=>n[l]).map(l=>`${l}_${n[l].toString()}`).join(".")}.${Object.keys(t).filter(l=>this.optionPropertyKeys.has(l)).join(".")}.${Object.keys(i).filter(l=>i[l]).join(".")}`}getProgram(e,t,i,n){let s="",l="";for(const u in i)if(i[u]){const c=typeof i[u]=="boolean"?`#define ${u}
`:`#define ${u} ${i[u]}
`;s+=c,l+=c}return s+=this.vertexShader,l+=this.fragmentShader,new Lo("glslShaderModule",s,l,this.renamedLocationsMap,this._getUniformBindings(t),this._getTextureBindings(),this._transformFeedbackBindings)}_getUniformBindings(e){const t=[];for(const i in this.required){const n=this.required[i];t.push({uniformHydrated:null,shaderModulePath:i,uniformName:i,uniformType:n.type,uniformArrayElementType:mn(n),uniformArrayLength:vn(n)})}for(const i in e){const n=this.options[i];if(e[i])for(const s in n){const l=n[s];t.push({uniformHydrated:null,shaderModulePath:`${i}.${s}`,uniformName:s,uniformType:l.type,uniformArrayElementType:mn(l),uniformArrayLength:vn(l)})}}return t}_getTextureBindings(){const e=[];for(const t in this.textures)e.push({textureHydrated:null,shaderModulePath:t,textureName:t});return e}}const mn=a=>a.type==="array"?a.elementType?.type:void 0,vn=a=>a.type==="array"?a.size:void 0,dr={hittestDist:o,hittestPos:g},pr={size:o},fr={filterFlags:$,animation:$,visualVariableData:$,dataDriven0:$,dataDriven1:$,dataDriven2:$,gpgpu:$},mr={displayViewScreenMat3:G,displayViewMat3:G,displayMat3:G,viewMat3:G,tileMat3:G,displayZoomFactor:o,requiredZoomFactor:o,tileOffset:g,currentScale:o,currentZoom:o,metersPerSRUnit:o};class vr extends cr{constructor(){super(...arguments),this.vertexShader=cn("materials/pie/pie.vert"),this.fragmentShader=cn("materials/pie/pie.frag"),this.required={...mr,...pr,outlineWidth:o,colors:pe,defaultColor:S,othersColor:S,outlineColor:S,donutRatio:o,sectorThreshold:o},this.textures=fr,this.options={hittestUniforms:dr,visualVariableSizeMinMaxValue:{minMaxValueAndSize:S},visualVariableSizeScaleStops:{sizes:{type:"array",elementType:o,size:8},values:{type:"array",elementType:o,size:8}},visualVariableSizeStops:{sizes:{type:"array",elementType:o,size:8},values:{type:"array",elementType:o,size:8}},visualVariableSizeUnitValue:{unitValueToPixelsRatio:o},visualVariableOpacity:{opacities:{type:"array",elementType:o,size:8},opacityValues:{type:"array",elementType:o,size:8}},highlightUniforms:{highlightAll:o,activeReasons:o}},this.locations={pos:{index:0,type:g},id:{index:1,type:D},bitset:{index:2,type:o},offset:{index:3,type:g},texCoords:{index:4,type:g},referenceSize:{index:5,type:o},zoomRange:{index:6,type:g}},this.defines={VV_SIZE_MIN_MAX_VALUE:"boolean",VV_SIZE_SCALE_STOPS:"boolean",VV_SIZE_FIELD_STOPS:"boolean",VV_SIZE_UNIT_VALUE:"boolean",VV_OPACITY:"boolean",HITTEST:"boolean",numberOfFields:"number",highlight:"boolean",inside:"boolean",outside:"boolean"}}setNumberOfFields(e){this.required.colors={type:"array",elementType:S,size:e}}}class gr extends oe{constructor(){super(...arguments),this.type=30,this.shaders={geometry:new vr},this.symbologyPlane=2}render(e,t){const{painter:i}=e,{instance:n,target:s}=t,l=this.shaders.geometry,u=n.getInput(),c=u.uniforms.numberOfFields,p=j(e),d=Q(e,s),f=J(e);l.setNumberOfFields(c),i.setShader({shader:l,uniforms:{...me(e,t.target,u.uniforms.shader),...d.storage,...d.view,...d.highlight,highlightUniforms:d.highlight,hittestUniforms:d.hittestRequest?{hittestDist:d.hittestRequest?.distance,hittestPos:d.hittestRequest?.position}:null},textures:zo(e),defines:{VV_SIZE_MIN_MAX_VALUE:!!u.uniforms.shader.visualVariableSizeMinMaxValue,VV_SIZE_SCALE_STOPS:!!u.uniforms.shader.visualVariableSizeScaleStops,VV_SIZE_FIELD_STOPS:!!u.uniforms.shader.visualVariableSizeStops,VV_SIZE_UNIT_VALUE:!!u.uniforms.shader.visualVariableSizeUnitValue,VV_OPACITY:!!u.uniforms.shader.visualVariableOpacity,HITTEST:p,highlight:d.highlight?1:0,...f,numberOfFields:c},optionalAttributes:{},useComputeBuffer:p}),i.setPipelineState(ne(e)),i.submitDraw(e,t)}}class _r extends oe{constructor(){super(...arguments),this.type=32,this.shaders={geometry:new se},this.symbologyPlane=3}render(e,t){const{painter:i}=e,n=J(e),s=t.instance.getInput(),l={shader:this.shaders.geometry,uniforms:{...me(e,t.target,s.uniforms),...Q(e,t.target),mosaicInfo:i.textureManager.getMosaicInfo(e,t.textureKey)},textures:{...ie(e),mosaicTexture:i.textureManager.getMosaicTexture(e,t.textureKey)},defines:{...n,isBackgroundPass:!0,isLabel:!1,textRenderPassType:0},optionalAttributes:s.optionalAttributes,useComputeBuffer:j(e)};i.setShader(l),i.setPipelineState(ne(e)),i.submitDraw(e,t),i.setShader({...l,defines:{...n,isBackgroundPass:!1,isLabel:!1,textRenderPassType:2}}),i.submitDraw(e,t),i.setShader({...l,defines:{...n,isBackgroundPass:!1,isLabel:!1,textRenderPassType:1}}),i.submitDraw(e,t),i.setShader({...l,defines:{...n,isBackgroundPass:!1,isLabel:!1,textRenderPassType:0}}),i.submitDraw(e,t)}}const vi={fill:new Pa,patternFill:new Fa,complexFill:new Oa,gradientFill:new Va,outlineFill:new Ra,patternOutlineFill:new Ea,complexOutlineFill:new Aa,marker:new ur,pieChart:new gr,line:new rr,texturedLine:new sr,gradientStroke:new ar,text:new _r,label:new nr,heatmap:new Ka,dotDensity:new wa,flow:new Wa,animatedMarker:new ga,animatedMarkerShift:new _a,animatedFill:new ha,animatedLine:new ya};function Il(){for(const a in vi)vi[a].startup()}function zl(a){for(const e in vi)vi[e].shutdown(a)}export{zl as C,Pe as F,Fe as O,Ks as a,Ma as b,$a as c,Xs as d,el as e,nl as f,Na as g,Il as h,il as i,Ae as k,cn as n,Js as o,Ba as p,tl as r,Qs as s,Wi as t,ol as v,vi as x};
