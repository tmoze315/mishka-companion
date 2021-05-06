interface IItem {
    name: string,
    stats: string,
    type: string,
    slot: string,
};

class ItemService {
    static tierOneSetItems(): Array<IItem> {
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

            <IItem>{ name: 'Vita-Charged Titanshard', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Void-Twisted Titanshard', stats: '', slot: 'ring', type: 'set' },

            <IItem>{ name: 'King Solomons Crown', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'King Solomons Torc', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'King Solomons Upper Robe', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'King Solomons Bracelets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'King Solomons Belt', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'King Solomons Lower Robe', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'King Solomons Shoes', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'King Solomons 10 Rings', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'King Solomons Markings', stats: '', slot: 'charm', type: 'set' },

            <IItem>{ name: 'Golad, Twilight Of Aspects', stats: '', slot: 'left', type: 'set' },
            <IItem>{ name: 'Tiriosh, Nightmare Of Ages', stats: '', slot: 'right', type: 'set' },
        ];
    }

    static tierTwoSetItems(): Array<IItem> {
        return [
            <IItem>{ name: 'Heavenly Unobtanium Belt', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Heavenly Unobtanium Ringlet', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Heavenly Unobtanium Scarf', stats: '', slot: 'neck', type: 'set' },

            <IItem>{ name: 'Skrrtis Radiance', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Skrrtis Sandals', stats: '', slot: 'boots', type: 'set' },

            <IItem>{ name: 'Dreadnaught Gauntlets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'War Axe Of The Dreadnaught', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'Dreadnaught Helmet', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Dreadnaught Breastplate', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'Dreadnaught Sabatons', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Dreadnaught Waistguard', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Dreadnaught Legplates', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Necklace Of The Dreadnaught', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Ring Of The Dreadnaught', stats: '', slot: 'ring', type: 'set' },
        ];
    }

    static tierThreeSetItems(): Array<IItem> {
        return [
            <IItem>{ name: 'Demonbane Necklace', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Demonbane Katana', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'Demonbane Sabatons', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Demonbane Charm', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Demonbane Leggings', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Ring Of Demonbane', stats: '', slot: 'ring', type: 'set' },

            <IItem>{ name: 'Golden Dragonplate Boots', stats: '', slot: 'boots', type: 'set' },
            <IItem>{ name: 'Golden Dragonplate Chain', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Golden Dragonplate Hat', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Golden Dragonplate Pants', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Golden Dragonplate Thread', stats: '', slot: 'neck', type: 'set' },

            <IItem>{ name: 'Ancient Obsidium Armor', stats: '', slot: 'chest', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Charm', stats: '', slot: 'neck', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Figurine', stats: '', slot: 'charm', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Greatsword', stats: '', slot: 'twohanded', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Helmet', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Leggings', stats: '', slot: 'legs', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Ring', stats: '', slot: 'ring', type: 'set' },
            <IItem>{ name: 'Ancient Obsidium Shoes', stats: '', slot: 'boots', type: 'set' },

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
        ];
    }

    static tierFourSetItems(): Array<IItem> {
        return [
            <IItem>{ name: 'Shiny Dragonplate Gauntlets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Shiny Dragonplate Sling', stats: '', slot: 'left', type: 'set' },

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

            <IItem>{ name: 'Godly Etherium Armor', stats: '', slot: 'belt', type: 'set' },
            <IItem>{ name: 'Godly Etherium Cap', stats: '', slot: 'head', type: 'set' },
            <IItem>{ name: 'Godly Etherium Gauntlets', stats: '', slot: 'gloves', type: 'set' },
            <IItem>{ name: 'Godly Etherium Pants', stats: '', slot: 'legs', type: 'set' },
        ];
    }

    static newSetItems(): Array<IItem> {
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
}

export { ItemService, IItem };
