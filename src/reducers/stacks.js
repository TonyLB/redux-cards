import { stack, shuffleStack } from './stack'

const shuffleStacks = (state = { byId: {}, allIds: []}, action, cards, randoms) => {
    let tempById = {}
    state.allIds.forEach((stackId) => {
        tempById[stackId] = shuffleStack(state.byId[stackId], action, cards, randoms)
    })
    return {
        ...state,
        byId: tempById
    }
}

const stacks = (state = { byId: {}, allIds: []}, action) => {
    let tempById = {}
    state.allIds.forEach((stackId) => {
        tempById[stackId] = stack(state.byId[stackId], action)
    })
    return {
        ...state,
        byId: tempById
    }
}

export default stacks
export { stacks, shuffleStacks }