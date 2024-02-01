import CommandBuilder from "$discord/command.ts";
import { AttachmentBuilder } from "discord";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";
import { renderAccountStatsImage } from "$core/backend/render.ts";
import { searchAccounts } from "$core/backend/accounts.ts";

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

export const handler: Handler<Context> = async (ctx: Context) => {
  let accountId: number;
  const server = ctx.options<string>("server");
  const nickname = ctx.options<string>("nickname");
  const { connection, exists } = ctx.user.wargaming;

  switch (true) {
    case (exists && !nickname): {
      // Use default account
      accountId = connection.accountId;
      break;
    }
    case (!!nickname && !!server): {
      // Find account
      const account = await searchAccounts(nickname, server);
      if (!account.ok) {
        if (account.error === "no results found") {
          return ctx.reply({
            content:
              `Couldn't find a player named **${nickname}** on **${server}**. Was the name spelled correctly?`,
            ephemeral: true,
          });
        }
        return ctx.error(account.error);
      }
      accountId = account.data.account_id;
      break;
    }
    default: {
      return ctx.reply({
        content:
          "I need both the name and server to find your account. You can also use `/link` to setup a default account.",
        ephemeral: true,
      });
    }
  }
  await ctx.ack();

  const result = await renderAccountStatsImage(accountId);
  if (!result.ok) {
    return ctx.reply(result.error);
  }

  const file = new AttachmentBuilder(result.data, {
    name: "stats-by-aftermath.png",
  });
  return ctx.reply({ files: [file] });
};
