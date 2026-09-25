import { writeFileSync } from "node:fs";
// A small, dependency-free PDF using built-in Helvetica fonts. Replace via Settings when ready.
const lines = [
  ["Pranav VP", 30],
  ["Design & development", 14],
  ["", 12],
  ["PROFILE", 11],
  ["Combining design and development to turn ideas into polished, working", 11],
  ["digital products. A creative foundation that started at age 16.", 11],
  ["", 12],
  ["EXPERIENCE & APPROACH", 11],
  [
    "Graphic design: school magazines, pamphlets, posters, and visual materials.",
    11,
  ],
  [
    "Responsive interfaces, dashboards, API integration, and database-driven apps.",
    11,
  ],
  [
    "AI-assisted workflows across backends, authentication, databases, and app logic.",
    11,
  ],
  ["Linux development environments and Git workflows.", 11],
  ["", 12],
  ["TOOLKIT", 11],
  ["Proficient: Adobe Photoshop, Adobe Premiere Pro, Canva.", 11],
  [
    "Practical: TypeScript, React, Next.js, Tailwind CSS, Git, AI-assisted development.",
    11,
  ],
  ["Foundational: Figma, Illustrator, Lightroom, Autodesk Maya, Python,", 11],
  ["JavaScript, Java, HTML, CSS.", 11],
  ["", 12],
  ["EDUCATION & PROJECTS", 11],
  ["[PLACEHOLDER - add verified education, dates, and selected projects.]", 11],
  ["", 12],
  ["CONTACT", 11],
  ["[PLACEHOLDER - add email and social links.]", 11],
];
const escape = (value) =>
  value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
let y = 780;
const stream = lines
  .map(([text, size]) => {
    const command = `BT /F1 ${size} Tf 0.12 0.12 0.14 rg 50 ${y} Td (${escape(text)}) Tj ET`;
    y -= size === 30 ? 42 : 23;
    return command;
  })
  .join("\n");
const objects = [
  "<< /Type /Catalog /Pages 2 0 R >>",
  "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
  "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
  "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  `<< /Length ${Buffer.byteLength(stream)} >>\nstream\n${stream}\nendstream`,
];
let pdf = "%PDF-1.4\n";
const offsets = [0];
objects.forEach((object, i) => {
  offsets.push(Buffer.byteLength(pdf));
  pdf += `${i + 1} 0 obj\n${object}\nendobj\n`;
});
const xref = Buffer.byteLength(pdf);
pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
for (const offset of offsets.slice(1))
  pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
writeFileSync("public/resume.pdf", pdf);
