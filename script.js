/* ============================================================
   THE MATHEMATICAL LOVE LETTER
   A cinematic proposal experience built from mathematics,
   generated entirely with HTML, CSS, vanilla JS and SVG.

   Modules: CONFIG · MATH · SVG · FLOWER · HEART · MOON
            ANIMATION · POETRY · PROPOSAL · SCENES
   ============================================================ */

'use strict';

/* ============================================================
   1. CONFIG — all text & tunable parameters live here.
   Edit copy freely; animation code never needs to change.
   ============================================================ */
const CONFIG = {
  // The one name that matters.
  recipientName: 'Anu', // appears in the page title and on the final screen

  // --- Screen 1: the first point ---
  intro: {
    line1: 'Everything starts with a point.',
    line2: "Let's see where this one goes."
  },

  // --- Flower build captions ---
  flowerCaptions: [
    'One equation.',
    'Another curve.',
    'Another point.',
    'Enough points become a flower.'
  ],

  // --- Flower poem ---
  flowerPoem: [
    'Some flowers are found.',
    'Some are grown.',
    'And some are created',
    'for someone.'
  ],

  // --- Heart poetry (exact lines, revealed one by one) ---
  heartPoem: [
    'I had seen enough temporary stars',
    'to stop searching for the moon.',
    '',
    'Then I found you',
    'where I least expected.',
    '',
    'And suddenly,',
    '',
    "the darkness wasn't so dark anymore."
  ],
  heartPoemAfter: [
    'You became my moon.',
    'My unexpected light.',
    'My favorite coordinate.'
  ],

  // --- d(P, M) metaphor ---
  distanceMetaphor: {
    legend: ['P — me', 'M — you', 'd — distance'],
    lines: [
      'I spent a long time measuring distance.',
      'Between people.',
      'Between moments.',
      'Between what I wanted',
      'and what I thought I could have.'
    ],
    after: 'Somewhere along the way,\nthe distance disappeared.'
  },

  // --- Unexpected coordinate ---
  unexpected: [
    "I wasn't looking for you.",
    "I wasn't expecting you.",
    'But somehow...'
  ],
  foundYou: 'I found you.',

  // --- Final metaphor before the question ---
  finalMetaphor: {
    equation: 'You + Me = ?',
    lines: [
      "Maybe some equations aren't meant",
      'to be solved alone.',
      "I'd like to find the answer with you."
    ]
  },

  // --- The question ---
  proposalText: 'Will you be mine?',

  // --- LET ME THINK response (no pressure, ever) ---
  thinkResponse: [
    'Take your time.',
    'Some answers are worth thinking about.'
  ],

  // --- YES celebration ---
  yesLines: [
    "Then let's begin.",
    'From one unexpected coordinate...',
    '...to wherever this equation takes us.'
  ],
  yesClosing: [
    'Every point had a coordinate.',
    'Every curve had an equation.',
    '',
    'But the most beautiful thing',
    'I ever found',
    '',
    "wasn't something I calculated.",
    '',
    'It was you.'
  ],

  // --- Final screen ---
  finalMessage: [
    'Made with mathematics.',
    'Written with code.',
    'Created for you.'
  ],
  finalMessage2: [
    'Every point had a coordinate.',
    'Every curve had an equation.',
    '',
    'But the reason behind all of it',
    'was always you.'
  ],
  finalSignature: 'For {name}',

  // --- "See how it was made" ---
  mathPanel: {
    title: 'The Mathematics',
    blocks: [
      {
        label: 'Flower',
        eq: 'r(θ) = R + A·cos(k·(θ − φ))\n     + B·sin(2θ + δ)\n     + C·cos(3θ + ε)\n     × envelope(θ)'
      },
      {
        label: 'Heart',
        eq: 'x(t) = 16·sin³(t)\n\ny(t) = 13·cos(t) − 5·cos(2t)\n        − 2·cos(3t) − cos(4t)\n\n0 ≤ t ≤ 2π'
      },
      {
        label: 'Coordinates',
        eq: 'x = r·cos(θ)\ny = r·sin(θ)'
      }
    ],
    closing: [
      'For every value of a parameter,',
      'the program calculates a point.',
      'Points become curves.',
      'Curves become shapes.',
      'And somehow,',
      'code became a love letter.'
    ]
  },

  // --- Music (music.mp3 sits next to index.html) ---
  music: {
    src: 'music.mp3',
    playLabel: 'Play music ♫',
    pauseLabel: 'Mute music ♫'
  },

  // --- Timing (ms) ---
  timing: {
    // Global text pacing: every hold/gap in the story is multiplied
    // by this. 1 = original speed. Raise = slower & more spacious,
    // lower = brisker. Text fade-in length lives in style.css.
    pacing: 1.0,
    lineReveal: 1100,
    lineHold: 1900,
    stanzaPause: 1200,
    sceneGap: 700
  },

  // --- Palette (mirrors style.css) ---
  palette: {
    bg: '#08050A',
    deepPink: '#8F2858',
    rose: '#D63384',
    brightPink: '#E83E8C',
    lightPink: '#FF8FC4',
    softPink: '#FFD1E5',
    text: '#FFF7FB'
  }
};

/* ============================================================
   2. MATH — pure, deterministic mathematics.
   No Math.random() anywhere in this file.
   ============================================================ */
const MATH = {
  TAU: Math.PI * 2,

  // Polar → Cartesian:  x = r·cos(θ), y = r·sin(θ)
  polarToCartesian(r, theta) {
    return { x: r * Math.cos(theta), y: r * Math.sin(theta) };
  },

  clamp(v, min, max) { return v < min ? min : (v > max ? max : v); },

  // Easing
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
  easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); },
  easeInOutSine(t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
  easeOutBack(t) {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },

  // Deterministic pseudo-random in [0,1) from an integer index.
  // (A hash — NOT Math.random. Same input always gives same output.)
  hash(i) {
    const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    return s - Math.floor(s);
  },

  // Deterministic number in [min,max) from an index
  hashRange(i, min, max) {
    return min + MATH.hash(i) * (max - min);
  },

  lerp(a, b, t) { return a + (b - a) * t; },

  lerpPoint(p, q, t) {
    return { x: MATH.lerp(p.x, q.x, t), y: MATH.lerp(p.y, q.y, t) };
  },

  // Format a t value in units of π, e.g. 1.73π
  formatPi(t) {
    const n = t / Math.PI;
    return n.toFixed(2).replace(/0$/, '').replace(/\.$/, '') + 'π';
  }
};

/* ============================================================
   3. SVG — element helpers & coordinate transform
   ============================================================ */
const SVG = {
  NS: 'http://www.w3.org/2000/svg',

  el(tag, attrs) {
    const node = document.createElementNS(SVG.NS, tag);
    if (attrs) {
      for (const key in attrs) node.setAttribute(key, attrs[key]);
    }
    return node;
  },

  // Math coordinates (math y-up) → SVG coordinates (y-down),
  // relative to the stage viewBox whose centre is (0,0).
  transformPoint(point) {
    return { x: point.x, y: -point.y };
  },

  // Build an SVG path `d` string from an array of points.
  buildPath(points, close) {
    if (!points || points.length === 0) return '';
    let d = 'M ' + points[0].x.toFixed(3) + ' ' + points[0].y.toFixed(3);
    for (let i = 1; i < points.length; i++) {
      d += ' L ' + points[i].x.toFixed(3) + ' ' + points[i].y.toFixed(3);
    }
    if (close) d += ' Z';
    return d;
  },

  clear(layer) { while (layer.firstChild) layer.removeChild(layer.firstChild); }
};

/* ============================================================
   4. DOM references
   ============================================================ */
const DOM = {};
function cacheDom() {
  const ids = [
    'scene-svg', 'layer-grid', 'layer-flower', 'layer-morph', 'layer-heart',
    'layer-moon', 'layer-particles', 'layer-point',
    'text-layer', 'equation-layer', 'param-display', 'poem-layer',
    'proposal', 'proposal-question', 'proposal-buttons',
    'think-panel', 'think-line-1', 'think-line-2', 'btn-back',
    'btn-yes', 'btn-think',
    'final-screen', 'final-block-1', 'final-block-2',
    'final-signature', 'final-symbol', 'final-actions',
    'btn-replay', 'btn-see-math', 'btn-close-math', 'math-panel',
    'math-panel-content', 'btn-skip', 'btn-music', 'hud'
  ];
  ids.forEach(id => { DOM[id] = document.getElementById(id); });
}

/* ============================================================
   5. ANIMATION — timing utilities & generic reveals
   ============================================================ */
