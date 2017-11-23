import React from 'react'
import PropTypes from 'prop-types'
import CardTemplates from '../state/CardTemplates'

const Card = ({ className, value, cardTemplate, onClick, children }) => (
    children ? (
            <div className={className} onClick={onClick}>
                {children}
            </div>
        ) : 
        (
            <div className={className} onClick={onClick}>
                <p>{value ? value : cardTemplate ? CardTemplates[cardTemplate].value : ''}</p>
            </div>
        ) 
)

Card.PropTypes = {
    id: PropTypes.string,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func
}

export default Card