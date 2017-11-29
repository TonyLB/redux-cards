import { connect } from 'react-redux'
import { moveCard, addCard, useCards, deployCard } from '../actions'
import { condenseHand } from '../actions/hand'
import Track from '../components/Track'
import { cardsToSpend } from '../state/hand'
import CardTemplates from '../state/CardTemplates'

const mapStateToProps = state => {

    let track = state.tracks.byId[state.trackId]
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
        state: state
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        onClick: (track, trackDiscard, handDiscard, state) => (card, payload=[], deploy=[]) => () => {
            let cards = cardsToSpend(state, CardTemplates[state.cards.byId[card].cardTemplate].cost)
            if (cards.length) {
                dispatch(moveCard(card, track, trackDiscard))
                dispatch(useCards(cards.map(spentCard => ({ ...spentCard, destination: handDiscard }))))
                dispatch(condenseHand())
                payload.forEach(newCard => {
                    dispatch(addCard(newCard, handDiscard))
                })    
                deploy.forEach(newCard => {
                    dispatch(deployCard(newCard, card, handDiscard))
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
            propsFromState.handDiscard,
            propsFromState.state),

    }  
}

const TrackContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Track)

export default TrackContainer