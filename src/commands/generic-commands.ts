import { Reward } from "../models/Reward";
import BaseCommands from "./base-commands";
import { makeOutstandingRewardsMessage } from "../messages/outstanding-rewards";

class GenericCommands extends BaseCommands {
    async getOutstandingRewards(param: string) {
        const query = <any>{ rewarded: false };
        let user = null;

        if (param === 'me') {
            query.userId = this.message.author().id;
            user = this.message.author();
        }

        const rewards = await Reward.find(query);

        return this.message.send(makeOutstandingRewardsMessage(rewards, user));
    }
    // async start() {
    //     const player: IPlayer | null = await Player.findOne({ id: this.message.author().id }).exec();

    //     if (player) {
    //         this.message.send('Looks like you have already started your adventure!');

    //         return;
    //     }

    //     const author = this.message.author();

    //     const newPlayer = new Player({
    //         id: author.id,
    //         guildId: this.guild.get('id'),
    //         username: author.username,
    //     });

    //     await newPlayer.save();

    //     this.message.send(`Hello`);
    // }
}

export { GenericCommands };
