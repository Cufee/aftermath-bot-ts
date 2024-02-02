import { backendUrl } from "$core/backend/constants.ts";
import { Response } from "$core/backend/types.d.ts";
import { tryCatch } from "$core/tryCatch.ts";

interface Account {
  nickname: string;
  account_id: number;
}

export function searchAccounts(
  name: string,
  realm: string,
) {
  return tryCatch<Account>(async () => {
    const response = await fetch(
      `${backendUrl}/accounts/search?realm=${realm}&search=${name}`,
    );
    const data = await response.json() as Response<Account>;
    if (!data.success) {
      return { ok: false, error: data.error.message || "Unknown error" };
    }

    return { ok: true, data: data.data };
  });
}
