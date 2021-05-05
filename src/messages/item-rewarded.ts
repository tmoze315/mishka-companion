import { MessageEmbed } from 'discord.js';
import { Reward } from '../models/Reward';

const makeItemRewardedMessage = async () => {
    const rewards = await Reward.find({ rewarded: false });

    return new MessageEmbed()
        .setDescription(`Item rewarded successfully. There are ${rewards.length} outstanding rewards.`)
        .setColor('GREEN');
}

export { makeItemRewardedMessage };