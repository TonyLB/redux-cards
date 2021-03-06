import React from 'react'
import Card from './Card'
import CardTemplates from '../state/CardTemplates'
import SideArrow from './SVG/SideArrow'
import Deck from './Deck'
import AnimationFrame from './animation/AnimationFrame'

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
                                CardTemplates[card.cardTemplate].deploy ||
                                CardTemplates[card.cardTemplate].upgrade ||
                                CardTemplates[card.cardTemplate].settings)) ? 
                            props.onClick(card.id) : () => {} }
                         key={card.id}
                    />
                ))
            }
                <SideArrow top={8} left={width-140} className={props.className || 'svg-pinks'} />
                <AnimationFrame top={0} left={width-100}>
                    <Deck cardCount={props.deck.cards.length} className={props.className || 'svg-pinks'} >
                        {
                            props.deck.cards.slice(0, 3).map((card, index) => (
                                <Card {...card} top={index*5} left={index*5} showBack={true} zIndex={3-index} />
                            ))
                        }
                    </Deck>
                </AnimationFrame>
            </div>
        )
    }
}

export default Track