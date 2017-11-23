import { connect } from 'react-redux'
import { moveCard, addCard } from '../actions'
import Track from '../components/Track'

const mapStateToProps = state => {

    let track = state.tracks.byId[state.trackId]
    return {
        ...track,
        
        // Denormalize cards on track

        cards: track.cards.map(card => (state.cards.byId[card])),

        // Denormalize cards for deck ID

        deck: {
            id: track.deck,
            ...(state.stacks.byId[track.deck])
        },
        handDiscard: state.hand.discardId
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (track, trackDiscard, handDiscard) => (card, payload=[]) => () => {
            dispatch(moveCard(card, track, trackDiscard))
            payload.forEach(newCard => {
                    dispatch(addCard(newCard, handDiscard))
            })
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

    let card = propsFromState.deck.cards.length ? propsFromState.deck.cards[0] : ''
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
            propsFromState.handDiscard),

        // Replace denormalized deck ID with normal form now that we're done
        // with the extracted data.

        deck: propsFromState.deck.id
    }  
}

const TrackContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Track)

export default TrackContainer