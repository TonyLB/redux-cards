import { connect } from 'react-redux'
import { moveCard, moveCards, combineStacks, startTimer } from '../actions'
import { condenseHand, checkHand, sortHand } from '../actions/hand'
import CardTemplate from '../state/CardTemplates'
import Hand from '../components/Hand'

const stackLookup = (state) => (stack) => ({
    ...(state.stacks.byId[stack]),
    cards: state.stacks.byId[stack].cards.map(card => ({
            ...(state.cards.byId[card]),
            value: CardTemplate[state.cards.byId[card].cardTemplate].value
    }))
})

const mapStateToProps = state => {
    let stacks = state.hand.stacks.map(stackLookup(state))
    let openStackFound = ''
    stacks.forEach((stack) => {
        if (!openStackFound && stack.cards.length === 0) {
            stack.firstOpenStack = true
            openStackFound = stack.id
        }
    })
    return {
        ...state.hand,
        stacks: [ 
            ...stacks,

            //  Add discard and draw decks into stacks passed in propsFromState

            ...([state.hand.drawId, state.hand.discardId].map(stackLookup(state)))
        ],
        firstOpenStack: openStackFound
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        cardDrawClick: (card, deck, discard, shuffle, stack, timerId) => () => {
            dispatch(moveCard(card, deck, stack))
            dispatch(condenseHand())
            dispatch(startTimer(timerId))
            if (shuffle) {
                dispatch(combineStacks(discard, deck))
            }
            setTimeout(() => {
                dispatch(checkHand())
                dispatch(condenseHand())
            }, 500)
        },
        discardClick: (discard) => (stack) => (card) => () => {
            dispatch(moveCards([{id: card, source: stack, destination: discard}])) 
            dispatch(sortHand())
        },
        shuffleClick: (discard, deck) => () => dispatch(combineStacks(discard, deck))
    }
}

const mergeProps = ( propsFromState, propsFromDispatch, ownProps ) => {

    // Assure that we only attempt to draw when there is both a card
    // on the drawdeck, and an open stack to receive that card.

    let drawStacks = propsFromState.stacks.filter((stack) => ( stack.id === propsFromState.drawId))
    let drawStack = drawStacks.length ? drawStacks[0] : null
    let drawCards = drawStack ? drawStack.cards : null
    let drawCard = drawCards.length ? drawCards[0].id : null
    let discardStacks = propsFromState.stacks.filter((stack) => ( stack.id === propsFromState.discardId))
    let discardStack = discardStacks.length ? discardStacks[0] : null

    return {
        ...propsFromState,

        // Pass payload arguments to dispatch functions

        drawClick: (propsFromState.firstOpenStack && drawCard) ? propsFromDispatch.cardDrawClick(
            drawCard, 
            propsFromState.drawId,
            propsFromState.discardId,
            drawCards.length<=1,
            propsFromState.firstOpenStack,
            propsFromState.timerId
        ) : () => {},
        discardClick: propsFromDispatch.discardClick(propsFromState.discardId),
        shuffleClick: propsFromDispatch.shuffleClick(propsFromState.discardId, propsFromState.drawId),

        drawDeck: drawStack,
        discardDeck: discardStack,

        // Filter discard and draw deck denormalization out of stacks, now that 
        // we've assigned them to named properties

        stacks: propsFromState.stacks.filter((stack) => (
            stack.id !== propsFromState.drawId &&
            stack.id !== propsFromState.discardId
        )),
        ...ownProps
    }
}

const HandContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Hand)

export default HandContainer