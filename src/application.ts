import { IMessage } from './discord/message';
import { inject } from '@alexlafroscia/service-locator';
import { IAdventureConfig } from './config/adventure';
import { ray } from 'node-ray';
import { Client, Collection, GuildMember } from 'discord.js';
import { Reward } from './models/Reward';
import isEmpty from 'lodash/isEmpty';
import sample from 'lodash/sample';
import { makeLootDroppedMessage } from './messages/loot-dropped';
import availableCommands from './config/available-commands';
import { makeItemRewardedMessage } from './messages/item-rewarded';

interface IItem {
    name: string,
    stats: string,
    type: string,
    slot: string,
};

interface IMonster {
    name: string,
    dropRate: number,
    items: Array<IItem>,
};

class Application {
    @inject message: IMessage;
    @inject AdventureConfig: IAdventureConfig;

    private client: Client | null;
    private guildMembers: Collection<string, GuildMember> | undefined;

    async handleMessage(client: Client | null = null) {
        if (this.AdventureConfig.enabled !== true) {
            return;
        }

        this.client = client;
        this.guildMembers = this.client?.guilds.cache.get(this.AdventureConfig.guildId)?.members?.cache;

        await this.handleAdventureWinMessage();
        await this.handleGiveItemMessage();

        const prefix = '-';

        if (!this.message.content().startsWith(prefix) || this.message.isFromBot()) {
            return;
        }

        const args = this.message.content().slice(prefix.length).trim().split(/ +/g);
        const command = args?.shift()?.toLowerCase()?.trim();

        if (!command) {
            return;
        }

        // Fine the matching "route" (aka which commands file and method to call)
        const route = (availableCommands as any)[command];

        // We don't support the given command
        if (!route) {
            return;
        }

        // // Create the controller, so we have a reference to the message available at all times
        const commandInstance = new route.class();

        return commandInstance[route.method](...args);
    }

    async handleAdventureWinMessage() {
        // Only watch messages from a specific bot
        if (this.message.author().id !== this.AdventureConfig.adventureBotId) {
            return;
        }

        if (this.message.original().channel.id !== this.AdventureConfig.adventureChannelId) {
            ray('Wrong channel');

            return;
        }

        const embeds = this.message.original().embeds;

        if (isEmpty(embeds)) {
            return;
        }

        const embed = embeds[0];

        if (embed.description?.includes('The group killed') || embed.description?.includes('The group distracted')) {
            for (const monster of this.monsters()) {
                if (embed.description.toLowerCase()?.includes(monster.name.toLowerCase())) {
                    await this.handleFight(embed.description, monster);
                }
            }
        }
    }

    async handleGiveItemMessage() {
        if (this.message.author().id !== this.AdventureConfig.adventureBotId) {
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

        const updated = await Reward.findOneAndUpdate({ userId: user?.id, itemName: itemName, rewarded: false }, { rewarded: true });

        if (!updated) {
            return;
        }

        return this.message.send(makeItemRewardedMessage());
    }

    async handleFight(message: string, monster: IMonster) {
        const regex = new RegExp(/(.*)(has|have) been awarded(.*)/);
        const matches = regex.exec(message);

        // This only matches if it is a fight win
        if (!matches || matches.length !== 4) {
            return;
        }

        const dropRoll = Math.random();

        ray(`dropRoll: ${dropRoll} > ${monster.dropRate}`);

        if (dropRoll > monster.dropRate) {
            return;
        }

        const droppedItem = sample(monster.items);

        if (!droppedItem) {
            return;
        }

        const usersString = matches[1];

        const users = usersString.split(',').map((displayName) => {
            displayName = displayName.trim().replace(/\*\*/g, '');

            return this.findUser(displayName);
        });

        const rewards = [];

        for (const user of users) {
            if (!user) {
                return;
            }

            const newReward = new Reward({
                userId: user.id,
                username: user.displayName,
                itemName: droppedItem.name,
                itemStats: droppedItem.stats,
                itemType: droppedItem.type,
                itemSlot: droppedItem.slot,
                rewarded: false,
            });

            await newReward.save();

            rewards.push(newReward);
        }

        this.message.send(makeLootDroppedMessage(droppedItem, users));
    }

    monsters(): Array<IMonster> {
        return [
            <IMonster>{
                name: 'Ascended Minotaur',
                dropRate: 60 / 100,
                items: [
                    <IItem>{ name: 'Infernal Warhammer', stats: '52 attack 20 charisma 22 int 24 dex 37 luck 2 degrade 50 level', type: 'event', slot: 'twohanded' },
                    <IItem>{ name: 'Sunheart Medallion', stats: '37 attack 20 charisma 25 int 24 dex 36 luck 2 degrade 50 level', type: 'event', slot: 'neck' },
                ],
            },
            <IMonster>{
                name: 'Forest Kirin',
                dropRate: 95 / 100,
                items: [
                    <IItem>{ name: 'Furs of the Frost', stats: '32 attack 32 charisma 32 int 32 dex 32 luck 2 degrade 50', type: 'event', slot: 'chest' },
                    <IItem>{ name: 'Crown of Deep Winter', stats: '35 attack 31 charisma 31 int 31 dex 35 luck 2 degrade 50 level', type: 'event', slot: 'head' },
                ],
            },
        ];
    }

    findUser(displayName: string) {
        return this.guildMembers?.find((member: GuildMember) => {
            return member.displayName === displayName;
        });
    }
}

export default Application;