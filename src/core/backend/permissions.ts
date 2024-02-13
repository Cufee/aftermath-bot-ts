import { backendUrl } from "./constants.ts";
import { Response } from "./types.d.ts";
import { tryCatch } from "$core/tryCatch.ts";

let permissionsCache = new Map<string, number>();
let lastCacheUpdate = 0;

await getPermissions();
Deno.cron("update permissions", "0 * * * *", () => {
  console.debug("Updating permissions cache");
  getPermissions();
});

export function getPermissions() {
  return tryCatch<Map<string, number>>(async () => {
    if (Date.now() - lastCacheUpdate < 1000 * 60 * 5) {
      return { ok: true, data: permissionsCache };
    }

    lastCacheUpdate = Date.now();
    const res = await fetch(`${backendUrl}/moderation/permissions`);
    const data = await res.json() as Response<Record<string, number>>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    permissionsCache = new Map(Object.entries(data.data));
    return { ok: true, data: permissionsCache };
  });
}

export function getPermission(name: string): number {
  const perm = permissionsCache.get(name);
  if (!perm) {
    return -1;
  }
  return perm;
}
