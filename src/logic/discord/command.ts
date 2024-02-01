import { SlashCommandBuilder } from "discord";

export default class CommandBuilder extends SlashCommandBuilder {
  private _aliases: string[] = [];

  private _advertise = true;
  private _exclusive = false;

  private _guildOnly = false;
  private _dmOnly = false;

  constructor() {
    super();
  }

  setAliases(aliases: string[]) {
    this._aliases = aliases || [];
    return this;
  }
  addAlias(alias: string) {
    if (alias && typeof alias === "string") {
      this._aliases.push(alias);
    }
    return this;
  }
  get aliases() {
    return this._aliases;
  }

  setAdvertise(advertise: boolean) {
    this._advertise = !!advertise;
    return this;
  }
  get advertise() {
    return this._advertise;
  }
  setExclusive(exclusive: boolean) {
    this._exclusive = !!exclusive;
    return this;
  }
  get exclusive() {
    return this._exclusive;
  }

  setGuildOnly(guildOnly: boolean) {
    this._guildOnly = !!guildOnly;
    return this;
  }
  get guildOnly() {
    return this._guildOnly;
  }
  setDmOnly(dmOnly: boolean) {
    this._dmOnly = !!dmOnly;
    return this;
  }
  get dmOnly() {
    return this._dmOnly;
  }
}
