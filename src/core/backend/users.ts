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

export function getUserVerificationLink(userId: string, realm: string) {
  return tryCatch<string>(async () => {
    const res = await fetch(
      `${backendUrl}/connections/wargaming/verify/${userId}?realm=${realm}`,
    );
    if (!res.ok) {
      return {
        ok: false,
        error: `Failed to get user verification link: ${await res.text()}`,
      };
    }

    const data = await res.json() as Response<string>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    return { ok: true, data: data.data };
  });
}

export function uploadCustomUserBackground(userId: string, link: string) {
  return tryCatch<null>(async () => {
    const res = await fetch(
      `${backendUrl}/users/${userId}/content`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: link }),
      },
    );
    if (!res.ok) {
      return {
        ok: false,
        error: `Failed to upload custom background: ${await res.text()}`,
      };
    }

    const data = await res.json() as Response<null>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    return { ok: true, data: null };
  });
}

export function selectAvailableBackgroundPreset(userId: string, index: number) {
  return tryCatch<null>(async () => {
    const res = await fetch(
      `${backendUrl}/users/${userId}/content/select/${index}`,
      { method: "POST" },
    );
    if (!res.ok) {
      return {
        ok: false,
        error: `Failed to select background preset: ${await res.text()}`,
      };
    }

    const data = await res.json() as Response<null>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    return { ok: true, data: null };
  });
}
