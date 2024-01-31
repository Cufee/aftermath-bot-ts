import CommandBuilder from "$discord/command.ts";

import { CommandContext } from "$logic/discord/context.ts";

export const command = new CommandBuilder();
command.setName("fancy");
command.setDescription("Select a background for your stats image!");

export const handler = async (ctx: CommandContext) => {
  ctx.reply("Not implemented");
};
