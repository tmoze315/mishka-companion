import { Schema, model, Document } from 'mongoose';
import { FunnyResponseSchema, IFunnyResponse } from './FunnyResponse';

interface IGame extends Document {
    guildId: string | null,
    startedBy: string,
    winner: string,
    ended: boolean,
    jokeSetup: string,
    funniestResponses: [string],

    end: Function,
}

const GameSchema = new Schema({
    guildId: {
        type: String,
        required: false,
        default: null,
    },
    startedBy: {
        type: String,
        required: true,
    },
    winner: String,
    ended: {
        type: Boolean,
        default: false,
        required: false,
    },
    jokeSetup: String,
    funniestResponses: [FunnyResponseSchema],
});

GameSchema.methods.end = function (winnerId: string | null = null, funniestResponses: Array<string> = []) {
    this.ended = true;
    this.winner = winnerId;
    this.funniestResponses = funniestResponses;

    return this.save();
};


const Game = model<IGame>('Game', GameSchema);

export { Game, GameSchema, IGame };
