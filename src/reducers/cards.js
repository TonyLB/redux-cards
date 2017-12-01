import CardTemplates from '../state/CardTemplates'

const cards = (state = { byId: {}, allIds: [] }, action) => {
    switch (action.type) {
        case 'MARK_USE':
            return {
                ...state,
                byId: action.cards
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
        case 'DEPLOY_CARD': return {
            ...state,
            byId: {
                ...state.byId,
                [action.cardId]: {
                    id: action.cardId,
                    cardTemplate: action.cardTemplate,
                    uses: CardTemplates[action.cardTemplate].maxUses ? 0 : undefined,
                    maxUses: CardTemplates[action.cardTemplate].maxUses ? CardTemplates[action.cardTemplate].maxUses : undefined
                },
                [action.source]: {
                    ...(state.byId[action.source]),
                    deployed: action.cardId
                }
            },
            allIds: [...state.allIds, action.cardId]
        }
        case 'ADD_CARD': return {
            ...state,
            byId: {
                ...state.byId,
                [action.cardId]: {
                    id: action.cardId,
                    cardTemplate: action.cardTemplate,
                    uses: CardTemplates[action.cardTemplate].maxUses ? 0 : undefined,
                    maxUses: CardTemplates[action.cardTemplate].maxUses ? CardTemplates[action.cardTemplate].maxUses : undefined
                }
            },
            allIds: [...state.allIds, action.cardId]
        }
        default: return state
    }
}

export default cards