import React from 'react'
import CardTemplates from '../state/CardTemplates'
import { resourceShortForm }from '../state/Resources'

export const Card = ({ 
        className, 
        top=0, 
        left=0, 
        zIndex=0, 
        value, 
        cardTemplate, 
        onClick, 
        children, 
        showBack=false, 
        cardId,
        uses,
        maxUses,
        hideUses=false
    }) => (
    <div style={{top:top, left:left, zIndex:zIndex, position:"absolute"}}
        className={className?className:cardTemplate?('card-'+CardTemplates[cardTemplate].style):null} 
        onClick={onClick}
    >
        <div className='positioning-center' style={{width:76}}>
            {children}
        </div>
        <div className='positioning-header' style={{width:76}}>
            { !showBack && cardTemplate ? CardTemplates[cardTemplate].header : ''}
        </div>
        <div className='positioning-footer' style={{width:76}}>
            { !showBack && maxUses && !hideUses ? (<div>Uses: {uses}/{maxUses}</div>) : ''}
            { !showBack && cardTemplate ? CardTemplates[cardTemplate].footer : ''}
            { !showBack && cardTemplate && CardTemplates[cardTemplate].resources ?  
                resourceShortForm(`${cardId}-RESOURCE-`, CardTemplates[cardTemplate].resources) : ''}
            { !showBack && cardTemplate && CardTemplates[cardTemplate].cost ?  
                resourceShortForm(`${cardId}-COST-`, CardTemplates[cardTemplate].cost) : ''}
        </div>
        <div className='positioning-center'>
            { !showBack && cardTemplate ? CardTemplates[cardTemplate].value : ''}
        </div> 
    </div>
)

export default Card