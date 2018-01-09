import assert from 'assert'
import { moveCardsReducer } from '../state'

const stackDefault = { id: 'TEST', cards: []}

const shuffleArray = (start, randoms) => {
    let temp = [...start]
    let final = []
    assert(temp.length === randoms.length)
    for(let x = 0; x < randoms.length; x++) {
        let probe = Math.floor(randoms[x]*temp.length)
        final.push(temp[probe])
        temp.splice(probe, 1)
    }
    return final
}

const shuffleStack = (state = stackDefault, action, cards, randoms) => {
    switch(action.type) {
        case 'COMBINE_STACKS':
            return {
                ...state,
                cards: (action.source === state.id) ?
                    [] :
                    (action.destination === state.id) ?
                        shuffleArray([...state.cards, ...cards], randoms) :
                        state.cards
            }
        default:
            return state
    }
}

const stack = (state = stackDefault, action = { type: 'NULL' }) => {
    switch(action.type) {
        case 'ADD_CARDS':
        case 'MOVE_CARDS':
            return moveCardsReducer(state, action.cards)
        case 'LOCK_STACK':
            return action.stackId === state.id ? {
                ...state,
                locked: true
            }
            : state
        case 'UNLOCK_STACK':
            return action.stackId === state.id ? {
                ...state,
                locked: false
            }
            : state
        default:
            return state
    }
}

export default stack
export { stack, shuffleStack }