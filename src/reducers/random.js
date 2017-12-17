const random = (state = { values: [0.5], index:0}, action = { type: 'NULL' }) => {
    switch(action.type) {
        default:
            return state
    }
}

const advanceRandom = (state = { values: [0.5], index:0}, action, randomsNeeded) => {
    const randomsAvailable = state.values.length
    switch(action.type) {
        default:
            return {
                ...state,
                index: (state.index+randomsNeeded) % randomsAvailable
            }
    }
}

const randomList = (state, randomsNeeded) => {
    const randomsAvailable = state.values.length
    if (state.index + randomsNeeded < randomsAvailable) {
        return state.values.slice(state.index, state.index + randomsNeeded )
    }
    else {
        return [ ...state.values.slice(state.index),
            ...randomList({values:state.values, index:0}, randomsNeeded - randomsAvailable + state.index)]
    }
}

export default random
export { random, advanceRandom, randomList }