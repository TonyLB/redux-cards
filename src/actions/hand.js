import CardTemplates from '../state/CardTemplates'
import { moveCards, useCards, addCard } from './index'

const handPriority = (state, stack) => (
    state.stacks.byId[stack].cards.length ? 
        CardTemplates[state.cards.byId[state.stacks.byId[stack].cards[0]].cardTemplate].type 
            === CardTemplates.Types.Aggregator ? 0 : 1
    : 2
)

export const sortHand = () => (dispatch, getState) => {
    let state = getState()
    let stacks = [ ...state.hand.stacks ]
    stacks.sort((a, b) => (
        handPriority(state, a) - handPriority(state, b)
    ))
    if (stacks.some((val, index) => ( state.hand.stacks[index] !== val ))) {
        dispatch({
            type: 'SORT_HAND',
            stacks: stacks
        })
    }
}

const listOfAggregatedCards = (stacks, cards, cardTemplate, maxStack) => ( 
    stacks
        .reduce((state, stack, index) => 
            (state.concat(
                stack.cards
                    .map(card => ({ 
                        card: card, 
                        stack: stack.id, 
                        stackNum: index}))
                    )
            ), 
            [])
        .filter(card => (cards.byId[card.card].cardTemplate === cardTemplate))
        .slice(0,maxStack)
)

//
// The condenseSortedHand function applies the aggregator rules of
// any control cards, to snarf cards further than them in the
// hand, and pull them into the aggregate.
//
const condenseSortedHand = () => (dispatch, getState) => {
    let state = getState()
    let anticipatedStacks = state.hand.stacks
        .map(stack => ({ ...state.stacks.byId[stack]}))
        .filter(stack => (stack.cards.length > 0))
    let cardMoves = []

    //
    // Have to make some local constant functions, because I'm
    // reducing, filtering, and mapping arrays inside of a loop,
    // and JS throws warnings when creating functions in loops.
    // Ideally, I'd like to do the anticipatedStacks parsing in
    // a way that doesn't depend on in-place mutation of the
    // array ... maybe reduce and a carried state?
    //
    const aggTypeReducer = (anticipatedStacks) => (output, aggType) => 
        (output.concat(
            listOfAggregatedCards(
                anticipatedStacks, 
                state.cards, 
                aggType.cardTemplate, 
                aggType.maxStack)
            )
        )
    const cardLooper = card => {
        anticipatedStacks[card.stackNum].cards = 
            anticipatedStacks[card.stackNum].cards.filter(val => (val !== card.card))
    }
    const cardMapper = (destId) => card => ({
        id: card.card,
        source: card.stack,
        destination: destId
    })
    while (anticipatedStacks.length) {
        let firstCard = state.cards.byId[anticipatedStacks[0].cards[0]]
        let aggregatorTypes = CardTemplates[firstCard.cardTemplate].aggregates
        if (aggregatorTypes) {
            let cardsToMove = aggregatorTypes
                .reduce(aggTypeReducer(anticipatedStacks), [])
            cardsToMove = cardsToMove
                .filter(card => (card.stackNum > 0))
            cardMoves = cardMoves.concat(
                cardsToMove.map(cardMapper(anticipatedStacks[0].id))
            )
            cardsToMove.forEach(cardLooper)
        }
        anticipatedStacks = anticipatedStacks.slice(1)
        anticipatedStacks = anticipatedStacks.filter(stack => (stack.cards.length > 0))
    }
    if (cardMoves.length) dispatch(moveCards(cardMoves))
}

export const condenseHand = () => dispatch => {
    dispatch( sortHand() )
    dispatch( condenseSortedHand() )
    dispatch( sortHand() )
}

const fullAggregators = (state) => {
    let stacks = state.hand.stacks.map((stackId) => state.stacks.byId[stackId])
    return stacks
        .filter(stack => (
            (stack.cards.length > 0) &&
            (CardTemplates[state.cards.byId[stack.cards[0]].cardTemplate].type === CardTemplates.Types.Aggregator) &&
            (CardTemplates[state.cards.byId[stack.cards[0]].cardTemplate].aggregates
                    .reduce((result, val) => ( result + val.maxStack), 0) < stack.cards.length)
        ))
        .map(stack => ( stack.id ))
}

const activateAggregator = (stackId) => (dispatch, getState) => {
    let state = getState()
    let purchases = CardTemplates[state.cards.byId[state.stacks.byId[stackId].cards[0]].cardTemplate].purchases
    dispatch(useCards(state.stacks.byId[stackId].cards.map(card => ({
        id: state.cards.byId[card].id,
        source: stackId,
        destination: state.hand.discardId
    }))))
    if (purchases.count > 1) {
        purchases.forEach(purchase => { dispatch(addCard(purchase.cardTemplate, state.hand.discardId)) })
    }
    else {
        purchases.forEach(purchase => { dispatch(addCard(purchase.cardTemplate, stackId)) })        
    }
}

export const checkHand = () => (dispatch, getState) => {
    let state = getState()
    let aggregators = fullAggregators(state)
    aggregators.forEach(agg => {
        dispatch(activateAggregator(agg))
    })
}
