interface IAdventureConfig {
    enabled: boolean,
    adminPassword: string,
    ownerId: string,
    prefix: string,
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
    ownerId: process.env.OWNER_ID,
    adminPassword: process.env.ADMIN_PASSWORD,
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
