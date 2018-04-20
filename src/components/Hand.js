import React from 'react'
import Deck from './Deck'
import Stack from './Stack'
import TrackContainer from '../containers/TrackContainer'
import ResourceBarContainer from '../containers/ResourceBarContainer'
import Card from './Card'
import Countdown from '../containers/Countdown'
import Arrow from './SVG/Arrow'
import CardsWrapper from './animation/CardsWrapper'
import AnimationFrame from './animation/AnimationFrame'

class Hand extends React.Component {

    render () {
        let props = this.props

        const stacks = props.stacks
        const width = props.width || 600

        return (
            <React.Fragment>
                <TrackContainer trackId={props.equipmentTrack} />
                <CardsWrapper>

                    {/*-
                      Draw Deck
                    */}

                    <AnimationFrame top={220} left={width-100}>
                        <Deck headerTop={false} cardCount={props.drawDeck.cards.length} key={props.drawDeck.id}>
                            <Countdown key="CountDown" timerId={props.timerId} zIndex={4} top={35} left={9}>
                                <Arrow onClick={ props.drawClick } rotate={90} />
                            </Countdown>
                            {
                                props.drawDeck.cards.slice(0,3).map((card, index) => (
                                    <Card 
                                        {...card} 
                                        top={index*5} 
                                        left={index*5} 
                                        zIndex={3-index}
                                        cardId={card.id}
                                        key={card.id}
                                        showBack={true}
                                    />
                                ))
                            }
                        </Deck>
                    </AnimationFrame>

                    {/*-
                      Discard Deck
                    */}

                    <AnimationFrame top={430} left={width-100}>
                        <Deck headerTop={true}  cardCount={props.discardDeck.cards.length} key={props.discardDeck.id}>
                            {
                                props.discardDeck.cards.slice(0).reverse().slice(0,3).map((card, index) => (
                                    <Card 
                                        {...card} 
                                        top={index*5} 
                                        left={index*5} 
                                        zIndex={3-index}
                                        cardId={card.id}
                                        key={card.id}
                                    />
                                ))
                            }
                        </Deck>
                    </AnimationFrame>

                    {/*-
                      In-play stacks of cards
                    */}

                    { stacks
                        .map((stack, index) => (
                            <AnimationFrame top={220} left={10+95*index} key={"Frame-"+stack.id}>
                                <Stack
                                    alternateName={stack.alternateName}
                                    alternateClick={props.alternateClick(stack.id)}
                                    key={stack.id}
                                >
                                    { stack.cards.map((card, index) => (
                                        <Card 
                                            {...card} 
                                            top={index*20} 
                                            left={index?10:0} 
                                            zIndex={index}
                                            cardId={card.id}
                                            key={card.id}
                                            onClick={props.discardClick(card.id)}
                                        />
                                    ))}
                                </Stack>
                            </AnimationFrame>
                        ))
                    }
                    <ResourceBarContainer top={170} width={width-150} left={5} />
                </CardsWrapper>
            </React.Fragment>
        ) 
    }
}

export default Hand