import CommandBuilder from "$discord/command.ts";

import { Context } from "$logic/discord/context.ts";
import { Handler } from "$logic/discord/load.ts";

import { Cron, parseCronExpression } from "cron";

const euCron = parseCronExpression("0 1 * * *");
const naCron = parseCronExpression("0 9 * * *");
const asiaCron = parseCronExpression("0 18 * * *");
const backgroundCron = parseCronExpression("0 0 */7 * *");

export const command = new CommandBuilder();
command.setName("help");
command.setDescription("Get some helpful information about the bot");

export const handler: Handler<Context> = (ctx: Context) => {
  return ctx.reply({ content: helpMessage(), ephemeral: true });
};

function helpMessage(): string {
  const euNext = getNextLocalTime(euCron);
  const naNext = getNextLocalTime(naCron);
  const asiaNext = getNextLocalTime(asiaCron);
  const backgroundNext = getNextLocalTime(backgroundCron);
  return `
## :chart_with_upwards_trend: Track your progress
### ○ \`/session\`
Get an image with your current session stats. You can also mention another user to view their stats.
### Aftermath sessions will be reset at the following times:
North America:    <t:${naNext}:t> (<t:${naNext}:R>)
Europe:                   <t:${euNext}:t> (<t:${euNext}:R>)
Asia:                         <t:${asiaNext}:t> (<t:${asiaNext}:R>)
### ○ \`/stats\`
Coming soon! (TM)
## :film_frames: Dive deeper into every battle
### ○ \`/replay\`
Coming soon! (TM)
## :link: Tell Aftermath your Blitz nickname
### ○ \`/link\`
You can set a default account by using the \`/link\` command to use \`/session\` and \`/stats\` without providing a nickname and server.
### ○ \`/verify\`
Verify your Wargaming account to unlock additional features.
## :frame_photo: Add a splash of style
### ○ \`/background\`
Upload a custom background image for your session stats. Your unique style will be visible to everyone who views your stats.
### ○ \`/fancy\`
Select a background image for your session stats from a list of available options.
*Available backgrounds for \`/fancy\` will rotate <t:${backgroundNext}:R>*
## :desktop: Show off on your stream
### ○ \`/widget\`
Get a link to a streaming widget for your stream overlay.
This widget will automatically update with your latest session stats.
## :heart: Share the love!
Feel free to add Aftermath to your server at __amth.one/invite__ and join our our official server though __amth.one/join__`;
}

function getNextLocalTime(cron: Cron): number {
  const next = cron.getNextDate(new Date());
  const offset = new Date().getTimezoneOffset() * 60 * 1000;

  return new Date(next.getTime() - offset).getTime() / 1000;
}
