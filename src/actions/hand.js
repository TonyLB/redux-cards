import assert from 'assert'
import CardTemplates from '../state/CardTemplates'
import { moveCards, combineMoveCards, addCard, removeCards, combineStacks, startTimer, markUse } from './index'
import { denormalize } from '../state'
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

const sortStacks = (state) => ({
    ...state,
    hand: {
        ...state.hand,
        stacks: [...state.hand.stacks].sort((a, b) => (
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
    } else
    {
        const sortedState = sortStacks(state)
        if (sortedState.hand.stacks.some((value, index) => ( value !== state.hand.stacks[index]))) {
            dispatch({ type: 'SORT_HAND', stacks: sortedState.hand.stacks })
        }
    }
}

export const shuffleIfNeeded = () => function shuffleIfNeeded(dispatch, getState) {
    const state = getState()
    if (!state.stacks.byId[state.hand.drawId].cards.length && 
            state.stacks.byId[state.hand.discardId].cards.length) {
        dispatch(combineStacks(state.hand.discardId, state.hand.drawId))
    }
}

export const moveThenCondense = (state, moves) => {
    const newState = testApp(state, moves, true)
    const condense = movesToCondenseHand(newState)
    return combineMoveCards([
        moves,
        moveCards(condense.moves, sortStacks(condense.state).hand.stacks)
    ])
}

export const drawCard = () => (dispatch, getState) => {
    const state = getState()
    const firstOpenStack = state.hand.stacks.find(stack => ( state.stacks.byId[stack].cards.length === 0 ))
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

export const maybeRebootDrawCycle = () => function maybeRebootDrawCycle(dispatch, getState) {
    const state = getState()
    if (state.settings['AUTO-DRAW']) {
        const timer = state.timers.byId[state.hand.timerId]
        if (!timer.timeoutId) {
            dispatch(drawCard())
        }    
    }
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
        dispatch(maybeRebootDrawCycle())
    }
}

const fullAggregators = (state) => {
    let stacks = state.hand.stacks.map((stackId) => state.stacks.byId[stackId])
    return stacks
        .filter(stack => (
            (stack.cards.length > 0) &&
            (CardTemplates[state.cards.byId[stack.cards[0]].cardTemplate].type === CardTemplates.Types.Aggregator) &&
            CardTemplates[state.cards.byId[stack.cards[0]].cardTemplate].purchases.length &&
            (CardTemplates[state.cards.byId[stack.cards[0]].cardTemplate].purchases
                .find(purchase => (cardsToAggregate(stack.id, purchase, state).length)))
        ))
        .map(stack => ( stack.id ))
}

const cardsToAggregate = (stackId, purchase, state) => {
    const cards = denormalize(state.stacks.byId[stackId].cards, state.cards.byId)
    assert(cards.length)

    const spendableCards = cards
        .slice(1) // Get rid of the aggregate control card
        .filter(card => (purchase.price.find(price => (price.cardTemplate === card.cardTemplate))))
    const spentCards = purchase.price.reduce((out, price) => (
            out.concat(spendableCards
                .filter(card => (card.cardTemplate === price.cardTemplate))
                .slice(0, price.required)
        )), [])
    const allPricesSatisfied = purchase.price.reduce((out, price) => (
        out && (spendableCards.filter(card => (card.cardTemplate === price.cardTemplate)).length === price.required)
    ), true)

    return allPricesSatisfied ? spentCards : []
}

export const activateAggregator = (stackId) => function activateAggregator(dispatch, getState) {
    let state = getState()
    if (state.stacks.byId[stackId] === undefined) { return }
    if (!state.stacks.byId[stackId].cards.length) { return }
    let purchases = CardTemplates[state.cards.byId[state.stacks.byId[stackId].cards[0]].cardTemplate].purchases

    const [purchase, price] = purchases
        .reduce((out, purchase) => {
            if (out.length) return out;
            const cardsList = cardsToAggregate(stackId, purchase, state)
            if (cardsList.length) {
                return [
                    purchase,
                    cardsList
                ]
            }
            else {
                return []
            }
        }, [])
    
    if (!purchase) { return }

    let addCardMoves = addCard(purchase.cardTemplate, stackId)

    dispatch(addCardMoves)
        
    let newState = testApp(state, addCardMoves, true)
    
    const maybeDiscards = (purchase.persistent ? 
            [] : [{ 
                id: state.stacks.byId[stackId].cards[0],
                source: stackId,
                destination: state.hand.discardId
            }])
        .concat(price.map(card => ({
            id: card.id,
            source: stackId,
            destination: state.hand.discardId
        })))

    dispatch(useCardMarks(newState, maybeDiscards))

    const expenditureMoves = moveCards(useCardMoves(newState, maybeDiscards))

    const discardMoves = (purchase.persistent ? [] :
        state.stacks.byId[stackId].cards
            .slice(1)
            .filter(card => (!price.find(priceCard => priceCard.id === card))))
                .map(card => ({ 
                    id: card, 
                    source: stackId,
                    destination: state.hand.discardId
                }))

    dispatch(moveThenCondense(newState, combineMoveCards([expenditureMoves, moveCards(discardMoves)])))
    dispatch(maybeRebootDrawCycle())
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
        dispatch(maybeRebootDrawCycle())
    }

}

export const useCardMoves = (state, cards=[]) => (
    cards
    .map(card => (
        (state.cards.byId[card.id].uses <= 1) ?
            {
                id: card.id,
                source: card.source
            } :
            card
    ))
)

const useCardMarks = (state, cards=[]) => (
    markUse(cards
        .filter(card => (state.cards.byId[card.id].maxUses))
        .map(card => (card.id))
    )
)

export const useCards = (cards=[], stacks=null) => (dispatch, getState) => {
    let state = getState()
    dispatch(useCardMarks(state, cards))
    dispatch(moveCards(useCardMoves(state, cards), stacks))
    dispatch(maybeRebootDrawCycle())
}

