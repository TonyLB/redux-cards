import CardTemplates from '../state/CardTemplates'

const cards = (state = { byId: {}, allIds: [] }, action) => {
    switch (action.type) {
        case 'MARK_USE':
            return {
                ...state,
                byId: action.cards
                    .filter(card => (state.byId[card].id))
                    .reduce((output, card) => ({
                        ...output,
                        [card]: {
                            ...(output[card]),
                            uses: output[card].uses+1
                        }
                    }), state.byId)
            }
        case 'MOVE_CARDS': 
            let removedCards = action.cards
                .filter(card => ( !card.destination ))
                .map(card => ( card.id ))
            let newById = Object.values(state.byId)
                .filter(card => ( !removedCards.includes(card.id) ))
                .map(card => ({ ...card, deployed: removedCards.includes(card.deployed) ? undefined : card.deployed }))
                .reduce((output, card) => ( { ...output, [card.id]: card } ), {})

            return {
                byId: newById,
                allIds: Object.keys(newById)
            }
        case 'ADD_CARDS': return {
            ...state,
            byId: action.cards
                .reduce((newState, card) => (Object.assign(newState,
                    { [card.id]: {
                        id: card.id,
                        cardTemplate: card.cardTemplate,
                        uses: CardTemplates[card.cardTemplate].maxUses ? 0 : undefined,
                        maxUses: CardTemplates[card.cardTemplate].maxUses ? CardTemplates[card.cardTemplate].maxUses : undefined
                    }},
                    card.deployedBy ? {
                        [cards.deployedBy]: {
                            ...(state.byId[cards.deployedBy]),
                            deployed: card.id
                        }                                
                    } : undefined
                )), state.byId),
            allIds: state.allIds.concat(action.cards.map(card => (card.id)))
        }
        default: return state
    }
}

export default cards