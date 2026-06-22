import{oL as u,qH as d,cg as m,Gw as b,FD as x,fJ as y,lF as F}from"./index-BG8eAma1.js";import{e as j}from"./ShaderCompiler-G2XYGDs6.js";import{e as O}from"./ProgramTemplate-C7cEZy_n.js";function c(r){const{options:e,value:n}=r;return typeof e[n]=="number"}function p(r){let e="";for(const n in r){const o=r[n];if(typeof o=="boolean")o&&(e+=`#define ${n}
`);else if(typeof o=="number")e+=`#define ${n} ${o.toFixed()}
`;else if(typeof o=="object")if(c(o)){const{value:t,options:f,namespace:s}=o,a=s?`${s}_`:"";for(const i in f)e+=`#define ${a}${i} ${f[i].toFixed()}
`;e+=`#define ${n} ${a}${t}
`}else{const t=o.options;let f=0;for(const s in t)e+=`#define ${t[s]} ${(f++).toFixed()}
`;e+=`#define ${n} ${t[o.value]}
`}}return e}export{u as BufferObject,d as FramebufferObject,m as Program,b as ProgramCache,x as Renderbuffer,j as ShaderCompiler,y as Texture,F as VertexArrayObject,O as createProgram,p as glslifyDefineMap};
