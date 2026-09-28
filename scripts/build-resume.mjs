// Generates frontend/public/resume.html from content/resume.json (the resume is the source of truth).
// Usage: node scripts/build-resume.mjs          write the file
//        node scripts/build-resume.mjs --check  fail if the committed file is out of date (CI)
import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const resume = JSON.parse(await readFile(new URL("content/resume.json", root), "utf8"));
const head = await readFile(new URL("scripts/resume-head.html", root), "utf8");
const target = new URL("frontend/public/resume.html", root);

const escape = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const formatMonth = (value) => {
  const [year, month] = value.split("-").map(Number);
  return `${months[month - 1]} ${year}`;
};

const role = (job) => `    <section class="role">
      <div class="role-head"><h3>${escape(job.company)}</h3><span class="dates">${formatMonth(job.start)} - ${formatMonth(job.end)}</span></div>
      <div class="title">${escape(job.title)}</div>
      <ul>
${job.bullets.map((bullet) => `        <li>${escape(bullet)}</li>`).join("\n")}
      </ul>
    </section>`;

const education = resume.education
  .map((entry) => {
    const [degree, school] = entry.split(" — ");
    return `<strong>${escape(degree)}</strong> - ${escape(school)}`;
  })
  .join(" &nbsp; | &nbsp; ");

const html = `${head}<body>
  <div class="toolbar">
    <a href="/">← Portfolio</a>
    <button id="print-resume" type="button">Print / Save as PDF</button>
  </div>

  <main class="page">
    <header class="header">
      <h1>${escape(resume.name.toUpperCase())}</h1>
      <p class="headline">${escape(resume.headline)}</p>
      <div class="contact">
        ${escape(resume.location)} · ${escape(resume.email)} ·
        <a href="${resume.links.linkedin}" target="_blank" rel="noreferrer">LinkedIn</a> ·
        <a href="${resume.links.github}" target="_blank" rel="noreferrer">GitHub</a> ·
        <a href="${resume.links.portfolio.replace(/\/$/, "")}">Portfolio</a>
      </div>
    </header>

    <h2>Professional Summary</h2>
    <p class="summary">${escape(resume.summary)}</p>
    <div class="impact"><strong>Career Impact:</strong> ${resume.impact.map(escape).join(" · ")}</div>

    <h2>Core Expertise</h2>
    <div class="skills">
${Object.entries(resume.skills)
  .map(([group, items]) => `      <strong>${escape(group)}</strong><span>${escape(items.join(", "))}</span>`)
  .join("\n")}
    </div>

    <h2>Professional Experience</h2>

${resume.experience.map(role).join("\n\n")}

    <h2>Education</h2>
    <p class="education">${education}</p>
  </main>
</body>
</html>
`;

if (process.argv.includes("--check")) {
  const current = await readFile(target, "utf8");
  if (current !== html) {
    console.error("frontend/public/resume.html is out of date. Run: node scripts/build-resume.mjs");
    process.exit(1);
  }
  console.log("resume.html matches content/resume.json");
} else {
  await writeFile(target, html);
  console.log("wrote frontend/public/resume.html");
}