const ANIMATION = {
  // Global time multiplier — 1 = real time. (Tests may lower it.)
  timeScale: 1,

  // Sleep — returns early (within ~90 ms) if Skip has been pressed,
  // so a skip never waits out a long poetic hold.
  sleep(ms) {
    if (SCENES.skipRequested) return Promise.resolve();
    const dur = Math.max(0, ms * ANIMATION.timeScale * CONFIG.timing.pacing);
    return new Promise(resolve => {
      const start = performance.now();
      const tick = () => {
        if (SCENES.skipRequested || performance.now() - start >= dur) {
          resolve();
          return;
        }
        setTimeout(tick, 90);
      };
      setTimeout(tick, Math.min(dur, 90));
    });
  },

  // Reveal a single line in a container (opacity + translateY + blur)
  showLine(container, text, cls) {
    return new Promise(resolve => {
      const line = document.createElement('p');
      line.className = (cls || 'scene-line');
      line.textContent = text;
      container.appendChild(line);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          line.classList.add('visible');
          resolve(line);
        });
      });
    });
  },

  hideLine(line) {
    return new Promise(resolve => {
      if (!line) { resolve(); return; }
      line.classList.add('gone');
      const delay = SCENES.skipRequested ? 150 : 1750;
      setTimeout(() => {
        if (line.parentNode) line.parentNode.removeChild(line);
        resolve();
      }, delay);
    });
  },

  // Reveal a sequence of lines, each with a hold, then (optionally) clear.
  async showLines(container, lines, opts) {
    opts = opts || {};
    const hold = opts.hold != null ? opts.hold : CONFIG.timing.lineHold;
    const gap = opts.gap != null ? opts.gap : 450;
    const created = [];
    for (const text of lines) {
      if (text === '') {
        const spacer = document.createElement('p');
        spacer.className = 'poem-line spacer';
        container.appendChild(spacer);
        created.push(spacer);
        await ANIMATION.sleep(200);
        continue;
      }
      const line = await ANIMATION.showLine(container, text, opts.cls || 'scene-line');
      created.push(line);
      await ANIMATION.sleep(gap);
    }
    if (hold > 0) await ANIMATION.sleep(hold);
    if (opts.clear) {
      for (const l of created) {
        l.classList.add('gone');
      }
      await ANIMATION.sleep(1000);
      created.forEach(l => { if (l.parentNode) l.parentNode.removeChild(l); });
    }
    return created;
  },

  clearContainer(container) {
    while (container.firstChild) container.removeChild(container.firstChild);
  },

  // Run an element through a callback on each animation frame.
  // Resolves false if cancelled or interrupted by the Skip button.
  tween(duration, onFrame) {
    let cancelled = false;
    const start = performance.now();
    const dur = duration * ANIMATION.timeScale;
    return new Promise(resolve => {
      function step(now) {
        if (cancelled || SCENES.skipRequested) { resolve(false); return; }
        const t = MATH.clamp((now - start) / dur, 0, 1);
        onFrame(t);
        if (t < 1) requestAnimationFrame(step);
        else resolve(true);
      }
      requestAnimationFrame(step);
    });
  }
};

/* ============================================================
   6. SCENE ENGINE — sequential async story runner
   ============================================================ */
const SCENES = {
  index: 0,
  list: [],
  running: false,
  skipRequested: false,

  // essential scenes are never skipped (the proposal, the finale)
  register(name, fn, opts) {
    SCENES.list.push({ name, fn, essential: !!(opts && opts.essential) });
  },

  // Skip support: jump forward to the next essential scene,
  // clearing any text that belongs to the skipped stretch.
  cleanupOverlays() {
    ANIMATION.clearContainer(DOM['text-layer']);
    ANIMATION.clearContainer(DOM['equation-layer']);
    ANIMATION.clearContainer(DOM['poem-layer']);
    DOM['param-display'].classList.remove('visible');
    DOM['param-display'].textContent = '';
  },

  async run() {
    SCENES.running = true;
    while (SCENES.index < SCENES.list.length) {
      const scene = SCENES.list[SCENES.index];
      if (SCENES.skipRequested) {
        if (!scene.essential) { SCENES.index++; continue; }
        SCENES.skipRequested = false;
        SCENES.cleanupOverlays();
        DOM['btn-skip'].classList.add('hidden');
      }
      console.info('[scene]', scene.name);
      await scene.fn();
      SCENES.index++;
      await ANIMATION.sleep(CONFIG.timing.sceneGap);
    }
    SCENES.running = false;
  },

  requestSkip() { SCENES.skipRequested = true; }
};

/* ============================================================
   7. MUSIC — optional, never autoplaying
   ============================================================ */
const MUSIC = {
  audio: null,
  available: true,
  playing: false,        // our own state — survives fade transitions
  targetVolume: 0.55,
  fadeRaf: null,

  init() {
    const btn = DOM['btn-music'];
    if (!btn) return;
    // Probe the file immediately so a missing music.mp3 hides the
    // button gracefully, before anyone ever clicks it.
    MUSIC.audio = new Audio(CONFIG.music.src);
    MUSIC.audio.loop = true;
    MUSIC.audio.volume = 0;
    MUSIC.audio.addEventListener('error', () => {
      MUSIC.available = false;
      btn.classList.add('hidden');
    });
    MUSIC.audio.load();
    btn.textContent = CONFIG.music.playLabel;
    btn.setAttribute('aria-pressed', 'false');
    btn.classList.remove('hidden');
    btn.addEventListener('click', MUSIC.toggle);
  },

  // rAF volume ramp — cancellable, so rapid toggling never strands it.
  fadeTo(target, ms, done) {
    const audio = MUSIC.audio;
    if (!audio) { if (done) done(); return; }
    if (MUSIC.fadeRaf) cancelAnimationFrame(MUSIC.fadeRaf);
    const from = audio.volume;
    const start = performance.now();
    const step = now => {
      const t = MATH.clamp((now - start) / Math.max(1, ms), 0, 1);
      audio.volume = from + (target - from) * t;
      if (t < 1) {
        MUSIC.fadeRaf = requestAnimationFrame(step);
      } else {
        MUSIC.fadeRaf = null;
        if (done) done();
      }
    };
    MUSIC.fadeRaf = requestAnimationFrame(step);
  },

  // One button, two jobs: start the music, or mute it (and back).
  toggle() {
    if (!MUSIC.available || !MUSIC.audio) return;
    const btn = DOM['btn-music'];
    if (!MUSIC.playing) {
      MUSIC.playing = true;
      const p = MUSIC.audio.play();
      if (p && p.catch) p.catch(() => {});
      btn.textContent = CONFIG.music.pauseLabel;
      btn.classList.add('playing');
      btn.setAttribute('aria-pressed', 'true');
      MUSIC.fadeTo(MUSIC.targetVolume, 900);   // gentle fade-in
    } else {
      MUSIC.playing = false;
      btn.textContent = CONFIG.music.playLabel;
      btn.classList.remove('playing');
      btn.setAttribute('aria-pressed', 'false');
      // fade out, then pause — unless it was re-enabled mid-fade
      MUSIC.fadeTo(0, 500, () => {
        if (!MUSIC.playing) MUSIC.audio.pause();
      });
    }
  },

  // Soft full stop (available to the story if ever needed).
  fadeOut() {
    if (!MUSIC.audio) return;
    MUSIC.playing = false;
    const btn = DOM['btn-music'];
    if (btn) {
      btn.textContent = CONFIG.music.playLabel;
      btn.classList.remove('playing');
      btn.setAttribute('aria-pressed', 'false');
    }
    MUSIC.fadeTo(0, 600, () => { if (!MUSIC.playing) MUSIC.audio.pause(); });
  }
};

/* ============================================================
   8. GRID — the shared mathematical coordinate plane
   One grid serves the first point, the heart and the
   "unexpected coordinate" scenes. Built once, reused.
   ============================================================ */
const GRID = {
  scale: 5.8,        // SVG units per mathematical unit
  extent: 16,        // grid lines from -extent..extent (math units)
  axisExtent: 17,    // axes run slightly further
  step: 4,           // major grid line every 4 math units
  minorStep: 2,      // faint lines every 2 math units
  labelEvery: 8,     // numeric labels every 8 math units
  built: false,

  build() {
    if (GRID.built) return;
    const layer = DOM['layer-grid'];
    const s = GRID.scale;

    // Minor lines
    const minor = SVG.el('g', { class: 'grid-minor' });
    for (let v = -GRID.extent; v <= GRID.extent; v += GRID.minorStep) {
      if (v % GRID.step === 0) continue;
      minor.appendChild(SVG.el('line', {
        x1: v * s, y1: -GRID.extent * s, x2: v * s, y2: GRID.extent * s,
        class: 'grid-line', 'stroke-opacity': '0.45'
      }));
      minor.appendChild(SVG.el('line', {
        x1: -GRID.extent * s, y1: -v * s, x2: GRID.extent * s, y2: -v * s,
        class: 'grid-line', 'stroke-opacity': '0.45'
      }));
    }
    layer.appendChild(minor);

    // Major lines
    const major = SVG.el('g', { class: 'grid-major' });
    for (let v = -GRID.extent; v <= GRID.extent; v += GRID.step) {
      if (v === 0) continue;
      major.appendChild(SVG.el('line', {
        x1: v * s, y1: -GRID.extent * s, x2: v * s, y2: GRID.extent * s,
        class: 'grid-line'
      }));
      major.appendChild(SVG.el('line', {
        x1: -GRID.extent * s, y1: -v * s, x2: GRID.extent * s, y2: -v * s,
        class: 'grid-line'
      }));
    }
    layer.appendChild(major);

    // Axes
    const axes = SVG.el('g', { class: 'grid-axes' });
    axes.appendChild(SVG.el('line', {
      x1: -GRID.axisExtent * s, y1: 0, x2: GRID.axisExtent * s, y2: 0,
      class: 'axis-line'
    }));
    axes.appendChild(SVG.el('line', {
      x1: 0, y1: -GRID.axisExtent * s, x2: 0, y2: GRID.axisExtent * s,
      class: 'axis-line'
    }));

    // Origin
    axes.appendChild(SVG.el('circle', {
      cx: 0, cy: 0, r: 0.9, fill: 'rgba(232,62,140,0.7)'
    }));

    // Axis letters
    const xLetter = SVG.el('text', {
      x: GRID.axisExtent * s - 6, y: -4, class: 'axis-letter'
    });
    xLetter.textContent = 'x';
    axes.appendChild(xLetter);

    const yLetter = SVG.el('text', {
      x: 5, y: -GRID.axisExtent * s + 8, class: 'axis-letter'
    });
    yLetter.textContent = 'y';
    axes.appendChild(yLetter);

    // Coordinate labels
    for (let v = -GRID.extent; v <= GRID.extent; v += GRID.labelEvery) {
      if (v === 0) continue;
      const xLab = SVG.el('text', {
        x: v * s, y: 5.5, class: 'axis-label', 'text-anchor': 'middle'
      });
      xLab.textContent = v;
      axes.appendChild(xLab);

      const yLab = SVG.el('text', {
        x: -5, y: -v * s + 1.5, class: 'axis-label', 'text-anchor': 'end'
      });
      yLab.textContent = v;
      axes.appendChild(yLab);
    }

    layer.appendChild(axes);
    GRID.built = true;
  },

  show() {
    GRID.build();
    DOM['layer-grid'].classList.add('visible');
    DOM['layer-grid'].classList.remove('faded');
  },

  // Fade the grid away entirely (used for the YES celebration / finale)
  fade() {
    DOM['layer-grid'].classList.add('faded');
  }
};

