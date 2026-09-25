import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { projectCommand } from "@/actions/projects";
import ActionForm from "@/components/admin/ActionForm";
export default async function Projects() {
  await requireAdmin();
  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return (
    <>
      <div className="section-heading">
        <h1>Projects</h1>
        <Link className="button" href="/admin/projects/new">
          New project +
        </Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Status</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id}>
                <td>
                  <Link className="text-link" href={`/admin/projects/${p.id}`}>
                    {p.title}
                  </Link>
                  <p className="small muted">
                    {p.type} · {p.year}
                  </p>
                </td>
                <td>
                  {p.published ? "Published" : "Draft"}
                  {p.featured ? " · Featured" : ""}
                </td>
                <td>
                  <ActionForm action={projectCommand} className="inline-form">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="command" value="order" />
                    <label className="small">
                      Position
                      <input
                        name="order"
                        type="number"
                        min={0}
                        max={10000}
                        defaultValue={p.order}
                      />
                    </label>
                    <button className="text-button">Save order</button>
                  </ActionForm>
                </td>
                <td>
                  <Link
                    className="text-button"
                    href={`/work/${p.slug}?preview=1`}
                  >
                    Preview
                  </Link>
                  <ActionForm action={projectCommand} className="inline-form">
                    <input type="hidden" name="id" value={p.id} />
                    <input
                      type="hidden"
                      name="command"
                      value={p.published ? "unpublish" : "publish"}
                    />
                    <button className="text-button">
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                  </ActionForm>
                  <ActionForm
                    action={projectCommand}
                    className="inline-form"
                    confirmMessage={`Delete “${p.title}” permanently?`}
                  >
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="command" value="delete" />
                    <button className="text-button danger">Delete</button>
                  </ActionForm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!projects.length && (
          <p className="empty-state">
            No projects yet. Create your first draft.
          </p>
        )}
      </div>
    </>
  );
}
