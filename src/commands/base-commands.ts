import { IMessage } from "../discord/message";
import { IGuild } from "../models/Guild";
import { IReward } from "../models/Reward";
import { inject } from '@alexlafroscia/service-locator';

export default abstract class BaseCommands {
    @inject message: IMessage;
    @inject guild: IGuild;
    @inject reward: IReward;
}
