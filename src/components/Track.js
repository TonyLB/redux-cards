import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import CardTemplates from '../state/CardTemplates'
import SideArrow from './SVG/SideArrow'
import Deck from './Deck'

class Track extends React.Component {

    render () {
        let props = this.props
        let empties = []
        if (props.cards.length < props.trackSize) {
            empties = Array(props.trackSize - props.cards.length).fill(1).map((val, index) => ({ id: `TRACK-EMPTY-${index}` }))
        }
        const width = props.width || 600
        const height = props.height || 200
        return (
            <div className='positioning-layout' style={{position:"relative", width:width, height:height}}>
            {
                empties.map((card, index) => (
                    <Card className='card-empty' top={0} left={index*90} {...card} key={card.id} />
                ))
            }
            {
                props.cards.map((card, index) => (
                    <Card 
                        {...card}
                        top={0}
                        left={90*(index+empties.length)}
                        onClick={(card.cardTemplate && (CardTemplates[card.cardTemplate].payload ||
                                CardTemplates[card.cardTemplate].deploy)) ? 
                            props.onClick(
                                card.id,
                                CardTemplates[card.cardTemplate].payload,
                                CardTemplates[card.cardTemplate].deploy
                            ) : () => {} }
                         key={card.id}
                    />
                ))
            }
                <SideArrow top={8} left={width-140} className={props.className || 'svg-pinks'} onClick={ props.cardDrawClick } />
                <Deck { ...props.deck } top={0} left={width-100} className={props.className || 'svg-pinks'} />
            </div>
        )
    }
}

Track.PropTypes = {
    id: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            val: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    trackSize: PropTypes.number.isRequired,
}

export default Track