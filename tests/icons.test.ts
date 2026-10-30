import { describe, expect, test } from "bun:test";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".tsx") || p.endsWith(".ts") ? [p] : [];
  });
}

const registrySrc = readFileSync("components/Icon.tsx", "utf8");
const registryBody = registrySrc.split("registry: Record<string, IconData> = {")[1]?.split("};")[0] ?? "";
const registered = new Set([...registryBody.matchAll(/\b(\w+Solid)\b/g)].map((m) => m[1]));

const used = new Set<string>();
for (const dir of ["app", "components", "lib"]) {
  for (const f of walk(dir)) {
    if (f.endsWith("Icon.tsx")) continue;
    const src = readFileSync(f, "utf8");
    for (const m of src.matchAll(/["'`](\w+Solid)["'`]/g)) used.add(m[1]);
  }
}

describe("icon registry coverage", () => {
  test("every Solid icon string used resolves in the registry", () => {
    const missing = [...used].filter((n) => !registered.has(n));
    expect(missing).toEqual([]);
  });
});
