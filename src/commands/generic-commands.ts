import { Reward } from "../models/Reward";
import BaseCommands from "./base-commands";
import { makeOutstandingRewardsMessage } from "../messages/outstanding-rewards";
import { ray } from "node-ray";
import { GuildMember } from "discord.js";
import { makeSuccessMessage } from "../messages/success";
import { makeErrorMessage } from "../messages/error";

class GenericCommands extends BaseCommands {
    async getOutstandingRewards(param: string) {
        const query = <any>{
            rewarded: false,
            guildId: this.guild.id,
        };

        let user = null;

        if (param === 'me') {
            query.userId = this.message.author().id;
            user = this.message.author();
        }

        if (param?.includes('<@!') || param?.includes('<@&')) {
            query.userId = param.replace('<@!', '').replace('>', '').replace('<@&', '');
            user = this.getUser(query.userId);
            user.username = user?.displayName;
        }

        const rewards = await Reward.find(query);

        return this.message.send(makeOutstandingRewardsMessage(rewards, user));
    }

    getUser(userId: string) {
        return this.guildMembers?.find((member: GuildMember) => {
            return member.id === userId;
        });
    }

    async setAdventureChannel(channelId: string | null) {
        if (!channelId) {
            channelId = this.message.original().channel.id;
        } else {
            channelId = channelId.replace('<#', '').replace('>', '');
        }

        await this.guild.setAdventureChannelId(channelId);

        return this.message.send(makeSuccessMessage(`Adventure channel set.`));
    }

    async setAdventureBot(botId: string | null) {
        if (!botId) {
            return this.message.send(makeErrorMessage(`Please mention the bot.`));
        }

        botId = botId.replace('<@!', '').replace('>', '').replace('<@&', '');

        await this.guild.setAdventureBotId(botId);

        return this.message.send(makeSuccessMessage(`Adventure bot set.`));
    }

    async enable() {
        if (!this.guild.adventureChannelId || !this.guild.adventureBotId) {
            return this.message.send(makeErrorMessage(`Please select an adventure channel and bot first.`));
        }

        await this.guild.enable();

        return this.message.send(makeSuccessMessage(`Bot enabled.`));
    }

    async disable() {
        await this.guild.disable();

        return this.message.send(makeSuccessMessage(`Bot disabled.`));
    }
}

export { GenericCommands };
