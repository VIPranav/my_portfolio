"use client";
import { useState } from "react";
import type { Message } from "@prisma/client";
import { messageCommand } from "@/actions/admin";
import ActionForm from "./ActionForm";
export default function MessageList({ messages }: { messages: Message[] }) {
  const [error, setError] = useState("");
  return (
    <>
      {error && (
        <p role="alert" className="field-error">
          {error}
        </p>
      )}
      {messages.map((m) => (
        <details
          className="glass-card message-card"
          id={m.id}
          key={m.id}
          onToggle={async (e) => {
            if (e.currentTarget.open && m.status === "NEW") {
              const f = new FormData();
              f.set("id", m.id);
              f.set("status", "READ");
              const r = await messageCommand(f);
              if (!r.ok) setError(r.error || "Could not mark read.");
            }
          }}
        >
          <summary>
            <strong>{m.name}</strong> · {m.projectType}{" "}
            <span className="small muted">
              {m.status} ·{" "}
              {new Date(m.createdAt).toLocaleDateString("en-GB", {
                timeZone: "UTC",
              })}
            </span>
          </summary>
          <p>
            <a className="text-link" href={`mailto:${m.email}`}>
              {m.email}
            </a>
          </p>
          {m.budget && <p>Budget: {m.budget}</p>}
          <p>{m.body}</p>
          <ActionForm action={messageCommand}>
            <input type="hidden" name="id" value={m.id} />
            <input
              type="hidden"
              name="status"
              value={m.status === "ARCHIVED" ? "READ" : "ARCHIVED"}
            />
            <button className="button button-secondary">
              {m.status === "ARCHIVED" ? "Restore" : "Archive"}
            </button>
          </ActionForm>
        </details>
      ))}
    </>
  );
}
