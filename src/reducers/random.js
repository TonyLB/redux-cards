const random = (state = { values: [0.5], index:0}, action) => {
    switch(action.type) {
        default:
            return state
    }
}

const advanceRandom = (state = { values: [0.5], index:0}, action, randomsNeeded) => {
    switch(action.type) {
        default:
            return {
                ...state,
                index: (state.index+randomsNeeded) % 2000
            }
    }
}

const randomList = (state, randomsNeeded) => {
    console.log(state)
    if (state.index + randomsNeeded < 2000) {
        return state.values.slice(state.index, state.index + randomsNeeded )
    }
    else {
        return [ ...state.values.slice(state.index, 2000),
            ...randomList({values:state.values, index:0}, randomsNeeded - 2000 + state.index)]
    }
}

export default random
export { random, advanceRandom, randomList }