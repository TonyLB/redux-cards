import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'

const Stack = ( props ) => (
    props.cards.length ? (
        <table><tbody>
            {props.cards.map((card) => (
                <tr key={card.id}><td>
                    <Card className='card-plain' {...(card)} />
                </td></tr>
            ))}
        <tr key={"DISCARD-"+props.id}><td>
            <div className='positioning-discard'>
                <svg x='8px' y='0px' width='60px' height='20px' viewBox='0 0 60 20' onClick={props.discardClick(props.cards[0].id)}>
                    <line x1="0" y1="8" x2="20" y2="8" opacity="0.5" stroke="#000000" strokeWidth="2" />
                    <line x1="0" y1="12" x2="20" y2="12" opacity="0.5" stroke="#000000" strokeWidth="2" />
                    <line x1="60" y1="8" x2="40" y2="8" opacity="0.5" stroke="#000000" strokeWidth="2" />
                    <line x1="60" y1="12" x2="40" y2="12" opacity="0.5" stroke="#000000" strokeWidth="2" />
                    <circle cx="30" cy="10" r="6" opacity="0.5" fill="#898989" stroke="#000000" />
                </svg>
            </div>
        </td></tr>
        </tbody></table>                
    ) :
    (
        <table><tbody><tr><td>
            <Card className='card-empty' value = '' id={props.id} >
                {props.children}
            </Card>
        </td></tr>
        <tr key={"DISCARD-"+props.id}><td>
            <div className='positioning-discard'>
                <svg x='8px' y='0px' width='60px' height='20px' viewBox='0 0 60 20'>
                    <line x1="0" y1="8" x2="20" y2="8" opacity="0.5" stroke="#000000" strokeWidth="2" />
                    <line x1="0" y1="12" x2="20" y2="12" opacity="0.5" stroke="#000000" strokeWidth="2" />
                    <line x1="60" y1="8" x2="40" y2="8" opacity="0.5" stroke="#000000" strokeWidth="2" />
                    <line x1="60" y1="12" x2="40" y2="12" opacity="0.5" stroke="#000000" strokeWidth="2" />
                </svg>
            </div>
        </td></tr></tbody></table>
    )
)

Stack.PropTypes = {
    id: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            val: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    discardClick: PropTypes.func,
}

export default Stack