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

export const addCards = (cards = []) => ({
    type: 'ADD_CARDS',
    cards: cards.map(card => ({ 
        ...card,
        id: card.id || generateKey(StateTypes.Card)
    }))
})

export const addCard = (cardTemplate, destination) => (
    addCards([{
        cardTemplate: cardTemplate,
        destination: destination
    }])
)

export const deployCard = (cardTemplate, source, destination) => (
    addCards([{
        cardTemplate: cardTemplate,
        deployedBy: source,
        destination: destination
    }])
)

export const deployCards = (cards=[], source) => (
    addCards(cards.map(card => ({ ...card, deployedBy: source })))
)

export const combineAddCards = (actions = []) => ({
    type: 'ADD_CARDS',
    cards: actions
        .map(action => ( action.cards ))
        .reduce((output, cards) => ( output.concat(cards)), []),
    stacks: actions
        .map(action => ( action.stacks ))
        .reduceRight((output, stacks) => ( output || stacks), null)
})

export const replaceCards = (cardMap) => ({
    type: 'REPLACE_CARDS',
    cardMap
})

export const combineStacks = (source, destination) => {
    return {
        type: 'COMBINE_STACKS',
        source,
        destination
    }
}

export const clearTimer = (timerId) => (dispatch, getState) => {
    const state = getState()
    clearTimeout(state.timers.byId[timerId].timeoutId)    
    dispatch({
        type: 'CLEAR_TIMER',
        id: timerId
    })
}

export const startTimer = (timerId) => function startTimer(dispatch, getState) {
    const state = getState()
    const timer = state.timers.byId[timerId]
    let timeoutId = null
    const startTime = new Date()
    if (timer.timeoutId) {
        dispatch(clearTimer(timerId))
    }
    if (timer.execute) {
        timeoutId = setTimeout(
            () => { dispatch(timer.execute) }, 
            timer.duration
        )
    }
    dispatch({
        type: 'START_TIMER',
        id: timerId,
        timeoutId: timeoutId,
        startTime: startTime
    })
}

export const setTimers = (timers) => ({
    type: 'SET_TIMERS',
    timers
})
