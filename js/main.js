/* ══════════════════════════════════════════════════════════
   모션인식 수학 올림픽 포털 — 메인 스크립트
   학년별 링크는 아래 GRADES 배열 한 곳에서만 수정하면 됩니다.
   ══════════════════════════════════════════════════════════ */

/* ─────────── 학년 데이터 ─────────── */
const GRADES = [
  {
    grade: 1,
    label: '1학년',
    title: '동계올림픽',
    emoji: '❄️',
    desc: '1학년 눈높이에 맞춘 수 세기와 동계올림픽 스포츠 모션 게임!',
    url: 'https://motion-math-olympics-1st.vercel.app',
    bg: 'linear-gradient(150deg, #CFF0FF 0%, #9BDCF7 100%)',
    stars: 1,
  },
  {
    grade: 2,
    label: '2학년',
    title: '하계올림픽',
    emoji: '☀️',
    desc: '신나는 하계 스포츠 종목과 함께하는 기초 수학 도전!',
    url: 'https://motion-math-olympics.vercel.app',
    bg: 'linear-gradient(150deg, #FFF0B8 0%, #FFD166 100%)',
    stars: 2,
  },
  {
    grade: 3,
    label: '3학년',
    title: '속도 도전 & 태그형 경쟁',
    emoji: '⚡',
    desc: '빠른 반응속도로 정답을 맞히고 상대를 따돌리는 수 스피드 게임!',
    url: 'https://motion-math-olympics-3rd.vercel.app',
    bg: 'linear-gradient(150deg, #FFD3D3 0%, #FF9E9E 100%)',
    stars: 3,
  },
  {
    grade: 4,
    label: '4학년',
    title: '동작 도전 & 영역형 경쟁',
    emoji: '🎯',
    desc: '정확한 운동 동작으로 구역을 점령해 나가는 전략 수학 올림픽!',
    url: 'https://motion-math-olympics-4th.vercel.app',
    bg: 'linear-gradient(150deg, #C6F7E6 0%, #7CE0C1 100%)',
    stars: 4,
  },
  {
    grade: 5,
    label: '5학년',
    title: '거리 도전 & 필드형 경쟁',
    emoji: '⚾',
    desc: '더 멀리, 더 정확하게! 거리 개념과 함께하는 필드 수학 도전!',
    url: 'https://motion-math-olympics-5th.vercel.app',
    bg: 'linear-gradient(150deg, #CDE9F5 0%, #8CC9E0 100%)',
    stars: 5,
  },
  {
    grade: 6,
    label: '6학년',
    title: '커밍순 (제작 예정)',
    emoji: '🚀',
    desc: '6학년 형님들을 위한 최고 난이도 올림픽이 곧 오픈됩니다!',
    url: '#',
    bg: 'linear-gradient(150deg, #E7EDF3 0%, #C7D2DD 100%)',
    stars: 5,
    locked: true,
    badge: '준비 중! 🛠️',
  },
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ─────────── 효과음 (WebAudio · 에셋 없음) ─────────── */
const Sfx = (() => {
  let ctx = null;
  let on = localStorage.getItem('mmo-sound') !== 'off';

  const ensure = () => {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  const tone = (freq, dur = 0.09, type = 'square', vol = 0.05) => {
    if (!on) return;
    const c = ensure();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gain.gain.setValueAtTime(vol, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + dur);
  };

  return {
    get on() { return on; },
    toggle() {
      on = !on;
      localStorage.setItem('mmo-sound', on ? 'on' : 'off');
      if (on) tone(880, 0.1);
      return on;
    },
    hover() { tone(660, 0.05, 'triangle', 0.03); },
    click() { tone(523, 0.07); setTimeout(() => tone(784, 0.11), 60); },
    punch() { tone(180, 0.09, 'sawtooth', 0.05); },
    coin()  { tone(988, 0.06); setTimeout(() => tone(1319, 0.16), 60); },
    nope()  { tone(196, 0.16, 'sawtooth', 0.04); },
  };
})();

/* ─────────── 로딩 화면 ─────────── */
const hideLoader = () => {
  const el = document.getElementById('loader');
  if (el) el.classList.add('hide');
};
window.addEventListener('load', () => setTimeout(hideLoader, reduceMotion ? 0 : 900));
setTimeout(hideLoader, 3500); // 폰트/CDN 지연 대비 안전장치

/* ─────────── 배경 수학 기호 ─────────── */
(() => {
  const host = document.getElementById('bgSymbols');
  if (!host || reduceMotion) return;
  const marks = ['+', '−', '×', '÷', '=', '%', '√', 'π', '3', '7', '9', '½'];
  const frag = document.createDocumentFragment();
  for (let i = 0; i < 22; i++) {
    const s = document.createElement('span');
    s.className = 'sym';
    s.textContent = marks[i % marks.length];
    s.style.left = `${Math.random() * 96}%`;
    s.style.top = `${Math.random() * 96}%`;
    s.style.fontSize = `${24 + Math.random() * 64}px`;
    s.style.setProperty('--dur', `${9 + Math.random() * 12}s`);
    s.style.setProperty('--delay', `${-Math.random() * 10}s`);
    s.style.setProperty('--rot', `${-25 + Math.random() * 50}deg`);
    frag.appendChild(s);
  }
  host.appendChild(frag);
})();

/* ─────────── 흐르는 띠 ─────────── */
(() => {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const items = [
    '🏃 뛰고 점프하며 배우는 수학',
    '🏅 1학년부터 6학년까지',
    '📷 웹캠 하나면 준비 끝',
    '🤸 앉아서 배우지 말고 움직이며 배우자',
    '⚡ AI 모션인식 수학 놀이터',
    '🎮 매스 핏 플로우도 만나 보세요',
  ];
  const html = items.map((t) => `<span>${t}</span>`).join('');
  track.innerHTML = html + html; // 무한 루프용 2배
})();

/* ─────────── 학년 카드 렌더 ─────────── */
(() => {
  const grid = document.getElementById('gradeGrid');
  if (!grid) return;

  GRADES.forEach((g, i) => {
    const locked = !!g.locked;
    const el = document.createElement(locked ? 'div' : 'a');
    el.className = `grade-card reveal${locked ? ' locked' : ''}`;
    el.style.setProperty('--bg', g.bg);
    el.style.setProperty('--i', i);

    if (!locked) {
      el.href = g.url;
      el.target = '_blank';
      el.rel = 'noopener';
    } else {
      el.setAttribute('aria-disabled', 'true');
    }

    el.innerHTML = `
      <span class="grade-shine" aria-hidden="true"></span>
      ${g.badge ? `<span class="grade-badge">${g.badge}</span>` : ''}
      ${locked ? '<span class="grade-lock" aria-hidden="true">🔒</span>' : ''}
      <div class="grade-top">
        <span class="grade-num">${g.grade}</span>
        <span class="grade-emoji" aria-hidden="true">${g.emoji}</span>
      </div>
      <p class="grade-label">${g.label}</p>
      <h3 class="grade-title">${g.title}</h3>
      <p class="grade-desc">${g.desc}</p>
      <div class="grade-foot">
        <span class="grade-stars" title="난이도 ${g.stars}단계">${'★'.repeat(g.stars)}${'☆'.repeat(5 - g.stars)}</span>
        <span class="grade-go">${locked ? '곧 만나요 🛠️' : '출발! 🚩'}</span>
      </div>
    `;

    el.addEventListener('mouseenter', () => (locked ? Sfx.nope() : Sfx.hover()));
    el.addEventListener('click', (e) => {
      if (locked) {
        e.preventDefault();
        Sfx.nope();
        return;
      }
      Sfx.click();
      const r = el.getBoundingClientRect();
      confetti(r.left + r.width / 2, r.top + r.height / 2);
    });

    grid.appendChild(el);
  });
})();

/* ─────────── 공통 효과음 바인딩 ─────────── */
document.querySelectorAll('.sfx').forEach((el) => {
  el.addEventListener('mouseenter', () => Sfx.hover());
  el.addEventListener('click', () => Sfx.click());
});

const soundBtn = document.getElementById('soundBtn');
if (soundBtn) {
  const icon = document.getElementById('soundIcon');
  const sync = () => {
    soundBtn.classList.toggle('off', !Sfx.on);
    icon.textContent = Sfx.on ? '🔊' : '🔇';
  };
  sync();
  soundBtn.addEventListener('click', () => { Sfx.toggle(); sync(); });
}

/* ─────────── 스크롤 등장 ─────────── */
(() => {
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((t) => t.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach((t) => io.observe(t));
})();

/* ─────────── 숫자 카운트업 ─────────── */
(() => {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      io.unobserve(el);
      if (el.dataset.text) { el.textContent = el.dataset.text; return; }
      const goal = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1100;
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(goal * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.4 });
  nums.forEach((n) => io.observe(n));
})();

/* ─────────── 히어로 라이브 데모 ─────────── */
(() => {
  const qEl = document.getElementById('demoQ');
  const ansEl = document.getElementById('demoAnswers');
  const fistEl = document.getElementById('demoFist');
  const burstEl = document.getElementById('demoBurst');
  const playerEl = document.getElementById('demoPlayer');
  const scoreEl = document.getElementById('demoScore');
  const hintEl = document.getElementById('demoHint');
  if (!qEl || !ansEl) return;

  let score = 0;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearAll = () => { timers.forEach(clearTimeout); timers = []; };

  const makeProblem = () => {
    const kind = Math.random();
    let a, b, text, answer;
    if (kind < 0.4) {
      a = 2 + Math.floor(Math.random() * 8);
      b = 2 + Math.floor(Math.random() * 8);
      text = `${a} × ${b} = ?`; answer = a * b;
    } else if (kind < 0.7) {
      a = 12 + Math.floor(Math.random() * 60);
      b = 3 + Math.floor(Math.random() * 30);
      text = `${a} + ${b} = ?`; answer = a + b;
    } else {
      a = 30 + Math.floor(Math.random() * 60);
      b = 3 + Math.floor(Math.random() * 25);
      text = `${a} − ${b} = ?`; answer = a - b;
    }
    const opts = new Set([answer]);
    while (opts.size < 3) {
      const delta = 1 + Math.floor(Math.random() * 9);
      const wrong = answer + (Math.random() < 0.5 ? -delta : delta);
      if (wrong > 0) opts.add(wrong);
    }
    return { text, answer, options: [...opts].sort(() => Math.random() - 0.5) };
  };

  const round = () => {
    clearAll();
    const p = makeProblem();
    qEl.textContent = p.text;
    qEl.style.animation = 'none';
    void qEl.offsetWidth;
    qEl.style.animation = 'pop-in .35s ease';

    ansEl.innerHTML = '';
    const nodes = p.options.map((v) => {
      const n = document.createElement('div');
      n.className = 'ans';
      n.textContent = v;
      ansEl.appendChild(n);
      return n;
    });

    hintEl.textContent = '정답을 향해 펀치! 👊';
    fistEl.className = 'demo-fist';
    playerEl.className = 'demo-player';

    // 오답들은 스쿼트로 회피
    later(() => {
      nodes.forEach((n, i) => { if (p.options[i] !== p.answer) n.classList.add('dodge'); });
      playerEl.classList.add('squat');
      hintEl.textContent = '오답은 스쿼트로 피하기! 🏋️';
      later(() => playerEl.classList.remove('squat'), 480);
    }, 900);

    // 정답을 향해 펀치
    later(() => {
      const idx = p.options.indexOf(p.answer);
      const target = nodes[idx];
      const box = target.getBoundingClientRect();
      const stage = ansEl.parentElement.getBoundingClientRect();
      const x = box.left + box.width / 2 - stage.left;
      const y = box.top + box.height / 2 - stage.top;

      fistEl.classList.add('go');
      fistEl.style.transform = `translate(${x - 22}px, ${y - 140}px) scale(1.25) rotate(-12deg)`;
      playerEl.classList.add('punch');
      Sfx.punch();

      later(() => {
        target.classList.add('hit');
        burstEl.style.left = `${x}px`;
        burstEl.style.top = `${y}px`;
        burstEl.classList.remove('go');
        void burstEl.offsetWidth;
        burstEl.classList.add('go');
        Sfx.coin();
        score += 10;
        scoreEl.textContent = score;
        hintEl.textContent = '정답! 나이스 펀치 🎉';
        nodes.forEach((n) => { if (n !== target) n.classList.add('gone'); });
      }, 190);

      later(() => {
        fistEl.className = 'demo-fist';
        fistEl.style.transform = '';
        playerEl.classList.remove('punch');
      }, 700);
    }, 1700);

    later(round, 3400);
  };

  // 화면에 보일 때만 동작 (배터리·성능 배려)
  let running = false;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !running) { running = true; round(); }
      else if (!e.isIntersecting && running) { running = false; clearAll(); }
    });
  }, { threshold: 0.25 });
  io.observe(document.querySelector('.demo-stage'));
})();

/* ─────────── 색종이 ─────────── */
const confetti = (() => {
  const canvas = document.getElementById('confetti');
  if (!canvas) return () => {};
  const ctx = canvas.getContext('2d');
  let pieces = [];
  let raf = null;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['#FFD166', '#FF6B6B', '#06D6A0', '#118AB2', '#FFFFFF'];

  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = pieces.filter((p) => p.life > 0);
    pieces.forEach((p) => {
      p.life--;
      p.vy += 0.28;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.min(1, p.life / 24);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.62);
      ctx.restore();
    });
    if (pieces.length) raf = requestAnimationFrame(tick);
    else { raf = null; ctx.clearRect(0, 0, canvas.width, canvas.height); }
  };

  return (x, y) => {
    if (reduceMotion) return;
    for (let i = 0; i < 46; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      pieces.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5,
        s: 7 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: -0.2 + Math.random() * 0.4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 70 + Math.random() * 40,
      });
    }
    if (!raf) raf = requestAnimationFrame(tick);
  };
})();
