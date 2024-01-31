import CommandBuilder from "$discord/command.ts";

import { CommandContext } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";

export const command = new CommandBuilder();
command.setName("widget");
command.setDescription("Get a live streaming widget for your account");
command.addStringOption((option) =>
  option.setName("flavor")
    .setDescription("Widget Appearance")
    .addChoices(
      { name: "Detailed, includes career", value: "legacy" },
      { name: "Simplified, session only", value: "ticker" },
    )
    .setRequired(false)
);
export const handler: Handler<CommandContext> = (ctx: CommandContext) => {
  return ctx.reply("Not implemented");
};
