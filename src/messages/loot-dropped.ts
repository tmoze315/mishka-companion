import { MessageEmbed } from 'discord.js';

const makeLootDroppedMessage = (item: any, users: Array<any>) => {
    const desc = [
        `Admins: Give players their items with the following commands:`,
        ``,
    ];

    for (const user of users) {
        desc.push(`\`-give item ${user.id} "${item.name}" ${item.stats} ${item.type} ${item.slot}\``);
        desc.push(``);
    }

    return new MessageEmbed()
        .setTitle(`This monster dropped: **${item.name}**`)
        .setDescription(desc.join('\n'))
        .setColor('GOLD');
}

export { makeLootDroppedMessage };