import { Client, Events, GatewayIntentBits, REST, Routes } from "discord";
import { Result } from "$core/Result.d.ts";

import { loadCommands, loadEvents } from "$discord/load.ts";
import { CommandContext, EventContext } from "$discord/context.ts";
import { mustGetEnv } from "$core/env.ts";

const token = mustGetEnv("DISCORD_TOKEN");
const guildId = mustGetEnv("DISCORD_GUILD_ID");
const clientId = mustGetEnv("DISCORD_CLIENT_ID");

const events = await loadEvents();
const commands = await loadCommands();
const rest = new REST().setToken(token);
rest.put(
  Routes.applicationGuildCommands(clientId, guildId),
  { body: Object.values(commands).map((c) => c.command) },
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, (readyClient) => {
  console.info(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  try {
    let result: Result<unknown> = { ok: false, error: "unknown interaction" };

    // Get user here
    const user = { id: interaction.user.id };

    // Command
    if (interaction.isCommand() && commands[interaction.commandName]) {
      result = await commands[interaction.commandName].handler(
        new CommandContext(interaction, user),
      );
    }

    // Interaction Event
    if ("customId" in interaction) {
      const { handler } = events.find((event) =>
        event.match(interaction.customId)
      ) ?? {};
      if (handler) {
        result = await handler(new EventContext(interaction, user));
      }
    }

    // Check for errors
    if (!result.ok) {
      console.error("interaction handler failed:", result.error);
    }
  } catch (error) {
    console.error("interaction handler threw:", error);
  }
});

client.login(token);
