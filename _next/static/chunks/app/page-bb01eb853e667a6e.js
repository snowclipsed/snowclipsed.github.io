(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[974],{1184:(e,t,a)=>{Promise.resolve().then(a.bind(a,7312))},7312:(e,t,a)=>{"use strict";a.r(t),a.d(t,{default:()=>M});var r=a(5155),s=a(2115);let l=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase(),o=function(){for(var e=arguments.length,t=Array(e),a=0;a<e;a++)t[a]=arguments[a];return t.filter((e,t,a)=>!!e&&""!==e.trim()&&a.indexOf(e)===t).join(" ").trim()};var n={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};let i=(0,s.forwardRef)((e,t)=>{let{color:a="currentColor",size:r=24,strokeWidth:l=2,absoluteStrokeWidth:i,className:c="",children:d,iconNode:h,...m}=e;return(0,s.createElement)("svg",{ref:t,...n,width:r,height:r,stroke:a,strokeWidth:i?24*Number(l)/Number(r):l,className:o("lucide",c),...m},[...h.map(e=>{let[t,a]=e;return(0,s.createElement)(t,a)}),...Array.isArray(d)?d:[d]])}),c=(e,t)=>{let a=(0,s.forwardRef)((a,r)=>{let{className:n,...c}=a;return(0,s.createElement)(i,{ref:r,iconNode:t,className:o("lucide-".concat(l(e)),n),...c})});return a.displayName="".concat(e),a},d=c("Terminal",[["polyline",{points:"4 17 10 11 4 5",key:"akl6gq"}],["line",{x1:"12",x2:"20",y1:"19",y2:"19",key:"q2wloq"}]]),h=c("Book",[["path",{d:"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",key:"k3hazp"}]]),m=c("Network",[["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1",key:"4q2zg0"}],["rect",{x:"2",y:"16",width:"6",height:"6",rx:"1",key:"8cvhb9"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1",key:"1egb70"}],["path",{d:"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",key:"1jsf9p"}],["path",{d:"M12 12V8",key:"2874zd"}]]),p=c("Brain",[["path",{d:"M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z",key:"l5xja"}],["path",{d:"M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z",key:"ep3f8r"}],["path",{d:"M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4",key:"1p4c4q"}],["path",{d:"M17.599 6.5a3 3 0 0 0 .399-1.375",key:"tmeiqw"}],["path",{d:"M6.003 5.125A3 3 0 0 0 6.401 6.5",key:"105sqy"}],["path",{d:"M3.477 10.896a4 4 0 0 1 .585-.396",key:"ql3yin"}],["path",{d:"M19.938 10.5a4 4 0 0 1 .585.396",key:"1qfode"}],["path",{d:"M6 18a4 4 0 0 1-1.967-.516",key:"2e4loj"}],["path",{d:"M19.967 17.484A4 4 0 0 1 18 18",key:"159ez6"}]]),x=c("Target",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["circle",{cx:"12",cy:"12",r:"6",key:"1vlfrh"}],["circle",{cx:"12",cy:"12",r:"2",key:"1c9p78"}]]),u={scale:.05,speed:.02,octaves:2,persistence:.5,lacunarity:2,zoom:1,contrast:1.5,heightScale:1},b=()=>{let e=(0,s.useRef)(0),[t,a]=(0,s.useState)([]),l=(0,s.useRef)(null),[o,n]=(0,s.useState)(!1),[i,c]=(0,s.useState)("white"),[d,h]=(0,s.useState)({x:30,y:45,z:0}),[m,p]=(0,s.useState)(u),[x,b]=(0,s.useState)(!1),[f,v]=(0,s.useState)({x:0,y:0}),y=(0,s.useCallback)(function(e){let t,a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];t=a?Math.max(0,Math.min(1,t=(e+1)/2)):Math.max(0,Math.min(1,e));let r=[{pos:0,color:"#000066"},{pos:.3,color:"#0000FF"},{pos:.5,color:"#00FFFF"},{pos:.7,color:"#00FF00"},{pos:.85,color:"#FFFF00"},{pos:1,color:"#FF0000"}];for(let e=0;e<r.length-1;e++)if(t>=r[e].pos&&t<=r[e+1].pos){let a=r[e],s=r[e+1],l=(t-a.pos)/(s.pos-a.pos),o={r:parseInt(a.color.slice(1,3),16),g:parseInt(a.color.slice(3,5),16),b:parseInt(a.color.slice(5,7),16)},n={r:parseInt(s.color.slice(1,3),16),g:parseInt(s.color.slice(3,5),16),b:parseInt(s.color.slice(5,7),16)},i=Math.round(o.r+(n.r-o.r)*l),c=Math.round(o.g+(n.g-o.g)*l),d=Math.round(o.b+(n.b-o.b)*l);return"#".concat(i.toString(16).padStart(2,"0")).concat(c.toString(16).padStart(2,"0")).concat(d.toString(16).padStart(2,"0"))}return t<=r[0].pos?r[0].color:r[r.length-1].color},[]),g=(0,s.useCallback)(e=>{let[t,a,r]=e,s=a*Math.cos(d.x*Math.PI/180)-r*Math.sin(d.x*Math.PI/180),l=a*Math.sin(d.x*Math.PI/180)+r*Math.cos(d.x*Math.PI/180);return[t*Math.cos(d.y*Math.PI/180)+l*Math.sin(d.y*Math.PI/180),s,-t*Math.sin(d.y*Math.PI/180)+l*Math.cos(d.y*Math.PI/180)]},[d]),j=(0,s.useCallback)(e=>{let[t,a,r]=e,s=100/(r+100);return[t*s,(a+-(.8*m.heightScale))*s]},[m.heightScale]),N=(0,s.useCallback)((e,t)=>{let a=Math.floor(e),r=Math.floor(t),s=(e,t)=>{let a=43758.5453123*Math.sin(12.9898*e+78.233*t);return a-Math.floor(a)},l=s(a,r),o=s(a+1,r),n=s(a,r+1),i=s(a+1,r+1),c=e-a,d=t-r,h=(3-2*c)*c*c,m=(3-2*d)*d*d;return l*(1-h)*(1-m)+o*h*(1-m)+n*(1-h)*m+i*h*m},[]),w=(0,s.useCallback)((e,t)=>{let a=0,r=1,s=1,l=0;for(let o=0;o<m.octaves;o++)a+=N(e*s,t*s)*r,l+=r,r*=m.persistence,s*=m.lacunarity;return a/l},[m.octaves,m.persistence,m.lacunarity,N]),M=(0,s.useCallback)(e=>{let t=" .,:;~!?▒█",a=Array(48).fill(null).map(()=>Array(80).fill({char:" ",color:"white"===i?"#ffffff":"#00008B"})),r=Array(48).fill(null).map(()=>Array(80).fill(-1/0)),s=[];for(let t=-20;t<20;t++)for(let a=-20;a<20;a++){let r=w(a*m.scale*m.zoom+.1*e,t*m.scale*m.zoom),l=r=2*Math.pow(.5*r+.5,m.contrast)-1,o=g([2*a,r=(r+.5)*m.heightScale,2*t]),n=j(o);s.push({pos:o,projected:n,brightness:r,heightForColor:l})}return s.sort((e,t)=>t.pos[2]-e.pos[2]),s.forEach(e=>{let[s,l]=e.projected,o=Math.floor(s+40),n=Math.floor(l+24);if(o>=0&&o<80&&n>=0&&n<48&&e.pos[2]>r[n][o]){r[n][o]=e.pos[2];let s=Math.floor((e.brightness+1)*.5*(t.length-1)),l=t[Math.max(0,Math.min(t.length-1,s))],c="white"===i?"#ffffff":y(e.heightForColor,!0);a[n][o]={char:l,color:c}}}),a},[m,i,y,w,j,g]),k=(0,s.useCallback)(e=>{let t=" .:-=+*#%@",a=[];for(let r=0;r<48;r++){let s=[];for(let a=0;a<80;a++){let l=w(a*m.scale*m.zoom+e,r*m.scale*m.zoom+e),o=Math.floor((l=Math.pow(.5*l+.5,m.contrast))*(t.length-.01)),n=t[Math.max(0,Math.min(t.length-1,o))],c="white"===i?"#ffffff":y(l);s.push({char:n,color:c})}a.push(s)}return a},[m,i,y,w]),S=(0,s.useCallback)(e=>{b(!0),v({x:e.clientX,y:e.clientY})},[]),E=(0,s.useCallback)(e=>{if(!x||!o)return;e.preventDefault();let t=e.clientX,a=e.clientY;requestAnimationFrame(()=>{let e=t-f.x,r=a-f.y;h(t=>({x:t.x+.5*r,y:t.y+.5*e,z:t.z})),v({x:t,y:a})})},[x,o,f]),C=(0,s.useCallback)(()=>{b(!1)},[]),A=(0,s.useCallback)(()=>{p(u),h({x:30,y:45,z:0})},[]);return(0,s.useEffect)(()=>{let t=()=>{e.current+=m.speed,l.current=requestAnimationFrame(t)};return l.current=requestAnimationFrame(t),()=>{null!==l.current&&cancelAnimationFrame(l.current)}},[m.speed]),(0,s.useEffect)(()=>{let t=requestAnimationFrame(()=>{a(o?M(e.current):k(e.current))});return()=>cancelAnimationFrame(t)},[e.current,o,M,k,d,i]),(0,r.jsxs)("div",{className:"flex border border-white bg-black",children:[(0,r.jsx)("div",{className:"flex-1 border-r border-white",onMouseDown:S,onMouseMove:E,onMouseUp:C,onMouseLeave:C,children:(0,r.jsx)("pre",{className:"font-mono text-xs leading-none whitespace-pre p-1 select-none",children:t.map((e,t)=>(0,r.jsx)("div",{children:e.map((e,a)=>(0,r.jsx)("span",{style:{color:e.color},children:e.char},"".concat(t,"-").concat(a)))},t))})}),(0,r.jsxs)("div",{className:"w-44 flex flex-col p-1 space-y-1 bg-black text-white",children:[(0,r.jsxs)("div",{className:"border border-white p-1 text-center text-xs",children:[(0,r.jsx)("h3",{className:"font-bold",children:"NOISE CONTROL MATRIX"}),o&&(0,r.jsx)("p",{className:"opacity-75 text-xs",children:"Drag to rotate view"})]}),(0,r.jsxs)("div",{className:"flex flex-col gap-1",children:[(0,r.jsx)("button",{onClick:()=>n(e=>!e),className:"border border-white p-1 text-xs font-bold hover:bg-white hover:text-black transition-colors",children:o?"SWITCH TO FLOW MODE":"SWITCH TO 3D MODE"}),(0,r.jsx)("button",{onClick:()=>c(e=>"white"===e?"heatmap":"white"),className:"border border-white p-1 text-xs font-bold hover:bg-white hover:text-black transition-colors",children:"white"===i?"SWITCH TO HEATMAP":"SWITCH TO WHITE"}),(0,r.jsx)("button",{onClick:A,className:"border border-white p-1 text-xs font-bold hover:bg-white hover:text-black transition-colors",children:"RESET ALL SETTINGS"})]}),[{key:"scale",label:"Pattern Scale",min:.01,max:.2,step:.01},{key:"speed",label:"Speed",min:0,max:.05,step:.001},{key:"zoom",label:"Zoom",min:.5,max:2,step:.1},{key:"octaves",label:"Detail Layers",min:1,max:4,step:1},{key:"persistence",label:"Detail Strength",min:.1,max:.9,step:.1},{key:"contrast",label:"Contrast",min:.5,max:2.5,step:.1},{key:"heightScale",label:"Height Scale",min:.5,max:25,step:.5}].map(e=>{let{key:t,label:a,min:s,max:l,step:n}=e;return(0,r.jsxs)("div",{className:"border border-white p-1 ".concat("heightScale"!==t||o?"":"opacity-50 pointer-events-none"),children:[(0,r.jsxs)("div",{className:"flex justify-between mb-0.5 text-xs",children:[(0,r.jsx)("span",{className:"font-bold",children:a}),(0,r.jsx)("span",{className:"opacity-75",children:m[t].toFixed(3)})]}),(0,r.jsx)("input",{type:"range",min:s,max:l,step:n,value:m[t],onChange:e=>p(a=>({...a,[t]:parseFloat(e.target.value)})),className:"w-full accent-green-500"})]},t)})]})]})},f=()=>{let e=[{date:"2024.12.28",title:"Optimizing Neural Network Inference",preview:"Exploring cutting-edge techniques in model optimization and deployment..."},{date:"2024.12.25",title:"Low-Level Architecture Deep Dive",preview:"Understanding the intersection of hardware and ML acceleration..."},{date:"2024.12.20",title:"Research Notes: Architecture Innovation",preview:"New approaches to neural network architecture design..."}];return(0,r.jsxs)("div",{className:"space-y-4 animate-fade-in",children:[(0,r.jsx)("div",{className:"border border-white bg-black",children:(0,r.jsx)(b,{})}),(0,r.jsx)("div",{className:"space-y-4 mt-4",children:e.map((t,a)=>(0,r.jsxs)("div",{className:"border border-white p-4 relative group cursor-pointer",style:{transform:"translateX(".concat(5*a,"px)"),zIndex:e.length-a},children:[(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)("div",{className:"opacity-80 absolute -left-0.5 -top-0.5 text-red-500 pointer-events-none  group-hover:translate-x-1 transition-transform duration-300",children:(0,r.jsx)(d,{className:"w-4 h-4"})}),(0,r.jsx)("div",{className:"opacity-80 absolute -left-0.5 top-0.5 text-blue-500 pointer-events-none  group-hover:-translate-x-1 transition-transform duration-300",children:(0,r.jsx)(d,{className:"w-4 h-4"})}),(0,r.jsx)(d,{className:"w-4 h-4"})]}),(0,r.jsxs)("div",{className:"mt-2",children:[(0,r.jsxs)("div",{className:"flex flex-col md:flex-row md:justify-between md:items-center mb-2",children:[(0,r.jsx)("h3",{className:"text-xl font-bold group-hover:text-red-500 transition-colors duration-300",children:t.title}),(0,r.jsx)("span",{className:"opacity-70 text-sm md:text-base font-mono",children:t.date})]}),(0,r.jsx)("p",{className:"opacity-80 group-hover:opacity-100 transition-opacity duration-300",children:t.preview})]}),(0,r.jsxs)("div",{className:"absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",children:[(0,r.jsx)("div",{className:"absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"}),(0,r.jsx)("div",{className:"absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"}),(0,r.jsx)("div",{className:"absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"}),(0,r.jsx)("div",{className:"absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"})]})]},t.title))})]})},v=c("Mail",[["rect",{width:"20",height:"16",x:"2",y:"4",rx:"2",key:"18n3k1"}],["path",{d:"m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",key:"1ocrg3"}]]),y=c("Twitter",[["path",{d:"M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",key:"pff0z6"}]]),g=c("Globe",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]]),j=()=>{let e=[{icon:(0,r.jsx)(v,{className:"w-5 h-5"}),label:"メール",value:"snowclipsed@gmail.com"},{icon:(0,r.jsx)(y,{className:"w-5 h-5"}),label:"Twitter",value:"@snowclipsed",link:"https://x.com/snowclipsed"},{icon:(0,r.jsx)(g,{className:"w-5 h-5"}),label:"Website",value:"snowclipsed.xyz"}];return(0,r.jsxs)("div",{className:"space-y-6 animate-fade-in",children:[(0,r.jsxs)("pre",{className:"text-xs md:text-sm lg:text-base overflow-x-auto p-4 border border-white  hover:bg-white hover:text-black transition-colors duration-300 cursor-crosshair font-mono relative group",children:[(0,r.jsx)("div",{className:"absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-300"}),"\n    ╔═══════════════════════════════════╗\n    ║  NETWORK STATUS: ACTIVE           ║\n    ║  ENCRYPTION: ENABLED              ║\n    ║  FIREWALL: ACTIVE                ║\n    ║  CONNECTION: SECURE               ║\n    ╚═══════════════════════════════════╝"]}),(0,r.jsx)("div",{className:"space-y-4",children:e.map((t,a)=>(0,r.jsxs)("div",{className:"border border-white p-4 relative group cursor-pointer",style:{transform:"translateX(".concat(5*a,"px)"),zIndex:e.length-a},children:[(0,r.jsxs)("div",{className:"relative inline-block",children:[(0,r.jsx)("div",{className:"opacity-80 absolute -left-0.5 -top-0.5 text-red-500 pointer-events-none  group-hover:translate-x-1 transition-transform duration-300",children:t.icon}),(0,r.jsx)("div",{className:"opacity-80 absolute -left-0.5 top-0.5 text-blue-500 pointer-events-none  group-hover:-translate-x-1 transition-transform duration-300",children:t.icon}),t.icon]}),(0,r.jsxs)("div",{className:"ml-4 inline-block",children:[(0,r.jsx)("p",{className:"text-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300",children:t.label}),t.link?(0,r.jsx)("a",{href:t.link,target:"_blank",rel:"noopener noreferrer",className:"hover:text-red-500 transition-colors duration-300",children:t.value}):(0,r.jsx)("p",{className:"group-hover:text-blue-500 transition-colors duration-300",children:t.value})]}),(0,r.jsxs)("div",{className:"absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",children:[(0,r.jsx)("div",{className:"absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"}),(0,r.jsx)("div",{className:"absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"}),(0,r.jsx)("div",{className:"absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent"}),(0,r.jsx)("div",{className:"absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"})]})]},t.label))})]})},N=()=>{let[e,t]=(0,s.useState)([]),[a,l]=(0,s.useState)(""),[o,n]=(0,s.useState)(!1),[i,c]=(0,s.useState)({x:0,y:0}),d=(0,s.useRef)(null),[h,m]=(0,s.useState)({scale:2,displayScale:.9,xOffset:80,yOffset:30,rotateX:24,rotateY:-18,rotateZ:-44,sigma:10.3,rho:23.7,beta:1.7,speed:1}),p=(0,s.useRef)(null);(0,s.useEffect)(()=>{let e=d.current;if(!e)return;let t=()=>{document.body.style.overflow="hidden"},a=()=>{document.body.style.overflow="auto"};return e.addEventListener("mouseenter",t),e.addEventListener("mouseleave",a),()=>{e.removeEventListener("mouseenter",t),e.removeEventListener("mouseleave",a),document.body.style.overflow="auto"}},[]),(0,s.useEffect)(()=>{l(b(e))},[e,h]),(0,s.useEffect)(()=>{let e=.1,a=0,r=0,s=[];for(let t=0;t<1e3;t++){let t=h.sigma*(a-e)*.01,l=(e*(h.rho-r)-a)*.01,o=(e*a-h.beta*r)*.01;e+=t,a+=l,r+=o,s.push({x:e,y:a,z:r})}t(s)},[h.sigma,h.rho,h.beta]);let x=e=>{let{x:t,y:a,z:r}=e,s=h.rotateX*Math.PI/180,l=h.rotateY*Math.PI/180,o=h.rotateZ*Math.PI/180,n=a*Math.cos(s)-r*Math.sin(s),i=a*Math.sin(s)+r*Math.cos(s),c=t*Math.cos(l)+i*Math.sin(l);return{x:c*Math.cos(o)-n*Math.sin(o),y:c*Math.sin(o)+n*Math.cos(o),z:-t*Math.sin(l)+i*Math.cos(l)}},u=e=>{let t=x(e);return{x:Math.floor(t.x*h.scale+h.xOffset),y:Math.floor(t.y*h.scale+h.yOffset)}},b=(0,s.useCallback)(e=>{let t=Array(45).fill(null).map(()=>Array(100).fill(" ")),a="  ░▒▓█";return e.forEach(e=>{let r=u(e),s=Math.floor(r.x*h.displayScale),l=Math.floor(r.y*h.displayScale);if(s>=0&&s<100&&l>=0&&l<45){let r=Math.floor((e.z+30)/60*(a.length-1));t[l][s]=a[Math.max(0,Math.min(a.length-1,r))]}}),t.map(e=>e.join("")).join("\n")},[h.displayScale,u]);(0,s.useEffect)(()=>{let e=()=>{t(e=>{let t=[...e],a=t[t.length-1],r=h.sigma*(a.y-a.x)*.01*h.speed,s=(a.x*(h.rho-a.z)-a.y)*.01*h.speed,l=(a.x*a.y-h.beta*a.z)*.01*h.speed;return t.push({x:a.x+r,y:a.y+s,z:a.z+l}),t.length>1e3&&t.shift(),t}),p.current=requestAnimationFrame(e)};return e(),()=>{null!==p.current&&cancelAnimationFrame(p.current)}},[h]),(0,s.useEffect)(()=>{l(b(e))},[e,h]);let f=(e,t)=>{m(a=>({...a,[e]:t}))};return(0,r.jsxs)("div",{className:"flex border border-white bg-black h-full",children:[(0,r.jsx)("div",{ref:d,onMouseDown:e=>{n(!0),c({x:e.clientX,y:e.clientY})},onMouseMove:e=>{if(!o)return;let t=e.clientX-i.x,a=e.clientY-i.y;m(e=>({...e,rotateY:e.rotateY+.5*t,rotateX:e.rotateX+.5*a})),c({x:e.clientX,y:e.clientY})},onMouseUp:()=>{n(!1)},onMouseLeave:()=>{n(!1)},onWheel:e=>{e.preventDefault();let t=e.deltaY>0?-.05:.05;m(e=>({...e,displayScale:Math.max(.5,Math.min(2.5,e.displayScale+t))}))},className:"flex-1 cursor-move border-r border-white",children:(0,r.jsx)("pre",{className:"font-mono text-[0.6rem] leading-none whitespace-pre p-2 h-full select-none",children:a})}),(0,r.jsxs)("div",{className:"w-44 flex flex-col p-2 text-[0.6rem] shrink-0",children:[(0,r.jsxs)("div",{className:"border border-white p-2 mb-1 text-center",children:[(0,r.jsx)("p",{children:"Click and drag to rotate"}),(0,r.jsx)("p",{children:"Use mouse wheel to zoom"})]}),[{key:"rotateX",jpLabel:"X軸",enLabel:"X Axis",min:-180,max:180,step:1},{key:"rotateY",jpLabel:"Y軸",enLabel:"Y Axis",min:-180,max:180,step:1},{key:"rotateZ",jpLabel:"Z軸",enLabel:"Z Axis",min:-180,max:180,step:1},{key:"sigma",jpLabel:"σ",enLabel:"Sigma",min:1,max:20,step:.1},{key:"rho",jpLabel:"ρ",enLabel:"Rho",min:0,max:50,step:.1},{key:"beta",jpLabel:"β",enLabel:"Beta",min:0,max:10,step:.1},{key:"speed",jpLabel:"速度",enLabel:"Speed",min:.1,max:3,step:.1}].map(e=>{let{key:t,enLabel:a,min:s,max:l,step:o}=e;return(0,r.jsxs)("div",{className:"border border-white p-2 mt-1",children:[(0,r.jsxs)("div",{className:"flex justify-between mb-1",children:[(0,r.jsx)("span",{children:a}),(0,r.jsx)("span",{children:h[t].toFixed(1)})]}),(0,r.jsx)("input",{type:"range",min:s,max:l,step:o,value:h[t],onChange:e=>f(t,parseFloat(e.target.value)),className:"w-full accent-current"})]},t)})]})]})},w=()=>{let[e,t]=(0,s.useState)("main"),[a,l]=(0,s.useState)(!1),o=[{id:"main",icon:(0,r.jsx)(d,{className:"w-5 h-5"}),label:"メイン"},{id:"blog",icon:(0,r.jsx)(h,{className:"w-5 h-5"}),label:"ブログ"},{id:"contact",icon:(0,r.jsx)(m,{className:"w-5 h-5"}),label:"コンタクト"}],n=()=>{l(!0),setTimeout(()=>l(!1),100)};return(0,r.jsxs)("div",{className:"min-h-screen bg-black text-white font-mono p-4 max-w-4xl mx-auto",children:[(0,r.jsx)("header",{className:"border border-white p-6 mb-8 relative group",children:(0,r.jsxs)("div",{className:"transition-all duration-300 ".concat(a?"transform translate-x-1":""),children:[(0,r.jsxs)("h1",{className:"text-3xl md:text-4xl mb-2 font-bold relative",children:[(0,r.jsx)("span",{className:"opacity-80 absolute -left-1 -top-1 text-red-500",children:"スノーエクリプス"}),(0,r.jsx)("span",{className:"opacity-80 absolute -left-1 top-1 text-blue-500",children:"スノーエクリプス"}),"スノーエクリプス / SNOWCLIPSED"]}),(0,r.jsx)("p",{className:"text-lg md:text-xl opacity-80",children:"ニューラル・アーキテクト / NEURAL ARCHITECT"})]})}),(0,r.jsx)("nav",{className:"grid grid-cols-3 gap-4 mb-8",children:o.map(a=>{let{id:s,icon:l,label:o}=a;return(0,r.jsxs)("button",{onClick:()=>{t(s),n()},className:"border border-white p-4 flex items-center justify-center gap-2 relative group\n              ".concat(e===s?"bg-white text-black":"","\n              hover:bg-white hover:text-black transition-all duration-300"),children:[(0,r.jsxs)("div",{className:"relative",children:[(0,r.jsx)("div",{className:"opacity-80 absolute -left-0.5 -top-0.5 text-red-500 pointer-events-none  group-hover:translate-x-1 transition-transform duration-300",children:l}),(0,r.jsx)("div",{className:"opacity-80 absolute -left-0.5 top-0.5 text-blue-500 pointer-events-none  group-hover:-translate-x-1 transition-transform duration-300",children:l}),l]}),(0,r.jsx)("span",{className:"hidden md:inline",children:o})]},s)})}),(0,r.jsx)("div",{className:"border border-white",children:(0,r.jsxs)("div",{className:"p-6",children:["main"===e&&(0,r.jsxs)("div",{className:"space-y-8",children:[(0,r.jsxs)("div",{className:"mb-12",children:[(0,r.jsx)("h2",{className:"text-2xl mb-4 font-bold",children:"私について / CHAOS ENGINE"}),(0,r.jsx)("div",{className:"w-full",onWheel:e=>e.stopPropagation(),children:(0,r.jsx)(N,{})})]}),(0,r.jsx)("div",{className:"mt-8 border-t border-dotted border-white/20 pt-8 w-full"}),(0,r.jsxs)("div",{className:"mb-12 mt-8",children:[(0,r.jsx)("h2",{className:"text-2xl mb-6 font-bold",children:"研究分野 / ABOUT ME"}),(0,r.jsxs)("div",{className:"space-y-4 opacity-90",children:[(0,r.jsx)("p",{children:"Hi, I am snow/snowclipsed."}),(0,r.jsx)("p",{children:"Welcome to my digital realm. I am a machine learning engineer specializing in deep learning architecture research and inference optimization."})]}),(0,r.jsx)("div",{className:"mt-8 border-t border-dotted border-white/20 pt-8 w-full"})]}),(0,r.jsxs)("div",{className:"mb-12",children:[(0,r.jsx)("h2",{className:"text-2xl mb-6 font-bold",children:"研究分野 / RESEARCH DOMAINS"}),(0,r.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-8",children:[(0,r.jsxs)("div",{children:[(0,r.jsxs)("h3",{className:"text-xl mb-4 flex items-center gap-2",children:[(0,r.jsx)(p,{className:"w-5 h-5"})," コア・リサーチ / CORE RESEARCH"]}),(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsxs)("div",{className:"border border-white/20 p-2 hover:border-white/40 transition-colors duration-300",children:[(0,r.jsx)("span",{className:"text-blue-400 mr-2",children:"◇"}),"Deep Learning Architecture Research"]}),(0,r.jsxs)("div",{className:"border border-white/20 p-2 hover:border-white/40 transition-colors duration-300",children:[(0,r.jsx)("span",{className:"text-blue-400 mr-2",children:"◇"}),"Inference Optimization"]}),(0,r.jsxs)("div",{className:"border border-white/20 p-2 hover:border-white/40 transition-colors duration-300",children:[(0,r.jsx)("span",{className:"text-blue-400 mr-2",children:"◇"}),"Low Level Programming"]})]})]}),(0,r.jsxs)("div",{children:[(0,r.jsxs)("h3",{className:"text-xl mb-4 flex items-center gap-2",children:[(0,r.jsx)(x,{className:"w-5 h-5"})," 現在の目標 / CURRENT GOALS"]}),(0,r.jsxs)("div",{className:"space-y-2",children:[(0,r.jsxs)("div",{className:"border border-white/20 p-2 hover:border-white/40 transition-colors duration-300",children:[(0,r.jsx)("span",{className:"text-green-400 mr-2",children:"⊕"}),"Scaling ML Models"]}),(0,r.jsxs)("div",{className:"border border-white/20 p-2 hover:border-white/40 transition-colors duration-300",children:[(0,r.jsx)("span",{className:"text-green-400 mr-2",children:"⊕"}),"Low-End Device Optimization"]}),(0,r.jsxs)("div",{className:"border border-white/20 p-2 hover:border-white/40 transition-colors duration-300",children:[(0,r.jsx)("span",{className:"text-green-400 mr-2",children:"⊕"}),"CPU/GPU Architecture Research"]})]})]})]})]}),(0,r.jsx)("div",{className:"mt-8 border-t border-dotted border-white/20 pt-8 w-full"}),(0,r.jsxs)("div",{className:"mb-8",children:[(0,r.jsx)("h2",{className:"text-2xl mb-4 font-bold",children:"オフライン・モード / OFFLINE MODE"}),(0,r.jsx)("p",{className:"opacity-90 font-mono",children:"Beyond the terminal, I create games, write blog posts, make digital art, and explore virtual worlds. You can find my thoughts on my blog or follow my journey on social media."})]})]}),"blog"===e&&(0,r.jsx)(f,{}),"contact"===e&&(0,r.jsx)(j,{})]})}),(0,r.jsx)("footer",{className:"p-4 mt-8 opacity-70 hover:opacity-100 transition-opacity duration-300",children:(0,r.jsx)("p",{className:"text-center",children:"\xa9 2024 スノーエクリプス"})})]})};function M(){return(0,r.jsx)(w,{})}}},e=>{var t=t=>e(e.s=t);e.O(0,[441,517,358],()=>t(1184)),_N_E=e.O()}]);