/* ============================================================
   9. POINT — the first pink point (and the wandering one)
   ============================================================ */
const POINT = {
  el: null,

  ensure() {
    if (POINT.el && POINT.el.parentNode) return POINT.el;
    const layer = DOM['layer-point'];
    const halo = SVG.el('circle', {
      cx: 0, cy: 0, r: 5, fill: 'rgba(232,62,140,0.18)',
      id: 'point-halo', opacity: '0'
    });
    const dot = SVG.el('circle', {
      cx: 0, cy: 0, r: 0, fill: '#E83E8C',
      filter: 'url(#cursor-glow)', id: 'point-dot'
    });
    layer.appendChild(halo);
    layer.appendChild(dot);
    POINT.el = dot;
    POINT.halo = halo;
    return dot;
  },

  setPos(x, y) {
    POINT.el.setAttribute('cx', x);
    POINT.el.setAttribute('cy', y);
    POINT.halo.setAttribute('cx', x);
    POINT.halo.setAttribute('cy', y);
  },

  // Pop into existence (deterministic, eased)
  async reveal() {
    POINT.ensure();
    await ANIMATION.tween(800, t => {
      const r = 1.6 * MATH.easeOutBack(t);
      POINT.el.setAttribute('r', Math.max(0, r));
      POINT.halo.setAttribute('opacity', t * 0.9);
    });
  },

  async vanish() {
    if (!POINT.el) return;
    const dot = POINT.el, halo = POINT.halo;
    const layer = DOM['layer-point'];
    await ANIMATION.tween(700, t => {
      dot.setAttribute('r', 1.6 * (1 - t));
      halo.setAttribute('opacity', 0.9 * (1 - t));
    });
    ANIMATION.clearContainer(layer);
    POINT.el = null;
    POINT.halo = null;
  },

  // Travel along a deterministic curve: a gentle Lissajous drift
  // that leaves the origin, wanders, and returns to the centre —
  // "let's see where this one goes."
  async travel(duration) {
    const pts = [];
    const steps = 160;
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;                 // 0..1
      const theta = MATH.TAU * u;
      const env = Math.sin(Math.PI * u);   // out and back
      const x = 26 * Math.sin(2 * theta) * env;
      const y = 17 * Math.sin(3 * theta + Math.PI / 3) * env;
      pts.push({ x, y });
    }
    await ANIMATION.tween(duration, t => {
      const e = MATH.easeInOutSine(t);
      const idx = Math.min(pts.length - 1, Math.floor(e * (pts.length - 1)));
      const p = pts[idx];
      POINT.setPos(SVG.transformPoint(p).x, SVG.transformPoint(p).y);
    });
  }
};

/* ============================================================
   10. POETRY — line-by-line reveals (never one big block)
   ============================================================ */
const POETRY = {
  // A single scene line in the central text layer
  line(text, cls) {
    return ANIMATION.showLine(DOM['text-layer'], text, cls || 'scene-line');
  },

  async say(text, holdMs) {
    const l = await POETRY.line(text);
    await ANIMATION.sleep(holdMs != null ? holdMs : CONFIG.timing.lineHold);
    await ANIMATION.hideLine(l);
    return l;
  },

  async sayLines(lines, opts) {
    opts = opts || {};
    const created = [];
    for (const text of lines) {
      if (SCENES.skipRequested && !opts.force) return created;
      if (text === '') {
        const spacer = document.createElement('p');
        spacer.className = 'scene-line spacer';
        DOM['text-layer'].appendChild(spacer);
        created.push(spacer);
        await ANIMATION.sleep(250);
        continue;
      }
      const l = await POETRY.line(text, opts.cls);
      created.push(l);
      await ANIMATION.sleep(opts.gap || 550);
    }
    await ANIMATION.sleep(opts.hold != null ? opts.hold : CONFIG.timing.lineHold);
    if (opts.clear !== false) {
      for (const l of created) l.classList.add('gone');
      await ANIMATION.sleep(1000);
      created.forEach(l => { if (l.parentNode) l.parentNode.removeChild(l); });
    }
    return created;
  },

  // A stanza in the poem layer (italic, softer)
  async stanza(lines, opts) {
    opts = opts || {};
    const container = DOM['poem-layer'];
    const created = [];
    const gap = opts.gap != null ? opts.gap : 900;
    for (const text of lines) {
      if (SCENES.skipRequested) return created;
      if (text === '') {
        const spacer = document.createElement('p');
        spacer.className = 'poem-line spacer';
        container.appendChild(spacer);
        created.push(spacer);
        await ANIMATION.sleep(gap * 0.4);
        continue;
      }
      const line = document.createElement('p');
      line.className = 'poem-line';
      line.textContent = text;
      if (opts.emphasize && opts.emphasize.includes(text)) {
        line.classList.add('poem-emphasis');
      }
      container.appendChild(line);
      requestAnimationFrame(() => requestAnimationFrame(() => line.classList.add('visible')));
      created.push(line);
      await ANIMATION.sleep(gap);
    }
    await ANIMATION.sleep(opts.hold != null ? opts.hold : 2200);
    if (opts.clear !== false) {
      created.forEach(l => l.classList.add('gone'));
      await ANIMATION.sleep(1300);
      created.forEach(l => { if (l.parentNode) l.parentNode.removeChild(l); });
    }
    return created;
  },

  clear() {
    ANIMATION.clearContainer(DOM['text-layer']);
    ANIMATION.clearContainer(DOM['poem-layer']);
    ANIMATION.clearContainer(DOM['equation-layer']);
  }
};

/* ============================================================
   11. FLOWER — the mathematical hibiscus
   Every coordinate below comes from polar equations:
       r(θ) = R + A·cos(k·(θ − φ)) + B·sin(2θ + δ)
              + C·cos(3θ + ε)  ×  envelope(θ)
   x = r·cos(θ), y = r·sin(θ)
   ============================================================ */
