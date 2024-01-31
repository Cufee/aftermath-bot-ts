export const database = await Deno.openKv(Deno.env.get("DENO_KV_URL"));
