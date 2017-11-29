import { moveCardsReducer } from '../state'

const hand = (state = {id: 'TEST', stacks: [], timerId: 0, timerStarted: new Date(), drawDeck: 'NULL-STACK', discardDeck: 'NULL-STACK'}, action) => {
    switch(action.type) {
        case 'START_TIMER':
            return (state.timerId !== action.id) ?
                state :
                {
                    ...state,
                    timerStarted: new Date()
                }
        case 'SORT_HAND':
            return {
                ...state,
                stacks: action.stacks
            }
        case 'REMOVE_CARDS':
        case 'MOVE_CARDS':
            return moveCardsReducer(state, action.cards)
        default:
            return state
    }
}

export default hand