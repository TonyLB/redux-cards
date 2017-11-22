import { StateTypes, moveItemReducer } from '../state'

const stack = (state = {id: 'TEST', cards: [] }, action) => {
    switch(action.type) {
        case 'MOVE_CARD':
            return moveItemReducer(state, StateTypes.Card, action.cardId, action.destination, action.source)
        default:
            return state
    }
}

export default stack