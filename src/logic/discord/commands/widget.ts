import CommandBuilder from "$discord/command.ts";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";
import { frontendUrl } from "$core/backend/constants.ts";

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

export const handler: Handler<Context> = (ctx: Context) => {
  const flavor = ctx.optionValue<string>("flavor");

  const { connection, exists } = ctx.user.wargaming;
  if (!exists) {
    return ctx.reply({
      content:
        "You need to link your Wargaming account to use this command. Use `/link` to get started.",
      ephemeral: true,
    });
  }

  const params = new URLSearchParams();
  if (flavor) {
    params.set("flavor", flavor);
  }
  const link =
    `${frontendUrl}/widget/${connection.accountId}/standalone?${params.toString()}`;

  return ctx.reply({
    content:
      `## Here is your widget link!\n${link}\n\nAdd it as a Browser Source in OBS. Place the following code into the Custom CSS section\n\`\`\`css\n:root { background-color: rgba(0, 0, 0, 0); white-space: nowrap; }\n\`\`\`You can also make the widget fit your UI with\n\`\`\`css\n.widget { width: 100%; }\`\`\``,
    ephemeral: true,
  });
};
