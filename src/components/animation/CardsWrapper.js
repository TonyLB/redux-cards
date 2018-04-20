import React from 'react'
import { TransitionMotion, spring } from 'react-motion'
import Card from '../Card.js'
import AnimationFrame from './AnimationFrame'

class CardsWrapper extends React.Component {
    pruneChildTree (nodes) {
        if (!nodes || !React.Children.count(nodes)) { 
            return {
                jsx: [],
                styles: []
            }
        }       
        return React.Children
            .toArray(nodes)
            .map((node) => {
                const frameOffset = (AnimationFrame.isPrototypeOf(node.type) || node.type === AnimationFrame)
                    ? { top: node.props.top || 0, left: node.props.left || 0 }
                    : null
                const isCard = (Card.isPrototypeOf(node.type) || node.type === Card) 
                const children = node.props ? node.props.children : []
                return { node, frameOffset, isCard, children }
            })
            .reduce((prev, item) => {
                const recurse = this.pruneChildTree(item.children)
                const adjustedRecurse = item.frameOffset
                    ? {
                        ...recurse,
                        styles: recurse.styles.map(style => ({
                            ...style,
                            top: item.frameOffset.top + style.top,
                            left: item.frameOffset.left + style.left
                        }))
                    }
                    : recurse
                return {
                    jsx: item.isCard 
                        ? [ ...prev.jsx ]
                        : [ 
                            ...prev.jsx,
                            React.cloneElement(item.node, {}, adjustedRecurse.jsx)
                        ],
                    styles: item.isCard
                        ? [ ...prev.styles, { 
                            key: item.node.props.cardId, 
                            data: item.node.props, 
                            top: item.node.props.top,
                            left: item.node.props.left
                        }, ...adjustedRecurse.styles]
                        : [ ...prev.styles, ...adjustedRecurse.styles ]
                }
            }, {
                jsx: [],
                styles: []
            })
    }
    render() {
        const {jsx, styles} = this.pruneChildTree(this.props.children)
        const adjustedStyles = styles
            .sort((a, b) => ( a.key > b.key ? 1 : a.key < b.key ? -1 : 0 ))
            .map(style => ({ ...style, style: {top: spring(style.top), left: spring(style.left) }}))

        return (
            <div>
                {jsx.map((item, index) => ( React.cloneElement(item, { key: index })))}
                <TransitionMotion styles={ adjustedStyles } >
                    { interpolatedStyles => (
                        <React.Fragment>
                            {interpolatedStyles.map (                
                                config => (
                                    <Card key={config.key} 
                                        {...config.data} 
                                        top={config.style.top} 
                                        left={config.style.left} />
                                ))
                            }
                        </React.Fragment>
                    )}
                </TransitionMotion>
            </div>
        )
    }
}

export default CardsWrapper;