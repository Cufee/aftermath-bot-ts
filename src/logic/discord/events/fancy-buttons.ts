import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";
import { selectAvailableBackgroundPreset } from "$core/backend/users.ts";

export function match(id: string): boolean {
  return id.startsWith("fancy_background_select_");
}

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

  const index = ctx.customId.split("_").pop();
  if (!index) {
    return ctx.error("Invalid custom ID in fancy_background_select_");
  }

  await ctx.ack();
  const res = await selectAvailableBackgroundPreset(
    ctx.user.id,
    parseInt(index, 10) - 1,
  );
  if (!res.ok) {
    return ctx.error(res.error);
  }

  return ctx.reply(
    "## :tada: Your background was updated\nTry checking your session again!",
  );
};
