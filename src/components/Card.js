import React from 'react'
import PropTypes from 'prop-types'
import CardTemplates from '../state/CardTemplates'

const Card = ({ className, top=0, left=0, zIndex=0, value, cardTemplate, onClick, children, showBack=false }) => (
    (children || showBack) ? (
            <div style={{top:top, left:left, zIndex:zIndex, position:"absolute"}}
                className={className?className:cardTemplate?('card-'+CardTemplates[cardTemplate].style):null} 
                onClick={onClick}
            >
                {children}
            </div>
        ) : 
        (
            <div style={{top:top, left:left, position:"absolute"}}
                className={className?className:cardTemplate?('card-'+CardTemplates[cardTemplate].style):null} 
                onClick={onClick}
            >
                <p>{value ? value : cardTemplate ? CardTemplates[cardTemplate].value : ''}</p>
            </div>
        ) 
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