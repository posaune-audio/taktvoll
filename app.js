
const state = {
  school: "ms-a",
  tab: "today",
  currentLesson: null,
  schools: {
    "ms-a": {name:"Musikschule A", state:"Niederösterreich", location:"Standort Zentrum"},
    "ms-b": {name:"Musikschule B", state:"Steiermark", location:"Standort Süd"}
  },
  students: [
    {id:1,name:"Anna Berger",instrument:"Tenorhorn",school:"ms-a",time:"14:00",last:"B-Dur Tonleiter, Bel Canto – Andantino",level:"Unterstufe"},
    {id:2,name:"Lukas Steiner",instrument:"Posaune",school:"ms-a",time:"14:30",last:"Bordogni Nr. 3, Lippenbindungen",level:"Mittelstufe"},
    {id:3,name:"Marie Hofer",instrument:"Tuba",school:"ms-a",time:"15:00",last:"F-Dur, Artikulation, Etüde Nr. 4",level:"Unterstufe"},
    {id:4,name:"Paul Gruber",instrument:"Posaune",school:"ms-b",time:"16:00",last:"Bel Canto – Allegro brillante",level:"Mittelstufe"}
  ],
  ensemble: {name:"Ensemble Tiefes Blech",school:"ms-a",time:"17:00",members:[
    {name:"Anna Berger",present:true},{name:"Lukas Steiner",present:true},{name:"Marie Hofer",present:false}
  ]},
  logs: []
};

const titleMap = {today:"Heute",students:"Schüler",library:"Bibliothek",ensembles:"Ensembles",docs:"Dokumentation"};
const $ = q => document.querySelector(q);

function currentSchool(){ return state.schools[state.school]; }

function render(){
  $("#page-title").textContent = titleMap[state.tab];
  document.querySelectorAll(".tabbar button").forEach(b=>b.classList.toggle("active", b.dataset.tab===state.tab));
  const views = {today:renderToday,students:renderStudents,library:renderLibrary,ensembles:renderEnsembles,docs:renderDocs};
  $("#content").innerHTML = views[state.tab]();
  bindViewEvents();
}

function renderToday(){
  const sc = currentSchool();
  const students = state.students.filter(s=>s.school===state.school);
  return `
    <div class="card">
      <div class="eyebrow">${sc.state}</div>
      <div class="row between">
        <div><div class="bold">${sc.name}</div><div class="muted small">${sc.location}</div></div>
        <span class="badge">Schuljahr 2026/27</span>
      </div>
    </div>
    ${students.map((s,i)=>`
      <button class="card lesson lesson-open" data-id="${s.id}" style="width:100%;border:0;text-align:left">
        <div class="time">${s.time}</div>
        <div>
          <div class="bold">${s.name}</div>
          <div class="muted small">${s.instrument} · ${s.level}</div>
        </div>
        <span>›</span>
      </button>
    `).join("")}
    ${state.school==="ms-a" ? `
      <div class="card lesson">
        <div class="time">${state.ensemble.time}</div>
        <div><div class="bold">${state.ensemble.name}</div><div class="muted small">Ensemble · ${state.ensemble.members.length} Schüler</div></div>
        <span class="badge">Gruppe</span>
      </div>`:""}
    <div class="card">
      <h3>Musikschulkalender</h3>
      <div class="list-row"><span>🎄 Weihnachtskonzert</span><span class="muted small">12.12.</span></div>
      <div class="list-row"><span>🎺 Klassenabend</span><span class="muted small">18.03.</span></div>
      <button class="secondary full">+ Termin hinzufügen</button>
    </div>`;
}

