import test from "node:test";
import assert from "node:assert/strict";
import {
  safeUrl,
  contactSchema,
  projectSchema,
  settingsSchema,
} from "../src/lib/validators.ts";
test("URLs reject executable and protocol-relative input", () => {
  for (const value of [
    "javascript:alert(1)",
    "//evil.test",
    "/\\evil.test",
    "http://insecure.test",
    "https://user:pass@example.com",
  ])
    assert.equal(safeUrl.safeParse(value).success, false, value);
  for (const value of ["/images/orbit.svg", "https://example.com/a.webp"])
    assert.equal(safeUrl.safeParse(value).success, true, value);
});
test("contact validates meaningful content and preserves honeypot for service rejection", () => {
  const valid = {
    name: "Pranav",
    email: "test@example.com",
    projectType: "DEV",
    body: "I would like to discuss a project.",
  };
  assert.equal(contactSchema.safeParse(valid).success, true);
  assert.equal(
    contactSchema.safeParse({ ...valid, body: "short" }).success,
    false,
  );
  assert.equal(
    contactSchema.safeParse({ ...valid, projectType: "BOGUS" }).success,
    false,
  );
  assert.equal(
    contactSchema.parse({ ...valid, website: "bot.example" }).website,
    "bot.example",
  );
});
test("projects default to drafts and reject unsafe slugs and media", () => {
  const valid = {
    title: "Example",
    slug: "example",
    summary: "A real example",
    type: "DEV",
    year: 2026,
    role: "Developer",
    coverUrl: "/images/orbit.svg",
    overview: "A meaningful overview.",
    tools: ["React"],
  };
  assert.equal(projectSchema.parse(valid).published, false);
  assert.equal(
    projectSchema.safeParse({ ...valid, slug: "../../admin" }).success,
    false,
  );
  assert.equal(
    projectSchema.safeParse({
      ...valid,
      media: [{ url: "javascript:bad", kind: "image" }],
    }).success,
    false,
  );
});
test("settings reject unsafe links", () => {
  assert.equal(
    settingsSchema.safeParse({
      title: "Portfolio",
      bio: "A useful biography",
      email: "",
      github: "javascript:bad",
    }).success,
    false,
  );
});

test("existing nullable project fields remain editable", () => {
  const parsed = projectSchema.safeParse({
    title: "Existing project",
    slug: "existing-project",
    summary: "An existing project",
    type: "DEV",
    year: 2026,
    role: "Developer",
    coverUrl: "/images/orbit.svg",
    overview: "A meaningful overview.",
    tools: [],
    modelUrl: null,
    liveUrl: null,
    repoUrl: null,
    problem: null,
    process: null,
    result: null,
    media: [{ url: "/images/orbit.svg", kind: "image", caption: null }],
  });
  assert.equal(parsed.success, true);
});
