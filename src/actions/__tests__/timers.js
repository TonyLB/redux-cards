import "babel-polyfill";
import { Thunk, FlushThunks } from 'redux-testkit'
import { setTimers, resetTimeout, tick, startTimer } from '../timers.js'
import { now } from '../../state/now'
import reduce from '../../reducers/testApp'

import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

jest.mock('../../state/now')

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

const emptyState = {
    timers: {
        byId: { },
        allIds: [ ],
        lastTick: StarWars,
        nextTimeoutId: null
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

    it('should setTimeout once, when setting a new timer from an empty state', () => {
        const dispatches = Thunk(resetTimeout).withState(
            reduce(emptyState, { type: 'START_TIMER', id: 'TIMER1', duration: 2500 })).execute()

        expect(dispatches.length).toBe(1)
        expect(dispatches[0].isPlainObject()).toBe(true)
        expect(dispatches[0].getAction()).toEqual({
            type: 'SET_TIMEOUT',
            timeoutId: 3
        })
        expect(clearTimeout).toHaveBeenCalledTimes(0)
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 2500)
            
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

    beforeEach(() => {
        jest.resetAllMocks()
        jest.useFakeTimers()
        jest.clearAllTimers()
    })

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

    it('should dispatch a tick and a START_TIMER, if moment is not specified (i.e. current)', () => {
        now.mockReturnValue(StarWars + 20000)

        const dispatches = Thunk(startTimer).withState(existingState).execute({ id: 'TIMER1' })

        expect(dispatches.length).toBe(2)
        expect(dispatches[0].isFunction()).toBe(true)
        expect(dispatches[0].getName()).toEqual('tick')
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'START_TIMER',
            id: 'TIMER1'
        })
        
    })

    it('should dispatch a tick, a START_TIMER, and a resetTimer, if moment is not specified with emptyState', () => {
        now.mockReturnValue(StarWars + 20000)

        const dispatches = Thunk(startTimer).withState(emptyState).execute({ id: 'TIMER1', duration: 2500 })

        expect(dispatches.length).toBe(3)
        expect(dispatches[0].isFunction()).toBe(true)
        expect(dispatches[0].getName()).toEqual('tick')
        expect(dispatches[1].isPlainObject()).toBe(true)
        expect(dispatches[1].getAction()).toEqual({
            type: 'START_TIMER',
            id: 'TIMER1',
            duration: 2500
        })
        expect(dispatches[2].isFunction()).toBe(true)
        expect(dispatches[2].getName()).toEqual('resetTimeout')
        
    })
    
})

