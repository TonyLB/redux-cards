import { connect } from 'react-redux'
import { resourceTotals } from '../state/hand'
import ResourceBar from '../components/ResourceBar'

const mapStateToProps = state => {
    return {
        resources: resourceTotals(state)
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

const ResourceBarContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps
)(ResourceBar)

export default ResourceBarContainer