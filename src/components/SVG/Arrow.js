import React from 'react'
import PropTypes from 'prop-types'

const Arrow = ({ rotate, onClick }) => (
    <svg 
        onClick={onClick}
        version="1.1" 
        id="Layer_1" 
        xmlns="http://www.w3.org/2000/svg" 
        x="0px" 
        y="0px"
        width="60px" 
        height="60px" 
        viewBox="0 0 60 60" 
        enableBackground="new 0 0 60 60"
    >
        <polygon 
            opacity="0.5" 
            fill="#898989" 
            stroke="#000000" 
            strokeMiterlimit="10" 
            points="44.5,30.79 44.5,0.5 15.5,0.5 15.5,30.761 0,30.745 30.561,60 60,30.806"
            transform={`rotate(${rotate ? rotate : 0}, 30, 30)`}
            />
    </svg>
)

Arrow.PropTypes = {
    rotate: PropTypes.number,
    onClick: PropTypes.func
}

export default Arrow