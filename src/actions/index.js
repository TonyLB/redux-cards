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

export const startTimer = (timerId) => {
    return {
        type: 'START_TIMER',
        id: timerId
    }
}