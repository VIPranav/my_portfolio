import { requireAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/content";
import { saveSettings } from "@/actions/admin";
import ActionForm from "@/components/admin/ActionForm";
export default async function Settings() {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <>
      <h1>Site settings</h1>
      <ActionForm action={saveSettings} className="glass-card editor">
        {Object.entries(settings).map(([key, value]) => (
          <label key={key}>
            {
              (
                {
                  title: "Site title",
                  bio: "Bio",
                  email: "Public email",
                  github: "GitHub URL",
                  linkedin: "LinkedIn URL",
                  instagram: "Instagram URL",
                  resumeUrl: "Résumé PDF URL",
                } as Record<string, string>
              )[key]
            }
            {key === "bio" ? (
              <textarea
                name={key}
                defaultValue={value}
                required
                minLength={10}
                maxLength={2000}
              />
            ) : (
              <input
                name={key}
                defaultValue={value}
                type={key === "email" ? "email" : "text"}
                required={key === "title"}
                maxLength={key === "title" ? 120 : 2048}
              />
            )}
          </label>
        ))}
        <button className="button">Save settings</button>
      </ActionForm>
    </>
  );
}
