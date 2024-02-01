import CommandBuilder from "$discord/command.ts";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";

export const command = new CommandBuilder();
command.setName("fancy");
command.setDescription("Select a background for your stats image!");
command.setExclusive(true);

export const handler: Handler<Context> = (ctx: Context) => {
  return ctx.reply("Not implemented");
};
