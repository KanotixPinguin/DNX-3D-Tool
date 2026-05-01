window.__dnxPauseRender=false;
window.__dnxWindowResizing=false;
window.__dnxWindowDragging=false;

(function(){
  if(window.__dnx_clean_v2) return; window.__dnx_clean_v2=1;

  const DEF={maxFps:5,scale:"Logarithmic",mode3d:"Lines",palette:"Default",refDb:20,rangeDb:40,overlap:0,avgType:"NO",avgSamples:1,fftWindow:"Han",fftSize:"1K"};
  const st={...DEF,yaw:.92,pitch:.90,zoom:.44,height:1.0,cam:6.8,offY:-320,drag:false,rdrag:false,mx:0,my:0,last:0,prevFront:null,avgMem:{},lastFrame:null,lastW:0,lastH:0};

  function styleBtn(b){
    const src=[...document.querySelectorAll("button,div.openwebrx-button")].find(e=>((e.textContent||"").trim().startsWith("noVNC / Foto")));
    if(!src || !src.width || !src.height){ b.className="openwebrx-button"; return; }
    const cs=getComputedStyle(src); b.className=src.className||"openwebrx-button"; b.style.cssText=src.style.cssText||"";
    ["background","color","border","borderRadius","height","lineHeight","padding","font"].forEach(k=>b.style.setProperty(k.replace(/[A-Z]/g,m=>"-"+m.toLowerCase()),cs[k],"important"));
  }
  const mkSel=(opts,val,onch)=>{const s=document.createElement("select");s.className="openwebrx-input";s.style.height="24px";opts.forEach(o=>{const x=document.createElement("option");x.value=o;x.textContent=o;if(o===val)x.selected=true;s.appendChild(x)});s.onchange=()=>onch(s.value);return s;};
  const mkNum=(lbl,min,max,step,key)=>{const w=document.createElement("span");w.style.cssText="display:inline-flex;align-items:center;gap:4px";const t=document.createElement("span");t.textContent=lbl;const d=document.createElement("button");d.className="openwebrx-button";d.textContent="-";d.style.height="22px";const u=document.createElement("button");u.className="openwebrx-button";u.textContent="+";u.style.height="22px";const v=document.createElement("span");v.style.minWidth="54px";const sh=()=>v.textContent=st[key];d.onclick=()=>{st[key]=Math.max(min,st[key]-step);sh()};u.onclick=()=>{st[key]=Math.min(max,st[key]+step);sh()};sh();w.append(t,d,u,v);return w;};

  function pal(n,p){
    n=Math.max(0,Math.min(1,n));
    const P={
      Default:[[0,10,70,160],[.35,0,150,245],[.65,30,220,255],[.85,220,240,110],[1,255,245,70]],
      Turbo:[[0,20,12,70],[.3,80,40,200],[.6,20,180,250],[.82,230,220,70],[1,255,80,30]],
      Legazy:[[0,8,20,80],[.35,40,70,170],[.65,100,130,220],[.85,230,210,90],[1,255,120,40]],
      Teejeez:[[0,10,12,12],[.35,0,150,120],[.65,120,230,90],[.85,240,230,80],[1,255,130,60]],
      Ozean:[[0,0,25,50],[.35,0,80,170],[.65,0,170,230],[.85,90,220,255],[1,235,255,255]],
      Eclipse:[[0,15,4,18],[.35,60,20,120],[.65,120,45,170],[.85,210,140,60],[1,255,240,120]]
    }[p]||[[0,10,70,160],[1,255,245,70]];
    for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];if(n>=a[0]&&n<=b[0]){const t=(n-a[0])/((b[0]-a[0])||1);return[(a[1]+(b[1]-a[1])*t)|0,(a[2]+(b[2]-a[2])*t)|0,(a[3]+(b[3]-a[3])*t)|0];}}
    const z=P[P.length-1]; return [z[1]|0,z[2]|0,z[3]|0];
  }

  function openWin(){
    let w=document.getElementById("dnx-3d-win"); if(w){w.style.display="block";return;}
    w=document.createElement("div");
    w.id="dnx-3d-win";
    w.style.cssText="position:fixed;left:120px;top:110px;width:1320px;height:820px;z-index:1000900;background:#000;border:2px solid rgba(70,120,255,0.35);border-radius:8px;overflow:hidden;resize:both;min-width:760px;min-height:520px;max-width:98vw;max-height:92vh;";
    w.innerHTML='<div id="dnxbar" style="height:38px;background:#081522;color:#dff;border-bottom:1px solid #1f6aa5;display:flex;align-items:center;gap:8px;padding:0 10px;cursor:move"><b>DNX 3D Tool</b><button id="dnxclose" style="margin-left:auto;border:1px solid #fff;background:#1f2cc9;color:#fff;border-radius:999px;height:26px;padding:0 10px;cursor:pointer">✕</button></div><div id="dnxctrl" style="position:absolute;left:8px;right:8px;top:42px;z-index:1001200;background:rgba(8,21,34,.92);border:1px solid #1f6aa5;border-radius:8px;padding:6px;display:flex;flex-wrap:wrap;gap:8px;align-items:center;color:#dff;font:12px Segoe UI"></div><div id="dnxbody" style="position:absolute;left:0;right:0;top:94px;bottom:40px"><canvas id="dnxcv" style="width:100%;height:100%;display:block"></canvas></div><div id="dnxpresetbar" style="position:absolute;left:8px;right:8px;bottom:6px;height:34px;display:flex;justify-content:space-between;align-items:center"><div style="display:flex;gap:6px"><span style="display:inline-flex;align-items:center;gap:4px;"><button id="dnxPresetSmooth" class="openwebrx-button">Smooth</button><button id="dnxPresetSmoothDn" class="openwebrx-button">-</button><button id="dnxPresetSmoothUp" class="openwebrx-button">+</button></span><span style="display:inline-flex;align-items:center;gap:4px;"><button id="dnxPresetSharp" class="openwebrx-button">Sharp</button><button id="dnxPresetSharpDn" class="openwebrx-button">-</button><button id="dnxPresetSharpUp" class="openwebrx-button">+</button></span><span style="display:inline-flex;align-items:center;gap:4px;"><button id="dnxPresetBright" class="openwebrx-button">Bright</button><button id="dnxPresetBrightDn" class="openwebrx-button">-</button><button id="dnxPresetBrightUp" class="openwebrx-button">+</button></span></div><div style="display:flex;gap:6px"><button id="dnxCamIn" class="openwebrx-button">Cam+</button><button id="dnxCamOut" class="openwebrx-button">Cam-</button><button id="dnxYawL" class="openwebrx-button">Yaw-</button><button id="dnxYawR" class="openwebrx-button">Yaw+</button><button id="dnxPitU" class="openwebrx-button">Pitch+</button><button id="dnxPitD" class="openwebrx-button">Pitch-</button><button id="dnxFlatDown" class="openwebrx-button">Flat-</button><button id="dnxFlatUp" class="openwebrx-button">Flat+</button><button id="dnxCamReset" class="openwebrx-button">Reset Cam</button><button id="dnxAllReset" class="openwebrx-button">Reset All</button></div></div>';
    document.body.appendChild(w);
    dnxAddResize8(w);
    document.getElementById("dnxclose").onclick=()=>w.style.display="none";
    /* DNX_DRAG_FIX_V1 */
    (function(){
      const bar=document.getElementById("dnxbar");
      let d=0,sx=0,sy=0,sl=0,st=0;
      if(!bar) return;
      bar.onmousedown=(e)=>{ d=1; sx=e.clientX; sy=e.clientY; sl=w.offsetLeft; st=w.offsetTop; e.preventDefault(); };
      window.addEventListener("mousemove",(e)=>{ if(!d) return; w.style.left=(sl+e.clientX-sx)+"px"; w.style.top=(st+e.clientY-sy)+"px"; });
      window.addEventListener("mouseup",()=>d=0);
    })();

    const c=document.getElementById("dnxctrl"),L=t=>{const x=document.createElement("span");x.textContent=t;x.style.fontWeight="700";c.appendChild(x);};
    L("FFT Window"); c.appendChild(mkSel(["Bart","B-H","FT","Han","Ham","Rect","Cal","Black","BH-7"],st.fftWindow,v=>st.fftWindow=v));
    L("FFT Size"); c.appendChild(mkSel(["64","128","256","512","1K","2K","4K","8K","16K","32K"],st.fftSize,v=>st.fftSize=v));
    c.appendChild(mkNum("Overlap",0,1023,1,"overlap"));
    L("AVG"); c.appendChild(mkSel(["NO","MOV","FIX","MAX"],st.avgType,v=>st.avgType=v));
    c.appendChild(mkNum("Samples",1,4096,1,"avgSamples"));
    c.appendChild(mkNum("Ref dB",0,40,0.25,"refDb"));
    c.appendChild(mkNum("Range dB",1,100,0.25,"rangeDb"));
    L("Max FPS"); c.appendChild(mkSel(["2","5","10","20","50","100","200"],String(st.maxFps),v=>st.maxFps=+v));
    L("Scale"); c.appendChild(mkSel(["Logarithmic","Linear"],st.scale,v=>st.scale=v));
    L("Palette"); c.appendChild(mkSel(["Default","Turbo","Legazy","Teejeez","Ozean","Eclipse"],st.palette,v=>st.palette=v));
    L("3D"); c.appendChild(mkSel(["Points","Lines","Solid","Outline","Shaded"],st.mode3d,v=>st.mode3d=v));
    const auto=document.createElement("button"); auto.className="openwebrx-button"; auto.textContent="AutoScale (Reset Standard)"; auto.onclick=()=>Object.assign(st,DEF); c.appendChild(auto);

    document.getElementById("dnxPresetSmooth").onclick=()=>{st.mode3d="Shaded";st.scale="Logarithmic";st.maxFps=7;st.rangeDb=55;st.refDb=18;st.overlap=280;};
    document.getElementById("dnxPresetSharp").onclick =()=>{st.mode3d="Lines"; st.scale="Linear";st.maxFps=20;st.rangeDb=22;st.refDb=26;st.overlap=40;};
    document.getElementById("dnxPresetBright").onclick=()=>{st.mode3d="Solid"; st.scale="Logarithmic";st.maxFps=10;st.rangeDb=35;st.refDb=30;st.overlap=120;};

    document.getElementById("dnxCamIn").onclick=()=>{st.cam=Math.max(0.95,st.cam-0.35);};
    document.getElementById("dnxCamOut").onclick=()=>{st.cam=Math.min(32,st.cam+0.35);};
    document.getElementById("dnxYawL").onclick=()=>{st.yaw-=0.08;};
    document.getElementById("dnxYawR").onclick=()=>{st.yaw+=0.08;};
    document.getElementById("dnxPitU").onclick=()=>{st.pitch+=0.06;};
    document.getElementById("dnxPitD").onclick=()=>{st.pitch-=0.06;};
    document.getElementById("dnxFlatDown").onclick=()=>{st.height=0.0; st.offY=0;};
    document.getElementById("dnxFlatUp").onclick=()=>{st.height=Math.min(2.5,st.height+0.1);};
    document.getElementById("dnxCamReset").onclick=()=>{st.yaw=0.88;st.pitch=1.18;st.cam=6.8;st.zoom=0.44;st.height=1.0;st.offY=-320;};
    document.getElementById("dnxAllReset").onclick=()=>{Object.assign(st,DEF,{yaw:.92,pitch:.90,zoom:.44,height:1.0,cam:6.8,offY:-90});};

/* DNX_PM_HANDLER_REAL_V1 */
const tune=(dv,dp)=>{ for(let y=0;y<NY;y++) for(let x=0;x<NX;x++){ let q=arr[y][x]; q=Math.max(0.08,Math.min(0.60,q+dv)); if(dp!==1) q=Math.max(0.08,Math.min(0.60,Math.pow(q,dp))); arr[y][x]=q; } };
document.getElementById("dnxPresetSmoothDn")?.addEventListener("click",()=>tune(-0.006,1.020));
document.getElementById("dnxPresetSmoothUp")?.addEventListener("click",()=>tune(+0.006,0.980));
document.getElementById("dnxPresetSharpDn")?.addEventListener("click",()=>tune(-0.004,1.030));
document.getElementById("dnxPresetSharpUp")?.addEventListener("click",()=>tune(+0.004,0.970));
document.getElementById("dnxPresetBrightDn")?.addEventListener("click",()=>tune(-0.008,1.000));
document.getElementById("dnxPresetBrightUp")?.addEventListener("click",()=>tune(+0.008,1.000));

    let md=0,sx=0,sy=0,sl=0,stt=0; const bar=document.getElementById("dnxbar");
    bar.onmousedown=e=>{md=1;window.__dnxWindowDragging=true;window.__dnxPauseRender=true;sx=e.clientX;sy=e.clientY;sl=w.offsetLeft;stt=w.offsetTop;e.preventDefault();};
    window.addEventListener("mousemove",e=>{if(!md)return;w.style.left=(sl+e.clientX-sx)+"px";w.style.top=(stt+e.clientY-sy)+"px";});
    window.addEventListener("mouseup",()=>{md=0;window.__dnxWindowDragging=false;setTimeout(()=>{window.__dnxPauseRender=false;},60);});

    const cv=document.getElementById("dnxcv"),ctx=cv.getContext("2d");
    const NX=420,NY=260,arr=Array.from({length:NY},()=>Array(NX).fill(0));
    const fit=()=>{cv.width=cv.parentElement.clientWidth;cv.height=cv.parentElement.clientHeight}; fit(); new ResizeObserver(fit).observe(cv.parentElement);

    function sampleRow(){
      let src=document.querySelector(".openwebrx-waterfall-container canvas") || document.querySelector("#openwebrx-waterfall canvas") || null;
      if(!src || !src.width || !src.height){const cs=[...document.querySelectorAll(".openwebrx-waterfall-container canvas,#openwebrx-waterfall canvas")].filter(c=>c!==cv && c.width>300 && c.height>80 && !(c.id||"").includes("bandplan"));cs.sort((a,b)=>(b.width*b.height)-(a.width*a.height));src=cs[0]||null;}
      if(!src || !src.width || !src.height){ console.log('DNX_SRC_DEBUG: no src'); return; } console.log('DNX_SRC_DEBUG:', src ? (src.id||'(no-id)') : 'null', src ? (src.className||'(no-class)') : '', src ? src.width : -1, src ? src.height : -1);
      if(!src || !src.width || !src.height) return; const t=document.createElement("canvas"); t.width=src.width; t.height=src.height; const g=t.getContext("2d"); if(!g || !t.width || !t.height) return; try{ g.drawImage(src,0,0); }catch(e){ return; }
      if(!t.width || !t.height) return; st.__scanY=((st.__scanY||1)+2); if(st.__scanY>=Math.max(14,((t.height*0.30)|0))) st.__scanY=1; const y=st.__scanY; let row; try{ row=g.getImageData(0,y,t.width,1).data; }catch(e){ return; }
      for(let yy=0;yy<NY-1;yy++) arr[yy]=arr[yy+1];
      let front=Array(NX); for(let x=0;x<NX;x++){const px=((x/(NX-1))*(t.width-1))|0,i=px*4;front[x]=Math.max(0.025,(row[i]*.30+row[i+1]*.59+row[i+2]*.11)/255);} for(let i=1;i<NX-1;i++){front[i]=front[i-1]*0.18+front[i]*0.64+front[i+1]*0.18;}
      const mix=Math.max(0,Math.min(1,st.overlap/1023)); if(st.prevFront){for(let i=0;i<front.length;i++) front[i]=front[i]*(1-mix)+st.prevFront[i]*mix;} st.prevFront=front.slice();
      arr[NY-1]=front;
    }

    function P(x,y,z){
      let X=(x-NX/2)/(NX/2), Y=1.08-z*(st.zoom*.42)*st.height, Z=(y-NY/2)/(NY/2);
      const sy=Math.sin(st.yaw),cy=Math.cos(st.yaw); let tx=X*cy-Z*sy,tz=X*sy+Z*cy; X=tx; Z=tz;
      const sp=Math.sin(st.pitch),cp=Math.cos(st.pitch); let ty=Y*cp-Z*sp; tz=Y*sp+Z*cp; Y=ty; Z=tz;
      const denom=Math.max(0.85,Z+st.cam), f=4.10/denom;
      return [cv.width*.5+X*f*cv.width*.52,cv.height*.6+Y*f*cv.height*.85+st.offY];
    }

    cv.addEventListener("contextmenu",e=>e.preventDefault());
    cv.addEventListener("mousedown",e=>{if(window.__dnxWindowDragging||window.__dnxWindowResizing)return;st.mx=e.clientX;st.my=e.clientY;if(e.button===0)st.drag=true;if(e.button===2)st.rdrag=true;});
    window.addEventListener("mouseup",()=>{st.drag=false;st.rdrag=false;});
    window.addEventListener("mousemove",e=>{if(window.__dnxWindowDragging||window.__dnxWindowResizing)return;const dx=e.clientX-st.mx,dy=e.clientY-st.my;st.mx=e.clientX;st.my=e.clientY;const L=(e.buttons&1)===1,R=(e.buttons&2)===2;if(L||st.drag){st.yaw+=dx*.008;st.pitch+=dy*.006;} if(R||st.rdrag){st.offY=Math.max(-1200,Math.min(1200,st.offY+dy*2.4));}});
    cv.addEventListener("wheel",e=>{e.preventDefault();const R=((e.buttons&2)===2)||st.rdrag;if(R){const d=(e.deltaY>0?0.45:-0.45);st.cam=Math.max(0.95,Math.min(32,st.cam+d));}else{st.zoom=Math.max(.3,Math.min(3.2,st.zoom+(e.deltaY>0?-.07:.07)));}},{passive:false});

    function draw(ts){
      if(window.__dnxPauseRender){ requestAnimationFrame(draw); return; }
        if(ts-st.last < (1000/st.maxFps)){ requestAnimationFrame(draw); return; } st.last=ts;
      sampleRow(); ctx.fillStyle="#000"; ctx.fillRect(0,0,cv.width,cv.height);

      for(let y=1;y<NY;y++) for(let x=1;x<NX;x++){
        let v=Math.min(arr[y][x],.50)*st.height;
        v=(st.scale==="Linear")?v:Math.log10(1+9*Math.max(0,v));
        const gain=Math.max(.15,Math.min(3.5,(st.refDb+40-st.rangeDb)/40)); v*=gain;

        const k=y*10000+x,pv=st.avgMem[k]??v;
        if(st.avgType==="MOV") st.avgMem[k]=pv+(v-pv)/Math.max(1,Math.min(128,st.avgSamples*2));
        else if(st.avgType==="FIX") st.avgMem[k]=(pv*(Math.max(1,st.avgSamples)-1)+v)/Math.max(1,st.avgSamples);
        else if(st.avgType==="MAX") st.avgMem[k]=Math.max(pv*.992,v);
        else st.avgMem[k]=v;
        v=st.avgMem[k];

        const vv=Math.max(0,Math.min(1,v));
          const spread=Math.max(0.40,Math.min(1.9,(140-st.rangeDb)/55));
          const bias=Math.max(-0.25,Math.min(0.35,(st.refDb-20)/80));
          const n=Math.max(0,Math.min(1, Math.pow(vv,0.78)*spread + bias));
        const c=pal(n,st.palette);
          const sat=(n>0.60?1.40:(n>0.35?1.22:1.08));
          const rr=Math.min(255,(c[0]*sat)|0), gg=Math.min(255,(c[1]*sat)|0), bb=Math.min(255,(c[2]*sat)|0);
        const line=`rgba(${rr},${gg},${bb},0.98)`, soft=`rgba(${rr},${gg},${bb},0.65)`, fill=`rgba(${rr},${gg},${bb},0.34)`, fillS=`rgba(${rr},${gg},${bb},0.24)`;

        const p=P(x,y,v),l=P(x-1,y,Math.min(arr[y][x-1],.34)*st.height),u=P(x,y-1,Math.min(arr[y-1][x],.34)*st.height);
        if(st.mode3d==="Points"){ ctx.fillStyle=line; ctx.fillRect(p[0],p[1],1.6,1.6); }
        else{
          ctx.strokeStyle=(st.mode3d==="Shaded")?soft:line;
          ctx.lineWidth=(st.mode3d==="Outline")?1.0:.58;
          ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.lineTo(l[0],l[1]); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.lineTo(u[0],u[1]); ctx.stroke();
          if(st.mode3d==="Solid"||st.mode3d==="Shaded"){ ctx.fillStyle=(st.mode3d==="Shaded")?fillS:fill; ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.lineTo(l[0],l[1]); ctx.lineTo(u[0],u[1]); ctx.closePath(); ctx.fill(); }
        }

        if(n>0.72){
          const hh=0.09+(n-0.82)*1.1, tp=P(x,y,Math.min(1,v+hh));
          ctx.strokeStyle=(n>0.90)?"rgba(255,40,20,.99)":(n>0.82?"rgba(255,150,20,.98)":"rgba(255,230,40,.96)");
          ctx.lineWidth=(n>0.90)?0.34:0.24;
          ctx.beginPath(); ctx.moveTo(p[0],p[1]); ctx.lineTo(tp[0],tp[1]); ctx.stroke();
        }
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  
  // DNX_RESIZE8_START
  function dnxAddResize8(w){
    if(!w || w.querySelector(".dnx-rz")) return;
    const mk=(cls,cursor,style)=>{
      const d=document.createElement("div");
      d.className="dnx-rz "+cls;
      d.style.cssText="position:absolute;z-index:1001005;"+style+";cursor:"+cursor+";"; if(/^(nw|ne|sw|se)$/.test(cls)){ d.style.border="1px solid #22ff66"; d.style.background="rgba(34,255,102,0.14)"; d.style.boxShadow="0 0 4px rgba(34,255,102,.45)"; d.style.borderRadius="2px"; }
      w.appendChild(d);
      return d;
    };
    const hs=7, es=11;
    const handles=[
      mk("n","ns-resize",`left:${es}px;right:${es}px;top:0;height:${hs}px`),
      mk("s","ns-resize",`left:${es}px;right:${es}px;bottom:0;height:${hs}px`),
      mk("w","ew-resize",`left:0;top:${es}px;bottom:${es}px;width:${hs}px`),
      mk("e","ew-resize",`right:0;top:${es}px;bottom:${es}px;width:${hs}px`),
      mk("nw","nwse-resize",`left:0;top:0;width:${es}px;height:${es}px`),
      mk("ne","nesw-resize",`right:0;top:0;width:${es}px;height:${es}px`),
      mk("sw","nesw-resize",`left:0;bottom:0;width:${es}px;height:${es}px`),
      mk("se","nwse-resize",`right:0;bottom:0;width:${es}px;height:${es}px`)
    ];

    handles.forEach(h=>{
      h.addEventListener("mousedown",ev=>{
        ev.preventDefault(); ev.stopPropagation(); window.__dnxWindowResizing=true; window.__dnxPauseRender=true;
        const r=w.getBoundingClientRect();
        const sx=ev.clientX, sy=ev.clientY;
        const sl=r.left, st=r.top, sw=r.width, sh=r.height;
        const minW=760, minH=520;
        const cls=[...h.classList].find(x=>["n","s","e","w","nw","ne","sw","se"].includes(x));
        function mm(e){
          const dx=e.clientX-sx, dy=e.clientY-sy;
          let L=sl,T=st,W=sw,H=sh;
          if(cls.includes("e")) W=Math.max(minW,sw+dx);
          if(cls.includes("s")) H=Math.max(minH,sh+dy);
          if(cls.includes("w")){ W=Math.max(minW,sw-dx); L=sl+(sw-W); }
          if(cls.includes("n")){ H=Math.max(minH,sh-dy); T=st+(sh-H); }
          w.style.left=L+"px"; w.style.top=T+"px"; w.style.width=W+"px"; w.style.height=H+"px";
        }
        function mu(){ window.__dnxWindowResizing=false; setTimeout(()=>{window.__dnxPauseRender=false;},60); window.removeEventListener("mousemove",mm,true); window.removeEventListener("mouseup",mu,true); }
        window.addEventListener("mousemove",mm,true);
        window.addEventListener("mouseup",mu,true);
      }, true);
    });
  }
  // DNX_RESIZE8_END

function addBtn(){
    let b=document.getElementById("dnx-3dtool-btn");
    if(!b){ b=document.createElement("button"); b.id="dnx-3dtool-btn"; b.textContent="3D Tool"; document.body.appendChild(b); }
    styleBtn(b);
    b.style.setProperty("position","fixed","important"); b.style.setProperty("left","20px","important"); b.style.setProperty("top","80px","important"); b.style.setProperty("z-index","1000601","important");
    b.onclick=openWin;
  }

  window.__dnx_open3d=openWin; window.addEventListener("dnx-open-3d-tool",()=>{try{openWin();}catch(e){}}); if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",addBtn,{once:true}); else addBtn();
})();

/* DNX_HARD_PM_IN_PLUGIN_V1 */
(function(){
  function forcePM(){
    const zone = document.getElementById("dnxpresetbar") || document.querySelector('[id*="preset"]');
    if (!zone) return;

    const btns=[...zone.querySelectorAll("button,.openwebrx-button,div.openwebrx-button")];
    const smooth=btns.find(b=>/smooth/i.test((b.textContent||"").trim()));
    const sharp =btns.find(b=>/sharp/i.test((b.textContent||"").trim()));
    const bright=btns.find(b=>/bright/i.test((b.textContent||"").trim()));
    if(!smooth || !sharp || !bright) return;

    // immer sauber neu setzen
    document.getElementById("dnxPmHardWrap")?.remove();

    const wrap=document.createElement("span");
    wrap.id="dnxPmHardWrap";
    wrap.style.cssText="display:inline-flex;align-items:center;gap:6px;margin-left:8px;";
    const mk=(id,t)=>{const b=document.createElement("button");b.id=id;b.className="openwebrx-button";b.textContent=t;return b;};

    const sdn=mk("dnxPresetSmoothDn","-"), sup=mk("dnxPresetSmoothUp","+");
    const shd=mk("dnxPresetSharpDn","-"),  shu=mk("dnxPresetSharpUp","+");
    const bdn=mk("dnxPresetBrightDn","-"), bup=mk("dnxPresetBrightUp","+");

    bright.parentElement.appendChild(wrap);
    wrap.append(sdn,sup,shd,shu,bdn,bup);

    const tune=(dv,dp)=>{
      if(!window.arr || !window.NX || !window.NY) return;
      for(let y=0;y<NY;y++) for(let x=0;x<NX;x++){
        let q=arr[y][x];
        q=Math.max(0.08,Math.min(0.60,q+dv));
        if(dp!==1) q=Math.max(0.08,Math.min(0.60,Math.pow(q,dp)));
        arr[y][x]=q;
      }
    };

    sdn.onclick=()=>tune(-0.006,1.020);
    sup.onclick=()=>tune(+0.006,0.980);
    shd.onclick=()=>tune(-0.004,1.030);
    shu.onclick=()=>tune(+0.004,0.970);
    bdn.onclick=()=>tune(-0.008,1.000);
    bup.onclick=()=>tune(+0.008,1.000);
  }

  forcePM();
  setTimeout(forcePM,700);
  setTimeout(forcePM,1500);
})();


/* DNX_BLUEWHITE_ALL_BTNS */
(function(){
  function applyBlueWhite(root){
    const all=[...root.querySelectorAll("button,.openwebrx-button,div.openwebrx-button")];
    all.forEach(b=>{
      b.style.setProperty("background","#1f2cc9","important");
      b.style.setProperty("color","#ffffff","important");
      b.style.setProperty("border","1px solid #ffffff","important");
      b.style.setProperty("border-radius","999px","important");
      b.style.setProperty("font-weight","700","important");
      b.style.setProperty("box-shadow","none","important");
    });
  }

  function run(){
    const w=document.getElementById("dnx-3d-win");
    if(w) applyBlueWhite(w);

    const b=document.getElementById("dnx-3dtool-btn");
    if(b){
      b.style.setProperty("background","#1f2cc9","important");
      b.style.setProperty("color","#ffffff","important");
      b.style.setProperty("border","1px solid #ffffff","important");
      b.style.setProperty("border-radius","999px","important");
      b.style.setProperty("font-weight","700","important");
      b.style.setProperty("box-shadow","none","important");
    }
  }

  run();
  setInterval(run,800);
})();


/* DNX_FRAME_BLUE_TRANS */
(function(){
  function run(){
    const w=document.getElementById("dnx-3d-win");
    if(!w) return;
    w.style.setProperty("border","2px solid rgba(70,120,255,0.35)","important");
    w.style.setProperty("box-shadow","0 0 10px rgba(70,120,255,0.20)","important");
  }
  run();
  setInterval(run,800);
})();


/* DNX_HELP_BUTTON_V1 */
(function(){
  if(window.__dnxHelpInit) return;
  window.__dnxHelpInit = true;

  function ensureHelpBtn(){
    const win = document.getElementById("dnx-3d-win");
    if(!win) return;

    const bar = win.querySelector("#dnxbar");
    if(!bar) return;

    if(!bar.querySelector("#dnxHelpBtn")){
      const b = document.createElement("button");
      b.id = "dnxHelpBtn";
      b.type = "button";
      b.textContent = "Help (?)";
      b.className = "openwebrx-button";
      b.style.cssText = "margin-left:8px;background:#1f2cc9;color:#fff;border:1px solid #fff;border-radius:999px;height:26px;padding:0 10px;font-weight:700;cursor:pointer;";
      b.onclick = openHelp;
      const close = bar.querySelector("#dnxclose");
      if(close) bar.insertBefore(b, close);
      else bar.appendChild(b);
    }
  }

  function openHelp(){
    let m = document.getElementById("dnxHelpModal");
    if(!m){
      m = document.createElement("div");
      m.id = "dnxHelpModal";
      m.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.55);z-index:1002000;display:flex;align-items:center;justify-content:center;";
      m.innerHTML =
        '<div style="width:min(1100px,94vw);height:min(760px,90vh);background:#06111f;border:2px solid rgba(70,120,255,.55);border-radius:12px;overflow:hidden;display:flex;flex-direction:column;">' +
          '<div style="height:38px;display:flex;align-items:center;padding:0 10px;background:#0b1d33;color:#dff;border-bottom:1px solid #2d4f7f;">' +
            '<b style="flex:1">DNX 3D Tool Help</b>' +
            '<button id="dnxHelpClose" class="openwebrx-button" style="background:#1f2cc9;color:#fff;border:1px solid #fff;border-radius:999px;height:26px;padding:0 10px;">Close</button>' +
          '</div>' +
          '<iframe src="/static/plugins/receiver/dnx_3dtool/help_de_en.html" style="flex:1;border:0;width:100%;background:#071220"></iframe>' +
        '</div>';
      document.body.appendChild(m);
      m.querySelector("#dnxHelpClose").onclick = ()=> m.remove();
      m.addEventListener("click", (e)=>{ if(e.target===m) m.remove(); });
    }
  }

  setInterval(ensureHelpBtn, 500);
})();
