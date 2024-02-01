import { User } from "$core/backend/user.ts";
import { Result } from "$core/Result.d.ts";

import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  CacheType,
  CommandInteraction as CommandInteractionType,
  InteractionReplyOptions,
  InteractionResponse,
  MessagePayload,
  ModalSubmitInteraction,
} from "discord";
import { reportError } from "$logic/report/webhook.ts";
import { managerToFetchingStrategyOptions } from "discord";

type replyOptions = string | MessagePayload | InteractionReplyOptions;
type Interaction =
  | CommandInteractionType<CacheType>
  | AnySelectMenuInteraction<CacheType>
  | ButtonInteraction<CacheType>
  | ModalSubmitInteraction<CacheType>;

interface ContextState {
  acked: boolean;
  ackedEphemeral: boolean;
  interactionReply: InteractionResponse<boolean> | null;
}

export class Context {
  readonly user: User;
  private i: Interaction;
  private state: ContextState = {
    acked: false,
    interactionReply: null,
    ackedEphemeral: false,
  };

  constructor(i: Interaction, user: User) {
    this.user = user;
    this.i = i;
  }

  async ack(ephemeral = false): Promise<Result<null>> {
    if (this.state.acked && this.state.interactionReply) {
      return { ok: true, data: null };
    }
    try {
      this.state.interactionReply = await this.i.deferReply({ ephemeral });
      this.state.ackedEphemeral = ephemeral;
      this.state.acked = true;
      return { ok: true, data: null };
    } catch (error) {
      console.debug("Failed to ack:", error);
      return { ok: false, error: error.message || JSON.stringify(error) };
    }
  }

  async reply(
    options: replyOptions,
  ): Promise<Result<null>> {
    try {
      if (this.state.acked && this.state.interactionReply) {
        await this.state.interactionReply.edit(options);
        return { ok: true, data: null };
      }

      this.state.interactionReply = await this.i.reply(options);
      this.state.ackedEphemeral =
        typeof options === "object" && "ephemeral" in options
          ? !!options.ephemeral
          : false;
      this.state.acked = true;
      return { ok: true, data: null };
    } catch (error) {
      console.debug("Failed to reply:", error);
      return { ok: false, error: error.message || JSON.stringify(error) };
    }
  }

  async deleteReply(): Promise<Result<null>> {
    try {
      if (!this.state.acked || !this.state.interactionReply) {
        await this.i.deleteReply();
        this.state.interactionReply = null;
        this.state.acked = false;
        return { ok: true, data: null };
      }

      await this.state.interactionReply.delete();
      this.state.interactionReply = null;
      this.state.acked = false;
      return { ok: true, data: null };
    } catch (error) {
      console.debug("Failed to delete reply:", error);
      return { ok: false, error: error.message || JSON.stringify(error) };
    }
  }

  async error(message: string): Promise<Result<null>> {
    try {
      const reported = await reportError(
        `### Error while handling interaction\n**Guild**: ${this.i.guildId}\n**User**: ${this.user.id}\n\`\`\`${message}\n${Error().stack}`
          .slice(0, 1997) + "```",
      );
      if (!reported) {
        console.error("Failed to report error:", message);
      }
      await this.reply({
        content: reported
          ? "Something went wrong. Please try again later.\n*This error has been reported automatically.*"
          : "Something went wrong. Please try again later.\n*Feel free to report this error at `amth.one/join`.*",
        ephemeral: true,
      });
      if (!this.state.ackedEphemeral) {
        setTimeout(() => this.deleteReply(), 10000);
      }

      return { ok: true, data: null };
    } catch (error) {
      console.error("Failed to handle error:", error);
      return { ok: false, error: error.message || JSON.stringify(error) };
    }
  }

  options<T>(key: string): T | null {
    if ("options" in this.i) {
      return (this.i.options.get(key)?.value as T) ?? null;
    }
    return null;
  }
}
