const timers = (state = { byId: {}, allIds: []}, action = { type: 'NULL' }) => {
    switch(action.type) {
        case 'TICK':
            const timeOffset = action.time - state.lastTick
            return {
                ...state,
                lastTick: action.time,
                byId: Object.values(state.byId)
                    .map(timer => (timer.durationSpent === null ? timer : {
                        ...timer,
                        durationSpent: timer.durationSpent + timeOffset,
                        durationRemaining: timer.durationRemaining - timeOffset
                    }))
                    .reduce((output, timer) => ({ ...output, [timer.id]: timer }), {})
            }
        case 'START_TIMER':
            return state.byId[action.id]
                ? {
                    ...state,
                    byId: {
                        ...state.byId,
                        [action.id]: {
                            ...state.byId[action.id],
                            durationSpent: 0,
                            durationRemaining: action.duration || 
                                state.byId[action.id].durationRemaining + 
                                (state.byId[action.id].durationSpent || 0)
                        }
                    }
                }
                : {
                    ...state,
                    byId: {
                        ...state.byId,
                        [action.id]: {
                            id: action.id,
                            durationSpent: 0,
                            durationRemaining: action.duration || 1000,
                            execute: action.execute,
                            repeating: action.repeating
                        },
                    },
                    allIds: [ ...state.allIds, action.id ]
                }
        case 'STOP_TIMERS':
            return {
                ...state,
                byId: action.timers.reduce((output, timer) => (
                    state.byId[timer] 
                        ? {
                            ...output,
                            [timer]: {
                                ...output[timer],
                                durationRemaining: 
                                    output[timer].durationRemaining + 
                                    output[timer].durationSpent,
                                durationSpent: null
                            }
                        }
                        : output
                    ), { ...state.byId })
            }
        case 'REPEAT_TIMERS':
            return {
                ...state,
                byId: action.timers.reduce((output, timer) => (
                    state.byId[timer] && state.byId[timer].durationRemaining <= 0
                        ? {
                            ...output,
                            [timer]: output[timer].durationRemaining * 2 + output[timer].durationSpent >= 0 ? {
                                ...output[timer],
                                durationRemaining: 
                                    (output[timer].durationRemaining * 2) + 
                                    output[timer].durationSpent,
                                durationSpent: 0-output[timer].durationRemaining
                            }
                            : {
                                ...output[timer],
                                durationRemaining: 0,
                                durationSpent: output[timer].durationRemaining + 
                                    output[timer].durationSpent
                            }
                        }
                        : output
                    ), { ...state.byId })
            }
        case 'SET_TIMERS':
            return {
                ...state,
                byId: action.timers.reduce((output, timer) => (
                    Object.assign(output, {
                        [timer.id]: {
                            ...state.byId[timer.id],
                            durationRemaining: timer.duration 
                                ? timer.duration - (state.byId[timer.id].durationSpent || 0)
                                : state.byId[timer.id].durationRemaining,
                            repeating: timer.repeating !== undefined ? timer.repeating : state.byId[timer.id].repeating,
                            execute: timer.execute !== undefined ? timer.execute: state.byId[timer.id].execute
                        }   
                    })), { ...state.byId })
            }
        case 'SET_TIMEOUT':
            return action.timeoutId ? {
                ...state,
                nextTimeoutId: action.timeoutId
            } : state
        case 'CLEAR_TIMEOUT':
            return {
                ...state,
                nextTimeoutId: null
            }
        default:
            return state
    }
}

export default timers
