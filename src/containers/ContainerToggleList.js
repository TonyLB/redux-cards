import { connect } from 'react-redux'
import { switchToggle } from '../actions'
import ToggleList from '../components/ToggleList'

const mapStateToProps = state => {
    return {
        toggles: state.toggles
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onToggleClick: id => {
            dispatch(switchToggle(id))
        }
    }
}

const ContainerToggleList = connect(
    mapStateToProps,
    mapDispatchToProps
)(ToggleList)

export default ContainerToggleList