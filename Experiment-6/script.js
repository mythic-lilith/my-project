const svg = document.getElementById('canvas');
const toolSel = document.getElementById('tool');
const strokeInput = document.getElementById('stroke');
const widthInput = document.getElementById('width');
const fillInput = document.getElementById('fill');
const noFillChk = document.getElementById('noFill');
const undoBtn = document.getElementById('undo');
const clearBtn = document.getElementById('clear');
const downloadBtn = document.getElementById('download');

let isDrawing = false;
let start = { x: 0, y: 0 };
let currentEl = null;

function svgPoint(evt) {
  const rect = svg.getBoundingClientRect();
  return { x: evt.clientX - rect.left, y: evt.clientY - rect.top };
}

function applyStrokeAndFill(el) {
  el.setAttribute('stroke', strokeInput.value);
  el.setAttribute('stroke-width', widthInput.value);
  el.setAttribute('fill', noFillChk.checked ? 'none' : fillInput.value);
}

function onDown(evt) {
  if (evt.button !== 0) return;
  isDrawing = true;
  start = svgPoint(evt);
  const tool = toolSel.value;

  switch (tool) {
    case 'rect':
      currentEl = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      currentEl.setAttribute('x', start.x);
      currentEl.setAttribute('y', start.y);
      currentEl.setAttribute('width', 0);
      currentEl.setAttribute('height', 0);
      applyStrokeAndFill(currentEl);
      break;
    case 'line':
      currentEl = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      currentEl.setAttribute('x1', start.x);
      currentEl.setAttribute('y1', start.y);
      currentEl.setAttribute('x2', start.x);
      currentEl.setAttribute('y2', start.y);
      applyStrokeAndFill(currentEl);
      break;
    case 'ellipse':
      currentEl = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
      currentEl.setAttribute('cx', start.x);
      currentEl.setAttribute('cy', start.y);
      currentEl.setAttribute('rx', 0);
      currentEl.setAttribute('ry', 0);
      applyStrokeAndFill(currentEl);
      break;
    case 'pencil':
      currentEl = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      currentEl.setAttribute('points', `${start.x},${start.y}`);
      applyStrokeAndFill(currentEl);
      currentEl.setAttribute('fill', 'none');
      break;
  }

  svg.appendChild(currentEl);
}

function onMove(evt) {
  if (!isDrawing || !currentEl) return;
  const p = svgPoint(evt);
  const tool = toolSel.value;

  if (tool === 'rect') {
    const x = Math.min(p.x, start.x);
    const y = Math.min(p.y, start.y);
    const w = Math.abs(p.x - start.x);
    const h = Math.abs(p.y - start.y);
    currentEl.setAttribute('x', x);
    currentEl.setAttribute('y', y);
    currentEl.setAttribute('width', w);
    currentEl.setAttribute('height', h);
  } else if (tool === 'line') {
    currentEl.setAttribute('x2', p.x);
    currentEl.setAttribute('y2', p.y);
  } else if (tool === 'ellipse') {
    const rx = Math.abs(p.x - start.x) / 2;
    const ry = Math.abs(p.y - start.y) / 2;
    const cx = (p.x + start.x) / 2;
    const cy = (p.y + start.y) / 2;
    currentEl.setAttribute('cx', cx);
    currentEl.setAttribute('cy', cy);
    currentEl.setAttribute('rx', rx);
    currentEl.setAttribute('ry', ry);
  } else if (tool === 'pencil') {
    const points = currentEl.getAttribute('points');
    currentEl.setAttribute('points', points + ` ${p.x},${p.y}`);
  }
}

function onUp() {
  isDrawing = false;
  currentEl = null;
}

// Controls
undoBtn.addEventListener('click', () => {
  const nodes = [...svg.childNodes].filter(n => n.nodeType === 1);
  if (nodes.length) svg.removeChild(nodes[nodes.length - 1]);
});

clearBtn.addEventListener('click', () => {
  [...svg.querySelectorAll('*')].forEach(n => svg.removeChild(n));
});

downloadBtn.addEventListener('click', () => {
  const clone = svg.cloneNode(true);
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  const blob = new Blob([clone.outerHTML], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'drawing.svg';
  a.click();
  URL.revokeObjectURL(url);
});

// Event listeners
svg.addEventListener('mousedown', onDown);
window.addEventListener('mousemove', onMove);
window.addEventListener('mouseup', onUp);
