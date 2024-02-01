import { Client, Events, GatewayIntentBits, REST, Routes } from "discord";
import { User } from "$core/backend/user.ts";

import { loadCommands, loadEvents } from "$discord/load.ts";
import { Context } from "$discord/context.ts";
import { mustGetEnv } from "$core/env.ts";
import { reportError } from "$logic/report/webhook.ts";

const token = mustGetEnv("DISCORD_TOKEN");

const events = await loadEvents();
const commands = await loadCommands();
const promoText = [
  "amth.one/join - Join Aftermath Official",
  "amth.one/invite - Add Aftermath to your server",
  ...Object.values(commands).map((c) =>
    `/${c.command.name} - ${c.command.description}`
  ),
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  if (Deno.env.get("DEV_MODE") !== "true") {
    const rest = new REST().setToken(token);
    console.info("Started refreshing application (/) commands.");
    await rest.put(
      // Register all commands globally to advertise their existence and then limit access through a middleware
      Routes.applicationCommands(readyClient.application.id),
      { body: Object.values(commands).map((c) => c.command) },
    );
    console.info("Successfully reloaded application (/) commands.");
  }

  let lastPromoIndex = 1;
  readyClient.user.setActivity({ name: promoText[0] });

  Deno.cron("update bot status", "*/5 * * * *", () => {
    readyClient.user.setActivity({ name: promoText[lastPromoIndex] });
    lastPromoIndex = (lastPromoIndex + 1) % promoText.length;
  });

  console.info(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // This is here for TS to see that .reply exists and to create Context
    const isCommand = interaction.isCommand() &&
      commands[interaction.commandName];
    const isEvent = "customId" in interaction;

    if (!isCommand && !isEvent) {
      console.error("Unknown interaction type:", interaction);
      return;
    }

    // Get user
    const userResponse = await User.find(interaction.user.id);
    if (!userResponse.ok) {
      console.error("Failed to fetch user:", userResponse.error);
      const reported = await reportError(
        `### Error while fetching user for interaction\n**Guild**: ${interaction.guildId}\n**User**: ${interaction.user.id}\n\`\`\`failed to fetch user: ${userResponse.error}\n${Error().stack}\`\`\``,
      );
      await interaction.reply({
        content: reported
          ? "Something went wrong. Please try again later.\n*This error has been reported automatically.*"
          : "Something went wrong. Please try again later.\n*Feel free to report this error at `amth.one/join`.*",
        ephemeral: true,
      });
      return;
    }
    const ctx = new Context(interaction, userResponse.data);
    if (ctx.user.banned) {
      await ctx.reply({
        content: "You have been banned from using Aftermath.",
        ephemeral: true,
      });
      return;
    }

    switch (true) {
      case (!!isCommand): {
        const r = await commands[interaction.commandName].handler(ctx);
        if (!r.ok) ctx.error(r.error);
        break;
      }
      case (!!isEvent): {
        // Interaction Event
        const { handler } = events.find((event) =>
          event.match(interaction.customId)
        ) ?? {};
        if (handler) {
          const r = await handler(ctx);
          if (!r.ok) ctx.error(r.error);
        }
        break;
      }
      default: {
        console.error(
          "unknown interaction: ",
          "customId" in interaction
            ? interaction.customId
            : interaction.commandName,
        );
        break;
      }
    }
  } catch (error) {
    console.error("interaction handler threw:", error);
    try {
      await reportError(
        `### Error while fetching user for interaction\n**Guild**: ${interaction.guildId}\n**User**: ${interaction.user.id}\n\`\`\`interaction handler threw: ${
          error.message || JSON.stringify(error)
        }\n${Error().stack}\`\`\``,
      );
    } catch (e) {
      console.error("Failed to report error:", e);
    }
  }
});

client.login(token);
