import { connect } from 'react-redux'
import { moveCard, combineDecks, startTimer } from '../actions'
import Board from '../components/Board'

const assembleHand = state => {
    return {
        ...state.hand,
        cards: state.hand.cards.map(card => state.cards.byId[card]),
        timer: state.timers.byId[state.hand.timerId]
    }
}

const mapStateToProps = state => {
    return {
        hand: assembleHand(state),
        deck: state.decks.byId[state.mainDeckId],
        discard: state.decks.byId[state.discardDeckId]
    }
}

const mapDispatchToProps = dispatch => {
    return {
        cardDrawClick: (card, deck, hand, timerId) => () => {
            dispatch(moveCard(card, deck, hand))
            dispatch(startTimer(timerId))
        },
        discardClick: (card, hand, discard) => () => dispatch(moveCard(card, hand, discard)),
        shuffleClick: (discard, deck) => () => dispatch(combineDecks(discard, deck))
    }
}

const BoardContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Board)

export default BoardContainer