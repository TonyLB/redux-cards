import { combineReducers } from 'redux'
import cards from "./cards";
import hand from './hand'
import { random, advanceRandom, randomList } from './random'
import { stacks, shuffleStacks } from './stacks'
import timers from './timers'
import tracks from './tracks'
import { combineDenormalizedObjects, listToDenormalized, denormalizedToList, StateTypes } from '../state'
import { moveCard, addCard } from '../actions'
import { CardTemplates, TemplateTypes } from "../state/CardTemplates"

const passThru = (defaultVal) => (state=defaultVal, action) => (state)

const sortStacks = (stacks = [], cards = { byId: {}, allIds: []} ) => {
    let result = [ ...stacks ]
    let cardSets = result.map(stack => (stack.cards))
    cardSets.sort((a, b) => (
        (b.length ? TemplateTypes.Priority[CardTemplates[cards.byId[b[0]].cardTemplate].type]: 0) -
        (a.length ? TemplateTypes.Priority[CardTemplates[cards.byId[a[0]].cardTemplate].type]: 0)
    ))
    result.forEach(stack => { stack.cards = cardSets.shift() })
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

const condenseAggregateCards = (stacks = [], cards = { byId: {}, allIds: [] }) => {
    for (let i = 0; i < stacks.length; i++) {
        let currentStack = stacks[i]
        let firstCard = currentStack.cards.length ? cards.byId[currentStack.cards[0]] : null
        let aggregatorTypes = firstCard ? CardTemplates[firstCard.cardTemplate].aggregates : []
        if ( aggregatorTypes && aggregatorTypes.length ) {
            let stacksToCheck = stacks.slice(i)
            let cardsToMove = aggregatorTypes.reduce((state, aggType) => (state.concat(
                listOfAggregatedCards(stacksToCheck, cards, aggType.cardTemplate, aggType.maxStack)
                )), [])
            if (cardsToMove.length) {
                stacks = aggregateStacks(stacks, cardsToMove, currentStack.id)
            }
        }
    }
    return stacks
}

const condenseHand = (state) => {
    let handStacks = listToDenormalized(state.hand.stacks.map((stackId) => state.stacks.byId[stackId]), StateTypes.Stack)
    return listToDenormalized(
            sortStacks(
                condenseAggregateCards(
                    sortStacks(
                        denormalizedToList(handStacks), 
                        state.cards
                    ), 
                    state.cards
                ),
                state.cards
            ), StateTypes.Stack)
}

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
    let newState = state.stacks.byId[stackId].cards.reduce((state, card) => (
        combinedReducer(state, moveCard(
            state.cards.byId[card].id,
            stackId,
            state.hand.discardId
        ))
    ), state)
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
        default: return combinedReducer(state, action)
    }
}

export default testApp