import { GenericCommands } from '../commands/generic-commands';

export default {
    rewards: { class: GenericCommands, method: 'getOutstandingRewards' },
    ateadventurechannel: { class: GenericCommands, method: 'setAdventureChannel' },
    ateadventurebot: { class: GenericCommands, method: 'setAdventureBot' },
    ateenable: { class: GenericCommands, method: 'enable' },
    atedisable: { class: GenericCommands, method: 'disable' },
}
