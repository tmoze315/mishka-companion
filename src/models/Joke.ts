import { Schema, model, Document } from 'mongoose';

interface IJoke extends Document {
    guildId: string | null,
    jokeId: number | null,
    type: string,
    setup: string,
    punchline: string,
    addedBy: string,
}

const JokeSchema = new Schema({
    guildId: {
        type: String,
        required: false,
        default: null,
    },
    jokeId: {
        type: Number,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    setup: {
        type: String,
        required: true,
    },
    punchline: {
        type: String,
        required: true,
    },
    addedBy: {
        type: String,
        required: true,
    },
});

const Joke = model<IJoke>('Joke', JokeSchema);

export { Joke, JokeSchema, IJoke };
