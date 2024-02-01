import CommandBuilder from "$discord/command.ts";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";

// var euCron = cronexpr.MustParse("0 1 * * *")
// var naCron = cronexpr.MustParse("0 9 * * *")
// var asiaCron = cronexpr.MustParse("0 18 * * *")

export const command = new CommandBuilder();
command.setName("help");
command.setDescription("Get some helpful information about the bot");

export const handler: Handler<Context> = (ctx: Context) => {
  return ctx.reply("Not implemented");
};
