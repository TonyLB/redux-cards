import { connect } from 'react-redux'
import { combineStacks } from '../actions'
import { drawCard, discardCard, condenseHand, recycleCards } from '../actions/hand'
import CardTemplate from '../state/CardTemplates'
import Hand from '../components/Hand'
import { canRecycle } from '../state/hand'

const stackLookup = (state) => (stack) => ({
    ...(state.stacks.byId[stack]),
    alternateName: canRecycle(state, stack) ? 'Recycle' : '',
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
        stacks: stacks,
        drawDeck: stackLookup(state)(state.hand.drawId),
        discardDeck: stackLookup(state)(state.hand.discardId),
        firstOpenStack: openStackFound
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        cardDrawClick: (firstOpenStack) => () => {
            dispatch(drawCard(firstOpenStack))
        },
        discardClick: (stack) => (card) => () => {
            dispatch(discardCard(card, stack))
            dispatch(condenseHand())
        },
        alternateClick: (discard) => (stack) => () => {
            dispatch(recycleCards(stack, discard))
        },
        shuffleClick: (discard, deck) => () => dispatch(combineStacks(discard, deck))
    }
}

const mergeProps = ( propsFromState, propsFromDispatch, ownProps ) => {

    return {
        ...propsFromState,

        // Pass payload arguments to dispatch functions

        drawClick: propsFromState.firstOpenStack ?
            propsFromDispatch.cardDrawClick(propsFromState.firstOpenStack) :
            () => {},
        discardClick: propsFromDispatch.discardClick,
        shuffleClick: propsFromDispatch.shuffleClick(propsFromState.discardId, propsFromState.drawId),
        alternateClick: propsFromDispatch.alternateClick(propsFromState.discardId),

        ...ownProps
    }
}

const HandContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Hand)

export default HandContainer