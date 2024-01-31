import CommandBuilder from "$discord/command.ts";

import { CommandContext } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";

export const command = new CommandBuilder();
command.setName("session");
command.setDescription("View your latest session stats");
command.addStringOption((option) =>
  option.setName("nickname")
    .setDescription("Player Nickname")
    .setRequired(false)
);
command.addStringOption((option) =>
  option.setName("server")
    .setDescription("Server")
    .addChoices(
      { name: "North America", value: "na" },
      { name: "Europe", value: "eu" },
      { name: "Asia", value: "as" },
    )
    .setRequired(false)
);

export const handler: Handler<CommandContext> = (ctx: CommandContext) => {
  return ctx.reply("Not implemented");
};
