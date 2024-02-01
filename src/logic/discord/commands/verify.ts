import CommandBuilder from "$discord/command.ts";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";
import { getUserVerificationLink } from "$core/backend/users.ts";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord";

export const command = new CommandBuilder();
command.setName("verify");
command.setDescription(
  "Verify your Wargaming account to unlock more features!",
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

export const handler: Handler<Context> = async (ctx: Context) => {
  const { connection } = ctx.user.wargaming;
  const server = ctx.optionValue<string>("server") || connection?.realm || null;
  if (!server) {
    return ctx.reply({
      content: "Please select a server to verify your account.",
      ephemeral: true,
    });
  }

  const res = await getUserVerificationLink(ctx.user.id, server);
  if (!res.ok) {
    return ctx.error(res.error);
  }

  const button = new ButtonBuilder();
  button.setLabel("Verify on Wargaming.net");
  button.setStyle(ButtonStyle.Link);
  button.setURL(res.data);

  const row = new ActionRowBuilder();
  row.addComponents(button);

  return ctx.reply({
    content:
      "## Click the button below to verify your account\nThis link is active for 5 minutes, please do not share it with anyone.",
    // deno-lint-ignore no-explicit-any
    components: [row as any],
    ephemeral: true,
  });
};
