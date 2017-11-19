import React from 'react'
import PropTypes from 'prop-types'
import Deck from './Deck'
import Hand from './Hand'

const Board = ({ deck, discard, hand, cardDrawClick, discardClick, shuffleClick }) => {
    return (
    <div>
        <table><tbody><tr>
            <td><Deck {...deck} /></td>
            <td><Deck {...discard} /></td>
        </tr><tr>
            <td></td>
            <td><button onClick={ shuffleClick(discard.id, deck.id) }>
                Shuffle
            </button></td>
        </tr></tbody></table>
        <Hand 
            {...hand} 
            drawClick={ cardDrawClick( deck.cards[0], deck.id, hand.id, hand.timerId ) } 
            discardClick={ (card) =>  discardClick(card, hand.id, discard.id) } 
        />
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
        discardClick: PropTypes.func,
        drawClick: PropTypes.func,
        timer: PropTypes.shape({
            id: PropTypes.string.isRequired,
            startTime: PropTypes.Date,
            duration: PropTypes.number
        }).isRequired
    }).isRequired
}

export default Board