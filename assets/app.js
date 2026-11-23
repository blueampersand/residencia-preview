// Residencias Senior Care — shared behavior: bilingual toggle, scroll reveals,
// mobile menu, and Netlify-Forms AJAX submit with inline thank-you.

// --- Bilingual EN/ES toggle (persists across pages) ---
(function(){
  const KEY='rsc-lang';
  let es = localStorage.getItem(KEY)!=='en';   // Spanish-first: default ES unless user chose EN
  function apply(){
    document.documentElement.lang = es ? 'es' : 'en';
    document.querySelectorAll('[data-en]').forEach(el=>{
      const v = el.getAttribute(es?'data-es':'data-en');
      if(v!=null) el.textContent = v;
    });
    // swap aria-labels where provided
    document.querySelectorAll('[data-en-label]').forEach(el=>{
      const v = el.getAttribute(es?'data-es-label':'data-en-label');
      if(v!=null) el.setAttribute('aria-label', v);
    });
    document.querySelectorAll('.lang-toggle').forEach(b=>b.textContent = es?'EN':'ES');
  }
  document.addEventListener('click',e=>{
    const t = e.target.closest('.lang-toggle');
    if(!t) return;
    es = !es; localStorage.setItem(KEY, es?'es':'en'); apply();
  });
  apply();
})();

// --- Mobile menu ---
(function(){
  const btn = document.getElementById('menu-btn');
  const nav = document.getElementById('mobile-nav');
  if(!btn||!nav) return;
  btn.addEventListener('click',()=>{
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open?'true':'false');
  });
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    nav.classList.remove('open'); btn.setAttribute('aria-expanded','false');
  }));
})();

// --- Scroll reveal ---
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in')); return; }
  const io = new IntersectionObserver(ents=>ents.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
  }),{threshold:.15});
  els.forEach(e=>io.observe(e));
})();

// --- Contact form: submit to Netlify Forms via AJAX, show inline thank-you ---
(function(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const status = document.getElementById('form-status');
  form.addEventListener('submit', async e=>{
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    const es = document.documentElement.lang==='es';
    btn.textContent = es ? 'Enviando…' : 'Sending…';
    try{
      const body = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch('/', {method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});
      if(!res.ok) throw new Error(res.status);
      form.hidden = true;
      status.hidden = false;
      status.focus();
    }catch(err){
      btn.disabled = false;
      btn.textContent = es ? 'Enviar mensaje' : 'Send message';
      status.hidden = false;
      status.textContent = es
        ? 'No pudimos enviar el mensaje. Escríbenos por WhatsApp al +52 664 485 4400.'
        : 'We could not send the message. Please WhatsApp us at +52 664 485 4400.';
    }
  });
})();
