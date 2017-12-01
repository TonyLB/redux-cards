import CardTemplates from '../state/CardTemplates'
import { moveCards, combineMoveCards, addCard, removeCards, combineStacks, startTimer, markUse } from './index'
import { canRecycle } from '../state/hand'
import { willAggregate } from '../state/stack'
import testApp from '../reducers/testApp'

const handPriority = (state, stack) => (
    state.stacks.byId[stack].cards.length ? 
        CardTemplates.Types.Priority[
            CardTemplates[state.cards.byId[state.stacks.byId[stack].cards[0]].cardTemplate].type
        ]
    : 0
)

export const sortHand = () => (dispatch, getState) => {
    let state = getState()
    let stacks = [ ...state.hand.stacks ]
    stacks.sort((a, b) => (
        handPriority(state, b) - handPriority(state, a)
    ))
    if (stacks.some((val, index) => ( state.hand.stacks[index] !== val ))) {
        dispatch({
            type: 'SORT_HAND',
            stacks: stacks
        })
    }
}

const sortStacks = (state) => ({
    ...state,
    hand: {
        ...state.hand,
        stacks: state.hand.stacks.sort((a, b) => (
            handPriority(state, b) - handPriority(state, a)
        ))
    }
})

//
// Returns an object with:
//      - moves:  A moveCards property list for the cards that must move
//                to condense the hand into aggregators.
//      - state:  An updated state that is the anticipated outcome of those
//                moves being applied.
//
// Should this maybe return a moveCards action, instead of the property list?
//
const movesToCondenseHand = (state) => {
    const sortedState = sortStacks(state)

    const neededMoves = sortedState.hand.stacks.reduce((output, stack) => {
        if (output.length) return output
        const cardsMoved = willAggregate(sortedState, stack)
        if (cardsMoved.length) {
            return cardsMoved
        }
        else {
            return output
        }
    }, [])
    
    if (neededMoves.length) {
        const newState = testApp(state, moveCards(neededMoves), true)
        const recurse = movesToCondenseHand(newState)
        return {
            state: recurse.state,
            moves: [...neededMoves, ...recurse.moves]
        }
    } 
    else {
        return { 
            state: state,
            moves: []
        }
    }
}

export const condenseHand = () => (dispatch, getState) => {
    const state = getState()
    const neededMoves = movesToCondenseHand(state)
    if (neededMoves.moves.length) {
        dispatch(combineMoveCards([moveCards(neededMoves.moves, sortStacks(neededMoves.state).hand.stacks)]))
    }
}

const shuffleIfNeeded = () => (dispatch, getState) => {
    const state = getState()
    if (!state.stacks.byId[state.hand.drawId].cards.length) {
        dispatch(combineStacks(state.hand.discardId, state.hand.drawId))
    }
}

const moveThenCondense = (state, moves) => {
    const newState = testApp(state, moves, true)
    const condense = movesToCondenseHand(newState)
    return combineMoveCards([
        moves,
        moveCards(condense.moves, sortStacks(condense.state).hand.stacks)
    ])
}

export const drawCard = (firstOpenStack) => (dispatch, getState) => {
    const state = getState()
    if (firstOpenStack && state.stacks.byId[state.hand.drawId].cards.length) {
        const drawMove = moveCards([{
            id: state.stacks.byId[state.hand.drawId].cards[0], 
            source: state.hand.drawId,
            destination: firstOpenStack
        }])
        dispatch(moveThenCondense(state, drawMove))
        dispatch(startTimer(state.hand.timerId))
        setTimeout(() => {
            dispatch(checkHand())
            dispatch(condenseHand())
        }, 500)    
    }
    dispatch(shuffleIfNeeded())
}

export const discardCard = (card, source) => (dispatch, getState) => {
    const state = getState()
    if (card) {
        const discardMove = moveCards([{
            id: card, 
            source: source,
            destination: state.hand.discardId
        }])
        dispatch(moveThenCondense(state, discardMove))
    }
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
    if (purchases.length > 1) {
        purchases.forEach(purchase => { dispatch(addCard(purchase.cardTemplate, state.hand.discardId)) })
    }
    else {
        purchases.forEach(purchase => { dispatch(addCard(purchase.cardTemplate, stackId)) })        
    }
    dispatch(useCards(state.stacks.byId[stackId].cards.map(card => ({
        id: state.cards.byId[card].id,
        source: stackId,
        destination: state.hand.discardId
    }))))
}

export const checkHand = () => (dispatch, getState) => {
    let state = getState()
    let aggregators = fullAggregators(state)
    aggregators.forEach(agg => {
        dispatch(activateAggregator(agg))
    })
}

export const recycleCards = (stackId, destination) => (dispatch, getState) => {
    let state = getState()
    let stack = state.stacks.byId[stackId]

    if (canRecycle(state, stackId)) {

        const recycleMove = combineMoveCards([
            moveCards(stack.cards.slice(1).map(card => ({ id: card, source: stackId, destination: destination}))),
            removeCards([{id: stack.cards[0], source: stackId}])
        ])
        dispatch(moveThenCondense(state, recycleMove))
    
    }

}

const useCardMoves = (state, cards=[]) => (
    cards
    .map(card => (
        (state.cards.byId[card.id].maxUses <= state.cards.byId[card.id].uses + 1) ?
            {
                id: card.id,
                source: card.source
            } :
            card
    ))
)

export const useCards = (cards=[], stacks=null) => (dispatch, getState) => {
    let state = getState()
    dispatch(markUse(cards
        .filter(card => (state.cards.byId[card.id].maxUses))
        .map(card => (card.id))
    ))
    dispatch(moveCards(useCardMoves(state, cards), stacks))
}

