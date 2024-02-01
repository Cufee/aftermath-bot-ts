// import CommandBuilder from "$discord/command.ts";

// import { Context } from "$logic/discord/context.ts";
// import { Handler } from "$logic/discord/load.ts";

// export const command = new CommandBuilder();
// command.setName("stats");
// command.setDescription("View your career stats");
// command.addStringOption((option) =>
//   option.setName("nickname")
//     .setDescription("Player Nickname")
//     .setRequired(false)
// );
// command.addStringOption((option) =>
//   option.setName("server")
//     .setDescription("Server")
//     .addChoices(
//       { name: "North America", value: "na" },
//       { name: "Europe", value: "eu" },
//       { name: "Asia", value: "as" },
//     )
//     .setRequired(false)
// );

// export const handler: Handler<Context> = async (ctx: Context) => {
// const server = ctx.options<string>("server");
// const nickname = ctx.options<string>("nickname");
// if (nickname && !playerNameValid(nickname)) {
//   return ctx.reply({
//     content:
//       "The nickname you provided is invalid. It should contain only letters, numbers, or underscores.",
//     ephemeral: true,
//   });
// }

// let accountId: number;
// const { connection, exists } = ctx.user.wargaming;

// switch (true) {
//   case (exists && !nickname): {
//     // Use default account
//     accountId = connection.accountId;
//     break;
//   }
//   case (!!nickname && !!server): {
//     // Find account
//     const account = await searchAccounts(nickname, server);
//     if (!account.ok) {
//       if (account.error === "no results found") {
//         return ctx.reply({
//           content:
//             `Couldn't find a player named **${nickname}** on **${server}**. Was the name spelled correctly?`,
//           ephemeral: true,
//         });
//       }
//       return ctx.error(account.error);
//     }
//     accountId = account.data.account_id;
//     break;
//   }
//   default: {
//     return ctx.reply({
//       content:
//         "I need both the name and server to find your account. You can also use `/link` to setup a default account.",
//       ephemeral: true,
//     });
//   }
// }
// await ctx.ack();
//   return ctx.reply("Not implemented");
// };
