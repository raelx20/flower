// Mathematical Flower - All geometry from mathematical equations
var SVG_NS = 'http://www.w3.org/2000/svg';
var svg = document.getElementById('flower-svg');
var petalsLayer = document.getElementById('petals-layer');
var veinsLayer = document.getElementById('veins-layer');
var centerLayer = document.getElementById('center-layer');
var filamentsLayer = document.getElementById('filaments-layer');
var anthersLayer = document.getElementById('anthers-layer');

function svgEl(tag, attrs) {
  var el = document.createElementNS(SVG_NS, tag);
  if (attrs) {
    Object.keys(attrs).forEach(function(k) { el.setAttribute(k, attrs[k]); });
  }
  return el;
}

// Polar to Cartesian: x = r cos(theta), y = r sin(theta)
function pol(r, t) {
  return { x: r * Math.cos(t), y: r * Math.sin(t) };
}

var defaults = {
  count: 5, R: 4.8, A: 1.8, B: 0.25, delta: 0.7,
  C: 0.12, eps: 1.3, innerR: 0.6,
  sizeMul: 1.0, widthMul: 1.0, asymMul: 1.0, curveMul: 1.0, stamenMul: 1.0
};
var params = {};
Object.keys(defaults).forEach(function(k) { params[k] = defaults[k]; });

var petalVar = [
  { ss:1.00, ws:1.00, ab:0.00,  cb:0.00,  ro:0.00 },
  { ss:0.95, ws:1.05, ab:0.08,  cb:0.05,  ro:0.03 },
  { ss:1.03, ws:0.97, ab:-0.05, cb:-0.04, ro:-0.02 },
  { ss:0.97, ws:1.02, ab:0.04,  cb:0.03,  ro:0.01 },
  { ss:1.01, ws:0.98, ab:-0.03, cb:-0.02, ro:-0.01 },
  { ss:0.98, ws:1.03, ab:0.06,  cb:0.04,  ro:0.02 },
  { ss:1.02, ws:0.96, ab:-0.04, cb:-0.03, ro:-0.01 },
  { ss:0.99, ws:1.01, ab:0.02,  cb:0.01,  ro:0.00 }
];

// Petal radial equation: r(theta) = innerR + (R + A*cos(2*theta) + B*sin(2*theta+delta) + C*cos(3*theta+eps)) * envelope
function petalR(theta, R, A, B, dlt, C, ep) {
  var primary = A * Math.cos(2 * (theta - 0));
  var asym = B * Math.sin(2 * theta + dlt);
  var ripple = C * Math.cos(3 * theta + ep);
  var norm = theta / Math.PI;
  var env = Math.pow(Math.max(0, 1 - norm * norm), 1.5);
  var raw = R + (primary + asym + ripple) * env;
  return Math.max(0.1, raw);
}

function petalPath(petalIndex, totalCount) {
  var v = petalVar[petalIndex % petalVar.length];
  var centerAngle = (2 * Math.PI / totalCount) * petalIndex + v.ro;
  var R = params.R * params.sizeMul * v.ss;
  var A = params.A * params.widthMul * v.ws;
  var B = params.B * params.asymMul;
  var dlt = params.delta + v.cb * params.curveMul;
  var C = params.C;
  var ep = params.eps;
  var spread = Math.PI * 0.85 * params.widthMul * v.ws;
  var steps = 60;
  var pts = [];
  for (var i = 0; i <= steps; i++) {
    var frac = i / steps;
    var theta = -spread + frac * 2 * spread;
    var r = petalR(theta, R, A, B, dlt, C, ep);
    var ang = centerAngle + theta;
    pts.push(pol(r, ang));
  }
  var leftPts = [];
  for (var i = steps; i >= 0; i--) {
    var frac = i / steps;
    var theta = -spread + frac * 2 * spread;
    var r = petalR(theta, R, A * 0.97, B * 0.9, dlt + 0.1, C, ep + 0.2);
    var ang = centerAngle + theta;
    leftPts.push(pol(r * 0.96, ang));
  }
  var d = 'M ' + pts[0].x.toFixed(3) + ' ' + pts[0].y.toFixed(3);
  for (var i = 1; i < pts.length; i++) {
    d += ' L ' + pts[i].x.toFixed(3) + ' ' + pts[i].y.toFixed(3);
  }
  for (var i = 0; i < leftPts.length; i++) {
    d += ' L ' + leftPts[i].x.toFixed(3) + ' ' + leftPts[i].y.toFixed(3);
  }
  d += ' Z';
  return { d: d, centerAngle: centerAngle, R: R, spread: spread };
}

