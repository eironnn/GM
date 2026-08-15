/* ==========================================================
   GradeMate! — shared mock data & helpers
   (In a production build this would be replaced by API calls
   to the school's student information system.)
   ========================================================== */

const PASSING = 75;

const STUDENTS = {
  "2023-0145": { name:"Juan Dela Cruz", grade:10, section:"Mabini",
    subjects:{ Filipino:90, English:88, Math:78, Science:82, "Araling Panlipunan":80, MAPEH:85, TLE:91, "Values Education":87 } },
  "2023-0198": { name:"Maria Santos", grade:10, section:"Mabini",
    subjects:{ Filipino:85, English:83, Math:72, Science:74, "Araling Panlipunan":79, MAPEH:88, TLE:86, "Values Education":90 } },
  "2023-0212": { name:"Ricardo Bautista", grade:9, section:"Rizal",
    subjects:{ Filipino:79, English:76, Math:81, Science:77, "Araling Panlipunan":75, MAPEH:82, TLE:80, "Values Education":78 } },
  "2023-0267": { name:"Angelica Reyes", grade:9, section:"Rizal",
    subjects:{ Filipino:92, English:94, Math:89, Science:91, "Araling Panlipunan":90, MAPEH:93, TLE:95, "Values Education":92 } }
};

const FAQS = [
  { keys:["requirement","enroll","enrollment"], answer:"For enrollment you'll need: Form 138 (report card), PSA birth certificate, and Good Moral Certificate from your previous school. Bring these to the registrar's window, Mon–Fri, 8AM–4PM." },
  { keys:["deadline","when is","due"], answer:"Grade submission deadlines are the last Friday of each quarter. Requirement submission for new enrollees is until the 2nd Friday of June." },
  { keys:["grading system","how is grade computed","computation"], answer:"Grades are computed as: 30% Written Work, 50% Performance Tasks, 20% Quarterly Assessment — combined into your Quarterly Grade. The passing mark is 75." },
  { keys:["consult","adviser","teacher"], answer:"For concerns beyond grade lookup — like grade disputes or personal academic planning — please set an appointment with your class adviser during their consultation hours, posted at the guidance office." },
  { keys:["schedule","class hours","time"], answer:"Class hours run 7:30AM–4:30PM, Monday to Friday. Your specific class schedule is posted on your section's bulletin board." }
];

/* ---- helpers ---- */
function getParam(name){
  return new URLSearchParams(window.location.search).get(name);
}

function average(subjects){
  const vals = Object.values(subjects);
  return Math.round((vals.reduce((a,b)=>a+b,0) / vals.length) * 10) / 10;
}

function isAtRisk(subjects){
  return Object.values(subjects).some(g => g < PASSING);
}

function lowSubjects(subjects){
  return Object.entries(subjects).filter(([k,v]) => v < PASSING).map(([k]) => k);
}

function initials(name){
  return name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();
}

/* current session read from URL query params: ?id=2023-0145&role=student  or  ?role=admin */
function currentSession(){
  const role = getParam('role') || 'student';
  const id = getParam('id');
  return { role, id, student: id ? STUDENTS[id] : null };
}
