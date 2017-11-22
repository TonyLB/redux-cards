import track from './track'

const tracks = (state = { byId: {}, allIds: []}, action) => {
    let tempById = {}
    state.allIds.forEach((trackId) => {
        tempById[trackId] = track(state.byId[trackId], action)
    })
    return {
        ...state,
        byId: tempById
    }
}

export default tracks