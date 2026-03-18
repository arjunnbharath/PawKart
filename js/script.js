/* ══════════════════════
   INTRO ANIMATION
══════════════════════ */
(function(){
  const intro = document.getElementById('intro');
  const video = document.getElementById('intro-video');
  const site  = document.getElementById('site');

  function finishIntro(){
    if(video){ video.pause(); }
    intro.classList.add('fade-out');
    site.classList.add('visible');
    setTimeout(()=>{ intro.style.display='none'; }, 700);
  }

  // Expose to HTML onclick (skip button)
  window.finishIntro = finishIntro;

  if(video){
    video.addEventListener('loadedmetadata', ()=>{
      // Clamp to 5 seconds max
      video.play().catch(()=>{});
    });

    // Stop at 5 seconds
    video.addEventListener('timeupdate', ()=>{
      if(video.currentTime >= 5){ finishIntro(); }
    });

    // Also finish if video ends before 5s
    video.addEventListener('ended', finishIntro);

    // If video can't load, skip after 500ms
    video.addEventListener('error', ()=>setTimeout(finishIntro, 500));

    // Hard fallback: always proceed after 6s
    setTimeout(finishIntro, 6000);
  } else {
    setTimeout(finishIntro, 300);
  }
})();

/* ══════════════════════
   PRODUCTS DATA
══════════════════════ */
const AC = {
  dog: {bg:'var(--sage-bg)', text:'var(--sage)'},
  cat: {bg:'var(--blush-bg)',text:'var(--blush)'},
  bird:{bg:'var(--amber-bg)',text:'var(--amber)'},
  fish:{bg:'var(--sky-bg)',  text:'var(--sky)'},
};
const PRODS = [
  {id:1, name:'Royal Canin Maxi Adult',   animal:'dog', type:'food',em:'🦴',price:2150,badge:'best',bl:'Best Seller',desc:'Large breed dry food, 15kg'},
  {id:2, name:'Pedigree Wet Food Pouch',  animal:'dog', type:'food',em:'🥩',price:85,  badge:'sub', bl:'Subscribe',  desc:'Chicken & liver jelly, 12-pack'},
  {id:3, name:'Drools Puppy Starter',     animal:'dog', type:'food',em:'🌾',price:650, badge:'new', bl:'New',        desc:'Puppy starter food, 3kg'},
  {id:4, name:'Rope Tug Toy Set',         animal:'dog', type:'toy', em:'🎾',price:349, badge:'new', bl:'New',        desc:'Durable cotton rope, set of 3'},
  {id:5, name:'Whiskas Dry Cat Food',     animal:'cat', type:'food',em:'🐠',price:750, badge:'best',bl:'Best Seller',desc:'Ocean fish flavour, 1.2kg'},
  {id:6, name:'Felix Wet Cat Food',       animal:'cat', type:'food',em:'🥣',price:60,  badge:'sub', bl:'Subscribe',  desc:'Jelly sachets, 12-pack'},
  {id:7, name:'Me-O Tuna Pouches',        animal:'cat', type:'food',em:'🐟',price:45,  badge:'new', bl:'New',        desc:'Tuna in gravy, 80g pouch'},
  {id:8, name:'Cat Feather Wand',         animal:'cat', type:'toy', em:'🪶',price:199, badge:'new', bl:'New',        desc:'Interactive feather toy'},
  {id:9, name:'Taiyo Parrot Mix',         animal:'bird',type:'food',em:'🌻',price:320, badge:'best',bl:'Best Seller',desc:'Premium seed mix, 500g'},
  {id:10,name:'Budgie Millet Spray',      animal:'bird',type:'food',em:'🌱',price:80,  badge:'sub', bl:'Subscribe',  desc:'Natural millet sprays, 5-pack'},
  {id:11,name:'Bird Swing & Perch',       animal:'bird',type:'toy', em:'🪵',price:249, badge:'new', bl:'New',        desc:'Wooden swing with bell'},
  {id:12,name:'Hikari Goldfish Pellets',  animal:'fish',type:'food',em:'🫧',price:450, badge:'best',bl:'Best Seller',desc:'Colour-enhancing pellets, 500g'},
  {id:13,name:'TetraMin Tropical Flakes', animal:'fish',type:'food',em:'🌊',price:380, badge:'sub', bl:'Subscribe',  desc:'Flake food for tropical fish'},
  {id:14,name:'Dog Sniff Mat',            animal:'dog', type:'toy', em:'🧩',price:599, badge:'new', bl:'New',        desc:'Mental stimulation mat'},
];

