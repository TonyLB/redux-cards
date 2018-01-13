import React from 'react'
import Card from './Card'
import Header from './SVG/Header'

export const cardSeparatedStack = ( { id, 
        cards=[], 
        discardClick=()=>{}, 
        alternateName='',
        alternateClick=()=>{},
        top=0, 
        left=0, 
        children} ) => {
    return {
        jsx: cards.length ? [(
            <div key={`STATIC-${id}`} >
            { alternateName ? (
                <div style={{top:top+150, left:left, width:76, height:20, position:"absolute"}}>
                    <Header width={76} height={20} gap={50} onClick={alternateClick} />
                    <div className='positioning-center color-blues' style={{ fontSize:'90%' }} onClick={alternateClick}>
                        {alternateName}
                    </div>
                </div>            
            ) : null
            }
            </div>
        )] : [(
            <div key={`STATIC-${id}`} >
            </div>
        ), (
            <Card 
                className='card-empty' 
                top={top}
                left={left}
                value = '' 
                key={`STATIC-EMPTY-${id}`} 
            >
                {children}
            </Card>
        )],
        styles: cards.length ? cards.map((card, index) => ({
            top: top+20*index,
            left: left+(index?10:0),
            zIndex: index,
            cardId: card.id,
            onClick: discardClick(card.id),
            ...card
        })) : []
    }
}

export const Stack = ( { id, cards=[], discardClick=()=>{}, top=0, left=0, children} ) => (
    cards.length ? (
        <div>
            { cards.map((card,index) => (
                <Card 
                    top={top+20*index} {...(card)}
                    left={left+(index?10:0)}
                    key={card.id}
                    cardId={card.id}
                    {...card}
                />
            ))}
            <div style={{top:top+250, left:left, width:76, height:20, position:"absolute"}}>
                <Header width={76} height={20} onClick={discardClick(cards[cards.length-1].id)} />
                <div className='positioning-center color-blues' style={{ fontSize:'90%' }} onClick={discardClick(cards[cards.length-1].id)}>
                    Discard
                </div>
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
                key={id} 
                cardId={id}
            >
                {children}
            </Card>

            <div className='positioning-discard' style={{top:top+250, left:left, position:"absolute"}}>
                <Header className='svg-greys' width={76} height={20} gap={40} />
            </div>
        </div>
    )
)

export default Stack