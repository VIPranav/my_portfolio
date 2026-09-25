import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const prismaRequire = createRequire(require.resolve("@prisma/config"));
const { deepmerge } = prismaRequire("deepmerge-ts") as {
  deepmerge: (...values: unknown[]) => unknown;
};
test("Prisma's patched merge retains nested configuration behavior", () => {
  assert.deepEqual(
    deepmerge(
      { schema: "a", migrations: { path: "one" } },
      { migrations: { seed: "node seed.ts" } },
    ),
    { schema: "a", migrations: { path: "one", seed: "node seed.ts" } },
  );
});
test("Prisma's patched merge handles cyclic input without stack exhaustion", () => {
  const a: { self?: unknown } = {};
  const b: { self?: unknown } = {};
  a.self = a;
  b.self = b;
  assert.doesNotThrow(() => deepmerge(a, b));
});
