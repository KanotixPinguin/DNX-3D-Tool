
(function(){

"use strict";

const ID="dnx-3d-window";

function makeDraggable(el,handle){

 let down=false;

 let ox=0;
 let oy=0;

 handle.addEventListener("mousedown",function(e){

  down=true;

  ox=e.clientX-el.offsetLeft;
  oy=e.clientY-el.offsetTop;

 });

 document.addEventListener("mouseup",function(){

  down=false;

  localStorage.setItem(
   "dnx3d_pos",
   JSON.stringify({
    left:el.style.left,
    top:el.style.top
   })
  );

 });

 document.addEventListener("mousemove",function(e){

  if(!down) return;

  el.style.left=(e.clientX-ox)+"px";
  el.style.top=(e.clientY-oy)+"px";

 });

}

function restore(el){

 try{

  let p=JSON.parse(localStorage.getItem("dnx3d_pos"));

  if(p){

   el.style.left=p.left;
   el.style.top=p.top;

  }

 }catch(e){}

}

function build(){

 if(document.getElementById(ID)) return;

 let win=document.createElement("div");

 win.id=ID;

 win.style.cssText=
  "position:fixed;" +
  "left:40px;" +
  "top:120px;" +
  "width:520px;" +
  "height:320px;" +
  "background:#05070a;" +
  "border:1px solid #00bfff;" +
  "border-radius:12px;" +
  "overflow:hidden;" +
  "z-index:999999;" +
  "box-shadow:0 0 25px rgba(0,180,255,.35);" +
  "backdrop-filter:blur(4px);";

 let header=document.createElement("div");

 header.innerHTML="3D TOOL";

 header.style.cssText=
  "height:38px;" +
  "line-height:38px;" +
  "padding:0 14px;" +
  "font-weight:700;" +
  "font-size:14px;" +
  "background:linear-gradient(90deg,#001018,#002c3d);" +
  "color:white;" +
  "cursor:move;" +
  "user-select:none;";

 let body=document.createElement("div");

 body.style.cssText=
  "position:absolute;" +
  "left:0;" +
  "right:0;" +
  "top:38px;" +
  "bottom:0;" +
  "overflow:hidden;";

 let canvas=document.createElement("canvas");

 canvas.width=900;
 canvas.height=500;

 canvas.style.cssText=
  "width:100%;" +
  "height:100%;" +
  "display:block;" +
  "background:black;";

 body.appendChild(canvas);

 win.appendChild(header);

 win.appendChild(body);

 document.body.appendChild(win);

 restore(win);

 makeDraggable(win,header);

 let ctx=canvas.getContext("2d");

 let t=0;

 setInterval(function(){

  t+=0.03;

  ctx.fillStyle="rgba(0,0,0,.15)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  for(let x=0;x<canvas.width;x+=6){

   let h=
    Math.sin((x*0.02)+t)*70 +
    Math.cos((x*0.009)+(t*2))*40;

   let y=250+h;

   ctx.strokeStyle=
    "hsl(" + ((x+t*100)%360) + ",100%,50%)";

   ctx.beginPath();

   ctx.moveTo(x,500);

   ctx.lineTo(x,y);

   ctx.stroke();

  }

 },30);

}

setTimeout(build,3000);

})();
