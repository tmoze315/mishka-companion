import { MessageEmbed } from 'discord.js';
import capitalize from 'lodash/capitalize';

const makeOutstandingRewardsMessage = (rewards: any, user: any) => {
    if (rewards.length === 0) {
        let desc = 'All rewards have been claimed.';

        if (user) {
            desc = `${user.username}, all of your rewards have been claimed.`;
        }

        return new MessageEmbed()
            .setDescription(desc)
            .setColor('GREEN');
    }

    const desc = [];

    for (const reward of rewards) {
        if (user) {
            desc.push(`**${capitalize(reward.itemType)}:** "${reward.itemName}" (${reward.itemSlot})`);
        } else {
            desc.push(`\`-give item ${reward.userId} "${reward.itemName}" ${reward.itemStats} ${reward.itemType} ${reward.itemSlot}\``);
        }

        desc.push(``);
    }

    let title = `${rewards.length} outstanding reward(s)`;

    if (user) {
        title = `${user.username}, you have ${rewards.length} outstanding reward(s)`;
    }

    return new MessageEmbed()
        .setTitle(title)
        .setDescription(desc.join('\n'))
        .setColor('GOLD');
}

export { makeOutstandingRewardsMessage };