import { GenericCommands } from '../commands/generic-commands';

export default {
    rewards: { class: GenericCommands, method: 'getOutstandingRewards' },
    atcadventurechannel: { class: GenericCommands, method: 'setAdventureChannel' },
    atcadventurebot: { class: GenericCommands, method: 'setAdventureBot' },
    atcenable: { class: GenericCommands, method: 'enable' },
    atcdisable: { class: GenericCommands, method: 'disable' },
}
