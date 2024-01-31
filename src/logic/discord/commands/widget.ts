import CommandBuilder from "$discord/command.ts";

import { CommandContext } from "$logic/discord/context.ts";

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
export const handler = async (ctx: CommandContext) => {
  ctx.reply("Not implemented");
};
