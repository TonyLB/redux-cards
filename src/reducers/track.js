import { moveCardsReducer } from '../state'

const trackDefault = { id: 'TEST', cards: [], deck: 'NULL-STACK'}

const track = (state = trackDefault, action) => {
    switch(action.type) {
        case 'MOVE_CARDS':
            return moveCardsReducer(state, action.cards)
        default:
            return state
    }
}

export default track