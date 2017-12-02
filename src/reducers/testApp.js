import { combineReducers } from 'redux'
import cards from "./cards";
import hand from './hand'
import { random, advanceRandom, randomList } from './random'
import settings from './settings'
import { stacks, shuffleStacks } from './stacks'
import timers from './timers'
import tracks from './tracks'

const testApp = (state, action, simulated=false) => {
    switch(action.type) {
        // Call out anything requiring randomness or shuffling,
        // so that a slice of the random-sequence backbone can
        // be added to the reducer functions.
        case 'COMBINE_STACKS':
            let randomsNeeded = 
                state.stacks.byId[action.source].cards.length + 
                state.stacks.byId[action.destination].cards.length
            return {
                ...state,
                random: advanceRandom(state.random, action, randomsNeeded),
                stacks: shuffleStacks(
                    state.stacks, 
                    action, 
                    state.stacks.byId[action.source].cards, 
                    randomList(state.random, randomsNeeded)
                ),
            }
        default: return combineReducers({
            cards,
            hand,
            random,
            settings,
            stacks,
            timers,
            tracks
        })(state, action)
    }
}

export default testApp