function veinPaths(petalIndex, totalCount, petalInfo) {
  var paths = [];
  var ca = petalInfo.centerAngle;
  var R = petalInfo.R;
  var veinCount = 5;
  for (var v = 0; v < veinCount; v++) {
    var offset = (v - (veinCount - 1) / 2) * 0.12;
    var d = '';
    var steps = 25;
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var r = params.innerR * 1.2 + t * R * 0.75;
      var theta = ca + offset * t + 0.15 * Math.sin(t * Math.PI) * (v % 2 === 0 ? 1 : -1);
      var p = pol(r, theta);
      if (i === 0) { d = 'M ' + p.x.toFixed(3) + ' ' + p.y.toFixed(3); }
      else { d += ' L ' + p.x.toFixed(3) + ' ' + p.y.toFixed(3); }
    }
    paths.push(d);
  }
  return paths;
}

function pistilPath() {
  var len = params.stamenMul * 2.8;
  var curv = 0.4;
  var d = '';
  var steps = 40;
  for (var i = 0; i <= steps; i++) {
    var t = i / steps;
    var r = t * len;
    var theta = -Math.PI / 2 + curv * t;
    var p = pol(r, theta);
    if (i === 0) { d = 'M ' + p.x.toFixed(3) + ' ' + p.y.toFixed(3); }
    else { d += ' L ' + p.x.toFixed(3) + ' ' + p.y.toFixed(3); }
  }
  return d;
}

function filamentPaths() {
  var paths = [];
  var count = 12;
  var len = params.stamenMul * 1.6;
  for (var i = 0; i < count; i++) {
    var baseAngle = (2 * Math.PI / count) * i - Math.PI / 2;
    var curv = 0.5 + (i % 3) * 0.15;
    var d = '';
    var steps = 20;
    for (var j = 0; j <= steps; j++) {
      var t = j / steps;
      var r = t * len * (0.6 + 0.4 * Math.sin(t * Math.PI * 0.8));
      var theta = baseAngle + curv * t * (i % 2 === 0 ? 1 : -1);
      var p = pol(r, theta);
      if (j === 0) { d = 'M ' + p.x.toFixed(3) + ' ' + p.y.toFixed(3); }
      else { d += ' L ' + p.x.toFixed(3) + ' ' + p.y.toFixed(3); }
    }
    paths.push({ d: d, tipX: pol(len * 0.9, baseAngle + curv).x, tipY: pol(len * 0.9, baseAngle + curv).y });
  }
  return paths;
}

function clearFlower() {
  petalsLayer.innerHTML = '';
  veinsLayer.innerHTML = '';
  centerLayer.innerHTML = '';
  filamentsLayer.innerHTML = '';
  anthersLayer.innerHTML = '';
}

function buildFlower() {
  clearFlower();
  var n = params.count;
  var petalInfos = [];
  for (var i = 0; i < n; i++) {
    var info = petalPath(i, n);
    petalInfos.push(info);
    petalsLayer.appendChild(svgEl('path', {
      d: info.d, fill: 'url(#petal-gradient-' + (i % 5) + ')',
      stroke: 'rgba(180,80,120,0.3)', 'stroke-width': '0.04',
      filter: 'url(#petal-glow)', 'class': 'petal-path', 'data-index': i
    }));
  }
  for (var i = 0; i < n; i++) {
    var vPaths = veinPaths(i, n, petalInfos[i]);
    for (var j = 0; j < vPaths.length; j++) {
      veinsLayer.appendChild(svgEl('path', {
        d: vPaths[j], fill: 'none', stroke: 'rgba(200,100,140,0.15)',
        'stroke-width': '0.025', 'stroke-linecap': 'round',
        'class': 'vein-path', 'data-petal': i, 'data-vein': j
      }));
    }
  }
  centerLayer.appendChild(svgEl('circle', {
    cx: 0, cy: 0, r: 0.9, fill: '#c2185b', stroke: '#880e4f',
    'stroke-width': '0.06', filter: 'url(#center-glow)', 'class': 'center-element'
  }));
  for (var i = 0; i < 8; i++) {
    var ang = (2 * Math.PI / 8) * i;
    centerLayer.appendChild(svgEl('circle', {
      cx: pol(0.55, ang).x.toFixed(3), cy: pol(0.55, ang).y.toFixed(3),
      r: 0.08, fill: '#e91e63', opacity: 0.7, 'class': 'center-element'
    }));
  }
  centerLayer.appendChild(svgEl('path', {
    d: pistilPath(), fill: 'none', stroke: '#e91e63',
    'stroke-width': '0.1', 'stroke-linecap': 'round', 'class': 'center-element'
  }));
  var pistilLen = params.stamenMul * 2.8;
  centerLayer.appendChild(svgEl('circle', {
    cx: pol(pistilLen, -Math.PI / 2 + 0.4).x.toFixed(3),
    cy: pol(pistilLen, -Math.PI / 2 + 0.4).y.toFixed(3),
    r: 0.18, fill: '#ff5252', 'class': 'center-element'
  }));
  var filaments = filamentPaths();
  for (var i = 0; i < filaments.length; i++) {
    filamentsLayer.appendChild(svgEl('path', {
      d: filaments[i].d, fill: 'none', stroke: '#e91e63',
      'stroke-width': '0.04', 'stroke-linecap': 'round', 'class': 'filament-path'
    }));
    anthersLayer.appendChild(svgEl('ellipse', {
      cx: filaments[i].tipX.toFixed(3), cy: filaments[i].tipY.toFixed(3),
      rx: 0.1, ry: 0.07, fill: '#ffd54f', stroke: '#f9a825', 'stroke-width': '0.02',
      transform: 'rotate(' + (i * 30) + ' ' + filaments[i].tipX.toFixed(3) + ' ' + filaments[i].tipY.toFixed(3) + ')',
      'class': 'anther-element'
    }));
  }
}

