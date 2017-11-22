import { combineReducers } from 'redux'
import cards from "./cards";
import hand from './hand'
import { random, advanceRandom, randomList } from './random'
import { stacks, condenseHand, shuffleStacks } from './stacks'
import timers from './timers'

const testApp = (state, action) => {
    switch(action.type) {
        case 'CONDENSE_HAND':
            return {
                cards: cards(state.cards, action),
                hand: hand(state.hand, action),
                random: random(state.random, action),
                stacks: condenseHand(state.stacks, action, state.hand),
                timers: timers(state.timers, action)
            }
        // Call out anything requiring randomness or shuffling,
        // so that a slice of the random-sequence backbone can
        // be added to the reducer functions.
        case 'COMBINE_STACKS':
            let randomsNeeded = 
                state.stacks.byId[action.source].cards.length + 
                state.stacks.byId[action.destination].cards.length
            return {
                cards: cards(state.cards, action),
                hand: hand(state.hand, action),
                random: advanceRandom(state.random, action, randomsNeeded),
                stacks: shuffleStacks(
                    state.stacks, 
                    action, 
                    state.stacks.byId[action.source].cards, 
                    randomList(state.random, randomsNeeded)
                ),
                timers: timers(state.timers, action)
            }
        default: return combineReducers({
            cards,
            hand,
            random,
            stacks,
            timers
        })(state, action)        
    }
}

export default testApp