import React from 'react'
import PropTypes from 'prop-types'
import Stack from './Stack'
import Countdown from '../containers/Countdown'
import Arrow from './SVG/Arrow'
import DeckContainer from '../containers/DeckContainer'

class Hand extends React.Component {

    render () {
        let props = this.props

        const stacks = props.stacks
        const width = props.width || 600
        const height = props.height || 400
        return (
            <div>

            <div className='positioning-layout' style={{position:"relative", width:width, height:height}}>
                <DeckContainer top='0px' left={(width-100)+"px"} deck={props.drawId} />
                <DeckContainer top='190px' left={(width-100)+"px"} headerTop deck={props.discardId} />
                <button style={{position:"absolute", top:'165px', left:(width-90)+"px"}} onClick={ props.shuffleClick }>
                    Shuffle
                </button>
                {stacks.map((stack, index) => (
                    <Stack {...stack} key={stack.id} top="0px" left={(90*index)+"px"} discardClick={props.discardClick(stack.id)}>
                        {(stack.firstOpenStack ? (
                            <Countdown timerId={props.timerId}>
                                <Arrow onClick={ props.drawClick } />
                            </Countdown>
                        ): null)}
                    </Stack>
            ))}
            </div>
        </div>
        )
    }
}

Hand.PropTypes = {
    id: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            val: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    discardClick: PropTypes.func,
    drawClick: PropTypes.func,
    timer: PropTypes.shape({
        id: PropTypes.string.isRequired,
        startTime: PropTypes.Date,
        duration: PropTypes.number
    }).isRequired
}

export default Hand