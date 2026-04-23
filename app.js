const state = {
  data: null,
  source: null,
  tab: 'ov',
  sectionFilter: 'all',
  flashFilter: 'all',
  flashcards: [],
  flashOrder: [],
  flashIndex: 0,
  quizItems: [],
  quizAnswers: [],
  correct: 0,
  answered: 0,
  searchMode: 'clean'
};

const icons = {
  'IFP keypad programming':'⚙️',
  'HFSS software workflow':'💻',
  'Networking and multi-panel operation':'🕸️',
  'ECS and voice platform overview':'📢',
  'Panel and hardware quick reference':'📦',
  'Certification prep and study strategy':'🧠'
};

function byId(id){ return document.getElementById(id); }
function escapeHtml(text=''){ return text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function slugify(text=''){ return text.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }
function sectionTone(section){ return section.theme === 'blue' ? 'h' : ''; }
function sectionChip(section){ return section.theme === 'blue' ? 'csh' : 'csi'; }
function sectionTitleById(id){ return state.data.sections.find(s => s.id === id)?.title || id; }

async function init(){
  try {
    const [data, source] = await Promise.all([
      fetch('data.json').then(r => r.json()),
      fetch('source-text.json').then(r => r.json())
    ]);
    state.data = data;
    state.source = source;
    buildSectionPills();
    buildOverview();
    buildKeynotes();
    initFlashcards();
    initQuiz();
    buildLabs();
    buildQuickRef();
    byId('sres').innerHTML = searchHint();
  } catch (err) {
    console.error(err);
    document.querySelectorAll('.loading').forEach(el => {
      el.innerHTML = 'Failed to load study data. Check that data.json and source-text.json are next to index.html.';
    });
  }
}

function buildSectionPills(){
  const pills = state.data.sections.map((section, idx) =>
    `<button class="pill ${idx===0?'active':''}" data-section="${section.id}">${section.shortTitle}</button>`
  ).join('');
  byId('sectionPills').innerHTML = `<button class="pill active" data-section="all">ALL</button>${pills}`;
  byId('flashPills').innerHTML = `<button class="pill active" data-section="all">ALL</button>${pills}`;

  byId('sectionPills').addEventListener('click', e => {
    const btn = e.target.closest('.pill'); if(!btn) return;
    state.sectionFilter = btn.dataset.section;
    [...byId('sectionPills').querySelectorAll('.pill')].forEach(p => p.classList.toggle('active', p===btn));
    buildKeynotes();
  });
  byId('flashPills').addEventListener('click', e => {
    const btn = e.target.closest('.pill'); if(!btn) return;
    state.flashFilter = btn.dataset.section;
    [...byId('flashPills').querySelectorAll('.pill')].forEach(p => p.classList.toggle('active', p===btn));
    initFlashcards();
  });
}

function buildOverview(){
  const { course, highlights, sections } = state.data;
  byId('overviewLead').innerHTML = `
    <div class="sum">
      <h3>Course frame</h3>
      <p>${escapeHtml(course.subtitle)}</p>
      <div class="meta">
        <span>${escapeHtml(course.days)}</span>
        <span>Default search = data.json</span>
        <span>Deep search = source-text.json</span>
      </div>
    </div>`;
  byId('overviewStats').innerHTML = highlights.map(h => `
    <div class="stat">
      <h3>${escapeHtml(h.title)}</h3>
      <ul>${h.points.map(p => `<li>${escapeHtml(p)}</li>`).join('')}</ul>
    </div>`).join('');

  byId('overviewSections').innerHTML = sections.map(section => `
    <div class="kc ${sectionTone(section)}" id="ov-${section.id}">
      <div class="kh">
        <div class="ki" style="background:${section.theme==='blue'?'rgba(78,158,255,.14)':'rgba(230,48,48,.14)'}">${icons[section.title] || '•'}</div>
        <div class="kt ${section.theme==='blue'?'b':''}">${escapeHtml(section.title)}</div>
      </div>
      <div class="kb">
        <ul>
          <li>${escapeHtml(section.summary)}</li>
          <li><strong>Keywords:</strong> ${escapeHtml(section.keywords.slice(0,5).join(', '))}</li>
          <li><strong>Source emphasis:</strong> ${escapeHtml(section.sources[0])}</li>
        </ul>
      </div>
    </div>`).join('');
}

function visibleSections(filterKey){
  return state.data.sections.filter(section => filterKey === 'all' || section.id === filterKey);
}

function buildKeynotes(){
  const sections = visibleSections(state.sectionFilter);
  byId('keynoteGrid').innerHTML = sections.map(section => `
    <div class="stack" id="section-${section.id}">
      <div class="callout">
        <div class="tiny">${escapeHtml(section.badge)} · ${escapeHtml(section.shortTitle)}</div>
        <h3>${escapeHtml(section.title)}</h3>
        <p style="line-height:1.7;font-size:.95rem">${escapeHtml(section.summary)}</p>
        <div class="meta">${section.keywords.map(k => `<span>${escapeHtml(k)}</span>`).join('')}</div>
      </div>
      <div class="grid">
        <div class="kc ${sectionTone(section)}">
          <div class="kh"><div class="ki" style="background:${section.theme==='blue'?'rgba(78,158,255,.14)':'rgba(230,48,48,.14)'}">📝</div><div class="kt ${section.theme==='blue'?'b':''}">Keynotes</div></div>
          <div class="kb"><ul>${section.keynotes.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
        </div>
        <div class="kc ${sectionTone(section)}">
          <div class="kh"><div class="ki" style="background:rgba(245,166,35,.14)">🧪</div><div class="kt ${section.theme==='blue'?'b':''}">Lab success checklist</div></div>
          <div class="kb"><ul>${section.labChecklist.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
        </div>
        <div class="kc ${sectionTone(section)}">
          <div class="kh"><div class="ki" style="background:rgba(61,214,140,.14)">⚠️</div><div class="kt ${section.theme==='blue'?'b':''}">Common mistakes</div></div>
          <div class="kb"><ul>${section.commonMistakes.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
        </div>
        <div class="kc ${sectionTone(section)}">
          <div class="kh"><div class="ki" style="background:rgba(154,124,255,.14)">🔧</div><div class="kt ${section.theme==='blue'?'b':''}">Troubleshooting notes</div></div>
          <div class="kb"><ul>${section.troubleshooting.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
        </div>
      </div>
    </div>`).join('');
}

function initFlashcards(){
  const sections = visibleSections(state.flashFilter);
  state.flashcards = sections.flatMap(section => section.flashcards.map(card => ({...card, sectionId: section.id, shortTitle: section.shortTitle, theme: section.theme })));
  state.flashOrder = state.flashcards.map((_, i) => i);
  state.flashIndex = 0;
  renderFlashcard();
}

function renderFlashcard(){
  if(!state.flashcards.length){
    byId('flashcardWrap').innerHTML = '<div class="loading">No flashcards for this filter.</div>';
    byId('fctr').textContent = '0 / 0';
    byId('fprogBar').style.width = '0';
    return;
  }
  const card = state.flashcards[state.flashOrder[state.flashIndex]];
  const chipClass = card.theme === 'blue' ? 'csh' : 'csi';
  byId('flashcardWrap').innerHTML = `
    <div id="fcard" class="fcard" onclick="flipCard()">
      <div class="finner">
        <div class="face front">
          <span class="cs ${chipClass}">${escapeHtml(card.shortTitle)}</span>
          <div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:.74rem;color:var(--mu);letter-spacing:1px;margin-bottom:.8rem">QUESTION</div>
            <div style="font-size:1.08rem;line-height:1.65">${escapeHtml(card.q)}</div>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace;font-size:.72rem;color:var(--mu)">Tap card to flip</div>
        </div>
        <div class="face back">
          <span class="cs ${chipClass}">${escapeHtml(card.shortTitle)}</span>
          <div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:.74rem;color:var(--mu);letter-spacing:1px;margin-bottom:.8rem">ANSWER</div>
            <div style="font-size:1.02rem;line-height:1.7">${escapeHtml(card.a)}</div>
          </div>
          <div style="font-family:'IBM Plex Mono',monospace;font-size:.72rem;color:var(--mu)">Tap card to flip back</div>
        </div>
      </div>
    </div>`;
  byId('fctr').textContent = `${state.flashIndex + 1} / ${state.flashOrder.length}`;
  byId('fprogBar').style.width = `${((state.flashIndex + 1) / state.flashOrder.length) * 100}%`;
}

function flipCard(){ byId('fcard')?.classList.toggle('fl'); }
function nextCard(){ if(!state.flashOrder.length) return; state.flashIndex = (state.flashIndex + 1) % state.flashOrder.length; renderFlashcard(); }
function prevCard(){ if(!state.flashOrder.length) return; state.flashIndex = (state.flashIndex - 1 + state.flashOrder.length) % state.flashOrder.length; renderFlashcard(); }
function shuffleCards(){ for(let i=state.flashOrder.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [state.flashOrder[i], state.flashOrder[j]] = [state.flashOrder[j], state.flashOrder[i]]; } state.flashIndex = 0; renderFlashcard(); }

function initQuiz(){
  state.quizItems = state.data.sections.flatMap(section => section.examQuestions.map(item => ({...item, sectionId: section.id, shortTitle: section.shortTitle, theme: section.theme })));
  state.quizAnswers = new Array(state.quizItems.length).fill(null);
  state.correct = 0;
  state.answered = 0;
  buildQuiz();
}

function buildQuiz(){
  byId('qcont').innerHTML = state.quizItems.map((q, idx) => `
    <div class="qcard">
      <div class="qhd">
        <div class="qnum">Q${idx+1}</div>
        <div class="qtxt">${escapeHtml(q.q)}</div>
        <div class="qtags">
          <span class="qst ${q.theme==='blue'?'sth':'sti'}">${escapeHtml(q.shortTitle)}</span>
        </div>
      </div>
      <ul class="optl" id="ol${idx}">
        ${q.choices.map((choice, oi) => `<li class="opt" id="op${idx}_${oi}" onclick="selectAnswer(${idx},${oi})"><span class="optltr">${String.fromCharCode(65+oi)}.</span>${escapeHtml(choice)}</li>`).join('')}
      </ul>
      <div class="expl" id="ex${idx}"><strong>Explanation:</strong> ${escapeHtml(q.explanation)}</div>
    </div>`).join('');
  byId('scdisp').textContent = '0 / 0';
}

function selectAnswer(qi, oi){
  if(state.quizAnswers[qi] !== null) return;
  state.quizAnswers[qi] = oi;
  const correct = state.quizItems[qi].answer;
  document.querySelectorAll(`#ol${qi} .opt`).forEach((el, idx) => {
    if(idx === correct) el.classList.add('cor');
    else if(idx === oi) el.classList.add('wrg');
    el.style.cursor = 'default';
  });
  byId(`ex${qi}`).classList.add('vis');
  if(oi === correct) state.correct += 1;
  state.answered += 1;
  byId('scdisp').textContent = `${state.correct} / ${state.answered}`;
}

function resetQuiz(){ initQuiz(); }

function buildLabs(){
  const sections = state.data.sections.filter(s => ['ifp-programming','hfss','networking','ecs','certification'].includes(s.id));
  byId('labGrid').innerHTML = sections.map(section => `
    <div class="kc ${sectionTone(section)}">
      <div class="kh">
        <div class="ki" style="background:${section.theme==='blue'?'rgba(78,158,255,.14)':'rgba(230,48,48,.14)'}">✅</div>
        <div class="kt ${section.theme==='blue'?'b':''}">${escapeHtml(section.title)}</div>
      </div>
      <div class="kb">
        <ul>${section.workflows.flatMap(w => [`Workflow: ${w.title}`, ...w.steps.map(step => `- ${step}`)]).map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </div>
    </div>`).join('');
}

function buildQuickRef(){
  const terms = state.data.sections.flatMap(section => section.terms.map(term => ({...term, shortTitle: section.shortTitle })));
  const compareCards = state.data.sections.map(section => ({ title: section.title, items: section.quickReference }));
  byId('termGrid').innerHTML = terms.map(term => `
    <div class="term-card">
      <h4>${escapeHtml(term.term)}</h4>
      <p>${escapeHtml(term.definition)}</p>
      <div class="meta" style="margin-top:.75rem"><span>${escapeHtml(term.shortTitle)}</span></div>
    </div>`).join('');
  byId('compareGrid').innerHTML = compareCards.map(card => `
    <div class="mini-card">
      <h4>${escapeHtml(card.title)}</h4>
      <ul>${card.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
    </div>`).join('');
}

function swTab(id, btn){
  document.querySelectorAll('.tc').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  byId(id).classList.add('active');
  btn.classList.add('active');
  state.tab = id;
}

function openS(){ byId('sover').classList.add('open'); setTimeout(() => byId('sinp').focus(), 60); }
function closeS(){ byId('sover').classList.remove('open'); byId('sinp').value = ''; byId('sres').innerHTML = searchHint(); }
function handleOC(e){ if(e.target === byId('sover') || e.target.classList.contains('sbk')) closeS(); }
function qs(term){ byId('sinp').value = term; doSearch(); }
function setSearchMode(mode){
  state.searchMode = mode;
  document.querySelectorAll('.smode button').forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  if(byId('sinp').value.trim().length >= 2) doSearch();
}
function searchHint(){
  return `<div class="shint">Search the cleaned study guide by default. Switch to <strong>Deep Search</strong> to query transcript, slide, manual, and datasheet excerpts from <code>source-text.json</code>.<br>Try: <span onclick="qs('JumpStart')">JumpStart</span> · <span onclick="qs('Get Configuration')">Get Configuration</span> · <span onclick="qs('SK-NIC')">SK-NIC</span> · <span onclick="qs('ECS-NVCM')">ECS-NVCM</span> · <span onclick="qs('zone')">zone</span> · <span onclick="qs('function key')">function key</span></div>`;
}
function hl(text, term){ const re = new RegExp('(' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'); return text.replace(re, '<mark>$1</mark>'); }

function doSearch(){
  const raw = byId('sinp').value.trim();
  const q = raw.toLowerCase();
  const res = byId('sres');
  if(q.length < 2){ res.innerHTML = '<div class="sempty">Type at least 2 characters to search the JSON content.</div>'; return; }

  if(state.searchMode === 'clean'){
    const results = [];
    state.data.sections.forEach(section => {
      const chunks = [
        ...section.keynotes.map(t => ({label:'Keynote', text:t})),
        ...section.labChecklist.map(t => ({label:'Lab checklist', text:t})),
        ...section.commonMistakes.map(t => ({label:'Common mistake', text:t})),
        ...section.troubleshooting.map(t => ({label:'Troubleshooting', text:t})),
        ...section.quickReference.map(t => ({label:'Quick reference', text:t})),
        ...section.flashcards.flatMap(fc => [{label:'Flashcard question', text:fc.q}, {label:'Flashcard answer', text:fc.a}]),
        ...section.examQuestions.flatMap(eq => [{label:'Practice question', text:eq.q}, ...eq.choices.map(c => ({label:'Choice', text:c})), {label:'Explanation', text:eq.explanation}]),
        ...section.terms.map(term => ({label:`Term: ${term.term}`, text:term.definition})),
        ...section.workflows.flatMap(flow => [{label:'Workflow', text:flow.title}, ...flow.steps.map(step => ({label:'Workflow step', text:step}))])
      ];
      const hits = chunks.filter(chunk => (`${section.title} ${section.keywords.join(' ')} ${chunk.text}`).toLowerCase().includes(q)).slice(0, 8);
      if(hits.length){ results.push({ section, hits }); }
    });

    if(!results.length){ res.innerHTML = `<div class="sempty">No clean-study matches for "${escapeHtml(raw)}".</div>`; return; }
    const total = results.reduce((sum, item) => sum + item.hits.length, 0);
    res.innerHTML = results.map(({section, hits}) => `
      <div class="rcard">
        <div class="rtop">
          <span class="rname">${escapeHtml(section.title)}</span>
          <span class="cs ${sectionChip(section)}">${escapeHtml(section.shortTitle)}</span>
        </div>
        <div class="rbody">
          ${hits.map(hit => `<div class="rline"><strong>${escapeHtml(hit.label)}:</strong> ${hl(escapeHtml(hit.text), raw)}</div>`).join('')}
        </div>
        <div class="rmeta"><span>source: data.json</span><span>priority: cleaned study material</span></div>
      </div>`).join('') + `<div class="rcnt">${total} result${total!==1?'s':''} across ${results.length} section${results.length!==1?'s':''}</div>`;
  } else {
    const matches = state.source.excerpts.filter(excerpt => (`${excerpt.section} ${excerpt.topic} ${excerpt.model || ''} ${excerpt.text} ${(excerpt.keywords || []).join(' ')}`).toLowerCase().includes(q));
    if(!matches.length){ res.innerHTML = `<div class="sempty">No deep-source matches for "${escapeHtml(raw)}".</div>`; return; }
    const limited = matches.slice(0, 20);
    res.innerHTML = limited.map(excerpt => `
      <div class="rcard">
        <div class="rtop">
          <span class="rname">${escapeHtml(excerpt.section)} · ${escapeHtml(excerpt.topic)}</span>
          <span class="cs ${excerpt.sourceType === 'SELF NOTES' ? 'csi' : 'csh'}">${escapeHtml(excerpt.sourceType)}</span>
        </div>
        <div class="rbody"><div class="rline">${hl(escapeHtml(excerpt.text), raw)}</div></div>
        <div class="rmeta"><span>${escapeHtml(excerpt.sourcePath)}</span>${excerpt.model ? `<span>${escapeHtml(excerpt.model)}</span>` : ''}<span>source: source-text.json</span></div>
      </div>`).join('') + `<div class="rcnt">${matches.length} deep result${matches.length!==1?'s':''}${matches.length>limited.length?` · showing first ${limited.length}`:''}</div>`;
  }
}

document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeS();
  if(e.key.toLowerCase() === 'k' && !byId('sover').classList.contains('open') && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA'){
    e.preventDefault();
    openS();
  }
});

window.swTab = swTab;
window.flipCard = flipCard;
window.nextCard = nextCard;
window.prevCard = prevCard;
window.shuffleCards = shuffleCards;
window.resetQuiz = resetQuiz;
window.selectAnswer = selectAnswer;
window.openS = openS;
window.closeS = closeS;
window.handleOC = handleOC;
window.doSearch = doSearch;
window.qs = qs;
window.setSearchMode = setSearchMode;

init();
