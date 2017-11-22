import { connect } from 'react-redux'
import { moveCard, combineStacks, startTimer, condenseHand } from '../actions'
import Board from '../components/Board'

const mapStateToProps = state => {
    return {
        deck: state.stacks.byId[state.mainDeckId],
        discard: state.stacks.byId[state.discardDeckId],
        timerId: state.hand.timerId
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        cardDrawClick: (card, deck, timerId) => (stack) => () => {
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

const mergeProps = ( propsFromState, propsFromDispatch, ownProps ) => ({
    deck: propsFromState.deck,
    discard: propsFromState.discard,
    cardDrawClick: propsFromDispatch.cardDrawClick(
        propsFromState.deck.cards[0], 
        propsFromState.deck.id,
        propsFromState.timerId
    ),
    discardClick: propsFromDispatch.discardClick(propsFromState.discard.id),
    shuffleClick: propsFromDispatch.shuffleClick(propsFromState.discard.id, propsFromState.deck.id),
    ...ownProps
})

const BoardContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Board)

export default BoardContainer