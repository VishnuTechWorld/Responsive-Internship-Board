const internships = [
  {id:1,title:"Frontend Developer Intern",company:"Pixel & Code",domain:"Web Development",mode:"Remote",duration:"3 months",stipend:12000,level:"Beginner friendly",logo:"P",tone:"purple",posted:1,description:"Work with a product team to build clean, accessible web interfaces. You will work with HTML, CSS, JavaScript, responsive layouts, and Git."},
  {id:2,title:"Python Developer Intern",company:"Nexora Labs",domain:"Python",mode:"Hybrid",duration:"2 months",stipend:8000,level:"Beginner friendly",logo:"N",tone:"orange",posted:2,description:"Build small Python utilities, work with APIs, and learn how real development teams test and maintain code."},
  {id:3,title:"Machine Learning Intern",company:"Aster AI",domain:"AI / ML",mode:"Remote",duration:"4 months",stipend:15000,level:"Intermediate",logo:"A",tone:"green",posted:3,description:"Support experiments in data preparation and model evaluation. Basic Python and an interest in machine learning are useful."},
  {id:4,title:"Data Analyst Intern",company:"Northstar Analytics",domain:"Data Science",mode:"On-site",duration:"3 months",stipend:10000,level:"Beginner friendly",logo:"N",tone:"blue",posted:4,description:"Turn raw datasets into useful insights with spreadsheets, SQL, and visual reports. Learn to communicate findings clearly."},
  {id:5,title:"UI/UX Design Intern",company:"Mosaic Studio",domain:"UI / UX Design",mode:"Hybrid",duration:"3 months",stipend:9000,level:"Portfolio required",logo:"M",tone:"pink",posted:5,description:"Help shape user-friendly digital experiences through wireframes, prototypes, design systems, and feedback sessions."},
  {id:6,title:"Digital Marketing Intern",company:"Goodfolk Media",domain:"Marketing",mode:"Remote",duration:"2 months",stipend:6000,level:"Beginner friendly",logo:"G",tone:"yellow",posted:6,description:"Assist with social media calendars, campaign research, content ideas, and performance tracking."},
  {id:7,title:"Full Stack Developer Intern",company:"Buildspace",domain:"Web Development",mode:"Hybrid",duration:"6 months",stipend:18000,level:"Intermediate",logo:"B",tone:"blue",posted:7,description:"Contribute to frontend and backend features while learning collaboration, APIs, databases, and deployment workflows."},
  {id:8,title:"Data Science Trainee",company:"InsightSpring",domain:"Data Science",mode:"Remote",duration:"3 months",stipend:0,level:"Beginner friendly",logo:"I",tone:"green",posted:8,description:"Practice data cleaning, exploratory analysis, and basic visualisation on guided real-world style datasets."},
  {id:9,title:"Python Automation Intern",company:"TaskPilot",domain:"Python",mode:"On-site",duration:"3 months",stipend:11000,level:"Intermediate",logo:"T",tone:"orange",posted:9,description:"Create scripts that automate repetitive workflows and document reliable, reusable solutions."}
];

const grid = document.querySelector("#job-grid");
const searchInput = document.querySelector("#search-input");
const domainFilter = document.querySelector("#domain-filter");
const modeFilter = document.querySelector("#mode-filter");
const sortSelect = document.querySelector("#sort-select");
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#empty-state");
const loadMoreButton = document.querySelector("#load-more");
const dialog = document.querySelector("#details-dialog");
const dialogContent = document.querySelector("#dialog-content");
let quickFilter = "all";
let visibleCount = 6;
let savedIds = new Set();

