import assert from 'assert'
import { StateTypes, moveCardsReducer } from '../state'

const deckDefault = { id: 'TEST', cards: []}

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

const deck = (state = deckDefault, action) => {
    switch(action.type) {
        case 'MOVE_CARDS':
            return moveCardsReducer(state, action.cards)
        default:
            return state
    }
}

const shuffleDeck = (state = deckDefault, action, cards, randoms) => {
    switch(action.type) {
        case 'COMBINE_DECKS':
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

export default deck
export { deck, shuffleDeck }