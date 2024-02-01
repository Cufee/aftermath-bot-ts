import { EventContext } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";

export function match(id: string): boolean {
  return id.startsWith("fancy_background_select_");
}

export const handler: Handler<EventContext> = (ctx: EventContext) => {
  return ctx.reply("Not implemented");
};
