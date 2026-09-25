import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { skillCommand } from "@/actions/skills";
import ActionForm from "@/components/admin/ActionForm";
export default async function AdminSkills() {
  await requireAdmin();
  const categories = await prisma.skillCategory.findMany({
    orderBy: { order: "asc" },
    include: { skills: { orderBy: { order: "asc" } } },
  });
  return (
    <>
      <h1>Skills & categories</h1>
      <ActionForm action={skillCommand} className="glass-card">
        <input type="hidden" name="command" value="save-category" />
        <h2>Add category</h2>
        <div className="form-grid">
          <label>
            Name
            <input name="name" required minLength={2} maxLength={80} />
          </label>
          <label>
            Order
            <input
              name="order"
              type="number"
              min={0}
              max={1000}
              defaultValue={0}
            />
          </label>
        </div>
        <button className="button">Add category</button>
      </ActionForm>
      {categories.map((c) => (
        <section className="section" key={c.id}>
          <ActionForm action={skillCommand}>
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="command" value="save-category" />
            <div className="form-grid">
              <label>
                Category name
                <input name="name" defaultValue={c.name} required />
              </label>
              <label>
                Order
                <input
                  name="order"
                  type="number"
                  min={0}
                  max={1000}
                  defaultValue={c.order}
                />
              </label>
            </div>
            <button className="text-button">Save category</button>
          </ActionForm>
          <ActionForm
            action={skillCommand}
            confirmMessage={`Delete the empty category “${c.name}”?`}
          >
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="command" value="delete-category" />
            <button className="text-button danger">
              Delete empty category
            </button>
          </ActionForm>
          {[
            ...c.skills,
            {
              id: "",
              name: "",
              level: "FOUNDATIONAL",
              order: c.skills.length,
              categoryId: c.id,
            },
          ].map((s, i) => (
            <div
              className="glass-card"
              style={{ marginTop: 16 }}
              key={s.id || `new-${i}`}
            >
              <ActionForm action={skillCommand}>
                <input type="hidden" name="command" value="save-skill" />
                <input type="hidden" name="id" value={s.id} />
                <div className="form-grid">
                  <label>
                    {s.id ? "Skill" : "New skill"}
                    <input
                      name="name"
                      defaultValue={s.name}
                      minLength={2}
                      maxLength={80}
                      required
                    />
                  </label>
                  <label>
                    Level
                    <select name="level" defaultValue={s.level}>
                      {["FOUNDATIONAL", "PRACTICAL", "PROFICIENT"].map(
                        (level) => (
                          <option key={level}>{level}</option>
                        ),
                      )}
                    </select>
                  </label>
                  <label>
                    Category
                    <select name="categoryId" defaultValue={s.categoryId}>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Order
                    <input
                      name="order"
                      type="number"
                      min={0}
                      max={1000}
                      defaultValue={s.order}
                    />
                  </label>
                </div>
                <button className="button button-secondary">
                  {s.id ? "Save skill" : "Add skill"}
                </button>
              </ActionForm>
              {s.id && (
                <ActionForm
                  action={skillCommand}
                  confirmMessage={`Delete “${s.name}”?`}
                >
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="command" value="delete-skill" />
                  <button className="text-button danger">Delete skill</button>
                </ActionForm>
              )}
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
