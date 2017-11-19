import { deck, shuffleDeck } from './deck'

const decks = (state = { byId: {}, allIds: []}, action) => {
    let tempById = {}
    state.allIds.forEach((deckId) => {
        tempById[deckId] = deck(state.byId[deckId], action)
    })
    return {
        ...state,
        byId: tempById
    }
}

const shuffleDecks = (state = { byId: {}, allIds: []}, action, cards, randoms) => {
    let tempById = {}
    state.allIds.forEach((deckId) => {
        tempById[deckId] = shuffleDeck(state.byId[deckId], action, cards, randoms)
    })
    return {
        ...state,
        byId: tempById
    }
}

export default decks
export { decks, shuffleDecks }