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
            ...value,
            id: value.id || generateKey(prefix)
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
