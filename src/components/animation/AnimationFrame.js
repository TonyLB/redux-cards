import React from 'react'

class AnimationFrame extends React.Component {
    render() {
        const {
            top=0,
            left=0,
            width,
            height
        } = this.props
        return (
            <div style={{
                position:"absolute", 
                top:top+"px", 
                left:left+"px",
                width: width+"px",
                height: height+"px"
            }
            }>
                {this.props.children}
            </div>
        )
    }
}

export default AnimationFrame;