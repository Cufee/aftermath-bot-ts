import { backendUrl } from "$core/backend/constants.ts";
import { Response } from "./types.d.ts";
import { UserData } from "./user.ts";
import { tryCatch } from "$core/tryCatch.ts";

export function getUserById(userId: string) {
  return tryCatch<UserData>(async () => {
    const res = await fetch(`${backendUrl}/users/${userId}`);
    if (!res.ok) {
      return { ok: false, error: `Failed to find user: ${await res.text()}` };
    }
    const data = await res.json() as Response<UserData>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }
    return { ok: true, data: data.data };
  });
}

export function updateUserWargamingConnection(
  userId: string,
  accountId: number,
) {
  return tryCatch<null>(async () => {
    const res = await fetch(
      `${backendUrl}/users/${userId}/connections/wargaming/${accountId}`,
      { method: "POST" },
    );
    if (!res.ok) {
      return {
        ok: false,
        error: `Failed to update user wargaming connection: ${await res
          .text()}`,
      };
    }

    const data = await res.json() as Response<null>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    return { ok: true, data: null };
  });
}
