import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import Header from './SVG/Header'

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
                <Header width='76' height='20' onClick={props.discardClick(props.cards[0].id)}>
                    <circle cx="38" cy="10" r="6" />
                </Header>
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
                <Header className='svg-greys' width='76' height='20' />
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