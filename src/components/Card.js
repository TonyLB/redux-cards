import React from 'react'
import PropTypes from 'prop-types'
import CardTemplates from '../state/CardTemplates'

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
        cardId 
    }) => (
    <div style={{top:top, left:left, zIndex:zIndex, position:"absolute"}}
        className={className?className:cardTemplate?('card-'+CardTemplates[cardTemplate].style):null} 
        onClick={onClick}
    >
        <div className='positioning-center'>
            {children}
        </div>
        <div className='positioning-header'>
            { !showBack && cardTemplate ? CardTemplates[cardTemplate].header : ''}
        </div>
        <div className='positioning-footer'>
            { !showBack && cardTemplate ? CardTemplates[cardTemplate].footer : ''}
        </div>
        <div className='positioning-center'>
            { !showBack && cardTemplate ? CardTemplates[cardTemplate].value : ''}
        </div> 
    </div>
)

Card.PropTypes = {
    id: PropTypes.string,
    className: PropTypes.string,
    top: PropTypes.number,
    left: PropTypes.number,
    zIndex: PropTypes.number,
    value: PropTypes.string.isRequired,
    cardTemplate: PropTypes.string,
    showBack: PropTypes.bool,
    onClick: PropTypes.func
}

export default Card