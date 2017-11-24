import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import Header from './SVG/Header'

const Deck = ( {cards, headerTop=false, children, top, left} ) => {
    let header = (
        <Header className={ cards.length ? 'svg-blues': 'svg-greys'} width='76'>
            <text x="38" y="15">{cards.length}</text>
        </Header>
    )
    return (
        <div style={top?{position:"absolute", top:top, left:left}:{position:"relative", height:160}}>
            <div style={{position:"absolute", top:"0px", left:"0px"}}>
                { headerTop ? header : null}
            </div>
            <div style={{position:"absolute", top:headerTop?"20px":"0px", left:"0px"}}>
                <Card className={cards.length ? 'card-plain' : 'card-empty'} children={children} />
            </div>
            <div style={{position:"absolute", top:"135px", left:"0px"}}>
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
    ).isRequired
}

export default Deck