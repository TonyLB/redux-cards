import { connect } from 'react-redux'
import Board from '../components/Board'

const mapStateToProps = state => {
    return {
        trackId: state.hand.equipmentTrack,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
    }
}

const mergeProps = ( propsFromState, propsFromDispatch, ownProps ) => ({
    ...propsFromState,
    ...propsFromDispatch,
    ...ownProps
})

const BoardContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(Board)

export default BoardContainer