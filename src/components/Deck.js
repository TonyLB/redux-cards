import React from 'react'
import Header from './SVG/Header'
import EmptyCard from './EmptyCard'

export const Deck = ( {
        cardCount=0,
        children, 
        headerTop=false, 
        className='svg-blues'} ) => {
    return (
        <React.Fragment>
            <div style={{position:"absolute", top:(headerTop?-30:150)+"px", left:"0px"}}>
                <Header className={ cardCount ? className : 'svg-greys'} width={76}>
                    <text x="38" y="15">{cardCount}</text>
                </Header>
            </div>
            {children}
            <EmptyCard />
        </React.Fragment>
    )
}

export default Deck