import React from 'react'
import PropTypes from 'prop-types'

const Card = ({ className, value, onClick, children }) => (
    children ? (
            <div className={className}>
                {children}
            </div>
        ) :
        (
            <div className={className}>
                <p>{value}</p>
            </div>
        )
)

Card.PropTypes = {
    id: PropTypes.string,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func
}

export default Card