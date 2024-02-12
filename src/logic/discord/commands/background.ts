import CommandBuilder from "$discord/command.ts";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";
import { uploadCustomUserBackground } from "$core/backend/users.ts";

export const command = new CommandBuilder();
command.setName("background");
command.setDescription("Upload a custom background image for your stats!");
command.addStringOption((option) =>
  option.setName("url")
    .setDescription("Link to a PNG or JPEG image")
    .setRequired(false)
);
command.addAttachmentOption((option) =>
  option.setName("file")
    .setDescription("PNG or JPEG image")
    .setRequired(false)
);
command.setAdvertise(false);

export const handler: Handler<Context> = async (ctx: Context) => {
  if (!ctx.user.hasPermission("actions/uploadPersonalBackground")) {
    return ctx.reply({
      content:
        "This feature of Aftermath is only available for users with an active subscription.\nYou can subscribe at https://amth.one/join or pick a background using `/fancy` instead.",
      ephemeral: true,
    });
  }

  await ctx.ack();

  const { connection, exists } = ctx.user.wargaming;
  if (!exists || !connection.verified) {
    return ctx.reply({
      content:
        "You need to verify your Wargaming account to use this feature. Use `/verify` to get started!",
      ephemeral: false, // because it was acked before as false
    });
  }

  const link = ctx.optionValue<string>("url");
  const file = ctx.options("file")?.attachment?.url || null;
  if (!link && !file) {
    return ctx.reply({
      content: "You need to provide a valid link or attach an image.",
      ephemeral: false, // because it was acked before as false
    });
  }

  await ctx.ack();
  const res = await uploadCustomUserBackground(ctx.user.id, (link || file)!);
  if (!res.ok) {
    console.error(res.error);
    if (res.error == "invalid image format") {
      return ctx.reply({
        content: "The link you provided is not a valid PNG or JPEG image.",
        ephemeral: false, // because it was acked before as false
      });
    }
    return ctx.error(res.error);
  }

  return ctx.reply(
    "## :tada: Your custom background image was updated\nTry checking your session again!",
  );
};
