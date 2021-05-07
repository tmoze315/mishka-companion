import { MessageEmbed } from 'discord.js';

const makeErrorMessage = (message: string) => {
    return new MessageEmbed()
        .setDescription(message)
        .setColor('#FF9999');
}

export { makeErrorMessage };