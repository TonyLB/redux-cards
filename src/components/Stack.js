import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import Header from './SVG/Header'

const Stack = ( { id, cards=[], discardClick=()=>{}, top=0, left=0, children} ) => (
    cards.length ? (
        <div>
            { cards.map((card,index) => (
                <Card 
                    top={top+20*index} {...(card)}
                    left={left+(index?10:0)}
                    key={card.id}
                    {...card}
                />
            ))}
            <div style={{top:top+250, left:left, position:"absolute"}}>
                <Header width='76' height='20' onClick={discardClick(cards[cards.length-1].id)}>
                    <circle cx="38" cy="10" r="6" />
                </Header>
            </div>
        </div>
    ) :
    (
        <div>
            <Card 
                className='card-empty' 
                top={top}
                left={left}
                value = '' 
                id={id} 
            >
                {children}
            </Card>

            <div className='positioning-discard' style={{top:top+250, left:left, position:"absolute"}}>
                <Header className='svg-greys' width='76' height='20' />
            </div>
        </div>
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
    top: PropTypes.number,
    left: PropTypes.number
}

export default Stack