const money = amount => amount ? `₹${amount.toLocaleString("en-IN")}/mo` : "Unpaid";
function getFilteredJobs() {
  const term = searchInput.value.trim().toLowerCase();
  let result = internships.filter(job => {
    const textMatch = `${job.title} ${job.company} ${job.domain} ${job.description}`.toLowerCase().includes(term);
    const domainMatch = domainFilter.value === "all" || job.domain === domainFilter.value;
    const modeMatch = modeFilter.value === "all" || job.mode === modeFilter.value;
    const quickMatch = quickFilter === "all" ||
      (quickFilter === "Paid" ? job.stipend > 0 :
      quickFilter === "Remote" ? job.mode === "Remote" :
      job.domain.toLowerCase().includes(quickFilter.toLowerCase()) || job.title.toLowerCase().includes(quickFilter.toLowerCase()));
    return textMatch && domainMatch && modeMatch && quickMatch;
  });
  if (sortSelect.value === "newest") result.sort((a,b) => a.posted - b.posted);
  if (sortSelect.value === "stipend") result.sort((a,b) => b.stipend - a.stipend);
  return result;
}
function renderJobs() {
  const filtered = getFilteredJobs();
  const visible = filtered.slice(0, visibleCount);
  grid.replaceChildren();
  visible.forEach(job => {
    const card = document.createElement("article");
    card.className = "job-card";
    const top = document.createElement("div"); top.className = "job-top";
    const logo = document.createElement("div"); logo.className = `company-logo ${job.tone}`; logo.textContent = job.logo;
    const save = document.createElement("button"); save.className = `save-btn ${savedIds.has(job.id) ? "saved" : ""}`;
    save.type = "button"; save.setAttribute("aria-label", savedIds.has(job.id) ? "Remove saved internship" : "Save internship");
    save.setAttribute("aria-pressed", String(savedIds.has(job.id))); save.textContent = savedIds.has(job.id) ? "♥" : "♡";
    save.addEventListener("click", () => { savedIds.has(job.id) ? savedIds.delete(job.id) : savedIds.add(job.id); renderJobs(); });
    top.append(logo, save);
    const title = document.createElement("h3"); title.textContent = job.title;
    const company = document.createElement("div"); company.className = "company-name"; company.textContent = job.company;
    const tags = document.createElement("div"); tags.className = "job-tags";
    [job.domain, job.mode, job.duration].forEach((value,index) => { const tag=document.createElement("span"); tag.className=`job-tag ${index===1 && job.mode==="Remote"?"remote":""}`; tag.textContent=value; tags.append(tag); });
    const bottom = document.createElement("div"); bottom.className = "job-bottom";
    const stipend = document.createElement("div"); stipend.className = "stipend";
    const amount = document.createElement("strong"); amount.textContent = money(job.stipend);
    const level = document.createElement("small"); level.textContent = job.level;
    stipend.append(amount,level);
    const details = document.createElement("button"); details.className="details-btn"; details.textContent="View details →"; details.type="button";
    details.addEventListener("click", () => openDetails(job));
    bottom.append(stipend,details); card.append(top,title,company,tags,bottom); grid.append(card);
  });
  resultCount.textContent = `Showing ${visible.length} of ${filtered.length} ${filtered.length===1?"opportunity":"opportunities"}`;
  emptyState.hidden = filtered.length !== 0;
  loadMoreButton.hidden = filtered.length <= visibleCount;
}
function openDetails(job) {
  dialogContent.replaceChildren();
  const logo=document.createElement("div"); logo.className=`company-logo ${job.tone}`; logo.textContent=job.logo;
  const title=document.createElement("h2"); title.className="dialog-title"; title.textContent=job.title;
  const company=document.createElement("p"); company.className="dialog-company"; company.textContent=job.company;
  const description=document.createElement("p"); description.className="dialog-description"; description.textContent=job.description;
  const facts=document.createElement("div"); facts.className="dialog-facts";
  [job.domain,job.mode,job.duration,money(job.stipend)].forEach(value=>{const span=document.createElement("span");span.textContent=value;facts.append(span);});
  const note=document.createElement("p");note.className="dialog-note";note.textContent="Demo listing for this portfolio project. Verify opportunities with the organisation before sharing personal information.";
  dialogContent.append(logo,title,company,description,facts,note);
  if (typeof dialog.showModal === "function") dialog.showModal();
  else alert(`${job.title}\n${job.company}\n${job.description}`);
}
function clearFilters() {
  searchInput.value="";domainFilter.value="all";modeFilter.value="all";sortSelect.value="recommended";quickFilter="all";visibleCount=6;
  document.querySelectorAll(".chip").forEach(chip=>chip.classList.toggle("active",chip.dataset.quick==="all"));
  renderJobs();
}
[searchInput,domainFilter,modeFilter,sortSelect].forEach(control=>control.addEventListener(control===searchInput?"input":"change",()=>{visibleCount=6;renderJobs();}));
document.querySelector("#search-button").addEventListener("click",()=>{visibleCount=6;renderJobs();});
document.querySelectorAll(".chip").forEach(chip=>chip.addEventListener("click",()=>{
  quickFilter=chip.dataset.quick;visibleCount=6;
  document.querySelectorAll(".chip").forEach(item=>item.classList.toggle("active",item===chip));
  renderJobs();
}));
document.querySelector("#clear-filters").addEventListener("click",clearFilters);
document.querySelector("#empty-clear").addEventListener("click",clearFilters);
loadMoreButton.addEventListener("click",()=>{visibleCount+=3;renderJobs();});
document.querySelector("#dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
const menuToggle=document.querySelector("#menu-toggle");
const nav=document.querySelector("#nav");
menuToggle.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));menuToggle.textContent=open?"×":"☰";
});
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");menuToggle.textContent="☰";}));
renderJobs();
