import { StateTypes, moveItemReducer } from '../state'

const trackDefault = { id: 'TEST', cards: [], deck: 'NULL-STACK'}

const track = (state = trackDefault, action) => {
    switch(action.type) {
        case 'MOVE_CARD':
            return moveItemReducer(state, StateTypes.Card, action.cardId, action.destination, action.source)
        default:
            return state
    }
}

export default track