import { Message } from 'discord.js';
import { Client } from 'discord.js';
import { Config } from '../config/adventure';

class Discord {
    private client: Client | null = null;

    login(messageCallback: CallableFunction): Promise<any> {
        return new Promise((resolve) => {
            this.client = new Client();

            this.client.on('message', (message: Message) => {
                messageCallback(message, this.client);
            });

            this.client.on('ready', () => {
                console.log('Bot successfully loaded.');

                resolve();
            });

            this.client.login(Config.discord.key);
        });
    }
}

export { Discord };