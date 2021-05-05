import { Reward } from "../models/Reward";
import BaseCommands from "./base-commands";
import { makeOutstandingRewardsMessage } from "../messages/outstanding-rewards";
import { ray } from "node-ray";
import { inject } from '@alexlafroscia/service-locator';
import { GuildMember } from "discord.js";

class GenericCommands extends BaseCommands {
    @inject guildMembers: any;

    async getOutstandingRewards(param: string) {
        const query = <any>{
            rewarded: false,
            guildId: this.message.guildId(),
        };

        let user = null;

        if (param === 'me') {
            query.userId = this.message.author().id;
            user = this.message.author();
        }

        if (param?.includes('<@!')) {
            query.userId = param.replace('<@!', '').replace('>', '');
            user = this.getUser(query.userId);
            user.username = user.displayName;
        }

        const rewards = await Reward.find(query);

        return this.message.send(makeOutstandingRewardsMessage(rewards, user));
    }

    getUser(userId: string) {
        return this.guildMembers?.find((member: GuildMember) => {
            return member.id === userId;
        });
    }
}

export { GenericCommands };
