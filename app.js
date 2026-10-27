"use strict";
/* ---------- utils ---------- */
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clone=o=>JSON.parse(JSON.stringify(o));
const r2=n=>Math.round((n+Number.EPSILON)*100)/100;
const money=n=>"₹"+(Number(n)||0).toLocaleString("en-IN",{minimumFractionDigits:0,maximumFractionDigits:2});
const uid=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,5);
const pad=(s,n)=>String(s).padEnd(n).slice(0,n);
const lpad=(s,n)=>String(s).padStart(n);
const hhmm=t=>new Date(t).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit",hour12:true});
const dstr=t=>new Date(t).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"});
const sameDay=(a,b)=>new Date(a).toDateString()===new Date(b).toDateString();
const mins=t=>Math.max(0,Math.floor((Date.now()-t)/60000));
const IC={table:'<rect x="3" y="4" width="18" height="6" rx="1"/><path d="M6 10v9M18 10v9"/>',kitchen:'<path d="M6 13a6 6 0 1 1 12 0v1H6zM4 18h16"/>',online:'<path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/>',menu:'<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM8 8h7M8 12h7"/>',stock:'<path d="M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8"/>',users:'<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 20a6 6 0 0 0-3-5"/>',chart:'<path d="M4 20V4M4 20h16M8 16v-5M13 16V8M18 16v-9"/>',building:'<path d="M4 20V6l8-3 8 3v14M9 20v-5h6v5M8 9h2M14 9h2M8 12h2M14 12h2"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>'};
const ic=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`;

/* ---------- defaults (used until a document is first saved) ---------- */
const tb=(n,c)=>Array.from({length:n},(_,i)=>({id:"T"+(i+1),name:"T"+(i+1),seats:i%3===0?2:i%3===1?4:6}));
const DEF={
 cfg:{outlets:[{id:"o1",name:"Indiranagar",kind:"outlet",tables:tb(8)},{id:"o2",name:"Koramangala",kind:"outlet",tables:tb(6)},{id:"ck",name:"Central Kitchen",kind:"central",tables:[]}],
  staff:[{id:"u1",name:"Asha",role:"owner",pin:"1111"},{id:"u2",name:"Rahul",role:"manager",pin:"2222"},{id:"u3",name:"Meera",role:"cashier",pin:"3333"},{id:"u4",name:"Dev",role:"waiter",pin:"4444"},{id:"u5",name:"Imran",role:"kitchen",pin:"5555"}],
  tax:{inclusive:false,service:0},bill:{name:"Demo Kitchen",addr:"12 MG Road, Bengaluru",gstin:"",footer:"Thank you. Visit again.",split:true,width:34},
  upi:"demo@upi",commission:{swiggy:20,zomato:22},platforms:{swiggy:true,zomato:true,website:true,qr:true},loyalty:{per:10,maxPct:50},sup:["Fresh Farms","City Dairy","Metro Wholesale"]},
 ing:{items:[{id:"rice",name:"Basmati rice",unit:"kg",min:5,cost:95},{id:"chicken",name:"Chicken",unit:"kg",min:4,cost:220},{id:"paneer",name:"Paneer",unit:"kg",min:3,cost:340},{id:"tomato",name:"Tomato",unit:"kg",min:4,cost:40},{id:"onion",name:"Onion",unit:"kg",min:5,cost:35},{id:"flour",name:"Flour (maida)",unit:"kg",min:4,cost:45},{id:"butter",name:"Butter",unit:"kg",min:2,cost:520},{id:"oil",name:"Cooking oil",unit:"l",min:5,cost:130},{id:"milk",name:"Milk",unit:"l",min:8,cost:56},{id:"coffee",name:"Coffee powder",unit:"kg",min:1,cost:900},{id:"tea",name:"Tea leaves",unit:"kg",min:1,cost:480},{id:"sugar",name:"Sugar",unit:"kg",min:4,cost:44},{id:"potato",name:"Potato",unit:"kg",min:6,cost:30}]},
 menu:{cats:["Mains","Biryani","Breads","Snacks","Beverages","Desserts"],items:[
  {id:"m1",name:"Paneer Butter Masala",cat:"Mains",price:260,gst:5,veg:true,station:"Kitchen",variants:[],addons:[],recipe:[{i:"paneer",q:.15},{i:"butter",q:.02},{i:"tomato",q:.2}]},
  {id:"m2",name:"Butter Chicken",cat:"Mains",price:320,gst:5,veg:false,station:"Kitchen",variants:[],addons:[],recipe:[{i:"chicken",q:.25},{i:"butter",q:.03},{i:"tomato",q:.2}]},
  {id:"m3",name:"Veg Biryani",cat:"Biryani",price:220,gst:5,veg:true,station:"Kitchen",variants:[{n:"Regular",p:0},{n:"Large",p:70}],addons:[{n:"Extra raita",p:30}],recipe:[{i:"rice",q:.2},{i:"onion",q:.1},{i:"oil",q:.03}]},
  {id:"m4",name:"Chicken Biryani",cat:"Biryani",price:280,gst:5,veg:false,station:"Kitchen",variants:[{n:"Regular",p:0},{n:"Large",p:80}],addons:[{n:"Extra raita",p:30}],recipe:[{i:"rice",q:.2},{i:"chicken",q:.2},{i:"onion",q:.1}]},
  {id:"m5",name:"Butter Naan",cat:"Breads",price:60,gst:5,veg:true,station:"Kitchen",variants:[],addons:[],recipe:[{i:"flour",q:.1},{i:"butter",q:.01}]},
  {id:"m6",name:"French Fries",cat:"Snacks",price:110,gst:5,veg:true,station:"Kitchen",variants:[],addons:[{n:"Cheese dip",p:30}],recipe:[{i:"potato",q:.25},{i:"oil",q:.05}]},
  {id:"m7",name:"Masala Chai",cat:"Beverages",price:40,gst:5,veg:true,station:"Bar",variants:[],addons:[],recipe:[{i:"milk",q:.1},{i:"tea",q:.005},{i:"sugar",q:.01}]},
  {id:"m8",name:"Cold Coffee",cat:"Beverages",price:120,gst:5,veg:true,station:"Bar",variants:[{n:"Regular",p:0},{n:"Large",p:40}],addons:[{n:"Extra shot",p:30}],recipe:[{i:"milk",q:.2},{i:"coffee",q:.01},{i:"sugar",q:.02}]},
  {id:"m9",name:"Cola 300 ml",cat:"Beverages",price:60,gst:18,veg:true,station:"Bar",variants:[],addons:[],recipe:[]},
  {id:"m10",name:"Gulab Jamun",cat:"Desserts",price:90,gst:5,veg:true,station:"Dessert",variants:[],addons:[],recipe:[{i:"flour",q:.03},{i:"sugar",q:.05},{i:"milk",q:.05}]}]}
};
const DEFSTOCK={o1:{rice:22,chicken:3.5,paneer:2.6,tomato:12,onion:14,flour:10,butter:3,oil:11,milk:20,coffee:2,tea:2,sugar:9,potato:15},
 o2:{rice:18,chicken:9,paneer:6,tomato:9,onion:12,flour:8,butter:4,oil:9,milk:15,coffee:1.5,tea:1.5,sugar:7,potato:11},
 ck:{rice:120,chicken:60,paneer:35,tomato:80,onion:90,flour:70,butter:20,oil:60,milk:100,coffee:10,tea:8,sugar:50,potato:80}};
const PERMS={owner:"*",manager:["order","kot","bill","disc","discany","cancel","reverse","menu","stock","po","reports","dayend","kds","online","crm","hq","approve"],cashier:["order","kot","bill","disc","online","crm","dayend","kds"],waiter:["order","kot"],kitchen:["kds"]};
const ROLEN={owner:"Owner",manager:"Manager",cashier:"Cashier",waiter:"Waiter (Captain)",kitchen:"Kitchen"};

/* ---------- state ---------- */
const S={cfg:null,menu:null,ing:null,stock:{},orders:{},customers:{},po:{},misc:{}};
const UI={view:"tables",outlet:"o1",user:null,modal:null,cat:"All",q:"",range:"today",scope:"cur",rtab:"day",itab:"stock",otab:"in",ctab:"list",htab:"over",atab:"staff",station:"All",combine:false,merge:null,cart:null,pay:null,cust:"",kflt:"All"};
let DB=null,readOnly=false,localOnly=true;
const Q={offline:false,pending:{}},chain={};
const cfg=()=>S.cfg||(S.cfg=clone(DEF.cfg));
const menu=()=>S.menu||(S.menu=clone(DEF.menu));
const ings=()=>S.ing||(S.ing=clone(DEF.ing));
const stockOf=o=>S.stock[o]||(S.stock[o]={qty:clone(DEFSTOCK[o]||{}),waste:[]});
const outlet=id=>cfg().outlets.find(o=>o.id===(id||UI.outlet));
const ingName=id=>ings().items.find(i=>i.id===id)||{name:id,unit:""};
const can=p=>{const r=PERMS[UI.user?.role];return r==="*"||!!(r&&r.includes(p))};
const itemById=id=>menu().items.find(i=>i.id===id);

/* ---------- storage ---------- */
function applyLocal(path,data,del){
  const [c,id]=path.split("/");
  if(c==="config"){if(!del)S[id==="main"?"cfg":id]=data}
  else if(c==="stock"){del?delete S.stock[id]:S.stock[id]=data}
  else if(c==="misc"){S.misc[id]=data}
  else{del?delete S[c][id]:S[c][id]=data}
}
function writeNow(path,data,del){
  if(!DB)return;
  const prev=chain[path]||Promise.resolve();
  chain[path]=prev.then(()=>del?DB.doc(path).delete():DB.doc(path).set(clone(data))).catch(e=>{
    if(e&&e.code==="invalid_argument"){readOnly=true;toast("View-only access: changes are not saved. Ask the owner for Contributor access.");render()}
    else if(e&&e.code==="quota_exceeded")toast("Storage is full. Delete sample data in Settings > Data.");
    else toast("Could not save: "+(e&&e.message||"unknown error"));
  });
}
function commit(path,data,del){
  applyLocal(path,data,del);
  if(DB&&!readOnly){ if(Q.offline)Q.pending[path]={data:del?null:clone(data),del:!!del}; else writeNow(path,data,del); }
  schedule();
}
const removeDoc=path=>commit(path,null,true);
function flushQueue(){
  const p=Q.pending;Q.pending={};
  Object.keys(p).forEach(k=>writeNow(k,p[k].data,p[k].del));
  return Object.keys(p).length;
}
function setOffline(v){
  if(v===Q.offline)return;
  Q.offline=v;
  if(!v){const n=flushQueue();toast(n?`Back online. ${n} saved change${n>1?"s":""} synced.`:"Back online.")}
  else toast("Offline test on. Billing keeps working; changes sync when you go back online.");
  render();
}
window.addEventListener("online",()=>{if(Q.offline&&!UI.forcedOffline)setOffline(false)});
window.addEventListener("offline",()=>{UI.forcedOffline=false;setOffline(true)});
function audit(act,d){
  const a=S.misc.audit||(S.misc.audit={log:[]});
  a.log.unshift({t:Date.now(),u:UI.user?UI.user.name+" ("+UI.user.role+")":"-",o:UI.outlet,act,d:d||""});
  a.log.length=Math.min(a.log.length,200);
  commit("misc/audit",a);
}
const ev=(o,act)=>{(o.log=o.log||[]).push({t:Date.now(),u:UI.user?UI.user.name:"-",act})};

/* ---------- billing maths ---------- */
function calc(o){
  const t=cfg().tax,lines=(o.lines||[]).filter(l=>!l.void);
  const sub=lines.reduce((a,l)=>a+l.price*l.qty,0);
  let d=0;if(o.disc&&o.disc.v>0)d=o.disc.t==="pct"?sub*o.disc.v/100:Math.min(o.disc.v,sub);
  d=Math.min(d,sub);const r=sub?d/sub:0;
  const svcR=(o.type==="dine"?t.service:0)/100;
  let net=0,tax=0,svc=0;const byRate={};
  lines.forEach(l=>{
    const gross=l.price*l.qty*(1-r);let base=gross,tx;
    if(t.inclusive){base=gross/(1+l.gst/100);tx=gross-base}else tx=gross*l.gst/100;
    const sv=base*svcR;svc+=sv;tx+=sv*l.gst/100;net+=base;tax+=tx;
    const b=byRate[l.gst]||(byRate[l.gst]={rate:l.gst,taxable:0,tax:0});b.taxable+=base+sv;b.tax+=tx;
  });
  const total=net+svc+tax,rounded=Math.round(total);
  return {sub:r2(sub),disc:r2(d),net:r2(net),svc:r2(svc),tax:r2(tax),cgst:r2(tax/2),sgst:r2(tax/2),round:r2(rounded-total),total:rounded,byRate:Object.values(byRate).map(x=>({rate:x.rate,taxable:r2(x.taxable),tax:r2(x.tax)}))};
}
const redeemOf=o=>o.redeem||0;
const payableOf=o=>Math.max(0,(o.bill?o.bill.total:calc(o).total)-redeemOf(o));
const paidOf=o=>(o.pay||[]).reduce((a,p)=>a+p.amt,0);
const isSale=o=>o.status==="paid"&&!o.reversal;
const tableOrder=tid=>Object.values(S.orders).find(o=>o.outlet===UI.outlet&&["open","billed"].includes(o.status)&&o.type==="dine"&&(o.table===tid||(o.merged||[]).includes(tid)));
const lowItems=o=>{const st=stockOf(o).qty;return ings().items.filter(i=>(st[i.id]||0)<=i.min)};

/* ---------- ui plumbing ---------- */
let toastT=null;
function toast(m){const t=$("#toast");t.innerHTML=`<div class="toast" role="status">${esc(m)}</div>`;clearTimeout(toastT);toastT=setTimeout(()=>t.innerHTML="",3600)}
let raf=0,pend=false;
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const a=document.activeElement;if(a&&a.closest&&a.closest("#root .main")&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)){pend=true;return}render()})}
document.addEventListener("focusout",()=>{if(pend){pend=false;setTimeout(()=>{const a=document.activeElement;if(!(a&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)&&a.closest("#root .main")))render()},50)}});
function openModal(html,wide,live){UI.modal={wide:!!wide,live:!!live,html};paintModal()}
function paintModal(){
  const m=UI.modal,el=$("#modal");
  if(!m){el.innerHTML="";return}
  el.innerHTML=`<div class="modal-bg" data-a="bg"><div class="modal${m.wide?" wide":""}" role="dialog" aria-modal="true">${m.html}</div></div>`;
}
function closeModal(){UI.modal=null;UI.cart=null;UI.pay=null;paintModal();render()}
function modalIs(k){return UI.modal&&UI.modal.kind===k}
function setModal(kind,html,wide,live){UI.modal={kind,wide:!!wide,live:!!live,html};paintModal()}
function needApproval(reason,cb){
  if(can("approve")||UI.user.role==="owner"){cb(UI.user.name);return}
  UI.approve={reason,cb};
  setModal("approve",`<h2>Manager approval needed</h2><p class="muted">${esc(reason)}. A manager or owner enters their PIN.</p>
  <form data-f="approve" class="grid"><label class="f">Manager PIN<input id="appin" type="password" inputmode="numeric" maxlength="6" autocomplete="off" required></label>
  <div class="row"><button class="btn pri" type="submit">Approve</button><button class="btn" type="button" data-a="closeTop">Cancel</button></div></form>`);
  setTimeout(()=>$("#appin")?.focus(),30);
}
function download(name,text,mime){
  if(!UI.dl){toast("Downloads are not available in this view.");return}
  UI.dl.save({filename:name,data:new Blob([text],{type:mime||"text/csv"})}).then(()=>toast("Saved "+name)).catch(()=>toast("Download was cancelled."));
}
const csv=rows=>rows.map(r=>r.map(c=>{c=String(c??"");return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c}).join(",")).join("\n");/* ---------- shell ---------- */
const V={},A={},F={},CH={},INP={};
const NAV=[["tables","Tables","table","order"],["kitchen","Kitchen","kitchen","kds"],["online","Online","online","online"],["menu","Menu","menu","menu"],["stock","Inventory","stock","stock"],["crm","Customers","users","crm"],["reports","Reports","chart",["reports","dayend"]],["hq","Outlets","building","hq"],["admin","Settings","gear","admin"]];
const allowed=p=>Array.isArray(p)?p.some(can):(p==="admin"?UI.user?.role==="owner":can(p));
const navItems=()=>NAV.filter(n=>allowed(n[3]));
function connPill(){
  if(readOnly)return `<span class="pill bad"><i class="dot"></i>View only</span>`;
  if(Q.offline){const n=Object.keys(Q.pending).length;return `<span class="pill warn"><i class="dot"></i>Offline${n?" · "+n+" waiting":""}</span>`}
  if(localOnly)return `<span class="pill mut" title="Saved in this browser. Add Firebase settings to share across devices."><i class="dot"></i>This browser only</span>`;
  return `<span class="pill ok"><i class="dot"></i>Live · synced</span>`;
}
function render(){
  const root=$("#root");$("#boot").hidden=true;root.hidden=false;
  if(!UI.user){root.className="";root.innerHTML=loginHTML();return}
  const items=navItems();if(!items.find(n=>n[0]===UI.view))UI.view=items[0][0];
  const old=$("#main"),sc=old?old.scrollTop:0;
  const outs=cfg().outlets.filter(o=>o.kind==="outlet"||can("hq"));
  if(!outs.find(o=>o.id===UI.outlet))UI.outlet=outs[0].id;
  const low=lowItems(UI.outlet).length,inb=Object.values(S.orders).filter(o=>o.outlet===UI.outlet&&o.status==="online_new").length;
  const badge=id=>id==="stock"&&low?`<span class="badge">${low}</span>`:id==="online"&&inb?`<span class="badge">${inb}</span>`:"";
  root.className="app";
  root.innerHTML=`<header class="top"><span class="brand">Dine Desk</span>
   <label class="row" style="gap:6px"><span class="muted" style="font-weight:600">Outlet</span><select id="outsel" data-c="outlet" aria-label="Outlet">${outs.map(o=>`<option value="${o.id}"${o.id===UI.outlet?" selected":""}>${esc(o.name)}</option>`).join("")}</select></label>
   <span class="sp"></span>${connPill()}
   <button class="btn sm" data-a="toggleOffline" aria-pressed="${Q.offline}">${Q.offline?"Go online":"Test offline"}</button>
   <span class="pill">${esc(UI.user.name)} · ${ROLEN[UI.user.role]}</span><button class="btn sm" data-a="logout">Log out</button></header>
   <nav class="nav" aria-label="Main">${items.map(n=>`<button data-a="nav" data-v="${n[0]}"${n[0]===UI.view?' aria-current="page"':""}>${ic(n[2])}<span>${n[1]}</span>${badge(n[0])}</button>`).join("")}</nav>
   <main class="main" id="main">${Q.offline?`<div class="banner warn">Offline: billing, KOT and reports keep working. Online orders need internet. Changes sync when you go back online.</div>`:""}${V[UI.view]()}</main>`;
  const m=$("#main");if(m)m.scrollTop=sc;
  if(UI.modal&&UI.modal.live&&LIVE[UI.modal.kind]){const a=document.activeElement;if(!(a&&a.closest&&a.closest("#modal")&&/INPUT|TEXTAREA|SELECT/.test(a.tagName)))LIVE[UI.modal.kind]()}
}
const LIVE={};
function loginHTML(){
  return `<div class="login"><div class="brand" style="font-size:30px">Dine Desk</div><h2 style="margin-top:6px">Who is working now?</h2>
  <p class="muted">Restaurant billing and POS demo. Pick a team member and enter the PIN shown on the card (demo PINs; change them in Settings).</p>
  <div class="pick">${cfg().staff.map(s=>`<button class="pickb" data-a="pickUser" data-id="${s.id}"><b>${esc(s.name)}</b><br><span class="muted">${ROLEN[s.role]}</span><br><span class="mono muted">PIN ${esc(s.pin)}</span></button>`).join("")}</div>
  <p class="muted" style="margin-top:16px">${localOnly?"Running without cloud sync: data stays on this screen only.":"Data is shared live between every device that opens this link."}</p></div>`;
}
F.login=(f)=>{
  const s=cfg().staff.find(x=>x.id===UI.pick);
  if(f.pin.value===s.pin){UI.user=s;try{sessionStorage.setItem("dd_user",s.id)}catch(e){}UI.view=s.role==="kitchen"?"kitchen":"tables";closeModal();toast("Welcome, "+s.name)}
  else{f.pin.value="";toast("Wrong PIN")}
};
A.pickUser=d=>{UI.pick=d.id;const s=cfg().staff.find(x=>x.id===d.id);setModal("login",`<h2>${esc(s.name)}</h2><form data-f="login" class="grid"><label class="f">PIN<input name="pin" id="pinin" type="password" inputmode="numeric" maxlength="6" autocomplete="off" required></label><div class="row"><button class="btn pri">Open</button><button type="button" class="btn" data-a="closeTop">Cancel</button></div></form>`);setTimeout(()=>$("#pinin")?.focus(),30)};
A.logout=()=>{UI.user=null;try{sessionStorage.removeItem("dd_user")}catch(e){}UI.modal=null;paintModal();render()};
A.nav=d=>{UI.view=d.v;render()};
A.closeTop=()=>closeModal();
A.bg=(d,el,e)=>{if(e.target===el&&UI.modal&&!UI.modal.sticky)closeModal()};
A.toggleOffline=()=>{UI.forcedOffline=!Q.offline;setOffline(!Q.offline)};
CH.outlet=el=>{UI.outlet=el.value;render()};
F.approve=f=>{const pin=f.pin?f.pin.value:$("#appin").value;const m=cfg().staff.find(s=>["manager","owner"].includes(s.role)&&s.pin===pin);
  if(!m){toast("PIN not recognised");return}const cb=UI.approve.cb;audit("Approval",UI.approve.reason+" approved by "+m.name);UI.approve=null;closeModal();cb(m.name)};

/* ---------- tables view ---------- */
function tableState(t){
  const o=tableOrder(t.id);if(!o)return{k:"free",o:null};
  if(o.table!==t.id)return{k:"merged",o};
  if(o.status==="billed")return{k:"billed",o};
  if(o.kots.some(k=>k.st==="ready"))return{k:"ready",o};
  return{k:"occ",o};
}
V.tables=()=>{
  const ou=outlet();
  if(ou.kind==="central")return `<div class="card"><h2>${esc(ou.name)}</h2><p class="muted">The central kitchen has no dining tables. It prepares stock for the outlets. Use Inventory and Outlets to manage indents and dispatch.</p></div>`;
  const takeaways=Object.values(S.orders).filter(o=>o.outlet===UI.outlet&&o.type!=="dine"&&["open","billed"].includes(o.status)&&o.source==="POS");
  const mg=UI.merge;
  const cards=ou.tables.map(t=>{
    const st=tableState(t),o=st.o,c=o?calc(o):null;
    const lab={free:"Free",occ:"Occupied",ready:"Food ready",billed:"Bill printed",merged:"Merged"}[st.k];
    return `<button class="tcard ${st.k==="free"?"":st.k}${mg&&mg.sel.includes(t.id)?" sel":""}" data-a="table" data-id="${t.id}"><div class="row sb"><b>${esc(t.name)}</b><span class="muted">${t.seats} seats</span></div>
    <span class="pill ${st.k==="free"?"mut":st.k==="ready"?"ok":st.k==="occ"?"warn":""}">${lab}</span>
    ${o&&st.k!=="merged"?`<span class="num"><b>${money(o.bill?o.bill.total:c.total)}</b> · ${o.lines.filter(l=>!l.void).length} items · ${mins(o.created)} min</span>`:""}
    ${st.k==="merged"?`<span class="muted">with ${esc(o.table)}</span>`:""}</button>`}).join("");
  const free=ou.tables.filter(t=>tableState(t).k==="free").length;
  return `<div class="row sb"><div><h2>Tables · ${esc(ou.name)}</h2><p class="muted" style="margin:2px 0 0">${free} of ${ou.tables.length} free</p></div>
   <div class="row">${can("order")?`<button class="btn" data-a="newTake">New takeaway</button>`:""}${can("bill")?(mg?`<button class="btn pri" data-a="doMerge"${mg.sel.length<2?" disabled":""}>Merge ${mg.sel.length} tables</button><button class="btn" data-a="mergeOff">Cancel</button>`:`<button class="btn" data-a="mergeOn">Merge tables</button>`):""}</div></div>
  ${mg?`<div class="banner ok" style="margin-top:10px">Tap the tables to join, then press Merge. The first table you tap becomes the main bill.</div>`:""}
  <div class="grid g4" style="margin-top:12px">${cards}</div>
  ${takeaways.length?`<h3 style="margin:18px 0 8px">Open takeaway orders</h3><div class="grid g4">${takeaways.map(o=>`<button class="tcard ${o.status==="billed"?"billed":"occ"}" data-a="openOrd" data-id="${o.id}"><b>Token ${o.token}</b><span class="num">${money(o.bill?o.bill.total:calc(o).total)}</span><span class="muted">${o.lines.length} items · ${mins(o.created)} min</span></button>`).join("")}</div>`:""}
  ${!Object.values(S.orders).some(o=>o.outlet===UI.outlet)&&can("reports")?`<p class="muted" style="margin-top:18px">No orders yet at this outlet. Tap a table to start one, or load a sample day under Settings &gt; Data to see the reports filled.</p>`:""}`;
};
A.mergeOn=()=>{UI.merge={sel:[]};render()};A.mergeOff=()=>{UI.merge=null;render()};
A.table=d=>{
  if(UI.merge){const s=UI.merge.sel,i=s.indexOf(d.id);i>=0?s.splice(i,1):s.push(d.id);render();return}
  const o=tableOrder(d.id);
  if(!can("order"))return;
  openOrderPanel(o?{id:o.id,table:o.table,type:"dine"}:{table:d.id,type:"dine"});
};
A.doMerge=()=>{
  const sel=UI.merge.sel;if(sel.length<2)return;
  const main=sel[0];UI.cart={table:main,type:"dine",id:null};
  let o=tableOrder(main);
  if(o&&o.table!==main){toast("First table is already merged elsewhere.");return}
  if(!o){o=ensureOrder()}
  sel.slice(1).forEach(id=>{
    const x=tableOrder(id);
    if(x&&x.id!==o.id){x.lines.forEach(l=>o.lines.push(l));x.kots.forEach(k=>o.kots.push(k));x.status="cancelled";x.cancel={reason:"Merged into "+main,by:UI.user.name,at:Date.now()};ev(x,"Merged into "+main);commit("orders/"+x.id,x)}
    if(!o.merged.includes(id))o.merged.push(id);
  });
  ev(o,"Merged tables "+sel.join(", "));audit("Tables merged",sel.join(" + "));commit("orders/"+o.id,o);
  UI.merge=null;UI.cart=null;toast("Merged "+sel.join(" + "));render();
};
A.newTake=()=>openOrderPanel({type:"take",id:null});
A.openOrd=d=>openOrderPanel({id:d.id,type:S.orders[d.id].type,table:S.orders[d.id].table});

/* ---------- order panel ---------- */
const nextTok=()=>1+Math.max(0,...Object.values(S.orders).filter(o=>o.outlet===UI.outlet&&sameDay(o.created,Date.now())&&o.token).map(o=>o.token));
const nextKot=()=>1+Math.max(0,...Object.values(S.orders).filter(o=>o.outlet===UI.outlet&&sameDay(o.created,Date.now())).flatMap(o=>o.kots.map(k=>k.no)));
function ensureOrder(){
  let o=UI.cart.id&&S.orders[UI.cart.id];if(o)return o;
  o={id:uid("o"),outlet:UI.outlet,table:UI.cart.table||null,type:UI.cart.type||"dine",source:"POS",status:"open",lines:[],kots:[],merged:[],disc:{t:"pct",v:0},pay:[],created:Date.now(),by:UI.user.name,log:[]};
  if(o.type!=="dine")o.token=nextTok();
  ev(o,"Order started");UI.cart.id=o.id;S.orders[o.id]=o;return o;
}
function openOrderPanel(c){UI.cart=c;UI.cat="All";UI.q="";paintOrder(true)}
const avail=it=>!(it.off||[]).includes(UI.outlet)&&(it.avail?.pos!==false);
function menuGrid(){
  const m=menu(),q=UI.q.toLowerCase();
  const its=m.items.filter(i=>(UI.cat==="All"||i.cat===UI.cat)&&(!q||i.name.toLowerCase().includes(q)));
  return its.map(i=>`<button class="mi${avail(i)?"":" off"}" data-a="addItem" data-id="${i.id}"${avail(i)?"":" disabled"}><span><i class="veg${i.veg?"":" nv"}"></i><b>${esc(i.name)}</b></span><span class="muted num">${money(i.price)}${i.variants.length||i.addons.length?" · options":""}</span>${avail(i)?"":'<span class="pill bad">Unavailable</span>'}</button>`).join("")||`<p class="muted">No items match.</p>`;
}
function orderHTML(){
  const o=UI.cart.id&&S.orders[UI.cart.id];const lines=o?o.lines.filter(l=>!l.void):[];
  const c=o?(o.bill||calc(o)):{sub:0,disc:0,svc:0,tax:0,round:0,total:0};
  const st=o?o.status:"open",editable=!o||st==="open";
  const cust=o&&o.cust&&S.customers[o.cust];
  const title=(UI.cart.type==="dine"?"Table "+UI.cart.table:"Takeaway"+(o&&o.token?" · Token "+o.token:""))+(o&&o.source!=="POS"?" · "+o.source:"");
  const newCnt=lines.filter(l=>l.kot===null).length;
  const cats=["All",...menu().cats];
  const cartLines=lines.map(l=>`<div class="line"><div><b>${esc(l.name)}</b>${l.adds.length?`<div class="muted">+ ${esc(l.adds.join(", "))}</div>`:""}${l.note?`<div class="muted">Note: ${esc(l.note)}</div>`:""}
     <div class="muted">${l.kot!==null?`<span class="pill ok">KOT ${l.kot}</span>`:`<span class="pill mut">Not sent</span>`} ${editable?`<button class="btn sm" data-a="note" data-id="${l.id}">Note</button>`:""}</div></div>
     <span class="step">${editable?`<button data-a="dec" data-id="${l.id}" aria-label="Less">−</button>`:""}<b class="num">${l.qty}</b>${editable?`<button data-a="inc" data-id="${l.id}" aria-label="More">+</button>`:""}</span><b class="num">${money(l.price*l.qty)}</b></div>`).join("")||`<p class="muted">No items yet. Tap a dish to add it.</p>`;
  const acts=[];
  if(!o||st==="open"){
    acts.push(`<button class="btn pri" data-a="kot"${newCnt?"":" disabled"}>Send KOT${newCnt?" ("+newCnt+")":""}</button>`);
    if(can("bill")){acts.push(`<button class="btn" data-a="disc"${lines.length?"":" disabled"}>Discount</button>`,`<button class="btn" data-a="custPick"${lines.length?"":" disabled"}>${cust?"Customer: "+esc(cust.name):"Add customer"}</button>`,`<button class="btn sec" data-a="genBill"${lines.length?"":" disabled"}>Generate bill</button>`)}
    if(o&&o.lines.length)acts.push(`<button class="btn bad" data-a="cancelOrd">Cancel order</button>`);
  }else if(st==="billed"){
    acts.push(`<button class="btn sec" data-a="payOpen">Collect payment</button>`,`<button class="btn" data-a="prevBill">Preview bill</button>`);
    if(can("reverse"))acts.push(`<button class="btn" data-a="reopen">Reopen bill</button>`);
  }else if(st==="paid"){
    acts.push(`<button class="btn" data-a="prevBill">Bill</button>`);
    if(can("reverse")&&!o.reversal)acts.push(`<button class="btn bad" data-a="reverse">Reverse bill</button>`);
    if(o.reversal)acts.push(`<span class="pill bad">Reversed: ${esc(o.reversal.reason)}</span>`);
  }
  const kots=o&&o.kots.length?`<div class="chips" aria-label="KOT slips">${o.kots.map((k,i)=>`<button data-a="kotSlip" data-i="${i}">KOT ${k.no} · ${esc(k.station)} · ${k.st}</button>`).join("")}</div>`:"";
  return `<div class="row sb" style="margin-bottom:8px"><div class="row"><h2>${esc(title)}</h2><span class="pill ${st==="paid"?"ok":st==="billed"?"":"warn"}">${st==="open"?"Open":st==="billed"?"Bill printed":st==="paid"?"Paid":st}</span></div><button class="btn sm" data-a="closeTop">Close</button></div>
  <div class="ordg"><div>
    ${editable?`<div class="row"><input id="msearch" data-i="msearch" type="search" placeholder="Search dishes" value="${esc(UI.q)}" aria-label="Search dishes" style="flex:1;min-width:140px"></div>
    <div class="chips" id="cats">${cats.map(ct=>`<button data-a="cat" data-c="${esc(ct)}" aria-pressed="${UI.cat===ct}">${esc(ct)}</button>`).join("")}</div><div class="mgrid" id="mgrid">${menuGrid()}</div>`:`<p class="muted">This bill is locked. Edits after billing are not allowed; use Reopen or Reverse with a reason so the record stays complete.</p>`}
  </div><div class="card">${kots}${cartLines}
    <div class="tot num"><span>Subtotal</span><span>${money(c.sub)}</span>${c.disc?`<span>Discount${o.disc&&o.disc.t==="pct"?" ("+o.disc.v+"%)":""}</span><span>−${money(c.disc)}</span>`:""}${c.svc?`<span>Service charge</span><span>${money(c.svc)}</span>`:""}<span>GST</span><span>${money(c.tax)}</span>${c.round?`<span>Round off</span><span>${money(c.round)}</span>`:""}<span class="gt">Total</span><span class="gt">${money(c.total)}</span></div>
    ${o&&o.redeem?`<p class="muted">Loyalty points redeemed: −${money(o.redeem)}</p>`:""}
    <div class="row">${acts.join("")}</div></div></div>`;
}
function paintOrder(first){
  const html=orderHTML();
  UI.modal={kind:"order",wide:true,live:true,html};paintModal();
  if(first)setTimeout(()=>{},0);
}
LIVE.order=()=>{if(UI.cart){if(UI.cart.id&&!S.orders[UI.cart.id]){closeModal();return}paintOrder()}};
INP.msearch=el=>{UI.q=el.value;const g=$("#mgrid");if(g)g.innerHTML=menuGrid()};
A.cat=d=>{UI.cat=d.c;paintOrder();const s=$("#msearch");};
function chooseOptions(it){
  UI.opt={id:it.id,v:0,adds:[],qty:1};
  setModal("opt",`<h2>${esc(it.name)}</h2><form data-f="opt" class="grid">
  ${it.variants.length?`<fieldset style="border:1px solid var(--line);border-radius:8px"><legend>Size</legend>${it.variants.map((v,i)=>`<label class="row" style="padding:3px 0"><input type="radio" name="v" value="${i}"${i===0?" checked":""}> ${esc(v.n)} <span class="muted">${v.p?"+"+money(v.p):""}</span></label>`).join("")}</fieldset>`:""}
  ${it.addons.length?`<fieldset style="border:1px solid var(--line);border-radius:8px"><legend>Add-ons</legend>${it.addons.map((a,i)=>`<label class="row" style="padding:3px 0"><input type="checkbox" name="a" value="${i}"> ${esc(a.n)} <span class="muted">+${money(a.p)}</span></label>`).join("")}</fieldset>`:""}
  <label class="f">Quantity<input name="q" type="number" min="1" max="50" value="1"></label>
  <div class="row"><button class="btn pri">Add to order</button><button type="button" class="btn" data-a="backOrder">Back</button></div></form>`);
}
A.backOrder=()=>paintOrder();
F.opt=f=>{
  const it=itemById(UI.opt.id);const vi=f.querySelector("[name=v]:checked");const adds=[...f.querySelectorAll("[name=a]:checked")].map(x=>+x.value);
  addLine(it,vi?+vi.value:-1,adds,Math.max(1,+f.q.value||1));paintOrder();
};
function addLine(it,vi,adds,qty){
  const o=ensureOrder();const v=vi>=0?it.variants[vi]:null,ad=adds.map(i=>it.addons[i]);
  const price=it.price+(v?v.p:0)+ad.reduce((a,x)=>a+x.p,0),key=[it.id,v?v.n:"",ad.map(a=>a.n).join("+")].join("|");
  let l=o.lines.find(x=>x.key===key&&x.kot===null&&!x.note&&!x.void);
  if(l)l.qty+=qty;else o.lines.push({id:uid("l"),key,item:it.id,name:it.name+(v&&it.variants.length>1?" ("+v.n+")":""),adds:ad.map(a=>a.n),price,qty,note:"",station:it.station,gst:it.gst,kot:null});
  commit("orders/"+o.id,o);
}
A.addItem=d=>{const it=itemById(d.id);if(it.variants.length>1||it.addons.length)chooseOptions(it);else{addLine(it,it.variants.length?0:-1,[],1);paintOrder()}};
A.inc=d=>{const o=S.orders[UI.cart.id],l=o.lines.find(x=>x.id===d.id);
  if(l.kot!==null){const k=l.key+"|n",ex=o.lines.find(x=>x.key===k&&x.kot===null&&!x.void);if(ex)ex.qty++;else o.lines.push(Object.assign({},l,{id:uid("l"),qty:1,kot:null,note:"",key:k}))}else l.qty++;
  commit("orders/"+o.id,o);paintOrder()};
A.dec=d=>{
  const o=S.orders[UI.cart.id],l=o.lines.find(x=>x.id===d.id);
  const apply=who=>{
    if(l.kot!==null){l.void=true;ev(o,"Voided after KOT: "+l.name+" ×"+l.qty+(who?" (approved by "+who+")":""));audit("Item voided after KOT",l.name+" ×"+l.qty)}
    else if(l.qty>1)l.qty--;else o.lines=o.lines.filter(x=>x.id!==l.id);
    commit("orders/"+o.id,o);paintOrder();
  };
  if(l.kot!==null)needApproval("Removing an item already sent to the kitchen",apply);else apply();
};
A.note=d=>{const o=S.orders[UI.cart.id],l=o.lines.find(x=>x.id===d.id);UI.noteId=l.id;setModal("note",`<h2>Note for ${esc(l.name)}</h2><form data-f="note" class="grid"><label class="f">Kitchen note<input name="n" value="${esc(l.note)}" maxlength="80" placeholder="Less spicy, no onion"></label><div class="row"><button class="btn pri">Save</button><button type="button" class="btn" data-a="backOrder">Back</button></div></form>`);};
F.note=f=>{const o=S.orders[UI.cart.id],l=o.lines.find(x=>x.id===UI.noteId);l.note=f.n.value.trim();commit("orders/"+o.id,o);paintOrder()};
function kotCore(o){
  const nl=o.lines.filter(l=>l.kot===null&&!l.void);if(!nl.length)return null;
  const no=nextKot(),stations=[...new Set(nl.map(l=>l.station))],sk=stockOf(o.outlet);
  stations.forEach(s=>o.kots.push({no,at:Date.now(),station:s,lines:nl.filter(l=>l.station===s).map(l=>({id:l.id,name:l.name,qty:l.qty,note:l.note,adds:l.adds})),st:"new"}));
  nl.forEach(l=>{l.kot=no;const it=itemById(l.item);(it?it.recipe:[]).forEach(r=>{sk.qty[r.i]=Math.max(0,r2((sk.qty[r.i]||0)-r.q*l.qty))})});
  ev(o,"KOT "+no+" sent to "+stations.join(", "));commit("orders/"+o.id,o);commit("stock/"+o.outlet,sk);
  return {no,stations};
}
A.kot=()=>{
  const o=S.orders[UI.cart.id];if(!o)return;const r=kotCore(o);if(!r)return;
  const low=lowItems(UI.outlet);toast("KOT "+r.no+" sent to "+r.stations.join(" and ")+" (print simulated)"+(low.length?". Low stock: "+low.slice(0,3).map(i=>i.name).join(", "):""));
  paintOrder();
};
function slipText(o,k){
  const w=32,ou=outlet(o.outlet);
  const L=["KOT #"+k.no+"  "+k.station.toUpperCase(),(o.type==="dine"?"Table "+o.table:"Takeaway token "+o.token)+(o.source!=="POS"?"  ["+o.source+"]":""),dstr(k.at)+" "+hhmm(k.at),ou.name,"-".repeat(w)];
  k.lines.forEach(l=>{L.push(lpad(l.qty,2)+" x "+l.name);if(l.adds&&l.adds.length)L.push("      + "+l.adds.join(", "));if(l.note)L.push("      ** "+l.note)});
  L.push("-".repeat(w));return L.join("\n");
}
A.kotSlip=d=>{const o=S.orders[UI.cart.id],k=o.kots[+d.i];setModal("slip",`<h2>Kitchen order ticket</h2><div class="receipt">${esc(slipText(o,k))}</div><p class="muted">Printing is simulated here. With a thermal printer connected, this slip prints at the ${esc(k.station)} station.</p><div class="row"><button class="btn" data-a="backOrder">Back</button></div>`)};
A.disc=()=>{
  const o=S.orders[UI.cart.id];
  setModal("disc",`<h2>Discount</h2><form data-f="disc" class="grid"><div class="row"><label class="f">Type<select name="t"><option value="pct"${o.disc.t==="pct"?" selected":""}>Percent</option><option value="flat"${o.disc.t==="flat"?" selected":""}>Flat amount</option></select></label><label class="f">Value<input name="v" type="number" min="0" step="0.5" value="${o.disc.v||""}" required></label></div>
  <label class="f">Reason<select name="r">${["Regular customer","Staff meal","Service issue","Promotion","Other"].map(x=>`<option${o.disc.reason===x?" selected":""}>${x}</option>`).join("")}</select></label>
  ${can("discany")?"":`<p class="muted">Cashiers can give up to 10%. Higher needs a manager PIN.</p>`}
  <div class="row"><button class="btn pri">Apply</button><button type="button" class="btn" data-a="backOrder">Back</button></div></form>`);
};
F.disc=f=>{
  const o=S.orders[UI.cart.id],t=f.t.value,v=Math.max(0,+f.v.value||0),sub=calc(o).sub;
  const pct=t==="pct"?v:(sub?v/sub*100:0);
  if(pct>100){toast("Discount cannot exceed the bill.");return}
  const apply=who=>{o.disc={t,v,reason:f.r.value,by:who||UI.user.name};ev(o,"Discount "+(t==="pct"?v+"%":money(v))+" ("+f.r.value+")");audit("Discount",(t==="pct"?v+"%":money(v))+" · "+f.r.value+" · bill "+(o.table||"token "+o.token));commit("orders/"+o.id,o);paintOrder()};
  if(pct>10&&!can("discany"))needApproval("Discount above 10%",apply);else apply();
};
const CANCELR=["Customer left","Wrong order","Duplicate order","Kitchen could not make it","Other"];
A.cancelOrd=()=>{
  const o=S.orders[UI.cart.id],sent=o.lines.some(l=>l.kot!==null);
  const go=()=>setModal("cancel",`<h2>Cancel this order?</h2><form data-f="cancel" class="grid"><label class="f">Reason<select name="r">${CANCELR.map(x=>`<option>${x}</option>`).join("")}</select></label><div class="row"><button class="btn bad">Cancel order</button><button type="button" class="btn" data-a="backOrder">Keep order</button></div></form>`);
  sent&&!can("cancel")?needApproval("Cancelling an order already sent to the kitchen",()=>go()):go();
};
F.cancel=f=>{const o=S.orders[UI.cart.id];o.status="cancelled";o.cancel={reason:f.r.value,by:UI.user.name,at:Date.now(),afterKot:o.lines.some(l=>l.kot!==null)};ev(o,"Cancelled: "+f.r.value);audit("Order cancelled",f.r.value);commit("orders/"+o.id,o);closeModal();toast("Order cancelled")};
A.genBill=()=>{
  const o=S.orders[UI.cart.id];if(o.lines.filter(l=>!l.void).length===0)return;
  const day=Object.values(S.orders).filter(x=>x.outlet===o.outlet&&x.bill&&sameDay(x.bill.at,Date.now())).length+1,d=new Date();
  const no=o.outlet.toUpperCase()+"-"+String(d.getFullYear()).slice(2)+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")+"-"+String(day).padStart(4,"0");
  o.bill=Object.assign(calc(o),{no,at:Date.now()});o.status="billed";ev(o,"Bill "+no+" generated");commit("orders/"+o.id,o);toast("Bill "+no+" generated");paintOrder();
};
A.reopen=()=>{const o=S.orders[UI.cart.id];if(paidOf(o)>0){toast("Payment already taken. Use Reverse bill.");return}
  needApproval("Reopening a printed bill",who=>{delete o.bill;o.status="open";ev(o,"Bill reopened");audit("Bill reopened",o.table||"token "+o.token);commit("orders/"+o.id,o);paintOrder()})};
A.reverse=()=>setModal("rev",`<h2>Reverse this bill</h2><p class="muted">A paid bill is never deleted or edited. A reversal entry is added with the reason, and the sale is removed from reports.</p><form data-f="rev" class="grid"><label class="f">Reason<input name="r" required maxlength="80" placeholder="e.g. Food quality refund"></label><div class="row"><button class="btn bad">Reverse bill</button><button type="button" class="btn" data-a="backOrder">Back</button></div></form>`);
F.rev=f=>{const o=S.orders[UI.cart.id];o.reversal={at:Date.now(),by:UI.user.name,reason:f.r.value};ev(o,"Bill reversed: "+f.r.value);
  if(o.cust&&S.customers[o.cust]){const c=S.customers[o.cust];c.points=Math.max(0,(c.points||0)-(o.earned||0)+(o.redeem||0));c.spend=Math.max(0,(c.spend||0)-o.bill.total);commit("customers/"+c.id,c)}
  audit("Bill reversed",o.bill.no+" · "+f.r.value);commit("orders/"+o.id,o);paintOrder();toast("Bill reversed")};

/* ---------- receipt ---------- */
function receiptText(o){
  const b=cfg().bill,w=b.width||34,c=o.bill||calc(o),ou=outlet(o.outlet),hr="-".repeat(w),ctr=s=>" ".repeat(Math.max(0,Math.floor((w-s.length)/2)))+s;
  const L=[ctr(b.name),ctr(ou.name),...(b.addr?[ctr(b.addr)]:[]),...(b.gstin?[ctr("GSTIN "+b.gstin)]:[]),hr,
   (o.bill?"Bill "+o.bill.no:"ESTIMATE (not a tax invoice)"),dstr(o.bill?o.bill.at:Date.now())+" "+hhmm(o.bill?o.bill.at:Date.now()),
   (o.type==="dine"?"Table "+o.table+(o.merged&&o.merged.length?" +"+o.merged.join("+"):""):"Takeaway token "+o.token)+(o.source!=="POS"?" ["+o.source+"]":"")+"  Cashier "+(o.by||""),hr,
   pad("Item",w-16)+lpad("Qty",4)+lpad("Amount",12),hr];
  o.lines.filter(l=>!l.void).forEach(l=>{L.push(pad(l.name,w-16)+lpad(l.qty,4)+lpad((l.price*l.qty).toFixed(2),12));if(l.adds.length)L.push("  + "+l.adds.join(", "))});
  L.push(hr);const row=(a,v)=>L.push(pad(a,w-12)+lpad(v,12));
  row("Subtotal",c.sub.toFixed(2));if(c.disc)row("Discount",("-"+c.disc.toFixed(2)));if(c.svc)row("Service charge",c.svc.toFixed(2));
  if(b.split)c.byRate.forEach(r=>{row("CGST "+r.rate/2+"% on "+r.taxable.toFixed(0),(r.tax/2).toFixed(2));row("SGST "+r.rate/2+"%",(r.tax/2).toFixed(2))});else row("GST",c.tax.toFixed(2));
  if(c.round)row("Round off",c.round.toFixed(2));L.push(hr);row("TOTAL",c.total.toFixed(2));
  if(o.redeem)row("Points redeemed","-"+o.redeem.toFixed(2));
  if((o.pay||[]).length){L.push(hr);o.pay.forEach(p=>row(p.mode+(p.ref?" "+p.ref:""),p.amt.toFixed(2)))}
  if(o.reversal){L.push(hr,ctr("*** REVERSED: "+o.reversal.reason+" ***"))}
  L.push(hr,ctr(b.footer||""));return L.join("\n");
}
A.prevBill=()=>{const o=S.orders[UI.cart.id];setModal("bill",`<h2>Bill</h2><div class="receipt">${esc(receiptText(o))}</div><p class="muted">Print preview. The layout follows your bill settings.</p><div class="row"><button class="btn" data-a="backOrder">Back</button></div>`)};

/* ---------- payment ---------- */
function payHTML(){
  const o=S.orders[UI.pay.id],due=r2(payableOf(o)-paidOf(o)),cust=o.cust&&S.customers[o.cust],P=UI.pay;
  const maxRed=cust?Math.min(cust.points||0,Math.floor(o.bill.total*cfg().loyalty.maxPct/100)):0;
  const lines=o.lines.filter(l=>!l.void),sub=o.bill.sub||1;
  const guests=[0,0,0,0];lines.forEach(l=>{guests[(P.assign[l.id]||1)-1]+=l.price*l.qty/sub*payableOf(o)});
  return `<div class="row sb"><h2>Collect payment</h2><button class="btn sm" data-a="backOrder">Back</button></div>
  <div class="grid g3"><div class="card kpi"><span>Bill ${esc(o.bill.no)}</span><b class="num">${money(payableOf(o))}</b></div><div class="card kpi"><span>Received</span><b class="num">${money(paidOf(o))}</b></div><div class="card kpi"><span>Balance due</span><b class="num" style="color:${due>0?"var(--bad)":"var(--ok)"}">${money(due)}</b></div></div>
  ${cust&&paidOf(o)===0?`<div class="card" style="margin-top:10px"><div class="row sb"><span><b>${esc(cust.name)}</b> has <b>${cust.points||0}</b> points (1 point = ${money(1)})</span><form data-f="redeem" class="row"><input name="n" type="number" min="0" max="${maxRed}" value="${o.redeem||0}" style="width:90px" aria-label="Points to redeem"><button class="btn sm">Redeem (max ${maxRed})</button></form></div></div>`:""}
  <div class="chips" style="margin-top:12px" role="group" aria-label="Payment mode">${["Cash","Card","UPI"].map(m=>`<button data-a="pmode" data-m="${m}" aria-pressed="${P.mode===m}">${m}</button>`).join("")}</div>
  <form data-f="pay" class="grid g2"><label class="f">${P.mode==="Cash"?"Amount handed over":"Amount"}<input name="amt" id="payamt" type="number" step="0.01" min="0.01" value="${due>0?due:""}" required></label>
   ${P.mode==="Cash"?"":`<label class="f">${P.mode==="Card"?"Card slip / last 4 digits":"UPI transaction reference"}<input name="ref" maxlength="30" ${P.mode==="UPI"?'placeholder="12-digit UTR"':""}></label>`}
   ${P.mode==="UPI"?`<p class="muted" style="grid-column:1/-1;margin:0">Customer pays <b>${money(due)}</b> to <span class="mono">${esc(cfg().upi)}</span>. Confirm only after the payment shows on your phone or bank app.</p>`:""}
   <div class="row" style="grid-column:1/-1"><button class="btn pri"${due>0?"":" disabled"}>Add ${P.mode} payment</button>
   <label class="row" style="gap:6px"><span class="muted">Split equally among</span><input id="splitn" type="number" min="2" max="12" value="${P.n||2}" style="width:64px" data-i="splitn"></label><button type="button" class="btn" data-a="fillShare">Fill one share</button><button type="button" class="btn" data-a="splitItems">Split by items</button></div></form>
  ${P.split?`<div class="card" style="margin-top:10px"><b>Split by items</b><p class="muted" style="margin:2px 0 8px">Assign each item to a guest. Each guest's share includes their part of tax and discount.</p>
   ${lines.map(l=>`<div class="row sb" style="padding:3px 0"><span>${esc(l.name)} ×${l.qty}</span><select data-c="assign" data-id="${l.id}" aria-label="Guest for ${esc(l.name)}">${[1,2,3,4].map(g=>`<option value="${g}"${(P.assign[l.id]||1)===g?" selected":""}>Guest ${g}</option>`).join("")}</select></div>`).join("")}
   <div class="row" style="margin-top:8px">${guests.map((g,i)=>g>0.5?`<button class="btn sm" data-a="takeShare" data-g="${i}">Guest ${i+1}: ${money(Math.round(g))}</button>`:"").join("")}</div></div>`:""}
  ${(o.pay||[]).length?`<h3 style="margin:14px 0 6px">Payments taken</h3>${o.pay.map(p=>`<div class="row sb"><span>${p.mode}${p.ref?" · "+esc(p.ref):""} · ${hhmm(p.at)}</span><b class="num">${money(p.amt)}</b></div>`).join("")}`:""}`;
}
A.payOpen=()=>{UI.pay={id:UI.cart.id,mode:"Cash",assign:{},n:2,split:false};paintPay()};
function paintPay(){UI.modal={kind:"pay",wide:false,live:false,html:payHTML()};paintModal()}
A.pmode=d=>{UI.pay.mode=d.m;paintPay()};
CH.assign=el=>{UI.pay.assign[el.dataset.id]=+el.value;paintPay()};
A.splitItems=()=>{UI.pay.split=!UI.pay.split;paintPay()};
INP.splitn=el=>{UI.pay.n=Math.max(2,+el.value||2)};
A.fillShare=()=>{const o=S.orders[UI.pay.id],due=r2(payableOf(o)-paidOf(o));const n=Math.max(2,+$("#splitn").value||2);const share=Math.min(due,Math.ceil(payableOf(o)/n));paintPay();$("#payamt").value=share};
A.takeShare=d=>{const o=S.orders[UI.pay.id],lines=o.lines.filter(l=>!l.void),sub=o.bill.sub||1;let g=0;lines.forEach(l=>{if((UI.pay.assign[l.id]||1)-1===+d.g)g+=l.price*l.qty/sub*payableOf(o)});const due=r2(payableOf(o)-paidOf(o));paintPay();$("#payamt").value=Math.min(due,Math.round(g))};
F.redeem=f=>{const o=S.orders[UI.pay.id],c=S.customers[o.cust],max=Math.min(c.points||0,Math.floor(o.bill.total*cfg().loyalty.maxPct/100));o.redeem=Math.min(max,Math.max(0,Math.floor(+f.n.value||0)));ev(o,"Redeem "+o.redeem+" points");commit("orders/"+o.id,o);paintPay()};
F.pay=f=>{
  const o=S.orders[UI.pay.id],due=r2(payableOf(o)-paidOf(o)),given=+f.amt.value;if(!(given>0))return;
  const amt=UI.pay.mode==="Cash"?Math.min(given,due):Math.min(given,due),change=r2(given-amt);
  o.pay.push({mode:UI.pay.mode,amt:r2(amt),ref:f.ref?f.ref.value.trim():"",at:Date.now(),by:UI.user.name});ev(o,UI.pay.mode+" "+money(amt)+" received");
  if(r2(payableOf(o)-paidOf(o))<=0.5)finishPay(o,change);else{commit("orders/"+o.id,o);toast("Received "+money(amt)+". Balance "+money(r2(payableOf(o)-paidOf(o))));paintPay()}
};
function finishPay(o,change){
  o.status="paid";o.paidAt=Date.now();const per=cfg().loyalty.per||10;
  if(o.cust&&S.customers[o.cust]){const c=S.customers[o.cust];o.earned=Math.floor(o.bill.total/per);c.points=Math.max(0,(c.points||0)-(o.redeem||0))+o.earned;c.visits=(c.visits||0)+1;c.spend=(c.spend||0)+o.bill.total;c.last=Date.now();commit("customers/"+c.id,c)}
  ev(o,"Paid in full");commit("orders/"+o.id,o);
  toast("Payment complete"+(change>0?". Return change "+money(change):"")+(o.earned?". "+o.earned+" points earned":""));
  UI.fb={id:o.id,r:0};setModal("fb",fbHTML());
}
const fbHTML=()=>`<h2>How was it?</h2><p class="muted">Optional guest feedback for this visit.</p><div class="row" role="radiogroup" aria-label="Rating">${[1,2,3,4,5].map(n=>`<button class="star${UI.fb.r>=n?" on":""}" data-a="star" data-n="${n}" aria-label="${n} star${n>1?"s":""}">★</button>`).join("")}</div>
 <form data-f="fb" class="grid"><label class="f">Comment<input name="c" maxlength="120" placeholder="Optional"></label><div class="row"><button class="btn pri"${UI.fb.r?"":" disabled"}>Save feedback</button><button type="button" class="btn" data-a="skipFb">Skip</button></div></form>`;
A.star=d=>{UI.fb.r=+d.n;setModal("fb",fbHTML())};
F.fb=f=>{const o=S.orders[UI.fb.id];o.feedback={r:UI.fb.r,c:f.c.value.trim(),at:Date.now()};commit("orders/"+o.id,o);closeModal();toast("Thanks. Feedback saved.")};
A.skipFb=()=>closeModal();
/* customer pick */
A.custPick=()=>{UI.cust="";setModal("cust",custHTML())};
function custHTML(){
  const q=UI.cust.toLowerCase(),list=Object.values(S.customers).filter(c=>!q||c.name.toLowerCase().includes(q)||(c.phone||"").includes(q)).slice(0,6);
  return `<h2>Add customer to bill</h2><label class="f">Search name or phone<input id="csearch" data-i="csearch" value="${esc(UI.cust)}" autocomplete="off"></label>
  <div style="margin:8px 0">${list.map(c=>`<button class="pickb" style="width:100%;margin-bottom:6px" data-a="useCust" data-id="${c.id}"><b>${esc(c.name)}</b> <span class="muted">${esc(c.phone||"")} · ${c.points||0} pts</span></button>`).join("")||`<p class="muted">No match. Add a new customer below.</p>`}</div>
  <form data-f="qcust" class="grid g2"><label class="f">Name<input name="n" required maxlength="40"></label><label class="f">Mobile<input name="p" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" title="10-digit mobile number" required></label>
  <label class="row" style="grid-column:1/-1"><input type="checkbox" name="cons"> Customer agrees to receive offers by SMS or WhatsApp</label>
  <div class="row" style="grid-column:1/-1"><button class="btn pri">Save and attach</button><button type="button" class="btn" data-a="backOrder">Back</button></div></form>`;
}
INP.csearch=el=>{UI.cust=el.value;const html=custHTML();UI.modal.html=html;const pos=el.selectionStart;paintModal();const n=$("#csearch");n.focus();n.setSelectionRange(pos,pos)};
A.useCust=d=>{const o=S.orders[UI.cart.id];o.cust=d.id;ev(o,"Customer attached");commit("orders/"+o.id,o);paintOrder()};
F.qcust=f=>{const c={id:uid("c"),name:f.n.value.trim(),phone:f.p.value,consent:f.cons.checked,points:0,visits:0,spend:0,since:Date.now()};
  if(Object.values(S.customers).some(x=>x.phone===c.phone)){toast("This mobile number already exists. Search for it.");return}
  commit("customers/"+c.id,c);A.useCust({id:c.id})};/* ---------- kitchen display ---------- */
const liveOrders=()=>Object.values(S.orders).filter(o=>o.outlet===UI.outlet&&!["paid","cancelled","rejected","online_new"].includes(o.status));
const ref=o=>o.type==="dine"?"Table "+o.table:(o.source!=="POS"?o.source+" ":"")+"Token "+o.token;
V.kitchen=()=>{
  const ks=[];liveOrders().forEach(o=>o.kots.forEach((k,i)=>{if(k.st!=="served")ks.push({o,k,i})}));
  const stations=["All",...new Set(menu().items.map(i=>i.station))];
  const f=ks.filter(x=>UI.station==="All"||x.k.station===UI.station).sort((a,b)=>a.k.at-b.k.at);
  const col=(st,label)=>{const L=f.filter(x=>x.k.st===st);return `<div><h3 style="margin-bottom:8px">${label} <span class="pill mut">${L.length}</span></h3>${L.map(({o,k,i})=>{const m=mins(k.at);return `<div class="kcard${st==="ready"?" rd":m>=15?" late":""}"><div class="row sb"><b>${esc(ref(o))}</b><span class="pill ${m>=15&&st!=="ready"?"bad":"mut"}">${m} min</span></div><div class="muted">KOT ${k.no} · ${esc(k.station)}</div>
   <div style="margin:6px 0">${k.lines.map(l=>`<div><b>${l.qty} ×</b> ${esc(l.name)}${l.adds&&l.adds.length?`<span class="muted"> + ${esc(l.adds.join(", "))}</span>`:""}${l.note?`<div style="color:var(--bad);font-weight:600">${esc(l.note)}</div>`:""}</div>`).join("")}</div>
   <button class="btn sm ${st==="ready"?"":"pri"}" data-a="kstep" data-o="${o.id}" data-i="${i}">${st==="new"?"Start cooking":st==="prep"?"Mark ready":"Served"}</button></div>`}).join("")||`<p class="muted">Nothing here.</p>`}</div>`};
  const comb={};f.filter(x=>x.k.st!=="ready").forEach(x=>x.k.lines.forEach(l=>comb[l.name]=(comb[l.name]||0)+l.qty));
  return `<div class="row sb"><div><h2>Kitchen display · ${esc(outlet().name)}</h2><p class="muted" style="margin:2px 0 0">Orders appear the moment a KOT is sent. Red means waiting 15 minutes or more.</p></div>
  <div class="row"><button class="btn" data-a="combine" aria-pressed="${UI.combine}">${UI.combine?"Show tickets":"Combine items"}</button><button class="btn" data-a="tokens">Token screen</button></div></div>
  <div class="chips">${stations.map(s=>`<button data-a="station" data-s="${esc(s)}" aria-pressed="${UI.station===s}">${esc(s)}</button>`).join("")}</div>
  ${UI.combine?`<div class="card"><h3>Items to cook now</h3><div class="grid g3" style="margin-top:8px">${Object.entries(comb).sort((a,b)=>b[1]-a[1]).map(([n,q])=>`<div class="card kpi"><span>${esc(n)}</span><b>${q}</b></div>`).join("")||'<p class="muted">Nothing to cook.</p>'}</div></div>`:`<div class="kds">${col("new","New")}${col("prep","Preparing")}${col("ready","Ready")}</div>`}`;
};
A.station=d=>{UI.station=d.s;render()};A.combine=()=>{UI.combine=!UI.combine;render()};
A.kstep=d=>{const o=S.orders[d.o],k=o.kots[+d.i];k.st=k.st==="new"?"prep":k.st==="prep"?"ready":"served";ev(o,"KOT "+k.no+" "+k.station+" → "+k.st);commit("orders/"+o.id,o);render()};
A.tokens=()=>{setModal("tok",tokHTML(),true,true)};
const tokHTML=()=>{const os=Object.values(S.orders).filter(o=>o.outlet===UI.outlet&&o.type!=="dine"&&o.token&&["open","billed","accepted","ready"].includes(o.status)&&sameDay(o.created,Date.now()));
  const isR=o=>o.kots.length&&o.kots.every(k=>["ready","served"].includes(k.st));const prep=os.filter(o=>!isR(o)),rdy=os.filter(isR);
  const col=(t,L,c)=>`<div><h2 style="color:${c}">${t}</h2><div class="row" style="margin-top:10px">${L.map(o=>`<span class="tok">${o.token}</span>`).join("")||'<span class="muted">None</span>'}</div></div>`;
  return `<div class="row sb"><h2>Order status · ${esc(outlet().name)}</h2><button class="btn sm" data-a="closeTop">Close</button></div><div class="grid g2" style="margin-top:20px">${col("Preparing",prep,"var(--warn)")}${col("Ready, please collect",rdy,"var(--ok)")}</div>`};
LIVE.tok=()=>{UI.modal.html=tokHTML();paintModal()};

/* ---------- online orders ---------- */
const PL={swiggy:"Swiggy",zomato:"Zomato",website:"Website",qr:"Table QR"};
V.online=()=>{
  const p=cfg().platforms,orders=Object.values(S.orders).filter(o=>o.outlet===UI.outlet&&o.source!=="POS");
  const inc=orders.filter(o=>o.status==="online_new"),act=orders.filter(o=>["accepted","ready","dispatched","open","billed"].includes(o.status)),done=orders.filter(o=>o.status==="paid"||o.status==="rejected").sort((a,b)=>(b.paidAt||b.created)-(a.paidAt||a.created));
  const tabs=[["in","Incoming ("+inc.length+")"],["act","In progress ("+act.length+")"],["done","Completed"],["rec","Payout check"]];
  return `<h2>Online orders · ${esc(outlet().name)}</h2><p class="muted" style="margin:2px 0 10px">Orders from delivery apps, your website and table QR codes arrive in the same system. Online orders need internet.</p>
  <div class="card"><div class="row sb"><div class="row">${Object.keys(PL).map(k=>`<label class="row" style="gap:6px"><span class="sw"><input type="checkbox" data-c="plat" data-k="${k}"${p[k]?" checked":""} aria-label="${PL[k]} open"><span></span></span>${PL[k]}</label>`).join("")}</div>
  <div class="row">${Object.keys(PL).filter(k=>p[k]).map(k=>`<button class="btn sm" data-a="simOnline" data-k="${k}"${Q.offline?" disabled":""}>Simulate ${PL[k]} order</button>`).join("")}</div></div><p class="muted" style="margin:6px 0 0">Switching a channel off stops new orders from it. The simulate buttons create sample orders for testing; a live integration needs partner API access from each platform.</p></div>
  <div class="tabs">${tabs.map(t=>`<button data-a="otab" data-t="${t[0]}" aria-pressed="${UI.otab===t[0]}">${t[1]}</button>`).join("")}</div>
  ${UI.otab==="in"?(inc.map(o=>onlCard(o,true)).join("")||`<div class="card muted">No new online orders. Use a Simulate button to test.</div>`):UI.otab==="act"?(act.map(o=>onlCard(o)).join("")||`<div class="card muted">Nothing in progress.</div>`):UI.otab==="done"?`<div class="card scroll-x"><table class="tbl"><tr><th>When</th><th>Source</th><th>Order</th><th>Status</th><th class="r">Amount</th></tr>${done.map(o=>`<tr><td>${hhmm(o.paidAt||o.created)}</td><td>${PL[o.source.toLowerCase()==="table qr"?"qr":o.source.toLowerCase()]||o.source}</td><td>${esc(o.ref||ref(o))}</td><td>${o.status==="paid"?"Delivered":"Rejected: "+esc((o.cancel||{}).reason||"")}</td><td class="r num">${money((o.bill||calc(o)).total)}</td></tr>`).join("")||'<tr><td colspan="5" class="muted">None yet.</td></tr>'}</table></div>`:reconHTML()}`;
};
function onlCard(o,isNew){
  const c=calc(o),next={accepted:["Mark ready","ready"],ready:["Dispatched","dispatched"],dispatched:["Delivered","delivered"]}[o.status];
  return `<div class="card" style="margin-bottom:10px"><div class="row sb"><div><b>${esc(o.source)}</b> <span class="mono">${esc(o.ref||"")}</span> · ${esc(o.custName||"")} <span class="pill mut">${mins(o.created)} min ago</span></div><b class="num">${money(c.total)}</b></div>
  <div class="muted" style="margin:6px 0">${o.lines.map(l=>l.qty+" × "+esc(l.name)).join(", ")}${o.type==="dine"?" · Table "+o.table:""}</div>
  <div class="row">${isNew?`<button class="btn pri" data-a="accept" data-id="${o.id}">Accept and send to kitchen</button><select id="rr${o.id}" aria-label="Rejection reason"><option>Too busy</option><option>Item unavailable</option><option>Closing soon</option></select><button class="btn bad" data-a="reject" data-id="${o.id}">Reject</button>`:
  `<span class="pill">${esc(o.status==="open"?"At table":o.status)}</span>${next?`<button class="btn sec" data-a="ostep" data-id="${o.id}">${next[0]}</button>`:""}`}</div></div>`;
}
CH.plat=el=>{const c=cfg();c.platforms[el.dataset.k]=el.checked;audit("Channel "+(el.checked?"opened":"closed"),PL[el.dataset.k]);commit("config/main",c)};
A.otab=d=>{UI.otab=d.t;render()};
A.simOnline=d=>{
  const k=d.k,its=menu().items.filter(i=>avail(i)&&i.avail?.[k]!==false);if(!its.length){toast("No items are available on this channel.");return}
  const n=1+Math.floor(Math.random()*3),picked=[];while(picked.length<Math.min(n,its.length)){const i=its[Math.floor(Math.random()*its.length)];if(!picked.includes(i))picked.push(i)}
  const names=["Anita","Vikram","Sana","Rohit","Priya","Karthik","Neha","Arjun"];
  const o={id:uid("o"),outlet:UI.outlet,type:k==="qr"?"dine":"delivery",source:PL[k],status:"online_new",lines:picked.map(it=>({id:uid("l"),key:it.id+"||",item:it.id,name:it.name,adds:[],price:it.price,qty:1+Math.floor(Math.random()*2),note:"",station:it.station,gst:it.gst,kot:null})),kots:[],merged:[],disc:{t:"pct",v:0},pay:[],created:Date.now(),by:PL[k],log:[],custName:names[Math.floor(Math.random()*names.length)],ref:({swiggy:"SW",zomato:"ZM",website:"WEB",qr:"QR"})[k]+"-"+(1000+Math.floor(Math.random()*9000)),sim:true};
  if(k==="qr"){const ts=outlet().tables;o.table=ts[Math.floor(Math.random()*ts.length)].id}else o.token=nextTok();
  ev(o,"Received from "+PL[k]);commit("orders/"+o.id,o);toast("New "+PL[k]+" order "+o.ref);UI.otab="in";render();
};
A.accept=d=>{
  const o=S.orders[d.id];
  if(o.type==="dine"){const ex=tableOrder(o.table);if(ex&&ex.id!==o.id){o.lines.forEach(l=>{l.key+="|q";ex.lines.push(l)});ex.log.push({t:Date.now(),u:"QR",act:"QR order merged"});o.status="cancelled";o.cancel={reason:"Merged into table order",by:UI.user.name,at:Date.now()};commit("orders/"+ex.id,ex);commit("orders/"+o.id,o);kotCore(ex);toast("Added to the open order on "+o.table);render();return}o.status="open"}
  else o.status="accepted";
  ev(o,"Accepted by "+UI.user.name);commit("orders/"+o.id,o);const r=kotCore(o);toast("Accepted. KOT "+(r?r.no:"")+" sent to kitchen");UI.otab="act";render();
};
A.reject=d=>{const o=S.orders[d.id],r=$("#rr"+d.id).value;o.status="rejected";o.cancel={reason:r,by:UI.user.name,at:Date.now()};ev(o,"Rejected: "+r);audit("Online order rejected",o.ref+" · "+r);commit("orders/"+o.id,o);render()};
A.ostep=d=>{
  const o=S.orders[d.id];
  if(o.status==="accepted")o.status="ready";else if(o.status==="ready")o.status="dispatched";
  else if(o.status==="dispatched"){const c=calc(o);o.bill=Object.assign(c,{no:o.ref,at:Date.now()});o.pay=[{mode:"Platform: "+o.source,amt:c.total,ref:o.ref,at:Date.now(),by:o.source}];o.status="paid";o.paidAt=Date.now();o.kots.forEach(k=>k.st="served")}
  ev(o,"Status → "+o.status);commit("orders/"+o.id,o);render();
};
function reconRows(plat){
  const pc=cfg().commission[plat.toLowerCase()]||0,paid=(S.misc.recon||{}).paid||{};
  return Object.values(S.orders).filter(o=>o.outlet===UI.outlet&&o.source===plat&&o.status==="paid").sort((a,b)=>a.paidAt-b.paidAt).map(o=>{const g=o.bill.total,exp=r2(g*(1-pc/100)),got=paid[o.id];return {o,g,pc,exp,got,st:got==null?"Not received":Math.abs(got-exp)<1?"Matched":got<exp?"Short":"Excess"}});
}
function reconHTML(){
  const out=["Swiggy","Zomato"].map(pl=>{const R=reconRows(pl),tot=R.reduce((a,x)=>a+x.exp,0),got=R.reduce((a,x)=>a+(x.got||0),0),bad=R.filter(x=>x.st!=="Matched").length;
   return `<div class="card" style="margin-bottom:12px"><div class="row sb"><h3>${pl}</h3><div class="row"><span class="pill ${bad?"warn":"ok"}">${R.length?(bad?bad+" to check":"All matched"):"No delivered orders"}</span><button class="btn sm" data-a="sampleRecon" data-p="${pl}"${R.length?"":" disabled"}>Fill from sample payout file</button></div></div>
   ${R.length?`<div class="scroll-x"><table class="tbl"><tr><th>Order</th><th class="r">Bill</th><th class="r">Fee ${R[0].pc}%</th><th class="r">Expected</th><th class="r">Platform paid</th><th>Status</th></tr>${R.map(x=>`<tr><td>${esc(x.o.ref)}</td><td class="r num">${money(x.g)}</td><td class="r num">−${money(r2(x.g-x.exp))}</td><td class="r num">${money(x.exp)}</td><td class="r"><input type="number" step="0.01" min="0" style="width:96px;text-align:right" data-c="recv" data-id="${x.o.id}" value="${x.got==null?"":x.got}" aria-label="Amount paid for ${esc(x.o.ref)}"></td><td><span class="pill ${x.st==="Matched"?"ok":x.st==="Not received"?"bad":"warn"}">${x.st}</span></td></tr>`).join("")}
   <tr><th colspan="3">Total</th><th class="r num">${money(r2(tot))}</th><th class="r num">${money(r2(got))}</th><th>${money(r2(got-tot))}</th></tr></table></div>`:`<p class="muted">Deliver an order from the In progress tab and it appears here.</p>`}</div>`}).join("");
  return `<p class="muted">Compare what each platform should pay (bill value minus its fee) with what it actually paid. Fee rates are set in Settings; the rates shown are placeholders, so enter your contract rates.</p>${out}`;
}
CH.recv=el=>{const r=S.misc.recon||(S.misc.recon={paid:{}});r.paid=r.paid||{};if(el.value==="")delete r.paid[el.dataset.id];else r.paid[el.dataset.id]=r2(+el.value);commit("misc/recon",r)};
A.sampleRecon=d=>{const R=reconRows(d.p),r=S.misc.recon||(S.misc.recon={paid:{}});r.paid=r.paid||{};R.forEach((x,i)=>{if(i%5===3)r.paid[x.o.id]=r2(x.exp-x.g*0.04);else if(i%7===6)delete r.paid[x.o.id];else r.paid[x.o.id]=x.exp});commit("misc/recon",r);toast("Sample payout loaded. Short or missing payments are flagged.")};

/* ---------- menu manager ---------- */
V.menu=()=>{
  const m=menu(),ed=can("menu");
  const sw=(it,k,on)=>`<label class="sw"><input type="checkbox" data-c="av" data-id="${it.id}" data-k="${k}"${on?" checked":""} aria-label="${esc(it.name)} on ${k}"><span></span></label>`;
  return `<div class="row sb"><div><h2>Menu</h2><p class="muted" style="margin:2px 0 0">One central menu for every outlet and channel. Switch "Here" off to mark a dish sold out at ${esc(outlet().name)} only.</p></div><div class="row"><button class="btn" data-a="addCat">Add category</button><button class="btn pri" data-a="editItem" data-id="">Add dish</button></div></div>
  ${m.cats.map(ct=>{const L=m.items.filter(i=>i.cat===ct);return `<div class="card scroll-x" style="margin-top:12px"><h3>${esc(ct)}</h3><table class="tbl"><tr><th>Dish</th><th class="r">Price</th><th>GST</th><th>Station</th><th>Here</th><th>Swiggy</th><th>Zomato</th><th>Website</th><th></th></tr>
  ${L.map(i=>`<tr><td><i class="veg${i.veg?"":" nv"}"></i>${esc(i.name)}${i.variants.length>1?` <span class="muted">${i.variants.length} sizes</span>`:""}${i.addons.length?` <span class="muted">${i.addons.length} add-ons</span>`:""}</td><td class="r num">${money(i.price)}</td><td>${i.gst}%</td><td>${esc(i.station)}</td><td>${sw(i,"here",!(i.off||[]).includes(UI.outlet))}</td><td>${sw(i,"swiggy",i.avail?.swiggy!==false)}</td><td>${sw(i,"zomato",i.avail?.zomato!==false)}</td><td>${sw(i,"website",i.avail?.website!==false)}</td><td><button class="btn sm" data-a="editItem" data-id="${i.id}">Edit</button></td></tr>`).join("")||'<tr><td colspan="9" class="muted">No dishes in this category.</td></tr>'}</table></div>`}).join("")}`;
};
CH.av=el=>{const m=menu(),it=m.items.find(i=>i.id===el.dataset.id),k=el.dataset.k;
  if(k==="here"){it.off=it.off||[];const i=it.off.indexOf(UI.outlet);el.checked?(i>=0&&it.off.splice(i,1)):(i<0&&it.off.push(UI.outlet))}
  else{it.avail=it.avail||{};it.avail[k]=el.checked}
  audit("Availability",it.name+" · "+k+" · "+(el.checked?"on":"off"));commit("config/menu",m)};
A.addCat=()=>setModal("cat",`<h2>New category</h2><form data-f="cat" class="grid"><label class="f">Name<input name="n" required maxlength="30"></label><div class="row"><button class="btn pri">Add</button><button type="button" class="btn" data-a="closeTop">Cancel</button></div></form>`);
F.cat=f=>{const m=menu(),n=f.n.value.trim();if(!m.cats.includes(n))m.cats.push(n);commit("config/menu",m);closeModal()};
A.editItem=d=>{
  const m=menu(),it=d.id?m.items.find(i=>i.id===d.id):{name:"",cat:m.cats[0],price:100,gst:5,veg:true,station:"Kitchen",variants:[],addons:[],recipe:[]};UI.editId=d.id||"";
  const rec=[...it.recipe,{i:"",q:""},{i:"",q:""}].slice(0,Math.max(4,it.recipe.length+1));
  setModal("item",`<h2>${d.id?"Edit dish":"Add dish"}</h2><form data-f="item" class="grid g2">
  <label class="f">Name<input name="n" value="${esc(it.name)}" required maxlength="40"></label><label class="f">Category<select name="c">${m.cats.map(c=>`<option${c===it.cat?" selected":""}>${esc(c)}</option>`).join("")}</select></label>
  <label class="f">Price (₹)<input name="p" type="number" min="0" step="0.5" value="${it.price}" required></label><label class="f">GST<select name="g">${[0,5,12,18].map(g=>`<option${g===it.gst?" selected":""}>${g}</option>`).join("")}</select></label>
  <label class="f">Kitchen station<select name="s">${["Kitchen","Bar","Dessert"].map(s=>`<option${s===it.station?" selected":""}>${s}</option>`).join("")}</select></label><label class="row"><input type="checkbox" name="v"${it.veg?" checked":""}> Vegetarian</label>
  <label class="f" style="grid-column:1/-1">Sizes (one per line, as Name:extra price). First line is the base size.<textarea name="vr" rows="3" placeholder="Regular:0&#10;Large:70">${esc(it.variants.map(v=>v.n+":"+v.p).join("\n"))}</textarea></label>
  <label class="f" style="grid-column:1/-1">Add-ons (one per line, as Name:price)<textarea name="ar" rows="2" placeholder="Extra cheese:30">${esc(it.addons.map(v=>v.n+":"+v.p).join("\n"))}</textarea></label>
  <div style="grid-column:1/-1"><b>Recipe per serving</b> <span class="muted">(stock is deducted when the KOT is sent)</span>${rec.map((r,k)=>`<div class="row" style="margin-top:6px"><select name="ri${k}" aria-label="Ingredient ${k+1}"><option value="">None</option>${ings().items.map(x=>`<option value="${x.id}"${x.id===r.i?" selected":""}>${esc(x.name)} (${x.unit})</option>`).join("")}</select><input name="rq${k}" type="number" min="0" step="0.001" value="${r.q}" style="width:100px" aria-label="Quantity ${k+1}"></div>`).join("")}</div>
  <div class="row" style="grid-column:1/-1"><button class="btn pri">Save</button>${d.id?`<button type="button" class="btn bad" data-a="delItem">Delete dish</button>`:""}<button type="button" class="btn" data-a="closeTop">Cancel</button></div></form>`);
};
F.item=f=>{
  const m=menu(),parse=t=>t.split("\n").map(x=>x.trim()).filter(Boolean).map(x=>{const [n,p]=x.split(":");return{n:n.trim(),p:Math.max(0,+p||0)}});
  const rec=[];for(let k=0;k<12&&f["ri"+k];k++){const i=f["ri"+k].value,q=+f["rq"+k].value;if(i&&q>0)rec.push({i,q})}
  const it=UI.editId?m.items.find(i=>i.id===UI.editId):{id:uid("m"),off:[],avail:{}};
  Object.assign(it,{name:f.n.value.trim(),cat:f.c.value,price:+f.p.value,gst:+f.g.value,station:f.s.value,veg:f.v.checked,variants:parse(f.vr.value),addons:parse(f.ar.value),recipe:rec});
  if(!UI.editId)m.items.push(it);audit(UI.editId?"Dish edited":"Dish added",it.name);commit("config/menu",m);closeModal();toast("Saved "+it.name);
};
A.delItem=()=>{const m=menu(),it=m.items.find(i=>i.id===UI.editId);m.items=m.items.filter(i=>i.id!==UI.editId);audit("Dish deleted",it.name);commit("config/menu",m);closeModal()};

/* ---------- inventory ---------- */
V.stock=()=>{
  const ou=outlet(),sk=stockOf(UI.outlet),low=lowItems(UI.outlet),ing=ings().items;
  const tabs=[["stock","Stock"],["po","Purchase orders"],["waste","Wastage"],["use","Consumption"],["ing","Ingredients"]];
  let body="";
  if(UI.itab==="stock")body=`<div class="card scroll-x"><table class="tbl"><tr><th>Ingredient</th><th class="r">On hand</th><th class="r">Reorder at</th><th>Status</th><th class="r">Value</th><th></th></tr>${ing.map(i=>{const q=sk.qty[i.id]||0,st=q<=0?["Out","bad"]:q<=i.min?["Low","warn"]:["OK","ok"];return `<tr><td>${esc(i.name)}</td><td class="r num">${r2(q)} ${i.unit}</td><td class="r num">${i.min} ${i.unit}</td><td><span class="pill ${st[1]}">${st[0]}</span></td><td class="r num">${money(r2(q*i.cost))}</td><td>${can("stock")?`<button class="btn sm" data-a="adjust" data-id="${i.id}">Count</button>`:""}</td></tr>`}).join("")}</table></div>`;
  if(UI.itab==="po"){const L=UI.dpo||(UI.dpo=[]);const pos=Object.values(S.po).filter(p=>p.outlet===UI.outlet&&p.kind==="supplier").sort((a,b)=>b.at-a.at);
    body=`<div class="card"><h3>New purchase order</h3><form data-f="polines" class="row" style="margin-top:8px"><select name="i" aria-label="Ingredient">${ing.map(i=>`<option value="${i.id}">${esc(i.name)} (${i.unit})</option>`).join("")}</select><input name="q" type="number" min="0.1" step="0.1" placeholder="Qty" required style="width:90px"><button class="btn">Add line</button></form>
    ${L.length?`<table class="tbl" style="margin-top:8px">${L.map((l,k)=>`<tr><td>${esc(ingName(l.i).name)}</td><td class="r num">${l.q} ${ingName(l.i).unit}</td><td class="r num">${money(r2(l.q*(ingName(l.i).cost||0)))}</td><td><button class="btn sm" data-a="polrm" data-k="${k}" aria-label="Remove line">×</button></td></tr>`).join("")}</table>
    <form data-f="pocreate" class="row" style="margin-top:8px"><select name="sup" aria-label="Supplier">${cfg().sup.map(s=>`<option>${esc(s)}</option>`).join("")}</select><button class="btn pri">Create purchase order</button></form>`:`<p class="muted">Add ingredients to order.</p>`}</div>
    <div class="card scroll-x" style="margin-top:12px"><h3>Orders</h3><table class="tbl"><tr><th>Date</th><th>Supplier</th><th>Items</th><th class="r">Est. cost</th><th>Status</th><th></th></tr>${pos.map(p=>`<tr><td>${dstr(p.at)}</td><td>${esc(p.sup)}</td><td>${p.lines.map(l=>esc(ingName(l.i).name)+" "+l.q).join(", ")}</td><td class="r num">${money(r2(p.lines.reduce((a,l)=>a+l.q*(ingName(l.i).cost||0),0)))}</td><td><span class="pill ${p.status==="received"?"ok":"warn"}">${p.status}</span></td><td>${p.status==="open"&&can("po")?`<button class="btn sm" data-a="porecv" data-id="${p.id}">Mark received</button>`:""}</td></tr>`).join("")||'<tr><td colspan="6" class="muted">No purchase orders yet.</td></tr>'}</table></div>`}
  if(UI.itab==="waste")body=`<div class="card"><h3>Record wastage</h3><form data-f="waste" class="row" style="margin-top:8px"><select name="i" aria-label="Ingredient">${ing.map(i=>`<option value="${i.id}">${esc(i.name)}</option>`).join("")}</select><input name="q" type="number" min="0.01" step="0.01" placeholder="Qty" required style="width:90px"><select name="r" aria-label="Reason">${["Spoiled","Dropped","Expired","Staff meal","Other"].map(r=>`<option>${r}</option>`).join("")}</select><button class="btn pri">Record</button></form></div>
   <div class="card scroll-x" style="margin-top:12px"><table class="tbl"><tr><th>When</th><th>Ingredient</th><th class="r">Qty</th><th>Reason</th><th>By</th></tr>${(sk.waste||[]).slice(0,25).map(w=>`<tr><td>${dstr(w.t)} ${hhmm(w.t)}</td><td>${esc(ingName(w.i).name)}</td><td class="r num">${w.q} ${ingName(w.i).unit}</td><td>${esc(w.r)}</td><td>${esc(w.u)}</td></tr>`).join("")||'<tr><td colspan="5" class="muted">No wastage recorded.</td></tr>'}</table></div>`;
  if(UI.itab==="use"){const u=consumption(o=>o.outlet===UI.outlet&&sameDay(o.created,Date.now()));
    body=`<div class="card scroll-x"><h3>Used today (from KOTs sent)</h3><table class="tbl"><tr><th>Ingredient</th><th class="r">Used</th><th class="r">Left</th></tr>${ing.map(i=>`<tr><td>${esc(i.name)}</td><td class="r num">${r2(u[i.id]||0)} ${i.unit}</td><td class="r num">${r2(sk.qty[i.id]||0)} ${i.unit}</td></tr>`).join("")}</table></div>`}
  if(UI.itab==="ing")body=`<div class="card"><h3>Add ingredient</h3><form data-f="ing" class="row" style="margin-top:8px"><input name="n" placeholder="Name" required maxlength="30"><select name="u" aria-label="Unit"><option>kg</option><option>l</option><option>pcs</option></select><input name="m" type="number" min="0" step="0.1" placeholder="Reorder at" required style="width:110px"><input name="c" type="number" min="0" step="0.5" placeholder="Cost per unit" required style="width:130px"><button class="btn pri">Add</button></form><p class="muted">The ingredient list is shared by all outlets. Link ingredients to dishes in each dish's recipe.</p></div>`;
  return `<h2>Inventory · ${esc(ou.name)}</h2>${low.length?`<div class="banner warn" style="margin-top:8px">Low stock: ${low.map(i=>esc(i.name)).join(", ")}</div>`:""}<p class="muted" style="margin:2px 0">Stock reduces automatically using each dish's recipe when its KOT is sent.</p>
  <div class="tabs">${tabs.map(t=>`<button data-a="itab" data-t="${t[0]}" aria-pressed="${UI.itab===t[0]}">${t[1]}</button>`).join("")}</div>${body}`;
};
function consumption(pred){const u={};Object.values(S.orders).filter(pred).forEach(o=>o.lines.forEach(l=>{if(l.kot===null||l.void&&false)return;const it=itemById(l.item);(it?it.recipe:[]).forEach(r=>u[r.i]=(u[r.i]||0)+r.q*l.qty)}));return u}
A.itab=d=>{UI.itab=d.t;render()};
A.adjust=d=>{const i=ingName(d.id);UI.adj=d.id;setModal("adj",`<h2>Stock count: ${esc(i.name)}</h2><form data-f="adj" class="grid"><label class="f">Counted quantity (${i.unit})<input name="q" type="number" min="0" step="0.01" value="${r2(stockOf(UI.outlet).qty[d.id]||0)}" required></label><label class="f">Reason<select name="r"><option>Physical count</option><option>Correction</option><option>Opening stock</option></select></label><div class="row"><button class="btn pri">Save</button><button type="button" class="btn" data-a="closeTop">Cancel</button></div></form>`)};
F.adj=f=>{const sk=stockOf(UI.outlet),old=sk.qty[UI.adj]||0;sk.qty[UI.adj]=r2(+f.q.value);audit("Stock count",ingName(UI.adj).name+": "+old+" → "+sk.qty[UI.adj]+" ("+f.r.value+")");commit("stock/"+UI.outlet,sk);closeModal()};
F.polines=f=>{(UI.dpo=UI.dpo||[]).push({i:f.i.value,q:+f.q.value});render()};
A.polrm=d=>{UI.dpo.splice(+d.k,1);render()};
F.pocreate=f=>{const p={id:uid("p"),outlet:UI.outlet,kind:"supplier",sup:f.sup.value,lines:clone(UI.dpo),status:"open",at:Date.now(),by:UI.user.name};UI.dpo=[];audit("Purchase order",p.sup);commit("po/"+p.id,p);toast("Purchase order created");render()};
A.porecv=d=>{const p=S.po[d.id],sk=stockOf(p.outlet);p.lines.forEach(l=>sk.qty[l.i]=r2((sk.qty[l.i]||0)+l.q));p.status="received";p.rcv=Date.now();audit("PO received",p.sup);commit("po/"+p.id,p);commit("stock/"+p.outlet,sk);toast("Stock updated")};
F.waste=f=>{const sk=stockOf(UI.outlet),q=+f.q.value;sk.qty[f.i.value]=Math.max(0,r2((sk.qty[f.i.value]||0)-q));(sk.waste=sk.waste||[]).unshift({t:Date.now(),i:f.i.value,q,r:f.r.value,u:UI.user.name});sk.waste.length=Math.min(sk.waste.length,60);audit("Wastage",ingName(f.i.value).name+" "+q);commit("stock/"+UI.outlet,sk);f.q.value=""};
F.ing=f=>{const g=ings();g.items.push({id:uid("g"),name:f.n.value.trim(),unit:f.u.value,min:+f.m.value,cost:+f.c.value});commit("config/ing",g);f.reset();toast("Ingredient added")};/* ---------- customers ---------- */
V.crm=()=>{
  const tabs=[["list","Customers"],["camp","Offers"],["fb","Feedback"]],T=UI.ctab;let body="";
  const cs=Object.values(S.customers).sort((a,b)=>(b.spend||0)-(a.spend||0));
  if(T==="list"){const q=(UI.cq||"").toLowerCase(),L=cs.filter(c=>!q||c.name.toLowerCase().includes(q)||(c.phone||"").includes(q));
    body=`<div class="row sb" style="margin-bottom:10px"><input type="search" data-c="cq" value="${esc(UI.cq||"")}" placeholder="Search name or mobile, then press Enter" aria-label="Search customers" style="flex:1;min-width:200px"><button class="btn pri" data-a="newCust">Add customer</button></div>
    <div class="card scroll-x"><table class="tbl"><tr><th>Name</th><th>Mobile</th><th class="r">Points</th><th class="r">Visits</th><th class="r">Spent</th><th>Offers</th><th>Last visit</th></tr>${L.map(c=>`<tr><td>${esc(c.name)}${c.sample?' <span class="pill mut">sample</span>':""}</td><td class="mono">${esc(c.phone||"")}</td><td class="r num">${c.points||0}</td><td class="r num">${c.visits||0}</td><td class="r num">${money(c.spend||0)}</td><td>${c.consent?'<span class="pill ok">Agreed</span>':'<span class="pill mut">No consent</span>'}</td><td>${c.last?dstr(c.last):"-"}</td></tr>`).join("")||'<tr><td colspan="7" class="muted">No customers yet. Add one here or attach one while billing.</td></tr>'}</table></div>
    <p class="muted">Loyalty: ${cfg().loyalty.per>0?"1 point for every "+money(cfg().loyalty.per)+" spent":""}; 1 point is worth ${money(1)} and can cover up to ${cfg().loyalty.maxPct}% of a bill.</p>`}
  if(T==="camp"){const aud=UI.aud||"all",list=audience(aud);const log=(S.misc.msgs||{log:[]}).log;
    body=`<div class="card"><h3>Send an offer</h3><form data-f="camp" class="grid g2" style="margin-top:8px"><label class="f">Who<select name="aud" data-c="aud"><option value="all"${aud==="all"?" selected":""}>All customers who agreed</option><option value="lapsed"${aud==="lapsed"?" selected":""}>Not visited in 30 days</option><option value="top"${aud==="top"?" selected":""}>Top 5 by spend</option></select></label>
    <label class="f">Channel<select name="ch"><option>SMS</option><option>WhatsApp</option></select></label>
    <label class="f" style="grid-column:1/-1">Message (use {name})<textarea name="m" rows="3" maxlength="300">Hi {name}, enjoy a free dessert on your next visit this week at ${esc(cfg().bill.name)}. Show this message at billing.</textarea></label>
    <div class="row" style="grid-column:1/-1"><button class="btn pri"${list.length?"":" disabled"}>Queue for ${list.length} customer${list.length===1?"":"s"}</button><span class="muted">Only customers who agreed to offers are included. This demo records the campaign; it does not send real messages.</span></div></form></div>
    <div class="card scroll-x" style="margin-top:12px"><h3>Sent log</h3><table class="tbl"><tr><th>When</th><th>Channel</th><th>Audience</th><th class="r">Count</th><th>Message</th></tr>${log.map(l=>`<tr><td>${dstr(l.t)} ${hhmm(l.t)}</td><td>${l.ch}</td><td>${esc(l.aud)}</td><td class="r">${l.n}</td><td>${esc(l.m)}</td></tr>`).join("")||'<tr><td colspan="5" class="muted">No offers queued yet.</td></tr>'}</table></div>`}
  if(T==="fb"){const F2=Object.values(S.orders).filter(o=>o.feedback&&(UI.scope==="all"||o.outlet===UI.outlet)).sort((a,b)=>b.feedback.at-a.feedback.at);const avg=F2.length?F2.reduce((a,o)=>a+o.feedback.r,0)/F2.length:0;
    body=`<div class="grid g3"><div class="card kpi"><span>Average rating</span><b>${F2.length?avg.toFixed(1)+" / 5":"-"}</b></div><div class="card kpi"><span>Responses</span><b>${F2.length}</b></div><div class="card kpi"><span>Low ratings (1-2)</span><b>${F2.filter(o=>o.feedback.r<=2).length}</b></div></div>
    <div class="card scroll-x" style="margin-top:12px"><table class="tbl"><tr><th>When</th><th>Order</th><th>Rating</th><th>Comment</th></tr>${F2.map(o=>`<tr><td>${dstr(o.feedback.at)}</td><td>${esc(ref(o))}</td><td><span class="pill ${o.feedback.r<=2?"bad":o.feedback.r===3?"warn":"ok"}">${"★".repeat(o.feedback.r)}</span></td><td>${esc(o.feedback.c)}</td></tr>`).join("")||'<tr><td colspan="4" class="muted">Feedback appears here after guests rate their visit at payment.</td></tr>'}</table></div>`}
  return `<h2>Customers and loyalty</h2><div class="tabs">${tabs.map(t=>`<button data-a="ctab" data-t="${t[0]}" aria-pressed="${T===t[0]}">${t[1]}</button>`).join("")}</div>${body}`;
};
function audience(a){const cs=Object.values(S.customers).filter(c=>c.consent);if(a==="lapsed")return cs.filter(c=>!c.last||Date.now()-c.last>30*864e5);if(a==="top")return cs.sort((x,y)=>(y.spend||0)-(x.spend||0)).slice(0,5);return cs}
A.ctab=d=>{UI.ctab=d.t;render()};CH.cq=el=>{UI.cq=el.value;render()};CH.aud=el=>{UI.aud=el.value;render()};
A.newCust=()=>setModal("nc",`<h2>Add customer</h2><form data-f="nc" class="grid"><label class="f">Name<input name="n" required maxlength="40"></label><label class="f">Mobile<input name="p" inputmode="numeric" maxlength="10" pattern="[0-9]{10}" title="10-digit mobile number" required></label><label class="row"><input type="checkbox" name="cons"> Customer agrees to receive offers by SMS or WhatsApp</label><div class="row"><button class="btn pri">Save</button><button type="button" class="btn" data-a="closeTop">Cancel</button></div></form>`);
F.nc=f=>{if(Object.values(S.customers).some(x=>x.phone===f.p.value)){toast("This mobile number already exists.");return}const c={id:uid("c"),name:f.n.value.trim(),phone:f.p.value,consent:f.cons.checked,points:0,visits:0,spend:0,since:Date.now()};commit("customers/"+c.id,c);closeModal()};
F.camp=f=>{const L=audience(f.aud.value);const m=S.misc.msgs||(S.misc.msgs={log:[]});m.log.unshift({t:Date.now(),ch:f.ch.value,aud:f.aud.selectedOptions[0].text,n:L.length,m:f.m.value.replace("{name}","[name]")});m.log.length=Math.min(m.log.length,30);audit("Offer queued",f.ch.value+" to "+L.length);commit("misc/msgs",m);toast("Queued for "+L.length+" customers (demo: nothing is actually sent)")};

