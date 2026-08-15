(function(){
  const { id, role, student } = currentSession();
  renderNav('grades');

  if(!student){
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('rcName').textContent = student.name;
  document.getElementById('rcMeta').textContent = `ID ${id} · Grade ${student.grade} – ${student.section}`;
  document.getElementById('rcAvg').textContent = average(student.subjects);
  document.getElementById('askChatbotBtn').href = `chatbot.html?id=${id}&role=${role}`;

  const rows = Object.entries(student.subjects).map(([subj, g]) => {
    const ww = Math.min(100, g + 3);
    const pt = Math.max(60, g - 2);
    const qa = g;
    const low = g < PASSING;
    return `
      <tr class="subject-row">
        <td>${subj}</td>
        <td>${ww}</td>
        <td>${pt}</td>
        <td>${qa}</td>
        <td class="grade ${low?'low':''}">${g}</td>
        <td>${low ? '<span class="pill risk">Below</span>' : '<span class="pill ok">Passing</span>'}</td>
      </tr>`;
  }).join('');
  document.getElementById('gradeRows').innerHTML = rows;

  const low = lowSubjects(student.subjects);
  if(low.length){
    document.getElementById('riskCard').style.display = 'block';
    document.getElementById('riskText').textContent =
      `You're below the passing mark (${PASSING}) in ${low.length} subject${low.length>1?'s':''}: ${low.join(', ')}. This has flagged your record for adviser follow-up.`;
  }
})();
