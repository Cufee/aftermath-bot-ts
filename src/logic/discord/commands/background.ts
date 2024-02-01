import CommandBuilder from "$discord/command.ts";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";

export const command = new CommandBuilder();
command.setName("background");
command.setDescription("Upload a custom background image for your stats!");
command.addStringOption((option) =>
  option.setName("url")
    .setDescription("Link to a PNG or JPEG image")
    .setRequired(true)
);
command.setAdvertise(false);

export const handler: Handler<Context> = (ctx: Context) => {
  return ctx.reply("Not implemented");
};
