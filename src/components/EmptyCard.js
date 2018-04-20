import React from 'react'

export const EmptyCard = ({ 
        className, 
        top=0, 
        left=0, 
        zIndex=0, 
        children
    }) => (
    <div style={{top:top, left:left, zIndex:zIndex, position:"absolute"}}
        className={className?className:'card-empty'} 
    >
        { children }
    </div>
)

export default EmptyCard