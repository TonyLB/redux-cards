import assert from 'assert'

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
        case 'MOVE_CARDS':
            assert(action.stacks === null || Array.isArray(action.stacks))
            return action.stacks ?
            {
                ...state,
                stacks: action.stacks
            } :
            state
        default:
            return state
    }
}

export default hand