/* ==========================================================
   GradeMate! — shared top navigation
   Renders into <div id="topnav"></div>, reads ?id=&role= from the URL
   ========================================================== */

function renderNav(activePage, studentName){
  const { role, id } = currentSession();
  const qs = id ? `?id=${id}&role=${role}` : `?role=${role}`;

  const studentLinks = `
    <a href="dashboard.html${qs}" class="${activePage==='dashboard'?'active':''}">Dashboard</a>
    <a href="chatbot.html${qs}" class="${activePage==='chatbot'?'active':''}">Chatbot</a>
    <a href="grades.html${qs}" class="${activePage==='grades'?'active':''}">Grades</a>
  `;
  const adminLinks = `
    <a href="reports.html${qs}" class="${activePage==='reports'?'active':''}">Reports &amp; Analytics</a>
  `;

  const whoLabel = role === 'admin'
    ? 'Registrar Admin'
    : (studentName || 'Loading…');
  const whoBadge = role === 'admin' ? 'A' : (studentName ? initials(studentName) : '?');

  const nav = document.getElementById('topnav');
  if(!nav) return;
  nav.innerHTML = `
    <div class="brand">
      <span class="mark">Grade<em>Mate!</em></span>
      <span class="school">· LMNHS</span>
    </div>
    <div class="links">
      ${role === 'admin' ? adminLinks : studentLinks}
    </div>
    <div class="who">
      <span>${whoLabel}</span>
      <div class="badge">${whoBadge}</div>
      <a class="logout" href="login.html">Log out</a>
    </div>
  `;
}
