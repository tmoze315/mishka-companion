import { IMessage } from './discord/message';
import { inject } from '@alexlafroscia/service-locator';
import { IAdventureConfig } from './config/adventure';
import { Client, Collection, GuildMember } from 'discord.js';
import { Reward } from './models/Reward';
import isEmpty from 'lodash/isEmpty';
import sample from 'lodash/sample';
import concat from 'lodash/concat';
import { makeLootDroppedMessage } from './messages/loot-dropped';
import availableCommands from './config/available-commands';
import { makeItemRewardedMessage } from './messages/item-rewarded';
import { registry } from '@alexlafroscia/service-locator';

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

        registry.register('client', client);
        registry.register('guildMembers', this.guildMembers);

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

        // Fine the matching 'route' (aka which commands file and method to call)
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

        const updated = await Reward.findOneAndUpdate({ userId: user?.id, itemName: itemName, rewarded: false, guildId: this.message.guildId() }, { rewarded: true });

        if (!updated) {
            return;
        }

        const rewards = await Reward.find({ rewarded: false, guildId: this.message.guildId() });

        return this.message.send(makeItemRewardedMessage(rewards));
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
                guildId: this.message.guildId(),
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

    originalSetItems(): Array<IItem> {
        return [
            <IItem>{ name: 'Belt Of Ainz Ooal Gown', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Boots Of Ainz Ooal Gown', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Crown Of Ainz Ooal Gown', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Gauntlets Of Ainz Ooal Gown', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Heart Of Ainz Ooal Gown', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'Key To Ainz Ooal Gown', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Pants Of Ainz Ooal Gown', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Necklace Of Ainz Ooal Gown', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Ring Of Ainz Ooal Gown', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Staff Of Ainz Ooal Gown', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'Skrrtis Radiance', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Skrrtis Sandals', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Golden Dragonplate Boots', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Golden Dragonplate Chain', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Golden Dragonplate Hat', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Golden Dragonplate Pants', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Golden Dragonplate Thread', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Panified Saronite Armor', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Panified Saronite Battle Axe', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'Panified Saronite Gloves', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Panified Saronite Helmet', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Panified Saronite Ringlet', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Panified Saronite Shard', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Panified Saronite Skins', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Panified Saronite Thread', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Elven Mithril Amulet', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Elven Mithril Chain', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Elven Mithril Chainmail', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'Elven Mithril Dagger', stats: '', slot: 'left', type: 'set' },
            <IItem>{ name: 'Elven Mithril Gauntlets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Elven Mithril Hat', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Elven Mithril Leggings', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Elven Mithril Shard', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Elven Mithril Shoes', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Elven Mithril Thread', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Elven Mithril War Axe', stats: '', slot: 'right', type: 'set' },
            <IItem>{ name: 'Heavenly Unobtanium Belt', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Heavenly Unobtanium Ringlet', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Heavenly Unobtanium Scarf', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Heavenly Dragonbone Cap', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Heavenly Dragonbone Figurine', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Heavenly Dragonbone Leggings', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Heavenly Dragonbone Ringlet', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Heavenly Dragonbone Sandals', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Heavenly Dragonbone Sword', stats: '', slot: 'right', type: 'set' },
            <IItem>{ name: 'Heavenly Dragonbone Wand', stats: '', slot: 'left', type: 'set' },
            <IItem>{ name: 'Polished Duranium Axe', stats: '', slot: 'right', type: 'set' },
            <IItem>{ name: 'Polished Duranium Shard', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Chain', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Cuirass', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Gauntlets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Hat', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Necklace', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Ringlet', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Sandals', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Shard', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Skins', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony Wand', stats: '', slot: 'left', type: 'set' },
            <IItem>{ name: 'Masterwork Ebony War Axe', stats: '', slot: 'right', type: 'set' },
            <IItem>{ name: 'Godly Etherium Armor', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Godly Etherium Cap', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Godly Etherium Gauntlets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Godly Etherium Pants', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Armor', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Charm', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Figurine', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Greatsword', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Helmet', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Leggings', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Ring', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Shoes', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Shiny Dragonplate Gauntlets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Shiny Dragonplate Sling', stats: '', slot: 'left', type: 'set' },
            <IItem>{ name: 'Dreadnaught Gauntlets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'War Axe Of The Dreadnaught', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'Dreadnaught Helmet', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Dreadnaught Breastplate', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'Dreadnaught Sabatons', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Dreadnaught Waistguard', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Dreadnaught Legplates', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Necklace Of The Dreadnaught', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Ring Of The Dreadnaught', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Golad, Twilight Of Aspects', stats: '', slot: 'left', type: 'set' },
            <IItem>{ name: 'Tiriosh, Nightmare Of Ages', stats: '', slot: 'right', type: 'set' },
            <IItem>{ name: 'Vita-Charged Titanshard', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Void-Twisted Titanshard', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Demonbane Necklace', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Demonbane Katana', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'Demonbane Sabatons', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Demonbane Charm', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Demonbane Leggings', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Ring Of Demonbane', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'King Solomons Crown', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'King Solomons Torc', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'King Solomons Upper Robe', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'King Solomons Bracelets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'King Solomons Belt', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'King Solomons Lower Robe', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'King Solomons Shoes', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'King Solomons 10 Rings', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'King Solomons Markings', stats: '', slot: 'charm', type: 'set' },
        ];
    }

    newSetItems(): Array<IItem> {
        return [
            <IItem>{ name: 'Night Branches Bark Helm', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Night Branches Bark Belt', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Night Branches Bark Boots', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'The Demon Queens Signet', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'The Demon Queens Necklace', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Nightshade Helm', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Nightshade Armor', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'Nightshade Gloves', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Nightshade Boots', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Nightshade Sword', stats: '', slot: 'left', type: 'set' },
            <IItem>{ name: 'Nightshade Shield', stats: '', slot: 'right', type: 'set' },
            <IItem>{ name: 'Luckstone Necklace', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Luckstone Ring', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Brotherhood Helm', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Brotherhood Belt', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Brotherhood Armor', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'Brotherhood Gloves', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Brotherhood Boots', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Brotherhood Shield', stats: '', slot: 'right', type: 'set' },
        ];
    }

    monsters(): Array<IMonster> {
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
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Golden Draconid',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Black Wyrm',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Ice Wyvern',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Bronze Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Ice Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Aether Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Emerald Wyrm',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Nether Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Obsidian Drake',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Golden Wyrm',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Ruby Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Red Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Emerald Drake',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Lightning Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Silver Wyrm',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Elder Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Blood Wyrm',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Sandskin Wyvern',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Sea Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Night Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Golden Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Reanimated Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Bronze Wyrm',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Fire Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Jade Drake',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Bloodrage Drake',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Enraged Drake',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Crystal Drake',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Abyssal Drake',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Forest Drake',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Earth Dragon',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Viridian Amphithere',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Golden Amphitere',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Celestial Wyrm',
                dropRate: 5 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Golden Guardian Wyrm',
                dropRate: 100 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Quintessence Dragon',
                dropRate: 10 / 100,
                items: concat(this.originalSetItems(), this.newSetItems()),
            },
            <IMonster>{
                name: 'Basilisk',
                dropRate: 5 / 100,
                items: this.originalSetItems(),
            },
            <IMonster>{
                name: 'Three-Headed Hydra',
                dropRate: 5 / 100,
                items: this.originalSetItems(),
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