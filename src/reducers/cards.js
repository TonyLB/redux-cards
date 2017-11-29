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
        case 'REMOVE_CARDS': 
            //
            // Depends on mutation.  Some day when my brain is fresh, this
            // needs to be refactored to be immutable.
            //

            let newById = { ...state.byId }
            action.cards.forEach(card => { 
                delete newById[card.id]
                for (let key in newById) {
                    if (newById[key].deployed === card.id) {
                        delete newById[key].deployed
                    }
                }
            })
            return {
                byId: newById,
                allIds: state.allIds.filter(id => (!action.cards.some(card => (card.id === id))))
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