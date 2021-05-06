import { inject } from '@alexlafroscia/service-locator';
import { Client, Collection, GuildMember } from 'discord.js';
import { IMessage } from '../discord/message';
import isEmpty from 'lodash/isEmpty';
import { IAdventureConfig } from '../config/adventure';
import { Reward } from '../models/Reward';
import sample from 'lodash/sample';
import { makeLootDroppedMessage } from '../messages/loot-dropped';
import concat from 'lodash/concat';
import { ItemService, IItem } from '../services/item-service';
import { IGuild } from '../models/Guild';

interface IMonster {
    name: string,
    dropRate: number,
    items: Array<IItem>,
};

export default class AdventureWinListener {
    @inject message: IMessage;
    @inject AdventureConfig: IAdventureConfig;
    @inject client: Client | null;
    @inject guildMembers: Collection<string, GuildMember> | undefined;
    @inject guild: IGuild;

    async handle() {
        // Only watch messages from a specific bot
        if (this.message.author().id !== this.guild.adventureBotId) {
            return;
        }

        if (this.message.original().channel.id !== this.guild.adventureChannelId) {
            console.log('Wrong channel');

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

    async handleFight(message: string, monster: IMonster) {
        const regex = new RegExp(/(.*)(has|have) been awarded(.*)/);
        const matches = regex.exec(message);

        // This only matches if it is a fight win
        if (!matches || matches.length !== 4) {
            return;
        }

        const dropRoll = Math.random();

        if (dropRoll > monster.dropRate) {
            console.log('No drops');

            return;
        }

        const droppedItem = sample(monster.items);

        if (!droppedItem) {
            console.log('No item found');
            return;
        }

        const usersString = matches[1].replace('** and **', '**, **');

        const users = usersString.split(', ').map((displayName) => {
            displayName = displayName.trim().replace(/\*\*/g, '');

            return this.findUser(displayName);
        });

        const rewards = [];

        for (const user of users) {
            if (!user) {
                return;
            }

            const newReward = new Reward({
                guildId: this.guild.id,
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

    findUser(displayName: string) {
        return this.guildMembers?.find((member: GuildMember) => {
            return member.displayName === displayName;
        });
    }

    private monsters(): Array<IMonster> {
        return [
            <IMonster>{
                name: 'Divine Storm King',
                dropRate: 20 / 100,
                items: [
                    <IItem>{ name: 'Divine Storm Spear', stats: '', type: 'set', slot: 'right' },
                    <IItem>{ name: 'Divine Storm Ring', stats: '', type: 'set', slot: 'ring' },
                ],
            },
            <IMonster>{
                name: 'Legendary Fire Giant',
                dropRate: 30 / 100,
                items: [
                    <IItem>{ name: 'Infernal Warhammer', stats: '52 attack 20 charisma 22 int 24 dex 37 luck 2 degrade 50 level', type: 'event', slot: 'twohanded' },
                    <IItem>{ name: 'Sunheart Medallion', stats: '37 attack 20 charisma 25 int 24 dex 36 luck 2 degrade 50 level', type: 'event', slot: 'neck' },
                ],
            },
            <IMonster>{
                name: 'Legendary Frost Giant',
                dropRate: 30 / 100,
                items: [
                    <IItem>{ name: 'Furs of the Frost', stats: '32 attack 32 charisma 32 int 32 dex 32 luck 2 degrade 50 level', type: 'event', slot: 'chest' },
                    <IItem>{ name: 'Crown of Deep Winter', stats: '35 attack 31 charisma 31 int 31 dex 35 luck 2 degrade 50 level', type: 'event', slot: 'head' },
                ],
            },
            <IMonster>{
                name: 'Legendary Stone Giant',
                dropRate: 30 / 100,
                items: [
                    <IItem>{ name: 'Dragonstone Idol', stats: '26 attack 26 charisma 26 int 26 dex 106 luck 2 degrade 25 level', type: 'event', slot: 'charm' },
                    <IItem>{ name: 'Dragonstone Idol', stats: '26 attack 26 charisma 26 int 26 dex 106 luck 2 degrade 25 level', type: 'event', slot: 'charm' },
                ],
            },
            <IMonster>{
                name: 'Legendary Hill Giant',
                dropRate: 30 / 100,
                items: [
                    <IItem>{ name: 'Thornblight', stats: '10 attack 10 charisma 75 int 10 dex 40 luck 2 degrade 75 level', type: 'event', slot: 'left' },
                    <IItem>{ name: 'Thane\'s Legendary Greatclub', stats: '75 attack 10 charisma 10 int 10 dex 40 luck 2 degrade 75 level', type: 'event', slot: 'left' },
                ],
            },
            <IMonster>{
                name: 'Legendary Cloud Giant',
                dropRate: 30 / 100,
                items: [
                    <IItem>{ name: 'Healm of Whispers', stats: '24 attack 20 charisma 35 int 31 dex 35 luck 2 degrade 50 level', type: 'event', slot: 'head' },
                    <IItem>{ name: 'Winged Boots', stats: '35 attack 31 charisma 35 int 26 dex 26 luck 2 degrade 50 level', type: 'event', slot: 'boots' },
                ],
            },
            <IMonster>{
                name: 'Fire Wyvern',
                dropRate: 100 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Golden Draconid',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Black Wyrm',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Ice Wyvern',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Bronze Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Ice Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Aether Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Emerald Wyrm',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Nether Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Obsidian Drake',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Golden Wyrm',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Ruby Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Red Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Emerald Drake',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Lightning Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Silver Wyrm',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Elder Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Blood Wyrm',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Sandskin Wyvern',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Sea Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Night Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Golden Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Reanimated Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Bronze Wyrm',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Fire Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Jade Drake',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Bloodrage Drake',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Enraged Drake',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Crystal Drake',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Abyssal Drake',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Forest Drake',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Earth Dragon',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Viridian Amphithere',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems(), ItemService.tierFourSetItems()),
            },
            <IMonster>{
                name: 'Golden Amphitere',
                dropRate: 10 / 100,
                items: concat(ItemService.tierOneSetItems(), ItemService.tierTwoSetItems()),
            },
            <IMonster>{
                name: 'Celestial Wyrm',
                dropRate: 10 / 100,
                items: concat(ItemService.tierOneSetItems(), ItemService.tierTwoSetItems()),
            },
            <IMonster>{
                name: 'Golden Guardian Wyrm',
                dropRate: 10 / 100,
                items: concat(ItemService.tierOneSetItems(), ItemService.tierTwoSetItems()),
            },
            <IMonster>{
                name: 'Quintessence Dragon',
                dropRate: 10 / 100,
                items: concat(ItemService.tierOneSetItems(), ItemService.tierTwoSetItems()),
            },
            <IMonster>{
                name: 'Basilisk',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems()),
            },
            <IMonster>{
                name: 'Three-Headed Hydra',
                dropRate: 5 / 100,
                items: concat(ItemService.tierTwoSetItems(), ItemService.tierThreeSetItems()),
            },
        ];
    }
}
