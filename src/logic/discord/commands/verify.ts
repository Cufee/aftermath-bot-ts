import CommandBuilder from "$discord/command.ts";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";

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

export const handler: Handler<Context> = (ctx: Context) => {
  const server = ctx.options<string>("server");
  const { connection, exists } = ctx.user.wargaming;

  switch (true) {
    case exists: {
      // Use default account realm
      break;
    }
    case (!!server): {
      //
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

  return ctx.reply("Not implemented");
};
