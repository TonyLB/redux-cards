import React from 'react'
import { TransitionMotion, spring } from 'react-motion'
import PropTypes from 'prop-types'
import { cardSeparatedStack } from './Stack'
import { cardSeparatedDeck } from './Deck'
import Card from './Card'
import Countdown from '../containers/Countdown'
import Arrow from './SVG/Arrow'

class Hand extends React.Component {

    render () {
        let props = this.props

        const stacks = props.stacks
        const width = props.width || 600
        const height = props.height || 400
        let drawDeck = cardSeparatedDeck({id: props.drawId, cards: props.drawDeck.cards, top: 0, left: width-100})
        let discardDeck = cardSeparatedDeck({id: props.discardId, cards: props.discardDeck.cards, top: 190, left: width-100, headerTop: true, discard: true})
        let stackRender = stacks
            .map((stack, index) => cardSeparatedStack({
                ...stack,
                top: 0,
                left: 95*index,
                discardClick: props.discardClick(stack.id),
                children: stack.firstOpenStack ? (
                        <Countdown timerId={props.timerId}>
                            <Arrow onClick={ props.drawClick } />
                        </Countdown>
                    ) : null})
            )
            .reduce((state, object) => ({ 
                jsx: state.jsx.concat(object.jsx),
                styles: state.styles.concat(object.styles)
            }), { jsx: [], styles: []})

        let styles=[...drawDeck.styles, ...discardDeck.styles, ...stackRender.styles]
            .map(val => ({key: val.cardId, data: val, style: {top:spring(val.top), left:spring(val.left)} }))
        return (
            <div className='positioning-layout' style={{position:"relative", width:width, height:height}}>
                <button style={{position:"absolute", top:'165px', left:(width-90)+"px"}} onClick={ props.shuffleClick }>
                    Shuffle
                </button>
                {drawDeck.jsx}
                {discardDeck.jsx}
                {stackRender.jsx}
                <TransitionMotion
                    styles={styles}
                >
                { interpolatedStyles => (
                    <div>
                        {interpolatedStyles.map (                
                            config => (
                                <Card key={config.key} {...config.data} top={config.style.top} left={config.style.left} />
                            ))
                        }
                    </div>
                )}
                </TransitionMotion>
            </div>
        ) 
    }
}

Hand.PropTypes = {
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
}

export default Hand