describe('store/actions/timers/integration', () => {
    let flushThunks, store

    beforeEach(() => {
        jest.resetAllMocks()
        jest.useFakeTimers()
        jest.clearAllTimers()
        flushThunks = FlushThunks.createMiddleware()
        store = createStore(reduce, emptyState, applyMiddleware(flushThunks, thunk))
    })

    it('should start a timer at the present moment', async () => {
        await store.dispatch(startTimer({ id: 'TEST-TIMER', duration: 2500 }))
        await flushThunks.flush()

        const state = store.getState()

        expect(state.timers.allIds).toEqual(['TEST-TIMER'])
        expect(state.timers.byId['TEST-TIMER']).toEqual({
            id: 'TEST-TIMER',
            durationSpent: 0,
            durationRemaining: 2500
        })
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2500)
    })

    it('should execute payload after timers expire', () => {

        const mock1 = jest.fn()
        now.mockReturnValue(StarWars)

        store.dispatch(startTimer({ id: 'TEST-TIMER', duration: 2500, execute: mock1 }))
        flushThunks.flush()

        const state1 = store.getState()

        expect(state1.timers.allIds).toEqual(['TEST-TIMER'])
        expect(state1.timers.byId['TEST-TIMER']).toEqual({
            id: 'TEST-TIMER',
            durationSpent: 0,
            durationRemaining: 2500,
            execute: expect.any(Function)
        })
        expect(mock1).toHaveBeenCalledTimes(0)
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2500)

        now.mockReturnValue(StarWars + 2500)
        jest.runTimersToTime(2500)
        flushThunks.flush()

        const state2 = store.getState()

        expect(mock1).toHaveBeenCalledTimes(1)
        expect(state2.timers.allIds).toEqual(['TEST-TIMER'])
        expect(state2.timers.byId['TEST-TIMER']).toEqual({
            id: 'TEST-TIMER',
            durationSpent: null,
            durationRemaining: 2500,
            execute: expect.any(Function)
        })
        
    })

    it('should not execute payload until timers expire', () => {

        const mock1 = jest.fn()
        now.mockReturnValue(StarWars)

        store.dispatch(startTimer({ id: 'TEST-TIMER', duration: 2500, execute: mock1 }))
        flushThunks.flush()

        now.mockReturnValue(StarWars + 1500)
        jest.runTimersToTime(1500)
        flushThunks.flush()

        const state1 = store.getState()

        expect(mock1).toHaveBeenCalledTimes(0)
        expect(state1.timers.allIds).toEqual(['TEST-TIMER'])
        expect(state1.timers.byId['TEST-TIMER']).toEqual({
            id: 'TEST-TIMER',
            durationSpent: 0,
            durationRemaining: 2500,
            execute: expect.any(Function)
        })

        store.dispatch(tick())
        flushThunks.flush()

        const state2 = store.getState()

        expect(mock1).toHaveBeenCalledTimes(0)
        expect(state2.timers.allIds).toEqual(['TEST-TIMER'])
        expect(state2.timers.byId['TEST-TIMER']).toEqual({
            id: 'TEST-TIMER',
            durationSpent: 1500,
            durationRemaining: 1000,
            execute: expect.any(Function)
        })
        
    })

    it('should execute repeating payloads repeatedly', () => {

        const mock1 = jest.fn()
        now.mockReturnValue(StarWars)

        store.dispatch(startTimer({ id: 'TEST-TIMER', duration: 2500, execute: mock1, repeating: true }))
        flushThunks.flush()

        now.mockReturnValue(StarWars + 1500)
        jest.runTimersToTime(1500)
        flushThunks.flush()

        const state1 = store.getState()

        expect(mock1).toHaveBeenCalledTimes(0)
        expect(state1.timers.allIds).toEqual(['TEST-TIMER'])
        expect(state1.timers.byId['TEST-TIMER']).toEqual({
            id: 'TEST-TIMER',
            durationSpent: 0,
            durationRemaining: 2500,
            execute: expect.any(Function),
            repeating: true
        })

        now.mockReturnValue(StarWars + 3000)
        jest.runTimersToTime(1500)
        flushThunks.flush()
        now.mockReturnValue(StarWars + 6000)
        jest.runTimersToTime(3000)
        flushThunks.flush()

        const state2 = store.getState()

        expect(mock1).toHaveBeenCalledTimes(2)
        expect(state2.timers.allIds).toEqual(['TEST-TIMER'])
        expect(state2.timers.byId['TEST-TIMER']).toEqual({
            id: 'TEST-TIMER',
            durationSpent: 1000,
            durationRemaining: 1500,
            execute: expect.any(Function),
            repeating: true
        })
        
    })

    it('should execute interlacing payloads', () => {

        const mock1 = jest.fn()
        const mock2 = jest.fn()
        now.mockReturnValue(StarWars)

        store.dispatch(startTimer({ id: 'TEST-TIMER1', duration: 500, execute: mock1, repeating: true }))
        store.dispatch(startTimer({ id: 'TEST-TIMER2', duration: 600, execute: mock2 }))
        flushThunks.flush()

        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500)

        now.mockReturnValue(StarWars + 500)
        jest.runTimersToTime(500)
        flushThunks.flush()

        const state1 = store.getState()

        expect(mock1).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenCalledTimes(2)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 100)
        expect(mock2).toHaveBeenCalledTimes(0)
        expect(state1.timers.byId['TEST-TIMER1']).toEqual({
            id: 'TEST-TIMER1',
            durationSpent: 0,
            durationRemaining: 500,
            execute: expect.any(Function),
            repeating: true
        })
        expect(state1.timers.byId['TEST-TIMER2']).toEqual({
            id: 'TEST-TIMER2',
            durationSpent: 500,
            durationRemaining: 100,
            execute: expect.any(Function)
        })

        now.mockReturnValue(StarWars + 600)
        jest.runTimersToTime(100)
        flushThunks.flush()

        const state2 = store.getState()
        
        expect(mock1).toHaveBeenCalledTimes(1)
        expect(mock2).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenCalledTimes(3)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 400)
        expect(state2.timers.byId['TEST-TIMER1']).toEqual({
            id: 'TEST-TIMER1',
            durationSpent: 100,
            durationRemaining: 400,
            execute: expect.any(Function),
            repeating: true
        })
        expect(state2.timers.byId['TEST-TIMER2']).toEqual({
            id: 'TEST-TIMER2',
            durationSpent: null,
            durationRemaining: 600,
            execute: expect.any(Function)
        })

        now.mockReturnValueOnce(StarWars + 1000)
        now.mockReturnValue(StarWars + 1300)
        jest.runTimersToTime(700)
        flushThunks.flush()

        const state3 = store.getState()
        
        expect(mock1).toHaveBeenCalledTimes(2)
        expect(mock2).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenCalledTimes(4)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500)
        expect(state3.timers.lastTick).toEqual(StarWars + 1000)
        expect(state3.timers.byId['TEST-TIMER1']).toEqual({
            id: 'TEST-TIMER1',
            durationSpent: 0,
            durationRemaining: 500,
            execute: expect.any(Function),
            repeating: true
        })
        expect(state3.timers.byId['TEST-TIMER2']).toEqual({
            id: 'TEST-TIMER2',
            durationSpent: null,
            durationRemaining: 600,
            execute: expect.any(Function)
        })

        store.dispatch(tick())

        const state4 = store.getState()
        expect(mock1).toHaveBeenCalledTimes(2)
        expect(mock2).toHaveBeenCalledTimes(1)
        expect(setTimeout).toHaveBeenCalledTimes(4)
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 500)
        expect(state4.timers.lastTick).toEqual(StarWars + 1300)
        expect(state4.timers.byId['TEST-TIMER1']).toEqual({
            id: 'TEST-TIMER1',
            durationSpent: 300,
            durationRemaining: 200,
            execute: expect.any(Function),
            repeating: true
        })
        expect(state4.timers.byId['TEST-TIMER2']).toEqual({
            id: 'TEST-TIMER2',
            durationSpent: null,
            durationRemaining: 600,
            execute: expect.any(Function)
        })
        
    })
    
})