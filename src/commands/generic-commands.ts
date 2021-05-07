import BaseCommands from "./base-commands";
import { makeSuccessMessage } from "../messages/success";
import { makeErrorMessage } from "../messages/error";
import { Game } from "../models/Game";
import { MessageEmbed } from "discord.js";
import stringSimilarity from 'string-similarity';
import { ray } from "node-ray";
import { Joke } from "../models/Joke";

class GenericCommands extends BaseCommands {
    async playJoke() {
        if (this.guild.enabled !== true) {
            return;
        }

        const activeGames = await Game.find({ guildId: this.message.guildId(), ended: false });

        if (activeGames.length > 0) {
            return this.message.send(makeErrorMessage('Please wait until the game is over, before starting a new one!'));
        }

        const jokes = await Joke.aggregate([
            { $match: { guildId: this.message.guildId() } },
            { $sample: { size: 1 } },
        ]);

        if (!jokes || jokes.length < 1) {
            return this.message.send(makeErrorMessage('Oops, I couldn\'t find any jokes. Try adding one with `m/addjoke`'));
        }

        const joke = jokes[0];

        const game = new Game({
            guildId: this.guild.id,
            startedBy: this.message.author().id,
            winner: null,
            ended: false,
        });

        await game.save();

        const message = new MessageEmbed()
            .setTitle(`What's the punch line for this joke (#${joke.jokeId})?`)
            .setDescription(`
            **${joke?.setup}**

            Reply with your best guesses!
            `)
            .setFooter(`You have 1 minute to share your answers.`)
            .setColor('#61C5A9')

        const message2 = await this.message.send(message);

        try {
            let similarity = 0;

            const filter = (response: any) => {
                similarity = stringSimilarity.compareTwoStrings(response.content.toLowerCase(), joke.punchline.toLowerCase());

                return similarity >= 0.55;
            };

            const correctMessages = await message2.channel.awaitMessages(filter, { max: 1, time: 20000, errors: ['time'] });

            const updatedGame = await Game.findById(game.id);

            if (updatedGame?.ended === true) {
                return;
            }

            const correctMessage = correctMessages.first();

            await game.end(correctMessage.author.id);

            if (similarity >= 0.99) {
                return this.message.send(makeSuccessMessage(`${correctMessage.author}, you got it bang on! Awesome job  🦾`));
            }

            return this.message.send(makeSuccessMessage(`Close enough ${correctMessage.author}! Good job. The answer I was looking for was:
            
            **${joke.punchline}**`));
        } catch (error) {
            const updatedGame = await Game.findById(game.id);

            if (updatedGame?.ended === true) {
                return;
            }

            await game.end();

            return this.message.send(makeErrorMessage(`Nobody guessed it! The answer I was looking for was:
            
            **${joke.punchline}**`));
        }
    }

    async addJoke(jokeData: string | null) {
        if (this.guild.enabled !== true) {
            return;
        }

        if (!jokeData) {
            return this.message.send(makeErrorMessage(`You can add a joke using the following format: \`m/addjoke "This is the setup" "This is the punchline" category-name\``));
        }

        const regex = new RegExp(/"(.*)" "(.*)" (.*)/gm);
        const matches = regex.exec(jokeData);

        if (!matches || matches.length !== 4) {
            return this.message.send(makeErrorMessage(`You can add a joke using the following format: \`m/addjoke "This is the setup" "This is the punchline" category-name\``));
        }

        const [, setup, punchline, type] = matches;

        const addedBy = this.message.author().id;

        const jokeWithBiggestId = await Joke.find({ guildId: this.message.guildId() }).sort({ jokeId: -1 }).limit(1);
        let biggestJokeId = 0;

        if (jokeWithBiggestId.length > 0) {
            biggestJokeId = jokeWithBiggestId[0]?.jokeId || 0;
        }

        const jokeId = biggestJokeId + 1;

        const joke = new Joke({
            guildId: this.message.guildId(),
            jokeId,
            addedBy,
            setup,
            punchline,
            type
        });

        await joke.save();

        return this.message.send(makeSuccessMessage(`Joke (#${jokeId}) successfully added!`));
    }

    async clear() {
        await Game.updateMany({ guildId: this.message.guildId(), ended: false }, { $set: { ended: true } });

        return this.message.send(makeSuccessMessage(`All active joke games have been ended.`));
    }

    async setMishkaChannel(channelId: string | null) {
        if (this.message.author().id != this.Config.ownerId) {
            return;
        }

        if (!channelId) {
            channelId = this.message.original().channel.id;
        } else {
            channelId = channelId.replace('<#', '').replace('>', '');
        }

        await this.guild.setMishkaChannelId(channelId);

        return this.message.send(makeSuccessMessage(`Mishka channel set.`));
    }

    async setMishkaBot(botId: string | null) {
        if (this.message.author().id != this.Config.ownerId) {
            return;
        }

        if (!botId) {
            return this.message.send(makeErrorMessage(`Please mention the bot.`));
        }

        botId = botId.replace('<@!', '').replace('>', '').replace('<@&', '');

        await this.guild.setMishkaBotId(botId);

        return this.message.send(makeSuccessMessage(`Mishka bot set.`));
    }

    async enable() {
        if (this.message.author().id != this.Config.ownerId) {
            return;
        }

        if (!this.guild.mishkaChannelId || !this.guild.mishkaBotId) {
            return this.message.send(makeErrorMessage(`Please select a channel and bot first.`));
        }

        await this.guild.enable();

        return this.message.send(makeSuccessMessage(`Bot enabled.`));
    }

    async disable() {
        if (this.message.author().id != this.Config.ownerId) {
            return;
        }

        await this.guild.disable();

        return this.message.send(makeSuccessMessage(`Bot disabled.`));
    }
}

export { GenericCommands };
