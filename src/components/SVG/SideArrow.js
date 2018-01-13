import React from 'react'

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

export default SideArrow