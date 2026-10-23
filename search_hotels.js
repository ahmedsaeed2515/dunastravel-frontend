const fs = require('fs');
const path = require('path');
function walk(dir){
  const results=[];
  try{
    for(const f of fs.readdirSync(dir)){
      const p = path.join(dir,f);
      const stat = fs.statSync(p);
      if(stat.isDirectory()) results.push(...walk(p));
      else if(/\.(jsx|js|tsx|ts)$/.test(f)) results.push(p);
    }
  }catch(e){}
  return results;
}
const files = walk(path.join(process.cwd(), 'src'));
const re = /صمم رحلتك الخاصة|استكشف الباقات|design.*trip|custom.*trip|explore.*packages/g;
for(const f of files){
  try{
    const content = fs.readFileSync(f,'utf8');
    if(re.test(content)){
      const lines = content.split('\n');
      lines.forEach((l,i)=>{
        if(/صمم رحلتك الخاصة|استكشف الباقات|design.*trip|custom.*trip|explore.*packages/i.test(l)){
          console.log(path.relative(process.cwd(), f)+':'+(i+1)+':'+l);
        }
      });
    }
  }catch(e){}
}
