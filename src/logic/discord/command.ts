import { SlashCommandBuilder } from "discord";

export default class CommandBuilder extends SlashCommandBuilder {
  readonly exclusive?: boolean;
}
