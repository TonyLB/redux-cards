import { StateTypes, moveItemReducer } from '../state'

const hand = (state = {id: 'TEST', cards: [], timerId: 0, timerStarted: new Date()}, action) => {
    switch(action.type) {
        case 'START_TIMER':
            return (state.timerId !== action.id) ?
                state :
                {
                    ...state,
                    timerStarted: new Date()
                }
        case 'MOVE_CARD':
            return moveItemReducer(state, StateTypes.Card, action.cardId, action.destination, action.source)
        default:
            return state
    }
}

export default hand