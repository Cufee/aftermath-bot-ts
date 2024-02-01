import { mustGetEnv } from "$core/env.ts";

export const backendUrl = mustGetEnv("CORE_SERVICE_URL");
export const frontendUrl = mustGetEnv("FRONTEND_URL");
