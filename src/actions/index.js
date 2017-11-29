import { generateKey } from '../reducers/keys'
import { StateTypes } from '../state/index'
//import CardTemplates from '../state/CardTemplates'

export const removeCards = cards => {
    return {
        type: 'REMOVE_CARDS',
        cards
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

export const markUse = (cards) => ({
    type: 'MARK_USE',
    cards
})

export const useCards = (cards) => (dispatch, getState) => {
    let state = getState()
    dispatch(markUse(cards
        .filter(card => (state.cards.byId[card.id].maxUses))
        .map(card => (card.id))
    ))
    dispatch(removeCards(cards
        .filter(card => ( state.cards.byId[card.id].maxUses <= state.cards.byId[card.id].uses + 1 ))
        .map(card => ({ id: card.id, source: card.source }))
    ))
    dispatch(moveCards(cards
        .filter(card => {
            let maxUses = state.cards.byId[card.id].maxUses 
            return maxUses === undefined || maxUses > state.cards.byId[card.id].uses + 1
        })
    ))
}

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