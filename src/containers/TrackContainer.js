import { connect } from 'react-redux'
import CardTemplates from '../state/CardTemplates'
import Track from '../components/Track'
import { purchaseCard } from '../actions/track'

const mapStateToProps = (state, ownProps) => {

    let track = state.tracks.byId[ownProps.trackId]
    return {
        ...track,
        
        // Denormalize cards on track

        cards: track.cards.map(card => ({
            ...(CardTemplates[state.cards.byId[card].cardTemplate]),
            ...(state.cards.byId[card])
        })),

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

const mapDispatchToProps = (dispatch, ownProps) => ( { 
    onClick: (card) => () => { dispatch(purchaseCard(card, ownProps.trackId)) }
} )

const mergeProps = ( propsFromState, propsFromDispatch, ownProps ) => ({
    ...propsFromState,
    ...propsFromDispatch,
    ...ownProps
})

const TrackContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Track)

export default TrackContainer