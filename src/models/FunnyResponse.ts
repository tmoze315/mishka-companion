import { Schema, model, Document } from 'mongoose';

interface IFunnyResponse extends Document {
    guildId: string | null,
    user: string,
    setup: string,
    punchline: string,
    votes: number,
}

const FunnyResponseSchema = new Schema({
    guildId: {
        type: String,
        required: false,
        default: null,
    },
    user: String,
    setup: String,
    punchline: String,
    votes: Number,
});

const FunnyResponse = model<IFunnyResponse>('FunnyResponse', FunnyResponseSchema);

export { FunnyResponse, FunnyResponseSchema, IFunnyResponse };
