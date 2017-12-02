const timerExpired = ({ startTime = new Date(), duration=10000 }) => {
    return (
    new Date() - startTime > duration
)}

const timers = (state = { byId: {}, allIds: []}, action) => {
    switch(action.type) {
        case 'START_TIMER':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    [action.id]: {
                        ...state.byId[action.id],
                        startTime: new Date()
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
                    })), state.byId)
            }
        default:
            return state
    }
}

export default timers
export { timers, timerExpired }