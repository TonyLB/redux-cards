import { connect } from 'react-redux'
import { combineStacks } from '../actions'
import { drawCard, discardCard, recycleCards } from '../actions/hand'
import CardTemplate from '../state/CardTemplates'
import Hand from '../components/Hand'
import { canRecycle } from '../state/hand'

const stackLookup = (state) => (stack) => ({
    ...(state.stacks.byId[stack]),
    alternateName: canRecycle(state, stack) ? 
        CardTemplate[state.cards.byId[state.stacks.byId[stack].cards[0]].cardTemplate].alternateName ?
            CardTemplate[state.cards.byId[state.stacks.byId[stack].cards[0]].cardTemplate].alternateName :
            'Recycle' : '',
    cards: state.stacks.byId[stack].cards.map(card => ({
            ...(state.cards.byId[card]),
            value: CardTemplate[state.cards.byId[card].cardTemplate].value
    }))
})

const mapStateToProps = state => {
    let stacks = state.hand.stacks.map(stackLookup(state))
    const openStack = stacks.findIndex(stack => ( stack.cards.length === 0 ))
    if (openStack !== -1) {
        stacks[openStack] = Object.assign(stacks[openStack], {
            firstOpenStack: true
        })
    }
    return {
        ...state.hand,
        stacks: stacks,
        drawDeck: stackLookup(state)(state.hand.drawId),
        discardDeck: stackLookup(state)(state.hand.discardId)
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        cardDrawClick: () => {
            dispatch(drawCard())
        },
        discardClick: (card) => () => {
            dispatch(discardCard(card))
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

        drawClick: propsFromDispatch.cardDrawClick,
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