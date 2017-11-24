import React from 'react'
import PropTypes from 'prop-types'
import HandContainer from '../containers/HandContainer'
import TrackContainer from '../containers/TrackContainer'

const Board = ({ hand, trackId }) => {
    return (
    <div>
        <table className="positioning-table"><tbody><tr><td>
            <TrackContainer trackId={trackId} />
        </td></tr><tr><td>
            <HandContainer />
        </td></tr></tbody></table>
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