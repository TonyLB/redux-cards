import { connect } from 'react-redux'
import { moveCard, combineStacks, startTimer, condenseHand } from '../actions'
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
        cardDrawClick: (card, deck, stack, timerId) => () => {
            dispatch(moveCard(card, deck, stack))
            dispatch(condenseHand())
            dispatch(startTimer(timerId))    
        },
        discardClick: (discard) => (stack) => (card) => () => {
            dispatch(moveCard(card, stack, discard)) 
            dispatch(condenseHand())
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

    return {
        ...propsFromState,

        // Pass payload arguments to dispatch functions

        drawClick: (propsFromState.firstOpenStack && drawCard) ? propsFromDispatch.cardDrawClick(
            drawCard, 
            propsFromState.drawId,
            propsFromState.firstOpenStack,
            propsFromState.timerId
        ) : () => {},
        discardClick: propsFromDispatch.discardClick(propsFromState.discardId),
        shuffleClick: propsFromDispatch.shuffleClick(propsFromState.discardId, propsFromState.drawId),

        // Filter discard and draw deck denormalization out of state, now that 
        // we've used the data as payload for dispatch functions

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