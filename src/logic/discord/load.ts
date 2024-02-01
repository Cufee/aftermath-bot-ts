import CommandBuilder from "./command.ts";
import { Context } from "./context.ts";
import { Result } from "$core/Result.d.ts";

export type Handler<T = Context | Context> = (
  ctx: T,
) => Promise<Result<unknown>>;

interface Command {
  command: CommandBuilder;
  handler: Handler<Context>;
}

export const loadCommands = async () => {
  const commands: Record<string, Command> = {};

  for (const f of Deno.readDirSync("src/logic/discord/commands")) {
    if (!f.isFile) continue;

    const { command, handler } = await import(
      `./commands/${f.name}`
    ) as Command;
    if (!command || !handler) {
      console.error(`Skipping command ${f.name}`);
      continue;
    }

    commands[command.name] = { command, handler };
  }
  return commands;
};

interface Event {
  match: (id: string) => boolean;
  handler: Handler<Context>;
}

export const loadEvents = async () => {
  const events: Event[] = [];

  for (const f of Deno.readDirSync("src/logic/discord/events")) {
    if (!f.isFile) continue;

    const { match, handler } = await import(`./events/${f.name}`) as Event;
    if (!match || !handler) {
      console.error(`Skipping event ${f.name}`);
      continue;
    }

    events.push({ match, handler });
  }
  return events;
};
