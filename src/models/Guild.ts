import { Schema, model, Document } from 'mongoose';

interface IGuild extends Document {
    id: String;
    name: String;
    isLocked: boolean,

    lock: Function,
    unlock: Function,
}

const GuildSchema = new Schema({
    id: String,
    name: String,
    isLocked: {
        type: Boolean,
        default: false,
    }
});

GuildSchema.methods.lock = function () {
    this.isLocked = true;

    return this.save();
};

GuildSchema.methods.unlock = function () {
    this.isLocked = false;

    return this.save();
};

const Guild = model<IGuild>('Guild', GuildSchema);

export { Guild, GuildSchema, IGuild };
