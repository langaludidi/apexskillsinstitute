(()=>{
const ROLE_OPTIONS=[
 ['facilitator','Facilitator'],['subject_matter_expert','Subject Matter Expert'],['industry_practitioner','Industry Practitioner'],['guest_speaker','Guest Speaker'],['assessor','Assessor'],['moderator','Moderator'],['programme_developer','Programme Developer']
];
const SCHOOL_OPTIONS=[
 ['business_entrepreneurship','Business & Entrepreneurship'],['finance_administration','Finance & Administration'],['human_resources_public_finance','Human Resources & Public Finance'],['ohs_risk_compliance','Occupational Health & Safety, Risk & Compliance'],['digital_technology_data','Digital Technology & Data'],['project_operations_built_environment','Project, Operations & Built Environment'],['public_sector_municipal_management','Public Sector & Municipal Management'],['supply_chain_fleet_logistics','Supply Chain, Fleet & Logistics'],['agriculture_rural_enterprise','Agriculture & Rural Enterprise']
];
const STYLE=`
.search-multi{position:relative;margin-top:4px}.search-multi-box{min-height:44px;border:1px solid #ccd5e3;border-radius:8px;background:#fff;padding:6px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;cursor:text}.search-multi-box:focus-within{border-color:#0A1B4A;box-shadow:0 0 0 2px rgba(10,27,74,.08)}.search-multi-input{border:0!important;outline:0!important;box-shadow:none!important;padding:5px!important;min-width:180px;flex:1}.search-multi-tag{display:inline-flex;align-items:center;gap:6px;background:#eef3ff;color:#163c80;border-radius:999px;padding:5px 9px;font-size:.88rem}.search-multi-tag button{border:0!important;background:transparent!important;color:#163c80!important;padding:0!important;font-weight:700!important;line-height:1!important}.search-multi-menu{position:absolute;z-index:50;left:0;right:0;top:calc(100% + 4px);background:#fff;border:1px solid #ccd5e3;border-radius:10px;box-shadow:0 12px 30px rgba(15,23,42,.14);max-height:240px;overflow:auto;display:none}.search-multi.open .search-multi-menu{display:block}.search-multi-option{padding:10px 12px;cursor:pointer}.search-multi-option:hover,.search-multi-option.active{background:#f2f6ff}.search-multi-empty{padding:10px 12px;color:#64748b;font-size:.9rem}.search-multi-help{font-size:.78rem;color:#64748b;margin-top:5px}.search-multi-hidden{display:none!important}
`;
function ensureStyle(){if(document.getElementById('search-multi-style'))return;const s=document.createElement('style');s.id='search-multi-style';s.textContent=STYLE;document.head.appendChild(s)}
function parse(v){return String(v||'').split(',').map(x=>x.trim()).filter(Boolean)}
function human(v){return String(v||'').replaceAll('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}
function enhance(input, options, config={}){
 if(!input||input.dataset.searchEnhanced==='1')return;
 input.dataset.searchEnhanced='1';input.classList.add('search-multi-hidden');
 const root=document.createElement('div');root.className='search-multi';
 const box=document.createElement('div');box.className='search-multi-box';
 const q=document.createElement('input');q.type='text';q.className='search-multi-input';q.placeholder=config.placeholder||'Type to search…';q.autocomplete='off';
 const menu=document.createElement('div');menu.className='search-multi-menu';
 root.append(box,menu);box.appendChild(q);input.insertAdjacentElement('afterend',root);
 if(config.help){const h=document.createElement('div');h.className='search-multi-help';h.textContent=config.help;root.appendChild(h)}
 let selected=parse(input.value);
 const labels=new Map((options||[]).map(([v,l])=>[v,l]));
 function sync(){input.value=selected.join(',');input.dispatchEvent(new Event('change',{bubbles:true}))}
 function renderTags(){box.querySelectorAll('.search-multi-tag').forEach(x=>x.remove());selected.forEach(v=>{const t=document.createElement('span');t.className='search-multi-tag';t.textContent=labels.get(v)||human(v);const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Remove '+(labels.get(v)||v));b.textContent='×';b.onclick=e=>{e.stopPropagation();selected=selected.filter(x=>x!==v);sync();renderTags();renderMenu()};t.appendChild(b);box.insertBefore(t,q)})}
 function available(){const needle=q.value.trim().toLowerCase();let list=(options||[]).filter(([v,l])=>!selected.includes(v)&&(!needle||v.toLowerCase().includes(needle)||l.toLowerCase().includes(needle)));if(config.creatable&&needle&&!selected.some(x=>x.toLowerCase()===needle)&&!list.some(([v,l])=>v.toLowerCase()===needle||l.toLowerCase()===needle)){list=[...list,[q.value.trim(),`Add “${q.value.trim()}”`]]}return list}
 function renderMenu(){const list=available();menu.innerHTML='';if(!list.length){menu.innerHTML='<div class="search-multi-empty">No matches</div>';return}list.slice(0,60).forEach(([v,l])=>{const d=document.createElement('div');d.className='search-multi-option';d.textContent=l;d.onclick=()=>{selected.push(v);q.value='';sync();renderTags();renderMenu();q.focus()};menu.appendChild(d)})}
 box.onclick=()=>q.focus();q.onfocus=()=>{root.classList.add('open');renderMenu()};q.oninput=renderMenu;q.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();const first=menu.querySelector('.search-multi-option');if(first)first.click()}if(e.key==='Backspace'&&!q.value&&selected.length){selected.pop();sync();renderTags();renderMenu()}if(e.key==='Escape')root.classList.remove('open')};document.addEventListener('click',e=>{if(!root.contains(e.target))root.classList.remove('open')});renderTags();sync();
}
function run(){ensureStyle();
 enhance(document.getElementById('approved-roles'),ROLE_OPTIONS,{placeholder:'Search faculty roles…',help:'Only valid Apex Faculty role values can be selected.'});
 enhance(document.getElementById('approved-schools'),SCHOOL_OPTIONS,{placeholder:'Search Apex Schools…',help:'Select one or more Schools.'});
 const subjects=document.getElementById('approved-subjects');if(subjects){const vals=parse(subjects.value);enhance(subjects,vals.map(v=>[v,v]),{placeholder:'Search or add subjects…',creatable:true,help:'Press Enter to add a new subject.'})}
 const courses=document.getElementById('approved-courses');if(courses){const vals=parse(courses.value);enhance(courses,vals.map(v=>[v,v]),{placeholder:'Search or add courses…',creatable:true,help:'Press Enter to add a course; selected items are saved as tags.'})}
}
const mo=new MutationObserver(run);mo.observe(document.documentElement,{subtree:true,childList:true});document.addEventListener('DOMContentLoaded',run);setTimeout(run,500);
})();