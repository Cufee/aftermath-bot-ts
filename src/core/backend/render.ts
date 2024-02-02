import { Response } from "./types.d.ts";
import { backendUrl } from "./constants.ts";
import { decodeBase64 } from "std/encoding/base64.ts";
import { Buffer } from "buffer";
import { tryCatch } from "$core/tryCatch.ts";

export function renderAccountStatsImage(
  accountId: number,
) {
  return tryCatch<Buffer>(async () => {
    const res = await fetch(
      `${backendUrl}/render/session/account/${accountId}`,
    );
    const data = await res.json() as Response<string>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    const file = Buffer.from(decodeBase64(data.data));
    return { ok: true, data: file };
  });
}

export function renderUserStatsImage(
  userId: string,
) {
  return tryCatch<Buffer>(async () => {
    const res = await fetch(`${backendUrl}/render/session/user/${userId}`);
    const data = await res.json() as Response<string>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    const file = Buffer.from(decodeBase64(data.data));
    return { ok: true, data: file };
  });
}

export function getAvailableBackgroundPresets(userId: string) {
  return tryCatch<{ image: Buffer; options: string[] }>(async () => {
    const res = await fetch(`${backendUrl}/users/${userId}/content/select`);
    const data = await res.json() as Response<
      { image: string; options: string[] }
    >;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    const file = Buffer.from(decodeBase64(data.data.image));
    return { ok: true, data: { image: file, options: data.data.options } };
  });
}
