"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProjectWithMedia } from "@/lib/content";
import { projectTypes, typeLabels } from "@/data/content";
import { saveProjectAction } from "@/actions/projects";
import { slugify } from "@/lib/utils";
import Link from "next/link";
type Media = {
  url: string;
  kind: "image" | "video";
  caption: string;
  order: number;
};
export default function ProjectForm({
  project,
}: {
  project?: ProjectWithMedia;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [slug, setSlug] = useState(project?.slug || "");
  const [slugEdited, setSlugEdited] = useState(Boolean(project));
  const [cover, setCover] = useState(project?.coverUrl || "");
  const [uploading, setUploading] = useState(false);
  const [media, setMedia] = useState<Media[]>(
    project?.media.map((m) => ({
      url: m.url,
      kind: m.kind === "video" ? "video" : "image",
      caption: m.caption || "",
      order: m.order,
    })) || [],
  );
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: form,
      });
      const data = await response.json();
      if (!response.ok || typeof data.url !== "string")
        throw new Error(data.error || "Upload failed");
      setCover(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }
  function submit(form: FormData) {
    setError("");
    const input = {
      title: form.get("title"),
      slug,
      summary: form.get("summary"),
      type: form.get("type"),
      year: Number(form.get("year")),
      role: form.get("role"),
      coverUrl: cover,
      modelUrl: form.get("modelUrl") || "",
      liveUrl: form.get("liveUrl") || "",
      repoUrl: form.get("repoUrl") || "",
      overview: form.get("overview"),
      problem: form.get("problem") || "",
      process: form.get("process") || "",
      result: form.get("result") || "",
      tools: String(form.get("tools") || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      featured: form.get("featured") === "on",
      published: form.get("published") === "on",
      order: Number(form.get("order") || 0),
      media: media.map((m, i) => ({ ...m, order: i })),
    };
    start(async () => {
      const result = await saveProjectAction(input, project?.id);
      if (result.ok) {
        router.push("/admin/projects");
        router.refresh();
      } else setError(result.error || "Could not save.");
    });
  }
  return (
    <form action={submit} className="editor">
      <div className="glass-card">
        <div className="form-grid">
          <label>
            Title
            <input
              name="title"
              required
              maxLength={120}
              defaultValue={project?.title}
              onChange={(e) => {
                if (!slugEdited) setSlug(slugify(e.target.value));
              }}
            />
          </label>
          <label>
            Slug
            <input
              name="slug"
              required
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              value={slug}
              maxLength={120}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(e.target.value);
              }}
            />
          </label>
        </div>
        <label>
          Summary
          <textarea
            name="summary"
            required
            maxLength={300}
            defaultValue={project?.summary}
          />
        </label>
        <div className="form-grid">
          <label>
            Discipline
            <select name="type" defaultValue={project?.type || "DEV"}>
              {projectTypes.map((t) => (
                <option value={t} key={t}>
                  {typeLabels[t]}
                </option>
              ))}
            </select>
          </label>
          <label>
            Year
            <input
              type="number"
              name="year"
              required
              min={2000}
              max={2100}
              defaultValue={project?.year || new Date().getFullYear()}
            />
          </label>
        </div>
        <label>
          Your role
          <input
            name="role"
            required
            maxLength={120}
            defaultValue={project?.role}
          />
        </label>
        <label>
          Tools <span className="muted">Separate with commas</span>
          <input name="tools" defaultValue={project?.tools.join(", ")} />
        </label>
        <label>
          Cover image URL
          <input
            value={cover}
            onChange={(e) => setCover(e.target.value)}
            required
            placeholder="/images/example.webp or https://…"
          />
        </label>
        <label>
          Or upload a cover (JPEG, PNG, WebP; up to 5 MB)
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            disabled={uploading}
            onChange={(e) => void upload(e.target.files?.[0])}
          />
        </label>
        {uploading && <p role="status">Uploading…</p>}
      </div>
      <div className="glass-card">
        <h2>The story</h2>
        {["overview", "problem", "process", "result"].map((key) => (
          <label key={key}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
            <textarea
              name={key}
              required={key === "overview"}
              minLength={key === "overview" ? 10 : undefined}
              maxLength={20000}
              defaultValue={project?.[key as "overview"] || ""}
            />
          </label>
        ))}
      </div>
      <div className="glass-card">
        <h2>Media & links</h2>
        {["liveUrl", "repoUrl", "modelUrl"].map((key, i) => (
          <label key={key}>
            {
              [
                "Live project URL",
                "Repository URL",
                "GLB model URL (optional)",
              ][i]
            }
            <input
              name={key}
              defaultValue={project?.[key as "liveUrl"] || ""}
            />
          </label>
        ))}
        {media.map((m, i) => (
          <div className="media-editor" key={i}>
            <label>
              Media URL
              <input
                value={m.url}
                required
                onChange={(e) =>
                  setMedia(
                    media.map((item, n) =>
                      n === i ? { ...item, url: e.target.value } : item,
                    ),
                  )
                }
              />
            </label>
            <label>
              Kind
              <select
                value={m.kind}
                onChange={(e) =>
                  setMedia(
                    media.map((item, n) =>
                      n === i
                        ? { ...item, kind: e.target.value as "image" | "video" }
                        : item,
                    ),
                  )
                }
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </label>
            <label>
              Caption / image description
              <input
                value={m.caption}
                maxLength={300}
                onChange={(e) =>
                  setMedia(
                    media.map((item, n) =>
                      n === i ? { ...item, caption: e.target.value } : item,
                    ),
                  )
                }
              />
            </label>
            <button
              type="button"
              className="text-button danger"
              onClick={() => setMedia(media.filter((_, n) => n !== i))}
            >
              Remove media
            </button>
          </div>
        ))}
        <button
          className="button button-secondary"
          type="button"
          disabled={media.length >= 30}
          onClick={() =>
            setMedia([
              ...media,
              { url: "", kind: "image", caption: "", order: media.length },
            ])
          }
        >
          Add media +
        </button>
      </div>
      <div className="glass-card">
        <label>
          Sort order
          <input
            name="order"
            type="number"
            min={0}
            max={10000}
            defaultValue={project?.order || 0}
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured}
          />
          Featured on home
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="published"
            defaultChecked={project?.published}
          />
          Published (unchecked saves a draft)
        </label>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="button-row">
          <button className="button" disabled={pending || uploading}>
            {pending ? "Saving…" : "Save project"}
          </button>
          <Link className="button button-secondary" href="/admin/projects">
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
