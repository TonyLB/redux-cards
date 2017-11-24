import React from 'react'
import PropTypes from 'prop-types'
import Card from './Card'
import CardTemplates from '../state/CardTemplates'
import SideArrow from './SVG/SideArrow'
import DeckContainer from '../containers/DeckContainer'

class Track extends React.Component {

    render () {
        let props = this.props
        let empties = []
        if (props.cards.length < props.trackSize) {
            empties = Array(props.trackSize - props.cards.length).fill(1).map((val, index) => ({ id: `TRACK-EMPTY-${index}` }))
        }
        return (
            <table className='positioning-table'><tbody><tr>
            {
                empties.map(card => (
                    <td key={card.id}>
                        <Card className='card-empty' {...card} />
                    </td>
                ))
            }
            {
                props.cards.map(card => (
                    <td key={card.id}>
                        <Card 
                            className='card-plain' 
                            {...card} 
                            onClick={(card.cardTemplate && CardTemplates[card.cardTemplate].payload) ? 
                                props.onClick(
                                    card.id,
                                    CardTemplates[card.cardTemplate].payload
                                ) : () => {} }
                        />
                    </td>
                ))
            }
            <td>
                <SideArrow onClick={ props.cardDrawClick } />
            </td><td>
                <DeckContainer deck={ props.deck } />
            </td>
            </tr></tbody></table>
        )
    }
}

Track.PropTypes = {
    id: PropTypes.string.isRequired,
    cards: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            val: PropTypes.string.isRequired
        }).isRequired
    ).isRequired,
    trackSize: PropTypes.number.isRequired,
}

export default Track