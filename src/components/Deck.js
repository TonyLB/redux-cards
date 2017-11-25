import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import Header from './SVG/Header'

const Deck = ( {cards, headerTop=false, children, top=0, left=0, zIndex=0, className='svg-blues'} ) => {
    let header = (
        <Header className={ cards.length ? className : 'svg-greys'} width='76'>
            <text x="38" y="15">{cards.length}</text>
        </Header>
    )
    return (
        <div style={ top !== undefined? { } : { position:"relative", height:160 }}>
            <div style={{position:"absolute", top:top+"px", left:left+"px"}}>
                { headerTop ? header : null}
            </div>
            { cards.length ? cards.slice(0,3).map((card, index) => (
                    <Card 
                        top={(top+(headerTop?20:0))+index*5}
                        left={left+index*5}
                        zIndex={zIndex+3-index}
                        children={children}
                        showBack
                        key={card.id}
                        {...card}
                    />
                )) : (
                    <Card 
                        top={(top+(headerTop?20:0))}
                        left={left}
                        className='card-empty'
                        children={children} 
                    />    
            )}
            <div style={{position:"absolute", top:(top+145)+"px", left:left+"px"}}>
                { !headerTop ? header : null}
            </div>
        </div>
)}

Deck.PropTypes = {
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            val: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    headerTop: PropTypes.bool,
    top: PropTypes.number,
    left: PropTypes.number,
    className: PropTypes.string
}

export default Deck