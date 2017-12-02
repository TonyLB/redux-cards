import { connect } from 'react-redux'
import { moveCard } from '../actions'
import Track from '../components/Track'
import { purchaseCard } from '../actions/track'

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
        onClick: (track) => (card) => () => {
            dispatch(purchaseCard(card, track))
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
        onClick: propsFromDispatch.onClick(propsFromState.id),
        ...ownProps
    }  
}

const TrackContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Track)

export default TrackContainer