import { EventContext } from "$logic/discord/context.ts";

export function match(id: string): boolean {
  return !!id && id.startsWith("fancy_background_select_");
}

export const handler = async (ctx: EventContext) => {
  await ctx.reply("Not implemented");
};
