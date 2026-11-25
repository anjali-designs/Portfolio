(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const SITE = "https://anjalidesigns.netlify.app/assets/";

  /* ---------- Toast ---------- */
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  let toastT;
  const say = (msg, ms = 2600) => {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => toast.classList.remove("show"), ms);
  };

  /* ---------- Hero: fit the 2560 x 1440 stage into the section ---------- */
  const hero = $("#hero");
  const stage = $("#stage");
  let S = 0.65;
  const fit = () => {
    if (!hero || !stage) return;
    const W = hero.clientWidth, H = hero.clientHeight;
    const narrow = W < 721;
    /* phones: zoom so the whole desk (laptop to cup) fits the width; larger screens: fill the frame */
    S = narrow ? Math.max(W / 1560, H / 1440) : Math.max(W / 2560, H / 1440);
    const sw = 2560 * S, sh = 1440 * S;
    const focusX = narrow ? 0.5 : 0.53;
    const ox = Math.min(0, Math.max(W - sw, W / 2 - focusX * sw));
    const focusY = narrow ? 0.49 : 0.63;
    const oy = Math.min(0, Math.max(H - sh, H / 2 - focusY * sh));
    stage.style.setProperty("--s", S.toFixed(5));
    stage.style.setProperty("--ox", ox.toFixed(1) + "px");
    stage.style.setProperty("--oy", oy.toFixed(1) + "px");
  };
  if (hero) {
    fit();
    new ResizeObserver(fit).observe(hero);
  }

  /* Monitor feed: four columns of work tiles scrolling past */
  const feed = $("#feed");
  if (feed) {
    const img = p => ({ img: SITE + p });
    const cols = [
      { dur: "30s", tiles: [img("Lumi%20Screens/Employee%20Dashboard.webp"), { t: "Approval flow", bg: "linear-gradient(150deg,#8E1116,#2A0A0B)" }, img("Lumi%20Screens/Admin%20Dashboard.webp"), { t: "Dark mode tokens", bg: "#161212" }, { t: "Admin dashboard", bg: "#221B1B" }] },
      { dur: "38s", rev: true, tiles: [img("Meeting%20room/MacBook%20Pro%2016_%20-%2011%201.webp"), { t: "Book a room", bg: "#1E1818" }, { t: "Wireframes", bg: "#2A2121" }, img("Meeting%20room/MacBook%20Pro%2016_%20-%2013%201.webp"), { t: "User interviews", bg: "linear-gradient(150deg,#4A0B10,#160E0E)" }] },
      { dur: "33s", tiles: [img("Novel%20Office/screencapture-noveloffice-in-2026-04-22-14_32_54%202.webp"), { t: "Heatmaps", bg: "#1E1818" }, { t: "Sticky notes", bg: "#2A2121" }, img("Lumi%20Screens/TL%20Dashboard.webp"), { t: "Usability test", bg: "#161212" }] },
      { dur: "42s", rev: true, tiles: [{ t: "Moodboard", bg: "#1E1818" }, img("Lumi%20Screens/New%20chat.webp"), { t: "Portfolio v2", bg: "linear-gradient(150deg,#B81D1D,#3A0A0C)" }, { t: "Cat doodles", bg: "#221B1B" }, img("Meeting%20room/MacBook%20Pro%2016_%20-%2012%201.webp")] },
    ];
    const tileHTML = x => x.img
      ? `<div class="tile img" style="background-image:url('${x.img}')"></div>`
      : `<div class="tile" style="background:${x.bg}"><span><i></i><i></i></span><b>${x.t}</b></div>`;
    feed.innerHTML = cols.map(c =>
      `<div class="col${c.rev ? " rev" : ""}" style="--dur:${c.dur}"><div class="col-track">${c.tiles.concat(c.tiles).map(tileHTML).join("")}</div></div>`
    ).join("");
  }

  /* Labels: a dot on the thing, a line, then the label */
  const labels = $("#labels");
  if (labels) {
    const L = [
      { dx: 300, dy: 600, lx: 420, ly: 780, text: "to-do wall" },
      { dx: 1110, dy: 548, lx: 1000, ly: 548, text: "the cat committee, 4 members", end: true },
      { dx: 1662, dy: 568, lx: 1720, ly: 620, text: "where the pixels happen" },
      { dx: 838, dy: 1020, lx: 900, ly: 1150, text: "laptop on a stand, posture era" },
      { dx: 1604, dy: 1054, lx: 1700, ly: 1150, text: "notebook, ideas start here" },
      { dx: 1803, dy: 907, lx: 2060, ly: 905, text: "water, stay hydrated" },
    ];
    let svg = `<svg viewBox="0 0 2560 1440" preserveAspectRatio="none">`;
    let html = "";
    L.forEach((l, i) => {
      const d = (0.5 + i * 0.14).toFixed(2) + "s";
      const len = Math.hypot(l.lx - l.dx, l.ly - l.dy).toFixed(0);
      svg += `<line x1="${l.dx}" y1="${l.dy}" x2="${l.lx}" y2="${l.ly}" style="--len:${len};--d:${d}" stroke-width="2.4"/>`;
      svg += `<circle class="ring" cx="${l.dx}" cy="${l.dy}" r="14"/><circle class="core" cx="${l.dx}" cy="${l.dy}" r="7"/>`;
      html += `<span class="label${l.end ? " end" : ""}" style="left:${l.lx}px; top:${l.ly}px; --d:${d}">${l.text}</span>`;
    });
    labels.innerHTML = svg + "</svg>" + html;
  }

  /* Laptop clock, Bengaluru time */
  const clock = $("#clock");
  if (clock) {
    const tick = () => {
      try { clock.textContent = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()); } catch { }
    };
    tick();
    setInterval(tick, 20000);
  }

  /* Desk easter eggs */
  let catMsg = 0, sips = 0;
  const catLines = ["The cat committee approves this portfolio.", "Meow? Translation: hire her.", "This one only judges kerning.", "Four cats on a monitor. Zero cats on deadline."];
  $$("[data-say]").forEach(b => b.addEventListener("click", () => {
    const k = b.dataset.say;
    if (k === "notes") say("My real to-do wall. Yes, every single note has cats on it.", 3000);
    if (k === "cats") say(catLines[catMsg++ % catLines.length]);
    if (k === "water") { sips++; say(sips % 4 === 0 ? "Refill time. You should drink some water too." : "Sip. Stay hydrated."); }
    if (k === "lamp") {
      const off = hero.classList.toggle("lamp-off");
      b.setAttribute("aria-label", off ? "Turn the sunset lamp on" : "Turn the sunset lamp off");
      say(off ? "Lights off. Just the screen glow now." : "Lamp on. Mood: restored.");
    }
  }));

  /* ---------- Parallax ---------- */
  const layers = $$("[data-depth]");
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  const pTarget = { x: 0, y: 0 }, pNow = { x: 0, y: 0 };
  let heroVisible = true;
  if (hero && "IntersectionObserver" in window) new IntersectionObserver((es) => { heroVisible = es[0].isIntersecting; hero.classList.toggle("paused", !heroVisible); }).observe(hero);
  const applyParallax = () => {
    if (!heroVisible || !layers.length) return;
    const ex = pTarget.x - pNow.x, ey = pTarget.y - pNow.y;
    if (Math.abs(ex) < 0.0005 && Math.abs(ey) < 0.0005) return;
    pNow.x += ex * 0.07;
    pNow.y += ey * 0.07;
    layers.forEach(l => {
      const d = parseFloat(l.dataset.depth);
      l.style.transform = `translate(${(-pNow.x * d / S).toFixed(2)}px, ${(-pNow.y * d * 0.6 / S).toFixed(2)}px) scale(1.035)`;
    });
  };
  layers.forEach(l => { l.style.transform = "scale(1.035)"; });

  /* ---------- Nav ---------- */
  const nav = $(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Expertise: one skill at a time ---------- */
  const skills = $$(".skill");
  const wide = window.matchMedia("(min-width: 1001px)");
  let skillTimer, userPicked = false;
  const pick = (i) => {
    skills.forEach((s, j) => {
      s.classList.toggle("on", i === j);
      $(".skill-name", s).setAttribute("aria-expanded", i === j ? "true" : "false");
    });
  };
  skills.forEach((s, i) => {
    const b = $(".skill-name", s);
    const choose = () => { if (!wide.matches) return; userPicked = true; clearInterval(skillTimer); pick(i); };
    b.addEventListener("mouseenter", choose);
    b.addEventListener("focus", choose);
    b.addEventListener("click", choose);
  });
  const skillsEl = $("#skills");
  if (skillsEl && "IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(([e]) => {
      clearInterval(skillTimer);
      if (e.isIntersecting && !userPicked && wide.matches) {
        skillTimer = setInterval(() => {
          const cur = skills.findIndex(s => s.classList.contains("on"));
          pick((cur + 1) % skills.length);
        }, 4200);
      }
    }, { threshold: 0.4 }).observe(skillsEl);
  }

  /* ---------- Reveal on scroll ---------- */
  const items = $$(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add("in"));
  }
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- The cat ---------- */
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch { } },
  };
  const catOK = !reduce;
  const touchMode = !fine;
  /* eyes glow only at night (visitor's local time) */
  const glowDefs = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  glowDefs.setAttribute("width", "0"); glowDefs.setAttribute("height", "0"); glowDefs.setAttribute("aria-hidden", "true");
  glowDefs.style.position = "absolute";
  glowDefs.innerHTML = '<filter id="ap-eye-glow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="1.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  document.body.appendChild(glowDefs);
  const isNight = () => { const h = new Date().getHours(); return h >= 18 || h < 6; };
  let cat = null, catOn = store.get("ap-cat") !== "off";
  const cs = { x: 80, y: window.innerHeight - 140, mode: "sit", rest: "sit", belly: 0, nextWander: Date.now() + 25000 + Math.random() * 20000, left: false, last: Date.now(), petting: false, override: null, pets: 0, hopLock: false };

  const heartPath = "M12 21s-7-4.4-9.3-8.6C1 9 3 5.5 6.5 5.5c2 0 3.3 1 4.1 2.3.8-1.3 2.1-2.3 4.1-2.3 3.5 0 5.5 3.5 3.8 6.9C19 16.6 12 21 12 21z";
  const walkSVG = `
    <path class="tail" d="M30 40 C 14 38, 8 22, 16 10" fill="none" stroke="#050303" stroke-width="7" stroke-linecap="round"/>
    <path class="leg leg-b" d="M30 46 L28 73" stroke="#050303" stroke-width="7" stroke-linecap="round"/>
    <path class="leg leg-a" d="M44 46 L44 73" stroke="#050303" stroke-width="7" stroke-linecap="round"/>
    <path class="leg leg-a" d="M76 46 L76 73" stroke="#050303" stroke-width="7" stroke-linecap="round"/>
    <path class="leg leg-b" d="M90 46 L92 73" stroke="#050303" stroke-width="7" stroke-linecap="round"/>
    <ellipse cx="60" cy="42" rx="32" ry="15" fill="#050303"/>
    <circle cx="92" cy="30" r="14" fill="#050303"/>
    <path d="M82 22 L84 7 L93 18 Z" fill="#050303"/>
    <path d="M95 18 L104 7 L105 23 Z" fill="#050303"/>
    <g class="eye"><ellipse class="iris" cx="98" cy="29" rx="2.8" ry="3.3"/><ellipse class="pupil" cx="98" cy="29" rx="0.85" ry="2.5"/></g>`;

  if (catOK) {
    cat = document.createElement("div");
    cat.className = "cat sit" + (catOn ? "" : " off");
    cat.setAttribute("aria-hidden", "true");
    cat.innerHTML = `
      <div class="cat-body"><div class="cat-face">
        <svg class="s-walk" viewBox="0 0 120 80">${walkSVG}</svg>
        <svg class="s-sit" viewBox="0 0 120 80">
          <path class="tail-s" d="M70 76 C 94 78, 102 66, 94 56" fill="none" stroke="#050303" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="58" cy="56" rx="18" ry="20" fill="#050303"/>
          <ellipse cx="44" cy="66" rx="13" ry="11" fill="#050303" stroke="#1E1210" stroke-width="1"/>
          <ellipse cx="38" cy="76" rx="7" ry="3.6" fill="#050303" stroke="#1E1210" stroke-width="1"/>
          <path d="M52 50 V73 a4.5 4 0 0 0 9 0 V50 Z" fill="#050303" stroke="#1E1210" stroke-width="1"/>
          <path d="M63 50 V73 a4.5 4 0 0 0 9 0 V50 Z" fill="#050303" stroke="#1E1210" stroke-width="1"/>
          <circle cx="58" cy="28" r="14" fill="#050303"/>
          <path class="ear-c l" d="M46 22 L46 6 L55 16 Z" fill="#050303"/>
          <path class="ear-c r" d="M61 16 L70 6 L70 22 Z" fill="#050303"/>
          <g class="eye"><ellipse class="iris" cx="53" cy="28" rx="2.6" ry="3.1"/><ellipse class="pupil" cx="53" cy="28" rx="0.8" ry="2.3"/></g>
          <g class="eye"><ellipse class="iris" cx="63" cy="28" rx="2.6" ry="3.1"/><ellipse class="pupil" cx="63" cy="28" rx="0.8" ry="2.3"/></g>
        </svg>
        <svg class="s-loaf" viewBox="0 0 120 80">
          <path class="tail-s" d="M84 70 C 98 72, 100 62, 92 58" fill="none" stroke="#050303" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="60" cy="64" rx="30" ry="14" fill="#050303"/>
          <ellipse cx="50" cy="77" rx="6.5" ry="3.2" fill="#050303" stroke="#1E1210" stroke-width="1"/>
          <ellipse cx="66" cy="77" rx="6.5" ry="3.2" fill="#050303" stroke="#1E1210" stroke-width="1"/>
          <circle cx="58" cy="46" r="14" fill="#050303"/>
          <path class="ear-c l" d="M46 40 L46 24 L55 34 Z" fill="#050303"/>
          <path class="ear-c r" d="M61 34 L70 24 L70 40 Z" fill="#050303"/>
          <g class="eye"><ellipse class="iris" cx="53" cy="46" rx="2.6" ry="3.1"/><ellipse class="pupil" cx="53" cy="46" rx="0.8" ry="2.3"/></g>
          <g class="eye"><ellipse class="iris" cx="63" cy="46" rx="2.6" ry="3.1"/><ellipse class="pupil" cx="63" cy="46" rx="0.8" ry="2.3"/></g>
        </svg>
        <svg class="s-groom" viewBox="0 0 120 80">
          <path class="tail-s" d="M70 76 C 94 78, 102 66, 94 56" fill="none" stroke="#050303" stroke-width="6" stroke-linecap="round"/>
          <ellipse cx="58" cy="56" rx="18" ry="20" fill="#050303"/>
          <ellipse cx="44" cy="66" rx="13" ry="11" fill="#050303" stroke="#1E1210" stroke-width="1"/>
          <path d="M63 50 V73 a4.5 4 0 0 0 9 0 V50 Z" fill="#050303" stroke="#1E1210" stroke-width="1"/>
          <g class="groom-head">
            <circle cx="56" cy="28" r="14" fill="#050303"/>
            <path d="M44 22 L43 6 L53 15 Z" fill="#050303"/>
            <path d="M59 15 L68 5 L69 21 Z" fill="#050303"/>
            <path d="M48 28 q3 2 6 0 M58 28 q3 2 6 0" fill="none" stroke="#BFB2AE" stroke-width="1.3" stroke-linecap="round"/>
            <path d="M54 35 q2 3 4 0" fill="#C7615A"/>
          </g>
          <path class="groom-paw" d="M52 52 C 50 44, 50 38, 54 35 a4.5 4.5 0 0 1 7 4 C 61 44, 60 48, 61 52 Z" fill="#050303" stroke="#1E1210" stroke-width="1"/>
        </svg>
        <svg class="s-belly" viewBox="0 0 120 80">
          <path class="tail-s" d="M88 64 C 104 66, 110 54, 102 46" fill="none" stroke="#050303" stroke-width="6" stroke-linecap="round"/>
          <g class="paws-up">
            <path class="pu a" d="M44 56 C 42 46, 36 42, 38 36" fill="none" stroke="#050303" stroke-width="7" stroke-linecap="round"/>
            <path class="pu b" d="M56 54 C 56 44, 52 40, 54 33" fill="none" stroke="#050303" stroke-width="7" stroke-linecap="round"/>
            <path class="pu a" d="M70 54 C 72 44, 70 40, 74 34" fill="none" stroke="#050303" stroke-width="7" stroke-linecap="round"/>
            <path class="pu b" d="M82 56 C 86 48, 86 42, 90 38" fill="none" stroke="#050303" stroke-width="7" stroke-linecap="round"/>
          </g>
          <ellipse cx="62" cy="62" rx="30" ry="13" fill="#050303"/>
          <ellipse cx="62" cy="57" rx="17" ry="6" fill="#241512"/>
          <circle cx="30" cy="62" r="13" fill="#050303"/>
          <path d="M22 72 L14 80 L26 76 Z" fill="#050303"/>
          <path d="M34 74 L34 84 L40 74 Z" fill="#050303"/>
          <path d="M24 60 q2.5 -2.5 5 0 M32 60 q2.5 -2.5 5 0" fill="none" stroke="#BFB2AE" stroke-width="1.3" stroke-linecap="round"/>
          <path d="M28 66 q2 1.6 4 0" fill="none" stroke="#BFB2AE" stroke-width="1.1" stroke-linecap="round"/>
        </svg>
        <svg class="s-sleep" viewBox="0 0 120 80">
          <g class="breathe">
            <path d="M26 66 C 26 80, 70 82, 82 72" fill="none" stroke="#050303" stroke-width="6" stroke-linecap="round"/>
            <ellipse cx="58" cy="62" rx="34" ry="14" fill="#050303"/>
          </g>
          <circle cx="86" cy="62" r="12" fill="#050303"/>
          <path d="M77 55 L79 42 L86 51 Z" fill="#050303"/>
          <path d="M88 51 L96 43 L96 56 Z" fill="#050303"/>
          <path d="M84 62 q3 2.5 6 0" fill="none" stroke="#BFB2AE" stroke-width="1.4" stroke-linecap="round"/>
          <text class="z" x="96" y="40" font-size="12">z</text>
          <text class="z z2" x="102" y="32" font-size="10">z</text>
          <text class="z z3" x="108" y="24" font-size="8">z</text>
        </svg>
      </div></div>
      <div class="hearts">${[0, 1, 2].map(() => `<svg viewBox="0 0 24 24"><path d="${heartPath}" fill="#FF4A3D"/></svg>`).join("")}</div>`;
    document.body.appendChild(cat);
    if (touchMode) {
      cat.classList.add("touch");
      cs.x = window.innerWidth - 104; cs.y = window.innerHeight - 78;
      cs.rest = "sleep"; cs.nextPose = Date.now() + 9000; cs.nextWander = Date.now() + 18000 + Math.random() * 15000;
      /* tap to pet, double tap for belly rubs */
      let lastTap = 0;
      cat.addEventListener("touchstart", () => {
        const t = Date.now();
        cat.classList.add("purr"); clearTimeout(cs.purrT); cs.purrT = setTimeout(() => { if (Date.now() >= cs.belly) cat.classList.remove("purr"); }, 1600);
        if (t - lastTap < 320) { cs.belly = t + 7000; cs.override = null; say("Belly rubs unlocked.", 2000); }
        else if (cs.mode === "sleep") { cs.rest = "sit"; cs.nextPose = t + 6000; }
        lastTap = t;
      }, { passive: true });
    }

    cat.addEventListener("mouseenter", () => { cs.petting = true; cs.last = Date.now(); cat.classList.add("purr"); });
    cat.addEventListener("mouseleave", () => { cs.petting = false; if (Date.now() >= cs.belly) cat.classList.remove("purr"); });
    cat.addEventListener("dblclick", (e) => {
      e.preventDefault();
      cs.belly = Date.now() + 7000; cs.override = null;
      cat.classList.add("purr");
      say("Belly rubs unlocked. Careful, it might be a trap.", 2600);
    });
    cat.addEventListener("click", () => {
      if (Date.now() < cs.belly) { cs.belly = Date.now() + 7000; return; }
      cs.pets++;
      if (cs.pets === 1) say("Prrrr.");
      if (cs.pets === 3) { if (isNight()) say("Her eyes are glowing. She sees everything at night."); else { rollEyes(); say("She rolled her eyes at you. That means she likes you."); } }
      if (cs.pets === 5) say("Five pets. You are officially the cat’s favourite recruiter.", 3200);
    });

    const toggle = document.createElement("button");
    toggle.className = "cat-toggle";
    toggle.type = "button";
    const setToggle = () => {
      toggle.setAttribute("aria-pressed", catOn ? "false" : "true");
      toggle.setAttribute("aria-label", catOn ? "Send the cat to sleep" : "Wake the cat up");
      toggle.title = catOn ? "Send the cat to sleep" : "Wake the cat up";
    };
    toggle.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><ellipse cx="12" cy="16" rx="4.6" ry="3.8"/><circle cx="6.2" cy="10.4" r="2"/><circle cx="10" cy="7" r="2"/><circle cx="14" cy="7" r="2"/><circle cx="17.8" cy="10.4" r="2"/></svg>`;
    setToggle();
    toggle.addEventListener("click", () => {
      catOn = !catOn;
      store.set("ap-cat", catOn ? "on" : "off");
      cat.classList.toggle("off", !catOn);
      setToggle();
      say(catOn ? "The cat is back on duty." : "The cat is taking a nap. Tap the paw to wake her.");
    });
    document.body.appendChild(toggle);
  }

  const setMode = (m) => {
    if (cs.mode === m) return;
    cat.classList.remove("walk", "sit", "sleep", "loaf", "groom", "belly");
    cat.classList.add(m);
    cs.mode = m;
  };
  const playOnce = (cls, ms) => {
    cat.classList.remove(cls);
    void cat.offsetWidth;
    cat.classList.add(cls);
    setTimeout(() => cat.classList.remove(cls), ms);
  };

  let VW = window.innerWidth, VH = window.innerHeight;
  window.addEventListener("resize", () => { VW = window.innerWidth; VH = window.innerHeight; }, { passive: true });
  window.addEventListener("mousemove", e => {
    const jump = Math.abs(e.clientX - mx) + Math.abs(e.clientY - my);
    mx = e.clientX; my = e.clientY;
    cs.last = Date.now();
    pTarget.x = (mx / VW) * 2 - 1;
    pTarget.y = (my / VH) * 2 - 1;
    if (cat && catOn && jump > 140 && !cs.hopLock && cs.mode !== "sleep") {
      cs.hopLock = true;
      playOnce("hop", 450);
      setTimeout(() => { cs.hopLock = false; }, 1200);
    }
  }, { passive: true });
  document.addEventListener("mouseleave", () => { pTarget.x = 0; pTarget.y = 0; });

  let pupils = null, lastPupil = "", lastCatTf = "";
  let roll = null, nextRoll = performance.now() + 9000 + Math.random() * 8000;
  function rollEyes() { roll = { t0: performance.now() }; }
  const setNight = () => { if (cat) cat.classList.toggle("night", isNight()); };
  setNight(); setInterval(setNight, 60000);
  const lookAt = () => {
    if (!cat || !catOn) return;
    const now = performance.now();
    let px, py;
    if (roll) {
      const k = (now - roll.t0) / 1100;
      if (k >= 1.35) { roll = null; nextRoll = now + 12000 + Math.random() * 12000; }
      else { const a = Math.PI - Math.PI * Math.min(1, k); px = Math.cos(a) * 1.2; py = -Math.abs(Math.sin(a)) * 1.25 - (k > 1 ? 1.1 : 0); }
    }
    if (!roll) {
      if ((cs.mode === "sit" || cs.mode === "loaf") && now > nextRoll && !isNight()) rollEyes();
      const sitting = cs.mode !== "walk";
      const hx = cs.x + (sitting ? 58 : (cs.left ? 120 - 98 : 98)), hy = cs.y + (cs.mode === "loaf" ? 46 : sitting ? 28 : 29);
      const dx = mx - hx, dy = my - hy, d = Math.hypot(dx, dy) || 1, m = Math.min(1, d / 160);
      px = (dx / d) * 1.15 * m * (cs.left ? -1 : 1); py = (dy / d) * 0.9 * m;
    }
    const tf = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px)`;
    if (tf === lastPupil) return;
    lastPupil = tf;
    if (!pupils) pupils = Array.from(cat.querySelectorAll(".pupil"));
    pupils.forEach((el) => { el.style.transform = tf; });
  };
  const loop = () => {
    if (!reduce && fine) applyParallax();
    if (cat && catOn) {
      if (touchMode && (VW !== window.innerWidth || VH !== window.innerHeight)) { VW = window.innerWidth; VH = window.innerHeight; }
      const now = Date.now();
      const catCx = cs.x + 60;
      let tx, ty;
      const onBelly = now < cs.belly;
      if (!onBelly && cat.classList.contains("purr") && !cs.petting) cat.classList.remove("purr");
      /* now and then she stops following and wanders off to sit somewhere */
      if (!cs.override && !onBelly && !cs.petting && now > cs.nextWander) {
        cs.override = touchMode
          ? { x: 10 + Math.random() * (VW - 120), y: VH * 0.35 + Math.random() * (VH * 0.65 - 80), until: now + 10000 + Math.random() * 8000, wander: true }
          : { x: 40 + Math.random() * (VW - 200), y: 120 + Math.random() * (VH - 240), until: now + 9000 + Math.random() * 7000, wander: true };
        cs.nextWander = now + (touchMode ? 25000 + Math.random() * 25000 : 40000 + Math.random() * 40000);
      }
      if (cs.override && now >= cs.override.until) cs.override = null;
      if (cs.override) { tx = cs.override.x; ty = cs.override.y; }
      else if (touchMode) { tx = VW - 104; ty = VH - 78; }
      else { tx = mx < catCx ? mx + 24 : mx - 150; ty = my - 40; }
      tx = Math.max(0, Math.min(VW - 120, tx));
      ty = Math.max(70, Math.min(VH - (touchMode ? 78 : 80), ty));
      const dx = tx - cs.x, dy = ty - cs.y;
      let moving = false;
      if (!cs.petting && !onBelly && Math.hypot(dx, dy) > 6) {
        let sx = dx * 0.05, sy = dy * 0.05;
        const m = Math.hypot(sx, sy), cap = cs.override && cs.override.wander ? (touchMode ? 2.2 : 4) : (touchMode ? 3 : 10);
        if (m > cap) { sx = sx / m * cap; sy = sy / m * cap; }
        cs.x += sx; cs.y += sy;
        moving = m > 0.6;
      }
      if (moving && cs.mode !== "walk") { const r = Math.random(); cs.rest = r < 0.45 ? "sit" : r < 0.8 ? "loaf" : "groom"; }
      if (touchMode && !moving && now > (cs.nextPose || 0)) {
        const poses = ["sleep", "sleep", "groom", "loaf", "sit"];
        cs.rest = poses[Math.floor(Math.random() * poses.length)];
        cs.nextPose = now + 8000 + Math.random() * 7000;
      }
      const idle = !touchMode && now - cs.last > 9000 && !cs.petting && !(cs.override && cs.override.wander);
      setMode(onBelly ? "belly" : moving ? "walk" : idle ? "sleep" : cs.rest);
      const left = moving ? (Math.abs(dx) > 3 ? dx < 0 : cs.left) : (cs.override || onBelly || touchMode ? cs.left : mx < cs.x + 60);
      if (left !== cs.left) { cs.left = left; cat.classList.toggle("left", left); }
      const ctf = `translate3d(${cs.x.toFixed(1)}px, ${cs.y.toFixed(1)}px, 0)`;
      if (ctf !== lastCatTf) { cat.style.transform = ctf; lastCatTf = ctf; }
      if (cs.mode === "sit" || cs.mode === "loaf" || cs.mode === "walk") lookAt();
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);

  /* Email: copy it, and the cat walks over to "deliver" it */
  $$("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const email = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(email);
        btn.classList.add("is-copied");
        setTimeout(() => btn.classList.remove("is-copied"), 2200);
        if (cat && catOn) {
          const r = btn.getBoundingClientRect();
          cs.override = { x: r.left + r.width / 2 - 60, y: r.bottom + 6, until: Date.now() + 2600 };
          say("Email copied. The cat will deliver it personally.");
        } else {
          say("Email copied.");
        }
      } catch {
        window.location.href = `mailto:${email}`;
      }
    });
  });

  /* Logo: five quick clicks and the cat shows off */
  const logo = $(".logo");
  let logoClicks = 0, logoT;
  if (logo) logo.addEventListener("click", e => {
    const onHome = /index\.html$|\/$/.test(location.pathname);
    if (!onHome) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    logoClicks++;
    clearTimeout(logoT);
    logoT = setTimeout(() => { logoClicks = 0; }, 1500);
    if (logoClicks >= 5 && cat) {
      logoClicks = 0;
      if (!catOn) { catOn = true; cat.classList.remove("off"); store.set("ap-cat", "on"); }
      playOnce("spin", 1900);
      say("You found the logo trick. The cat is showing off now.");
    }
  });

  /* "black cat" in the intro: one crosses your path */
  const egg = $("#egg");
  let crossing = false;
  const crossPath = () => {
    if (crossing || reduce) return;
    crossing = true;
    const c = document.createElement("div");
    c.className = "crosser" + (isNight() ? " night" : "");
    c.setAttribute("aria-hidden", "true");
    c.innerHTML = `<svg viewBox="0 0 120 80">${walkSVG}</svg>`;
    document.body.appendChild(c);
    say("A black cat just crossed your path. Around here, that means good luck.", 3200);
    setTimeout(() => { c.remove(); crossing = false; }, 3300);
  };
  if (egg) { egg.addEventListener("mouseenter", crossPath); egg.addEventListener("focus", crossPath); egg.addEventListener("click", crossPath); }

  /* ---------- "View" cursor ---------- */
  const viewTargets = $$(".project[href], .fig a, .portrait, .next");
  if (fine && !reduce && viewTargets.length) {
    const vc = document.createElement("div");
    vc.className = "view-cursor"; vc.setAttribute("aria-hidden", "true"); vc.textContent = "View";
    document.body.appendChild(vc);
    let vx = -200, vy = -200, vtx = -200, vty = -200, on = false, scale = 0.4;
    viewTargets.forEach((el) => {
      el.classList.add("has-view");
      el.addEventListener("mouseenter", () => { on = true; vc.classList.add("on"); vc.textContent = el.matches(".project, .next") ? "View project" : "View"; vc.style.fontSize = el.matches(".project, .next") ? "12px" : "14px"; });
      el.addEventListener("mouseleave", () => { on = false; vc.classList.remove("on"); });
    });
    let running = false;
    const tick = () => {
      vx += (vtx - vx) * 0.22; vy += (vty - vy) * 0.22;
      scale += ((on ? 1 : 0.4) - scale) * 0.2;
      vc.style.transform = `translate3d(${vx.toFixed(1)}px, ${vy.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      if (Math.abs(vtx - vx) + Math.abs(vty - vy) < 0.3 && Math.abs((on ? 1 : 0.4) - scale) < 0.002) { running = false; return; }
      requestAnimationFrame(tick);
    };
    const wake = () => { if (!running) { running = true; requestAnimationFrame(tick); } };
    window.addEventListener("mousemove", (e) => { vtx = e.clientX; vty = e.clientY; if (vx < -100) { vx = vtx; vy = vty; } if (on || scale > 0.41) wake(); }, { passive: true });
    viewTargets.forEach((el) => { el.addEventListener("mouseenter", wake); el.addEventListener("mouseleave", wake); });
  }

  /* ---------- Lightbox: view pictures, go back and forth ---------- */
  const lbItems = [];
  $$(".fig a").forEach((a) => { const img = $("img", a); if (img) lbItems.push({ trigger: a, src: a.getAttribute("href") || img.src, alt: img.alt, cap: ($("figcaption", a.parentElement) || {}).textContent || img.alt }); });
  $$(".portrait").forEach((p) => { const img = $("img", p); if (img) lbItems.push({ trigger: p, src: img.src, alt: img.alt, cap: img.alt }); });
  if (lbItems.length) {
    const icon = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
    const lb = document.createElement("div");
    lb.className = "lb"; lb.setAttribute("role", "dialog"); lb.setAttribute("aria-modal", "true"); lb.setAttribute("aria-label", "Image preview");
    lb.innerHTML = `<div class="lb-stage"><img alt=""><button class="lb-btn lb-side lb-prev" type="button" aria-label="Previous image">${icon("M15 18l-6-6 6-6")}</button><button class="lb-btn lb-side lb-next" type="button" aria-label="Next image">${icon("M9 18l6-6-6-6")}</button><button class="lb-btn lb-close" type="button" aria-label="Close preview">${icon("M18 6L6 18M6 6l12 12")}</button></div><div class="lb-bar"><button class="lb-btn lb-prev" type="button" aria-label="Previous image">${icon("M15 18l-6-6 6-6")}</button><span class="count"></span><span class="lb-cap"></span><button class="lb-btn lb-next" type="button" aria-label="Next image">${icon("M9 18l6-6-6-6")}</button></div>`;
    document.body.appendChild(lb);
    const lbImg = $(".lb-stage img", lb), lbCount = $(".count", lb), lbCap = $(".lb-cap", lb);
    let cur = 0, lastFocus = null;
    const showLb = (i) => {
      cur = (i + lbItems.length) % lbItems.length;
      const it = lbItems[cur];
      lbImg.classList.remove("ready");
      const stage = lbImg.parentElement;
      const fit = () => { stage.classList.toggle("long", lbImg.naturalHeight > lbImg.naturalWidth * 1.6); stage.scrollTop = 0; };
      lbImg.onload = () => { fit(); lbImg.classList.add("ready"); };
      lbImg.src = it.src; lbImg.alt = it.alt || "";
      if (lbImg.complete) { fit(); lbImg.classList.add("ready"); }
      lbCount.textContent = `${cur + 1} / ${lbItems.length}`;
      lbCap.textContent = it.cap || "";
      const next = lbItems[(cur + 1) % lbItems.length]; if (next) { const pre = new Image(); pre.src = next.src; }
    };
    const openLb = (i) => { lastFocus = document.activeElement; showLb(i); lb.classList.add("open"); document.body.classList.add("lb-lock"); $(".lb-close", lb).focus(); };
    const closeLb = () => { lb.classList.remove("open"); document.body.classList.remove("lb-lock"); if (lastFocus) lastFocus.focus(); };
    lbItems.forEach((it, i) => {
      it.trigger.addEventListener("click", (e) => { e.preventDefault(); openLb(i); });
      if (!it.trigger.matches("a, button")) { it.trigger.setAttribute("tabindex", "0"); it.trigger.setAttribute("role", "button"); it.trigger.setAttribute("aria-label", "View " + (it.alt || "image")); it.trigger.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i); } }); }
    });
    $$(".lb-prev", lb).forEach((b) => b.addEventListener("click", () => showLb(cur - 1)));
    $$(".lb-next", lb).forEach((b) => b.addEventListener("click", () => showLb(cur + 1)));
    $(".lb-close", lb).addEventListener("click", closeLb);
    lb.addEventListener("click", (e) => { if (e.target === lb || e.target.classList.contains("lb-stage")) closeLb(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowRight") showLb(cur + 1);
      if (e.key === "ArrowLeft") showLb(cur - 1);
      if (e.key === "Tab") { const f = $$("button", lb); const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
    });
    let sx = null;
    lb.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", (e) => { if (sx === null) return; const d = e.changedTouches[0].clientX - sx; if (Math.abs(d) > 50) showLb(cur + (d < 0 ? 1 : -1)); sx = null; });
  }

  /* ---- Outside work: stacked cards ---- */
  (function () {
    const deck = document.getElementById("deck");
    if (!deck) return;
    let cards = Array.from(deck.querySelectorAll(".card-h"));
    const copy = document.getElementById("odCopy"), t = document.getElementById("odTitle"), l = document.getElementById("odLine");
    const render = () => cards.forEach((c, i) => { c.style.setProperty("--i", i); c.classList.remove("out"); c.tabIndex = i === 0 ? 0 : -1; c.setAttribute("aria-hidden", i === 0 ? "false" : "true"); });
    let busy = false;
    deck.addEventListener("click", () => {
      if (busy) return; busy = true;
      cards[0].classList.add("out"); copy.classList.add("swap");
      setTimeout(() => {
        cards.push(cards.shift()); render();
        t.textContent = cards[0].dataset.title; l.textContent = cards[0].dataset.line;
        copy.classList.remove("swap"); busy = false;
      }, 420);
    });
    render();
  })();

  /* ---- Expertise scenes: step through each animation while its panel is open ---- */
  (function () {
    const reduceM = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelectorAll(".viz[data-steps]").forEach((v) => {
      const n = +v.dataset.steps; let s = 0;
      if (reduceM) { v.dataset.step = n - 1; return; }
      setInterval(() => {
        const panel = v.closest(".skill");
        const open = !panel || panel.classList.contains("on") || getComputedStyle(panel).display === "block";
        if (!open || document.hidden) return;
        s = (s + 1) % n; v.dataset.step = s;
      }, 2400);
    });
  })();
})();

/* Outside work strip */
(() => {
  const strip = document.getElementById("strip"); if (!strip) return;
  const items = Array.from(strip.querySelectorAll(".strip-item"));
  items.forEach((it) => it.addEventListener("click", () => {
    items.forEach((o) => { const on = o === it; o.classList.toggle("on", on); o.setAttribute("aria-expanded", on); });
  }));
})();

/* Outside work: polaroids (tap to straighten on touch) */
(() => {
  const pols = Array.from(document.querySelectorAll(".pol")); if (!pols.length) return;
  pols.forEach((p) => p.addEventListener("click", () => { const was = p.classList.contains("on"); pols.forEach((o) => o.classList.remove("on")); if (!was) p.classList.add("on"); }));
})();

/* Horizontal scrollers: arrow buttons */
(() => {
  document.querySelectorAll(".hscroll").forEach((box) => {
    const track = box.querySelector(".hs-track");
    const head = box.previousElementSibling;
    const prev = head && head.querySelector(".hs-prev"), next = head && head.querySelector(".hs-next");
    const sync = () => {
      const max = track.scrollWidth - track.clientWidth - 2;
      if (prev) prev.disabled = track.scrollLeft <= 2;
      if (next) next.disabled = track.scrollLeft >= max;
      box.classList.toggle("end", track.scrollLeft >= max);
      if (head) head.querySelector(".hs-btns").hidden = max <= 0;
    };
    const go = (d) => track.scrollBy({ left: d * track.clientWidth * 0.8, behavior: "smooth" });
    if (prev) prev.addEventListener("click", () => go(-1));
    if (next) next.addEventListener("click", () => go(1));
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    track.querySelectorAll("img").forEach((i) => i.addEventListener("load", sync));
    sync();
  });
})();

/* Pause decorative loops when they are off screen */
(() => {
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("paused", !e.isIntersecting)), { rootMargin: "100px" });
  document.querySelectorAll(".line-scroll, .marquee, .viz").forEach((el) => io.observe(el));
})();

/* ---------- Touch: black paw prints follow your finger ---------- */
(() => {
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.className = "paws"; layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  const PAW = '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="15.6" rx="5.2" ry="4.4"/><ellipse cx="5.6" cy="9.6" rx="2.1" ry="2.7" transform="rotate(-20 5.6 9.6)"/><ellipse cx="9.6" cy="5.6" rx="2.2" ry="2.8" transform="rotate(-6 9.6 5.6)"/><ellipse cx="14.4" cy="5.6" rx="2.2" ry="2.8" transform="rotate(6 14.4 5.6)"/><ellipse cx="18.4" cy="9.6" rx="2.1" ry="2.7" transform="rotate(20 18.4 9.6)"/></svg>';
  let last = null, travelled = 0, side = 1, count = 0;
  const MAX = 28;
  const stamp = (x, y, angle) => {
    side = -side;
    const off = 7 + Math.random() * 3, jit = (Math.random() - 0.5) * 16;
    const a = angle + jit * Math.PI / 180;
    const px = x + Math.cos(a + Math.PI / 2) * off * side + (Math.random() - 0.5) * 4;
    const py = y + Math.sin(a + Math.PI / 2) * off * side + (Math.random() - 0.5) * 4;
    const el = document.createElement("i");
    el.innerHTML = PAW;
    el.style.transform = `translate(${px - 11}px, ${py - 11}px) rotate(${(a * 180 / Math.PI + 90).toFixed(0)}deg) scale(${(0.85 + Math.random() * 0.25).toFixed(2)})`;
    layer.appendChild(el);
    if (++count > MAX) { const f = layer.firstChild; if (f) f.remove(); count--; }
    setTimeout(() => { el.remove(); count = Math.max(0, count - 1); }, 1900);
  };
  window.addEventListener("touchstart", (e) => {
    const t = e.touches[0]; if (!t) return;
    last = { x: t.clientX, y: t.clientY }; travelled = 0;
    stamp(t.clientX, t.clientY, -Math.PI / 2);
  }, { passive: true });
  window.addEventListener("touchmove", (e) => {
    const t = e.touches[0]; if (!t || !last) return;
    const dx = t.clientX - last.x, dy = t.clientY - last.y, d = Math.hypot(dx, dy);
    travelled += d;
    if (travelled >= 30) { stamp(t.clientX, t.clientY, Math.atan2(dy, dx)); travelled = 0; }
    last = { x: t.clientX, y: t.clientY };
  }, { passive: true });
  window.addEventListener("touchend", () => { last = null; }, { passive: true });
})();
