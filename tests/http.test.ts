import test from "node:test";
import assert from "node:assert/strict";
import { readJson, sameOrigin } from "../src/lib/http.ts";

test("JSON requests are bounded even without a content-length header", async () => {
  const request = new Request("https://example.com/api/contact", {
    method: "POST",
    body: JSON.stringify({ body: "x".repeat(200) }),
  });
  await assert.rejects(() => readJson(request, 50), /Request too large/);
});
test("JSON parsing accepts bounded valid input and rejects malformed data", async () => {
  assert.deepEqual(
    await readJson(
      new Request("https://example.com", {
        method: "POST",
        body: '{"ok":true}',
      }),
    ),
    { ok: true },
  );
  await assert.rejects(() =>
    readJson(
      new Request("https://example.com", { method: "POST", body: "not JSON" }),
    ),
  );
});
test("mutation origin checks reject cross-origin browser requests", () => {
  assert.equal(
    sameOrigin(
      new Request("https://example.com/api/projects", {
        headers: { origin: "https://other.example" },
      }),
    ),
    false,
  );
  assert.equal(
    sameOrigin(
      new Request("https://example.com/api/projects", {
        headers: { origin: "https://example.com" },
      }),
    ),
    true,
  );
});
