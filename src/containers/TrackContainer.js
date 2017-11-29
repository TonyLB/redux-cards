import { connect } from 'react-redux'
import { moveCard, addCard, useCards, deployCard } from '../actions'
import { condenseHand } from '../actions/hand'
import Track from '../components/Track'
import { cardsToSpend } from '../state/hand'
import CardTemplates from '../state/CardTemplates'

const mapStateToProps = (state, ownProps) => {

    let track = state.tracks.byId[ownProps.trackId]
    return {
        ...track,
        
        // Denormalize cards on track

        cards: track.cards.map(card => (state.cards.byId[card])),

        // Denormalize cards for deck ID

        deck: {
            ...(state.stacks.byId[track.deck]),
            cards: state.stacks.byId[track.deck].cards
                .filter(card => (state.cards.byId[card].deployed === undefined))
                .map(card => (state.cards.byId[card]))
        },
        handDiscard: state.hand.discardId,
        shortCuts: state.hand.shortCuts,
        state: state
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (track, trackDiscard, shortCuts, state) => (card, payload=[], deploy=[]) => () => {
            let cards = cardsToSpend(state, CardTemplates[state.cards.byId[card].cardTemplate].cost)
            if (cards.length) {
                dispatch(moveCard(card, track, trackDiscard))
                dispatch(useCards(cards.map(spentCard => ({ ...spentCard, destination: shortCuts['DISCARD'] }))))
                dispatch(condenseHand())
                Object.entries(payload).forEach(([key, val]) => {
                    val.forEach(newCard => {
                        dispatch(addCard(newCard, shortCuts[key]))
                    })
                })
                Object.entries(deploy).forEach(([key, val]) => {
                    val.forEach(newCard => {
                        dispatch(deployCard(newCard, card, shortCuts[key]))
                    })
                })
            }
        },
        cardDrawClick: (card, deck, track, discard) => () => {
            if (discard) { 
                dispatch(moveCard(discard, track, deck))
            }
            dispatch(moveCard(card, deck, track))
        },
    }
}

const mergeProps = ( propsFromState, propsFromDispatch, ownProps ) => {

    // Select card to draw from deck, and card to discard from end of
    // track (if available)

    let card = propsFromState.deck.cards.length ? propsFromState.deck.cards[0].id : ''
    let discard = propsFromState.cards.length >= propsFromState.trackSize ?
        propsFromState.cards[0].id : ''
    return {
        ...propsFromState,
        cardDrawClick: card ? propsFromDispatch.cardDrawClick(
            card,
            propsFromState.deck.id,
            propsFromState.id,
            discard
        ) : () => {},
        onClick: propsFromDispatch.onClick(
            propsFromState.id, 
            propsFromState.deck.id, 
            propsFromState.shortCuts,
            propsFromState.state),
        ...ownProps
    }  
}

const TrackContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Track)

export default TrackContainer