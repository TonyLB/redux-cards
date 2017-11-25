import React from 'react'
import PropTypes from 'prop-types'
/*            version="1.1" 
            id="Layer_1" 
xmlns="http://www.w3.org/2000/svg" */

const SideArrow = ({ width=30, height=120, top, left=0, className='svg-blues', onClick, orientation='LEFT'}) => (
    <div 
        className="positioning-sidearrow" 
        style={{
            width:width, 
            height:height, 
            left:left, 
            top:top||0,
            position: (top === undefined) ? 'relative' : 'absolute'
            }}
    >
        <svg 
            className={className}
            onClick={onClick}
            width={width}
            height={height} 
            viewBox={`0 0 ${width} ${height}`}
            enableBackground={`new 0 0 ${width} ${height}`}
        >
            <polygon 
                points={ orientation === 'LEFT' ?
                    `1,${height/2} ${width-1},1 ${width-1},${height-1}` :
                    `${width-1},${height/2} 1,1 1,${height-1}`
                }
                />
        </svg>
    </div>
)

SideArrow.PropTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    top: PropTypes.number,
    left: PropTypes.number,
    className: PropTypes.string,
    onClick: PropTypes.func,
    orientation: PropTypes.string
}

export default SideArrow