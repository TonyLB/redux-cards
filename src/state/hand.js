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

export const combinatoricExpansion = (cardList) => {
    if (cardList.length) {
        const recursiveExpand = combinatoricExpansion(cardList.slice(1))
        return [ ...recursiveExpand,
            ...(recursiveExpand.map(val => [cardList[0], ...val]))
        ]
    }
    else {
        return [ [] ]
    }
}

export const priceTotal = (cardList) => (
    cardList.length 
        ? cardList.reduce((total, card) => (Object.entries(card.resources)
            .reduce((totalOut, [key, val]) => ({ 
                ...totalOut, 
                [key]: (totalOut[key] || 0) + val
            }), total)
        ), {})
        : {}
    )

export const cardsToSpend = (state, resources = { FUEL: 2 }) => {
    const cards = spendableCards(state, resources)

    // Brute-force combinatoric expansion of all possible ways to spend
    // the needed price.  Might need performance tuning.

    const pricedOptions = combinatoricExpansion(cards)
        // Assign a total price to the combination of cards brute-force-selected
        .map(pricedCards => ({ total: priceTotal(pricedCards), cards: pricedCards }))
        // Remove any combination that doesn't meet the price required
        .filter(priced => ( !Object.entries(resources).some(([key, val]) => ( (priced.total[key] || 0) < val))))
        // Map the remainder by gross cost of the resources they would spend
        .map(priced => ({ 
            cards: priced.cards,
            grossCost: Object.values(priced.total).reduce((total, val) => (total + val), 0)
        }))
        // Sort the lowest cost to the front
        .sort((a, b) => ( (a.grossCost - b.grossCost) || (b.cards.length-a.cards.length)  ))
    return pricedOptions.length ? pricedOptions[0].cards.map(card => ({ id: card.cardId, source: card.stackId })) : []

}

export const canRecycle = (state, stackId) => (
    state.stacks.byId[stackId].cards.length === 1 ? 
        CardTemplates[state.cards.byId[state.stacks.byId[stackId].cards[0]].cardTemplate].type !== CardTemplates.Types.Planete :
        false
)