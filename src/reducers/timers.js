const timerExpired = ({ startTime = new Date(), duration=10000 }) => {
    return (
    new Date() - startTime > duration
)}

const timers = (state = { byId: {}, allIds: []}, action = { type: 'NULL' }) => {
    switch(action.type) {
        case 'START_TIMER':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.id]: {
                        ...state.byId[action.id],
                        startTime: action.startTime,
                        timeoutId: action.timeoutId,
                        duration: action.duration ? action.duration : state.byId[action.id].duration
                    }
                }
            }
        case 'SET_TIMERS':
            return {
                ...state,
                byId: action.timers.reduce((output, timer) => (
                    Object.assign(output, {
                        [timer.id]: {
                            ...state.byId[timer.id],
                            duration: timer.duration
                        }   
                    })), { ...state.byId })
            }
        case 'CLEAR_TIMER':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.id]: {
                        ...state.byId[action.id],
                        timeoutId: null
                    }
                }
            }
        default:
            return state
    }
}

export default timers
export { timers, timerExpired }