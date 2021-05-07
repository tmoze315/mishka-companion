import { GenericCommands } from '../commands/generic-commands';

export default {
    joke: { class: GenericCommands, method: 'playJoke' },
    jokes: { class: GenericCommands, method: 'playJoke' },
    addjoke: { class: GenericCommands, method: 'addJoke' },
    clear: { class: GenericCommands, method: 'clear' },
    jchannel: { class: GenericCommands, method: 'setMishkaChannel' },
    jbot: { class: GenericCommands, method: 'setMishkaBot' },
    jenable: { class: GenericCommands, method: 'enable' },
    jdisable: { class: GenericCommands, method: 'disable' },
}
