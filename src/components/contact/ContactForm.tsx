"use client";
import { useActionState } from "react";
import { sendMessage } from "@/actions/contact";
import { projectTypes, typeLabels } from "@/data/content";
export default function ContactForm() {
  const [state, action, pending] = useActionState(sendMessage, { ok: false });
  if (state.ok)
    return (
      <div className="glass-card success-state" role="status">
        <span>✓</span>
        <h2>Message received.</h2>
        <p>Thanks, I’ll reply within 48 hours.</p>
      </div>
    );
  return (
    <form action={action} className="glass-card contact-form">
      <div className="form-grid">
        {[
          ["name", "Your name", "text"],
          ["email", "Email address", "email"],
        ].map(([name, label, type]) => (
          <label key={name}>
            {label}
            <input
              name={name}
              type={type}
              required
              minLength={name === "name" ? 2 : undefined}
              maxLength={name === "name" ? 80 : 254}
              autoComplete={name}
              aria-invalid={Boolean(state.fields?.[name])}
              aria-describedby={
                state.fields?.[name] ? `${name}-error` : undefined
              }
            />
            {state.fields?.[name] && (
              <span id={`${name}-error`} className="field-error">
                {state.fields[name]?.[0]}
              </span>
            )}
          </label>
        ))}
      </div>
      <div className="form-grid">
        <label>
          What are we making?
          <select name="projectType" required defaultValue="">
            <option value="" disabled>
              Select a discipline
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {typeLabels[type]}
              </option>
            ))}
          </select>
          {state.fields?.projectType && (
            <span className="field-error">Choose a discipline.</span>
          )}
        </label>
        <label>
          Budget <span className="muted">(optional)</span>
          <input
            name="budget"
            placeholder="A range, or let’s discuss"
            maxLength={100}
          />
        </label>
      </div>
      <label>
        A little about your idea
        <textarea
          name="body"
          rows={5}
          minLength={10}
          maxLength={2000}
          required
          placeholder="The idea, the challenge, and what you have in mind."
          aria-invalid={Boolean(state.fields?.body)}
          aria-describedby={state.fields?.body ? "body-error" : undefined}
        />
        {state.fields?.body && (
          <span id="body-error" className="field-error">
            {state.fields.body[0]}
          </span>
        )}
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.error && (
        <p role="alert" className="field-error">
          {state.error}
        </p>
      )}
      <button className="button" disabled={pending}>
        {pending ? "Sending…" : "Send message ↗"}
      </button>
      <p className="small muted">
        Your details are used only to reply to your inquiry.
      </p>
    </form>
  );
}
