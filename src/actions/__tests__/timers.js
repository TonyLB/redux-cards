import "babel-polyfill";
import { Thunk } from 'redux-testkit'
import { setTimers, resetTimeout, tick, startTimer } from '../timers.js'
import reduce from '../../reducers/testApp'

const StarWars = Date.parse("May 25, 1977 12:00:00")
const existingState = {
    timers: {
        byId: {
            TIMER1: {
                id: 'TIMER1',
                durationSpent: 0,
                durationRemaining: 1000
            },
            TIMER2: {
                id: 'TIMER2',
                durationSpent: 1000,
                durationRemaining: 9000
            }
        },
        allIds: [ 'TIMER1', 'TIMER2' ],
        lastTick: StarWars,
        nextTimeoutId: 5
    }
}

describe('store/actions/timers/resetTimeout', () => {

    beforeEach(() => {
        jest.resetAllMocks()
        jest.useFakeTimers()
        jest.clearAllTimers()
    })

    it('should clearTimeout when all timers are expired', () => {
        const expiredState = reduce(existingState, { type: 'TICK', time: StarWars+10000 })

        const dispatches = Thunk(resetTimeout).withState(expiredState).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'CLEAR_TIMEOUT',
        })
        expect(clearTimeout).toHaveBeenCalledTimes(1)
        expect(clearTimeout).toHaveBeenLastCalledWith(5)
        expect(setTimeout).toHaveBeenCalledTimes(0)
    })

    it('should clearTimeout and setTimeout when there is a timeout and a timer to set', () => {

        const dispatches = Thunk(resetTimeout).withState(existingState).execute()

        setTimeout.mockReturnValueOnce(10)

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SET_TIMEOUT',
            timeoutId: 1
        })
        expect(clearTimeout).toHaveBeenCalledTimes(1)
        expect(clearTimeout).toHaveBeenLastCalledWith(5)
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
    })

    it('should not clearTimeout when no timeout is set', () => {
        const expiredState = reduce(
            reduce(existingState, { type: 'CLEAR_TIMEOUT' }), 
            { type: 'TICK', time: StarWars+10000 })

        const dispatches = Thunk(resetTimeout).withState(expiredState).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'CLEAR_TIMEOUT',
        })
        expect(clearTimeout).toHaveBeenCalledTimes(0)
        expect(setTimeout).toHaveBeenCalledTimes(0)        
    })

    it('should only setTimeout when there is no timeout, but a timer to set', () => {

        const dispatches = Thunk(resetTimeout).withState(
            reduce(existingState, { type: 'CLEAR_TIMEOUT' })).execute()

        setTimeout.mockReturnValueOnce(10)

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SET_TIMEOUT',
            timeoutId: 2
        })
        expect(clearTimeout).toHaveBeenCalledTimes(0)
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000)
    })
    
})

describe('store/actions/timers/setTimers', () => {

    it('should dispatch only basic action when timers are empty', () => {
        const dispatches = Thunk(setTimers).withState(existingState).execute([])

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SET_TIMERS',
            timers: []
        })
    })

    it('should dispatch only basic action when timers do not reorder', () => {
        const dispatches = Thunk(setTimers).withState(existingState).execute([
            { id: 'TIMER2', duration: 5000 }
        ])

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SET_TIMERS',
            timers: [{ id: 'TIMER2', duration: 5000 }]
        })
    })

    it('should dispatch a timeout update when timers reorder', () => {
        const dispatches = Thunk(setTimers).withState(existingState).execute([
            { id: 'TIMER1', duration: 10000 }
        ])

        expect(dispatches.length).toBe(2)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SET_TIMERS',
            timers: [{ id: 'TIMER1', duration: 10000 }]
        })
        expect(dispatches[1].isFunction()).toBe(true)
        expect(dispatches[1].getName()).toEqual('resetTimeout')
    })

    it('should dispatch a timeout update when duration changes', () => {
        const dispatches = Thunk(setTimers).withState(existingState).execute([
            { id: 'TIMER1', duration: 5000 }
        ])

        expect(dispatches.length).toBe(2)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SET_TIMERS',
            timers: [{ id: 'TIMER1', duration: 5000 }]
        })
        expect(dispatches[1].isFunction()).toBe(true)
        expect(dispatches[1].getName()).toEqual('resetTimeout')
    })

    it('should dispatch only basic action when timers double up on existing duration', () => {
        const dispatches = Thunk(setTimers).withState(existingState).execute([
            { id: 'TIMER2', duration: 2000 }
        ])

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SET_TIMERS',
            timers: [{ id: 'TIMER2', duration: 2000 }]
        })
    })
    
})

