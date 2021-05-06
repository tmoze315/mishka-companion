import { IMessage } from "../discord/message";
import { inject } from '@alexlafroscia/service-locator';
import { IAdventureConfig } from "../config/adventure";
import { Client, Collection, GuildMember } from "discord.js";
import { IGuild } from "../models/Guild";

export default abstract class BaseCommands {
    @inject message: IMessage;
    @inject AdventureConfig: IAdventureConfig;
    @inject client: Client | null;
    @inject guildMembers: any;
    @inject guild: IGuild;
}
