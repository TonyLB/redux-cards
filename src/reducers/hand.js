import assert from 'assert'

const hand = (state = {
        id: 'TEST', 
        stacks: [], 
        timerId: 'NULL-TIMER', 
        timerStarted: Date.parse("May 25, 1977"), 
        drawDeck: 'NULL-STACK', 
        discardDeck: 'NULL-STACK'}, action={type: 'NULL'}) => {
    switch(action.type) {
        case 'START_TIMER':
            return (state.timerId !== action.id) ?
                state :
                {
                    ...state,
                    timerStarted: action.startTime
                }
        case 'SORT_HAND':
        case 'MOVE_CARDS':
            assert(action.stacks === null || action.stacks === undefined || Array.isArray(action.stacks))
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