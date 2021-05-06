import { inject } from '@alexlafroscia/service-locator';
import { Client, Collection, GuildMember } from 'discord.js';
import { IMessage } from '../discord/message';
import isEmpty from 'lodash/isEmpty';
import { IAdventureConfig } from '../config/adventure';
import { Reward } from '../models/Reward';
import { makeItemRewardedMessage } from '../messages/item-rewarded';
import { IGuild } from '../models/Guild';

export default class GiveItemListener {
    @inject message: IMessage;
    @inject AdventureConfig: IAdventureConfig;
    @inject client: Client | null;
    @inject guildMembers: Collection<string, GuildMember> | undefined;
    @inject guild: IGuild;

    async handle() {
        if (this.message.author().id !== this.guild.adventureBotId) {
            return;
        }

        const regex = new RegExp(/An item named (.*) has been created and placed in (.*)'s backpack./gm);
        const matches = regex.exec(this.message.content());

        if (!matches || matches.length !== 3) {
            return;
        }

        const itemDirty = matches[1];
        const user = this.findUser(matches[2]);

        if (isEmpty(user) || isEmpty(itemDirty)) {
            return;
        }

        const itemRegex = new RegExp(/{(Event|Set):''(.*)''}/gm);
        const itemMatches = itemRegex.exec(itemDirty);

        if (!itemMatches || itemMatches.length !== 3) {
            return;
        }

        const itemName = itemMatches[2];

        const updated = await Reward.findOneAndUpdate({ userId: user?.id, itemName: itemName, rewarded: false, guildId: this.message.guildId() }, { rewarded: true });

        if (!updated) {
            return;
        }

        const rewards = await Reward.find({ rewarded: false, guildId: this.message.guildId() });

        return this.message.send(makeItemRewardedMessage(rewards));
    }

    findUser(displayName: string) {
        return this.guildMembers?.find((member: GuildMember) => {
            return member.displayName === displayName;
        });
    }
}
