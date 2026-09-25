import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import MessageList from "@/components/admin/MessageList";
export default async function Messages({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  const { status } = await searchParams;
  const archived = status === "ARCHIVED";
  const messages = await prisma.message.findMany({
    where: { status: archived ? "ARCHIVED" : { not: "ARCHIVED" } },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return (
    <>
      <h1>Messages</h1>
      <nav className="filter-pills" aria-label="Message folders">
        <Link href="/admin/messages" className={!archived ? "active" : ""}>
          Inbox
        </Link>
        <Link
          href="/admin/messages?status=ARCHIVED"
          className={archived ? "active" : ""}
        >
          Archived
        </Link>
      </nav>
      <p className="small muted">
        Showing the latest 200 messages in this folder.
      </p>
      <MessageList messages={messages} />
      {!messages.length && <p className="empty-state">No messages here.</p>}
    </>
  );
}
