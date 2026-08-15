(function(){
  const { id, student } = currentSession();
  renderNav('chatbot');

  if(!student){
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('chatSubject').textContent = `Chatting with ${student.name.split(' ')[0]}`;

  function scrollToBottom(){
    const el = document.getElementById('chatScroll');
    el.scrollTop = el.scrollHeight;
  }

  function addBotBubble(html){
    const wrap = document.createElement('div');
    wrap.className = 'msg bot';
    wrap.innerHTML = `<div class="who">GradeMate!</div><div class="bubble">${html}</div>`;
    document.getElementById('chatScroll').appendChild(wrap);
    scrollToBottom();
  }

  function addUserBubble(text){
    const wrap = document.createElement('div');
    wrap.className = 'msg user';
    wrap.innerHTML = `<div class="who">You</div><div class="bubble"></div>`;
    wrap.querySelector('.bubble').textContent = text;
    document.getElementById('chatScroll').appendChild(wrap);
    scrollToBottom();
  }

  function showTyping(cb){
    const wrap = document.createElement('div');
    wrap.className = 'msg bot';
    wrap.id = 'typingBubble';
    wrap.innerHTML = `<div class="who">GradeMate!</div><div class="bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
    document.getElementById('chatScroll').appendChild(wrap);
    scrollToBottom();
    setTimeout(() => {
      const t = document.getElementById('typingBubble');
      if(t) t.remove();
      cb();
    }, 500);
  }

  function reportCardHTML(){
    const avg = average(student.subjects);
    const risk = isAtRisk(student.subjects);
    const rows = Object.entries(student.subjects).map(([subj,g]) =>
      `<tr><td>${subj}</td><td class="grade ${g<PASSING?'low':''}">${g}</td></tr>`).join('');
    return `
      <div class="reportcard">
        <div class="rc-title">${student.name} — Grade ${student.grade} ${student.section}${risk ? ' · <span style="color:var(--pen-red)">FOR REVIEW</span>' : ''}</div>
        <table>${rows}
          <tr><td><strong>Quarter Average</strong></td><td class="grade"><strong>${avg}</strong></td></tr>
        </table>
      </div>`;
  }

  function findSubject(text){
    return Object.keys(student.subjects).find(subj => text.toLowerCase().includes(subj.toLowerCase()));
  }

  function respond(raw){
    const text = raw.toLowerCase();

    if(text.includes('at risk') || text.includes('academic risk')){
      const risk = isAtRisk(student.subjects);
      if(risk){
        const low = Object.entries(student.subjects).filter(([k,v]) => v < PASSING).map(([k,v])=>`${k} (${v})`);
        return `Yes — you're flagged for academic risk this quarter, below passing in: ${low.join(', ')}. I'd suggest booking time with your subject teacher or adviser soon.`;
      }
      return `Good news — none of your grades are below the passing mark of ${PASSING} this quarter.`;
    }

    if(text.includes('grade') || text.includes('performance')){
      const subj = findSubject(raw);
      if(subj){
        const g = student.subjects[subj];
        return `Your grade in ${subj} is ${g}${g<PASSING ? ' — that\'s below the passing mark of '+PASSING+'.' : '.'}`;
      }
      return reportCardHTML();
    }

    const faq = FAQS.find(f => f.keys.some(k => text.includes(k)));
    if(faq) return faq.answer;

    return `I don't have an answer for that yet. Try "check my grades", or ask about requirements, deadlines, the grading system, or consultation hours.`;
  }

  window.handleSend = function(){
    const input = document.getElementById('chatInput');
    const val = input.value.trim();
    if(!val) return;
    addUserBubble(val);
    input.value = '';
    showTyping(() => addBotBubble(respond(val)));
  };

  window.sendQuick = function(text){
    addUserBubble(text);
    showTyping(() => addBotBubble(respond(text)));
  };

  document.getElementById('chatInput').addEventListener('keydown', function(e){
    if(e.key === 'Enter') handleSend();
  });

  addBotBubble(`Hi ${student.name.split(' ')[0]}! I'm GradeMate!. Ask me to check your grades, or ask about requirements, deadlines, or the grading system.`);
})();
