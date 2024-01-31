import CommandBuilder from "./command.ts";
import { CommandContext, EventContext } from "./context.ts";
import { Result } from "$core/Result.d.ts";

export type Handler<T = CommandContext | EventContext> = (
  ctx: T,
) => Promise<Result<unknown>>;

interface Command {
  command: CommandBuilder;
  handler: Handler<CommandContext>;
}

export const loadCommands = async () => {
  const commands: Record<string, Command> = {};

  for (const f of Deno.readDirSync("src/logic/discord/commands")) {
    if (!f.isFile) continue;

    const { command, handler } = await import(
      `./commands/${f.name}`
    ) as Command;

    commands[command.name] = { command, handler };
  }
  return commands;
};

interface Event {
  match: (id: string) => boolean;
  handler: Handler<EventContext>;
}

export const loadEvents = async () => {
  const events: Event[] = [];

  for (const f of Deno.readDirSync("src/logic/discord/events")) {
    if (!f.isFile) continue;
    events.push(await import(`./events/${f.name}`) as Event);
  }
  return events;
};
