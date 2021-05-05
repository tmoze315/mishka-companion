import { Schema, model, Document } from 'mongoose';

interface IReward extends Document {
    guildId: string,
    userId: string,
    username: string,
    itemName: string,
    itemStats: string,
    itemType: string,
    itemSlot: string,
    rewarded: boolean,
}

const RewardSchema = new Schema({
    guildId: {
        type: String,
    },
    userId: {
        type: String,
    },
    username: {
        type: String,
    },
    itemName: {
        type: String,
    },
    itemStats: {
        type: String,
    },
    itemType: {
        type: String,
    },
    itemSlot: {
        type: String,
    },
    rewarded: {
        type: Boolean,
        default: false,
    },
});

const Reward = model<IReward>('Reward', RewardSchema);

export { Reward, RewardSchema, IReward };
