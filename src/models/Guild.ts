import { Schema, model, Document } from 'mongoose';

interface IGuild extends Document {
    id: String;
    name: String;
    enabled: boolean,
    adventureChannelId: string,
    adventureBotId: string,

    enable: Function,
    disable: Function,
    setAdventureChannelId: Function,
    setAdventureBotId: Function,
}

const GuildSchema = new Schema({
    id: String,
    name: String,
    enabled: {
        type: Boolean,
        default: false,
    },
    adventureChannelId: String,
    adventureBotId: String,
});

GuildSchema.methods.enable = function () {
    this.enabled = true;

    return this.save();
};

GuildSchema.methods.disable = function () {
    this.enabled = false;

    return this.save();
};

GuildSchema.methods.setAdventureChannelId = function (channelId: string) {
    this.adventureChannelId = channelId;

    return this.save();
};

GuildSchema.methods.setAdventureBotId = function (botId: string) {
    this.adventureBotId = botId;

    return this.save();
};

const Guild = model<IGuild>('Guild', GuildSchema);

export { Guild, GuildSchema, IGuild };
