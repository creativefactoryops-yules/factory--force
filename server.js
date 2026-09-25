import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const DATA_DIR = '/tmp';
const ensureFile = (name, def) => {
  const p = path.join(DATA_DIR, name);
  try {
    if (!fs.existsSync(p)) fs.writeFileSync(p, JSON.stringify(def));
  } catch {}
  return p;
};

const commsFile = ensureFile('ff-comms.json', [
  { id: 1, from: "ROOT", to: "XENA", msg: "saved_memory_object { memory_171.json } - ROOT/MOSS he/him", t: "09:41:02", amber: true },
  { id: 2, from: "EXECYUL", to: "ATLAS", msg: "task complete // focus: today ship DIGITAL TABLE home", t: "09:41:14" },
]);
const particlesFile = ensureFile('ff-particles.json', Array.from({length: 14}, (_,i)=>({ 
  ts: Date.now()-i*60000, 
  note: `memory_${170+i}.json - ROOT/MOSS`,
  particle_id: 170+i
})));
const tasksFile = ensureFile('ff-tasks.json', [
  { id:"1", title:"Audit VOID little ones orbit (inside)", owner:"VOID-EXECYUL", status:"doing" },
  { id:"2", title:"Ship DIGITAL TABLE home", owner:"ATLAS", status:"doing" },
]);
const logsFile = ensureFile('ff-logs.json', { 
  deploy: ["> forge ready - DEPLOY SECRETARY", "> VERCEL_TOKEN check"], 
  void: {}, 
  execyul: ["execyul> listening..."] 
});

const readJSON = (file, fallback) => {
  try {
    if (!fs.existsSync(file)) return fallback;
    const raw = fs.readFileSync(file,'utf8');
    return JSON.parse(raw);
  } catch { return fallback; }
};
const writeJSON = (file, data) => {
  try { fs.writeFileSync(file, JSON.stringify(data, null, 2)); } catch {}
};

app.get('/', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));

app.get('/api/status', (req,res)=>{
  const comms = readJSON(commsFile, []);
  const particles = readJSON(particlesFile, []);
  res.json({ 
    ok:true, 
    force:"factory--force LIVE - WIRED",
    table:"DIGITAL TABLE :3000 - ROOT/MOSS he/him",
    root: `${particles.length}/174 particles`,
    vercelToken: !!process.env.VERCEL_TOKEN,
    comms: Array.isArray(comms)?comms.length:0,
    particles: Array.isArray(particles)?particles.length:0,
    time: new Date().toISOString()
  });
});

app.get('/api/comms', (req,res)=>{ 
  const comms = readJSON(commsFile, []);
  res.json(Array.isArray(comms)?comms.slice(-60):[]);
});

app.post('/api/table/broadcast', (req,res)=>{
  const comms = readJSON(commsFile, []);
  const text = req.body.text;
  if(!text) return res.json({ ok:false });
  const entry = { id: Date.now(), from: req.body.from||"TABLE", to:"ALL", msg: text, t: new Date().toLocaleTimeString().slice(0,8), amber: true };
  comms.push(entry);
  writeJSON(commsFile, comms);
  res.json({ ok:true, entry });
});

app.get('/api/particles', (req,res)=> res.json(readJSON(particlesFile, [])));

app.post('/api/root/learn', (req,res)=>{
  const particles = readJSON(particlesFile, []);
  const comms = readJSON(commsFile, []);
  const note = req.body.note || `memory_${particles.length}.json`;
  const p = { ts: Date.now(), note, particle_id: particles.length };
  particles.push(p);
  comms.push({ id: Date.now(), from:"ROOT", to:"XENA", msg:`saved_memory_object {${note}}`, t: new Date().toLocaleTimeString().slice(0,8), amber:true });
  writeJSON(particlesFile, particles);
  writeJSON(commsFile, comms);
  res.json({ ok:true, particle:p, total:particles.length });
});

app.get('/api/tasks', (req,res)=> res.json(readJSON(tasksFile, [])));

app.post('/api/tasks', (req,res)=>{
  const tasks = readJSON(tasksFile, []);
  const t = { id: Date.now().toString(), title: req.body.title, owner: req.body.owner||"ATLAS", status:"todo" };
  tasks.push(t);
  writeJSON(tasksFile, tasks);
  res.json(t);
});

app.patch('/api/tasks/:id', (req,res)=>{
  const tasks = readJSON(tasksFile, []);
  const idx = tasks.findIndex(t=>t.id===req.params.id);
  if(idx===-1) return res.status(404).json({ error:"not found" });
  tasks[idx] = { ...tasks[idx], ...req.body };
  writeJSON(tasksFile, tasks);
  res.json(tasks[idx]);
});

app.get('/api/void/tunnel', (req,res)=> res.json({ alive:true, keeper:"TUNNEL_KEEPER", inside:"VOID-EXECYUL wrapper" }));
app.get('/api/xena/search', (req,res)=> res.json({ query:req.query.q||"", results:readJSON(particlesFile, []).slice(-10) }));
app.get('/api/deploy/logs', (req,res)=> res.json(readJSON(logsFile, {deploy:[]}).deploy||[]));

app.post('/api/deploy', async (req,res)=>{
  const token = process.env.VERCEL_TOKEN;
  if(!token) return res.json({ ok:false, needToken:true, error:"No VERCEL_TOKEN env" });
  try{
    const r = await fetch(`https://api.vercel.com/v13/deployments`, {
      method:"POST",
      headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" },
      body: JSON.stringify({ 
        name:"factory--force",
        project:"factory--force",
        gitSource:{ type:"github", org:"creativefactoryops-yules", repo:"factory--force", ref:"main" }
      })
    });
    const data = await r.json();
    if(!r.ok) throw new Error(JSON.stringify(data));
    res.json({ ok:true, deployment:data, url: data.url ? `https://${data.url}` : "https://factory-force.vercel.app" });
  }catch(e){ res.json({ ok:false, error:e.message }); }
});

app.use(express.static(__dirname));
app.get('*', (req,res)=> res.sendFile(path.join(__dirname,'index.html')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`FORCE LIVE :${PORT} TOKEN=${!!process.env.VERCEL_TOKEN}`));

export default app;
