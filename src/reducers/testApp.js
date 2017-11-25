import { combineReducers } from 'redux'
import cards from "./cards";
import hand from './hand'
import { random, advanceRandom, randomList } from './random'
import { stacks, shuffleStacks } from './stacks'
import timers from './timers'
import tracks from './tracks'
import { combineDenormalizedObjects, listToDenormalized, denormalizedToList, StateTypes } from '../state'
import CardTemplates from "../state/CardTemplates"

const passThru = (defaultVal) => (state=defaultVal, action) => (state)

const condenseEmptyStacks = (stacks = []) => {
    let result = [ ...stacks ]
    for (let a = 0; a < result.length; a++) {
        let destStack = result[a]
        if (destStack.cards.length === 0) {
            for (let b = a+1; b < result.length; b++) {
                let sourceStack = result[b]
                if (sourceStack.cards.length) {
                    destStack.cards = sourceStack.cards
                    sourceStack.cards = []
                    break;
                }
            }
        }
    }
    return result
}

const aggregateStacks = (stacks = [], cards = [], destinationStack) => (
    stacks.map((stack) => ({
        ...stack,
        cards: stack.cards
            .filter(card => (!cards.includes(card)))
            .concat((stack.id === destinationStack) ? cards : [])
    }))
)

const listOfAggregatedCards = (stacks, cards, cardTemplate, maxStack) => ( 
    stacks
        .reduce((state, stack) => (state.concat(stack.cards)), [])
        .filter(card => (cards.byId[card].cardTemplate === cardTemplate))
        .slice(0,maxStack)
)

const condenseAggregateCards = (stacks = { byId: {}, allIds: []}, cards = { byId: {}, allIds: [] }) => {
    let state = denormalizedToList(stacks)
    for (let i = 0; i < state.length; i++) {
        let currentStack = state[i]
        let firstCard = currentStack.cards.length ? cards.byId[currentStack.cards[0]] : null
        let aggregatorTypes = firstCard ? CardTemplates[firstCard.cardTemplate].aggregates : []
        if ( aggregatorTypes && aggregatorTypes.length ) {
            let stacksToCheck = state.slice(i)
            let cardsToMove = aggregatorTypes.reduce((state, aggType) => (state.concat(
                listOfAggregatedCards(stacksToCheck, cards, aggType.cardTemplate, aggType.maxStack)
                )), [])
            if (cardsToMove.length) {
                state = aggregateStacks(state, cardsToMove, currentStack.id)                
            }
        }
    }
    return state
}

const condenseHand = (state) => {
    let handStacks = listToDenormalized(state.hand.stacks.map((stackId) => state.stacks.byId[stackId]), StateTypes.Stack)
    return listToDenormalized(condenseEmptyStacks(condenseAggregateCards(handStacks, state.cards)), StateTypes.Stack)
} 

const testApp = (state, action) => {
    switch(action.type) {
        case 'CONDENSE_HAND':
            return {
                ...state,
                stacks: combineDenormalizedObjects(state.stacks, condenseHand(state)),
            }
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
            stacks,
            timers,
            tracks,
            trackId: passThru('TEST')
        })(state, action)        
    }
}

export default testApp