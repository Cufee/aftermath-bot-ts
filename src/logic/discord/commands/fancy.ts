import CommandBuilder from "$discord/command.ts";
import {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";
import { getAvailableBackgroundPresets } from "$core/backend/render.ts";

export const command = new CommandBuilder();
command.setName("fancy");
command.setDescription("Select a background for your stats image!");
command.setExclusive(true);

export const handler: Handler<Context> = async (ctx: Context) => {
  if (!ctx.user.hasPermission("actions/selectPersonalBackgroundPreset")) {
    return ctx.reply({
      content: "You don't have permission to use this command.",
      ephemeral: true,
    });
  }

  const { connection, exists } = ctx.user.wargaming;
  if (!exists || !connection.verified) {
    return ctx.reply({
      content:
        "You need to verify your Wargaming account to use this feature. Use `/verify` to get started!",
      ephemeral: true,
    });
  }

  await ctx.ack();

  const result = await getAvailableBackgroundPresets(ctx.user.id);
  if (!result.ok) {
    return ctx.error(result.error);
  }

  const file = new AttachmentBuilder(result.data.image, {
    name: "backgrounds-for-aftermath.png",
  });
  const buttons = result.data.options.map((_, i) => {
    const button = new ButtonBuilder();
    button.setStyle(ButtonStyle.Secondary);
    button.setLabel(`Select #${i + 1}`);
    button.setCustomId(`fancy_background_select_${i + 1}`);
    return button;
  });
  const row = new ActionRowBuilder();
  row.addComponents(buttons);

  setTimeout(() => {
    ctx.deleteReply();
  }, 1000 * 60 * 5);
  return ctx.reply({
    files: [file],
    // deno-lint-ignore no-explicit-any
    components: [row as any],
    content:
      "## :sparkles: Pick your favorite style!\nAvailable options rotate every week.",
  });
};