/* ══════════════════════
   CART
══════════════════════ */
let cart = [];
const fmt = n => '₹' + n.toLocaleString('en-IN');

function addToCart(id){
  const p = PRODS.find(x=>x.id===id);
  if(!p) return;
  const ex = cart.find(x=>x.id===id);
  if(ex) ex.qty++; else cart.push({...p,qty:1});
  syncCart();
  showToast(`✓ ${p.name} added to cart`);
  openCart();
}
function removeFromCart(id){
  cart = cart.filter(x=>x.id!==id);
  syncCart(); renderCart();
}
function chgQty(id,d){
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += d;
  if(item.qty<=0){ removeFromCart(id); return; }
  syncCart(); renderCart();
}
function syncCart(){
  const n = cart.reduce((s,x)=>s+x.qty,0);
  document.getElementById('cart-n').textContent       = n;
  document.getElementById('mob-cn').textContent       = n;
  document.getElementById('mob-cart-dot').textContent = n;
  document.getElementById('cdh-sm').textContent       = `${n} item${n!==1?'s':''}`;
  renderCart();
}
function renderCart(){
  const body = document.getElementById('cdbody');
  const foot = document.getElementById('cfoot');
  if(!cart.length){
    body.innerHTML=`<div class="c-empty"><div class="cei">🛒</div><p>Your cart is empty</p></div>`;
    foot.style.display='none'; return;
  }
  foot.style.display='block';
  document.getElementById('ctotal').textContent = fmt(cart.reduce((s,x)=>s+x.price*x.qty,0));
  body.innerHTML = cart.map(item=>{
    const col = AC[item.animal]?.bg||'var(--bg)';
    return `
    <div class="citem">
      <div class="cthumb" style="background:${col}">${item.em}</div>
      <div>
        <div class="cnm">${item.name}</div>
        <div class="cmt">${item.desc}</div>
        <div class="cqty">
          <button class="qb" onclick="chgQty(${item.id},-1)">−</button>
          <span class="qn">${item.qty}</span>
          <button class="qb" onclick="chgQty(${item.id},1)">+</button>
        </div>
      </div>
      <div class="csd">
        <button class="cdel" onclick="removeFromCart(${item.id})">✕</button>
        <div class="cpr">${fmt(item.price*item.qty)}</div>
      </div>
    </div>`;
  }).join('');
}
function openCart(){
  document.getElementById('cart-dr').classList.add('open');
  document.getElementById('cart-ov').classList.add('open');
  document.body.style.overflow='hidden';
}
function closeCart(){
  document.getElementById('cart-dr').classList.remove('open');
  document.getElementById('cart-ov').classList.remove('open');
  document.body.style.overflow='';
}
function checkout(){
  if(!cart.length){ showToast('Cart is empty!'); return; }
  const t=cart.reduce((s,x)=>s+x.price*x.qty,0);
  cart=[]; syncCart(); closeCart();
  showToast(`🎉 Order placed! Total: ${fmt(t)}. We'll call to confirm.`);
}

/* ══════════════════════
   PRODUCTS RENDER
══════════════════════ */
function renderProds(filter){
  const list = filter==='all' ? PRODS
    : filter==='toy' ? PRODS.filter(p=>p.type==='toy')
    : PRODS.filter(p=>p.animal===filter);
  const g = document.getElementById('prod-grid');
  g.innerHTML = list.map(p=>{
    const col = AC[p.animal]||{bg:'var(--bg)',text:'var(--ink4)'};
    return `
    <div class="pcard">
      <div class="pimg" style="background:${col.bg}">
        <div class="pe">${p.em}</div>
        <div class="pbadge b-${p.badge}">${p.bl}</div>
      </div>
      <div class="pbody">
        <div class="panim" style="color:${col.text}">${p.animal} · ${p.type}</div>
        <div class="pnm">${p.name}</div>
        <div class="pds">${p.desc}</div>
        <div class="pfoot">
          <div class="ppr">${fmt(p.price)}</div>
          <button class="padd" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>`;
  }).join('');
  setTimeout(()=>{
    g.querySelectorAll('.pcard').forEach((el,i)=>{
      el.style.cssText=`opacity:0;transform:translateY(12px);transition:opacity .3s ${i*30}ms ease,transform .3s ${i*30}ms ease`;
      requestAnimationFrame(()=>{el.style.opacity='1';el.style.transform='translateY(0)';});
    });
  },10);
}
function applyF(filter,btn){
  document.querySelectorAll('.fp').forEach(b=>b.classList.remove('on'));
  if(btn) btn.classList.add('on');
  renderProds(filter);
}
function jumpFilter(animal){
  document.getElementById('products').scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(()=>{
    const btn=[...document.querySelectorAll('.fp')].find(b=>b.textContent.toLowerCase().includes(animal));
    applyF(animal,btn);
  },500);
}

