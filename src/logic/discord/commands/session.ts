import CommandBuilder from "$discord/command.ts";
import { AttachmentBuilder } from "discord";
import { playerNameValid } from "$logic/utils.ts";
import { User } from "$core/backend/user.ts";

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
command.addUserOption((option) =>
  option.setName("user")
    .setDescription("Mention User")
    .setRequired(false)
);

export const handler: Handler<Context> = async (ctx: Context) => {
  const mentionedUser = ctx.optionValue<string>("user");
  const server = ctx.optionValue<string>("server");
  const nickname = ctx.optionValue<string>("nickname");
  if (nickname && !playerNameValid(nickname)) {
    return ctx.reply({
      content:
        "The nickname you provided is invalid. It should contain only letters, numbers, or underscores.",
      ephemeral: true,
    });
  }

  let accountId: number;
  const { connection, exists } = ctx.user.wargaming;

  switch (true) {
    case (!!mentionedUser): {
      // Use default account of another user
      const res = await User.find(mentionedUser);
      if (!res.ok) {
        return ctx.error(res.error);
      }
      const { connection, exists } = res.data.wargaming;
      if (!exists) {
        return ctx.reply({
          content:
            "The user you mentioned doesn't have a Wargaming account linked.",
          ephemeral: true,
        });
      }
      accountId = connection.accountId;
      break;
    }
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
    return ctx.error(result.error);
  }

  const file = new AttachmentBuilder(result.data, {
    name: "stats-by-aftermath.png",
  });
  return ctx.reply({ files: [file] });
};
