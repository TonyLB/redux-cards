export const lockStack = (stackId) => ({
    type: 'LOCK_STACK',
    stackId: stackId
})

export const unlockStack = (stackId) => ({
    type: 'UNLOCK_STACK',
    stackId: stackId
})