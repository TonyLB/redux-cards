import CardTemplates from '../state/CardTemplates'

const cards = (state = { byId: {}, allIds: [] }, action) => {
    switch (action.type) {
        case 'MARK_USE':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.cardId]: {
                        ...(state.byId[action.cardId]),
                        uses: state.byId[action.cardId].uses+1
                    }
                }
            }
        case 'REMOVE_CARD': 
            let newById = { ...state.byId }
            newById.delete(action.cardId)
            return {
                byId: newById,
                allIds: state.allIds.filter(id => (id !== action.cardId))
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