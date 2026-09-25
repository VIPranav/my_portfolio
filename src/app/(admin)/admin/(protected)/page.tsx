import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
export default async function Dashboard() {
  await requireAdmin();
  const [projects, drafts, unread, messages] = await Promise.all([
    prisma.project.count({ where: { published: true } }),
    prisma.project.count({ where: { published: false } }),
    prisma.message.count({ where: { status: "NEW" } }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return (
    <>
      <p className="eyebrow">CONTENT STUDIO</p>
      <h1>Make room for your next idea.</h1>
      <Link className="button" href="/admin/projects/new">
        New project +
      </Link>
      <div className="admin-stats">
        {[
          ["Published projects", projects],
          ["Drafts", drafts],
          ["Unread messages", unread],
        ].map(([label, count]) => (
          <div className="glass-card" key={label}>
            <strong>{count}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>
      <h2>Latest messages</h2>
      {messages.length ? (
        messages.map((m) => (
          <p key={m.id}>
            <Link className="text-link" href={`/admin/messages#${m.id}`}>
              {m.name} · {m.projectType}
            </Link>{" "}
            <span className="small muted">{formatDate(m.createdAt)}</span>
          </p>
        ))
      ) : (
        <p className="muted">Your inbox is clear.</p>
      )}
    </>
  );
}
