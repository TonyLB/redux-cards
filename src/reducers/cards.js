import CardTemplates from '../state/CardTemplates'

const cards = (state = { byId: {}, allIds: [] }, action = { type: 'NULL' }) => {
    switch (action.type) {
        case 'REPLACE_CARDS':
            return {
                ...state,
                byId: Object.values(state.byId)
                    .filter(card => ( action.cardMap[card.cardTemplate]))
                    .map(card => ({
                        ...card,
                        cardTemplate: action.cardMap[card.cardTemplate]
                    }))
                    .reduce((output, card) => (Object
                            .assign(output, 
                                { [card.id]: card })), { ...state.byId })
            }
        case 'MARK_USE':
            return {
                ...state,
                byId: action.cards
                    .filter(card => (state.byId[card].id && state.byId[card].uses))
                    .reduce((output, card) => ({
                        ...output,
                        [card]: {
                            ...(output[card]),
                            uses: output[card].uses-1
                        }
                    }), { ...state.byId })
            }
        case 'MOVE_CARDS': 
            let removedCards = action.cards
                .filter(card => ( !card.destination ))
                .map(card => ( card.id ))
            let newById = Object.values(state.byId)
                .filter(card => ( !removedCards.includes(card.id) ))
                .map(card => {
                    if (!(card.deployed && removedCards.includes(card.deployed))) { return card }
                    return { ...card, deployed: undefined }
                })
                .reduce((output, card) => ( { ...output, [card.id]: card } ), {})

            return {
                byId: newById,
                allIds: Object.keys(newById)
            }
        case 'ADD_CARDS':
            let addById = { ...state.byId }
            action.cards.forEach(card => {
                Object.assign(addById, {
                    [card.id]: {
                        id: card.id,
                        cardTemplate: card.cardTemplate,
                        uses: CardTemplates[card.cardTemplate].maxUses ? CardTemplates[card.cardTemplate].maxUses : undefined,
                        maxUses: CardTemplates[card.cardTemplate].maxUses ? CardTemplates[card.cardTemplate].maxUses : undefined
                    }
                })
                if (card.deployedBy) {
                    Object.assign(addById, {
                        [card.deployedBy]: {
                            ...(state.byId[card.deployedBy]),
                            deployed: card.id
                        }
                    })
                }
            })
            return {
                ...state,
                byId: addById,
                allIds: [ ...state.allIds, ...(action.cards.map(card => (card.id))) ]
            }
        default: return state
    }
}

export default cards