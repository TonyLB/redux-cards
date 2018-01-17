import React from 'react'
import { TransitionMotion, spring } from 'react-motion'
import Glyph from './SVG/Glyph'

class ResourceBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {showAll: false}
    }

    singleBar ({ key, top, resources, width, height, className }) {
        const entryCount = Object.entries(resources).length

        // Divide up the space evenly
        const styleWidthUnbounded = entryCount ? width / entryCount : 0

        // But you don't need more than 100 px per entry
        const styleWidth = styleWidthUnbounded > 100 ? 100 : styleWidthUnbounded

        // And if there's space left over, put half of it at the front
        const styleOffset = (width - (styleWidth * (entryCount-1)) ) / 2

        const styles = [...(Object.entries(resources))]
            .sort((a, b) => (b[1] - a[1]))
            .map(([resource, value], index) => ({
                key: `${key}-${resource}`,
                data: { resource: resource, value: value },
                style: {
                    left: spring(styleOffset + styleWidth * index),
                    width: spring(styleWidth)
                }
            }))
        return (
            <div key={key} style={{top:top, width:width, height:height, left:0, position:"absolute"}}
                className={className}
            >
                <TransitionMotion styles={styles} >
                { interpolatedStyles => (
                    <div>
                        {[...interpolatedStyles]
                            .map((config, index) => (
                                <div key={config.key} className='positioning-center' style={{ 
                                    position:"absolute", 
                                    width:config.style.width, 
                                    height: height-1,
                                    top: height/2,
                                    left:config.style.left,
                                }}>
                                { config.data.value } <Glyph size={24} shape={config.data.resource} />
                                </div>
                        ))}
                    </div>
                )}
                </TransitionMotion>
            </div>
        )
    }

    render () {

        const {
            top=0,
            left=10,
            width=370,
            height=40,
            zIndex=0,
            className="resource-bar",
            resources
        } = this.props
        const showAll = this.state ? this.state.showAll : false

        return (
            <div>
                <div style={{top:top+height-10, left:left, width: width, height: 10, zIndex:zIndex, position: "absolute"}} 
                    className = {`${className}-emphasis`} 
                />
                <div style={{
                        top:top, 
                        left:left+width-50, 
                        width: 40, 
                        height: height-5, 
                        zIndex:zIndex, 
                        position: "absolute",
                        fontSize: "12px"
                    }} 
                    className = {`${className}-button`} 
                    onClick={() => { this.setState((prev) => ({ ...prev, showAll: !prev.showAll })) }}
                    >
                    <p />{showAll ? 'all' : 'hand'}
                </div>
                <TransitionMotion styles={[

                    // Lay out the two bars, with one in visible position, one slid down below that (in a
                    // <div> with overflow:hidden, that will make it invisible)
                    
                    { key: "allCards", style: { top: spring(this.state.showAll ? 0 : height)}, data: resources.allCards }, 
                    { key: "hand", style: { top: spring(this.state.showAll ? height : 0) }, data: resources.hand }, 
                ]} >
                    { barStyles => (
                        <div style={{ 
                            top: top, 
                            left:left+10, 
                            width:width-60, 
                            height:height-3, 
                            zIndex:zIndex+1, 
                            position:"absolute",
                            overflow:"hidden",
                            className: `${className}-container`
                        }}>
                            {barStyles.map(whichBar => ( this.singleBar({
                                key: `RESOURCE-BAR-${whichBar.key}`,
                                top: whichBar.style.top,
                                left: left+10,
                                height: height-5,
                                width: width-62,
                                className: className,
                                resources: whichBar.data
                            })))}
                        </div>
                    )}
                </TransitionMotion>
            </div>
        )
    }

}


export default ResourceBar