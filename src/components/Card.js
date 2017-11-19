import React from 'react'
import PropTypes from 'prop-types'

/*const cardFill = (value, glyph) => (
    glyph ? glyph : (
        <p>
            {value}
        </p>
    )
)*/

const Card = ({ className, value, onClick, children }) => (
    <div className={className} onClick={onClick}>
        { children ? children : (
            <p>
                {value}
            </p>
        ) }
    </div>
)

Card.PropTypes = {
    id: PropTypes.string,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func
}

export default Card