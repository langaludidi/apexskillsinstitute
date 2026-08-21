const ORIGIN='https://apex-skills-institute-rmlx0fgdj-ludidil-5352s-projects.vercel.app';
module.exports=async function(req,res){
  try{
    const u=new URL(req.url||'/',ORIGIN);
    const r=await fetch(u,{method:req.method||'GET',headers:{'user-agent':req.headers['user-agent']||'Apex-restore-proxy','accept':req.headers.accept||'*/*'}});
    res.statusCode=r.status;
    for(const [k,v] of r.headers){if(!['content-encoding','content-length','transfer-encoding','connection'].includes(k.toLowerCase()))res.setHeader(k,v)}
    res.setHeader('X-Apex-Restore-Proxy','v2.13-known-good');
    const b=Buffer.from(await r.arrayBuffer());
    res.setHeader('Content-Length',String(b.length));
    res.end(b);
  }catch(e){
    console.error('Apex restore proxy failed',e);
    res.statusCode=503;
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.end('Apex Skills Institute is temporarily unavailable. Please try again shortly.');
  }
};