/* ---------- reports ---------- */
const inRange=t=>UI.range==="all"||(UI.range==="today"?sameDay(t,Date.now()):Date.now()-t<7*864e5);
function repData(){
  const scope=can("reports")?UI.scope:"cur",dayOnly=!can("reports");
  const rg=dayOnly?(t=>sameDay(t,Date.now())):inRange;
  const mine=Object.values(S.orders).filter(o=>(scope==="all"||o.outlet===UI.outlet));
  const sales=mine.filter(o=>isSale(o)&&rg(o.paidAt));
  const cancels=mine.filter(o=>(o.status==="cancelled"&&o.cancel&&!/^Merged/.test(o.cancel.reason)||o.status==="rejected")&&rg(o.cancel?o.cancel.at:o.created));
  const revs=mine.filter(o=>o.reversal&&rg(o.reversal.at));
  return {sales,cancels,revs,scope,dayOnly};
}
V.reports=()=>{
  const D=repData(),sales=D.sales,tabs=D.dayOnly?[["day","Day-end"]]:[["day","Day-end"],["items","Items"],["pay","Payments and tax"],["reg","Discounts and cancels"],["use","Stock use"],["exp","Export"]];
  if(D.dayOnly)UI.rtab="day";
  const T=UI.rtab;let body="";
  const tot=sales.reduce((a,o)=>a+o.bill.total,0),disc=sales.reduce((a,o)=>a+o.bill.disc,0),tax=sales.reduce((a,o)=>a+o.bill.tax,0);
  if(T==="day"){
    const byH={};sales.forEach(o=>{const h=new Date(o.paidAt).getHours();byH[h]=(byH[h]||0)+o.bill.total});
    const hs=Object.keys(byH).map(Number),lo=Math.min(10,...(hs.length?hs:[10])),hi=Math.max(21,...(hs.length?hs:[21])),mx=Math.max(1,...Object.values(byH));
    const W=Math.max(520,(hi-lo+1)*44),bars=[];for(let h=lo;h<=hi;h++){const v=byH[h]||0,bh=Math.round(v/mx*130),x=(h-lo)*44+8;bars.push(`<rect x="${x}" y="${150-bh}" width="30" height="${bh}" rx="3" fill="var(--accent)"><title>${h}:00  ${money(v)}</title></rect><text x="${x+15}" y="168" text-anchor="middle" font-size="11" fill="var(--muted)">${h%12||12}${h<12?"a":"p"}</text>${v?`<text x="${x+15}" y="${144-bh}" text-anchor="middle" font-size="10" fill="var(--ink)">${v>=1000?(v/1000).toFixed(1)+"k":Math.round(v)}</text>`:""}`)}
    const modes={};sales.forEach(o=>o.pay.forEach(p=>modes[p.mode]=(modes[p.mode]||0)+p.amt));const ch={};sales.forEach(o=>{const k=o.type==="dine"?"Dine-in":o.source==="POS"?"Takeaway":o.source;ch[k]=(ch[k]||0)+o.bill.total});
    const bl=(obj)=>Object.entries(obj).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<div class="row sb" style="padding:4px 0"><span>${esc(k)}</span><span class="num"><b>${money(r2(v))}</b></span></div><div class="bar"><i style="width:${tot?Math.round(v/tot*100):0}%"></i></div>`).join("")||'<p class="muted">No sales yet.</p>';
    body=`<div class="grid g4"><div class="card kpi"><span>Total sales</span><b class="num">${money(tot)}</b></div><div class="card kpi"><span>Bills</span><b class="num">${sales.length}</b></div><div class="card kpi"><span>Average bill</span><b class="num">${money(sales.length?Math.round(tot/sales.length):0)}</b></div><div class="card kpi"><span>Discounts given</span><b class="num">${money(r2(disc))}</b></div><div class="card kpi"><span>GST collected</span><b class="num">${money(r2(tax))}</b></div><div class="card kpi"><span>Cancelled orders</span><b class="num">${D.cancels.length}</b></div><div class="card kpi"><span>Bills reversed</span><b class="num">${D.revs.length}</b></div></div>
    <div class="card" style="margin-top:12px"><h3>Sales by hour</h3><div class="scroll-x"><svg viewBox="0 0 ${W} 178" width="${W}" height="178" role="img" aria-label="Sales by hour of day" style="max-width:none">${bars.join("")}<line x1="0" y1="150" x2="${W}" y2="150" stroke="var(--line)"/></svg></div></div>
    <div class="grid g2" style="margin-top:12px"><div class="card"><h3>By payment mode</h3>${bl(modes)}</div><div class="card"><h3>By channel</h3>${bl(ch)}</div></div>
    ${sales.length?"":`<p class="muted" style="margin-top:12px">No paid bills in this period. ${can("admin")?"Load a sample day under Settings > Data to preview these reports.":""}</p>`}`;
  }
  if(T==="items"){const it={};sales.forEach(o=>o.lines.filter(l=>!l.void).forEach(l=>{const x=it[l.name]||(it[l.name]={q:0,v:0});x.q+=l.qty;x.v+=l.price*l.qty}));const L=Object.entries(it).sort((a,b)=>b[1].v-a[1].v),mx=L.length?L[0][1].v:1;
    body=`<div class="card scroll-x"><table class="tbl"><tr><th>Dish</th><th class="r">Qty sold</th><th class="r">Sales</th><th style="width:30%"></th></tr>${L.map(([n,x])=>`<tr><td>${esc(n)}</td><td class="r num">${x.q}</td><td class="r num">${money(x.v)}</td><td><div class="bar"><i style="width:${Math.round(x.v/mx*100)}%"></i></div></td></tr>`).join("")||'<tr><td colspan="4" class="muted">No sales yet.</td></tr>'}</table></div>`}
  if(T==="pay"){const modes={};sales.forEach(o=>o.pay.forEach(p=>{const k=p.mode;modes[k]=(modes[k]||0)+p.amt}));const rates={};sales.forEach(o=>o.bill.byRate.forEach(r=>{const x=rates[r.rate]||(rates[r.rate]={t:0,x:0});x.t+=r.taxable;x.x+=r.tax}));
    body=`<div class="grid g2"><div class="card scroll-x"><h3>Payment-wise</h3><table class="tbl"><tr><th>Mode</th><th class="r">Amount</th></tr>${Object.entries(modes).map(([k,v])=>`<tr><td>${esc(k)}</td><td class="r num">${money(r2(v))}</td></tr>`).join("")||'<tr><td colspan="2" class="muted">None</td></tr>'}</table></div>
    <div class="card scroll-x"><h3>GST summary</h3><table class="tbl"><tr><th>Rate</th><th class="r">Taxable</th><th class="r">CGST</th><th class="r">SGST</th></tr>${Object.entries(rates).map(([r,x])=>`<tr><td>${r}%</td><td class="r num">${money(r2(x.t))}</td><td class="r num">${money(r2(x.x/2))}</td><td class="r num">${money(r2(x.x/2))}</td></tr>`).join("")||'<tr><td colspan="4" class="muted">None</td></tr>'}</table><p class="muted">These figures help your accountant. Confirm filing details with them.</p></div></div>`}
  if(T==="reg"){body=`<div class="card scroll-x"><h3>Discounts</h3><table class="tbl"><tr><th>When</th><th>Bill</th><th>Reason</th><th>Given by</th><th class="r">Amount</th></tr>${sales.filter(o=>o.bill.disc>0).map(o=>`<tr><td>${hhmm(o.paidAt)}</td><td>${esc(o.bill.no)}</td><td>${esc(o.disc.reason||"")}</td><td>${esc(o.disc.by||"")}</td><td class="r num">${money(o.bill.disc)}</td></tr>`).join("")||'<tr><td colspan="5" class="muted">No discounts.</td></tr>'}</table></div>
   <div class="card scroll-x" style="margin-top:12px"><h3>Cancelled, rejected and reversed</h3><table class="tbl"><tr><th>When</th><th>Order</th><th>Type</th><th>Reason</th><th>By</th></tr>${D.cancels.map(o=>`<tr><td>${hhmm(o.cancel.at)}</td><td>${esc(o.ref||ref(o))}</td><td>${o.status==="rejected"?"Rejected":o.cancel.afterKot?"Cancelled after KOT":"Cancelled"}</td><td>${esc(o.cancel.reason)}</td><td>${esc(o.cancel.by)}</td></tr>`).join("")}${D.revs.map(o=>`<tr><td>${hhmm(o.reversal.at)}</td><td>${esc(o.bill.no)}</td><td><span class="pill bad">Bill reversed</span></td><td>${esc(o.reversal.reason)}</td><td>${esc(o.reversal.by)}</td></tr>`).join("")||""}${D.cancels.length+D.revs.length?"":'<tr><td colspan="5" class="muted">None.</td></tr>'}</table></div>`}
  if(T==="use"){const u=consumption(o=>(D.scope==="all"||o.outlet===UI.outlet)&&inRange(o.created));
    body=`<div class="card scroll-x"><h3>Stock consumed (theoretical, from recipes)</h3><table class="tbl"><tr><th>Ingredient</th><th class="r">Used</th><th class="r">Cost</th></tr>${ings().items.filter(i=>u[i.id]).map(i=>`<tr><td>${esc(i.name)}</td><td class="r num">${r2(u[i.id])} ${i.unit}</td><td class="r num">${money(r2(u[i.id]*i.cost))}</td></tr>`).join("")||'<tr><td colspan="3" class="muted">No consumption in this period.</td></tr>'}</table></div>`}
  if(T==="exp"){body=`<div class="card"><h3>Export</h3><p class="muted">Files are saved to your device after you confirm.</p><div class="row"><button class="btn pri" data-a="expSales">Sales register (CSV)</button><button class="btn" data-a="expTally">Accounting vouchers (CSV)</button><button class="btn" data-a="expJson">Full backup (JSON)</button></div><p class="muted">The accounting file lists one sales voucher per bill with GST split. Column names vary between accounting tools, so you may need to map them when importing into Tally or similar software.</p></div>`}
  return `<div class="row sb"><h2>Reports</h2>${D.dayOnly?`<span class="pill">Today · ${esc(outlet().name)}</span>`:`<div class="row"><select data-c="range" aria-label="Period"><option value="today"${UI.range==="today"?" selected":""}>Today</option><option value="7"${UI.range==="7"?" selected":""}>Last 7 days</option><option value="all"${UI.range==="all"?" selected":""}>All time</option></select><select data-c="scope" aria-label="Outlets"><option value="cur"${UI.scope==="cur"?" selected":""}>This outlet</option><option value="all"${UI.scope==="all"?" selected":""}>All outlets</option></select></div>`}</div><div class="tabs">${tabs.map(t=>`<button data-a="rtab" data-t="${t[0]}" aria-pressed="${T===t[0]}">${t[1]}</button>`).join("")}</div>${body}`;
};
A.rtab=d=>{UI.rtab=d.t;render()};CH.range=el=>{UI.range=el.value;render()};CH.scope=el=>{UI.scope=el.value;render()};
A.expSales=()=>{const D=repData();download("sales-register.csv",csv([["Bill no","Date","Time","Outlet","Type","Source","Table/Token","Subtotal","Discount","Service charge","GST","Round off","Total","Payment modes"],...D.sales.map(o=>[o.bill.no,dstr(o.paidAt),hhmm(o.paidAt),outlet(o.outlet).name,o.type,o.source,o.table||o.token,o.bill.sub,o.bill.disc,o.bill.svc,o.bill.tax,o.bill.round,o.bill.total,o.pay.map(p=>p.mode+":"+p.amt).join(" | ")])]))};
A.expTally=()=>{const D=repData();download("sales-vouchers.csv",csv([["Voucher date","Voucher type","Voucher no","Party ledger","Sales ledger","Taxable amount","CGST","SGST","Round off","Invoice total"],...D.sales.map(o=>[new Date(o.paidAt).toISOString().slice(0,10),"Sales",o.bill.no,"Cash / Bank sales","Restaurant sales",r2(o.bill.net+o.bill.svc),o.bill.cgst,o.bill.sgst,o.bill.round,o.bill.total])]))};
A.expJson=()=>download("dine-desk-backup.json",JSON.stringify({exported:new Date().toISOString(),cfg:S.cfg,menu:S.menu,ing:S.ing,stock:S.stock,orders:S.orders,customers:S.customers,po:S.po,misc:S.misc},null,1),"application/json");

/* ---------- outlets (head office, central kitchen) ---------- */
V.hq=()=>{
  const outs=cfg().outlets.filter(o=>o.kind==="outlet"),T=UI.htab;
  const tabs=[["over","Head office"],["ck","Central kitchen"]];let body="";
  if(T==="over"){const rows=outs.map(o=>{const s=Object.values(S.orders).filter(x=>x.outlet===o.id&&isSale(x)&&sameDay(x.paidAt,Date.now())),t=s.reduce((a,x)=>a+x.bill.total,0),open=Object.values(S.orders).filter(x=>x.outlet===o.id&&["open","billed","accepted","ready","dispatched"].includes(x.status)).length,fb=Object.values(S.orders).filter(x=>x.outlet===o.id&&x.feedback);return{o,t,n:s.length,open,low:lowItems(o.id).length,rate:fb.length?fb.reduce((a,x)=>a+x.feedback.r,0)/fb.length:0}});
    const mx=Math.max(1,...rows.map(r=>r.t)),all=rows.reduce((a,r)=>a+r.t,0);
    body=`<div class="grid g3"><div class="card kpi"><span>All outlets, sales today</span><b class="num">${money(all)}</b></div><div class="card kpi"><span>Bills today</span><b class="num">${rows.reduce((a,r)=>a+r.n,0)}</b></div><div class="card kpi"><span>Open orders now</span><b class="num">${rows.reduce((a,r)=>a+r.open,0)}</b></div></div>
    <div class="card scroll-x" style="margin-top:12px"><table class="tbl"><tr><th>Outlet</th><th class="r">Sales today</th><th></th><th class="r">Bills</th><th class="r">Open orders</th><th class="r">Low stock</th><th class="r">Guest rating</th></tr>${rows.map(r=>`<tr><td><b>${esc(r.o.name)}</b></td><td class="r num">${money(r.t)}</td><td style="width:22%"><div class="bar"><i style="width:${Math.round(r.t/mx*100)}%"></i></div></td><td class="r num">${r.n}</td><td class="r num">${r.open}</td><td class="r num">${r.low?`<span class="pill warn">${r.low}</span>`:"0"}</td><td class="r">${r.rate?r.rate.toFixed(1)+" ★":"-"}</td></tr>`).join("")}</table></div>
    <p class="muted" style="margin-top:10px">Menu, prices, tax and staff roles are shared across outlets. Edit once and every outlet uses it. Stock and sales are tracked per outlet.</p>`}
  if(T==="ck"){const all=Object.values(S.po).filter(p=>p.kind==="indent").sort((a,b)=>b.at-a.at),ck=stockOf("ck");
    body=`<div class="card"><h3>Request stock from the central kitchen</h3><form data-f="indent" class="row" style="margin-top:8px"><select name="o" aria-label="Outlet">${outs.map(o=>`<option value="${o.id}"${o.id===UI.outlet?" selected":""}>${esc(o.name)}</option>`).join("")}</select><select name="i" aria-label="Ingredient">${ings().items.map(i=>`<option value="${i.id}">${esc(i.name)} (${i.unit}) · central has ${r2(ck.qty[i.id]||0)}</option>`).join("")}</select><input name="q" type="number" min="0.1" step="0.1" placeholder="Qty" required style="width:90px"><button class="btn pri">Send request</button></form></div>
    <div class="card scroll-x" style="margin-top:12px"><h3>Indents</h3><table class="tbl"><tr><th>Requested</th><th>Outlet</th><th>Item</th><th class="r">Qty</th><th>Status</th><th></th></tr>${all.map(p=>{const l=p.lines[0],have=ck.qty[l.i]||0;return `<tr><td>${dstr(p.at)} ${hhmm(p.at)}</td><td>${esc(outlet(p.outlet).name)}</td><td>${esc(ingName(l.i).name)}</td><td class="r num">${l.q} ${ingName(l.i).unit}</td><td><span class="pill ${p.status==="dispatched"?"ok":"warn"}">${p.status}</span></td><td>${p.status==="requested"?`<button class="btn sm" data-a="dispatch" data-id="${p.id}"${have<l.q?" disabled":""}>${have<l.q?"Not enough stock":"Dispatch"}</button>`:""}</td></tr>`}).join("")||'<tr><td colspan="6" class="muted">No requests yet.</td></tr>'}</table></div>`}
  return `<h2>Outlets and central kitchen</h2><div class="tabs">${tabs.map(t=>`<button data-a="htab" data-t="${t[0]}" aria-pressed="${T===t[0]}">${t[1]}</button>`).join("")}</div>${body}`;
};
A.htab=d=>{UI.htab=d.t;render()};
F.indent=f=>{const p={id:uid("p"),outlet:f.o.value,kind:"indent",lines:[{i:f.i.value,q:+f.q.value}],status:"requested",at:Date.now(),by:UI.user.name};audit("Indent requested",outlet(p.outlet).name+" · "+ingName(f.i.value).name);commit("po/"+p.id,p);toast("Request sent to the central kitchen")};
A.dispatch=d=>{const p=S.po[d.id],l=p.lines[0],ck=stockOf("ck"),to=stockOf(p.outlet);if((ck.qty[l.i]||0)<l.q){toast("Not enough stock at the central kitchen.");return}
  ck.qty[l.i]=r2(ck.qty[l.i]-l.q);to.qty[l.i]=r2((to.qty[l.i]||0)+l.q);p.status="dispatched";p.rcv=Date.now();audit("Indent dispatched",outlet(p.outlet).name+" · "+ingName(l.i).name+" "+l.q);commit("po/"+p.id,p);commit("stock/ck",ck);commit("stock/"+p.outlet,to);toast("Dispatched. Outlet stock updated.")};

/* ---------- settings ---------- */
const CAPL={order:"Take orders",kot:"Send KOT",bill:"Bill and collect payment",disc:"Give discount (cashier up to 10%)",discany:"Any discount",cancel:"Cancel sent orders",reverse:"Reverse paid bills",menu:"Edit menu",stock:"Inventory",po:"Receive purchases",reports:"Full reports",dayend:"Day-end report",kds:"Kitchen display",online:"Online orders",crm:"Customers",hq:"All outlets"};
V.admin=()=>{
  const T=UI.atab,c=cfg(),tabs=[["staff","Staff"],["tax","Tax and payments"],["bill","Bill format"],["outl","Outlets"],["audit","Audit log"],["data","Data"]];let body="";
  if(T==="staff")body=`<div class="card scroll-x"><table class="tbl"><tr><th>Name</th><th>Role</th><th>PIN</th><th></th></tr>${c.staff.map(s=>`<tr><td><input data-c="stn" data-id="${s.id}" value="${esc(s.name)}" aria-label="Name" maxlength="30"></td><td><select data-c="str" data-id="${s.id}" aria-label="Role">${Object.keys(ROLEN).map(r=>`<option value="${r}"${r===s.role?" selected":""}>${ROLEN[r]}</option>`).join("")}</select></td><td><input data-c="stp" data-id="${s.id}" value="${esc(s.pin)}" class="mono" maxlength="6" inputmode="numeric" style="width:90px" aria-label="PIN"></td><td><button class="btn sm bad" data-a="delStaff" data-id="${s.id}">Remove</button></td></tr>`).join("")}</table>
   <form data-f="staff" class="row" style="margin-top:10px"><input name="n" placeholder="New staff name" required maxlength="30"><select name="r" aria-label="Role">${Object.keys(ROLEN).map(r=>`<option value="${r}">${ROLEN[r]}</option>`).join("")}</select><input name="p" placeholder="PIN (4-6 digits)" pattern="[0-9]{4,6}" required style="width:150px"><button class="btn pri">Add staff</button></form></div>
   <div class="card scroll-x" style="margin-top:12px"><h3>What each role can do</h3><table class="tbl"><tr><th>Permission</th>${Object.keys(ROLEN).map(r=>`<th>${r}</th>`).join("")}</tr>${Object.keys(CAPL).map(k=>`<tr><td>${CAPL[k]}</td>${Object.keys(ROLEN).map(r=>{const p=PERMS[r];return `<td>${p==="*"||p.includes(k)?"✓":'<span class="muted">-</span>'}</td>`}).join("")}</tr>`).join("")}</table></div>`;
  if(T==="tax")body=`<form data-f="tax" class="card grid g3"><label class="row"><input type="checkbox" name="inc"${c.tax.inclusive?" checked":""}> Menu prices include GST</label><label class="f">Service charge on dine-in (%)<input name="svc" type="number" min="0" max="20" step="0.5" value="${c.tax.service}"></label><label class="f">UPI ID for payments<input name="upi" value="${esc(c.upi)}"></label>
   <label class="f">Loyalty: ₹ spent per point<input name="per" type="number" min="1" value="${c.loyalty.per}"></label><label class="f">Max bill share payable with points (%)<input name="mp" type="number" min="0" max="100" value="${c.loyalty.maxPct}"></label><span></span>
   <label class="f">Swiggy fee (%) (placeholder)<input name="sw" type="number" min="0" step="0.5" value="${c.commission.swiggy}"></label><label class="f">Zomato fee (%) (placeholder)<input name="zm" type="number" min="0" step="0.5" value="${c.commission.zomato}"></label><div class="row"><button class="btn pri">Save</button></div>
   <p class="muted" style="grid-column:1/-1;margin:0">GST rate is set per dish in the menu. These settings affect new bills. Check tax treatment with your accountant; e-invoicing and e-way bills need the government portal and are not part of this demo.</p></form>`;
  if(T==="bill"){const demo={id:"x",outlet:UI.outlet,type:"dine",table:"T1",source:"POS",by:UI.user.name,status:"billed",disc:{t:"pct",v:0},lines:[{name:"Paneer Butter Masala",adds:[],price:260,qty:1,gst:5},{name:"Butter Naan",adds:[],price:60,qty:3,gst:5},{name:"Cola 300 ml",adds:[],price:60,qty:2,gst:18}],pay:[],merged:[]};demo.bill=Object.assign(calc(demo),{no:"O1-DEMO-0001",at:Date.now()});
    body=`<div class="grid g2"><form data-f="bill" class="card grid"><label class="f">Business name<input name="n" value="${esc(c.bill.name)}" maxlength="40"></label><label class="f">Address<input name="a" value="${esc(c.bill.addr)}" maxlength="60"></label><label class="f">GSTIN<input name="g" value="${esc(c.bill.gstin)}" maxlength="15" placeholder="Leave blank until registered"></label><label class="f">Footer line<input name="f" value="${esc(c.bill.footer)}" maxlength="50"></label><label class="f">Paper width<select name="w">${[[32,"58 mm (32 chars)"],[34,"58 mm wide (34 chars)"],[42,"80 mm (42 chars)"]].map(x=>`<option value="${x[0]}"${c.bill.width===x[0]?" selected":""}>${x[1]}</option>`).join("")}</select></label><label class="row"><input type="checkbox" name="sp"${c.bill.split?" checked":""}> Show CGST and SGST separately</label><div class="row"><button class="btn pri">Save bill format</button></div></form>
    <div class="card"><h3>Preview</h3><div class="receipt" style="margin-top:8px">${esc(receiptText(demo))}</div></div></div>`}
  if(T==="outl")body=`<div class="card scroll-x"><table class="tbl"><tr><th>Outlet</th><th>Type</th><th>Tables</th></tr>${c.outlets.map(o=>`<tr><td><input data-c="onm" data-id="${o.id}" value="${esc(o.name)}" maxlength="30" aria-label="Outlet name"></td><td>${o.kind==="central"?"Central kitchen":"Restaurant"}</td><td>${o.kind==="central"?'<span class="muted">-</span>':`<input data-c="otb" data-id="${o.id}" type="number" min="1" max="60" value="${o.tables.length}" style="width:80px" aria-label="Tables">`}</td></tr>`).join("")}</table>
    <form data-f="outlet" class="row" style="margin-top:10px"><input name="n" placeholder="New outlet name" required maxlength="30"><input name="t" type="number" min="1" max="60" value="8" style="width:80px" aria-label="Tables"><button class="btn pri">Add outlet</button></form></div>`;
  if(T==="audit"){const L=(S.misc.audit||{log:[]}).log;body=`<div class="card scroll-x"><table class="tbl"><tr><th>When</th><th>Who</th><th>Action</th><th>Detail</th></tr>${L.map(l=>`<tr><td>${dstr(l.t)} ${hhmm(l.t)}</td><td>${esc(l.u)}</td><td>${esc(l.act)}</td><td>${esc(l.d)}</td></tr>`).join("")||'<tr><td colspan="4" class="muted">Sensitive actions (discounts, cancellations, reversals, stock counts, price changes) are recorded here.</td></tr>'}</table></div>`}
  if(T==="data")body=`<div class="grid g2"><div class="card"><h3>Cloud and offline</h3><p>${localOnly?"This view is not connected to cloud storage, so data stays on this screen only.":"Every change is saved to cloud storage and appears on other devices within moments."} Use <b>Test offline</b> in the top bar to see how billing continues without internet and syncs later. Bills are never edited after printing; reversals add a new entry, so the history stays complete.</p></div>
   <div class="card"><h3>Sample data</h3><p class="muted">Fill reports, customers and feedback with one sample day for a quick tour. Sample records are labelled and can be removed.</p><div class="row"><button class="btn pri" data-a="sample">Load sample day</button><button class="btn bad" data-a="unsample">Remove sample data</button></div></div>
   <div class="card"><h3>Backup</h3><p class="muted">Save a copy of all menu, stock, orders and customers.</p><button class="btn" data-a="expJson">Download backup (JSON)</button></div></div>`;
  return `<h2>Settings</h2><div class="tabs">${tabs.map(t=>`<button data-a="atab" data-t="${t[0]}" aria-pressed="${T===t[0]}">${t[1]}</button>`).join("")}</div>${body}`;
};
A.atab=d=>{UI.atab=d.t;render()};
const stf=(id)=>cfg().staff.find(s=>s.id===id);
CH.stn=el=>{const c=cfg();stf(el.dataset.id).name=el.value.trim()||"Staff";audit("Staff renamed",el.value);commit("config/main",c)};
CH.str=el=>{const c=cfg(),s=stf(el.dataset.id);if(s.role==="owner"&&el.value!=="owner"&&c.staff.filter(x=>x.role==="owner").length<2){toast("Keep at least one owner.");render();return}s.role=el.value;audit("Role changed",s.name+" → "+el.value);commit("config/main",c)};
CH.stp=el=>{if(!/^[0-9]{4,6}$/.test(el.value)){toast("PIN must be 4 to 6 digits.");render();return}const c=cfg();stf(el.dataset.id).pin=el.value;audit("PIN changed",stf(el.dataset.id).name);commit("config/main",c)};
A.delStaff=d=>{const c=cfg(),s=stf(d.id);if(s.role==="owner"&&c.staff.filter(x=>x.role==="owner").length<2){toast("Keep at least one owner.");return}if(s.id===UI.user.id){toast("You cannot remove yourself.");return}c.staff=c.staff.filter(x=>x.id!==d.id);audit("Staff removed",s.name);commit("config/main",c)};
F.staff=f=>{const c=cfg();c.staff.push({id:uid("u"),name:f.n.value.trim(),role:f.r.value,pin:f.p.value});audit("Staff added",f.n.value);commit("config/main",c);f.reset()};
F.tax=f=>{const c=cfg();c.tax={inclusive:f.inc.checked,service:+f.svc.value||0};c.upi=f.upi.value.trim();c.loyalty={per:Math.max(1,+f.per.value||10),maxPct:Math.min(100,+f.mp.value||50)};c.commission={swiggy:+f.sw.value||0,zomato:+f.zm.value||0};audit("Tax and payment settings changed","");commit("config/main",c);toast("Saved")};
F.bill=f=>{const c=cfg();c.bill={name:f.n.value.trim(),addr:f.a.value.trim(),gstin:f.g.value.trim(),footer:f.f.value.trim(),width:+f.w.value,split:f.sp.checked};audit("Bill format changed","");commit("config/main",c);toast("Saved")};
CH.onm=el=>{const c=cfg();c.outlets.find(o=>o.id===el.dataset.id).name=el.value.trim()||"Outlet";commit("config/main",c)};
CH.otb=el=>{const c=cfg(),o=c.outlets.find(x=>x.id===el.dataset.id),n=Math.max(1,Math.min(60,+el.value||1));o.tables=tb(n);audit("Tables changed",o.name+" → "+n);commit("config/main",c)};
F.outlet=f=>{const c=cfg(),id="o"+(Math.floor(Math.random()*9000)+10);c.outlets.splice(c.outlets.findIndex(o=>o.kind==="central"),0,{id,name:f.n.value.trim(),kind:"outlet",tables:tb(+f.t.value||8)});audit("Outlet added",f.n.value);commit("config/main",c);f.reset()};

/* ---------- sample day ---------- */
function sampleDay(){
  const its=menu().items,outs=cfg().outlets.filter(o=>o.kind==="outlet"),now=Date.now(),start=new Date();start.setHours(0,0,0,0);
  const span=Math.min(10*3600e3,Math.max(1800e3,now-start.getTime())),R=n=>Math.floor(Math.random()*n),pick=a=>a[R(a.length)];
  const names=["Anita Rao","Vikram Shah","Sana Khan","Rohit Nair","Priya Iyer","Karthik B"],cs=names.map((n,i)=>({id:uid("c"),name:n,phone:"98450"+String(10000+R(89999)).slice(0,5),consent:i!==2,points:20+R(80),visits:2+R(6),spend:1500+R(6000),since:now-30*864e5,last:now-(i<2?2:40)*864e5,sample:true}));
  const jobs=cs.map(c=>()=>commit("customers/"+c.id,c));let seq={};
  for(let k=0;k<36;k++){
    const out=pick(outs),paidAt=now-R(span),r=R(100),src=r<70?"POS":r<85?"POS":r<93?"Swiggy":"Zomato",type=r<70?"dine":r<85?"take":"delivery";
    const o={id:uid("o"),outlet:out.id,type,source:src,status:"paid",lines:[],kots:[],merged:[],disc:{t:"pct",v:0},pay:[],created:paidAt-(25+R(30))*60000,paidAt,by:pick(["Meera","Rahul"]),log:[],sample:true};
    if(type==="dine")o.table=pick(out.tables).id;else o.token=1+k;
    if(src!=="POS")o.ref=(src==="Swiggy"?"SW-":"ZM-")+(1000+R(9000));
    const n=1+R(4);for(let j=0;j<n;j++){const it=pick(its),v=it.variants.length?pick(it.variants):null;o.lines.push({id:uid("l"),key:it.id,item:it.id,name:it.name+(v&&it.variants.length>1?" ("+v.n+")":""),adds:[],price:it.price+(v?v.p:0),qty:1+R(3),note:"",station:it.station,gst:it.gst,kot:1+k})}
    if(R(100)<15)o.disc={t:"pct",v:10,reason:"Regular customer",by:"Rahul"};
    const c=calc(o),d=new Date(paidAt),key=out.id+d.toDateString();seq[key]=(seq[key]||0)+1;
    o.bill=Object.assign(c,{no:src==="POS"?out.id.toUpperCase()+"-"+String(d.getFullYear()).slice(2)+String(d.getMonth()+1).padStart(2,"0")+String(d.getDate()).padStart(2,"0")+"-S"+String(seq[key]).padStart(3,"0"):o.ref,at:paidAt});
    const m=R(100);o.pay=[{mode:src!=="POS"?"Platform: "+src:m<30?"Cash":m<55?"Card":"UPI",amt:c.total,ref:"",at:paidAt,by:o.by}];
    if(src==="POS"&&R(100)<35){const cc=pick(cs);o.cust=cc.id}
    if(R(100)<18)o.feedback={r:pick([5,5,4,4,3,2]),c:pick(["","Great food","Slow service","Loved the biryani",""]),at:paidAt};
    jobs.push(()=>commit("orders/"+o.id,o));
  }
  for(let k=0;k<3;k++){const out=pick(outs),it=pick(its),t=now-R(span);const o={id:uid("o"),outlet:out.id,type:"dine",table:pick(out.tables).id,source:"POS",status:"cancelled",lines:[{id:uid("l"),key:it.id,item:it.id,name:it.name,adds:[],price:it.price,qty:1,note:"",station:it.station,gst:it.gst,kot:k?1:null}],kots:[],merged:[],disc:{t:"pct",v:0},pay:[],created:t-600000,cancel:{reason:pick(CANCELR),by:"Meera",at:t,afterKot:!!k},log:[],sample:true};jobs.push(()=>commit("orders/"+o.id,o))}
  let i=0;const run=()=>{if(i<jobs.length){jobs[i++]();setTimeout(run,45)}else{toast("Sample day loaded");render()}};run();
}
A.sample=()=>{toast("Loading sample day…");sampleDay()};
A.unsample=()=>{const ids=[["orders",Object.values(S.orders)],["customers",Object.values(S.customers)]].flatMap(([c,L])=>L.filter(x=>x.sample).map(x=>c+"/"+x.id));let i=0;const run=()=>{if(i<ids.length){removeDoc(ids[i++]);setTimeout(run,45)}else{toast(ids.length?"Sample data removed":"No sample data found");render()}};run()};

/* ---------- events and boot ---------- */
document.addEventListener("click",e=>{const el=e.target.closest("[data-a]");if(!el)return;const fn=A[el.dataset.a];if(fn)fn(el.dataset,el,e)});
document.addEventListener("change",e=>{const el=e.target.closest("[data-c]");if(el&&CH[el.dataset.c])CH[el.dataset.c](el,e)});
document.addEventListener("input",e=>{const el=e.target.closest("[data-i]");if(el&&INP[el.dataset.i])INP[el.dataset.i](el,e)});
document.addEventListener("submit",e=>{const f=e.target.closest("form[data-f]");if(f){e.preventDefault();if(F[f.dataset.f])F[f.dataset.f](f)}});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&UI.modal&&UI.modal.kind!=="login")closeModal()});
function subscribe(c,fn){
  return new Promise(res=>{let first=true;
    DB.collection(c).onSnapshot(snap=>{
      if(!Q.offline){const m={};snap.docs.forEach(d=>m[d.id]=clone(d.data()));fn(m)}
      if(first){first=false;res()}else schedule();
    },err=>{if(first){first=false;res()}if(err&&err.code==="revoked")toast("Access to shared data ended.")});
  });
}
async function boot(){
  try{const cl=window.claude;if(cl&&cl.use){DB=await cl.use("db");UI.dl=await cl.use("downloads")}}catch(e){DB=null}
  localOnly=!DB||!!DB.__local;
  if(DB){
    const timeout=new Promise(r=>setTimeout(r,3500));
    await Promise.race([Promise.all([
      subscribe("config",m=>{S.cfg=m.main||null;S.menu=m.menu||null;S.ing=m.ing||null}),
      subscribe("stock",m=>{S.stock=m}),subscribe("orders",m=>{S.orders=m}),subscribe("customers",m=>{S.customers=m}),
      subscribe("po",m=>{S.po=m}),subscribe("misc",m=>{S.misc=m})]),timeout]);
  }
  try{const id=sessionStorage.getItem("dd_user");if(id){const s=cfg().staff.find(x=>x.id===id);if(s){UI.user=s;UI.view=s.role==="kitchen"?"kitchen":"tables"}}}catch(e){}
  render();
}
boot();