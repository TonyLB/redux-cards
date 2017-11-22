import { connect } from 'react-redux'
import Deck from '../components/Deck'

const mapStateToProps = (state, ownProps) => {
    let stack = state.stacks.byId[ownProps.deck]
    return {
        ...stack,
        cards: stack.cards.map(card => state.cards.byId[card])
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({})

const mergeProps = ( propsFromState, propsFromDispatch, ownProps ) => ({
    ...propsFromState
})

const DeckContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Deck)

export default DeckContainer