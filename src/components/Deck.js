import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'

const Deck = ( props ) => {
    return (
    <table><tbody><tr>
        <td>
            <Card className={props.cards.length ? 'card-plain' : 'card-empty'} value={props.cards.length.toString()} />
        </td>
    </tr></tbody></table>
)}

Deck.PropTypes = {
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            val: PropTypes.string.isRequired
        }).isRequired
    ).isRequired
}

export default Deck