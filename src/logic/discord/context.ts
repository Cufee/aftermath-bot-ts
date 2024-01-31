import { User } from "$core/backend/types.d.ts";
import { Result } from "$core/Result.d.ts";

import {
  AnySelectMenuInteraction,
  ButtonInteraction,
  CacheType,
  CommandInteraction,
  InteractionReplyOptions,
  InteractionResponse,
  MessagePayload,
  ModalSubmitInteraction,
} from "discord";

type replyOptions = string | MessagePayload | InteractionReplyOptions;

export class CommandContext {
  private i: CommandInteraction<CacheType>;
  readonly user: User;

  constructor(i: CommandInteraction<CacheType>, user: User) {
    this.i = i;
    this.user = user;
  }

  async reply(
    options: replyOptions,
  ): Promise<Result<InteractionResponse<boolean>>> {
    try {
      return { ok: true, data: await this.i.reply(options) };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
}

export class EventContext {
  private i:
    | AnySelectMenuInteraction<CacheType>
    | ButtonInteraction<CacheType>
    | ModalSubmitInteraction<CacheType>;
  readonly user: User;

  constructor(
    i:
      | AnySelectMenuInteraction<CacheType>
      | ButtonInteraction<CacheType>
      | ModalSubmitInteraction<CacheType>,
    user: User,
  ) {
    this.i = i;
    this.user = user;
  }

  async reply(
    options: replyOptions,
  ): Promise<Result<InteractionResponse<boolean>>> {
    try {
      return { ok: true, data: await this.i.reply(options) };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }
}