const FLOWER = {
  scale: 9.8, // flower units → SVG units (max radius ≈ 61 of 100)

  params: {
    count: 5,
    R: 4.8,        // base petal radius
    A: 1.8,        // primary lobe amplitude
    B: 0.25,       // asymmetry amplitude
    delta: 0.7,    // asymmetry phase δ
    C: 0.12,       // ripple amplitude
    eps: 1.3,      // ripple phase ε
    innerR: 0.6    // petal base radius
  },

  // Deterministic per-petal variation (fixed table — never random)
  petalVar: [
    { ss: 1.00, ws: 1.00, ab: 0.00, cb: 0.00, ro: 0.00 },
    { ss: 0.95, ws: 1.05, ab: 0.08, cb: 0.05, ro: 0.03 },
    { ss: 1.03, ws: 0.97, ab: -0.05, cb: -0.04, ro: -0.02 },
    { ss: 0.97, ws: 1.02, ab: 0.04, cb: 0.03, ro: 0.01 },
    { ss: 1.01, ws: 0.98, ab: -0.03, cb: -0.02, ro: -0.01 }
  ],

  data: null, // populated by generateFlower()

  // Half-width of one petal at its base (radians).
  // 5 petals × 2×0.72 rad ≈ 413° of coverage → soft overlap, full bloom.
  petalSpread: Math.PI / 5 * 1.3,

  // ---- The petal radius equation (this IS the displayed equation) ----
  //   r(θ) = [ R + A·cos(k·(θ − φ)) + B·sin(2θ + δ) + C·cos(3θ + ε) ] × envelope(θ)
  // θ is petal-local (0 at the petal's centre line), k = 2, φ = 0.
  petalR(theta, R, A, B, dlt, C, ep, hw) {
    const primary = A * Math.cos(2 * theta);                 // A·cos(k(θ−φ))
    const asym = B * Math.sin(2 * theta + dlt);              // B·sin(2θ + δ)
    const ripple = C * Math.cos(3 * theta + ep);             // C·cos(3θ + ε)
    const bracket = R + primary + asym + ripple;
    // envelope(θ): a cosine window that closes the petal at its base
    const u = theta / hw;
    const envelope = Math.abs(u) >= 1
      ? 0
      : Math.pow(Math.cos((Math.PI / 2) * u), 1.35);
    const r = bracket * envelope;
    return Math.max(0.02, r);
  },

  // ---- Build one petal: outline + veins, in flower units ----
  generatePetal(index, total) {
    const p = FLOWER.params;
    const v = FLOWER.petalVar[index % FLOWER.petalVar.length];
    const centerAngle = (MATH.TAU / total) * index + v.ro + Math.PI / 2; // first petal points up
    const R = p.R * v.ss;
    const A = p.A * v.ws;
    const B = p.B * v.ab;
    const dlt = p.delta + v.cb;
    const hw = FLOWER.petalSpread * (0.94 + 0.10 * v.ws);

    // Petal outline: θ sweeps −hw … +hw; envelope closes both ends at the
    // centre, so this single sweep IS the closed petal shape.
    const steps = 72;
    const outline = [];
    for (let i = 0; i <= steps; i++) {
      const theta = -hw + (i / steps) * 2 * hw;
      const r = FLOWER.petalR(theta, R, A, B, dlt, p.C, p.eps, hw);
      outline.push(MATH.polarToCartesian(r, centerAngle + theta));
    }

    // Petal veins: 5 curves radiating through the petal
    const veins = [];
    const veinCount = 5;
    for (let k = 0; k < veinCount; k++) {
      const offset = (k - (veinCount - 1) / 2) * 0.14;
      const pts = [];
      const vsteps = 26;
      for (let i = 0; i <= vsteps; i++) {
        const t = i / vsteps;
        const reach = FLOWER.petalR(offset, R, A, B, dlt, p.C, p.eps, hw) * 0.9;
        const r = p.innerR * 1.1 + t * Math.max(0.4, reach - p.innerR * 1.1);
        const theta = centerAngle + offset * t +
          0.12 * Math.sin(t * Math.PI) * (k % 2 === 0 ? 1 : -1);
        pts.push(MATH.polarToCartesian(r, theta));
      }
      veins.push(pts);
    }

    return { index, centerAngle, R, hw, outline, veins };
  },

  // ---- Pistil, filaments, anthers (parametric curves) ----
  generateCenter() {
    const p = FLOWER.params;

    // Pistil: x(t)=t·L·cos(−π/2 + c·t), y(t)=t·L·sin(−π/2 + c·t)
    const pistilLen = 2.8, pistilCurve = 0.4;
    const pistil = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      pistil.push(MATH.polarToCartesian(t * pistilLen, -Math.PI / 2 + pistilCurve * t));
    }

    // Filaments: 12 gentle spiral arcs
    const filaments = [];
    const count = 12, len = 1.6;
    for (let i = 0; i < count; i++) {
      const baseAngle = (MATH.TAU / count) * i + Math.PI / 3;
      const curv = 0.5 + (i % 3) * 0.15;
      const pts = [];
      for (let j = 0; j <= 20; j++) {
        const t = j / 20;
        const r = t * len * (0.6 + 0.4 * Math.sin(t * Math.PI * 0.8));
        const theta = baseAngle + curv * t * (i % 2 === 0 ? 1 : -1);
        pts.push(MATH.polarToCartesian(r, theta));
      }
      const tip = MATH.polarToCartesian(len * 0.92, baseAngle + curv * (i % 2 === 0 ? 1 : -1));
      filaments.push({ pts, tip, angle: (baseAngle + curv) * 180 / Math.PI });
    }

    return { pistil, pistilLen, filaments, innerRadius: p.innerR };
  },

  // ---- Render the flower into layer-flower (static, built once) ----
  generateFlower() {
    const layer = DOM['layer-flower'];
    SVG.clear(layer);
    const s = FLOWER.scale;
    const n = FLOWER.params.count;
    const toSvg = pts => pts.map(pt => ({ x: pt.x * s, y: -pt.y * s }));

    const petalGroup = SVG.el('g', { id: 'flower-petals' });
    const veinGroup = SVG.el('g', { id: 'flower-veins' });
    const centerGroup = SVG.el('g', { id: 'flower-center' });
    const filamentGroup = SVG.el('g', { id: 'flower-filaments' });
    const antherGroup = SVG.el('g', { id: 'flower-anthers' });

    const petals = [];
    for (let i = 0; i < n; i++) {
      const petal = FLOWER.generatePetal(i, n);

      const fill = SVG.el('path', {
        d: SVG.buildPath(toSvg(petal.outline), true),
        fill: 'url(#petal-gradient-' + (i % 5) + ')',
        stroke: 'rgba(255,209,229,0.30)',
        'stroke-width': '0.5',
        'stroke-linejoin': 'round',
        filter: 'url(#petal-glow)',
        class: 'petal-fill'
      });
      petalGroup.appendChild(fill);

      // Outline drawn as its own stroked path (this is what "draws" in M3)
      const outline = SVG.el('path', {
        d: SVG.buildPath(toSvg(petal.outline), true),
        fill: 'none',
        stroke: 'rgba(255,209,229,0.55)',
        'stroke-width': '0.7',
        'stroke-linejoin': 'round',
        class: 'petal-outline'
      });
      petalGroup.appendChild(outline);

      const veinEls = [];
      for (const vein of petal.veins) {
        const el = SVG.el('path', {
          d: SVG.buildPath(toSvg(vein)),
          fill: 'none',
          stroke: 'rgba(255,209,229,0.22)',
          'stroke-width': '0.45',
          'stroke-linecap': 'round',
          class: 'petal-vein'
        });
        veinGroup.appendChild(el);
        veinEls.push(el);
      }
      petals.push({ fill, outline, veins: veinEls, data: petal });
    }

    // Centre: disc + stamen ring
    const centre = FLOWER.generateCenter();

    const disc = SVG.el('circle', {
      cx: 0, cy: 0, r: 0.9 * s, fill: '#8F2858',
      stroke: 'rgba(232,62,140,0.8)', 'stroke-width': 0.5,
      filter: 'url(#soft-glow)', class: 'flower-disc'
    });
    centerGroup.appendChild(disc);

    const ringDots = [];
    for (let i = 0; i < 8; i++) {
      const pt = MATH.polarToCartesian(0.55, (MATH.TAU / 8) * i);
      const dot = SVG.el('circle', {
        cx: (pt.x * s).toFixed(2), cy: (-pt.y * s).toFixed(2),
        r: 0.55, fill: '#FF8FC4', opacity: 0.75, class: 'flower-ring-dot'
      });
      centerGroup.appendChild(dot);
      ringDots.push(dot);
    }

    const pistilPath = SVG.el('path', {
      d: SVG.buildPath(toSvg(centre.pistil)),
      fill: 'none', stroke: '#FF8FC4', 'stroke-width': 1.1,
      'stroke-linecap': 'round', class: 'flower-pistil'
    });
    centerGroup.appendChild(pistilPath);

    const pistilTip = SVG.el('circle', {
      cx: (centre.pistil[centre.pistil.length - 1].x * s).toFixed(2),
      cy: (-centre.pistil[centre.pistil.length - 1].y * s).toFixed(2),
      r: 1.5, fill: '#E83E8C', stroke: '#FFD1E5', 'stroke-width': 0.4,
      filter: 'url(#soft-glow)', class: 'flower-pistil-tip'
    });
    centerGroup.appendChild(pistilTip);

    const filamentEls = [];
    const antherEls = [];
    for (const f of centre.filaments) {
      const el = SVG.el('path', {
        d: SVG.buildPath(toSvg(f.pts)),
        fill: 'none', stroke: 'rgba(255,143,196,0.85)',
        'stroke-width': 0.5, 'stroke-linecap': 'round',
        class: 'flower-filament'
      });
      filamentGroup.appendChild(el);
      filamentEls.push(el);

      const anther = SVG.el('ellipse', {
        cx: (f.tip.x * s).toFixed(2), cy: (-f.tip.y * s).toFixed(2),
        rx: 0.9, ry: 0.6, fill: '#FFD1E5',
        stroke: 'rgba(232,62,140,0.8)', 'stroke-width': 0.25,
        transform: 'rotate(' + f.angle.toFixed(1) + ' ' +
          (f.tip.x * s).toFixed(2) + ' ' + (-f.tip.y * s).toFixed(2) + ')',
        class: 'flower-anther'
      });
      antherGroup.appendChild(anther);
      antherEls.push(anther);
    }

    layer.appendChild(petalGroup);
    layer.appendChild(veinGroup);
    layer.appendChild(centerGroup);
    layer.appendChild(filamentGroup);
    layer.appendChild(antherGroup);

    FLOWER.data = {
      petals, filamentEls, antherEls, ringDots,
      disc, pistilPath, pistilTip, centre, layer
    };
    return FLOWER.data;
  },

  // Sample points along the finished flower's outline (for the morph)
  samplePoints(count) {
    if (!FLOWER.data) FLOWER.generateFlower();
    const s = FLOWER.scale;
    const pts = [];
    const petals = FLOWER.data.petals;
    const perPetal = Math.ceil(count / petals.length);
    for (const petal of petals) {
      const outline = petal.data.outline;
      for (let i = 0; i < perPetal; i++) {
        const idx = Math.floor((i / perPetal) * outline.length);
        const pt = outline[idx];
        pts.push({ x: pt.x * s, y: -pt.y * s });
      }
    }
    return pts;
  },

  show() { DOM['layer-flower'].style.display = ''; },
  hide() { DOM['layer-flower'].style.display = 'none'; },

  /* ----------------------------------------------------------
     ANIMATION — the flower constructs itself, piece by piece
     ---------------------------------------------------------- */
  prepareAnimation() {
    const d = FLOWER.data;
    if (!d) return;

    // Petal outlines: arm the stroke-dash draw, hide fills + veins
    for (const petal of d.petals) {
      const len = petal.outline.getTotalLength();
      petal.outline.style.strokeDasharray = len;
      petal.outline.style.strokeDashoffset = len;
      petal.fill.style.opacity = 0;
      for (const vein of petal.veins) {
        const vlen = vein.getTotalLength();
        vein.style.strokeDasharray = vlen;
        vein.style.strokeDashoffset = vlen;
      }
    }

    // Centre pieces
    d.disc.style.opacity = 0;
    for (const dot of d.ringDots) dot.style.opacity = 0;
    const plen = d.pistilPath.getTotalLength();
    d.pistilPath.style.strokeDasharray = plen;
    d.pistilPath.style.strokeDashoffset = plen;
    d.pistilTip.style.opacity = 0;
    for (const f of d.filamentEls) {
      const flen = f.getTotalLength();
      f.style.strokeDasharray = flen;
      f.style.strokeDashoffset = flen;
    }
    for (const a of d.antherEls) a.style.opacity = 0;
  },

  // Draw one petal: outline sweeps into existence, fill blooms with it,
  // veins follow. All coordinates come from the petal equation.
  async animatePetal(index) {
    const petal = FLOWER.data.petals[index];
    const len = petal.outline.getTotalLength();
    const jobs = [
      ANIMATION.tween(1150, t => {
        const e = MATH.easeInOutSine(t);
        petal.outline.style.strokeDashoffset = len * (1 - e);
        petal.fill.style.opacity = e;
      })
    ];
    petal.veins.forEach((vein, k) => {
      const vlen = vein.getTotalLength();
      jobs.push(ANIMATION.tween(750, t => {
        const e = MATH.easeOutCubic(t);
        vein.style.strokeDashoffset = vlen * (1 - e);
      }));
    });
    await Promise.all(jobs);
  },

  // Centre disc + stamen ring + pistil
  async animateCenter() {
    const d = FLOWER.data;
    const discJob = ANIMATION.tween(650, t => {
      const e = MATH.easeOutBack(t);
      d.disc.style.opacity = Math.min(1, t * 1.6);
      const s = Math.max(0.001, e);
      d.disc.setAttribute('transform', 'scale(' + s.toFixed(4) + ')');
    });
    const dotJobs = d.ringDots.map((dot, i) =>
      ANIMATION.sleep(i * 70).then(() =>
        ANIMATION.tween(350, t => { dot.style.opacity = 0.75 * t; }))
    );
    const plen = d.pistilPath.getTotalLength();
    const pistilJob = ANIMATION.sleep(300).then(() =>
      ANIMATION.tween(700, t => {
        d.pistilPath.style.strokeDashoffset = plen * (1 - MATH.easeInOutSine(t));
      })
    );
    const tipJob = ANIMATION.sleep(950).then(() =>
      ANIMATION.tween(420, t => { d.pistilTip.style.opacity = t; })
    );
    await Promise.all([discJob, ...dotJobs, pistilJob, tipJob]);
  },

  // Filaments draw outward, anthers pop at their tips
  async animateStamens() {
    const d = FLOWER.data;
    const jobs = [];
    d.filamentEls.forEach((f, i) => {
      const flen = f.getTotalLength();
      jobs.push(
        ANIMATION.sleep(i * 105).then(() =>
          ANIMATION.tween(430, t => {
            f.style.strokeDashoffset = flen * (1 - MATH.easeOutCubic(t));
          })
        ),
        ANIMATION.sleep(i * 105 + 360).then(() =>
          ANIMATION.tween(320, t => { d.antherEls[i].style.opacity = t; })
        )
      );
    });
    await Promise.all(jobs);
  }
};

