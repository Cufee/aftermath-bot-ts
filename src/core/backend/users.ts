import { backendUrl } from "$core/backend/constants.ts";
import { Response } from "./types.d.ts";
import { UserData } from "./user.ts";
import { tryCatch } from "$core/tryCatch.ts";

export function getUserById(userId: string) {
  return tryCatch<UserData>(async () => {
    const res = await fetch(`${backendUrl}/users/${userId}`);
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
    const data = await res.json() as Response<null>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    return { ok: true, data: null };
  });
}
