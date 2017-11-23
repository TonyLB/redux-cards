const cards = (state = { byId: {}, allIds: [] }, action) => {
    switch (action.type) {
        case 'ADD_CARD': return {
            ...state,
            byId: {
                ...state.byId,
                [action.cardId]: {
                    id: action.cardId,
                    cardTemplate: action.cardTemplate
                }
            },
            allIds: [...state.allIds, action.cardId]
        }
        default: return state
    }
}

export default cards