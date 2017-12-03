import CardTemplates from './CardTemplates'

//
// Given a list of denormalized stacks, a list of card-templates to
// be looking for, and a number of cards needed, listOfAggregatedCards
// returns the next however many cards (up to the needed number) are
// available.
//

const listOfAggregatedCards = (stacks, cardTemplates, cardsNeeded) => ( 
    cardsNeeded ? 
        stacks
        .reduce((state, stack) => 
            (state.concat(
                stack.cards
                    .filter(card => (cardTemplates.includes(card.cardTemplate)))
                    .map(card => ({ 
                        id: card.id, 
                        source: stack.id
                    }))
                )
            ), 
            []
        )
        .slice(0,cardsNeeded)
    : []
)

//
// willAggregate returns a list of card-Moves that
// an aggregator stack can execute to grab cards
// according to the aggregation rules.
//
export const willAggregate = (state, stackId) => {
    const anticipatedStacks = state.hand.stacks
            // Look only at stacks starting at stackId and later in the hand
        .slice(state.hand.stacks.indexOf(stackId))
            // Denormalize stack Ids into stack structure
        .map(stack => ({ ...state.stacks.byId[stack]}))
            // Remove empty stacks from consideration
        .filter(stack => (stack.cards.length > 0))
            // Denormalize card Ids into card structure
        .map(stack => ({
            ...stack,
            cards: stack.cards.map(card => ({ ...state.cards.byId[card]}))
        }))

    if (!anticipatedStacks.length ||
        anticipatedStacks[0].id !== stackId ||
        !anticipatedStacks[0].cards.length) return []

    const aggregationTypes = CardTemplates[anticipatedStacks[0].cards[0].cardTemplate].aggregates

    if (!(aggregationTypes && aggregationTypes.length)) return []

    // This checks how much of the aggregation is already full.

    const cardsNeeded = aggregationTypes
        .map(aggType => ({ 
            ...aggType, 
            cardTemplates: Array.isArray(aggType.cardTemplates) ? 
                aggType.cardTemplates : 
                [ aggType.cardTemplates ] 
            }))
        .map(({cardTemplates, maxStack}) => ({
            cardTemplates: cardTemplates,
            cardsNeeded: maxStack - anticipatedStacks[0].cards
                .slice(1)
                .filter(card => ( cardTemplates.includes(card.cardTemplate) ))
                .length
        }))

    return cardsNeeded.reduce((output, card) => ([
        ...output,
        ...(listOfAggregatedCards(
            anticipatedStacks.slice(1),
            card.cardTemplates,
            card.cardsNeeded)
            .map(card => ({ ...card, destination: stackId })))
    ]), [])
}
