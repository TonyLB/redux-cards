import { generateKey } from '../reducers/keys'
import { StateTypes } from '../state/index'

export const removeCard = id => {
    return {
        type: 'REMOVE_CARD',
        id
    }
}

export const moveCards = (cards = []) => ({
    type: 'MOVE_CARDS',
    cards
})

export const moveCard = (cardId, source, destination) => (dispatch) => {
    dispatch(moveCards([{
        id: cardId,
        source,
        destination
    }]))
}

export const markUse = (cardId) => ({
    type: 'MARK_USE',
    cardId
})

export const useCard = (cardId, source, destination) => (dispatch, getState) => {
    let state = getState()
    let card = state.cards.byId[cardId]
    if (card.maxUses) {
        dispatch(markUse(cardId))
    }
    dispatch(moveCard(cardId, source, destination))
}

export const addCard = (cardTemplate, destination) => {
    return {
        type: 'ADD_CARD',
        cardTemplate,
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