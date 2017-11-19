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

export const combineDecks = (source, destination) => {
    return {
        type: 'COMBINE_DECKS',
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