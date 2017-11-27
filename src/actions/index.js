import { generateKey } from '../reducers/keys'
import { StateTypes } from '../state/index'

export const removeCardFromHand = id => {
    return {
        type: 'REMOVE_CARD',
        id
    }
}

export const moveCard = (cardId, source, destination) => {
    return {
        type: 'MOVE_CARD',
        cardId,
        source,
        destination
    }
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

export const condenseHand = () => {
    return {
        type: 'CONDENSE_HAND'
    }
}

export const checkHand = () => {
    return {
        type: 'CHECK_HAND'
    }
}

export const startTimer = (timerId) => {
    return {
        type: 'START_TIMER',
        id: timerId
    }
}