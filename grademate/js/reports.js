(function(){
  const { role } = currentSession();
  renderNav('reports');

  if(role !== 'admin'){
    window.location.href = 'login.html';
    return;
  }

  let faqs = FAQS.slice();

  function renderStats(){
    const list = Object.values(STUDENTS);
    const total = list.length;
    const atRisk = list.filter(s => isAtRisk(s.subjects)).length;
    const classAvg = Math.round((list.reduce((sum,s) => sum + average(s.subjects), 0) / total) * 10) / 10;

    document.getElementById('statGrid').innerHTML = `
      <div class="stat"><div class="n">${total}</div><div class="l">Students Tracked</div></div>
      <div class="stat"><div class="n">${atRisk}</div><div class="l">Flagged At Risk</div></div>
      <div class="stat"><div class="n">${classAvg}</div><div class="l">Overall Class Average</div></div>
      <div class="stat"><div class="n">${faqs.length}</div><div class="l">FAQ Entries</div></div>
    `;
  }

  function renderClassBars(){
    const bySection = {};
    Object.values(STUDENTS).forEach(s => {
      const key = `Grade ${s.grade} – ${s.section}`;
      if(!bySection[key]) bySection[key] = [];
      bySection[key].push(average(s.subjects));
    });
    const rows = Object.entries(bySection).map(([label, vals]) => {
      const avg = Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)*10)/10;
      const low = avg < PASSING;
      return `
        <div class="bar-row">
          <span>${label}</span>
          <div class="bar-track"><div class="bar-fill ${low?'low':''}" style="width:${avg}%"></div></div>
          <span>${avg}</span>
        </div>`;
    }).join('');
    document.getElementById('classBars').innerHTML = rows;
  }

  function renderPerfBars(){
    const metrics = [
      { label:'Response Accuracy', value:92 },
      { label:'User Satisfaction', value:88 },
      { label:'Query Resolution Rate', value:81 },
      { label:'Alert Delivery Rate', value:100 }
    ];
    document.getElementById('perfBars').innerHTML = metrics.map(m => `
      <div class="bar-row">
        <span>${m.label}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${m.value}%"></div></div>
        <span>${m.value}%</span>
      </div>`).join('');
  }

  function renderFaqs(){
    document.getElementById('faqList').innerHTML = faqs.map(f =>
      `<div class="faq-row"><div class="k">${f.keys.join(', ')}</div><div class="a">${f.answer}</div></div>`
    ).join('');
  }

  function renderRiskList(){
    const riskEntries = Object.entries(STUDENTS).filter(([id,s]) => isAtRisk(s.subjects));
    document.getElementById('riskList').innerHTML = riskEntries.length
      ? riskEntries.map(([id,s]) => {
          const low = lowSubjects(s.subjects).join(', ');
          return `<div class="row"><span>${s.name} <span style="opacity:.6">(${id})</span></span><span class="pill risk">${low}</span></div>`;
        }).join('')
      : '<div class="row" style="opacity:.6">No students currently flagged.</div>';
  }

  window.addFaq = function(){
    const keyInput = document.getElementById('newKey');
    const ansInput = document.getElementById('newAns');
    const keys = keyInput.value.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
    const answer = ansInput.value.trim();
    if(!keys.length || !answer) return;
    faqs.push({ keys, answer });
    keyInput.value = '';
    ansInput.value = '';
    renderFaqs();
    renderStats();
  };

  renderStats();
  renderClassBars();
  renderPerfBars();
  renderFaqs();
  renderRiskList();
})();
