import { Message as DiscordMessage } from 'discord.js';
import { IGuild } from '../../models/Guild';
import { IMessage } from '../message';
import { User } from '../user';
import { MessageFactory } from '../__helpers__/jest.factories';

class Message implements IMessage {
    public _guild: IGuild | null = null;
    public _isFromBot: boolean = false;
    public _content: string = '';
    private _nextSendMessage: Message;

    constructor(private discordMessage: DiscordMessage) { }

    content(): string {
        return this._content;
    }

    original(): DiscordMessage {
        return this.discordMessage;
    }

    author(): User {
        return new User(1, 'testing-user');
    }

    guildId(): string | null {
        return this._guild?.get('id') || null;
    }

    isFromBot(): boolean {
        return this._isFromBot || false;
    }

    setNextSendMessage(message: Message) {
        this._nextSendMessage = message;
    }

    send(data: any): Promise<any> {
        return Promise.resolve().then(() => {
            return this._nextSendMessage;
        });
    }

    async edit(data: any): Promise<any> {
        return data;
    }
}

export { Message }
