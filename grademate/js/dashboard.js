(function(){
  const { id, role, student } = currentSession();
  renderNav('dashboard');

  if(!student){
    window.location.href = 'login.html';
    return;
  }

  const qs = `?id=${id}&role=${role}`;
  document.getElementById('chatbotCard').href = `chatbot.html${qs}`;
  document.getElementById('gradesCard').href = `grades.html${qs}`;

  document.getElementById('welcomeTitle').textContent = `Welcome back, ${student.name.split(' ')[0]}`;

  const avg = average(student.subjects);
  const low = lowSubjects(student.subjects);
  const risk = low.length > 0;
  const totalSubjects = Object.keys(student.subjects).length;

  document.getElementById('statGrid').innerHTML = `
    <div class="stat"><div class="n">${avg}</div><div class="l">Quarter Average</div></div>
    <div class="stat"><div class="n">${totalSubjects}</div><div class="l">Subjects Enrolled</div></div>
    <div class="stat"><div class="n">${low.length}</div><div class="l">Below Passing</div></div>
    <div class="stat"><div class="n">${risk ? 'Yes' : 'No'}</div><div class="l">Academic Risk Flag</div></div>
  `;

  const banner = document.getElementById('riskBanner');
  if(risk){
    banner.classList.add('show');
    banner.innerHTML = `<strong>⚑ Academic risk alert.</strong> You're below the passing mark (${PASSING}) in: ${low.join(', ')}. Ask GradeMate! in the chatbot for next steps, or set a consultation with your adviser.`;
  }
})();
