import express from 'express';
const app=express(); app.use(express.json());
const KEYS=[process.env.KEY_1,process.env.KEY_2,process.env.KEY_3].filter(Boolean);
let ki=0; const nextKey=()=>KEYS[ki++ % KEYS.length];
app.post('/api/root',async(req,res)=>{
  for(let i=0;i<KEYS.length;i++){
    try{ const k=nextKey(); console.log(`ROOT key ${ki}`); return res.json({ok:true,via:`key_${ki}`}); }catch(e){continue;}
  }
  console.log("FALLBACK Ollama"); return res.json({ok:true,via:"ollama"});
});
app.listen(3000,()=>console.log("HOME DIGITAL TABLE :3000"));
