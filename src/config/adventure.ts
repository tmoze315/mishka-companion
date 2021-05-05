interface IAdventureConfig {
    enabled: boolean,
    adminPassword: string,
    prefix: string,
    guildId: string,
    adventureBotId: string,
    adventureChannelId: string,
    discord: {
        key: string,
    },
    mongodb: {
        url: string,
        useCreateIndex: boolean,
        autoIndex: boolean,
    },
};

const AdventureConfig = <IAdventureConfig>{
    enabled: process.env.ENABLED === 'true' || false,
    adminPassword: process.env.ADMIN_PASSWORD,
    guildId: process.env.GUILD_ID,
    adventureBotId: process.env.ADVENTURE_BOT_ID,
    adventureChannelId: process.env.ADVENTURE_CHANNEL_ID,
    prefix: process.env.PREFIX || '-',
    discord: {
        key: process.env.DISCORD_KEY,
    },
    mongodb: {
        url: process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/adventuretimeevents',
        useCreateIndex: process.env.MONGODB_CREATE_INDEX || true,
        autoIndex: process.env.MONGODB_AUTO_INDEX || true,
    },
};

export { AdventureConfig, IAdventureConfig }
