import CommandBuilder from "$discord/command.ts";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";
import { searchAccounts } from "$core/backend/accounts.ts";
import { playerNameValid } from "$logic/utils.ts";
import { updateUserWargamingConnection } from "$core/backend/users.ts";

export const command = new CommandBuilder();
command.setName("link");
command.setDescription("Link your Blitz account to Aftermath");
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
  if (!ctx.user.hasPermission("actions/createPersonalConnection")) {
    return ctx.reply({
      content: "You don't have permission to use this command.",
      ephemeral: true,
    });
  }

  await ctx.ack();

  const server = ctx.optionValue<string>("server");
  const nickname = ctx.optionValue<string>("nickname");
  if (nickname && !playerNameValid(nickname)) {
    return ctx.reply({
      content:
        "The nickname you provided is invalid. It should contain only letters, numbers, or underscores.",
      ephemeral: false, // because it was acked before as false
    });
  }

  if (!nickname || !server) {
    return ctx.reply({
      content:
        "I need both the name and server to find your account. You can also use `/link` to setup a default account.",
      ephemeral: false, // because it was acked before as false
    });
  }

  // Find account
  const account = await searchAccounts(nickname, server);
  if (!account.ok) {
    if (account.error === "no results found") {
      return ctx.reply({
        content:
          `Couldn't find a player named **${nickname}** on **${server}**. Was the name spelled correctly?`,
        ephemeral: false, // because it was acked before as false
      });
    }
    return ctx.error(account.error);
  }

  const res = await updateUserWargamingConnection(
    ctx.user.id,
    account.data.account_id,
  );
  if (!res.ok) {
    return ctx.error(res.error);
  }

  return ctx.reply(
    `## :link: Your account has been linked!\nAftermath will now default to **${account.data.nickname}** on **${server.toUpperCase()}** when checking stats.\nYou can also verify your account with \`/verify\``,
  );
};
