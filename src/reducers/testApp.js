import { combineReducers } from 'redux'
import cards from "./cards";
import hand from './hand'
import { random, advanceRandom, randomList } from './random'
import { stacks, shuffleStacks } from './stacks'
import timers from './timers'
import tracks from './tracks'
import { moveCards, addCard } from '../actions'
import { CardTemplates, TemplateTypes } from "../state/CardTemplates"

const passThru = (defaultVal) => (state=defaultVal, action) => (state)

const fullAggregators = (state) => {
    let stacks = state.hand.stacks.map((stackId) => state.stacks.byId[stackId])
    return stacks
        .filter(stack => (
            (stack.cards.length > 0) &&
            (CardTemplates[state.cards.byId[stack.cards[0]].cardTemplate].type === TemplateTypes.Aggregator) &&
            (CardTemplates[state.cards.byId[stack.cards[0]].cardTemplate].aggregates
                    .reduce((result, val) => ( result + val.maxStack), 0) < stack.cards.length)
        ))
        .map(stack => ( stack.id ))
}

const combinedReducer = combineReducers({
    cards,
    hand,
    random,
    stacks,
    timers,
    tracks,
    trackId: passThru('TEST')
})

const activateAggregator = (state, stackId) => {
    let purchases = CardTemplates[state.cards.byId[state.stacks.byId[stackId].cards[0]].cardTemplate].purchases
    let newState = combinedReducer(state, moveCards(state.stacks.byId[stackId].cards.map(card => ({
        id: state.cards.byId[card].id,
        source: stackId,
        destination: state.hand.discardId
    }))))
    return purchases.reduce((priorState, purchase) => (
            combinedReducer(priorState, addCard(purchase.cardTemplate, state.hand.discardId))
        ), newState)
}

const testApp = (state, action) => {
    switch(action.type) {
        case 'CHECK_HAND':
            let purchaseStacks = fullAggregators(state)
            let newState = purchaseStacks.reduce(activateAggregator, state)
            return newState
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
        default: return combinedReducer(state, action)
    }
}

export default testApp