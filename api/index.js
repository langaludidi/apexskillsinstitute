const ORIGIN='https://apexskillsinstitute.co.za';
module.exports=async function(req,res){
  try{
    const path=(req.url||'/').replace(/^\/api\/index(?:\.js)?(?:\?path=)?/,'/');
    const u=new URL(path||'/',ORIGIN);
    const r=await fetch(u,{method:req.method||'GET',headers:{'user-agent':req.headers['user-agent']||'Apex-v215-preview','accept':req.headers.accept||'*/*'}});
    res.statusCode=r.status;
    for(const [k,v] of r.headers){if(!['content-encoding','content-length','transfer-encoding','connection'].includes(k.toLowerCase()))res.setHeader(k,v)}
    res.setHeader('X-Apex-V215-Fallback','production-baseline');
    const b=Buffer.from(await r.arrayBuffer());res.setHeader('Content-Length',String(b.length));res.end(b);
  }catch(e){console.error('Apex fallback failed',e);res.statusCode=503;res.setHeader('Content-Type','text/plain; charset=utf-8');res.end('Apex Skills Institute is temporarily unavailable. Please try again shortly.');}
};