/* ============================================================
   11b. HEART — the parametric heart
        x(t) = 16·sin³(t)
        y(t) = 13·cos(t) − 5·cos(2t) − 2·cos(3t) − cos(4t)
        0 ≤ t ≤ 2π
   Shared math space with GRID (scale 5.5), so the heart sits
   exactly on the coordinate plane.
   ============================================================ */
const HEART = {
  samples: 420,
  scale: 5.8, // = GRID.scale
  params: { A: 16, B: 13, C: 5, D: 2, E: 1 },
  pts: [],       // SVG-space points along the curve
  raw: [],       // math-space points
  cum: [],       // cumulative arc length
  total: 0,
  built: false,
  els: null,

  // The displayed equation — this is the function used, verbatim
  heartPoint(t) {
    const p = HEART.params;
    const x = p.A * Math.pow(Math.sin(t), 3);
    const y = p.B * Math.cos(t)
      - p.C * Math.cos(2 * t)
      - p.D * Math.cos(3 * t)
      - p.E * Math.cos(4 * t);
    return { x, y }; // math coords, y up
  },

  generate() {
    if (HEART.built) return HEART.els;
    const N = HEART.samples;
    const s = HEART.scale;

    // Sample the curve
    HEART.raw = [];
    HEART.pts = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * MATH.TAU;
      const raw = HEART.heartPoint(t);
      HEART.raw.push(raw);
      HEART.pts.push(SVG.transformPoint({ x: raw.x * s, y: raw.y * s }));
    }

    // Cumulative arc length (used to sync the pen with t)
    HEART.cum = [0];
    for (let i = 1; i < HEART.pts.length; i++) {
      const dx = HEART.pts[i].x - HEART.pts[i - 1].x;
      const dy = HEART.pts[i].y - HEART.pts[i - 1].y;
      HEART.cum.push(HEART.cum[i - 1] + Math.hypot(dx, dy));
    }
    HEART.total = HEART.cum[HEART.cum.length - 1];

    const d = SVG.buildPath(HEART.pts, true);

    // Secondary curve: the same equation offset along its normal
    const secondary = [];
    const eps = 0.55; // math units
    for (let i = 0; i <= N; i++) {
      const a = HEART.raw[Math.max(0, i - 1)];
      const b = HEART.raw[Math.min(N, i + 1)];
      const dx = b.x - a.x, dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const q = { x: HEART.raw[i].x + eps * nx, y: HEART.raw[i].y + eps * ny };
      secondary.push(SVG.transformPoint({ x: q.x * s, y: q.y * s }));
    }

    // Elements
    const layer = DOM['layer-heart'];
    SVG.clear(layer);
    const group = SVG.el('g', { id: 'heart-group' });

    const fill = SVG.el('path', {
      d, fill: 'url(#heart-fill-gradient)', opacity: '0',
      id: 'heart-fill'
    });
    const sec = SVG.el('path', {
      d: SVG.buildPath(secondary, true), fill: 'none',
      stroke: 'rgba(214,51,132,0.55)', 'stroke-width': '0.8',
      opacity: '0', id: 'heart-secondary'
    });
    const outline = SVG.el('path', {
      d, fill: 'none', stroke: '#E83E8C', 'stroke-width': '1.9',
      'stroke-linejoin': 'round', 'stroke-linecap': 'round',
      filter: 'url(#soft-glow)', id: 'heart-outline'
    });
    const cursor = SVG.el('circle', {
      cx: 0, cy: 0, r: '2.4', fill: '#FFD1E5',
      filter: 'url(#cursor-glow)', opacity: '0', id: 'heart-cursor'
    });

    group.appendChild(fill);
    group.appendChild(sec);
    group.appendChild(outline);
    group.appendChild(cursor);
    layer.appendChild(group);

    // Arm the progressive draw
    outline.style.strokeDasharray = HEART.total;
    outline.style.strokeDashoffset = HEART.total;

    HEART.els = { group, fill, sec, outline, cursor, layer };
    HEART.built = true;
    return HEART.els;
  },

  // Point + arc length at a given t (0..2π)
  at(t) {
    const N = HEART.samples;
    const u = MATH.clamp(t / MATH.TAU, 0, 1);
    const f = u * N;
    const i = Math.min(N, Math.floor(f));
    const frac = f - i;
    const p0 = HEART.pts[i];
    const p1 = HEART.pts[Math.min(N, i + 1)];
    return {
      x: MATH.lerp(p0.x, p1.x, frac),
      y: MATH.lerp(p0.y, p1.y, frac),
      length: MATH.lerp(HEART.cum[i], HEART.cum[Math.min(N, i + 1)], frac)
    };
  },

  // Full, finished heart shown instantly (used by the skip path)
  showComplete() {
    const e = HEART.generate();
    e.outline.style.strokeDashoffset = 0;
    e.fill.setAttribute('opacity', '1');
    e.sec.setAttribute('opacity', '1');
    e.cursor.setAttribute('opacity', '0');
    DOM['param-display'].classList.remove('visible');
  }
};

/* ============================================================
   11c. MORPH — the flower's points become the heart's points
   One SVG path, drawn as a field of round dots. The real
   sampled flower points travel to the real heart points.
   ============================================================ */
const MORPH = {
  N: 420,
  path: null,
  flowerPts: [],
  heartPts: [],
  done: false,

  prepare() {
    HEART.generate();

    // Real flower outline points, ordered clockwise from the top
    const rawFlower = FLOWER.samplePoints(MORPH.N);
    const keyed = rawFlower.map(p => {
      const theta = Math.atan2(-p.y, p.x);           // math angle
      let key = Math.PI / 2 - theta;                 // start at the top, clockwise
      key = ((key % MATH.TAU) + MATH.TAU) % MATH.TAU;
      return { key, p };
    });
    keyed.sort((a, b) => a.key - b.key);
    MORPH.flowerPts = keyed.map(k => k.p);

    // Real heart points, ordered by t (t = 0 sits at the top dip)
    MORPH.heartPts = HEART.pts.slice(0, MORPH.N);

    const layer = DOM['layer-morph'];
    SVG.clear(layer);
    MORPH.path = SVG.el('path', {
      fill: 'none', stroke: '#FF8FC4', 'stroke-width': '1.7',
      'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      opacity: '0', id: 'morph-path'
    });
    layer.appendChild(MORPH.path);
    MORPH.setDots(range(MORPH.N));
    MORPH.done = false;

    function range(n) {
      const arr = [];
      for (let i = 0; i < n; i++) arr.push(i);
      return arr;
    }
  },

  // Render only the given dot indices as zero-length round segments
  setDots(indices) {
    let d = '';
    for (const i of indices) {
      const p = MORPH.current && MORPH.current[i] ? MORPH.current[i] : MORPH.flowerPts[i];
      d += 'M ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2) +
           ' L ' + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    }
    MORPH.path.setAttribute('d', d);
  },

  // The transformation: every flower point travels along a gently
  // curved, deterministic path to its heart position.
  async run(duration) {
    const N = MORPH.N;
    MORPH.current = MORPH.flowerPts.map(p => ({ x: p.x, y: p.y }));
    MORPH.path.setAttribute('opacity', '0.95');

    // Flower dissolves while the points are in flight
    const flowerLayer = DOM['layer-flower'];
    ANIMATION.tween(1300, t => { flowerLayer.style.opacity = 1 - t; });

    const ok = await ANIMATION.tween(duration, t => {
      const e = MATH.easeInOutCubic(t);
      const swirl = Math.sin(Math.PI * t); // arcs rise and settle
      const all = [];
      for (let i = 0; i < N; i++) {
        const a = MORPH.flowerPts[i];
        const b = MORPH.heartPts[i];
        let x = MATH.lerp(a.x, b.x, e);
        let y = MATH.lerp(a.y, b.y, e);
        // gentle same-direction swirl so points arc, not slide
        const dx = b.x - a.x, dy = b.y - a.y;
        const len = Math.hypot(dx, dy) || 1;
        const amp = 0.12 * Math.min(len, 40) * swirl;
        x += (-dy / len) * amp;
        y += (dx / len) * amp;
        MORPH.current[i] = { x, y };
        all.push(i);
      }
      MORPH.setDots(all);
    });

    // Settle exactly onto the heart
    MORPH.current = MORPH.heartPts.map(p => ({ x: p.x, y: p.y }));
    MORPH.setDots(rangeIdx(MORPH.N));
    MORPH.done = true;
    return ok;

    function rangeIdx(n) {
      const arr = [];
      for (let i = 0; i < n; i++) arr.push(i);
      return arr;
    }
  },

  // During the heart's pen-draw: the pen consumes the dots behind
  // it, a short window of dots waits just ahead, and the far ones
  // dissolve during the first moments of the draw.
  windowUpTo(progress) {
    if (!MORPH.path) return;
    const N = MORPH.N;
    const head = Math.min(N - 1, Math.floor(progress * N));
    const shrink = MATH.clamp(progress / 0.12, 0, 1);
    const windowSize = Math.floor(MATH.lerp(N, N * 0.14, shrink));
    const to = Math.min(N - 1, head + windowSize);
    const idx = [];
    for (let i = head; i <= to; i++) idx.push(i);
    MORPH.setDots(idx);
  },

  clear() {
    if (MORPH.path && MORPH.path.parentNode) {
      MORPH.path.parentNode.removeChild(MORPH.path);
    }
    MORPH.path = null;
  }
};

