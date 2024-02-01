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
    if (!res.ok) {
      return {
        ok: false,
        error: `Failed to render account stats image: ${await res.text()}`,
      };
    }
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
    if (!res.ok) {
      return {
        ok: false,
        error: `Failed to render user stats image: ${await res.text()}`,
      };
    }
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
    if (!res.ok) {
      return {
        ok: false,
        error: `Failed to get current background selection preview: ${await res
          .text()}`,
      };
    }

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
