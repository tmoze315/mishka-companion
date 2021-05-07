import { Schema, model, Document } from 'mongoose';

interface IGame extends Document {
    guildId: string | null,
    startedBy: string,
    winner: string,
    ended: boolean,

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
});

GameSchema.methods.end = function (winnerId: string | null = null) {
    this.ended = true;
    this.winner = winnerId;

    return this.save();
};


const Game = model<IGame>('Game', GameSchema);

export { Game, GameSchema, IGame };
