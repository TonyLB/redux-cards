import React from 'react'
import PropTypes from 'prop-types'
/*            version="1.1" 
            id="Layer_1" 
xmlns="http://www.w3.org/2000/svg" */

const SideArrow = ({ width=30, height=120, onClick, orientation='LEFT'}) => (
    <div className="positioning-sidearrow" width={width} height={height}>
        <svg 
            className="svg-blues"
            onClick={onClick}
            width={width}
            height={height} 
            viewBox={`0 0 ${width} ${height}`}
            enableBackground={`new 0 0 ${width} ${height}`}
        >
            <polygon 
                points={orientation === 'LEFT' ?
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
    onClick: PropTypes.func
}

export default SideArrow