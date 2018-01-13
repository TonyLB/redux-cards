import React from 'react'
import Card from './Card'
import Header from './SVG/Header'

export const cardSeparatedDeck = ( {
    id,
    cards, 
    headerTop=false, 
    discard=false, 
    children,
    onClick,
    top=0, 
    left=0, 
    zIndex=0, 
    className='svg-blues'} ) => {
    let header = (
        <Header className={ cards.length ? className : 'svg-greys'} width={76}>
            <text x="38" y="15">{cards.length}</text>
        </Header>
    )
    return {
        jsx: [(
            <div key={`STATIC-HEADER-${id}`} style={{position:"absolute", top:(top+(headerTop?0:145))+"px", left:left+"px"}}>
                { header }
            </div>
        )].concat(cards.length ? [] :[(
            <Card 
                top={(top+(headerTop?20:0))}
                left={left}
                className='card-empty'
                children={children}
                onClick={onClick}
                key={`STATIC-EMPTY-${id}`}
            />
        )]), 
        styles: (discard ? cards.slice(0).reverse() : cards).slice(0,3).map((card, index) => ({
            top: (top+(headerTop?20:0))+index*5,
            left: left+index*5,
            zIndex: zIndex+3-index,
            children: index === 0 ? children : [],
            onClick: onClick,
            showBack: !discard,
            cardId: card.id,
            ...card
        }))
    }
}

export const Deck = ( {
        cards, 
        headerTop=false, 
        discard=false, 
        children, 
        top=0, 
        left=0, 
        zIndex=0, 
        className='svg-blues'} ) => {
    let header = (
        <Header className={ cards.length ? className : 'svg-greys'} width={76}>
            <text x="38" y="15">{cards.length}</text>
        </Header>
    )
    return (
        <div>
            <div style={{position:"absolute", top:(top+(headerTop?0:145))+"px", left:left+"px"}}>
                { header }
            </div>
            { cards.length ? (discard ? cards.slice(0).reverse() : cards).slice(0,3).map((card, index) => (
                    <Card 
                        top={(top+(headerTop?20:0))+index*5}
                        left={left+index*5}
                        zIndex={zIndex+3-index}
                        children={ index === 0 ? children : ''}
                        showBack={!discard}
                        key={card.id}
                        cardId={card.id}
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
        </div>
)}

export default Deck