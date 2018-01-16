import React from 'react'
import { TransitionMotion, spring } from 'react-motion'
import Glyph from './SVG/Glyph'

export const ResourceBar = ({
    top=0,
    left=10,
    width=370,
    height=40,
    zIndex=0,
    className="resource-bar",
    resources
}) => {
    const entryCount = Object.entries(resources.hand).length

    // Divide up the space evenly
    const styleWidthUnbounded = entryCount ? width / entryCount : 0

    // But you don't need more than 100 px per entry
    const styleWidth = styleWidthUnbounded > 100 ? 100 : styleWidthUnbounded

    // And if there's space left over, put half of it at the front
    const styleOffset = (width - 20 - (styleWidth * (entryCount-1)) ) / 2

    const styles = Object.entries(resources.hand)
        .map(([resource, value], index) => ({
            key: resource,
            data: value,
            style: {
                left: spring(styleOffset + styleWidth * index),
                top: height/2,
                width: spring(styleWidth),
                height: height
            }
        }))
    return (
        <div>
            <div style={{top:top+height-10, left:left, width: width, height: 10, zIndex:zIndex, position: "absolute"}} className = {className} />
            <div style={{top:top, left:left+10, width:width-20, height:height-5, zIndex:zIndex, position:"absolute"}}
                className={className}
            >
                <TransitionMotion styles={styles} >
                { interpolatedStyles => (
                    <div>
                        {interpolatedStyles.map((config, index) => (
                            <div key={config.key} className='positioning-center' style={{ 
                                position:"absolute", 
                                width:config.style.width, 
                                height:config.style.height, 
                                top:config.style.top,
                                left:config.style.left
                            }}>
                            { config.data } <Glyph size={24} shape={config.key} />
                            </div>
                        ))}
                    </div>
                )}
                </TransitionMotion>
            </div>
        </div>
    )
}

export default ResourceBar