function animateFlower() {
  var petals = document.querySelectorAll('.petal-path');
  var veins = document.querySelectorAll('.vein-path');
  var centers = document.querySelectorAll('.center-element');
  var filaments = document.querySelectorAll('.filament-path');
  var anthers = document.querySelectorAll('.anther-element');
  var t = 0;
  for (var i = 0; i < petals.length; i++) {
    (function(el, delay) {
      setTimeout(function() { el.classList.add('visible'); }, delay);
    })(petals[i], t);
    t += 350;
  }
  t += 200;
  for (var i = 0; i < centers.length; i++) {
    (function(el, d) { setTimeout(function() { el.classList.add('visible'); }, d); })(centers[i], t);
  }
  t += 300;
  for (var i = 0; i < filaments.length; i++) {
    (function(el, d) { setTimeout(function() { el.classList.add('visible'); }, d); })(filaments[i], t);
    t += 150;
  }
  for (var i = 0; i < anthers.length; i++) {
    (function(el, d) { setTimeout(function() { el.classList.add('visible'); }, d); })(anthers[i], t);
    t += 120;
  }
  for (var i = 0; i < veins.length; i++) {
    (function(el, d) { setTimeout(function() { el.classList.add('visible'); }, d); })(veins[i], t);
  }
  return t + 500;
}

function runIntro(callback) {
  var introEl = document.getElementById('intro');
  var eqEl = document.getElementById('intro-equation');
  var subEl = document.getElementById('intro-subtitle');
  var equations = [
    'x = r(\u03b8) \u00b7 cos(\u03b8)',
    'y = r(\u03b8) \u00b7 sin(\u03b8)',
    '',
    'r(\u03b8) = R + A\u00b7cos(k\u00b7(\u03b8\u2212\u03c6))',
    '       + B\u00b7sin(2\u03b8 + \u03b4)',
    '       + C\u00b7cos(3\u03b8 + \u03b5)'
  ];
  var idx = 0;
  eqEl.classList.add('visible');
  function showNext() {
    if (idx < equations.length) {
      eqEl.textContent = equations.slice(0, idx + 1).join('\n');
      idx++;
      setTimeout(showNext, 300);
    } else {
      subEl.classList.add('visible');
      setTimeout(function() {
        introEl.classList.add('fade-out');
        setTimeout(function() {
          introEl.style.display = 'none';
          document.getElementById('main-content').classList.remove('hidden');
          callback();
        }, 1200);
      }, 800);
    }
  }
  setTimeout(showNext, 400);
}

function showMessage() {
  var msgEl = document.getElementById('romantic-message');
  msgEl.classList.remove('hidden');
  msgEl.querySelectorAll('.message-line').forEach(function(line) { line.classList.add('visible'); });
}