describe('store/actions/timers/tick', () => {

    it('should dispatch only basic action when tick does not expire any timers', () => {
        const dispatches = Thunk(tick).withState(existingState).execute(StarWars + 500)

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'TICK',
            time: StarWars + 500
        })
    })

    it('should dispatch tick, expire, and resetTimeout when tick expires one non-repeat timer', () => {
        const dispatches = Thunk(tick).withState(existingState).execute(StarWars + 1500)

        expect(dispatches.length).toBe(3)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'TICK',
            time: StarWars + 1500
        })
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'STOP_TIMERS',
            timers: ['TIMER1']
        })
        expect(dispatches[2].isFunction()).toBe(true)
        expect(dispatches[2].getName()).toEqual('resetTimeout')
    })

    it('should dispatch just a REPEAT_TIMER action when tick expires one non-execute, repeat entry', () => {
        const repeatState = reduce(existingState, { type: 'SET_TIMERS', timers: [{ id: 'TIMER1', repeating: true }]})

        const dispatches = Thunk(tick).withState(repeatState).execute(StarWars + 1000)

        expect(dispatches.length).toBe(3)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'TICK',
            time: StarWars + 1000
        })
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'REPEAT_TIMERS',
            timers: ['TIMER1']
        })
        expect(dispatches[2].isFunction()).toBe(true)
        expect(dispatches[2].getName()).toEqual('resetTimeout')
    })    

    it('should dispatch both REPEAT_TIMER and STOP_TIMER when tick expires repeat and non-repeat entries', () => {
        const repeatState = reduce(existingState, { type: 'SET_TIMERS', timers: [{ id: 'TIMER2', repeating: true }]})

        const dispatches = Thunk(tick).withState(repeatState).execute(StarWars + 10000)

        expect(dispatches.length).toBe(4)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'TICK',
            time: StarWars + 10000
        })
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'STOP_TIMERS',
            timers: ['TIMER1']
        })
        expect(dispatches[2].isPlainObject()).toBe(true)
        expect(dispatches[2].getAction()).toEqual({
            type: 'REPEAT_TIMERS',
            timers: ['TIMER2']
        })
        expect(dispatches[3].isFunction()).toBe(true)
        expect(dispatches[3].getName()).toEqual('resetTimeout')
    })

    it('should dispatch a STOP_TIMER action and execute the payload function on an executable entry', () => {
        const mock1 = jest.fn()
        const executableState = reduce(existingState, { type: 'SET_TIMERS', timers: [{ id: 'TIMER1', execute: mock1 }]})

        const dispatches = Thunk(tick).withState(executableState).execute(StarWars+1500)

        expect(dispatches.length).toBe(3)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'TICK',
            time: StarWars + 1500
        })
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'STOP_TIMERS',
            timers: ['TIMER1']
        })
        expect(dispatches[2].isFunction()).toBe(true)
        expect(dispatches[2].getName()).toEqual('resetTimeout')
        expect(mock1).toHaveBeenCalledTimes(1)
    })

    it('should execute payloads on mixed repeat and non-repeat entries', () => {
        const mock1 = jest.fn()
        const mock2 = jest.fn()
        const executableState = reduce(existingState, 
            { type: 'SET_TIMERS', timers: [
                    { id: 'TIMER1', execute: mock1 },
                    { id: 'TIMER2', execute: mock2, repeating: true },
            ]}
        )

        const dispatches = Thunk(tick).withState(executableState).execute(StarWars + 10000)

        expect(dispatches.length).toBe(4)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'TICK',
            time: StarWars + 10000
        })
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'STOP_TIMERS',
            timers: ['TIMER1']
        })
        expect(dispatches[2].isPlainObject()).toBe(true)
        expect(dispatches[2].getAction()).toEqual({
            type: 'REPEAT_TIMERS',
            timers: ['TIMER2']
        })
        expect(dispatches[3].isFunction()).toBe(true)
        expect(dispatches[3].getName()).toEqual('resetTimeout')
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock2).toHaveBeenCalledTimes(1)
    })
    
})

describe('store/actions/timers/startTimer', () => {

    it('should dispatch just a START_TIMER, if moment is close to lastTick', () => {
        const dispatches = Thunk(startTimer).withState(existingState).execute({ id: 'TIMER1', moment: StarWars+20 })

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'START_TIMER',
            id: 'TIMER1'
        })
    })

    it('should dispatch a tick and a START_TIMER, if moment is far from lastTick', () => {
        const dispatches = Thunk(startTimer).withState(existingState).execute({ id: 'TIMER1', moment: StarWars+200 })

        expect(dispatches.length).toBe(2)
        expect(dispatches[0].isFunction()).toBe(true)
        expect(dispatches[0].getName()).toEqual('tick')
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'START_TIMER',
            id: 'TIMER1'
        })
    })
    
})