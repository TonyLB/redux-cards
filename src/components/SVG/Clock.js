import React from 'react'
import PropTypes from 'prop-types'

const clockPath = (radius, percent, close) => ( (percent >= 1.0) ?
    `M30,${30-radius} 
    A${radius},${radius} 0, 1,1 30,${30+radius}
    A${radius},${radius} 0, 1,1 30,${30-radius}
    z 
    `:
    `${close ? `M30,30 v-${radius} ` : `M30,${30-radius} `}
    A${radius},${radius} 0, ${(percent>0.5) ? 1 : 0},1 
        ${30+Math.sin(percent*2.0*Math.PI)*radius},${30-Math.cos(percent*2.0*Math.PI)*radius}
    ${close? 'z' : ''}
    `
)

class Clock extends React.Component {
    componentDidMount() {
        this.timerId = setInterval(
            () => this.tick(),
            100
        )
    }

    componentWillUnmount() {
        clearInterval(this.timerId)
    }

    tick() {
        this.forceUpdate()
    }

    render() {
        let {startTime=new Date(), duration=10000} = this.props
        let time = new Date()
        let percent = (time - startTime) / duration
        return (percent >= 1.0) ?
        this.props.children :
        (
            <svg 
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
                <path 
                    opacity="0.5" 
                    fill="#898989" 
                    stroke="#000000" 
                    strokeMiterlimit="10" 
                    d={ clockPath(20, percent, 1) }
                    />
                <path 
                    opacity="0.5" 
                    fill="none" 
                    stroke="#000000" 
                    strokeWidth="2"
                    strokeMiterlimit="10" 
                    d={ clockPath(25, percent) }
                    />
            </svg>
        )
    }
}

Clock.PropTypes = {
    startTime: PropTypes.Date,
    duration: PropTypes.number
}

export default Clock