function showEquations() {
  var panel = document.getElementById('equations-panel');
  var content = document.getElementById('equations-content');
  panel.classList.remove('hidden');
  var n = params.count;
  var h = '';
  h += '<div class="equation-block"><div class="equation-label">Polar Coordinate System</div>';
  h += '<div class="equation-text">x = r(\u03b8) \u00b7 cos(\u03b8)\ny = r(\u03b8) \u00b7 sin(\u03b8)</div></div>';
  h += '<div class="equation-block"><div class="equation-label">Petal Radial Equation</div>';
  h += '<div class="equation-text">r(\u03b8) = R + A\u00b7cos(k\u00b7(\u03b8 \u2212 \u03c6))\n       + B\u00b7sin(2\u03b8 + \u03b4)\n       + C\u00b7cos(3\u03b8 + \u03b5)\n       \u00d7 envelope(\u03b8)</div></div>';
  h += '<div class="equation-block"><div class="equation-label">Current Parameters</div>';
  h += '<div class="equation-text">R = ' + (params.R * params.sizeMul).toFixed(2)
    + '\nA = ' + (params.A * params.widthMul).toFixed(2)
    + '\nk = 2'
    + '\nB = ' + (params.B * params.asymMul).toFixed(3)
    + '\n\u03b4 = ' + params.delta.toFixed(2)
    + '\nC = ' + params.C.toFixed(3)
    + '\n\u03b5 = ' + params.eps.toFixed(2) + '</div></div>';
  h += '<div class="equation-block"><div class="equation-label">Petal Rotations (' + n + ' petals)</div>';
  h += '<div class="equation-text">';
  for (var i = 0; i < n; i++) {
    h += '\u03c6' + (i+1) + ' = ' + ((360/n)*i).toFixed(1) + '\u00b0';
    if (i < n - 1) h += '\n';
  }
  h += '</div></div>';
  h += '<div class="equation-block"><div class="equation-label">Filament Parametric Curve</div>';
  h += '<div class="equation-text">x(t) = t\u00b7L\u00b7cos(\u03b8 + c\u00b7t)\ny(t) = t\u00b7L\u00b7sin(\u03b8 + c\u00b7t)\n\nL = ' + (params.stamenMul * 1.6).toFixed(2) + ', c = 0.5..0.8</div></div>';
  h += '<div class="equation-block"><div class="equation-label">Pistil Parametric Curve</div>';
  h += '<div class="equation-text">x(t) = t\u00b7P\u00b7cos(\u2212\u03c0/2 + 0.4\u00b7t)\ny(t) = t\u00b7P\u00b7sin(\u2212\u03c0/2 + 0.4\u00b7t)\n\nP = ' + (params.stamenMul * 2.8).toFixed(2) + '</div></div>';
  content.innerHTML = h;
}

function showAllVisible() {
  document.querySelectorAll('.petal-path').forEach(function(e) { e.classList.add('visible'); });
  document.querySelectorAll('.vein-path').forEach(function(e) { e.classList.add('visible'); });
  document.querySelectorAll('.center-element').forEach(function(e) { e.classList.add('visible'); });
  document.querySelectorAll('.filament-path').forEach(function(e) { e.classList.add('visible'); });
  document.querySelectorAll('.anther-element').forEach(function(e) { e.classList.add('visible'); });
}

function setupControls() {
  var sliders = [
    { id: 'ctrl-size', param: 'sizeMul', valId: 'val-size' },
    { id: 'ctrl-width', param: 'widthMul', valId: 'val-width' },
    { id: 'ctrl-curvature', param: 'curveMul', valId: 'val-curvature' },
    { id: 'ctrl-asymmetry', param: 'asymMul', valId: 'val-asymmetry' },
    { id: 'ctrl-radius', param: 'R', valId: 'val-radius' },
    { id: 'ctrl-stamen', param: 'stamenMul', valId: 'val-stamen' }
  ];
  var petalsCtrl = document.getElementById('ctrl-petals');
  var petalsVal = document.getElementById('val-petals');
  sliders.forEach(function(s) {
    var el = document.getElementById(s.id);
    var valEl = document.getElementById(s.valId);
    if (!el) return;
    el.addEventListener('input', function() {
      params[s.param] = parseFloat(el.value);
      valEl.textContent = parseFloat(el.value).toFixed(2);
      buildFlower(); showAllVisible(); showEquations();
    });
  });
  if (petalsCtrl) {
    petalsCtrl.addEventListener('input', function() {
      params.count = parseInt(petalsCtrl.value);
      petalsVal.textContent = petalsCtrl.value;
      buildFlower(); showAllVisible(); showEquations();
    });
  }
  var resetBtn = document.getElementById('reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      Object.keys(defaults).forEach(function(k) { params[k] = defaults[k]; });
      sliders.forEach(function(s) {
        var el = document.getElementById(s.id);
        var valEl = document.getElementById(s.valId);
        if (el) { el.value = defaults[s.param]; valEl.textContent = defaults[s.param].toFixed(2); }
      });
      if (petalsCtrl) { petalsCtrl.value = defaults.count; petalsVal.textContent = defaults.count; }
      buildFlower(); showAllVisible(); showEquations();
    });
  }
}

function setupExploreBtn() {
  var btn = document.getElementById('explore-btn');
  var panel = document.getElementById('controls-panel');
  if (!btn || !panel) return;
  btn.addEventListener('click', function() {
    panel.classList.toggle('hidden');
    if (!panel.classList.contains('hidden')) showEquations();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  runIntro(function() {
    buildFlower();
    var totalTime = animateFlower();
    setTimeout(function() {
      showMessage();
      setTimeout(function() {
        document.getElementById('explore-btn-wrap').classList.remove('hidden');
        document.getElementById('footer').classList.remove('hidden');
        setupExploreBtn();
        setupControls();
      }, 4500);
    }, totalTime);
  });
});