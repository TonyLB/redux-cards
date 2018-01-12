//
// nextTimers
//
// Returns a list of all the timers that will pop at the next scheduled
// TICK.  Because multiple timers can be set to deliver at the same moment,
// the list might be more than one element.
//

export const nextTimers = (state) => (
    [...(Object.values(state.timers.byId))]
        .filter(timer => ( timer.durationSpent !== null ))
        .filter(timer => ( timer.durationRemaining > 0 ))
        .sort((a, b) => ( a.durationRemaining - b.durationRemaining ))
        .reduce((output, timer) => ( output.duration
            ? (
                timer.durationRemaining === output.duration ? {
                    ...output,
                    timerList: [ ...output.timerList, timer.id ]
                }
                : output
            )
            : { duration: timer.durationRemaining, timerList: [timer.id]  }
        ), { duration: null, timerList: [] })
        .timerList
)

// nextDuration
//
// Returns the duration until the next scheduled TICK.
//

export const nextDuration = (state) => {
    const nextTimerList = nextTimers(state)
    return nextTimerList.length
        ? state.timers.byId[nextTimerList[0]].durationRemaining
        : null
}

//
// expiredTimers
//
// Returns a list of all the timers that are expired, in the order in
// which they expired
//

export const expiredTimers = (state) => (
    [...(Object.values(state.timers.byId))]
        .filter(timer => ( timer.durationRemaining <= 0 ))
        .sort((a, b) => ( a.durationRemaining - b.durationRemaining ))
        .map(timer => ( timer.id ))
)

//
// elapsed
//
// Returns an object with durationSpent and durationRemaining for
// a given timer.

export const elapsed = (state, timerId) => {
    if (state.timers.byId[timerId]) {
        return {
            durationSpent: state.timers.byId[timerId].durationSpent,
            durationRemaining: state.timers.byId[timerId].durationRemaining
        }
    }
    else {
        console.log('Elapsed called on invalid timerId')
        return {
            durationSpent: 0,
            durationRemaining: 1000,
            lastTick: new Date()
        }
    }
}