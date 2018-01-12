import reducer from '../reducers/testApp'
import { nextDuration, expiredTimers } from '../state/timers'

export const startTimer = ({ id, duration, execute, repeating, moment }) => function startTimer(dispatch, getState) {
    const state = getState()
    const oldDuration = nextDuration(state)
    const defaultedMoment = moment || new Date()

    const offset = defaultedMoment - (state.timers.lastTick || 0)

    if (offset > 50) {
        dispatch(tick(defaultedMoment))
    }

    dispatch(Object.assign({
            type: 'START_TIMER',
            id: id
        }, 
        duration === undefined ? {} : { duration: duration },
        execute === undefined ? {} : { execute: execute },
        repeating === undefined ? {} : { repeating: repeating }
    ))

    const newDuration = duration || (state.timers.byId[id].durationRemaining + state.timers.byId[id].durationSpent)
    if (oldDuration === null || newDuration < oldDuration) {
        dispatch(resetTimeout())
    }
}

export const tick = (moment) => function tick(dispatch, getState) {
    const state = getState()
    const tickAction = {
        type: 'TICK',
        time: moment
    }

    dispatch(tickAction)

    //
    // Problem here is that afterState doesn't take into account
    // how repeating timers will be put back into the unexpired
    // section of the queue ... so when it gets down to testing
    // whether it should reset the timeouts, it falsely thinks
    // that it should not (which leaves orphaned timers)
    //
    // Not sure how to fix, but it needs to be done.
    //

    let afterState = reducer(state, tickAction)

    const expired = expiredTimers(afterState)
    if (expired.length) {
        const nonRepeat = expired.filter(timer => ( ! state.timers.byId[timer].repeating ))
        const repeating = expired.filter(timer => ( state.timers.byId[timer].repeating ))
        const executing = expired.filter(timer => ( state.timers.byId[timer].execute ))
    
        if (nonRepeat.length) {
            const action = {
                type: 'STOP_TIMERS',
                timers: nonRepeat
            }
            afterState = reducer(afterState, action)
            dispatch(action)
        }
        if (repeating.length) {
            const action = {
                type: 'REPEAT_TIMERS',
                timers: repeating
            }
            afterState = reducer(afterState, action)
            dispatch(action)
        }
    
        executing.forEach(timer => {
            state.timers.byId[timer].execute(dispatch, getState)
        })
    }

    const offset = moment - state.timers.lastTick
    if (nextDuration(state) - nextDuration(afterState) !== offset ) {
        dispatch(resetTimeout())
    }
}

export const resetTimeout = () => function resetTimeout(dispatch, getState) {
    const state = getState()

    const duration = nextDuration(state)

    if (state.timers.nextTimeoutId) { 
        clearTimeout(state.timers.nextTimeoutId)
    }
    if (duration) {
        const timeoutId = setTimeout(() => {

            let nextTick = new Date()
//            nextTick.setMilliseconds(nextTick.getMilliseconds() + duration)

            dispatch(tick(nextTick))
        }, duration)
        dispatch({ type: 'SET_TIMEOUT', timeoutId: timeoutId })
    } 
    else {        
        dispatch({ type: 'CLEAR_TIMEOUT' })
    }
}

export const setTimers = (timers) => (dispatch, getState) => {
    const state = getState()

    const setAction = {
        type: 'SET_TIMERS',
        timers
    }
    const afterState = reducer(state, setAction)

    dispatch(setAction)

    if (nextDuration(afterState) !== nextDuration(state)) {
        dispatch(resetTimeout())
    }
}
