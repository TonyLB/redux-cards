export const StateTypes = {
    Card: 'CARD',
    Deck: 'DECK',
    Hand: 'HAND',
    Timer: 'TIMER',
}

export const stateTypeKey = (stateType) => (
    stateType.toLowerCase() + 's'
)

export const moveItemReducer = (state, stateType, itemId, destinationId, sourceId) => (
    !itemId ? 
        state :
        {
            ...state,
            [stateTypeKey(stateType)]: (destinationId === state.id) ?
                [...(state[stateTypeKey(stateType)]), itemId] :
                (sourceId === state.id) ?
                    state[stateTypeKey(stateType)].filter((item) => item !== itemId) :
                    state[stateTypeKey(stateType)]
        }
)
