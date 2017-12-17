import "babel-polyfill";
import { random, advanceRandom } from '../random'
import { Reducer } from 'redux-testkit'

const existingState = {
    values: [0.0, 0.2, 0.4, 0.6, 0.8],
    index: 3
}

describe('store/reducer/random', () => {
    it('should have an initial state', () => {
        expect(random()).toEqual({ values: [0.5], index:0 })
    })

    it('should not alter state', () => {
        Reducer(random)
            .expect({ type: 'NOT_SERVICED'})
            .toStayTheSame
    })

    it('should advance random', () => {
        expect(advanceRandom(
            existingState,
            { type: 'COMBINE_STACKS' },
            3
        )).toEqual({
            values: [0.0, 0.2, 0.4, 0.6, 0.8],
            index: 1                    
        })
    })

})