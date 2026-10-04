const fs = require("node:fs");
const path = require("node:path");
const content = JSON.parse(fs.readFileSync(path.join(__dirname, "content.json"), "utf8"));
const e = (value) => String(value ?? "").replace(/[&<>"']/g, (character) =>
  ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
const baseUrl = new URL(content.siteUrl).href.replace(/\/$/, "");
if (!baseUrl.startsWith("https://")) throw new Error("siteUrl must use HTTPS.");
const resumeExists = content.resumeFile && fs.existsSync(path.join(__dirname, content.resumeFile));
const year = new Date().getFullYear();
const slugs = new Set();
for (const project of content.projects) {
  if (!/^[a-z0-9-]+$/.test(project.slug) || slugs.has(project.slug)) throw new Error("Invalid or duplicate project slug.");
  slugs.add(project.slug);
}
function externalLink(url, label, className = "") {
  if (!url) return "";
  if (new URL(url).protocol !== "https:") throw new Error("External links must use HTTPS.");
  return '<a class="' + e(className) + '" href="' + e(url) + '" target="_blank" rel="noopener noreferrer">' + label + "</a>";
}
function tags(project) {
  return '<div class="tags">' + project.tools.map((tool) => '<span class="tag">' + e(tool) + "</span>").join("") + "</div>";
}
function header(prefix, home = false) {
  const target = home ? "" : prefix + "index.html";
  const links = [["projects", "Projects"], ["experience", "Experience"], ["lab", "Semiconductor"], ["skills", "Skills"], ["contact", "Contact"]];
  return [
    '<a class="skip-link" href="#main">Skip to content</a>',
    '<header class="site-header"><nav class="nav container" aria-label="Primary navigation">',
    '<a class="brand" href="' + (home ? "#home" : prefix + "index.html") + '" aria-label="' + e(content.name) + ' home"><span class="brand-mark" aria-hidden="true">' + e(content.initials) + "</span><span>" + e(content.name) + "</span></a>",
    '<button class="nav-toggle" type="button" aria-label="Open navigation" aria-controls="site-menu" aria-expanded="false" data-nav-toggle><span></span><span></span><span></span></button>',
    '<div class="nav-links" id="site-menu" data-nav-menu>',
    links.map(([id, title]) => '<a href="' + target + "#" + id + '">' + title + "</a>").join("\n"),
    resumeExists ? '<a class="resume-link" href="' + prefix + e(content.resumeFile) + '" target="_blank" rel="noopener">Resume &darr;</a>' : "",
    "</div></nav></header>"
  ].join("\n");
}
function footer(prefix) {
  return '<footer class="site-footer"><div class="container footer-grid"><p>&copy; <span data-year>' + year + "</span> " + e(content.name) + '. Engineering portfolio.</p><a class="text-link" href="' + prefix + 'index.html#contact">Get in touch &rarr;</a></div></footer>';
}
function page(title, description, body, relativePath = "", prefix = "./", extraHead = "") {
  const canonical = baseUrl + "/" + relativePath;
  const metadata = {
    "@context": "https://schema.org", "@type": relativePath ? "WebPage" : "ProfilePage",
    name: title, url: canonical, description,
    ...(relativePath ? {} : { mainEntity: { "@type": "Person", name: content.name, url: canonical, sameAs: [content.linkedin, content.github].filter(Boolean) } })
  };
  return [
    '<!doctype html><html lang="en"><head>',
    '<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">',
    '<meta name="description" content="' + e(description) + '">',
    '<meta name="theme-color" content="#096b5e"><meta property="og:type" content="website">',
    '<meta property="og:title" content="' + e(title) + '">',
    '<meta property="og:description" content="' + e(description) + '">',
    '<meta property="og:url" content="' + e(canonical) + '">',
    '<meta property="og:image" content="' + e(baseUrl) + '/assets/process-dashboard.png">',
    '<meta property="og:image:alt" content="Illustrative wafer process-analysis visualization">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<link rel="canonical" href="' + e(canonical) + '">',
    '<link rel="icon" type="image/png" href="' + prefix + 'assets/process-dashboard.png">',
    '<link rel="stylesheet" href="' + prefix + 'styles.css">',
    "<title>" + e(title) + "</title>",
    '<script type="application/ld+json">' + JSON.stringify(metadata).replace(/</g, "\\u003c") + "</script>",
    extraHead,
    '<script src="' + prefix + 'script.js" defer></script>',
    "</head><body>", body, "</body></html>\n"
  ].join("\n");
}
const featured = content.projects.filter((project) => project.featured);
const planned = content.projects.filter((project) => !project.featured);
const homepage = [
  header("./", true), '<main id="main">',
  '<section class="hero" id="home" aria-labelledby="home-title">',
  '<img class="hero-media" src="./assets/process-dashboard.png" alt="" width="1800" height="1100" fetchpriority="high">',
  '<div class="container"><div class="hero-copy"><p class="eyebrow">Process quality &middot; Manufacturing systems &middot; Semiconductor</p>',
  '<h1 id="home-title">' + e(content.name) + '</h1><p class="role">' + e(content.headline) + '</p><p class="lede">' + e(content.summary) + "</p>",
  '<div class="hero-actions"><a class="button button-primary" href="#projects">Explore my work <span aria-hidden="true">&rarr;</span></a>',
  externalLink(content.linkedin, "LinkedIn", "button button-outline"),
  externalLink(content.github, "GitHub", "button button-outline"),
  resumeExists ? '<a class="button button-outline" href="./' + e(content.resumeFile) + '">Resume &darr;</a>' : "",
  '</div><p class="hero-foot">Rutgers University &middot; Industrial &amp; Systems Engineering</p></div></div></section>',
  '<div class="focus-band"><div class="container focus-grid">',
  '<div class="focus-item"><strong>Quality &amp; process</strong><span>SPC / DMAIC / Capability</span></div>',
  '<div class="focus-item"><strong>Manufacturing &amp; operations</strong><span>Capacity / Flow / Optimization</span></div>',
  '<div class="focus-item"><strong>Engineering analytics</strong><span>Python / SQL / Visualization</span></div></div></div>',
  '<section class="section" id="projects" aria-labelledby="projects-title"><div class="container">',
  '<div class="section-heading"><div><p class="eyebrow">Selected work</p><h2 id="projects-title">Engineering, backed by evidence.</h2></div><p>Project case studies, working dashboards, and the code behind the analysis.</p></div>',
  '<div class="filter-toolbar"><div class="filters" role="group" aria-label="Filter selected projects">',
  [["all", "All work"], ["semiconductor", "Semiconductor"], ["quality", "Quality"], ["operations", "Operations"], ["analytics", "Analytics"]].map(([filter, label]) => '<button class="filter" type="button" data-filter="' + filter + '" aria-pressed="' + (filter === "all") + '">' + label + "</button>").join("\n"),
  '</div><span class="project-count" data-project-count aria-live="polite">' + featured.length + ' projects</span></div><div class="project-grid">',
  featured.map((project) => [
    '<article class="project-card accent-' + e(project.accent) + '" data-project data-category="' + e(project.category) + '">',
    '<a class="project-visual" href="./projects/' + e(project.slug) + '.html" aria-label="Read ' + e(project.title) + '"><img src="./' + e(project.image) + '" alt="' + e(project.imageAlt) + '" loading="lazy" decoding="async"></a>',
    '<div class="project-body"><p class="eyebrow">' + e(project.discipline) + '</p><h3><a href="./projects/' + e(project.slug) + '.html">' + e(project.title) + "</a></h3><p>" + e(project.summary) + "</p>",
    tags(project),
    '<div class="project-actions"><a class="text-link" href="./projects/' + e(project.slug) + '.html">Case study <span aria-hidden="true">&rarr;</span></a>' + externalLink(project.repository, "View code &nearr;") + "</div></div></article>"
  ].join("\n")).join("\n"),
  '</div><div class="pipeline"><div class="pipeline-heading"><h3>Next investigations</h3><p>Planned studies &middot; Results pending</p></div><ul class="pipeline-list">',
  planned.map((project, index) => '<li><a href="./projects/' + e(project.slug) + '.html"><span class="pipeline-number">' + String(index + 1).padStart(2, "0") + '</span><span class="pipeline-title">' + e(project.title) + '</span><span class="status">' + e(project.status) + '</span><span aria-hidden="true">&rarr;</span></a></li>').join("\n"),
  "</ul></div></div></section>",
  '<section class="section section-soft" id="experience" aria-labelledby="experience-title"><div class="container split-section">',
  '<div><p class="eyebrow">Professional experience</p><h2 id="experience-title">A background across industries.</h2><p class="intro">My professional experience spans engineering consulting, manufacturing, publishing, and supply-chain operations.</p></div><div class="experience-list">',
  content.experience.map((job) => '<article class="experience-item"><h3>' + e(job.company) + '</h3><div class="experience-meta"><span>' + e(job.role || job.sector) + "</span>" + (job.dates ? "<span>" + e(job.dates) + "</span>" : "") + "</div>" + (job.bullets.length ? "<ul>" + job.bullets.map((item) => "<li>" + e(item) + "</li>").join("") + "</ul>" : "") + "</article>").join("\n"),
  "</div></div></section>",
  '<section class="section" id="lab" aria-labelledby="lab-title"><div class="container split-section">',
  '<div><p class="eyebrow">Semiconductor / Lab experience</p><h2 id="lab-title">Rutgers Nanofabrication CORE Facility</h2><p class="intro">Nanofabrication facility training</p></div>',
  '<div><p class="lab-text">Training at the Rutgers Nanofabrication CORE Facility connects my manufacturing interests with semiconductor processes. My project work explores the quality, variation, and data questions that matter in that environment.</p>',
  '<div class="lab-focus" aria-label="Semiconductor engineering interests"><div><strong>Process variation</strong><p>Connecting process measurements to defects and yield.</p></div><div><strong>Quality systems</strong><p>Building a statistical view of stability and capability.</p></div><div><strong>Factory flow</strong><p>Investigating capacity, queueing, and WIP behavior.</p></div></div></div></div></section>',
  '<section class="section section-soft" id="skills" aria-labelledby="skills-title"><div class="container"><div class="section-heading"><div><p class="eyebrow">Methods &amp; tools</p><h2 id="skills-title">An engineering toolkit.</h2></div></div><div class="skills-grid">',
  content.skills.map((group) => '<div class="skill-group"><h3>' + e(group.title) + "</h3><ul>" + group.items.map((item) => "<li>" + e(item) + "</li>").join("") + "</ul></div>").join("\n"),
  "</div></div></section>",
  '<section class="section contact-section" id="contact" aria-labelledby="contact-title"><div class="container split-section">',
  '<div><p class="eyebrow">Get in touch</p><h2 id="contact-title">Let\'s talk engineering.</h2><p class="intro">For opportunities in industrial, manufacturing, process, quality, and semiconductor engineering.</p><a class="button button-primary" href="mailto:' + e(content.email) + '?subject=Engineering%20opportunity">Email me <span aria-hidden="true">&nearr;</span></a></div>',
  '<div><div class="contact-links"><a class="contact-link" href="mailto:' + e(content.email) + '"><span>Email</span><strong>' + e(content.email) + '</strong><span aria-hidden="true">&nearr;</span></a>',
  externalLink(content.linkedin, '<span>LinkedIn</span><strong>Connect on LinkedIn</strong><span aria-hidden="true">&nearr;</span>', "contact-link"),
  externalLink(content.github, '<span>GitHub</span><strong>Explore my repositories</strong><span aria-hidden="true">&nearr;</span>', "contact-link"),
  '</div><div class="copy-row"><button class="copy-email" type="button" data-copy-email="' + e(content.email) + '">Copy email</button><p class="copy-status" role="status" data-copy-status></p></div></div></div></section>',
  "</main>", footer("./")
].join("\n");
fs.writeFileSync(path.join(__dirname, "index.html"), page(content.name + " | Engineering Portfolio", "Industrial, manufacturing, process, and quality engineering portfolio by " + content.name + ". Semiconductor analysis, SPC, and operations optimization.", homepage, "", "./", '<link rel="preload" as="image" href="./assets/process-dashboard.png">'));
fs.mkdirSync(path.join(__dirname, "projects"), { recursive: true });
for (const project of content.projects) {
  const body = [
    header("../"), '<main id="main">',
    '<section class="case-hero accent-' + e(project.accent) + '" aria-labelledby="case-title"><div class="container">',
    '<nav class="breadcrumb" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../index.html#projects">Projects</a><span aria-hidden="true">/</span><span>Case study</span></nav>',
    '<p class="eyebrow">' + e(project.discipline) + '</p><h1 id="case-title">' + e(project.title) + '</h1><p class="case-lede">' + e(project.summary) + "</p>",
    '<div class="case-meta"><span class="case-status">' + e(project.status) + "</span>" + tags(project) + "</div></div></section>",
    '<div class="container case-grid"><article class="case-content" aria-label="Project case study">',
    project.image ? '<figure><img src="../' + e(project.image) + '" alt="' + e(project.imageAlt) + '" decoding="async"><figcaption>' + e(project.caption) + "</figcaption></figure>" : "",
    '<section aria-labelledby="problem-title"><h2 id="problem-title">The engineering problem</h2><p>' + e(project.problem) + "</p></section>",
    '<section aria-labelledby="approach-title"><h2 id="approach-title">The approach</h2><ol class="method-list">' + project.approach.map((step) => "<li><h3>" + e(step.title) + "</h3><p>" + e(step.body) + "</p></li>").join("") + "</ol></section>",
    '<section aria-labelledby="outcome-title"><h2 id="outcome-title">' + (project.featured ? "What the project delivers" : "Planned deliverables") + "</h2><p>" + e(project.outcome) + "</p></section>",
    '<section aria-labelledby="context-title"><h2 id="context-title">Data &amp; interpretation</h2><p>' + e(project.limitations) + "</p></section>",
    '<section aria-labelledby="next-title"><h2 id="next-title">The next engineering step</h2><p>' + e(project.next) + "</p></section>",
    '<div class="next-project"><a class="text-link" href="../index.html#projects">&larr; All projects</a><a class="text-link" href="mailto:' + e(content.email) + "?subject=" + encodeURIComponent("Discuss: " + project.title) + '">Discuss this project &rarr;</a></div></article>',
    '<aside class="case-aside" aria-labelledby="project-links-title"><h2 id="project-links-title">Project resources</h2>',
    externalLink(project.demo, "Open live dashboard &nearr;", "button button-primary"),
    externalLink(project.repository, e(project.repositoryLabel || "View repository") + " &nearr;", "button button-outline"),
    !project.repository && !project.demo ? "<p>Research scope defined. Results and code will follow as the study develops.</p>" : "",
    '<p class="evidence"><strong>Evidence status</strong>' + e(project.evidence) + "</p><p>By " + e(content.name) + "</p></aside></div></main>",
    footer("../")
  ].join("\n");
  fs.writeFileSync(path.join(__dirname, "projects", project.slug + ".html"), page(project.title + " | " + content.name, project.summary, body, "projects/" + project.slug + ".html", "../"));
}
const notFoundBody = header(baseUrl + "/") + '<main id="main" class="error-main"><div class="container"><p class="eyebrow">404 / Page not found</p><h1>Let\'s get you back to the work.</h1><p>The page you requested isn\'t here.</p><a class="button button-primary" href="' + e(baseUrl) + '/">Return to portfolio &rarr;</a></div></main>' + footer(baseUrl + "/");
fs.writeFileSync(path.join(__dirname, "404.html"), page("Page not found | " + content.name, "Return to the engineering portfolio.", notFoundBody, "404.html", baseUrl + "/", '<meta name="robots" content="noindex">'));
const locations = [baseUrl + "/", ...content.projects.map((project) => baseUrl + "/projects/" + project.slug + ".html")];
fs.writeFileSync(path.join(__dirname, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + locations.map((url) => "  <url><loc>" + e(url) + "</loc></url>").join("\n") + "\n</urlset>\n");
fs.writeFileSync(path.join(__dirname, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: " + baseUrl + "/sitemap.xml\n");
console.log("Built homepage, " + content.projects.length + " project pages, 404 page, and search metadata.");
console.log(resumeExists ? "Resume link enabled." : "Resume link will appear when a real resume.pdf is added.");
