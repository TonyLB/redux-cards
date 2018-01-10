import assert from 'assert'

export const cardLocation = (state, card) => {
    const stackList = Object.entries(state.stacks.byId)
        .filter(([key, stack]) => (
            stack.cards.some(stackCard => (stackCard === card))
        ))
        .map(([key]) => (key))
    assert(stackList.length <= 1)
    if (stackList.length) {
        return stackList[0]
    }
    else {
        const trackList = Object.entries(state.tracks.byId)
            .filter(([key, track]) => (
                track.cards.some(trackCard => (trackCard === card))
            ))
            .map(([key]) => (key))
        assert(trackList.length <= 1)
        return trackList.length ? trackList[0] : ''
    }

}