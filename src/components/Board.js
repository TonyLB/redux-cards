import React from 'react'
import PropTypes from 'prop-types'
import HandContainer from '../containers/HandContainer'

const Board = ({ hand, trackId }) => (
    <div>
        <HandContainer />
    </div>
)

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