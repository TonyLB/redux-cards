const settings = (state = {}, action = { type: 'NULL' }) => {
    switch(action.type) {
        case 'CHANGE_SETTINGS':
            return Object.assign({ ...state }, action.changes)
        default:
            return state
    }
}

export default settings
