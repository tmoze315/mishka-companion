import { Schema, model, Document } from 'mongoose';

interface IGuild extends Document {
    id: String;
    name: String;
    enabled: boolean,
    mishkaChannelId: string,
    mishkaBotId: string,
    admins: [string],

    enable: Function,
    disable: Function,
    setMishkaChannelId: Function,
    setMishkaBotId: Function,
    addAdmin: Function,
    removeAdmin: Function,
    isAdmin: Function,
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
    admins: [String],
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

GuildSchema.methods.addAdmin = function (adminId: string) {
    adminId = adminId.replace('<@!', '').replace('>', '').replace('<@&', '').trim();

    this.admins.push(adminId);

    this.admins = [...new Set(this.admins)];

    return this.save();
};

GuildSchema.methods.removeAdmin = function (adminId: string) {
    adminId = adminId.replace('<@!', '').replace('>', '').replace('<@&', '').trim();

    this.admins = this.admins.filter((id: string) => {
        return id != adminId;
    });

    return this.save();
};

GuildSchema.methods.isAdmin = function (adminId: string) {
    adminId = adminId.replace('<@!', '').replace('>', '').replace('<@&', '').trim();

    return this.admins.includes(adminId);
};

const Guild = model<IGuild>('Guild', GuildSchema);

export { Guild, GuildSchema, IGuild };
