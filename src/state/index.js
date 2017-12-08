import { generateKey } from '../reducers/keys'

export const StateTypes = {
    Card: 'CARD',
    Hand: 'HAND',
    Timer: 'TIMER',
    Stack: 'STACK',
    Track: 'TRACK'
}

export const stateTypeKey = (stateType) => (
    stateType.toLowerCase() + 's'
)

export const moveCardsReducer = (state, cards=[]) => (
    cards.length ?
        {
            ...state,
            cards: state.cards
                .filter(item => (
                    !cards
                        .filter(card => ( 
                            card.source === state.id &&
                            item === card.id
                        ))
                        .length
                ))
                .concat(
                    cards
                        .filter(card => ( card.destination === state.id ))
                        .map(card => (card.id))
                )
        }
    : state
)

export const uniqueMoves = (moves) => (
    Object.values(
        moves
        .reduce((output, move) => (
            output[move.id] ?
                { ...output,
                    [move.id]: {
                        ...(output[move.id]),
                        destination: move.destination
                    }
                } :
                { ...output, [move.id]: move }
        ), {})
    )
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

const emptyDenormalizedObject = { byId: {}, allIds: [] }

export const listToDenormalized = (list, prefix) => {
    const values = list.map(value => ({
            id: value.id || generateKey(prefix),
            ...value
        }))
    return {
        byId: values.reduce((obj, value) => ({
                ...obj,
                [value.id]: value
            }), {}),
        allIds: values.map(value => (value.id))
    }
}

export const denormalizedToList = (object) => (
    object.allIds.map(id => object.byId[id])
)

export const denormalizedSubset = (object, idList) => {
    let newAllIds = object.allIds.filter(val => (idList.includes(val)))
    let newById = newAllIds.reduce((obj, value) => ({ ...obj, [value.id]: value }), {})
    return {
        byId: newById,
        allIds: newAllIds
    }
}

export const combineDenormalizedObjects = (
        object1 = emptyDenormalizedObject, 
        object2 = emptyDenormalizedObject
    ) => {
        let byId = {
            ...object1.byId,
            ...object2.byId
        }
        return {
            byId: byId,
            allIds: Object.keys(byId)
        }
}

export const denormalize = (list, byId) => (
    list.map(item => (byId[item]))
)