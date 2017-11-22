import React from 'react'
import PropTypes from 'prop-types'
import Stack from './Stack'
import Countdown from '../containers/Countdown'
import Arrow from './SVG/Arrow'

class Hand extends React.Component {

    render () {
        let props = this.props

        const stacks = props.stacks
        return (
            <table className='toggletable'><tbody><tr>
            {
                stacks.map(stack => (
                    <td key={stack.id}>
                        <Stack {...stack} discardClick={props.discardClick(stack.id)}>
                            {(stack.firstOpenStack ? (
                                <Countdown timerId={props.timerId}>
                                    <Arrow onClick={ props.drawClick } />
                                </Countdown>
                            ): null)}
                        </Stack>
                    </td>
                ))
            }
            </tr></tbody></table>
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