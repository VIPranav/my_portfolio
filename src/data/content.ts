export const projectTypes = [
  "DEV",
  "UIUX",
  "GRAPHIC",
  "VIDEO",
  "THREED",
] as const;
export const typeLabels = {
  DEV: "Dev",
  UIUX: "UI/UX",
  GRAPHIC: "Graphic",
  VIDEO: "Video",
  THREED: "3D",
};
export const sampleProjects = [
  {
    id: "sample-orbit",
    slug: "orbit-workspace",
    title: "Orbit",
    summary: "A calmer place to get things done.",
    type: "DEV" as const,
    year: 2026,
    role: "Design & development",
    coverUrl: "/images/orbit.svg",
    tools: ["Next.js", "TypeScript", "Prisma"],
    overview:
      "[SAMPLE PROJECT] A conceptual workspace for bringing everyday tasks into one clear interface. Replace this example with your own project.",
    problem:
      "[PLACEHOLDER] Describe the real challenge and who experienced it.",
    process:
      "[PLACEHOLDER] Explain the decisions, prototypes, and implementation.",
    result:
      "[PLACEHOLDER] Describe what you shipped and what you learned. Add verified outcomes only.",
  },
  {
    id: "sample-form",
    slug: "form-identity",
    title: "Form & Field",
    summary: "An identity with room to breathe.",
    type: "GRAPHIC" as const,
    year: 2026,
    role: "Visual identity",
    coverUrl: "/images/form.svg",
    tools: ["Photoshop", "Canva"],
    overview:
      "[SAMPLE PROJECT] An independent visual identity concept exploring type, composition, and a restrained palette. Not a client commission.",
    problem: "[PLACEHOLDER] Add your design brief.",
    process:
      "[PLACEHOLDER] Share sketches and the reasoning behind your visual choices.",
    result: "[PLACEHOLDER] Add the final deliverables and lessons.",
  },
  {
    id: "sample-luma",
    slug: "luma-interface",
    title: "Luma",
    summary: "Less friction. More focus.",
    type: "UIUX" as const,
    year: 2026,
    role: "Interface design",
    coverUrl: "/images/luma.svg",
    tools: ["Figma", "React", "Tailwind CSS"],
    overview:
      "[SAMPLE PROJECT] An interface study in hierarchy, accessible controls, and focused interactions. Replace it with a real case study.",
    problem: "[PLACEHOLDER] Describe the user need.",
    process: "[PLACEHOLDER] Add research, flows, and iterations.",
    result:
      "[PLACEHOLDER] Explain the final experience without invented metrics.",
  },
];
export const skillGroups = [
  {
    name: "Design",
    skills: [
      ["Photoshop", "PROFICIENT"],
      ["Canva", "PROFICIENT"],
      ["Figma", "FOUNDATIONAL"],
      ["Illustrator", "FOUNDATIONAL"],
      ["Lightroom", "FOUNDATIONAL"],
    ],
  },
  {
    name: "Development",
    skills: [
      ["TypeScript", "PRACTICAL"],
      ["React", "PRACTICAL"],
      ["Next.js", "PRACTICAL"],
      ["Tailwind CSS", "PRACTICAL"],
      ["Git", "PRACTICAL"],
      ["Python", "FOUNDATIONAL"],
      ["JavaScript", "FOUNDATIONAL"],
      ["Java", "FOUNDATIONAL"],
      ["HTML", "FOUNDATIONAL"],
      ["CSS", "FOUNDATIONAL"],
    ],
  },
  {
    name: "Video & 3D",
    skills: [
      ["Premiere Pro", "PROFICIENT"],
      ["Autodesk Maya", "FOUNDATIONAL"],
    ],
  },
  { name: "AI Workflow", skills: [["AI-assisted development", "PRACTICAL"]] },
] as const;
export const milestones = [
  {
    year: "Age 16",
    title: "An eye for design.",
    description:
      "School magazines, pamphlets, and posters were my first canvas. I learned to make information feel clear and considered.",
  },
  {
    year: "Exploring",
    title: "Beyond the static frame.",
    description:
      "I expanded into editing video and exploring 3D, learning how pacing, depth, and composition shape a story.",
  },
  {
    year: "Learning",
    title: "Curiosity became code.",
    description:
      "Python, JavaScript, Java, HTML, and CSS gave me a foundation for understanding how digital experiences work.",
  },
  {
    year: "Building",
    title: "Connecting the pieces.",
    description:
      "React, Next.js, APIs, and databases helped me connect interfaces to working products, supported by Git and Linux workflows.",
  },
  {
    year: "Now",
    title: "Design that ships.",
    description:
      "I combine design, development, and AI-assisted workflows to turn an idea into a polished, working digital product.",
  },
];
