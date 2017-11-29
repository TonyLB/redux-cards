import CardTemplates from './CardTemplates'

const spendableCards = (state, resources = { FUEL: 2 }) => {
    let outputCards = state.hand.stacks
        .filter(stack => ( state.stacks.byId[stack].cards.length ))
        .map(stack => {
            let aggregator = 
                CardTemplates[
                    state.cards.byId[
                        state.stacks.byId[stack].cards[0]]
                    .cardTemplate
                ].type === CardTemplates.Types.Aggregator
            return state.stacks.byId[stack].cards.map(card => ({
                    aggregator: aggregator,
                    stackId: stack,
                    cardId: card,
                    maxUses: CardTemplates[state.cards.byId[card].cardTemplate].maxUses,
                    resources: CardTemplates[state.cards.byId[card].cardTemplate].resources
                })
            )
        })
    outputCards = outputCards
        .reduce((output, stack) => ( output.concat(stack)), [])
        .filter(card => ( card.resources && Object.entries(resources).some(([res]) => ( card.resources[res] ) )))
    
    let totals = outputCards.reduce((output, card) => (
        Object.entries(card.resources)
            .reduce((subtotal, [key, val]) => ( { 
                ...subtotal, 
                [key]: (subtotal[key] || 0) + val 
            }), output)
    ), {} )

    return Object.entries(resources).some(([key, val]) => ( (totals[key] || 0) < val )) ? [] : outputCards        
}

export const canSpend = (state, resources = { FUEL: 2 }) => (
    spendableCards(state, resources).length
)

export const cardsToSpend = (state, resources = { FUEL: 2 }) => {
    let cards = spendableCards(state, resources)

    // Simplistic optimizer grabs cards in order they are provided, until payment
    // is complete.  A more advanced optimizer will test out the combinatoric
    // possibilities to get closer to exact payment (specifically for different
    // denominations of resource)

    return cards.reduce((output, card) => (
        !Object.entries(card.resources)
            .some(([key]) => ((output.totals[key] || 0) < resources[key])) ? 
            output :
            {
                totals: Object.entries(card.resources)
                    .reduce((totalOut, [key, val]) => ({ 
                        ...totalOut, 
                        [key]: (totalOut[key] || 0) + val
                    }), output.totals),
                cards: [ ...output.cards, card ]
            }
    ), { totals: {}, cards: []}).cards.map(card => ({ id: card.cardId, source: card.stackId }))
}