/* ══════════════════════
   SUBSCRIPTION
══════════════════════ */
function subPick(plan,price){
  showToast(`✓ ${plan} plan — ${price}/month selected!`);
}

/* ══════════════════════
   CONTACT FORM
══════════════════════ */
function sendMsg(){
  const n=document.getElementById('cn').value.trim();
  const e=document.getElementById('ce').value.trim();
  if(!n||!e){ showToast('Please fill name & email.'); return; }
  ['cn','ce','cp','cm'].forEach(id=>document.getElementById(id).value='');
  showToast('✉️ Message sent! We\'ll reply within a few hours.');
}

/* ══════════════════════
   MOBILE MENU
══════════════════════ */
function toggleMob(){
  const m=document.getElementById('mob-menu');
  const h=document.getElementById('hbg');
  const opening=!m.classList.contains('open');
  m.classList.toggle('open');
  h.classList.toggle('open');
  document.body.style.overflow=opening?'hidden':'';
}
function closeMob(){
  document.getElementById('mob-menu').classList.remove('open');
  document.getElementById('hbg').classList.remove('open');
  document.body.style.overflow='';
}

/* ══════════════════════
   TOAST
══════════════════════ */
let tt;
function showToast(msg){
  const el=document.getElementById('toast');
  el.textContent=msg; el.classList.add('show');
  clearTimeout(tt); tt=setTimeout(()=>el.classList.remove('show'),3000);
}

/* ══════════════════════
   TICKER
══════════════════════ */
const tData=[
  'Free delivery in Trivandrum','·','Subscribe & save up to 25%','·',
  'Same-day delivery available','·','Vet-approved products','·',
  'Dogs · Cats · Birds · Fish','·','Kerala\'s favourite pet store','·',
  'Free delivery in Trivandrum','·','Subscribe & save up to 25%','·',
  'Same-day delivery available','·','Vet-approved products','·',
  'Dogs · Cats · Birds · Fish','·','Kerala\'s favourite pet store','·',
];
document.getElementById('ticker-t').innerHTML=tData.map(t=>`<span>${t}</span>`).join('');

/* ══════════════════════
   ACTIVE NAV + SMOOTH SCROLL
══════════════════════ */
const SECS=['home','categories','products','subscription','collections','about','contact'];
function updateActive(){
  const y=window.scrollY+80; let cur='home';
  SECS.forEach(id=>{ const el=document.getElementById(id); if(el&&el.offsetTop<=y) cur=id; });
  document.querySelectorAll('.nav-links a').forEach(a=>{
    a.classList.toggle('active', a.getAttribute('data-section')===cur);
  });
}
window.addEventListener('scroll',()=>{
  document.getElementById('navbar').classList.toggle('scrolled',window.scrollY>10);
  updateActive();
},{passive:true});
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){
      e.preventDefault();
      const navH=parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'))||62;
      window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-navH,behavior:'smooth'});
    }
  });
});

/* ══════════════════════
   SCROLL REVEAL
══════════════════════ */
const obs=new IntersectionObserver(es=>{
  es.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('vis'); });
},{threshold:.1});
document.querySelectorAll('.rv').forEach(el=>obs.observe(el));

/* ══════════════════════
   RESIZE
══════════════════════ */
window.addEventListener('resize',()=>{ if(window.innerWidth>960) closeMob(); });

/* ══════════════════════
   INIT
══════════════════════ */
renderProds('all');
updateActive();