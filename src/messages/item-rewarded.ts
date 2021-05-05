import { MessageEmbed } from 'discord.js';

const makeItemRewardedMessage = (rewards: any) => {
    return new MessageEmbed()
        .setDescription(`Item rewarded successfully. There are ${rewards.length} outstanding reward(s).`)
        .setColor('GREEN');
}

export { makeItemRewardedMessage };