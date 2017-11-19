import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
//import Clock from './SVG/Clock'
import Countdown from '../containers/Countdown'
import Arrow from './SVG/Arrow'

class Hand extends React.Component {

    render () {
        let props = this.props

        const cards = props.cards
        let empties = []
        for (let x=cards.length+1; x<props.maxStacks;x++) { empties.push(x+1) }
        return (
            <table className='toggletable'><tbody><tr>
                {cards.map(card => (
                    <td key={card.id}>
                    <Card className='card-plain' {...card} onClick={props.discardClick(card.id)} />
                    </td>
                ))}
                { (cards.length < props.maxStacks) ? (
                    <td key={"EMPTY-"+cards.length}>
                        <Card className='card-empty' id={"EMPTY-"+cards.length} >
                            <Countdown timerId={props.timerId}>
                                <Arrow onClick={ props.drawClick } />
                            </Countdown>
                        </Card>
                    </td>
                ) : null}
                {empties.map((index) => (
                    <td key={"EMPTY-"+index}>
                        <Card className='card-empty' id={"EMPTY-"+index} value='' onClick={null} />
                    </td>
                ))}
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