/* ============================================================
   11d. MOON — a small mathematical moon
   Soft pink disc with deterministically placed craters, a halo,
   and an elliptical orbit:  x(t) = a·cos(t), y(t) = b·sin(t)
   ============================================================ */
const MOON = {
  built: false,
  group: null,
  // Orbit (SVG units): ellipse around the heart
  orbit: { cx: 0, cy: -24, a: 58, b: 36 },
  // Where it settles — upper-left of the heart, inside the grid
  finalPos: { x: -66, y: -76 },
  // Fixed crater table (deterministic — no randomness)
  craters: [
    { cx: -3.2, cy: -2.4, r: 2.2 },
    { cx: 3.0, cy: 2.0, r: 1.6 },
    { cx: 1.4, cy: -4.0, r: 1.1 },
    { cx: -1.4, cy: 4.2, r: 1.4 },
    { cx: 4.6, cy: -1.6, r: 0.9 },
    { cx: -5.0, cy: 2.6, r: 0.8 }
  ],

  build() {
    if (MOON.built) return MOON.group;
    const layer = DOM['layer-moon'];
    SVG.clear(layer);

    const g = SVG.el('g', { id: 'moon-group', opacity: '0' });

    g.appendChild(SVG.el('circle', {
      cx: 0, cy: 0, r: 27, fill: 'url(#moon-halo-gradient)'
    }));
    g.appendChild(SVG.el('circle', {
      cx: 0, cy: 0, r: 9.5, fill: 'url(#moon-gradient)',
      filter: 'url(#soft-glow)'
    }));
    for (const c of MOON.craters) {
      g.appendChild(SVG.el('circle', {
        cx: c.cx, cy: c.cy, r: c.r,
        fill: 'rgba(143,40,88,0.22)'
      }));
    }
    // terminator shading — a soft dark limb on the lower-right
    g.appendChild(SVG.el('circle', {
      cx: 2.6, cy: 2.6, r: 9.4,
      fill: 'rgba(94,22,54,0.20)'
    }));

    layer.appendChild(g);
    MOON.group = g;
    MOON.built = true;
    MOON.placeAt(MOON.orbitPoint(0));
    return g;
  },

  orbitPoint(t) {
    const o = MOON.orbit;
    return { x: o.cx + o.a * Math.cos(t), y: o.cy + o.b * Math.sin(t) };
  },

  placeAt(p) {
    MOON.group.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ',' + p.y.toFixed(2) + ')');
  },

  async reveal() {
    MOON.build();
    await ANIMATION.tween(1400, t => {
      MOON.group.setAttribute('opacity', MATH.easeOutCubic(t).toFixed(3));
    });
  },

  // Travel the ellipse, then drift to its resting place near the heart
  async travel() {
    const t0 = -0.35 * Math.PI;
    const sweep = 1.55 * Math.PI;
    let last = MOON.orbitPoint(t0);
    const ok = await ANIMATION.tween(4600, t => {
      const e = MATH.easeInOutSine(t);
      last = MOON.orbitPoint(t0 + sweep * e);
      MOON.placeAt(last);
    });
    if (!ok) return; // skipped — PROPOSAL.prepareStage() will settle it
    const from = last, to = MOON.finalPos;
    await ANIMATION.tween(1600, t => {
      const e = MATH.easeInOutCubic(t);
      MOON.placeAt({
        x: MATH.lerp(from.x, to.x, e),
        y: MATH.lerp(from.y, to.y, e)
      });
    });
  },

  // Instant settle (skip path / finale)
  showSettled() {
    MOON.build();
    MOON.group.setAttribute('opacity', '1');
    MOON.placeAt(MOON.finalPos);
  }
};

/* ============================================================
   11e. PROPOSAL — the question, the answer, the finale
   ============================================================ */
const PROPOSAL = {
  wired: false,
  answered: false, // one-tap guard: YES / THINK can't double-fire

  // Full stage setup so the proposal looks right whether it is
  // reached naturally or jumped to with the Skip button.
  prepareStage() {
    // Flower is history
    const fl = DOM['layer-flower'];
    fl.style.display = 'none';
    fl.style.opacity = '0';

    // No stray wandering point
    ANIMATION.clearContainer(DOM['layer-point']);
    POINT.el = null;
    POINT.halo = null;

    // Morph dots gone, heart whole
    MORPH.clear();
    HEART.showComplete();
    const hl = DOM['layer-heart'];
    hl.classList.remove('pulsing');
    hl.classList.add('breathing');

    // Moon settled near the heart
    MOON.showSettled();

    // Grid present (it fades only when she says yes)
    GRID.show();
    DOM['layer-grid'].classList.remove('faded');

    // No leftover overlays
    SCENES.cleanupOverlays();
    DOM['btn-skip'].classList.add('hidden');
  },

  async reveal() {
    const sec = DOM['proposal'];
    const q = DOM['proposal-question'];
    const btns = DOM['proposal-buttons'];

    sec.classList.remove('hidden');
    DOM['layer-heart'].classList.add('lifted');
    q.textContent = CONFIG.proposalText;

    await ANIMATION.sleep(700);
    q.classList.add('visible');
    await ANIMATION.sleep(1700);
    btns.classList.add('visible');
  },

  // ---- Deterministic celebration particles (one path, golden angle) ----
  particles(duration) {
    const layer = DOM['layer-particles'];
    SVG.clear(layer);
    const path = SVG.el('path', {
      fill: 'none', stroke: '#FFD1E5', 'stroke-width': '1.6',
      'stroke-linecap': 'round', opacity: '0'
    });
    layer.appendChild(path);

    const N = 90;
    const seeds = [];
    for (let i = 0; i < N; i++) {
      const t = (i / N) * MATH.TAU;
      const raw = HEART.heartPoint(t);
      const start = SVG.transformPoint({ x: raw.x * HEART.scale, y: raw.y * HEART.scale });
      const dx = start.x, dy = start.y + 8;
      const len = Math.hypot(dx, dy) || 1;
      const golden = i * 2.399963; // golden angle spread — deterministic
      seeds.push({
        start,
        dirX: dx / len,
        dirY: dy / len,
        sideX: -dy / len,
        sideY: dx / len,
        dist: 30 + MATH.hash(i * 3 + 1) * 46,
        delay: MATH.hash(i * 5 + 2) * 0.42,
        wobble: (MATH.hash(i * 7 + 3) - 0.5) * 14,
        phase: golden
      });
    }

    const points = new Array(N);
    let visible = true;
    ANIMATION.tween(duration, globalT => {
      const head = MATH.clamp(globalT, 0, 1);
      path.setAttribute('opacity', head < 0.72 ? 0.9 : (0.9 * (1 - (head - 0.72) / 0.28)).toFixed(3));
      let d = '';
      for (let i = 0; i < N; i++) {
        const s = seeds[i];
        const u = MATH.clamp((head - s.delay) / (1 - s.delay), 0, 1);
        if (u <= 0) continue;
        const e = MATH.easeOutCubic(u);
        const drift = Math.sin(u * Math.PI) * s.wobble;
        const x = s.start.x + s.dirX * s.dist * e + s.sideX * drift;
        const y = s.start.y + s.dirY * s.dist * e + s.sideY * drift
          - Math.sin(u * Math.PI) * 10 * MATH.hash(i + 91);
        points[i] = x.toFixed(2) + ' ' + y.toFixed(2);
        d += 'M ' + points[i] + ' L ' + points[i];
      }
      path.setAttribute('d', d);
    }).then(() => {
      visible = false;
      setTimeout(() => { if (!visible && path.parentNode) path.parentNode.removeChild(path); }, 400);
    });
  },

  async handleYes() {
    if (PROPOSAL.answered) return;
    PROPOSAL.answered = true;
    const btns = DOM['proposal-buttons'];
    btns.classList.remove('visible');
    await ANIMATION.sleep(650);
    btns.classList.add('hidden');
    DOM['think-panel'].classList.add('hidden');

    // The grid and axes step away; the heart opens
    GRID.fade();
    const hl = DOM['layer-heart'];
    hl.classList.add('expanded');
    await ANIMATION.sleep(900);
    PROPOSAL.particles(4200);

    // Celebration lines
    await POETRY.sayLines(CONFIG.yesLines, { gap: 1100, hold: 1900, clear: true });
    await POETRY.sayLines(CONFIG.yesClosing, { gap: 950, hold: 3400, clear: true });
    await ANIMATION.sleep(700);

    // ---- Final screen ----
    DOM['proposal'].classList.add('hidden');
    document.body.classList.add('lighter');
    const fin = DOM['final-screen'];
    fin.classList.remove('hidden');

    const b1 = DOM['final-block-1'];
    b1.textContent = CONFIG.finalMessage.join('\n');
    requestAnimationFrame(() => requestAnimationFrame(() => b1.classList.add('visible')));
    await ANIMATION.sleep(3000);

    const b2 = DOM['final-block-2'];
    b2.textContent = CONFIG.finalMessage2.join('\n');
    requestAnimationFrame(() => requestAnimationFrame(() => b2.classList.add('visible')));
    await ANIMATION.sleep(3400);

    const sig = DOM['final-signature'];
    sig.textContent = CONFIG.finalSignature.replace('{name}', CONFIG.recipientName);
    sig.classList.add('visible');
    await ANIMATION.sleep(2200);

    DOM['final-symbol'].classList.add('visible');
    await ANIMATION.sleep(1400);
    DOM['final-actions'].classList.add('visible');
  },

  handleThink() {
    if (PROPOSAL.answered) return;
    PROPOSAL.answered = true;
    const btns = DOM['proposal-buttons'];
    const panel = DOM['think-panel'];
    btns.classList.remove('visible');
    setTimeout(() => {
      btns.classList.add('hidden');
      panel.classList.remove('hidden');
      const l1 = DOM['think-line-1'];
      const l2 = DOM['think-line-2'];
      l1.textContent = CONFIG.thinkResponse[0];
      l2.textContent = CONFIG.thinkResponse[1];
      requestAnimationFrame(() => requestAnimationFrame(() => l1.classList.add('visible')));
      setTimeout(() => {
        requestAnimationFrame(() => l2.classList.add('visible'));
        setTimeout(() => DOM['btn-back'].classList.remove('hidden'), 1400);
      }, 1700);
    }, 700);
  },

  backToQuestion() {
    const panel = DOM['think-panel'];
    const btns = DOM['proposal-buttons'];
    DOM['think-line-1'].classList.remove('visible');
    DOM['think-line-2'].classList.remove('visible');
    DOM['btn-back'].classList.add('hidden');
    setTimeout(() => {
      panel.classList.add('hidden');
      PROPOSAL.answered = false;
      btns.classList.remove('hidden');
      requestAnimationFrame(() => requestAnimationFrame(() => btns.classList.add('visible')));
    }, 700);
  },

  // ---- "See how it was made" ----
  openMathPanel() {
    const content = DOM['math-panel-content'];
    if (!content.innerHTML) {
      const mp = CONFIG.mathPanel;
      let html = '<div class="math-title">' + mp.title + '</div>';
      for (const block of mp.blocks) {
        html += '<div class="math-block">' +
          '<div class="math-block-label">' + block.label + '</div>' +
          '<div class="math-block-eq">' + block.eq + '</div>' +
          '</div>';
      }
      html += '<div class="math-closing">' + mp.closing.join('<br>') + '</div>';
      content.innerHTML = html;
    }
    DOM['math-panel'].classList.remove('hidden');
  },

  wire() {
    if (PROPOSAL.wired) return;
    PROPOSAL.wired = true;
    DOM['btn-yes'].addEventListener('click', PROPOSAL.handleYes);
    DOM['btn-think'].addEventListener('click', PROPOSAL.handleThink);
    DOM['btn-back'].addEventListener('click', PROPOSAL.backToQuestion);
    DOM['btn-replay'].addEventListener('click', () => window.location.reload());
    DOM['btn-see-math'].addEventListener('click', PROPOSAL.openMathPanel);
    DOM['btn-close-math'].addEventListener('click', () =>
      DOM['math-panel'].classList.add('hidden'));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') DOM['math-panel'].classList.add('hidden');
    });
  }
};

