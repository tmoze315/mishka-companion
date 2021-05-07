import { Schema, model, Document } from 'mongoose';

interface IGuild extends Document {
    id: String;
    name: String;
    enabled: boolean,
    mishkaChannelId: string,
    mishkaBotId: string,

    enable: Function,
    disable: Function,
    setMishkaChannelId: Function,
    setMishkaBotId: Function,
}

const GuildSchema = new Schema({
    id: String,
    name: String,
    enabled: {
        type: Boolean,
        default: false,
    },
    mishkaChannelId: String,
    mishkaBotId: String,
});

GuildSchema.methods.enable = function () {
    this.enabled = true;

    return this.save();
};

GuildSchema.methods.disable = function () {
    this.enabled = false;

    return this.save();
};

GuildSchema.methods.setMishkaChannelId = function (channelId: string) {
    this.mishkaChannelId = channelId;

    return this.save();
};

GuildSchema.methods.setMishkaBotId = function (botId: string) {
    this.mishkaBotId = botId;

    return this.save();
};

const Guild = model<IGuild>('Guild', GuildSchema);

export { Guild, GuildSchema, IGuild };
