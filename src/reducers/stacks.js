import { stack, shuffleStack } from './stack'

const condenseHand = (state = { byId: {}, allIds: []}, action, hand) => {
    let stacks = hand.stacks.map((stackId) => state.byId[stackId])
    let result = { ...state }
    for (let a = 0; a < stacks.length; a++) {
        let destStack = stacks[a]
        if (destStack.cards.length === 0) {
            for (let b = a+1; b < stacks.length; b++) {
                if (stacks[b].cards.length) {
                    destStack.cards = stacks[b].cards
                    stacks[b].cards = []
                    break;
                }
            }
        }
        result[destStack.id] = destStack
    }
    return result
}

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
export { stacks, condenseHand, shuffleStacks }