function renderStudents(){
  const students = state.students.filter(s=>s.school===state.school);
  return `
    <div class="card">
      <input placeholder="Schüler suchen …">
    </div>
    ${students.map(s=>`
    <div class="card">
      <div class="row between"><div><div class="bold">${s.name}</div><div class="muted small">${s.instrument} · ${s.level}</div></div><span class="badge">${s.time}</span></div>
      <div class="list-row"><span>Letzter Stoff</span><span class="muted small" style="max-width:55%;text-align:right">${s.last}</span></div>
      <div class="list-row"><span>Bereits gespielte Musik</span><span>›</span></div>
      <div class="list-row"><span>Prüfungen</span><span class="muted small">Bronze ✓ · Silber in Vorbereitung</span></div>
    </div>`).join("")}`;
}

function renderLibrary(){
  return `
    <div class="card">
      <input placeholder="Titel, Komponist, Schule …">
      <div class="chips" style="margin-top:10px">
        <span class="chip">Posaune</span><span class="chip">Tenorhorn</span><span class="chip">Tuba</span><span class="chip">Mittelstufe</span>
      </div>
    </div>
    <div class="card">
      <div class="row between"><div><div class="bold">Bel Canto for Trombone</div><div class="muted small">Notensammlung · Mittelstufe</div></div><span class="badge">Papier + PDF</span></div>
      <div class="list-row"><span>🎼 Allegro brillante</span><span>›</span></div>
      <div class="list-row"><span>🎼 Andantino cantabile</span><span>›</span></div>
      <div class="list-row"><span>🎧 12 Audiodateien</span><span>›</span></div>
    </div>
    <div class="card audio">
      <div class="eyebrow">Playback</div>
      <h3 style="margin-top:5px">Bordogni Nr. 3 · Piano</h3>
      <p class="muted small">Tempo 76 % · Tonhöhe Original</p>
      <input class="range" type="range" min="50" max="120" value="76">
      <div class="row between" style="margin-top:12px">
        <button class="secondary">♭ −1</button><button class="secondary">▶︎</button><button class="secondary">+1 ♯</button>
      </div>
      <button class="secondary full" style="margin-top:10px">▣ QR-Code erstellen</button>
    </div>`;
}

function renderEnsembles(){
  const e = state.ensemble;
  return `
    <div class="card">
      <div class="eyebrow">${currentSchool().name}</div>
      <h2>${e.name}</h2>
      <p class="muted">${e.time} · ${e.members.length} Mitglieder</p>
      <div class="segmented"><button class="selected">Gehalten</button><button>Nicht gehalten</button><button>Verschoben</button></div>
    </div>
    <div class="card">
      <div class="row between"><h3>Anwesenheit</h3><button class="secondary" id="allPresent">Alle da</button></div>
      ${e.members.map((m,i)=>`<div class="list-row"><span>${m.name}</span><button class="secondary member-toggle" data-i="${i}">${m.present?"✅ Anwesend":"❌ Nicht da"}</button></div>`).join("")}
    </div>
    <div class="card">
      <div class="row between"><h3>Stoff</h3><button class="secondary">🎙️ Diktieren</button></div>
      <textarea rows="4" placeholder="Probe, Stücke, Schwerpunkte …"></textarea>
      <button class="primary full" style="margin-top:10px">Probe speichern</button>
    </div>`;
}

function renderDocs(){
  const held = state.logs.filter(l=>l.status==="held"||l.status==="moved").length;
  const notHeld = state.logs.filter(l=>l.status==="not-held").length;
  return `
    <div class="grid2">
      <div class="stat"><span class="muted small">Gehalten</span><strong>${held}</strong></div>
      <div class="stat"><span class="muted small">Nicht gehalten</span><strong>${notHeld}</strong></div>
    </div>
    <div class="card">
      <h3>Jahresdokumentation</h3>
      <p class="muted small">Export getrennt nach Musikschule. Enthalten: Anwesenheit und Unterrichtsstoff. Hausübungen werden nicht exportiert.</p>
      <button class="secondary full">📄 PDF exportieren</button>
      <button class="secondary full" style="margin-top:8px">📊 Excel exportieren</button>
      <button class="secondary full" style="margin-top:8px">📁 CSV exportieren</button>
    </div>
    <div class="card">
      <h3>Letzte Einträge</h3>
      ${state.logs.length ? state.logs.slice().reverse().map(l=>`
        <div class="list-row"><div><div class="bold">${l.student}</div><div class="muted small">${l.content||"–"}</div></div><span class="badge status-${l.status}">${labelStatus(l.status)}</span></div>
      `).join("") : `<p class="muted">Noch keine Stunden dokumentiert.</p>`}
    </div>`;
}

