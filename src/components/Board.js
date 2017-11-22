import React from 'react'
import PropTypes from 'prop-types'
import Deck from './Deck'
import HandContainer from '../containers/HandContainer'
import TrackContainer from '../containers/TrackContainer'

const Board = ({ deck, discard, hand, trackId, shuffleClick }) => {
    return (
    <div>
        <table><tbody><tr><td>
            <TrackContainer trackId={trackId} />
        </td></tr></tbody></table><table><tbody><tr>
            <td><Deck {...deck} /></td>
            <td><Deck {...discard} /></td>
        </tr><tr>
            <td></td>
            <td><button onClick={ shuffleClick }>
                Shuffle
            </button></td>
        </tr></tbody></table>
        <HandContainer />
    </div>
)}

Board.PropTypes = {
    deck: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            val: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    discard: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            val: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    hand: PropTypes.shape({
        id: PropTypes.string.isRequired,
        cards: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.string.isRequired,
                val: PropTypes.string.isRequired
            }).isRequired
        ).isRequired,
        timer: PropTypes.shape({
            id: PropTypes.string.isRequired,
            startTime: PropTypes.Date,
            duration: PropTypes.number
        }).isRequired
    }).isRequired,
    discardClick: PropTypes.func,
    drawClick: PropTypes.func
}

export default Board