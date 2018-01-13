import React from 'react'

const Header = ({ className="svg-blues", width=60, height=20, gap=20, onClick, children }) => (
    <svg 
        className={className}
        onClick={onClick}
        x="0px" 
        y="0px"
        width={width}
        height={height} 
        viewBox={`0 0 ${width} ${height}`}
        enableBackground={`new 0 0 ${width} ${height}`}
    >
        <line x1="0" y1={0.4*height} x2={(width-gap)/2} y2={0.4*height} strokeWidth="2" />
        <line x1="0" y1={0.6*height} x2={(width-gap)/2} y2={0.6*height} strokeWidth="2" />
        <line x1={(width+gap)/2} y1={0.4*height} x2={width} y2={0.4*height} strokeWidth="2" />
        <line x1={(width+gap)/2} y1={0.6*height} x2={width} y2={0.6*height} strokeWidth="2" />
        {children}
    </svg>
)

export default Header