/* ============================================================
   12j. SCENE: THE PROPOSAL (essential — Skip lands here)
   ============================================================ */
async function sceneProposal() {
  PROPOSAL.prepareStage();
  await ANIMATION.sleep(900);
  await PROPOSAL.reveal();
  // The story now waits for her answer.
}

/* ============================================================
   12. SCENE: THE FIRST POINT
   ============================================================ */
async function sceneFirstPoint() {
  const textLayer = DOM['text-layer'];
  textLayer.classList.add('lower');

  // 1. The point appears
  await ANIMATION.sleep(900);
  await POINT.reveal();
  if (SCENES.skipRequested) return;

  // 2. "Everything starts with a point."
  const l1 = await POETRY.line(CONFIG.intro.line1);
  await ANIMATION.sleep(2600);
  if (SCENES.skipRequested) { await POETRY.clear(); return; }
  await ANIMATION.hideLine(l1);

  // 3. "Let's see where this one goes."
  const l2 = await POETRY.line(CONFIG.intro.line2);
  await ANIMATION.sleep(2400);
  await ANIMATION.hideLine(l2);
  textLayer.classList.remove('lower');
  if (SCENES.skipRequested) { POETRY.clear(); return; }

  // 4. The coordinate grid reveals itself around the point
  GRID.show();
  await ANIMATION.sleep(2000);
  if (SCENES.skipRequested) return;

  // 5. The point begins to move — we follow it
  await POINT.travel(5200);
  if (SCENES.skipRequested) return;
  await ANIMATION.sleep(700);
}

/* ============================================================
   12b. EQUATION DISPLAY helpers (the flower's mathematics)
   ============================================================ */
const EQUATIONS = {
  async show(lines) {
    const layer = DOM['equation-layer'];
    layer.innerHTML = '';
    const created = [];
    for (const text of lines) {
      const el = document.createElement('div');
      el.className = 'eq-line';
      el.textContent = text;
      layer.appendChild(el);
      requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
      created.push(el);
      await ANIMATION.sleep(650);
      if (SCENES.skipRequested) return created;
    }
    return created;
  },

  async fade() {
    const layer = DOM['equation-layer'];
    const lines = Array.from(layer.querySelectorAll('.eq-line'));
    lines.forEach(l => l.classList.add('gone'));
    await ANIMATION.sleep(1100);
    layer.innerHTML = '';
  }
};

/* ============================================================
   12c. SCENE: THE FLOWER BUILDS ITSELF
   ============================================================ */
async function sceneFlowerBuild() {
  const textLayer = DOM['text-layer'];

  // Build the geometry and immediately arm the draw animation
  // (same task — nothing is painted between these calls)
  await POINT.vanish();
  FLOWER.generateFlower();
  FLOWER.prepareAnimation();

  // 1. The equations appear
  const eq = await EQUATIONS.show([
    'r(θ) = R + A·cos(k·(θ − φ))',
    '     + B·sin(2θ + δ) + C·cos(3θ + ε)',
    'x = r·cos(θ)    y = r·sin(θ)'
  ]);
  if (SCENES.skipRequested) return;
  await ANIMATION.sleep(900);
  if (SCENES.skipRequested) return;

  // 2. Petals draw one by one, each with a small caption
  const captions = [
    CONFIG.flowerCaptions[0], // "One equation."
    CONFIG.flowerCaptions[1], // "Another curve."
    CONFIG.flowerCaptions[2]  // "Another point."
  ];

  for (let i = 0; i < FLOWER.data.petals.length; i++) {
    if (SCENES.skipRequested) return;
    await FLOWER.animatePetal(i);
    if (i < captions.length && !SCENES.skipRequested) {
      textLayer.classList.add('lower');
      const cap = await POETRY.line(captions[i], 'scene-line dim');
      await ANIMATION.sleep(1600);
      await ANIMATION.hideLine(cap);
      textLayer.classList.remove('lower');
    }
  }

  // 3. Centre forms, then the stamens
  if (SCENES.skipRequested) return;
  await FLOWER.animateCenter();
  if (SCENES.skipRequested) return;
  await ANIMATION.sleep(400);
  await FLOWER.animateStamens();
  if (SCENES.skipRequested) return;
  await ANIMATION.sleep(600);

  // 4. The final caption, then the equations softly leave
  textLayer.classList.add('lower');
  const finalCap = await POETRY.line(CONFIG.flowerCaptions[3], 'scene-line larger');
  await ANIMATION.sleep(2000);
  await ANIMATION.hideLine(finalCap);
  textLayer.classList.remove('lower');
  await EQUATIONS.fade();
}

/* ============================================================
   12d. SCENE: THE FLOWER POEM
   ============================================================ */
async function sceneFlowerPoem() {
  await ANIMATION.sleep(700);
  await POETRY.stanza(CONFIG.flowerPoem, { gap: 1250, hold: 2600 });
  if (SCENES.skipRequested) return;
  await ANIMATION.sleep(500);
}

/* ============================================================
   12e. SCENE: FLOWER POINTS BECOME THE HEART,
        THEN THE HEART DRAWS ITSELF
   ============================================================ */
async function sceneHeart() {
  // Build the heart geometry and pre-compute the morph
  // while the flower is still fully visible.
  HEART.generate();
  MORPH.prepare();
  await ANIMATION.sleep(600);
  if (SCENES.skipRequested) return;

  // ---- The transformation: beauty → emotion ----
  await MORPH.run(2900);
  if (SCENES.skipRequested) return;

  // The heart of points, quietly holding its shape
  await ANIMATION.sleep(1100);
  if (SCENES.skipRequested) return;

  // ---- The equation of the heart ----
  await EQUATIONS.show([
    'x(t) = 16·sin³(t)',
    'y(t) = 13·cos(t) − 5·cos(2t) − 2·cos(3t) − cos(4t)',
    '0 ≤ t ≤ 2π'
  ]);
  if (SCENES.skipRequested) return;
  await ANIMATION.sleep(1100);

  const travel = await POETRY.line('Then let t travel.', 'scene-line dim');
  await ANIMATION.sleep(1800);
  await ANIMATION.hideLine(travel);
  if (SCENES.skipRequested) return;
  await EQUATIONS.fade();

  // ---- The pen: a glowing point travels the curve ----
  const e = HEART.els;
  const param = DOM['param-display'];
  e.cursor.setAttribute('opacity', '1');
  param.classList.add('visible');

  await ANIMATION.tween(4300, t => {
    const eased = MATH.easeInOutSine(t);
    const tt = eased * MATH.TAU;
    const at = HEART.at(tt);
    e.outline.style.strokeDashoffset = (HEART.total - at.length).toFixed(2);
    e.cursor.setAttribute('cx', at.x.toFixed(2));
    e.cursor.setAttribute('cy', at.y.toFixed(2));
    param.textContent = 'P(t) = (x(t), y(t))     t = ' + MATH.formatPi(tt);
    MORPH.windowUpTo(eased);
  });
  if (SCENES.skipRequested) return;

  // ---- Completion: t = 2π ----
  param.textContent = 'P(t) = (x(t), y(t))     t = 2π';
  await ANIMATION.sleep(700);
  param.classList.remove('visible');
  await ANIMATION.tween(500, t => {
    e.cursor.setAttribute('opacity', String(1 - t));
  });

  // Fill and the rose undertone bloom in
  await Promise.all([
    ANIMATION.tween(900, t => { e.fill.setAttribute('opacity', MATH.easeOutCubic(t).toFixed(3)); }),
    ANIMATION.tween(900, t => { e.sec.setAttribute('opacity', (0.9 * MATH.easeOutCubic(t)).toFixed(3)); })
  ]);
  MORPH.clear();

  // One pulse, then a held silence
  await ANIMATION.sleep(350);
  e.layer.classList.add('pulsing');
  await ANIMATION.sleep(1850);
  e.layer.classList.remove('pulsing');
  e.layer.classList.add('breathing');
  await ANIMATION.sleep(1900);
}

