import { StateTypes, moveItemReducer } from '../state'

const hand = (state = {id: 'TEST', stacks: [], timerId: 0, timerStarted: new Date(), drawDeck: 'NULL-STACK', discardDeck: 'NULL-STACK'}, action) => {
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