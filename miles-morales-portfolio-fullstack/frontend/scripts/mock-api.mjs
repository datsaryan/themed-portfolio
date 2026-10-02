// Tiny mock backend for exercising the boot cinematic's load paths without
// running the Spring app. Usage:  node scripts/mock-api.mjs [port]
// Switch behaviour live:  curl localhost:8080/__mode/ok|500|slow|hang|down
//   ok   - valid responses          500  - every endpoint returns HTTP 500
//   slow - valid, but after 4s      hang - never responds
//   down - destroys the socket (what a dead backend looks like)
import http from 'node:http';

const port = Number(process.argv[2] ?? 8080);
let mode = 'ok';

const profile = {
  name: 'Aryan Singh', heroCodename: 'MILES', title: 'Full Stack Engineer', tagline: 'tagline',
  phone: '+91-0000000000', email: 'a@example.com', location: 'Indore, IN', status: 'Open to work',
  githubUrl: 'https://github.com/datsaryan', linkedinUrl: 'https://linkedin.com', leetcodeUrl: 'https://leetcode.com',
  resumePdfPath: '/Aryan_FullStack_Resume.pdf', summary: 'Live from the mock backend.',
  institution: 'IET DAVV', degree: 'B.Tech', cgpa: '8.0', timeline: '2022-2026', relevantCoursework: ['DSA'],
};

http.createServer((req, res) => {
  const cors = { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' };
  const m = req.url.match(/^\/__mode\/(\w+)/);
  if (m) { mode = m[1]; res.writeHead(200, cors); return res.end(JSON.stringify({ mode })); }
  if (mode === 'down') return req.socket.destroy();
  if (mode === 'hang') return;
  const respond = () => {
    if (mode === '500') { res.writeHead(500, cors); return res.end('{"error":"boom"}'); }
    res.writeHead(200, cors);
    res.end(JSON.stringify(req.url.startsWith('/api/profile') ? profile : []));
  };
  mode === 'slow' ? setTimeout(respond, 4000) : respond();
}).listen(port, '127.0.0.1', () => console.log(`mock api on :${port}`));
