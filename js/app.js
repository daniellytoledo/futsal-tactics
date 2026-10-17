const $ = (selector) => document.querySelector(selector);
const playerLayer = $('#player-layer'), ballLayer = $('#ball-layer'), motionLayer = $('#motion-layer');
let currentTactic = TACTICS[0], selectedPlayer = null, activeCategory = 'Todas';
const NS = 'http://www.w3.org/2000/svg';
const animator = new TacticAnimator({ onStep: renderStep, getTactic: () => currentTactic, getSpeed: () => Number($('#speed-select').value) });

function svgEl(tag, attrs = {}) { const el = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k,v)); return el; }
function positionAt(id, step) { return step.positions[id] || [320,200]; }
function interpolate(a,b,t) { return [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t]; }
function createPitchObjects() {
  playerLayer.replaceChildren(); ballLayer.replaceChildren();
  currentTactic.players.forEach(p => {
    const g = svgEl('g', { class:'player-token', 'data-player':p.id, tabindex:'0', role:'button', 'aria-label':`${p.id}: ${p.name}` });
    g.append(svgEl('circle',{class:'player-circle',r:17,fill:p.color,cx:0,cy:0}));
    const label = svgEl('text',{x:0,y:1}); label.textContent = p.id; g.append(label);
    const name = svgEl('text',{class:'player-label',x:0,y:29}); name.textContent = p.id === 'GR' ? 'GR' : p.name.replace('Ala ',''); g.append(name);
    const activate = () => selectPlayer(selectedPlayer === p.id ? null : p.id);
    g.addEventListener('click',activate); g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate();}});
    playerLayer.append(g);
  });
  const ball = svgEl('g',{id:'ball'}); ball.append(svgEl('circle',{class:'ball',r:7,cx:0,cy:0}));
  ball.append(svgEl('path',{class:'ball-mark',d:'M-3 -3 L2 -4 L4 0 L1 4 L-4 2 Z'})); ballLayer.append(ball);
}
function renderMotions(step, progress) {
  motionLayer.replaceChildren();
  (step.paths || []).forEach(path => {
    const start = positionAt(path.from, step);
    const end = path.to;
    const line = svgEl('path',{class:'motion-path',d:`M ${start[0]} ${start[1]} L ${end[0]} ${end[1]}`});
    motionLayer.append(line);
  });
  if(step.pass){const p=step.pass;motionLayer.append(svgEl('path',{class:'pass-path',d:`M ${p.from[0]} ${p.from[1]} L ${p.to[0]} ${p.to[1]}`}));}
}
function renderStep(stepIndex, progress = 0, animate = false) {
  const step = currentTactic.steps[stepIndex]; if(!step) return;
  $('#step-pill').textContent = `ETAPA ${stepIndex+1} / ${currentTactic.steps.length}`;
  $('#step-number').textContent = String(stepIndex+1).padStart(2,'0');
  $('#step-title').textContent = step.title; $('#step-description').textContent = step.description;
  $('#coach-note').textContent = step.note || currentTactic.note;
  $('#progress-bar').style.width = `${((stepIndex + progress) / currentTactic.steps.length) * 100}%`;
  $('#play-icon').textContent = animator.playing ? 'Ⅱ' : '▶'; $('#play-label').textContent = animator.playing ? 'Pausar' : 'Reproduzir';
  const previous = stepIndex > 0 ? currentTactic.steps[stepIndex-1] : step;
  currentTactic.players.forEach(p => {
    const el = playerLayer.querySelector(`[data-player="${p.id}"]`); if(!el) return;
    const from = positionAt(p.id, previous), to = positionAt(p.id, step);
    const [x,y] = animate && stepIndex > 0 ? interpolate(from,to,progress) : to;
    el.setAttribute('transform',`translate(${x} ${y})`);
    el.classList.toggle('selected', selectedPlayer === p.id);
    el.classList.toggle('dimmed', selectedPlayer !== null && selectedPlayer !== p.id);
  });
  const ball = $('#ball'); if(ball){ const prevBall = previous.ball || step.ball, targetBall = step.ball || prevBall; const [bx,by] = animate ? interpolate(prevBall,targetBall,progress) : targetBall; ball.setAttribute('transform',`translate(${bx} ${by})`); }
  renderMotions(step,progress);
  $('#step-navigation').innerHTML = currentTactic.steps.map((s,i)=>`<button class="step-tab ${i===stepIndex?'active':''}" data-step="${i}" aria-current="${i===stepIndex?'step':'false'}"><span>ETAPA ${String(i+1).padStart(2,'0')}</span><strong>${s.title}</strong></button>`).join('');
  $('#step-navigation').querySelectorAll('[data-step]').forEach(btn=>btn.addEventListener('click',()=>animator.goTo(Number(btn.dataset.step))));
  renderRoles(step);
}
function renderRoles(step) {
  $('#player-roles').innerHTML = currentTactic.players.map(p=>`<button class="role-row ${selectedPlayer===p.id?'selected':''}" data-role="${p.id}"><span class="role-badge" style="background:${p.color}">${p.id}</span><span><strong>${p.name}</strong><small>${p.id===selectedPlayer ? p.detail : p.role}</small></span><span class="role-arrow">${selectedPlayer===p.id?'●':'›'}</span></button>`).join('');
  $('#player-roles').querySelectorAll('[data-role]').forEach(btn=>btn.addEventListener('click',()=>selectPlayer(selectedPlayer===btn.dataset.role?null:btn.dataset.role)));
}
function selectPlayer(id) { selectedPlayer=id; renderStep(animator.stepIndex,animator.progress,animator.playing); }
function thumbSvg(index) { const y= [13,25,17][index%3]; return `<svg viewBox="0 0 48 40" aria-hidden="true"><rect x="3" y="3" width="42" height="34" rx="3" fill="none" stroke="#c8dfcb" stroke-width=".8"/><line x1="24" y1="3" x2="24" y2="37" stroke="#c8dfcb" stroke-width=".7"/><circle cx="24" cy="20" r="6" fill="none" stroke="#c8dfcb" stroke-width=".7"/><path d="M9 ${y+8} L20 ${y} L34 ${y+6}" fill="none" stroke="#d9f36a" stroke-width="1.6" stroke-dasharray="3 2"/><circle cx="9" cy="${y+8}" r="2.8" fill="#b9dcff"/><circle cx="20" cy="${y}" r="2.8" fill="#b9dcff"/><circle cx="34" cy="${y+6}" r="2.8" fill="#d9f36a"/></svg>`; }
function renderLibrary() {
  const query=$('#search-tactics').value.trim().toLocaleLowerCase('pt-PT');
  const filtered=TACTICS.filter(t=>(activeCategory==='Todas'||t.category===activeCategory)&&`${t.title} ${t.category} ${t.summary}`.toLocaleLowerCase('pt-PT').includes(query));
  $('#tactic-count').textContent=String(filtered.length).padStart(2,'0');
  $('#tactic-list').innerHTML=filtered.length?filtered.map(t=>`<button class="tactic-card ${t.id===currentTactic.id?'active':''}" data-tactic="${t.id}"><span class="tactic-thumb">${thumbSvg(TACTICS.indexOf(t))}</span><span><strong>${t.title}</strong><small>${t.category} · ${t.duration}</small></span><span class="card-arrow">›</span></button>`).join(''):'<p class="library-hint">Não foram encontradas jogadas.</p>';
  $('#tactic-list').querySelectorAll('[data-tactic]').forEach(btn=>btn.addEventListener('click',()=>loadTactic(btn.dataset.tactic)));
}
function loadTactic(id) {
  currentTactic=TACTICS.find(t=>t.id===id)||TACTICS[0]; selectedPlayer=null; animator.stop(); animator.stepIndex=0; animator.progress=0;
  $('#tactic-title').textContent=currentTactic.title; $('#tactic-category').textContent=currentTactic.category.toUpperCase();
  createPitchObjects(); renderLibrary(); renderStep(0,0,false);
}
$('#play-btn').addEventListener('click',()=>animator.toggle());
$('#restart-btn').addEventListener('click',()=>animator.reset());
$('#prev-btn').addEventListener('click',()=>animator.previous());
$('#next-btn').addEventListener('click',()=>animator.next());
$('#search-tactics').addEventListener('input',renderLibrary);
$('#category-filters').querySelectorAll('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{activeCategory=btn.dataset.category;$('#category-filters').querySelectorAll('.category').forEach(b=>b.classList.toggle('active',b===btn));renderLibrary();}));
loadTactic(currentTactic.id);
