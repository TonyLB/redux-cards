import { generateKey } from '../reducers/keys'
import { StateTypes } from '../state/index'
import { uniqueMoves } from '../state'

export const removeCards = (cards =[], stacks=null) => {
    return {
        type: 'MOVE_CARDS',
        cards: cards.map(card => ({ id: card.id, source: card.source })),
        stacks
    }
}

export const moveCards = (cards = [], stacks=null) => ({
    type: 'MOVE_CARDS',
    cards,
    stacks
})

export const combineMoveCards = (actions = []) => ({
    type: 'MOVE_CARDS',
    cards: uniqueMoves(
            actions
                .map(action => ( action.cards ))
                .reduce((output, cards) => ( output.concat(cards)), [])
        ),
    stacks: actions
                .map(action => ( action.stacks ))
                .reduceRight((output, stacks) => ( output || stacks), null)
})

export const moveCard = (cardId, source, destination) => (dispatch) => {
    dispatch(moveCards([{
        id: cardId,
        source,
        destination
    }]))
}

export const markUse = (cards) => ({
    type: 'MARK_USE',
    cards
})

export const addCard = (cardTemplate, destination) => {
    return {
        type: 'ADD_CARD',
        cardTemplate,
        destination,
        cardId: generateKey(StateTypes.Card)
    }
}

export const deployCard = (cardTemplate, source, destination) => {
    return {
        type: 'DEPLOY_CARD',
        cardTemplate,
        source,
        destination,
        cardId: generateKey(StateTypes.Card)
    }
}

export const combineStacks = (source, destination) => {
    return {
        type: 'COMBINE_STACKS',
        source,
        destination
    }
}

export const startTimer = (timerId) => {
    return {
        type: 'START_TIMER',
        id: timerId
    }
}