import React from 'react'
import EmptyCard from './EmptyCard'
import Header from './SVG/Header'

export const Stack = ( { id,
    alternateName='',
    alternateClick=()=>{},
    children} ) => {
    return (
        <React.Fragment>
            { alternateName ? (
                <div style={{top:150, left:0, width:76, height:20, position:"absolute"}}>
                    <Header width={76} height={20} gap={50} onClick={alternateClick} />
                    <div className='positioning-center color-blues' style={{ fontSize:'90%' }} onClick={alternateClick}>
                        {alternateName}
                    </div>
                </div>
            ) : null }
            <EmptyCard />
        </React.Fragment>
    )    
}

export default Stack