import { combineReducers } from 'redux'
import cards from "./cards";
import hand from './hand'
import { decks, shuffleDecks } from './decks'
import { random, advanceRandom, randomList } from './random'
import timers from './timers'

const mainDeckId = (state = 0, action) => state
const discardDeckId = (state = 0, action) => state

const testApp = (state, action) => {
    switch(action.type) {
        // Call out anything requiring randomness or shuffling,
        // so that a slice of the random-sequence backbone can
        // be added to the reducer functions.
        case 'COMBINE_DECKS':
            let randomsNeeded = 
                state.decks.byId[action.source].cards.length + 
                state.decks.byId[action.destination].cards.length
            return {
                cards: cards(state.cards, action),
                hand: hand(state.hand, action),
                decks: shuffleDecks(
                    state.decks, 
                    action, 
                    state.decks.byId[action.source].cards, 
                    randomList(state.random, randomsNeeded)
                ),
                random: advanceRandom(state.random, action, randomsNeeded),
                timers: timers(state.timers, action),
                mainDeckId: mainDeckId(state.mainDeckId, action),
                discardDeckId: discardDeckId(state.discardDeckId, action)
            }
        default: return combineReducers({
            cards,
            hand,
            decks,
            random,
            timers,
            mainDeckId,
            discardDeckId
        })(state, action)        
    }
}

export default testApp