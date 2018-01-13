import React from 'react'
import { TransitionMotion, spring } from 'react-motion'
import { cardSeparatedStack } from './Stack'
import { cardSeparatedDeck } from './Deck'
import TrackContainer from '../containers/TrackContainer'
import Card from './Card'
import Countdown from '../containers/Countdown'
import Arrow from './SVG/Arrow'

class Hand extends React.Component {

    render () {
        let props = this.props

        const stacks = props.stacks
        const width = props.width || 600
        const height = props.height || 800
        let drawDeck = cardSeparatedDeck({
            id: props.drawId, 
            cards: props.drawDeck.cards,
            children: (
                <Countdown timerId={props.timerId}>
                    <Arrow onClick={ props.drawClick } rotate={90} />
                </Countdown>
            ),
            top: 200, 
            left: width-100
        })
        let discardDeck = cardSeparatedDeck({id: props.discardId, cards: props.discardDeck.cards, top: 390, left: width-100, headerTop: true, discard: true})
        let stackRender = stacks
            .map((stack, index) => cardSeparatedStack({
                ...stack,
                top: 200,
                left: 95*index,
                discardClick: props.discardClick,
                alternateClick: props.alternateClick(stack.id)
            }))
            .reduce((state, object) => ({ 
                jsx: state.jsx.concat(object.jsx),
                styles: state.styles.concat(object.styles)
            }), { jsx: [], styles: []})

        let styles=[...drawDeck.styles, ...discardDeck.styles, ...stackRender.styles]
            .sort((a, b) => ( a.cardId > b.cardId ? 1 : a.cardId < b.cardId ? -1 : 0 ))
            .map(val => ({key: val.cardId, data: val, style: {top:spring(val.top), left:spring(val.left)} }))
        return (
            <div className='positioning-layout' style={{position:"relative", width:width, height:height}}>
                <TrackContainer trackId={props.equipmentTrack} />
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

export default Hand