/* ============================================================
   12f. SCENE: THE MOON & THE HEART POETRY
   ============================================================ */
async function sceneMoonPoem() {
  const stanza = CONFIG.heartPoem;

  // The first two lines set the scene; the moon arrives as they land
  const firstLines = stanza.slice(0, 2);
  const restLines = stanza.slice(2);

  await ANIMATION.sleep(800);
  const l0 = await POETRY.line(firstLines[0]);
  await ANIMATION.sleep(1100);
  const l1 = await POETRY.line(firstLines[1]);
  if (SCENES.skipRequested) { POETRY.clear(); return; }

  // The moon appears and travels its elliptical orbit
  const moonJob = (async () => {
    await MOON.reveal();
    await MOON.travel();
  })();

  await ANIMATION.sleep(1600);
  await ANIMATION.hideLine(l0);
  await ANIMATION.hideLine(l1);
  if (SCENES.skipRequested) { await moonJob; POETRY.clear(); return; }

  // The rest of the stanza, line by line
  await POETRY.stanza(restLines, { gap: 1400, hold: 3000 });
  await moonJob;
  if (SCENES.skipRequested) return;
  await ANIMATION.sleep(900);

  // "You became my moon."  … while it hangs there, settled
  const m1 = await POETRY.line(CONFIG.heartPoemAfter[0], 'scene-line poem-emphasis');
  await ANIMATION.sleep(2600);
  await ANIMATION.hideLine(m1);
  if (SCENES.skipRequested) return;

  const m2 = await POETRY.line(CONFIG.heartPoemAfter[1], 'scene-line poem-emphasis');
  await ANIMATION.sleep(2200);
  await ANIMATION.hideLine(m2);
  if (SCENES.skipRequested) return;

  const m3 = await POETRY.line(CONFIG.heartPoemAfter[2], 'scene-line poem-emphasis');
  await ANIMATION.sleep(2400);
  await ANIMATION.hideLine(m3);
  await ANIMATION.sleep(600);
}

/* ============================================================
   12g. SCENE: d(P, M) — the distance metaphor
   ============================================================ */
async function sceneDistance() {
  const meta = CONFIG.distanceMetaphor;

  // d(P, M) and its quiet legend
  await EQUATIONS.show(['d(P, M)']);
  if (SCENES.skipRequested) return;
  await ANIMATION.sleep(900);
  for (const legend of meta.legend) {
    if (SCENES.skipRequested) return;
    const el = document.createElement('div');
    el.className = 'eq-line';
    el.style.fontStyle = 'italic';
    el.textContent = legend;
    DOM['equation-layer'].appendChild(el);
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('visible')));
    await ANIMATION.sleep(420);
  }
  await ANIMATION.sleep(900);
  if (SCENES.skipRequested) return;

  // The measured distances of the past
  const lines = meta.lines;
  const created = [];
  for (let i = 0; i < lines.length; i++) {
    if (SCENES.skipRequested) return;
    const l = await POETRY.line(lines[i], 'scene-line dim');
    created.push(l);
    await ANIMATION.sleep(i === lines.length - 1 ? 1600 : 1250);
  }
  for (const l of created) await ANIMATION.hideLine(l);
  if (SCENES.skipRequested) return;

  // The equation fades…
  await EQUATIONS.fade();
  if (SCENES.skipRequested) return;

  // …and becomes P → M
  await EQUATIONS.show(['P → M']);
  await ANIMATION.sleep(700);
  const after = await POETRY.line(meta.after, 'scene-line larger');
  await ANIMATION.sleep(3000);
  await ANIMATION.hideLine(after);
  await EQUATIONS.fade();
}

/* ============================================================
   12h. SCENE: THE UNEXPECTED COORDINATE
   ============================================================ */
async function sceneUnexpected() {
  const textLayer = DOM['text-layer'];
  textLayer.classList.add('lower');

  // Deterministic waypoints (fixed table — looks wandering, isn't random)
  const waypoints = [
    { x: -11, y: 7 }, { x: 9, y: 11 }, { x: -6, y: -9 },
    { x: 12, y: -5 }, { x: 3, y: 13 }, { x: -13, y: -3 }
  ];

  await ANIMATION.sleep(600);
  await POINT.reveal();
  const start = SVG.transformPoint({ x: waypoints[0].x * GRID.scale, y: waypoints[0].y * GRID.scale });
  POINT.setPos(start.x, start.y);
  if (SCENES.skipRequested) return;

  const moveTo = async (wp, dur) => {
    const from = { x: parseFloat(POINT.el.getAttribute('cx')), y: parseFloat(POINT.el.getAttribute('cy')) };
    const to = SVG.transformPoint({ x: wp.x * GRID.scale, y: wp.y * GRID.scale });
    await ANIMATION.tween(dur, t => {
      const e = MATH.easeInOutCubic(t);
      POINT.setPos(MATH.lerp(from.x, to.x, e), MATH.lerp(from.y, to.y, e));
    });
  };

  const l1 = await POETRY.line(CONFIG.unexpected[0]);
  await moveTo(waypoints[1], 1100);
  await moveTo(waypoints[2], 1100);
  await ANIMATION.sleep(400);
  if (SCENES.skipRequested) { await POETRY.clear(); return; }
  await ANIMATION.hideLine(l1);

  const l2 = await POETRY.line(CONFIG.unexpected[1]);
  await moveTo(waypoints[3], 1100);
  await moveTo(waypoints[4], 1100);
  await ANIMATION.sleep(400);
  if (SCENES.skipRequested) { await POETRY.clear(); return; }
  await ANIMATION.hideLine(l2);

  const l3 = await POETRY.line(CONFIG.unexpected[2]);
  await moveTo(waypoints[5], 1100);
  await moveTo({ x: 0, y: 0 }, 1300);
  await ANIMATION.sleep(300);
  if (SCENES.skipRequested) { await POETRY.clear(); return; }
  await ANIMATION.hideLine(l3);

  // The point reaches the origin — and the heart answers
  await POINT.vanish();
  const heartLayer = DOM['layer-heart'];
  heartLayer.classList.add('pulsing');
  await ANIMATION.sleep(1700);
  heartLayer.classList.remove('pulsing');
  heartLayer.classList.add('breathing');

  const found = await POETRY.line(CONFIG.foundYou, 'scene-line larger');
  await ANIMATION.sleep(2600);
  await ANIMATION.hideLine(found);
  textLayer.classList.remove('lower');
  await ANIMATION.sleep(500);
}

/* ============================================================
   12i. SCENE: You + Me = ?
   ============================================================ */
async function sceneFinalEquation() {
  const meta = CONFIG.finalMetaphor;

  await ANIMATION.sleep(600);
  const eq = await POETRY.line(meta.equation, 'scene-line larger');
  await ANIMATION.sleep(2600);
  await ANIMATION.hideLine(eq);
  if (SCENES.skipRequested) return;

  const l1 = await POETRY.line(meta.lines[0], 'scene-line dim');
  const l2 = await POETRY.line(meta.lines[1], 'scene-line dim');
  await ANIMATION.sleep(1700);
  await ANIMATION.hideLine(l1);
  await ANIMATION.hideLine(l2);
  if (SCENES.skipRequested) return;

  const l3 = await POETRY.line(meta.lines[2], 'scene-line larger');
  await ANIMATION.sleep(3200);
  await ANIMATION.hideLine(l3);
  await ANIMATION.sleep(700);
}

/* ============================================================
   13. BOOT
   ============================================================ */
function setupHud() {
  DOM['btn-skip'].classList.remove('hidden');
  DOM['btn-skip'].addEventListener('click', () => {
    SCENES.requestSkip();
    DOM['btn-skip'].classList.add('hidden');
  });
}

// Reduced motion: the CSS already shortens transitions; the JS clock
// follows suit so the whole story stays brisk instead of feeling broken.
function applyMotionPreference() {
  if (!window.matchMedia) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ANIMATION.timeScale = 0.35;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cacheDom();
  applyMotionPreference();
  MUSIC.init();
  setupHud();
  SCENES.register('first-point', sceneFirstPoint);
  SCENES.register('flower-build', sceneFlowerBuild);
  SCENES.register('flower-poem', sceneFlowerPoem);
  SCENES.register('heart', sceneHeart);
  SCENES.register('moon-poem', sceneMoonPoem);
  SCENES.register('distance', sceneDistance);
  SCENES.register('unexpected', sceneUnexpected);
  SCENES.register('final-equation', sceneFinalEquation);
  SCENES.register('proposal', sceneProposal, { essential: true });
  PROPOSAL.wire();
  SCENES.run();
});
