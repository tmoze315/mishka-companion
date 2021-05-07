import { GenericCommands } from '../commands/generic-commands';

export default {
    joke: { class: GenericCommands, method: 'playJoke' },
    jokes: { class: GenericCommands, method: 'playJoke' },

    jokeadd: { class: GenericCommands, method: 'addJoke' },
    jadd: { class: GenericCommands, method: 'addJoke' },

    jokedelete: { class: GenericCommands, method: 'deleteJoke' },
    jokeremove: { class: GenericCommands, method: 'deleteJoke' },
    jrm: { class: GenericCommands, method: 'deleteJoke' },

    clear: { class: GenericCommands, method: 'clear' },
    jchannel: { class: GenericCommands, method: 'setMishkaChannel' },
    jbot: { class: GenericCommands, method: 'setMishkaBot' },
    jenable: { class: GenericCommands, method: 'enable' },
    jdisable: { class: GenericCommands, method: 'disable' },
    jaddadmin: { class: GenericCommands, method: 'addAdmin' },
    jremoveadmin: { class: GenericCommands, method: 'removeAdmin' },

    jokeimport: { class: GenericCommands, method: 'importJokes' },
    jimport: { class: GenericCommands, method: 'importJokes' },
}
