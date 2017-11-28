import CardTemplates from '../state/CardTemplates'
import { moveCards } from './index'

export const sortHand = () => (dispatch, getState) => {
    let state = getState()
    let stacks = [ ...state.hand.stacks ]
    stacks.sort((a, b) => (
        (state.stacks.byId[a].cards.length ? 0 : 1) - (state.stacks.byId[b].cards.length ? 0 : 1)
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

const condenseSortedHand = () => (dispatch, getState) => {
    let state = getState()
    let anticipatedStacks = state.hand.stacks
        .map(stack => ({ ...state.stacks.byId[stack]}))
        .filter(stack => (stack.cards.length > 0))
    let cardMoves = []
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

export const checkHand = () => (dispatch, getState) => {
    dispatch ({
        type: 'CHECK_HAND'
    })
}
