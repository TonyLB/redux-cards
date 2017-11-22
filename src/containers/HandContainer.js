import { connect } from 'react-redux'
import CardTemplate from '../state/CardTemplates'
import Hand from '../components/Hand'

const assembleHand = state => {
    let stacks = state.hand.stacks.map(stack => ({
        ...(state.stacks.byId[stack]),
        cards: state.stacks.byId[stack].cards.map(card => ({
                ...(state.cards.byId[card]),
                value: CardTemplate[state.cards.byId[card].cardTemplate].value
        }))}))
    let openStackFound = ''
    stacks.forEach((stack) => {
        if (!openStackFound && stack.cards.length === 0) {
            stack.firstOpenStack = true
            openStackFound = stack.id
        }
    })
    return {
        ...state.hand,
        stacks: stacks
    }
}

const mapStateToProps = state => {
    return assembleHand(state)
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        cardDrawClick: ownProps.cardDrawClick,
        discardClick: ownProps.discardClick
    }
}

const HandContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Hand)

export default HandContainer