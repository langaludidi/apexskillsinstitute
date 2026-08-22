const ORIGIN='https://apex-skills-institute-rmlx0fgdj-ludidil-5352s-projects.vercel.app';
const SITE='https://apexskillsinstitute.co.za';

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cleanPath=p=>{
  if(p==='/index'||p==='/index.html') return '/';
  if(p.endsWith('.html')) return p.slice(0,-5)||'/';
  return p;
};
const canonicalRoute=p=>{
  p=cleanPath(p);
  if(p==='/terms') return '/terms-and-conditions';
  if(p==='/privacy') return '/privacy-policy';
  return p;
};
const cleanInternalUrl=(raw,pagePath)=>{
  if(!raw||raw.startsWith('#')||/^(mailto:|tel:|sms:|javascript:|data:)/i.test(raw)) return raw;
  try{
    const u=new URL(raw,new URL(pagePath,SITE));
    if(u.origin!==SITE) return raw;
    u.pathname=canonicalRoute(u.pathname);
    return `${u.pathname}${u.search}${u.hash}`;
  }catch{return raw}
};
const markCurrentNavigation=(html,pagePath)=>{
  const section=pagePath.startsWith('/schools/')?'/schools':pagePath.startsWith('/programmes/')?'/programmes':canonicalRoute(pagePath);
  return html.replace(/(<header\b[\s\S]*?<nav\b[\s\S]*?<\/nav>)/i,nav=>nav.replace(/<a\b([^>]*?)href=(['"])(.*?)\2([^>]*)>/gi,(m,before,q,href,after)=>{
    const target=cleanInternalUrl(href,pagePath).split(/[?#]/)[0];
    const attrs=`${before}href=${q}${href}${q}${after}`.replace(/\saria-current=(['"])page\1/gi,'');
    const isCta=/\bnav-cta\b/i.test(`${before} ${after}`);
    return target===section&&!isCta?`<a${attrs} aria-current="page">`:`<a${attrs}>`;
  }));
};
const MEDIA='/assets/media/';
const imageForRoute=pagePath=>{
  const p=canonicalRoute(pagePath);
  if(p==='/') return ['apex_02_team_collaboration.webp','Apex learners collaborating around a laptop'];
  if(p==='/schools') return ['apex_04_classroom_learning.webp','Adult learners participating in an Apex classroom session'];
  if(p==='/programmes') return ['apex_01_woman_studying_laptop.webp','Apex learner studying with a laptop and written notes'];
  if(p==='/for-organisations') return ['apex_08_corporate_training_meeting.webp','Organisation-based professional training and discussion'];
  if(p==='/about') return ['apex_07_graduate_diploma.webp','Learner celebrating completion of a learning programme'];
  if(p==='/contact') return ['apex_06_professional_woman_tablet.webp','Professional learner using a tablet in the workplace'];
  if(p==='/payment-flexibility') return ['apex_03_professional_man_laptop.webp','Professional reviewing programme information on a laptop'];
  if(p==='/faculty-network') return ['apex_08_corporate_training_meeting.webp','Experienced facilitator leading an applied professional learning session'];
  if(p.startsWith('/schools/')){
    const slug=p.split('/').pop();
    const school={
      'business-entrepreneurship':'apex_03_professional_man_laptop.webp',
      'finance-administration':'apex_06_professional_woman_tablet.webp',
      'human-resources-public-finance':'apex_08_corporate_training_meeting.webp',
      'ohs-risk-compliance':'apex_04_classroom_learning.webp',
      'digital-technology-data':'apex_09_student_books.webp',
      'project-operations-built-environment':'apex_08_corporate_training_meeting.webp',
      'public-sector-municipal-management':'apex_06_professional_woman_tablet.webp',
      'supply-chain-fleet-logistics':'apex_02_team_collaboration.webp',
      'agriculture-rural-enterprise':'apex_01_woman_studying_laptop.webp'
    }[slug]||'apex_04_classroom_learning.webp';
    return [school,'Apex applied-learning participants'];
  }
  if(p.startsWith('/programmes/')){
    if(/farm|agri|rural|cooperative/.test(p)) return ['apex_01_woman_studying_laptop.webp','Learner developing practical enterprise capability'];
    if(/digital|excel|cyber|data|sql|microsoft|ai-/.test(p)) return ['apex_09_student_books.webp','Learner building practical digital and workplace capability'];
    if(/bookkeeping|payroll|finance|budget|office|records|administration/.test(p)) return ['apex_06_professional_woman_tablet.webp','Professional developing finance and administration capability'];
    if(/health|safety|risk|incident|popia|compliance/.test(p)) return ['apex_04_classroom_learning.webp','Participants in a structured professional learning environment'];
    if(/project|operations|facilities|construction|monitoring/.test(p)) return ['apex_08_corporate_training_meeting.webp','Applied organisational and project learning session'];
    if(/public|municipal|government|procurement|supply|logistics|fleet|inventory|supplier/.test(p)) return ['apex_02_team_collaboration.webp','Apex learners collaborating on an applied workplace task'];
    return ['apex_03_professional_man_laptop.webp','Professional learner completing an applied programme activity'];
  }
  return null;
};
const mediaCss=`<style id="apex-media-quality">header nav a[aria-current="page"]{color:#07183d;box-shadow:inset 0 -3px #d85700}a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible{outline:3px solid #e56a14!important;outline-offset:3px}.brand img,.footer-logo{height:auto;image-rendering:auto}.page-hero-media,.school-hero-media{background:#07183d;overflow:hidden}.page-hero-media img,.school-hero-media img{width:100%;height:100%;object-fit:cover;object-position:center;display:block}.apex-context-media{max-width:1180px;margin:0 auto 42px;padding:0 24px}.apex-context-media div{overflow:hidden;background:#07183d;aspect-ratio:16/7}.apex-context-media img{width:100%;height:100%;display:block;object-fit:cover;object-position:center}.apex-context-media figcaption{margin-top:10px;color:#475569;font-size:.82rem}@media(max-width:760px){header nav a[aria-current="page"]{box-shadow:none;background:#eef3fb}.apex-context-media{padding:0 18px;margin-bottom:28px}.apex-context-media div{aspect-ratio:4/3}}</style>`;
const applyRouteImage=(html,pagePath)=>{
  const choice=imageForRoute(pagePath);
  let out=html.replace('</head>',`${mediaCss}</head>`);
  if(!choice) return out;
  const [file,alt]=choice,src=`${MEDIA}${file}`;
  if(/class="(?:page-hero-media|school-hero-media)"/i.test(out)) return out.replace(/(<div class="(?:page-hero-media|school-hero-media)"[^>]*>[\s\S]*?<img\b)([^>]*)(>)/i,(m,start,attrs,end)=>`${start}${attrs.replace(/\bsrc="[^"]*"/i,`src="${src}"`).replace(/\balt="[^"]*"/i,`alt="${alt}"`)}${end}`);
  if(pagePath==='/') return out.replace(/(<img\b[^>]*?alt=")Learners collaborating around a laptop("[^>]*?src=")([^"]+)/i,`$1${alt}$2${src}`);
  if(pagePath.startsWith('/programmes/')){
    const figure=`<figure class="apex-context-media"><div><img src="${src}" alt="${alt}" width="1536" height="1024" loading="eager" decoding="async"></div></figure>`;
    return out.replace(/(<\/section>\s*)(<section class="section">)/i,`$1${figure}$2`);
  }
  return out;
};
const cleanHtml=(html,pagePath)=>{
  let out=html.replace(/\b(href|src|action)=(['"])(.*?)\2/gi,(m,a,q,u)=>`${a}=${q}${cleanInternalUrl(u,pagePath)}${q}`);
  out=out.replace(/<a\b([^>]*?)href="\/privacy-policy"([^>]*)>Privacy<\/a>\s*·\s*<a\b([^>]*?)href="\/terms-and-conditions"([^>]*)>Terms<\/a>/i,'<a$1href="/privacy-policy"$2>Privacy Policy</a> · <a$3href="/terms-and-conditions"$4>Terms &amp; Conditions</a> · <a href="/disclaimer" style="display:inline;margin:0">Disclaimer</a>');
  out=out.replace(/(<h3 class="footer-heading">Institution<\/h3>[\s\S]*?<a href="\/about">About Apex<\/a>)/i,'$1<a href="/faculty-network">Faculty Network</a>');
  return applyRouteImage(markCurrentNavigation(out,pagePath),pagePath);
};

function shell({title,description,label,heading,body}){
return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0A1B4A"><title>${esc(title)} | Apex Skills Institute</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${SITE}${locationFor(title)}"><link rel="icon" href="/assets/favicon.png"><link rel="stylesheet" href="/assets/styles.css?v=2.13.0"><meta property="og:site_name" content="Apex Skills Institute"><meta property="og:type" content="website"><meta property="og:title" content="${esc(title)} | Apex Skills Institute"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${SITE}${locationFor(title)}"><meta property="og:image" content="${SITE}/assets/apex-social-card-v2.jpg"><meta name="twitter:card" content="summary_large_image"></head><body><a class="skip" href="#main">Skip to content</a><header><div class="wrap head"><a class="brand" href="/" aria-label="Apex Skills Institute home"><img src="/assets/apex-logo-light.webp" alt="Apex Skills Institute"></a><nav aria-label="Primary navigation"><a href="/schools">Schools</a><a href="/programmes">Programmes</a><a href="/for-organisations">For Organisations</a><a href="/about">About</a><a href="/contact">Contact</a><a class="nav-cta" href="/contact">Enquire</a></nav><button class="menu" aria-expanded="false" aria-label="Open menu"><span></span><span></span><span></span></button></div></header><main id="main"><section class="page-hero"><div class="wrap"><div class="eyebrow">${esc(label)}</div><h1>${esc(heading)}</h1><p class="lead">Effective 21 August 2026 · Version 1.0</p><div class="status-note"><strong>Draft — Legal Review.</strong> This page is published for institutional transparency and remains subject to review by an appropriate South African legal or privacy professional.</div></div></section><section class="section"><div class="wrap" style="max-width:900px"><div class="legal-copy">${body}</div></div></section></main>${footer()}<script src="/assets/site.js?v=2.13.0"></script></body></html>`}
function locationFor(title){return title==='Terms and Conditions'?'/terms-and-conditions':title==='Privacy Policy'?'/privacy-policy':'/disclaimer'}
function footer(){return `<footer><div class="wrap"><div class="foot-grid"><div><img class="footer-logo" src="/assets/apex-logo-dark.webp" alt="Apex Skills Institute"><p>Practical learning for real capability.</p></div><div><h3 class="footer-heading">Explore</h3><a href="/schools">Schools</a><a href="/programmes">Programmes</a><a href="/for-organisations">For Organisations</a></div><div><h3 class="footer-heading">Legal</h3><a href="/terms-and-conditions">Terms and Conditions</a><a href="/privacy-policy">Privacy Policy</a><a href="/disclaimer">Disclaimer</a><a href="/payment-flexibility">Payment Flexibility</a></div><div><h3 class="footer-heading">Contact</h3><a href="tel:+27731433319">073 143 3319</a><a href="mailto:chairman@apexskillsinstitute.co.za">chairman@apexskillsinstitute.co.za</a><span>Port Elizabeth, Eastern Cape</span></div></div><div class="fine"><span>Apex Skills Institute (Pty) Ltd · 2026/153633/07</span><span>© 2026 Apex Skills Institute</span></div></div></footer>`}
const s=(h,p)=>`<section><h2>${h}</h2>${p}</section>`;
const list=a=>`<ul>${a.map(x=>`<li>${x}</li>`).join('')}</ul>`;
const TERMS=shell({title:'Terms and Conditions',description:'Terms governing the Apex Skills Institute website, programme enrolment, fees, payment flexibility, learning and related services.',label:'Legal',heading:'Terms and Conditions',body:
 s('1. About Apex Skills Institute',`<p>Apex Skills Institute (Pty) Ltd (“Apex”, “we”, “us” or “our”) is a South African private company providing professional-development, applied-learning, workforce-development and organisational-capability programmes.</p><p><strong>Registration number:</strong> 2026/153633/07<br><strong>Registered office:</strong> 27 Trichardt Street, Parsons Hill, Port Elizabeth, Eastern Cape, 6001, South Africa.</p>`)+
 s('2. Scope of these Terms',`<p>These Terms apply, where relevant, to individual and prospective learners, website users, applicants, persons purchasing or participating in Apex programmes, organisations arranging learning interventions and users of Apex digital services. Separate signed agreements may apply to organisation-based training, funded projects and customised interventions.</p>`)+
 s('3. Programme status',`<p>Unless expressly stated otherwise for a specific programme, an Apex programme is an <strong>institutional, non-credit-bearing learning programme</strong>. Apex does not represent such a programme as an NQF-registered qualification, QCTO- or SETA-accredited programme, SAQA-registered qualification, professional designation or other externally accredited or registered programme.</p>`)+
 s('4. Programme information',`<p>Apex takes reasonable steps to keep programme descriptions, outcomes, duration, delivery information and fees accurate. Information may be updated to improve learning quality, maintain relevance, reflect regulatory or industry developments, correct errors or accommodate reasonable operational requirements.</p>`)+
 s('5. Applications and enrolment',`<p>Submitting an application does not automatically constitute acceptance or enrolment. An enrolment is confirmed only when Apex has communicated acceptance and applicable enrolment requirements have been satisfied. Apex may decline or cancel an application where materially false, misleading or fraudulent information has been supplied, subject to applicable law.</p>`)+
 s('6. Programme fees',`<p>The Programme Fee is the price displayed on the relevant programme page or otherwise formally quoted by Apex. Apex may change prices prospectively, but a subsequent price change will not retrospectively alter a Programme Fee already agreed for a confirmed enrolment except where permitted by law or expressly agreed.</p>`)+
 s('7. Payment Flexibility',`<p>Certain Apex programmes may offer flexible monthly payments. Where available, this allows the agreed Programme Fee to be paid over an approved payment period. Apex does not increase the Programme Fee solely because an eligible learner chooses monthly payment.</p><table><tr><th>Payment option</th><th>Amount</th></tr><tr><td>Programme Fee</td><td>R4,950</td></tr><tr><td>Pay in full</td><td>R4,950</td></tr><tr><td>Flexible monthly option</td><td>2 × R2,475</td></tr><tr><td>Total payable</td><td>R4,950</td></tr></table><p>Not every programme is necessarily eligible. See <a href="/payment-flexibility">Payment Flexibility</a>.</p>`)+
 s('8. Payment obligations',`<p>A learner selecting monthly payment agrees to pay each instalment on the disclosed dates. Instalments form part of payment of the agreed Programme Fee and are not separate programme purchases. Apex will not impose an undisclosed interest charge, finance charge or payment-plan premium.</p>`)+
 s('9. Cancellations, withdrawals and refunds',`<p>Apex recognises applicable consumer rights under South African law. Outcomes may depend on timing, commencement, digital materials or services already supplied, the nature and reason for cancellation and services already performed. Where applicable, Apex may charge only a lawful and reasonable cancellation amount. Nothing in these Terms waives a statutory consumer right that cannot legally be waived.</p>`)+
 s('10. Cooling-off and electronic transactions',`<p>Where a statutory cooling-off or cancellation right applies, Apex will respect that right in accordance with applicable South African law.</p>`)+
 s('11. Programme commencement and scheduling',`<p>Programme commencement may be subject to operational requirements, including minimum viable cohort sizes where applicable. Apex will communicate confirmed commencement information and reasonable options where postponement or rescheduling is required.</p>`)+
 s('12. Changes or cancellation by Apex',`<p>Apex may reasonably reschedule sessions, change facilitators, modify delivery arrangements, update learning materials or adjust sequencing without materially diminishing the programme purchased. If Apex cancels a programme without a reasonable alternative, affected learners will receive an appropriate remedy in accordance with applicable law.</p>`)+
 s('13. Learning materials and intellectual property',`<p>Apex owns or lawfully uses its learner guides, facilitator guides, presentations, toolkits, templates, assessments, rubrics, case studies, videos and digital resources. Enrolment grants a limited, personal, non-transferable learning-use right. Materials may not be sold, publicly uploaded, commercially reproduced, redistributed or represented as the learner’s own without written permission.</p>`)+
 s('14. Digital learning and account security',`<p>Digital-learning accounts are personal. Learners must protect their credentials. Temporary interruptions may occur because of maintenance, telecommunications failures, third-party systems or circumstances outside Apex’s reasonable control.</p>`)+
 s('15. Learner conduct',`<p>Learners are expected to act respectfully and professionally. Apex may proportionately address harassment, discrimination, threats, fraud, academic dishonesty, deliberate disruption, unauthorised system access, impersonation and serious intellectual-property infringement.</p>`)+
 s('16. Assessment',`<p>Assessment requirements vary and may include practical exercises, applied assignments, case analysis, workplace scenarios, projects, presentations, portfolios or capstone outputs. Attendance alone does not necessarily constitute successful completion.</p>`)+
 s('17. Academic and assessment integrity',`<p>Plagiarism, impersonation, falsification of evidence, unauthorised collaboration or other material misconduct may result in rejection of an assessment or other appropriate action. AI-tool use may be regulated by programme-specific instructions.</p>`)+
 s('18. Certificates',`<p>Certificate type depends on the programme and successful satisfaction of requirements. An Apex certificate does not confer an NQF qualification, professional designation, statutory licence or external accreditation unless expressly stated.</p>`)+
 s('19. Organisation-based training',`<p>Organisation training may be governed by a separate proposal, quotation, service agreement, purchase order or contract. Organisation pricing is quotation-based and individual website prices do not automatically determine organisation-based pricing.</p>`)+
 s('20. Facilitators and subject-matter experts',`<p>Apex may use appropriately selected employees, independent facilitators, practitioners, subject-matter experts, assessors, moderators or guest speakers. A particular facilitator is not guaranteed unless expressly agreed.</p>`)+
 s('21. External services and links',`<p>Third-party platforms, payment services, software and websites are governed by their own terms and privacy practices. A link does not necessarily constitute endorsement of every third-party statement, product or service.</p>`)+
 s('22. Privacy',`<p>Apex processes personal information in accordance with applicable South African data-protection law and the <a href="/privacy-policy">Privacy Policy</a>.</p>`)+
 s('23. Limitation and statutory rights',`<p>Apex will exercise reasonable care in providing its services. To the maximum extent permitted by law, Apex is not responsible for indirect losses arising from circumstances outside its reasonable control or reliance on educational content outside its intended context. Nothing excludes liability or consumer rights where doing so would be unlawful.</p>`)+
 s('24. Complaints',`<p>Apex encourages concerns to be raised directly with sufficient information to identify the programme, issue and requested resolution. Nothing prevents use of an external statutory right or remedy.</p>`)+
 s('25. Governing law',`<p>These Terms are governed by the laws of the Republic of South Africa and applicable mandatory consumer-protection jurisdiction.</p>`)+
 s('26. Changes to these Terms',`<p>Apex may update these Terms. The current version and effective date will be published here. Material changes affecting an existing contractual relationship will be dealt with in accordance with applicable law.</p>`)+
 s('27. Contact',`<p>Questions may be submitted through the <a href="/contact">Contact page</a> or to <a href="mailto:chairman@apexskillsinstitute.co.za">chairman@apexskillsinstitute.co.za</a>.</p>`)
});
const PRIVACY=shell({title:'Privacy Policy',description:'How Apex Skills Institute collects, uses, protects and manages personal information relating to learners, clients, website users and Faculty Network applicants.',label:'Privacy',heading:'Privacy Policy',body:
 `<p><strong>Your information. Handled responsibly.</strong></p>`+
 s('1. Who we are',`<p><strong>Apex Skills Institute (Pty) Ltd</strong><br>Registration number: 2026/153633/07<br>27 Trichardt Street, Parsons Hill, Port Elizabeth, Eastern Cape, 6001, South Africa.</p>`)+
 s('2. Scope',`<p>This Policy applies to information processed through the website, enquiries, applications, enrolments, learning platforms, assessments, payments, organisation engagements, events, communications, the Apex Faculty Network and other Apex activities.</p>`)+
 s('3. Information we may collect',list(['Name and surname','Contact and location information','Identification information where legitimately required','Education, qualifications, employment and professional information','Programme, application, enrolment, assessment and certification records','Communications and transaction records','Organisation or client information','Technical website information','Other information voluntarily supplied']))+
 s('4. Learner information',`<p>Information may be used to respond to enquiries, process applications and enrolment, provide learning, administer assessments and certificates, provide support, administer payments, maintain appropriate records and communicate about the programme.</p>`)+
 s('5. Faculty Network information',`<p>Faculty applicants may provide contact details, location, professional profile, employment history, qualifications, registrations, expertise, sector and facilitation experience, delivery preferences, languages, geographic availability, CV/supporting documents and optional rate expectations. Initial applications should not require unnecessary banking, tax or identity-document information.</p>`)+
 s('6. How we collect information',`<p>Information may be collected directly from you, through forms, enrolment and learning systems, assessments, correspondence, organisations legitimately arranging training, authorised service providers and lawful public or professional sources.</p>`)+
 s('7. Why we process information',`<p>Purposes include providing services, managing learning and assessment, communicating, administering certificates and transactions, responding to enquiries, managing organisation engagements and Faculty Network applicants, maintaining security, meeting legal obligations, protecting legitimate interests, improving services and conducting lawful marketing.</p>`)+
 s('8. Faculty Network purpose limitation',`<p>Faculty information is primarily used to evaluate suitability, verify information, categorise expertise, contact applicants, manage the faculty pipeline, identify potential assignments and manage subsequent professional engagements. Submission does not guarantee appointment or work.</p>`)+
 s('9. Marketing',`<p>Direct electronic marketing is managed in accordance with applicable law. Faculty application consent does not automatically constitute marketing consent; any marketing opt-in must be separate and optional.</p>`)+
 s('10. Sharing information',`<p>Where reasonably necessary, Apex may share information with authorised employees, facilitators or administrators, technology and learning-platform providers, payment providers, hosting providers, professional advisers, quality-assurance providers, contracted operators and authorities where legally required. Apex does not sell personal information as a commercial database.</p>`)+
 s('11. Operators and service providers',`<p>Apex seeks to use appropriate providers and contractual and security arrangements where another organisation processes information on its behalf.</p>`)+
 s('12. Cross-border processing',`<p>Some technology providers may process information outside South Africa. Apex will take reasonable steps to handle transfers consistently with applicable data-protection requirements.</p>`)+
 s('13. Security',`<p>Apex implements reasonable organisational and technical safeguards appropriate to the information processed. No system can be guaranteed completely secure. Security compromises will be handled in accordance with applicable legal requirements.</p>`)+
 s('14. Retention',`<p>Information is retained only as long as reasonably necessary for its purpose, legitimate operational or academic recordkeeping, contractual and legal requirements, dispute management or another lawful purpose. Unsuccessful Faculty applications will not automatically be retained indefinitely.</p>`)+
 s('15. Your rights',`<p>Subject to applicable law, individuals may request access, correction, deletion or destruction where appropriate, object to certain processing, withdraw consent where applicable, manage marketing preferences and raise complaints. Apex may require sufficient information to verify identity and locate the relevant record.</p>`)+
 s('16. Cookies and website technology',`<p>Apex may use cookies and similar technologies for essential operation, security, preferences, analytics, performance and other lawful purposes. Appropriate notices or choices will be presented where required.</p>`)+
 s('17. Children and minors',`<p>Apex does not intentionally process children’s personal information without an appropriate lawful basis and required consent or authorisation. Additional safeguards will apply where programmes are intended for minors.</p>`)+
 s('18. Third-party websites',`<p>Third-party websites and platforms have their own privacy practices. Apex is not responsible for independently operated third parties.</p>`)+
 s('19. Information Officer',`<p><strong>Langa Ludidi</strong><br>Apex Skills Institute (Pty) Ltd<br>Email: <a href="mailto:chairman@apexskillsinstitute.co.za">chairman@apexskillsinstitute.co.za</a></p><p>The Information Officer is the primary contact for access, correction, deletion, retention, objection, withdrawal of consent and other POPIA-related matters.</p>`)+
 s('20. Complaints',`<p>Privacy concerns should first be directed to the Information Officer. Individuals retain any right to approach the South African Information Regulator where applicable.</p>`)+
 s('21. Policy updates',`<p>This Policy may be updated as systems, services or legal obligations develop. The latest version will be published on this page with an updated effective date.</p>`)
});
const DISCLAIMER=shell({title:'Disclaimer',description:'Important information about Apex programme status, educational content, professional advice, outcomes and website information.',label:'Legal',heading:'Website and Programme Disclaimer',body:
 s('Programme status',`<p>Unless expressly stated otherwise for a specific programme, Apex programmes are institutional, non-credit-bearing professional-development programmes. They are not represented as NQF-registered qualifications or as QCTO-, SETA-, SAQA- or otherwise externally accredited programmes unless specifically stated.</p>`)+
 s('Educational information',`<p>Apex programmes are designed for learning and capability development. Content concerning law, finance, taxation, occupational health and safety, human resources, procurement, technology, agriculture, risk, compliance or other professional subjects is educational and does not replace advice tailored to a person’s or organisation’s circumstances.</p>`)+
 s('Employment and career outcomes',`<p>Participation or completion does not guarantee employment, promotion, salary increase, professional registration or career advancement.</p>`)+
 s('Tender and procurement outcomes',`<p>Tender, procurement and supplier-development programmes build knowledge and practical capability but do not guarantee CSD approval, tender eligibility or responsiveness, contract awards, government business or any other procurement outcome.</p>`)+
 s('Business and funding outcomes',`<p>Business, entrepreneurship and funding-readiness programmes do not guarantee business success, funding approval, investment, loans, grants, revenue, profitability or market access.</p>`)+
 s('Technology and software',`<p>Technology, AI, cybersecurity, Microsoft, data and software-related content may be affected by product updates and technological change. Third-party product names and trademarks remain the property of their respective owners.</p>`)+
 s('Accuracy and currency',`<p>Apex seeks to maintain accurate and useful information, but content may change as laws, technologies, industry practices and programme designs develop. Users should verify information where decisions carry significant legal, financial, safety or professional consequences.</p>`)+
 s('External links',`<p>Links are provided for convenience or reference. Apex does not control independently operated third-party websites and does not necessarily endorse all of their content.</p>`)+
 s('Limitation',`<p>Nothing on this page excludes liability or statutory rights that cannot lawfully be excluded. Please also read the <a href="/terms-and-conditions">Terms and Conditions</a> and <a href="/privacy-policy">Privacy Policy</a>.</p>`)
});
const LEGAL={'/terms-and-conditions':TERMS,'/privacy-policy':PRIVACY,'/disclaimer':DISCLAIMER};

module.exports=async function(req,res){
  try{
    const incoming=new URL(req.url||'/',SITE);
    const p=incoming.pathname;
    if(p==='/terms'||p==='/terms.html'){res.statusCode=308;res.setHeader('Location','/terms-and-conditions');return res.end()}
    if(p==='/privacy'||p==='/privacy.html'){res.statusCode=308;res.setHeader('Location','/privacy-policy');return res.end()}
    if(p==='/index'||p==='/index.html'||p.endsWith('.html')){res.statusCode=308;res.setHeader('Location',canonicalRoute(p)+(incoming.search||''));return res.end()}
    if(LEGAL[p]){const b=Buffer.from(LEGAL[p]);res.statusCode=200;res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','public, max-age=0, must-revalidate');res.setHeader('Content-Length',String(b.length));return res.end(b)}
    let originPath=p;
    if(!/\.[a-z0-9]{2,8}$/i.test(p) && p!=='/') originPath=p+'.html';
    const u=new URL(originPath+incoming.search,ORIGIN);
    const r=await fetch(u,{method:req.method||'GET',headers:{'user-agent':req.headers['user-agent']||'Apex-clean-url-proxy','accept':req.headers.accept||'*/*'}});
    res.statusCode=r.status;
    const type=r.headers.get('content-type')||'';
    for(const [k,v] of r.headers){if(!['content-encoding','content-length','transfer-encoding','connection','location'].includes(k.toLowerCase()))res.setHeader(k,v)}
    if(r.status>=300&&r.status<400&&r.headers.get('location')){const l=r.headers.get('location');res.setHeader('Location',l.replace(/\.html(?=$|[?#])/i,''))}
    res.setHeader('X-Apex-Release-Layer','v2.15-phase1');
    let b=Buffer.from(await r.arrayBuffer());
    if(type.includes('text/html')) b=Buffer.from(cleanHtml(b.toString('utf8'),p),'utf8');
    res.setHeader('Content-Length',String(b.length));
    res.end(b);
  }catch(e){console.error('Apex release proxy failed',e);res.statusCode=503;res.setHeader('Content-Type','text/plain; charset=utf-8');res.end('Apex Skills Institute is temporarily unavailable. Please try again shortly.')}
};