function labelStatus(s){ return {"held":"Gehalten","not-held":"Nicht gehalten","moved":"Verschoben"}[s]||s; }

function bindViewEvents(){
  document.querySelectorAll(".lesson-open").forEach(btn=>btn.addEventListener("click",()=>openLesson(Number(btn.dataset.id))));
  document.querySelectorAll(".member-toggle").forEach(btn=>btn.addEventListener("click",()=>{
    const i=Number(btn.dataset.i); state.ensemble.members[i].present=!state.ensemble.members[i].present; render();
  }));
  $("#allPresent")?.addEventListener("click",()=>{state.ensemble.members.forEach(m=>m.present=true);render();});
}

function openLesson(id){
  const s=state.students.find(x=>x.id===id); state.currentLesson=s;
  $("#lessonStudent").textContent=s.name;
  $("#lessonMeta").textContent=`${s.time} · ${s.instrument} · ${currentSchool().name}`;
  $("#lastLesson").textContent=s.last;
  $("#lessonContent").value="";
  $("#homework").value="";
  selectStatus("held");
  $("#lessonDialog").showModal();
}

function selectStatus(status){
  document.querySelectorAll("#statusGroup button").forEach(b=>b.classList.toggle("selected", b.dataset.status===status));
  $("#lessonForm").dataset.status=status;
  if(status==="not-held"){
    $("#statusExtra").innerHTML=`<select style="margin-top:10px" id="reason"><option>Schüler entschuldigt</option><option>Lehrer entschuldigt</option><option>Ferien</option></select>`;
  } else if(status==="moved"){
    $("#statusExtra").innerHTML=`<input style="margin-top:10px" type="datetime-local" id="movedDate">`;
  } else $("#statusExtra").innerHTML="";
}

document.querySelectorAll("#statusGroup button").forEach(b=>b.addEventListener("click",()=>selectStatus(b.dataset.status)));

$("#lessonForm").addEventListener("submit",(e)=>{
  if(!state.currentLesson) return;
  const status=e.currentTarget.dataset.status || "held";
  const content=$("#lessonContent").value.trim();
  state.logs.push({
    student:state.currentLesson.name, studentId:state.currentLesson.id, school:state.currentLesson.school,
    status, content,
    reason:$("#reason")?.value||"",
    movedDate:$("#movedDate")?.value||"",
    homework:$("#homework").value.trim(),
    date:new Date().toISOString()
  });
  if(content) state.currentLesson.last=content;
  state.currentLesson=null;
  setTimeout(()=>render(),50);
});

$("#dictateBtn").addEventListener("click",()=>{
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition){ alert("Diktieren wird von diesem Browser nicht unterstützt. Auf dem iPhone kann alternativ die Diktierfunktion der Tastatur verwendet werden."); return; }
  const rec = new SpeechRecognition(); rec.lang="de-AT"; rec.interimResults=false;
  $("#dictateBtn").textContent="🎙️ Höre zu …";
  rec.onresult=e=>{ $("#lessonContent").value += ( $("#lessonContent").value ? " " : "" ) + e.results[0][0].transcript; };
  rec.onend=()=>$("#dictateBtn").textContent="🎙️ Diktieren";
  rec.start();
});

document.querySelectorAll(".tabbar button").forEach(b=>b.addEventListener("click",()=>{state.tab=b.dataset.tab;render();}));
$("#schoolBtn").addEventListener("click",()=>$("#schoolDialog").showModal());
document.querySelectorAll(".school-choice").forEach(b=>b.addEventListener("click",()=>{state.school=b.dataset.school;render();}));

render();
